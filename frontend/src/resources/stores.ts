import { type Readable, readable, type Writable, writable } from 'svelte/store';
import mapboxgl from 'mapbox-gl';
import Directions, { type DirectionsService } from '@mapbox/mapbox-sdk/services/directions';

const storeToValue = <T>(store: Writable<T> | Readable<T>): Promise<T> => new Promise<T>((resolve) => {
    const unsubscribe = store.subscribe(value => {
        resolve(value);
    });
    unsubscribe();
});

export const mapStore = writable<mapboxgl.Map>();
export const getMap = () => storeToValue(mapStore);

export const directionsClient = readable<DirectionsService>(Directions({
    accessToken: import.meta.env.PUBLIC_MAPBOX_TOKEN,
}));
export const getDirectionsClient = () => storeToValue(directionsClient);
