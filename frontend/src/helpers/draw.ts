import { getMap, getMapFeatures, mapFeatures as mapFeaturesStore } from '../resources/stores.ts';
import type { Feature, Position } from 'geojson';
import mapboxgl, { type LngLatLike } from 'mapbox-gl';
import type { VrpTravelCity } from '$models/vrp.ts';
import { chunkifyPath, wait } from '$helpers/utils.ts';
import { MAP_DRAW_DURATION, PATHS_PACKAGES_COUNT } from '$resources/defaults.ts';
import { DEFAULT_MAP_FEATURES } from '$models/map-features.ts';

export function drawLine(
    coordinates: Position[],
    paint: mapboxgl.LinePaint = {
        'line-color': '#000',
        'line-width': 2,
    },
): Feature {
    const map = getMap();
    const id = `line-${Math.random().toString().slice(2)}`;

    const line: Feature = {
        type: 'Feature',
        properties: {
            id,
            paint,
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


export function removeLine(line: Feature) {
    const map = getMap();
    map.removeLayer(line.properties!.id);
    map.removeSource(line.properties!.id);
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


interface VrpTruckFeatures {
    color: string;
    chunks: Position[][];
    packages: VrpTravelCity[];
}


export async function drawVrpSolution(solution: VrpTravelCity[][]) {
    // Draw paths
    const colorGen = colorGenerator(solution.length);
    const mapFeatures = getMapFeatures();
    mapFeaturesStore.set(DEFAULT_MAP_FEATURES);

    const vrpFeatures: VrpTruckFeatures[] = [];
    let drawCalls = 0;

    for (const truckStopCities of solution) {
        const color = colorGen.next().value!;
        const path = truckStopCities.map(value => ([ value.lon, value.lat ]) as Position);
        const chunkedPath = chunkifyPath(path, PATHS_PACKAGES_COUNT);

        vrpFeatures.push({
            color,
            chunks: chunkedPath,
            packages: truckStopCities,
        });
        drawCalls += chunkedPath.length + truckStopCities.length;
    }

    for (const { color, chunks, packages } of vrpFeatures) {
        const straightLines: Feature[] = [];
        const packagesMarkers: mapboxgl.Marker[] = [];

        for (const chunk of chunks) {
            const line = drawLine(
                chunk,
                {
                    'line-color': color,
                    'line-width': 3,
                },
            );
            straightLines.push(line);
            await wait(MAP_DRAW_DURATION / drawCalls);
        }

        for (const city of packages) {
            const marker = placeMarker([ city.lon, city.lat ], 'archive', color);
            packagesMarkers.push(marker);
            await wait(MAP_DRAW_DURATION / drawCalls);
        }

        mapFeatures.straightLines.push(straightLines);
        mapFeatures.packagesMarkers.push(packagesMarkers);
        mapFeatures.colors.push(color);
    }

    mapFeaturesStore.set(mapFeatures);

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
