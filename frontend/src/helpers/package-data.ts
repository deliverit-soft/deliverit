import { writable } from 'svelte/store';
import { randint } from './utils.ts';

export class PackageData {
    static readonly instances = new Set<PackageData>();
    static readonly instancesStore = writable([ ...this.instances ]);

    readonly width: number;
    readonly length: number;
    readonly height: number;

    constructor(width: number, length: number, height: number) {
        this.width = width;
        this.length = length;
        this.height = height;
        PackageData.instances.add(this);
        PackageData.instancesStore.set([ ...PackageData.instances ]);
    }

    // Instance methods

    private static getRandomSize() {
        const width = randint(1, 4);
        const length = randint(1, 8);
        const height = randint(1, 3);

        return { width, length, height };
    }

    static randomInstance() {
        const { width, length, height } = this.getRandomSize();
        return new PackageData(width, length, height);
    }

    static destroyAll() {
        this.instances.forEach(truck => truck.destroy());
    }

    // Lifecycle methods

    destroy(): void {
        PackageData.instances.delete(this);
        PackageData.instancesStore.set([ ...PackageData.instances ]);
    }
}
