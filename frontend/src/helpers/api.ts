import type { City } from '$models/city.ts';

const baseUrl = import.meta.env.PUBLIC_API_URL || window.location.origin;

export async function getRandomCities(limit = 1) {
    const url = new URL('/api/cities/random', baseUrl);
    url.searchParams.append('limit', limit.toString());
    const response = await fetch(url);
    return response.json() as Promise<City[]>;
}
