import type { Position } from 'geojson';
// @ts-ignore
import { distance } from '@turf/turf';

export const distanceBetween = (a: Position, b: Position) => distance(a, b, { units: 'meters' });
