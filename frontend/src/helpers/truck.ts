import type { Position } from 'geojson';
import { getMap, getThreebox } from '../resources/stores.ts';
import type { Threebox, ThreeboxObject } from 'threebox-plugin';

export class Truck {
    // Config
    readonly #id: string;
    readonly #path: Position[];
    readonly #model: string;

    // Properties
    #loaded = false;
    #spawned = false;
    #truck: ThreeboxObject | null = null;

    // Utils
    #map: mapboxgl.Map | null = null;
    #threebox: Threebox | null = null;

    constructor(config: TruckConfig) {
        this.#id = config.id;
        this.#path = config.path;
        this.#model = config.model ?? '/truck.glb';

        getMap().then(map => (this.#map = map));
        getThreebox().then(threebox => (this.#threebox = threebox));
    }

    // Getters and Setters
    public get id() {
        return this.#id;
    }

    public get path() {
        return this.#path;
    }

    public get loaded() {
        return this.#loaded;
    }

    public get spawned(): boolean {
        return this.#spawned;
    }

    public get object(): ThreeboxObject | null {
        return this.#truck;
    }

    public async load() {
        if (this.#loaded)
            return;

        this.#threebox!.loadObj();
    }

    public spawn(): void {
        this.#spawned = true;
    }
}

export interface TruckConfig {
    id: string;
    path: Position[];
    model?: string;
}
