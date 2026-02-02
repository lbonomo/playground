<?php

namespace App\Livewire;

use App\Events\MessageSent;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class Chat extends Component
{
    public User $user;
    public $content = '';

    public function mount(User $user)
    {
        $this->user = $user;
    }

    // Definir los listeners para Echo


    public function refreshMessages()
    {
        // Livewire automáticamente recargará la vista al llamar a este método vacío
        // porque disparará un render().
    }

    public function sendMessage()
    {
        $this->validate([
            'content' => 'required|string|max:1000',
        ]);

        $message = Message::create([
            'from_user_id' => Auth::id(),
            'to_user_id' => $this->user->id,
            'content' => $this->content,
        ]);

        // Emitir el evento inmediatamente
        // Dispatch event so frontend can signal the WebSocket server
        $this->dispatch('message-sent-to-db');

        $this->content = '';
    }

    public function render()
    {
        // Obtener mensajes entre el usuario autenticado y el usuario seleccionado
        $messages = Message::with('sender')
            ->where(function ($query) {
                $query->where('from_user_id', Auth::id())
                    ->where('to_user_id', $this->user->id);
            })->orWhere(function ($query) {
                $query->where('from_user_id', $this->user->id)
                    ->where('to_user_id', Auth::id());
            })
            ->orderBy('created_at', 'asc')
            ->get();

        return view('livewire.chat', compact('messages'));
    }
}