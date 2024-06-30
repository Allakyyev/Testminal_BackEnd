import { DrawingColor } from './drawing-color';
import { DrawingColorModelInfo } from './drawing-color-model-info';
import { DrawingText3DType, PresetMaterialType } from './enums';
import { ShapeBevel3DProperties } from './shape-bevel3d-properties';
export class Shape3DProperties {
    constructor() {
        this.topBevel = new ShapeBevel3DProperties();
        this.bottomBevel = new ShapeBevel3DProperties();
        this.contourColor = new DrawingColor(DrawingColorModelInfo.empty);
        this.extrusionColor = new DrawingColor(DrawingColorModelInfo.empty);
        this.presetMaterial = PresetMaterialType.WarmMatte;
    }
    get isDefault() {
        return this.contourColor.isEmpty && this.extrusionColor.isEmpty && this.topBevel.isDefault && this.bottomBevel.isDefault &&
            this.presetMaterial == Shape3DProperties.defaultPresetMaterialType && this.extrusionHeight == Shape3DProperties.defaultExtrusionHeight &&
            this.contourWidth == Shape3DProperties.defaultContourWidth && this.shapeDepth == Shape3DProperties.defaultShapeDepth;
    }
    get type() {
        return DrawingText3DType.Shape3D;
    }
    clone() {
        const obj = new Shape3DProperties();
        obj.topBevel = this.topBevel;
        obj.bottomBevel = this.bottomBevel;
        obj.contourColor = this.contourColor.clone();
        obj.extrusionColor = this.extrusionColor.clone();
        obj.presetMaterial = this.presetMaterial;
        obj.extrusionHeight = this.extrusionHeight;
        obj.contourWidth = this.contourWidth;
        obj.shapeDepth = this.shapeDepth;
        return obj;
    }
}
Shape3DProperties.defaultExtrusionHeight = 0;
Shape3DProperties.defaultContourWidth = 0;
Shape3DProperties.defaultShapeDepth = 0;
Shape3DProperties.defaultPresetMaterialType = PresetMaterialType.WarmMatte;
