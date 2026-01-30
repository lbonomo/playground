<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Canal para el chat privado entre dos usuarios (Presence Channel)
Broadcast::channel('chat.{id1}_{id2}', function ($user, $id1, $id2) {
    Log::info("Intento de auth en canal chat.{$id1}_{id2} por usuario {$user->id}");
    
    // Permitir acceso solo si el usuario autenticado es uno de los dos IDs
    $authorized = (int) $user->id === (int) $id1 || (int) $user->id === (int) $id2;
    Log::info("Autorización: " . ($authorized ? 'Aprobada' : 'Denegada'));
    
    if ($authorized) {
        return ['id' => $user->id, 'name' => $user->name];
    }
    
    return false;
});

// Canal global para estado en línea de todos los usuarios
Broadcast::channel('online', function ($user) {
    return ['id' => $user->id, 'name' => $user->name];
});