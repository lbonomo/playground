export default (entangledLat, entangledLng, entangledZoom, entangledPoints) => ({
    map: null,
    lat: entangledLat,
    lng: entangledLng,
    zoom: entangledZoom,
    points: entangledPoints,
    markers: {}, // Object keyed by ID
    routingControl: null,

    initMap() {
        if (this.map) return;

        let initialLat = -34.5891884;
        let initialLng = -63.2622866;
        let initialZoom = 6;

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
            // Use $wire provided magically by Livewire/Alpine integration
            this.$wire.updateMapCenter(center.lat, center.lng, zoom);
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
            }, {
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
        this.$wire.updateMapCenter(lat, lng, zoom);
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

            let marker = L.marker([point.latitude, point.longitude], {
                icon: icon
            })
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
            // this.calculateRoute(point.latitude, point.longitude);
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
    },

    calculateRoute(destLat, destLng) {
        if (!this.lat || !this.lng) {
            alert('Please enable location services to see the route.');
            return;
        }

        if (this.routingControl) {
            this.map.removeControl(this.routingControl);
        }

        this.routingControl = L.Routing.control({
            waypoints: [
                L.latLng(this.lat, this.lng),
                L.latLng(destLat, destLng)
            ],
            router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1'
            }),
            lineOptions: {
                styles: [{
                    color: '#6366f1',
                    opacity: 0.8,
                    weight: 6
                }]
            },
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false,
        }).addTo(this.map);
    }
});
