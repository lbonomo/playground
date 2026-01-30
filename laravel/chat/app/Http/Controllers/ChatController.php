<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    /**
     * Show the dashboard with a list of users.
     */
    public function index()
    {
        $users = User::where('id', '!=', Auth::id())->get();
        return view('chat.index', compact('users'));
    }

    /**
     * Show the chat conversation with a user.
     */
    public function show(User $user)
    {
        // Get messages between the current user and the selected user
        $messages = Message::where(function ($query) use ($user) {
            $query->where('from_user_id', Auth::id())
                  ->where('to_user_id', $user->id);
        })->orWhere(function ($query) use ($user) {
            $query->where('from_user_id', $user->id)
                  ->where('to_user_id', Auth::id());
        })
        ->orderBy('created_at', 'asc')
        ->get();

        return view('chat.show', compact('user', 'messages'));
    }

    /**
     * Store a newly created message in storage.
     */
    public function store(Request $request, User $user)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        Message::create([
            'from_user_id' => Auth::id(),
            'to_user_id' => $user->id,
            'content' => $request->content,
        ]);

        return redirect()->route('chat.show', $user);
    }
}