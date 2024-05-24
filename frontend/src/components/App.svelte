<script>
    import Map from "./map/Map.svelte";
    import ResetView from "./map/ResetView.svelte";
    import Panel from "./panel/Panel.svelte";
</script>

<style>
    main {
        height: 100vh;
        width: 100vw;
        display: flex;
    }

    .map-container {
        height: 100%;
        width: 100%;
        position: relative;
        flex: 1;
    }
</style>

<main>
    <Panel/>
    <div class="map-container">
        <Map/>
        <ResetView/>
    </div>
</main>
