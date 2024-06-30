import { __awaiter } from "tslib";
import { MapCreator } from '../../../../base-utils/map-creator';
import { ColorHelper } from '../../../../core/model/color/color';
import { DrawingColor } from '../../../../core/model/drawing/drawing-color';
import { DrawingColorModelInfo } from '../../../../core/model/drawing/drawing-color-model-info';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { ElementDestination, LeafElementDestination } from '../destination';
import { HexRGBColorDestination } from '../themes/color/hex-rgbcolor-destination';
import { PresetColorDestination } from '../themes/color/preset-color-destination';
import { SchemeColorDestination } from '../themes/color/scheme-color-destination';
import { GraphicFrameDestination } from './drawing-destination';
import { AlphaColorTransform } from '../../../../core/model/drawing/transform/alpha-color-transform';
import { isDefined } from '@devexpress/utils/lib/utils/common';
import { DXColor } from '../../../../core/model/color/dx-color';
export class WordProcessingShapePropertiesDestination extends ElementDestination {
    constructor(data, shape, size) {
        super(data);
        this.shape = shape;
        this.size = size;
        this.fillColor = new DrawingColor(DrawingColorModelInfo.empty);
    }
    get elementHandlerTable() {
        return WordProcessingShapePropertiesDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    static onSolidFill(data, _reader) {
        return new SolidFillDestination(data, WordProcessingShapePropertiesDestination.getThis(data).fillColor);
    }
    static onNoFill(data, _reader) {
        return new NoFillDestination(data, WordProcessingShapePropertiesDestination.getThis(data).fillColor);
    }
    static onOutline(data, _reader) {
        return new OutlineDestination(data, WordProcessingShapePropertiesDestination.getThis(data).shape);
    }
    static onGraphicFrame(data, _reader) {
        return new GraphicFrameDestination(data, WordProcessingShapePropertiesDestination.getThis(data).size);
    }
    processElementClose(_reader) {
        const alphaTransform = this.getAlphaTransform();
        let color = this.fillColor.color.toRgb(this.data.documentModel.colorProvider);
        if (isDefined(alphaTransform))
            color = DXColor.fromArgb(alphaTransform.value, color);
        this.shape.fillColor = color;
    }
    getAlphaTransform() {
        for (let transform of this.fillColor.transforms.transforms)
            if (transform instanceof AlphaColorTransform)
                return transform;
        return null;
    }
}
WordProcessingShapePropertiesDestination.handlerTable = new MapCreator()
    .add('solidFill', WordProcessingShapePropertiesDestination.onSolidFill)
    .add('noFill', WordProcessingShapePropertiesDestination.onNoFill)
    .add('ln', WordProcessingShapePropertiesDestination.onOutline)
    .add('xfrm', WordProcessingShapePropertiesDestination.onGraphicFrame)
    .get();
export class SolidFillDestination extends ElementDestination {
    constructor(data, color) {
        super(data);
        this.color = color;
    }
    get elementHandlerTable() {
        return SolidFillDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    static onSRgbColor(data, _reader) {
        return new HexRGBColorDestination(data, SolidFillDestination.getThis(data).color);
    }
    static onSchemeColor(data, _reader) {
        return new SchemeColorDestination(data, SolidFillDestination.getThis(data).color);
    }
    static onPresetColor(data, _reader) {
        return new PresetColorDestination(data, SolidFillDestination.getThis(data).color);
    }
}
SolidFillDestination.handlerTable = new MapCreator()
    .add('srgbClr', SolidFillDestination.onSRgbColor)
    .add('schemeClr', SolidFillDestination.onSchemeColor)
    .add('prstClr', SolidFillDestination.onPresetColor)
    .get();
export class NoFillDestination extends LeafElementDestination {
    constructor(data, color) {
        super(data);
        this.color = color;
    }
    processElementOpen(_reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.rgb = ColorHelper.NO_COLOR;
        });
    }
}
export class OutlineDestination extends ElementDestination {
    constructor(data, shape) {
        super(data);
        this.shape = shape;
        this.color = new DrawingColor(new DrawingColorModelInfo());
    }
    get elementHandlerTable() {
        return OutlineDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    static onSolidFill(data, _reader) {
        return new SolidFillDestination(data, OutlineDestination.getThis(data).color);
    }
    static onNoFill(data, _reader) {
        return new NoFillDestination(data, OutlineDestination.getThis(data).color);
    }
    processElementClose(_reader) {
        this.shape.outlineColor = this.color.color.toRgb(this.data.documentModel.colorProvider);
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = this.data.readerHelper.getIntegerValue(reader, 'w', Number.MIN_VALUE);
            if (value != Number.MIN_VALUE)
                this.shape.outlineWidth = UnitConverter.emuToTwips(value);
        });
    }
}
OutlineDestination.handlerTable = new MapCreator()
    .add('solidFill', OutlineDestination.onSolidFill)
    .add('noFill', OutlineDestination.onNoFill)
    .get();
