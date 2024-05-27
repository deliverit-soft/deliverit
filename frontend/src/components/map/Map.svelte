<script lang="ts">
    import mapboxgl from 'mapbox-gl';
    import 'mapbox-gl/dist/mapbox-gl.css';
    import { onDestroy, onMount } from 'svelte';
    import { mapStore, threebox } from '../../resources/stores.ts';
    import { DEFAULT_POSITION, DEFAULT_ZOOM } from '../../resources/defaults.ts';
    import { Threebox } from 'threebox-plugin';

    const { PUBLIC_MAPBOX_TOKEN, PUBLIC_MAPBOX_STYLES } = import.meta.env;
    let mapContainer: HTMLDivElement;

    onMount(async () => {
        mapboxgl.accessToken = PUBLIC_MAPBOX_TOKEN;
        $mapStore = new mapboxgl.Map({
            container: mapContainer,
            style: PUBLIC_MAPBOX_STYLES,
            minZoom: DEFAULT_ZOOM,
            maxBounds: new mapboxgl.LngLatBounds([-7, 42], [10, 52]),
            antialias: true,
            ...DEFAULT_POSITION,
        });

        await new Promise(resolve => $mapStore.once('load', resolve));
        $mapStore.addLayer({
            id: 'threebox',
            type: 'custom',
            renderingMode: '3d',
            onAdd: (map, gl) => {
                $threebox = new Threebox(map, gl, {
                    defaultLights: true,
                });
                // @ts-ignore
                window.tb = $threebox;
            },
            render: () => {
                $threebox.update();
            },
        });
    });

    onDestroy(() => {
        $mapStore.remove();
    });
</script>

<style>
    #map {
        height: 100%;
        width: 100%;
    }
</style>

<div id="map" bind:this={mapContainer}/>
