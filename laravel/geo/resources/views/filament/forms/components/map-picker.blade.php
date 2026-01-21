<x-dynamic-component :component="$getFieldWrapperView()" :field="$field">
    <div x-data="{
            state: $wire.$entangle('{{ $getStatePath() }}'),
            lat: $wire.$entangle('{{ \Illuminate\Support\Str::beforeLast($getStatePath(), '.') . '.' . $getLatitudeField() }}'),
            lng: $wire.$entangle('{{ \Illuminate\Support\Str::beforeLast($getStatePath(), '.') . '.' . $getLongitudeField() }}'),
            map: null,
            marker: null,
            initMap() {
                if (this.map) return;

                // Load Leaflet CSS and JS
                if (!document.getElementById('leaflet-css')) {
                    const link = document.createElement('link');
                    link.id = 'leaflet-css';
                    link.rel = 'stylesheet';
                    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                    document.head.appendChild(link);
                }

                if (!window.L) {
                    const script = document.createElement('script');
                    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                    script.onload = () => {
                         this.renderMap();
                    };
                    document.head.appendChild(script);
                } else {
                    this.renderMap();
                }
            },
            renderMap() {
                 let initialLat = (this.lat && this.lat !== 0) ? parseFloat(this.lat) : -34.603722;
                 let initialLng = (this.lng && this.lng !== 0) ? parseFloat(this.lng) : -58.381592;
                 let zoom = (this.lat && this.lng) ? 13 : 13;

                 this.map = L.map(this.$refs.map).setView([initialLat, initialLng], zoom);

                 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '© OpenStreetMap'
                }).addTo(this.map);

                if (this.lat && this.lng) {
                    this.marker = L.marker([this.lat, this.lng]).addTo(this.map);
                }

                this.map.on('click', (e) => {
                    this.updateMarker(e.latlng.lat, e.latlng.lng);
                });

                this.$watch('lat', (value) => {
                    if (value && this.lng) {
                        let l = parseFloat(value);
                        let ln = parseFloat(this.lng);
                        if (!isNaN(l) && !isNaN(ln)) {
                            this.updateMarker(l, ln);
                            this.map.setView([l, ln], this.map.getZoom());
                        }
                    }
                });

                this.$watch('lng', (value) => {
                    if (this.lat && value) {
                         let l = parseFloat(this.lat);
                         let ln = parseFloat(value);
                         if (!isNaN(l) && !isNaN(ln)) {
                            this.updateMarker(l, ln);
                            this.map.setView([l, ln], this.map.getZoom());
                         }
                    }
                });
            },
            updateMarker(lat, lng) {
                if (this.marker) {
                    this.marker.setLatLng([lat, lng]);
                } else {
                    this.marker = L.marker([lat, lng]).addTo(this.map);
                }
                
                this.lat = lat;
                this.lng = lng;
            }
        }" x-init="initMap()" wire:ignore>
        <div x-ref="map" style="height: 400px; width: 100%; border-radius: 0.5rem; z-index: 1;"></div>
    </div>
</x-dynamic-component>