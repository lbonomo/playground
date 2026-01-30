<div 
    x-data="{
        onlineUserIds: [],
        init() {
            console.log('🌍 Conectando a canal global: online');
            
            Echo.join('online')
                .here((users) => {
                    this.onlineUserIds = users.map(u => u.id);
                    console.log('👥 Usuarios online iniciales:', this.onlineUserIds);
                })
                .joining((user) => {
                    console.log('🟢 Usuario conectado:', user.name);
                    if (!this.onlineUserIds.includes(user.id)) {
                        this.onlineUserIds.push(user.id);
                    }
                })
                .leaving((user) => {
                    console.log('🔴 Usuario desconectado:', user.name);
                    this.onlineUserIds = this.onlineUserIds.filter(id => id !== user.id);
                })
                .error((error) => {
                    console.error('❌ Error en canal online:', error);
                });
        },
        isUserOnline(userId) {
            return this.onlineUserIds.includes(userId);
        }
    }"
    class="bg-white overflow-hidden shadow-sm sm:rounded-lg"
>
    <div class="p-6 text-gray-900">
        <h3 class="text-lg font-medium mb-6 flex items-center gap-2">
            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            Selecciona un usuario para chatear
        </h3>
        
        <ul class="divide-y divide-gray-100">
            @foreach ($users as $user)
                <li class="py-4 hover:bg-gray-50 transition duration-150 px-4 rounded-lg -mx-4 group">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-4">
                            <div class="relative">
                                <img 
                                    src="https://ui-avatars.com/api/?name={{ urlencode($user->name) }}&color=7F9CF5&background=EBF4FF" 
                                    alt="{{ $user->name }}" 
                                    class="h-12 w-12 rounded-full object-cover shadow-sm group-hover:shadow-md transition"
                                >
                                {{-- Indicador de Estado (Overlay) --}}
                                <span 
                                    x-show="isUserOnline({{ $user->id }})"
                                    class="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full ring-2 ring-white bg-green-500"
                                    x-transition:enter="transition ease-out duration-300"
                                    x-transition:enter-start="transform opacity-0 scale-50"
                                    x-transition:enter-end="transform opacity-100 scale-100"
                                    x-transition:leave="transition ease-in duration-300"
                                    x-transition:leave-start="transform opacity-100 scale-100"
                                    x-transition:leave-end="transform opacity-0 scale-50"
                                ></span>
                            </div>

                            <div>
                                <span class="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">{{ $user->name }}</span>
                                <div class="flex items-center text-sm">
                                    {{-- Texto dinámico basado en estado --}}
                                    <template x-if="isUserOnline({{ $user->id }})">
                                        <span class="text-green-600 font-medium flex items-center">
                                            En línea ahora
                                        </span>
                                    </template>
                                    <template x-if="!isUserOnline({{ $user->id }})">
                                        <span class="text-gray-500">
                                            @if($user->last_seen_at)
                                                Visto {{ $user->last_seen_at->diffForHumans() }}
                                            @else
                                                Desconectado
                                            @endif
                                        </span>
                                    </template>
                                </div>
                            </div>
                        </div>

                        <a href="{{ route('chat.show', $user) }}" class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150 group-hover:border-blue-300 group-hover:text-blue-600">
                            Chatear
                            <svg class="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                        </a>
                    </div>
                </li>
            @endforeach
        </ul>
    </div>
</div>
