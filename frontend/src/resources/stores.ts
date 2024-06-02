import { type Readable, readable, type Writable, writable, get } from 'svelte/store';
import mapboxgl from 'mapbox-gl';
import Directions, { type DirectionsService } from '@mapbox/mapbox-sdk/services/directions';
import type { Threebox } from 'threebox-plugin';
import type { City } from '$models/city.ts';
import type { BinPackingResult } from '$models/bin-packing.ts';
import type { VrpResult } from '$models/vrp.ts';

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
export const getStartCities = () => storeToValue(startCities);

export const citiesToTour = writable<City[]>([]);
export const getCitiesToTour = () => storeToValue(citiesToTour);

export const binPackingResult = writable<BinPackingResult>();
export const getBinPackingResult = () => storeToValue(binPackingResult);

export const vrpResults = writable<VrpResult>();
export const getVrpResults = () => storeToValue(vrpResults);
