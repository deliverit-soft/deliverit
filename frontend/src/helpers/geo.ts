import type { Position } from 'geojson';
import { getDirectionsClient } from '../resources/stores.ts';
// @ts-ignore
import { distance, lineDistance, lineChunk, type LineString, lineString, lineSliceAlong, along, bearing } from '@turf/turf';

export const distanceBetween = (a: Position, b: Position) => distance(a, b, { units: 'meters' });

export const pathLength = (path: Position[]) => lineDistance(
    { type: 'LineString', coordinates: path },
    { units: 'meters' },
);

export async function getRoute(path: Position[]): Promise<Position[]> {
    const route = await getDirectionsClient().getDirections({
        waypoints: path.map(coordinates => ({ coordinates: coordinates as [ number, number ] })),
        profile: 'driving',
        geometries: 'geojson',
        overview: 'full',
    }).send();

    if (route.body.code !== 'Ok' || route.body.routes.length < 1)
        throw new Error(`Failed to get route: ${route.body.code}, ${route.body.routes.length} routes found.`);

    return route.body.routes[0]!.geometry.coordinates as Position[];
}

export const chunkPath = (path: Position[], maxLen: number) =>
    lineChunk(
        lineString(path),
        maxLen,
        { units: 'meters' },
    )
        .features
        .map((chunk: LineString) => chunk.geometry.coordinates[0] as Position[]);

export const sliceAlongPath = (path: Position[], start: number, end: number) =>
    lineSliceAlong(
        lineString(path),
        start,
        end,
        { units: 'meters' },
    ).geometry.coordinates as Position[];

export const alongPath = (path: Position[], distance: number) =>
    along(
        lineString(path),
        distance,
        { units: 'meters' },
    ).geometry.coordinates as Position;

export const pathBearing = (path: Position[], distance: number) => bearing(
    alongPath(path, distance),
    alongPath(path, distance + 5),
);
