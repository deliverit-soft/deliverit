import type { Position } from 'geojson';
import { getDirectionsClient } from '../resources/stores.ts';
// @ts-ignore
import { distance, lineDistance } from '@turf/turf';

export const distanceBetween = (a: Position, b: Position) => distance(a, b, { units: 'meters' });

export const pathLength = (path: Position[]) => lineDistance(
    { type: 'LineString', coordinates: path },
    { units: 'meters' },
);

export async function getRoute(path: Position[]): Promise<Position[]> {
    const directionsClient = await getDirectionsClient();

    const route = await directionsClient.getDirections({
        waypoints: path.map(coordinates => ({ coordinates: coordinates as [number, number] })),
        profile: 'driving',
        geometries: 'geojson',
        overview: 'full',
    }).send();

    if (route.body.code !== 'Ok' || route.body.routes.length < 1)
        throw new Error(`Failed to get route: ${route.body.code}, ${route.body.routes.length} routes found.`);

    return route.body.routes[0]!.geometry.coordinates as Position[];
}
