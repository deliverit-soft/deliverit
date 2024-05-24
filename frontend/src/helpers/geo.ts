import type { Position } from 'geojson';
// @ts-ignore
import { distance, lineDistance } from '@turf/turf';

export const distanceBetween = (a: Position, b: Position) => distance(a, b, { units: 'meters' });

export const pathLength = (path: Position[]) => lineDistance({ type: 'LineString', coordinates: path }, { units: 'meters' })
