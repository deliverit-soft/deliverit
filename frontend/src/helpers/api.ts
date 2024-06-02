import type { City } from '$models/city.ts';
import type { TruckData } from '$models/truck-data.ts';
import type { PackageData } from '$models/package-data.ts';
import type { BinPackingRawResponse, BinPackingResult } from '$models/bin-packing.ts';
import type { VrpRequest, VrpResponse, VrpResult } from '$models/vrp.ts';

const baseUrl = import.meta.env.PUBLIC_API_URL || window.location.origin;

export async function getRandomCities(limit = 1) {
    const url = new URL('/api/cities/random', baseUrl);
    url.searchParams.append('limit', limit.toString());
    const response = await fetch(url);
    return response.json() as Promise<City[]>;
}

export async function searchCities(query: string, limit = 5) {
    const url = new URL('/api/cities/search', baseUrl);
    url.searchParams.append('query', query);
    url.searchParams.append('limit', limit.toString());
    const response = await fetch(url);
    return response.json() as Promise<City[]>;
}

export async function binPacking(trucks: TruckData[], packages: PackageData[]): Promise<BinPackingResult> {
    const truckObjects = trucks.map(truck => truck.toObject());
    const packageObjects = packages.map(pkg => pkg.toObject());

    const url = new URL('/api/logic/bin_packing', baseUrl);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            trucks: truckObjects,
            packages: packageObjects,
        }),
    });

    const data = await response.json() as BinPackingRawResponse;
    return {
        matrix: data.matrix,
        packageCountPerTruck: data.package_count,
        packagesPlaced: data.package_count.reduce((a, b) => a + b, 0),
        trucksUsed: data.trucks_used,
        totalSlots: data.matrix.flat(3).length,
        slotsUsed: data.matrix.flat(3).filter(Boolean).length,
    };
}

export async function tabuVrp(packageByTruck: number[], startCities: City[], deliverCities: City[]): Promise<VrpResult> {
    const url = new URL('/api/logic/vrp_tabu', baseUrl);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            trucks_packages: packageByTruck,
            start_cities: startCities.map(city => city.insee_code),
            deliver_cities: deliverCities.map(city => city.insee_code),
        } as VrpRequest),
    });

    const data = await response.json() as VrpResponse;
    return {
        bestCost: data.best_cost,
        bestSolution: data.best_solution,
        executionTimes: data.execution_times,
    };
}
