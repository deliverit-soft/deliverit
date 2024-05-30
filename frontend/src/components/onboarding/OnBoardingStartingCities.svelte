<script lang="ts">
    import OnBoardingStepLayout from './utils/OnBoardingStepLayout.svelte';
    import { ArrowPath, Icon, Plus } from 'svelte-hero-icons';
    import type { City } from '$models/city.ts';
    import OnBoardingCity from './utils/OnBoardingCity.svelte';
    import { TruckData } from '$models/truck-data.ts';
    import { getRandomCities } from '$helpers/api.ts';
    import { randint } from '$helpers/utils.ts';
    import CitySearchPopup from '$components/onboarding/utils/CitySearchPopup.svelte';

    let cities: City[] = [];
    let loading = false;

    let showPopup = false;

    const truckCount = TruckData.instances.size;

    function handleCitySelect(ev: CustomEvent<City>) {
        closePopup();

        if (cities.find(city => city.insee_code === ev.detail.insee_code))
            return;
        cities = [ ...cities, ev.detail ];
    }

    function closePopup() {
        showPopup = false;
    }

    function handleNewCity() {
        showPopup = true;
    }

    async function handleRandomCities() {
        loading = true;
        cities = await getRandomCities(randint(1, truckCount));
        loading = false;
    }

    function handleCityDelete(ev: CustomEvent<string>) {
        cities = cities.filter(city => city.insee_code !== ev.detail);
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


<OnBoardingStepLayout on:next nextDisabled={cities.length === 0}>
    <div class="create-header" slot="title">
        <h2>Starting cities</h2>
        <div>
            <button on:click={handleNewCity} disabled={loading || cities.length >= truckCount}>
                <Icon src={Plus} size="1.5rem"/>
            </button>
            <button on:click={handleRandomCities} disabled={loading} class="spinner">
                <Icon src={ArrowPath} size="1.5rem"/>
            </button>
        </div>
    </div>

    <div class="cities">
        {#each cities as city}
            <OnBoardingCity {city} on:delete={handleCityDelete}/>
        {/each}
    </div>
</OnBoardingStepLayout>

{#if showPopup}
    <CitySearchPopup on:select={handleCitySelect} on:close={closePopup}/>
{/if}
