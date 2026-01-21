<div class="flex flex-col h-screen">
    <!-- Map Section (50vh) -->
    <div class="h-[50vh] w-full z-10 relative" x-data="{
            map: null,
            lat: @entangle('latitude'),
            lng: @entangle('longitude'),
            zoom: @entangle('zoom'),
            points: @entangle('points'),
            markers: {}, // Object keyed by ID
            initMap() {
                if (this.map) return;
                
                let initialLat = this.lat || -34.603722;
                let initialLng = this.lng || -58.381592;
                let initialZoom = this.zoom || 13;

                this.map = L.map(this.$refs.map).setView([initialLat, initialLng], initialZoom);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '© OpenStreetMap'
                }).addTo(this.map);

                // Initial load
                this.updateMarkers(this.points);

                // Initial geolocation check
                this.locateMe();

                // Watch for changes in points
                this.$watch('points', (value) => {
                    this.updateMarkers(value);
                });

                this.map.on('moveend', () => {
                   let center = this.map.getCenter();
                   let zoom = this.map.getZoom();
                   $wire.updateMapCenter(center.lat, center.lng, zoom);
                });
            },
            locateMe() {
                if (!navigator.geolocation) {
                    this.locateByIP();
                    return;
                }

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        let lat = position.coords.latitude;
                        let lng = position.coords.longitude;
                        this.updateLocation(lat, lng, 16);
                    },
                    (error) => {
                        console.warn('Geolocation API failed, attempting IP fallback:', error);
                        this.locateByIP();
                    },
                    {
                        enableHighAccuracy: false,
                        timeout: 10000,
                        maximumAge: 0
                    }
                );
            },
            locateByIP() {
                fetch('https://ipapi.co/json/')
                    .then(response => response.json())
                    .then(data => {
                        if (data.latitude && data.longitude) {
                            this.updateLocation(data.latitude, data.longitude, 16);
                            console.log('Location found via IP');
                        } else {
                            throw new Error('Invalid data from IP API');
                        }
                    })
                    .catch(err => {
                        console.error('IP Location failed:', err);
                        alert('Could not determine your location. Please check your browser settings.');
                    });
            },
            updateLocation(lat, lng, zoom) {
                 this.map.flyTo([lat, lng], zoom);
                 this.lat = lat;
                 this.lng = lng;
                 $wire.updateMapCenter(lat, lng, zoom);
            },
            updateMarkers(points) {
                // Clear existing markers
                Object.values(this.markers).forEach(marker => this.map.removeLayer(marker));
                this.markers = {};

                if (!points) return;

                // Add new markers
                points.forEach(point => {
                    if (!point) return; // Skip null points

                    let icon = L.divIcon({
                        className: 'bg-transparent border-none',
                        html: `<div class='marker-pin text-indigo-600 drop-shadow-md'>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' class='w-10 h-10'>
            <path fill-rule='evenodd'
                d='M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z'
                clip-rule='evenodd' />
        </svg>
    </div>`,
                        iconSize: [40, 40],
                        iconAnchor: [20, 40],
                        popupAnchor: [0, -40]
                    });

    let marker = L.marker([point.latitude, point.longitude], { icon: icon })
    .addTo(this.map)
    .bindPopup(`<b>${point.name}</b><br>${point.description || ''}`);

    this.markers[point.id] = marker;
    });
    },
    focusPoint(data) {
    let id = data.id;
    let point = this.points.find(p => p.id === id);
    if (point && this.markers[id]) {
    this.map.flyTo([point.latitude, point.longitude], 15);
    this.markers[id].openPopup();
    }
    },
    hoverPoint(data) {
    let id = data.id;
    if (this.markers[id]) {
    let el = this.markers[id].getElement();
    if (el) {
    let pin = el.querySelector('.marker-pin');
    if (pin) pin.classList.add('animate-bounce');
    }
    }
    },
    unhoverPoint(data) {
    let id = data.id;
    if (this.markers[id]) {
    let el = this.markers[id].getElement();
    if (el) {
    let pin = el.querySelector('.marker-pin');
    if (pin) pin.classList.remove('animate-bounce');
    }
    }
    }
    }" x-init="initMap()" @focus-point.window="focusPoint($event.detail)"
        @hover-point.window="hoverPoint($event.detail)" @unhover-point.window="unhoverPoint($event.detail)" wire:ignore>
        <div x-ref="map" class="h-full w-full z-0"></div>

        <!-- Center Crosshair -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[500] pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600 drop-shadow-md opacity-60"
                viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
            </svg>
        </div>

        <!-- Locate Me Button -->
        <button @click="locateMe()"
            class="absolute top-4 right-4 z-[9999] bg-white p-2 rounded-lg shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Locate Me">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-6 h-6 text-gray-700">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
        </button>
    </div>

    <!-- Content Section -->
    <div class="flex-1 bg-zinc-50 overflow-auto relative">
        <div
            class="absolute -top-10 left-0 right-0 h-10 bg-gradient-to-t from-zinc-50 to-transparent pointer-events-none z-20">
        </div>

        <div class="max-w-[1080px] mx-auto p-6 md:p-8">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-3xl font-bold text-zinc-900 tracking-tight">Explore Points of Interest</h2>
                    <p class="text-zinc-500 mt-1">Discover the nearest locations as you navigate the map.</p>
                </div>
                <div
                    class="text-sm px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full font-medium border border-indigo-100">
                    Showing {{ count($points) }} results
                </div>
            </div>

            <div
                class="bg-white rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100 overflow-hidden ring-1 ring-zinc-100/50">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-zinc-100">
                        <thead class="bg-zinc-50/50">
                            <tr>
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                    Name & Description</th>
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                    Coordinates</th>
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                    Distance</th>
                                <th
                                    class="px-6 py-4 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                    Action</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-zinc-100 bg-white">
                            @forelse($points as $point)
                                <tr class="group hover:bg-indigo-50/30 transition-all duration-200 cursor-pointer" x-data
                                    @click="$dispatch('focus-point', { id: '{{ $point['id'] }}' })"
                                    @mouseenter="$dispatch('hover-point', { id: '{{ $point['id'] }}' })"
                                    @mouseleave="$dispatch('unhover-point', { id: '{{ $point['id'] }}' })">
                                    <td class="px-6 py-4">
                                        <div class="flex items-center">
                                            <div
                                                class="h-10 w-10 flex-shrink-0 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mr-4">
                                                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div
                                                    class="text-sm font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                                                    {{ $point['name'] }}
                                                </div>
                                                <div class="text-sm text-zinc-500 mt-0.5 line-clamp-1">
                                                    {{ $point['description'] }}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div
                                            class="text-sm text-zinc-600 font-mono bg-zinc-100 px-2 py-1 rounded-md inline-block">
                                            {{ number_format($point['latitude'], 4) }},
                                            {{ number_format($point['longitude'], 4) }}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {{ number_format($point['distance'], 2) }} km
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            class="text-indigo-600 hover:text-indigo-900 group-hover:translate-x-1 transition-transform">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M9 5l7 7-7 7"></path>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="4" class="px-6 py-12 text-center text-zinc-500">
                                        <div class="flex flex-col items-center justify-center space-y-3">
                                            <svg class="h-12 w-12 text-zinc-300" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p class="font-medium">No points of interest found in this area.</p>
                                            <p class="text-sm text-zinc-400">Try moving the map to a different location.</p>
                                        </div>
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>