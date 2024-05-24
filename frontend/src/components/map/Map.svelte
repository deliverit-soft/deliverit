<script lang="ts">
    import mapboxgl from 'mapbox-gl';
    import 'mapbox-gl/dist/mapbox-gl.css';
    import { onDestroy, onMount } from 'svelte';
    import { mapStore } from '../../resources/stores.ts';
    import { DEFAULT_POSITION, DEFAULT_ZOOM } from '../../resources/defaults.ts';

    const { PUBLIC_MAPBOX_TOKEN, PUBLIC_MAPBOX_STYLES } = import.meta.env;
    let mapContainer: HTMLDivElement;

    onMount(async () => {
        mapboxgl.accessToken = PUBLIC_MAPBOX_TOKEN;
        $mapStore = new mapboxgl.Map({
            container: mapContainer,
            style: PUBLIC_MAPBOX_STYLES,
            minZoom: DEFAULT_ZOOM,
            maxBounds: new mapboxgl.LngLatBounds([-7, 42], [10, 52]),
            ...DEFAULT_POSITION,
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
