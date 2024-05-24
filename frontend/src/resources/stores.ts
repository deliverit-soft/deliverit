import { readable, writable } from 'svelte/store';
import mapboxgl from 'mapbox-gl';
import Directions, { type DirectionsService } from '@mapbox/mapbox-sdk/services/directions';

export const mapStore = writable<mapboxgl.Map>();

export const getMap = () => new Promise<mapboxgl.Map>((resolve) => {
    const unsubscribe = mapStore.subscribe(value => {
        resolve(value);
    });
    unsubscribe();
});

export const directionsClient = readable<DirectionsService>(Directions({
    accessToken: import.meta.env.PUBLIC_MAPBOX_TOKEN,
}));

export const getDirectionsClient = () => new Promise<DirectionsService>((resolve) => {
    const unsubscribe = directionsClient.subscribe(value => {
        resolve(value);
    });
    unsubscribe();
});
