import './bootstrap';
import mapComponent from './map-component.js';

document.addEventListener('alpine:init', () => {
    Alpine.data('mapComponent', mapComponent);
});
