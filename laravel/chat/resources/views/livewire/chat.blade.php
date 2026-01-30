<div 
    x-data="{ 
        isOnline: {{ $user->isOnline() ? 'true' : 'false' }},
        scrollToBottom() {
            const el = document.getElementById('messages');
            if(el) { el.scrollTop = el.scrollHeight; }
        },
        initChat() {
            this.scrollToBottom();
            
            const channelName = 'chat.{{ collect([auth()->id(), $user->id])->sort()->implode('_') }}';
            const otherUserId = {{ $user->id }};

            console.log('🔌 Conectando a Presence Channel:', channelName);

            Echo.join(channelName)
                .here((users) => {
                    // Verificar si el otro usuario ya está aquí
                    console.log('👥 Usuarios en sala:', users);
                    this.isOnline = users.some(u => u.id === otherUserId);
                })
                .joining((user) => {
                    console.log('🟢 Usuario entró:', user.name);
                    if (user.id === otherUserId) {
                        this.isOnline = true;
                    }
                })
                .leaving((user) => {
                    console.log('🔴 Usuario salió:', user.name);
                    if (user.id === otherUserId) {
                        this.isOnline = false;
                    }
                })
                .listen('MessageSent', (e) => {
                    console.log('📩 Mensaje recibido:', e);
                    $wire.refreshMessages(); 
                    setTimeout(() => this.scrollToBottom(), 100);
                })
                .error((error) => {
                    console.error('❌ Error Echo:', error);
                });
        }
    }"
    x-init="initChat()"
    @message-sent.window="scrollToBottom()"
    class="relative h-[600px] flex flex-col border border-gray-200 rounded-xl overflow-hidden"
>
    {{-- Header con Estado del Usuario --}}
    <div class="bg-white p-4 border-b border-gray-200 flex items-center justify-between shadow-sm z-10">
        <div class="flex items-center gap-3">
            {{-- Avatar del Usuario --}}
            <img 
                src="https://ui-avatars.com/api/?name={{ urlencode($user->name) }}&color=7F9CF5&background=EBF4FF" 
                alt="{{ $user->name }}" 
                class="h-10 w-10 rounded-full"
            >
            <div>
                <h3 class="text-lg font-bold text-gray-800 leading-tight">
                    {{ $user->name }}
                </h3>
                <div class="flex items-center">
                    {{-- Indicador Online (Controlado por Alpine.js) --}}
                    <span x-show="isOnline" class="flex items-center transition-opacity duration-300">
                        <span class="h-2.5 w-2.5 bg-green-500 rounded-full inline-block mr-1.5 animate-pulse"></span>
                        <span class="text-xs text-green-600 font-medium">En línea ahora</span>
                    </span>

                    {{-- Indicador Offline --}}
                    <span x-show="!isOnline" class="flex items-center transition-opacity duration-300" style="display: none;">
                        <span class="h-2.5 w-2.5 bg-gray-400 rounded-full inline-block mr-1.5"></span>
                        <span class="text-xs text-gray-500">
                            Offline 
                            @if($user->last_seen_at)
                                • {{ $user->last_seen_at->shortAbsoluteDiffForHumans() }}
                            @endif
                        </span>
                    </span>
                </div>
            </div>
        </div>
    </div>

    {{-- Área de Mensajes --}}
    <div id="messages" class="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3 scroll-smooth">
        @forelse ($messages as $message)
            <div class="flex w-full {{ $message->from_user_id == auth()->id() ? 'justify-end' : 'justify-start' }}">
                <div class="flex max-w-[80%] md:max-w-[70%] gap-2 {{ $message->from_user_id == auth()->id() ? 'flex-row-reverse' : 'flex-row' }}">
                    
                    {{-- Avatar Pequeño en mensaje --}}
                    <img 
                        src="https://ui-avatars.com/api/?name={{ urlencode($message->sender->name) }}&color={{ $message->from_user_id == auth()->id() ? '7F9CF5' : 'CBD5E0' }}&background={{ $message->from_user_id == auth()->id() ? 'EBF4FF' : 'F7FAFC' }}&size=32" 
                        alt="{{ $message->sender->name }}" 
                        class="h-8 w-8 rounded-full self-end mb-1 shadow-sm"
                    >

                    <div class="px-4 py-2 rounded-2xl shadow-sm relative group {{ $message->from_user_id == auth()->id() ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm' }}">
                        <p class="text-sm leading-relaxed">{{ $message->content }}</p>
                        <div class="text-[10px] mt-1 opacity-70 text-right">
                            {{ $message->created_at->format('H:i') }}
                        </div>
                    </div>
                </div>
            </div>
        @empty
            <div class="flex flex-col items-center justify-center h-full text-gray-400">
                <div class="bg-gray-100 p-4 rounded-full mb-3">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                </div>
                <p>No hay mensajes aún.</p>
                <p class="text-sm">¡Sé el primero en saludar!</p>
            </div>
        @endforelse
    </div>

    {{-- Formulario de Envío --}}
    <div class="bg-white p-4 border-t border-gray-200">
        <form wire:submit.prevent="sendMessage" class="flex items-center gap-2">
            <input 
                wire:model="content" 
                type="text" 
                class="flex-grow border-gray-300 rounded-full py-2.5 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50" 
                placeholder="Escribe un mensaje..." 
                required
            >
            <button 
                type="submit" 
                class="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                wire:loading.attr="disabled"
                @click="setTimeout(() => scrollToBottom(), 100)"
            >
                <svg wire:loading.remove class="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                <svg wire:loading class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            </button>
        </form>
    </div>

    {{-- Script: El manejo de conexión ahora se hace dentro de initChat() en Alpine --}}
</div>