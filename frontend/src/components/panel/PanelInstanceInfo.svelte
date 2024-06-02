<script lang="ts">
    import { ArchiveBox, Icon, MapPin, Truck } from 'svelte-hero-icons';
    import { binPackingResult, startCities } from '$resources/stores.js';
    import { fade } from 'svelte/transition';
</script>


<style>
    .info-container {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1rem;
        margin-top: 1rem;
        width: 100%;
        margin-bottom: 2rem;
    }

    .instance-info {
        display: flex;
        gap: 0.5rem;
        align-items: end;
        flex-wrap: nowrap;
        white-space: nowrap;
    }
</style>


<div class="info-container" in:fade={{duration: 200}}>
    <div class="instance-info">
        <Icon src={Truck} size="1.5rem"/>
        {$binPackingResult.trucksUsed} trucks
    </div>
    <div class="instance-info">
        <Icon src={ArchiveBox} size="1.5rem"/>
        {$binPackingResult.packagesPlaced} packages
    </div>
    <div class="instance-info">
        <Icon src={MapPin} size="1.5rem"/>
        {$startCities.length} starting cities
    </div>
</div>
