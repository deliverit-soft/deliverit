import { Truck } from './truck.ts';
import { randint, range } from '../helpers/utils.ts';
import { writable } from 'svelte/store';

export class TruckData {
    static readonly instances = new Set<TruckData>();
    static readonly instancesStore = writable([ ...this.instances ]);
    static readonly groupedInstancesStore = writable<TruckData[][]>([]);

    #width: number;
    #length: number;
    #height: number;
    readonly packages = new Set();
    readonly model = new Truck({
        id: String(Math.random()),
    });

    constructor(width: number, length: number, height: number) {
        this.#width = width;
        this.#length = length;
        this.#height = height;
        TruckData.instances.add(this);
        TruckData.instancesStore.set([ ...TruckData.instances ]);
        TruckData.groupedInstancesStore.set(TruckData.groupedInstances);
    }

    // Getters and Setters

    get width() {
        return this.#width;
    }

    get length() {
        return this.#length;
    }

    get height() {
        return this.#height;
    }

    set width(width: number) {
        this.#width = width;
        TruckData.instancesStore.set([ ...TruckData.instances ]);
        TruckData.groupedInstancesStore.set(TruckData.groupedInstances);
    }

    set length(length: number) {
        this.#length = length;
        TruckData.instancesStore.set([ ...TruckData.instances ]);
        TruckData.groupedInstancesStore.set(TruckData.groupedInstances);
    }

    set height(height: number) {
        this.#height = height;
        TruckData.instancesStore.set([ ...TruckData.instances ]);
        TruckData.groupedInstancesStore.set(TruckData.groupedInstances);
    }

    // Instance methods

    private static getRandomSize() {
        const width = randint(2, 4);
        const length = randint(3, 20);
        const height = randint(2, 4);

        return { width, length, height };
    }

    static randomInstance() {
        const { width, length, height } = this.getRandomSize();
        return new TruckData(width, length, height);
    }

    static randomInstances() {
        this.instances.forEach(truck => truck.destroy());
        for (const _ of range(2, 3)) {
            const { width, length, height } = this.getRandomSize();
            for (const _ of range(1, 3)) {
                new TruckData(width, length, height);
            }
        }
    }

    static get groupedInstances() {
        return Object.values(
            Array
                .from(this.instances)
                .reduce((acc, truck) => {
                    const key = `${truck.width}x${truck.length}x${truck.height}`;
                    if (!acc[key])
                        acc[key] = [];
                    acc[key]!.push(truck);
                    return acc;
                }, {} as { [key: string]: TruckData[] }),
        );
    }

    static destroyAll() {
        this.instances.forEach(truck => truck.destroy());
    }

    // Lifecycle methods

    destroy(): void {
        this.model.destroy();
        TruckData.instances.delete(this);
        TruckData.instancesStore.set([ ...TruckData.instances ]);
        TruckData.groupedInstancesStore.set(TruckData.groupedInstances);
    }
}
