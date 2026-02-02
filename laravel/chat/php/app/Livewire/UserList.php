<?php

namespace App\Livewire;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class UserList extends Component
{
    public function render()
    {
        $users = User::where('id', '!=', Auth::id())
            ->orderBy('name')
            ->get();
            
        return view('livewire.user-list', compact('users'));
    }
}
