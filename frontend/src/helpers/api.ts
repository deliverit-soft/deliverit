import type { City } from '$models/city.ts';
import type { TruckData } from '$models/truck-data.ts';
import type { PackageData } from '$models/package-data.ts';
import type { BinPackingRawResponse, BinPackingResult } from '$models/bin-packing.ts';

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
        packagesCount: data.package_count,
        trucksUsed: data.trucks_used,
    };
}
