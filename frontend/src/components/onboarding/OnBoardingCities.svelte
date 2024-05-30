<script lang="ts">
    import OnBoardingStepLayout from './utils/OnBoardingStepLayout.svelte';
    import { ArrowPath, Icon, Plus } from 'svelte-hero-icons';
    import type { City } from '$models/city.ts';
    import OnBoardingCity from './utils/OnBoardingCity.svelte';
    import { getRandomCities } from '$helpers/api.ts';
    import { randint } from '$helpers/utils.ts';
    import CitySearchPopup from '$components/onboarding/utils/CitySearchPopup.svelte';
    import { onMount } from 'svelte';
    import type { Writable } from 'svelte/store';

    export let title = 'Cities';
    export let cityStore: Writable<City[]>;
    export let min = 1;
    export let max = 1;

    onMount(() => {
        $cityStore = [];
    });

    let loading = false;
    let showPopup = false;

    function handleCitySelect(ev: CustomEvent<City>) {
        closePopup();

        if ($cityStore.find(city => city.insee_code === ev.detail.insee_code))
            return;
        $cityStore = [ ...$cityStore, ev.detail ];
    }

    function closePopup() {
        showPopup = false;
    }

    function handleNewCity() {
        showPopup = true;
    }

    async function handleRandomCities() {
        loading = true;
        $cityStore = await getRandomCities(randint(min, max));
        loading = false;
    }

    function handleCityDelete(ev: CustomEvent<string>) {
        $cityStore = $cityStore.filter(city => city.insee_code !== ev.detail);
    }
</script>


<style>
    .create-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    h2 {
        font-size: 2rem;
        margin: 0;
        position: relative;
    }

    .create-header button {
        background: none;
        border: none;
        cursor: pointer;
        padding: .5rem;
        border-radius: .5rem;
        height: 2.5rem;
        width: 2.5rem;
        color: var(--primary-black);
        transition: all .2s;
    }

    .create-header button:hover {
        background-color: var(--primary-theme);
        color: var(--primary-white);
    }

    .create-header button:disabled:hover {
        background-color: var(--light-gray);
        cursor: not-allowed;
    }

    .create-header button.spinner:disabled {
        cursor: progress;
    }

    .cities {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(2, 1fr);
        padding: .25rem;
    }
</style>


<OnBoardingStepLayout on:next nextDisabled={$cityStore.length < min || $cityStore.length > max}>
    <div class="create-header" slot="title">
        <h2>{title} ({$cityStore.length} / {max})</h2>
        <div>
            <button on:click={handleNewCity}
                    disabled={loading || $cityStore.length >= max}>
                <Icon src={Plus} size="1.5rem"/>
            </button>
            <button on:click={handleRandomCities} disabled={loading} class="spinner">
                <Icon src={ArrowPath} size="1.5rem"/>
            </button>
        </div>
    </div>

    <div class="cities">
        {#each $cityStore as city}
            <OnBoardingCity {city} on:delete={handleCityDelete}/>
        {/each}
    </div>
</OnBoardingStepLayout>

{#if showPopup}
    <CitySearchPopup on:select={handleCitySelect} on:close={closePopup}/>
{/if}
