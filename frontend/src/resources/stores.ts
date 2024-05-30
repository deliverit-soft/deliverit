import { type Readable, readable, type Writable, writable, get } from 'svelte/store';
import mapboxgl from 'mapbox-gl';
import Directions, { type DirectionsService } from '@mapbox/mapbox-sdk/services/directions';
import type { Threebox } from 'threebox-plugin';
import type { City } from '$models/city.ts';

const storeToValue = <T>(store: Writable<T> | Readable<T>): T => get(store);

export const mapStore = writable<mapboxgl.Map>();
export const getMap = () => storeToValue(mapStore);

export const threebox = writable<Threebox>();
export const getThreebox = () => storeToValue(threebox);

export const directionsClient = readable<DirectionsService>(Directions({
    accessToken: import.meta.env.PUBLIC_MAPBOX_TOKEN,
}));
export const getDirectionsClient = () => storeToValue(directionsClient);

export const startCities = writable<City[]>([]);
export const citiesToTour = writable<City[]>([]);
