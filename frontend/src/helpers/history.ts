import { TruckData } from '$models/truck-data.ts';
import { PackageData } from '$models/package-data.ts';
import type { BinPackingResult } from '$models/bin-packing.ts';
import {
    binPackingResult, citiesToTour,
    getBinPackingResult,
    getCitiesToTour,
    getStartCities,
    startCities,
} from '$resources/stores.ts';
import type { City } from '$models/city.ts';

export interface HistoryElement {
    date: Date;
    trucks: HistoryElementDimensions[];
    packages: HistoryElementDimensions[];
    binPackingResult: BinPackingResult;
    startCities: City[];
    citiesToTour: City[];
}

export interface HistoryElementDimensions {
    height: number;
    width: number;
    length: number;
}

const STORAGE_KEY = 'deliverit-history';

export function saveCurrentInstance() {
    const trucks: HistoryElementDimensions[] = [ ...TruckData.instances ].map(truck => ({
        height: truck.height,
        width: truck.width,
        length: truck.length,
    }));
    const packages: HistoryElementDimensions[] = [ ...PackageData.instances ].map(pack => ({
        height: pack.height,
        width: pack.width,
        length: pack.length,
    }));

    const historyElement: HistoryElement = {
        date: new Date(),
        trucks,
        packages,
        binPackingResult: getBinPackingResult(),
        startCities: getStartCities(),
        citiesToTour: getCitiesToTour(),
    };

    const history = getHistory();
    history.push(historyElement);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getHistory(): HistoryElement[] {
    let result = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as HistoryElement[];
    return result.map((element: HistoryElement) => ({
        ...element,
        date: new Date(element.date),
    }));
}

export function loadInstance(instance: HistoryElement) {
    TruckData.destroyAll();
    PackageData.destroyAll();

    instance.trucks.forEach(truck => new TruckData(truck.width, truck.length, truck.height));
    instance.packages.forEach(pack => new PackageData(pack.width, pack.length, pack.height));
    binPackingResult.set(instance.binPackingResult);
    startCities.set(instance.startCities);
    citiesToTour.set(instance.citiesToTour);
}
