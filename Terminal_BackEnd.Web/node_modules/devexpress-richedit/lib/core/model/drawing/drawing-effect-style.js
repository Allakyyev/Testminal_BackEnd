import { ContainerEffect } from './container-effect';
import { Scene3DProperties } from './scene3d-properties';
import { Shape3DProperties } from './shape3d-properties';
export class DrawingEffectStyle {
    constructor(containerEffect = new ContainerEffect(), scene3DProperies = new Scene3DProperties(), shape3DProperties = new Shape3DProperties()) {
        this.containerEffect = containerEffect;
        this.scene3DProperies = scene3DProperies;
        this.shape3DProperties = shape3DProperties;
    }
    get isDefault() {
        return this.containerEffect.isEmpty && this.scene3DProperies.isDefault && this.shape3DProperties.isDefault;
    }
    clone() {
        return new DrawingEffectStyle(this.containerEffect.clone(), this.scene3DProperies.clone(), this.shape3DProperties.clone());
    }
}
