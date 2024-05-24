// noinspection JSUnusedGlobalSymbols

declare module 'threebox-plugin' {
    import mapboxgl, { type LngLatLike } from 'mapbox-gl';
    import { Vector3 } from 'three';
    import type { Feature } from 'geojson';
    import type { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
    import type { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

    export class Threebox {
        constructor(map: mapboxgl.Map, gl: WebGLRenderingContext, options?: ThreeboxOptions);

        add(obj: ThreeboxObject, layerId?: string, sourceId?: string): void;

        clear(layerId?: string, dispose?: boolean): Promise<void>;

        createSkyLayer(): void;

        createTerrainLayer(): void;

        defaultLights(): void;

        dispose(): Promise<void>;

        findParent3DObject(mesh: ThreeboxObject): ThreeboxObject;

        getFeatureCenter(feature: Feature, model?: ThreeboxObject, level?: number): LngLatLike;

        getObjectHeightOnFloor(feature: Feature, obj?: ThreeboxObject, level?: number): number;

        getSunPosition(date?: Date, coords?: LngLatLike): { azimuth: number; altitude: number };

        getSunSky(date?: Date, sunPos?: { azimuth: number; altitude: number }): { azimuth: number; altitude: number };

        getSunTimes(date?: Date, coords?: LngLatLike): {
            sunrise: Date;
            sunriseEnd: Date;
            goldenHourEnd: Date;
            solarNoon: Date;
            goldenHour: Date;
            sunsetStart: Date;
            sunset: Date;
            dusk: Date;
            nauticalDusk: Date;
            night: Date;
            nadir: Date;
            nightEnd: Date;
            nauticalDawn: Date;
            dawn: Date;
        };

        loadObj(options: ObjectOptions, cb: (obj: ThreeboxObject) => void);

        memory(): { programs: number; geometries: number; textures: number };

        programs(): number;

        projectToWorld(lnglat: LngLatLike): Vector3;

        queryRenderedFeatures(point: { x: number; y: number }): ThreeboxObject[];

        realSunlight(helper?: boolean): void;

        remove(obj: ThreeboxObject): void;

        removeByName(name: string): void;

        removeLayer(layerId: string): void;

        setLayerHeigthProperty(layerId: string, level: number): void;

        setLayerZoomRange(layerId: string, minZoomLayer: number, maxZoomLayer: number): void;

        setLayerZoomVisibility(layerId: string): void;

        setLayoutProperty(layerId: string, name: string, value: any): void;

        setObjectsScale(): void;

        setStyle(styleId: string, options?: any): void;

        setSunlight(date?: Date, coords?: LngLatLike): void;

        toggleLayer(layerId: string, visible: boolean): void;

        update(): void;

        updateLightHelper(config?: LightHelperConfig): void;

        updateSunGround(sunPos: { azimuth: number; altitude: number }): void;

        updateSunSky(sunPos: { azimuth: number; altitude: number }): void;

        unprojectFromWorld(vec: Vector3): LngLatLike;

        version(): string;

        /**
         * This get/set property receives and returns the size in meters of the step to use when an object is dragged vertically.
         * By default this is set to 0.1 = 10cm.
         */
        altitudeStep: number;

        /**
         * This get/set property receives and returns the value of the default cursor for the map canvas container `this.getCanvasContainer().style.cursor`, initially set to `'default'`.
         */
        defaultCursor: string;

        /**
         * This get/set property receives and returns the value to enable the option to drag 3D Objects vertical or horizontally created with Threebox.
         * This property requires `tb.enableSelectingFeature` is set to true.
         * When this property is true, and an object is selected, holding the **[Shift] key + mouse click** the object will be moved on its x-y axes (horizontally).
         * Holding the **[Ctrl] key + mouse click** the object will be moved on its z axis (vertically).
         * This dragging actions fire `ObjectDragged` event when the object is dropped.
         */
        enableDraggingObjects: boolean;

        /**
         * This get/set property receives and returns the value to enable the option to drag 3D Objects vertical or horizontally created with Threebox.
         * This property requires `tb.enableSelectingFeature` is set to true.
         * When this property is true, and an object is selected, holding the **[Alt] key + mouse click** the object will be rotated pivoting over its anchor on z axis.
         * Holding the **[Ctrl] key + mouse click** the object will be moved on its z axis (vertically).
         * This dragging actions fire `ObjectDragged` event when the object is dropped.
         */
        enableRotatingObjects: boolean;

        /**
         * This get/set property receives and returns the value to enable the option to select features from `fill-extrusion` layers.
         * This selection/unselection actions fire `SelectedFeatureChange` event when the object selected or unselected.
         */
        enableSelectingFeatures: boolean;

        /**
         * This get/set property receives and returns the value to enable the option to select 3D Objects created with Threebox.
         * This selection/unselection actions fire `SelectedChange` event when the object selected or unselected.
         */
        enableSelectingObjects: boolean;

        /**
         * This get/set property receives and returns the value to enable the option to have tooltips (custom or by default) on objects.
         * This property requires `tb.enableSelectingFeature` is set to true.
         * When this property is true, and an object is overed or selected, its tooltip will be shown.
         */
        enableTooltips: boolean;

        /**
         * By default is `ThreeboxConstants.FOV_DEGREES`.
         * This get/set property sets and returns the value of the Field of View (FOV) used in the Camera.
         * This value is only valid when `tb.orthographic` is false.
         */
        fov: number;

        /**
         * This get/set property receives and returns the size in precision decimals of the step to use when an object is dragged horizontally.
         * By default the precision of this step is set to 6 decimals.
         */
        gridStep: number;

        /**
         * This get/set property receives and returns the full set of lights applied to the scene.
         */
        lights: ThreeboxLights;

        /**
         * By default is `false`.
         * This get/set property receives and returns the value to enable the option to have multiple 3D layers.
         */
        multiLayer: boolean;

        /**
         * By default is `false`.
         * This get/set property sets and returns the value of the Camera to be used.
         * When `tb.orthographic` is `true`, the camera being used will be an instance of `THREE.OrthographicCamera`.
         */
        orthographic: boolean;

        /**
         * This get/set property receives and returns the size in degrees of the step to use when an object is dragged and rotated.
         * By default this is set to 5.
         */
        rotationStep: number;

        /**
         * By default is `false`. This property is set by the init param `sky: true` in threebox constructor.
         * This get/set property sets and returns the option to have a built-in atmospheric layer.
         */
        sky: boolean;

        /**
         * By default is `false`. This property is set by the init param `terrain: true` in threebox constructor.
         * This get/set property sets and returns the option to have a built-in terrain layer.
         */
        terrain: boolean;
    }

    declare function line(options: LineOptions): void;

    export interface ThreeboxOptions {
        defaultLights?: boolean;
        realSunlight?: boolean;
        realSunlightHelper?: boolean;
        passiveRendering?: boolean;
        enableSelectingFeatures?: boolean;
        enableSelectingObjects?: boolean;
        enableDraggingObjects?: boolean;
        enableRotatingObjects?: boolean;
        enableTooltips?: boolean;
        enableHelpTooltips?: boolean;
        multiLayer?: boolean;
        orthographic?: boolean;
        fov?: number;
        sky?: boolean;
        terrain?: boolean;
    }

    export interface ObjectOptions {
        type: string;
        obj: string;
        mtl?: string;
        bin?: string;
        units?: string;
        rotation?: number | { x: number; y: number; z: number };
        scale?: number | { x: number; y: number; z: number };
        anchor?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
        adjustment?: { x: number; y: number; z: number };
        normalize?: boolean;
        feature?: Feature;
        tooltip?: boolean;
        bbox?: boolean;
        raycasted?: boolean;
        clone?: boolean;
        defaultAnimation?: number;
        callback?: (obj: ThreeboxObject) => void;
    }

    export interface ThreeboxLights {
        ambientLight: THREE.AmbientLight;
        dirLight: THREE.DirectionalLight;
        dirLightBack: THREE.DirectionalLight;
        dirLightHelper: THREE.DirectionalLightHelper;
        hemiLight: THREE.HemisphereLight;
        pointLight?: THREE.PointLight;
    }

    export interface LineOptions {
        /**
         * Array of lnglat coordinates to draw the line.
         * @required
         */
        geometry: LineGeometry;

        /**
         * Color of line. Unlike other Threebox objects, this color will render on screen precisely as specified, regardless of scene lighting.
         * @default "black"
         */
        color?: string;

        /**
         * Line width. Unlike other Threebox objects, this width is in units of display pixels, rather than meters or scene units.
         * @default 1
         */
        width?: number;

        /**
         * Line opacity.
         * @default 1
         */
        opacity?: number;
    }

    /**
     * Threebox object methods definitions.
     */
    export class ThreeboxObject {

        /**
         * Uses the DOM HTMLElement received to paint it on screen in a relative position to the object that contains it.
         * @param element The DOM HTMLElement to be added.
         * @param objName The name of the object.
         * @param center The position where the label will be rendered.
         * @param height This object position.
         * @returns An instance of THREE.CSS2DObject.
         */
        addCSS2D(element: HTMLElement, objName: string, center?: any, height?: number): THREE.CSS2DObject;

        /**
         * Creates a browser-like help tooltip instance that is accessible through obj.help.
         * @param helpText The help text.
         * @param objName The name of the object.
         * @param mapboxStyle Whether to apply Mapbox GL popup styles.
         * @param center The position where the label will be rendered.
         * @param height This object position.
         */
        addHelp(helpText: string, objName?: string, mapboxStyle?: boolean, center?: any, height?: number): void;

        /**
         * Uses the DOM HTMLElement received to paint it on screen in a relative position to the object that contains it.
         * @param HTMLElement The DOM HTMLElement to be added.
         * @param visible Whether the label will be always visible.
         * @param center The position where the label will be rendered.
         * @param height This object position.
         */
        addLabel(HTMLElement: HTMLElement, visible?: boolean, center?: any, height?: number): void;

        /**
         * Creates a browser-like tooltip for the object using the tooltipText.
         * @param tooltipText The tooltip text.
         * @param mapboxStyle Whether to apply Mapbox GL popup styles.
         * @param center The position where the label will be rendered.
         * @param custom Whether the tooltip is custom.
         * @param height This object position.
         */
        addTooltip(tooltipText: string, mapboxStyle?: boolean, center?: any, custom?: boolean, height?: number): void;

        /**
         * Copies the anchor properties.
         * @param anchor The anchor to copy.
         */
        copyAnchor(anchor: any): void;

        /**
         * Creates two bounding boxes using THREE.Box3Helper.
         */
        drawBoundingBox(): void;

        /**
         * Uses the DOM HTMLElement received to create and paint a label on screen.
         * @param HTMLElement The DOM HTMLElement to be added.
         * @param visible Whether the label will be always visible.
         * @param center The position where the label will be rendered.
         */
        drawLabelHTML(HTMLElement: HTMLElement, visible?: boolean, center?: any): void;

        /**
         * Returns a clone of the object.
         * @returns A clone of the object.
         */
        duplicate(): ThreeboxObject;

        /**
         * Removes the instance of CSS2DObject by objName and disposes its resources.
         * @param objName The name of the object.
         */
        removeCSS2D(objName: string): void;

        /**
         * Removes the instance of CSS2DObject stored in obj.help.
         */
        removeHelp(): void;

        /**
         * Removes the instance of CSS2DObject stored in obj.label.
         */
        removeLabel(): void;

        /**
         * Removes the instance of CSS2DObject stored in obj.tooltip.
         */
        removeTooltip(): void;

        /**
         * Updates object's position, rotation, and scale in only one call.
         * @param options The configuration options for updating the object.
         */
        set(options: {
            position?: any;
            rotation?: any;
            scale?: any;
            worldCoordinates?: any;
            quaternion?: [any, number];
            translate?: any;
            worldTranslate?: any;
            duration?: number;
        }): void;

        /**
         * Sets the positional and pivotal anchor automatically from string param.
         * @param anchor The string value for the anchor.
         */
        setAnchor(anchor: string): void;

        /**
         * Positions obj.boundingBoxShadow at the height of the floor.
         */
        setBoundingBoxShadowFloor(): void;

        /**
         * Positions the object at the defined lnglat coordinates.
         * @param lnglat The coordinates to position the object.
         */
        setCoords(lnglat: LngLatLike): void;

        /**
         * Sets the scale used to convert the object based on fixedZoom value.
         * @param scale The scale value.
         */
        setFixedZoom(scale: number): void;

        /**
         * Sets the scale used to convert the object considering obj.unitsPerMeter and depending the object is in units scene or meters.
         * @param scale The scale value.
         */
        setObjectScale(scale: number): void;

        /**
         * Rotates the object over its defined center in the 3 axes.
         * @param xyz The rotation values.
         */
        setRotation(xyz: number | { x: number; y: number; z: number }): void;

        /**
         * Rotates the object over one of its bottom corners on z axis.
         * @param xyz The rotation values.
         */
        setRotationAxis(xyz: number | { x: number; y: number; z: number }): void;

        /**
         * Sets the scale used to convert the object considering obj.unitsPerMeter.
         * @param scale The scale value.
         */
        setScale(scale: number): void;

        /**
         * Moves the object from its current position adding the lnglat coordinates received.
         * @param lnglat The coordinates to translate the object.
         */
        setTranslate(lnglat: any): void;


        /**
         * A THREE.Box3Helper which contains the object in its initial size.
         * By Threebox design, boundingBox is hidden for THREE.Raycaster even when it's visible for the camera.
         */
        boundingBox: THREE.Box3Helper;

        /**
         * A THREE.Box3Helper which contains the object in its initial size but 0 height and projected to the floor of the map independently of its height position.
         * By Threebox design, boundingBoxShadow is hidden for THREE.Raycaster even when it's visible for the camera.
         */
        boundingBoxShadow: THREE.Box3Helper;

        /**
         * The value of the option of objects to cast a shadow.
         */
        castShadow: boolean;

        /**
         * The value of the color from a hexadecimal value.
         */
        color: number;

        /**
         * Returns a CSS2DObject value that represents the help tooltip of a THREE.ThreeboxObject created by obj.addHelp method.
         * This is an internal object only visible on drag&drop actions over an object.
         */
        help: CSS2DObject;

        /**
         * The value of the hidden status of an object. This property overrides the value of obj.visibility.
         */
        hidden: boolean;

        /**
         * The value for the zoom below the one the object will have a fixed scale at any zoom level.
         * Over the value, the object will rescale as always.
         */
        fixedZoom: number;

        /**
         * The value that represents the label of a THREE.ThreeboxObject created by obj.addLabel method.
         * The label could be used as an element to show on mouse over or to be always visible.
         * It can contain any HTMLElement.
         */
        label: CSS2DObject;

        /**
         * Returns the height of the object in meters.
         */
        modelHeight: number;

        /**
         * A boolean value to hide a THREE.ThreeboxObject from THREE.Raycaster if false.
         */
        raycasted: boolean;

        /**
         * The value of the option of objects to receive a shadow.
         */
        receiveShadow: boolean;

        /**
         * The value that represents the tooltip of a THREE.ThreeboxObject created by obj.addTooltip method.
         * The tooltip by default shows the uuid value of a threebox object.
         */
        tooltip: CSS2DObject;

        /**
         * Returns the conversion value of units per meter at the object's current latitude.
         */
        unitsPerMeter: number;

        /**
         * A boolean value to override the property visible of a THREE.ThreeboxObject, adding also the same visibility value for obj.label and obj.tooltip.
         * This property is overridden by obj.hidden.
         */
        visibility: boolean;

        /**
         * A boolean value to convert a THREE.ThreeboxObject into wireframes or texture it.
         */
        wireframe: boolean;

        /**
         * Plays the default embedded animation of a loaded 3D model.
         * @param options The configuration options for the animation.
         */
        playDefault(options?: AnimationOptions): void;

        /**
         * Plays one of the embedded animations of a loaded 3D model.
         * @param options The configuration options for the animation.
         */
        playAnimation(options: PlayAnimationOptions): void;

        /**
         * Translate object along a specified path with an optional callback function.
         * @param options The configuration options for following the path.
         * @param callback The function to be executed when the animation finishes.
         */
        followPath(options: FollowPathOptions, callback?: () => void): void;

        /**
         * Stops all of object's current animations.
         */
        stop(): void;

        addEventListener(event: 'IsPlayingChanged', listener: ObjectEventListener<{ isPlaying: boolean }>, options?: boolean | AddEventListenerOptions): void;
        addEventListener(event: 'ObjectChanged', listener: ObjectEventListener<ObjectChangedEventDetail>, options?: boolean | AddEventListenerOptions): void;
        addEventListener(event: 'ObjectDragged', listener: ObjectEventListener<ObjectDraggedEventDetail>, options?: boolean | AddEventListenerOptions): void;
        addEventListener(event: 'ObjectMouseOver', listener: ObjectEventListener<ObjectEventDetail>, options?: boolean | AddEventListenerOptions): void;
        addEventListener(event: 'ObjectMouseOut', listener: ObjectEventListener<ObjectEventDetail>, options?: boolean | AddEventListenerOptions): void;
        addEventListener(event: 'SelectedChange', listener: ObjectEventListener<SelectedFeatureEventDetail>, options?: boolean | AddEventListenerOptions): void;
        addEventListener(event: 'Wireframed', listener: ObjectEventListener<{ wireframe: boolean }>, options?: boolean | AddEventListenerOptions): void;

    }

    export interface ObjectEventDetail {
        object: ThreeboxObject;
    }

    export interface ObjectChangedEventDetail extends ObjectEventDetail {
        action: {
            position?: [number, number, number];
            rotation?: { x: number; y: number; z: number };
            scale?: { x: number; y: number; z: number };
        };
    }

    export interface ObjectDraggedEventDetail extends ObjectEventDetail {
        draggedAction: 'rotate' | 'translate' | 'altitude';
    }

    export interface SelectedFeatureEventDetail extends ObjectEventDetail {
        selected: boolean;
    }

    export type ObjectEventListener<T> = (eventArgs: { detail: T }) => void;

    export interface AnimationOptions {
        duration?: number;
        speed?: number;
    }

    export interface PlayAnimationOptions extends AnimationOptions {
        animation: number;
    }

    export interface FollowPathOptions {
        path: LineGeometry;
        duration?: number;
        trackHeading?: boolean;
    }
}
