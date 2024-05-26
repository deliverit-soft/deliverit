// noinspection JSUnusedGlobalSymbols

import type {
    ObjectChangedEventDetail,
    ObjectEventArgs,
    ObjectOptions,
    ThreeboxObject,
} from 'threebox-plugin';
import type { Position } from 'geojson';
import { getMap, getThreebox } from '../resources/stores.ts';
import { chunkPath, pathLength, sliceAlongPath } from './geo.ts';
import mapboxgl from 'mapbox-gl';

export class Truck extends EventTarget {
    // Config
    readonly #id: string;
    readonly #zoomMarkerThreshold: number = 15.5;
    readonly #autoCameraFollow: boolean = false;

    // Properties
    #loaded = false;
    #spawned = false;
    #followPath: boolean = false;
    #lastMoveRegistered: number = 0;
    #path: Position[] = [];
    #pathLength = 0;
    #pathProgress = 0;
    #chunkedPath: Position[] = [];
    #previousPosition: Position | null = null;
    #speed: number = 50; // m/s
    #enableMarker: boolean = true;
    markerColor: string = '#FF0000';
    #cameraFollow: boolean = false;

    // Instances
    #truck: ThreeboxObject | null = null;
    readonly #marker: mapboxgl.Marker | null = null;

    constructor(config: TruckConfig) {
        super();
        this.#id = config.id;
        this.enableMarker = config.enableMarker ?? false;
        this.markerColor = config.markerColor ?? this.markerColor;
        this.#zoomMarkerThreshold = config.zoomMarkerThreshold ?? this.#zoomMarkerThreshold;
        this.#autoCameraFollow = config.autoCameraFollow ?? this.#autoCameraFollow;

        if (this.enableMarker) {
            this.#marker = new mapboxgl.Marker({
                color: this.markerColor,
            });
            this.#marker.setLngLat([ 0, 0 ]);
            this.#marker.addTo(getMap());
        }
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

    public get spawned() {
        return this.#spawned;
    }

    public get object() {
        if (!this.#truck)
            throw new Error('Truck must be loaded first');

        return this.#truck;
    }

    public get enableMarker() {
        return this.#enableMarker;
    }

    public set enableMarker(enableMarker: boolean) {
        this.#enableMarker = enableMarker;
    }

    public get progress() {
        return this.#pathProgress;
    }

    /** Get truck speed (m/s) */
    public get speed() {
        return this.#speed;
    }

    /** Set truck speed (m/s) */
    public set speed(speed: number) {
        if (speed <= 0)
            throw new Error('Speed must be greater than 0');

        this.#speed = speed;

        // If truck is moving, update the animation with the new duration
        if (this.#followPath) {
            this.object.stop();
            const remainingPath = sliceAlongPath(this.#chunkedPath, this.#pathLength * this.#pathProgress, this.#pathLength);

            this.object.followPath({
                path: remainingPath,
                trackHeading: true,
                duration: (this.#pathLength * (1 - this.#pathProgress)) / this.#speed * 1000,
            });
        }
    }

    // Lifecycle

    public async load(options: Partial<ObjectOptions> = {}) {
        if (this.#loaded)
            return;

        await new Promise<void>(resolve => getThreebox().loadObj({
            obj: '/truck.glb',
            type: 'gltf',
            scale: 10,
            units: 'meters',
            anchor: 'bottom',
            rotation: { x: 90, y: 90, z: 0 },
            ...options,
        }, obj => {
            this.#truck = obj;
            resolve();
        }));

        this.#loaded = true;
    }

    public spawn(): void {
        if (!this.#loaded)
            throw new Error('Truck must be loaded first');

        if (this.#spawned)
            return;

        getThreebox().add(this.object);
        this.#previousPosition = this.object.coordinates as Position;

        if (this.#marker) {
            this.#marker.setLngLat(this.object.coordinates);
            this.#marker.getElement().addEventListener('click', this.onMarkerClick.bind(this));
        }

        this.#spawned = true;
        this.onAnimationFrame();
        this.object.addEventListener('ObjectChanged', this.onObjectChanged.bind(this));
        getMap().on('zoom', this.onZoom.bind(this));

        const spawnEvent = new Event('spawn');
        this.dispatchEvent(spawnEvent);
    }

    public destroy(): void {
        if (!this.#spawned)
            return;

        this.#marker?.remove();
        getMap().off('zoom', this.onZoom.bind(this));
        this.unfollow();
        getThreebox().remove(this.object);
        this.#spawned = false;
        this.dispatchEvent(new Event('destroy'));
    }

    // Methods

    /**
     * Focus the camera on the truck
     */
    public async focus(rotate = true, duration = 1000) {
        getMap().flyTo({
            center: this.object.coordinates,
            zoom: 19,
            ...(rotate ? {
                bearing: -this.object.rotation.z * 180 / Math.PI + 45,
                pitch: 60,
            } : {}),
            duration,
        });
        await new Promise<void>(resolve => setTimeout(resolve, duration));
    }

    /**
     * Attach the camera to the truck and follow it.
     * The camera is detached on user interaction
     */
    public follow() {
        if (this.#cameraFollow || !this.#spawned || !this.#truck || !this.#followPath)
            return;

        this.#cameraFollow = true;
        this.dispatchEvent(new Event('cameraFollow'));

        getMap().on('mousedown', this.unfollow.bind(this));
        getMap().on('wheel', this.unfollow.bind(this));
        getMap().on('touchstart', this.unfollow.bind(this));
    }

    public unfollow() {
        this.#cameraFollow = false;
        this.dispatchEvent(new Event('cameraUnfollow'));
        getMap().off('mousedown', this.unfollow.bind(this));
        getMap().off('wheel', this.unfollow.bind(this));
        getMap().off('touchstart', this.unfollow.bind(this));
    }

    public async followPath(path: Position[]): Promise<void> {
        if (this.#followPath)
            return;

        this.#path = path;
        this.#pathLength = pathLength(path);
        this.#pathProgress = 0;
        this.#chunkedPath = chunkPath(path, 5);
        this.#lastMoveRegistered = Date.now();

        this.object.followPath({
            path: this.#chunkedPath,
            trackHeading: true,
            duration: this.#pathLength / this.#speed * 1000,
        });

        this.#followPath = true;

        if (this.#autoCameraFollow)
            this.follow();
        await new Promise<Event>(resolve => this.addEventListener('pathEnd', resolve, { once: true }));
    }

    // Event Handlers

    private onObjectChanged(ev: ObjectEventArgs<ObjectChangedEventDetail>) {
        const { position, rotation } = ev.detail.action;

        // Update marker position
        if (this.#marker && position)
            this.#marker.setLngLat(this.object.coordinates);

        // Update truck progress
        if (this.#followPath && position) {
            this.#pathProgress += pathLength([ this.#previousPosition!, position ]) / this.#pathLength;
            this.#previousPosition = position;
            this.#lastMoveRegistered = Date.now();
            this.dispatchProgress();
        }

        // Update camera position
        if (this.#cameraFollow && position && rotation)
            getMap().jumpTo({
                center: [ position[0], position[1] ],
                zoom: 19,
                bearing: -rotation.z * 180 / Math.PI + 185,
                pitch: 70,
            });
    }

    private onMarkerClick() {
        if (!this.#followPath)
            this.focus();
        else
            this.follow();
    }

    private onZoom() {
        if (!this.spawned || !this.#enableMarker || !this.#marker)
            return;

        const zoom = getMap().getZoom();
        const hideTruck = zoom < this.#zoomMarkerThreshold;

        this.object.visibility = !hideTruck;
        this.#marker.getElement().style.visibility = hideTruck ? 'visible' : 'hidden';
    }

    private onAnimationFrame() {
        if (this.#spawned)
            requestAnimationFrame(this.onAnimationFrame.bind(this));

        // Handle end of path, when the truck hasn't moved for 100ms
        if (this.#followPath && Date.now() - this.#lastMoveRegistered > 100) {
            this.#followPath = false;
            this.#pathProgress = 1;
            this.#cameraFollow = false;
            this.dispatchProgress();
            this.dispatchEvent(new Event('pathEnd'));
        }
    }

    // Events Dispatchers

    private dispatchProgress() {
        this.dispatchEvent(new CustomEvent<PathProgressEventDetail>(
            'pathProgress',
            { detail: { progress: this.#pathProgress } },
        ));
    }
}

export interface TruckConfig {
    /**
     * Truck object ID
     */
    id: string;

    /**
     * Enable a marker to be shown when the truck is not visible, default is true
     */
    enableMarker?: boolean;

    /**
     * Color of the marker, if enabled. Default is red
     */
    markerColor?: string;

    /**
     * Max zoom level to show the truck, a value greater than that will hide the truck and show the marker,
     * default is 15.5
     */
    zoomMarkerThreshold?: number;

    /**
     * Active camera follow mode whenever the truck follows a path, default is false
     */
    autoCameraFollow?: boolean;
}

export interface PathProgressEventDetail {
    progress: number;
}
