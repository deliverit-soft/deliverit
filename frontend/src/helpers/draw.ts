import { getMap } from '../resources/stores.ts';
import type { Feature, Position } from 'geojson';
import mapboxgl, { type LngLatLike } from 'mapbox-gl';
import type { VrpTravelCity } from '$models/vrp.ts';

export function drawLine(
    coordinates: Position[],
    paint: mapboxgl.LinePaint = {
        'line-color': '#000',
        'line-width': 2,
    },
): Feature {
    const map = getMap();
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


export function placeMarker(pos: LngLatLike, model: 'archive' | 'truck' | null = null, color?: string) {
    const map = getMap();
    let element: HTMLElement | undefined;

    if (model) {
        element = document.querySelector(`.icons .${model}-icon`) as HTMLElement;
        element = element.cloneNode(true) as HTMLElement;
        if (color)
            element.style.borderColor = color;
    }

    return new mapboxgl.Marker({
        element,
        color,
    })
        .setLngLat(pos)
        .addTo(map);
}


export function* colorGenerator(nuances: number) {
    for (let i = 0; i < nuances; i++) {
        yield `hsl(${Math.floor(i * 360 / nuances)}, 100%, 50%)`;
    }
}


export function drawVrpSolution(solution: VrpTravelCity[][]) {
    // Draw paths
    const colorGen = colorGenerator(solution.length);
    for (const path of solution) {
        const color = colorGen.next().value!;
        drawLine(
            path.map(value => ([ value.lon, value.lat ]) as Position),
            {
                'line-color': color,
                'line-width': 3,
            },
        );

        for (const city of path) {
            placeMarker([ city.lon, city.lat ], 'archive', color);
        }
    }

    // Draw start points
    solution
        .map(trajectory => trajectory[0])
        .reduce((acc, city) => {
            if (!acc.find(c => c.insee === city!.insee))
                acc.push(city!);
            return acc;
        }, new Array<VrpTravelCity>())
        .forEach(city => placeMarker([ city.lon, city.lat ]));
}
