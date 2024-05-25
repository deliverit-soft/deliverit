import { getMap } from '../resources/stores.ts';
import type { Feature, Position } from 'geojson';
import mapboxgl from 'mapbox-gl';

export async function drawLine(
    coordinates: Position[],
    paint: mapboxgl.LinePaint = {
        'line-color': '#000',
        'line-width': 2,
    },
): Promise<Feature> {
    const map = await getMap();
    const id = `line-${Math.random()}`;

    const line: Feature = {
        type: 'Feature',
        properties: {
            id,
        },
        geometry: {
            type: 'LineString',
            coordinates,
        },
    };

    map.addSource(id, {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: [ line ],
        },
    });

    map.addLayer({
        id,
        type: 'line',
        source: id,
        layout: {
            'line-join': 'round',
            'line-cap': 'round',
        },
        paint,
    }, 'building-extrusion');

    return line;
}
