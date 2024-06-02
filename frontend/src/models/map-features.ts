import mapboxgl from 'mapbox-gl';
import type { Feature } from 'geojson';
// @ts-ignore
import type { GeoJSONObject, LineString } from '@turf/turf';

export interface MapFeatures {
    packagesMarkers: mapboxgl.Marker[][];
    straightLines: Feature<LineString, GeoJSONObject>[][];
    realPaths: Feature<LineString, GeoJSONObject>[][];
    colors: string[];
}

export const DEFAULT_MAP_FEATURES: MapFeatures = {
    packagesMarkers: [],
    straightLines: [],
    realPaths: [],
    colors: [],
};
