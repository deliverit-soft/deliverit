import type { LngLatLike } from 'mapbox-gl';

export const DEFAULT_ZOOM = 5.75;
export const DEFAULT_CENTER: LngLatLike = [ 1.784164, 46.728015 ];
export const DEFAULT_BEARING = 0;
export const DEFAULT_PITCH = 0;

export const DEFAULT_POSITION = {
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    bearing: DEFAULT_BEARING,
    pitch: DEFAULT_PITCH,
};

export const PATHS_PACKAGES_COUNT = 5;
