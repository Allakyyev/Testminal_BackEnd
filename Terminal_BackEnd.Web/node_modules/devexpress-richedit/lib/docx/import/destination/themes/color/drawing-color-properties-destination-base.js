import { __awaiter } from "tslib";
import { MapCreator } from '../../../../../base-utils/map-creator';
import { DrawingColorModelInfo } from '../../../../../core/model/drawing/drawing-color-model-info';
import { ElementDestination } from '../../destination';
import { ColorTransformDestinationAlpha } from './props/color-transform-destination-alpha';
import { ColorTransformDestinationAlphaModulation } from './props/color-transform-destination-alpha-modulation';
import { ColorTransformDestinationAlphaOffset } from './props/color-transform-destination-alpha-offset';
import { ColorTransformDestinationBlue } from './props/color-transform-destination-blue';
import { ColorTransformDestinationBlueModification } from './props/color-transform-destination-blue-modification';
import { ColorTransformDestinationBlueOffset } from './props/color-transform-destination-blue-offset';
import { ColorTransformDestinationComplement } from './props/color-transform-destination-complement';
import { ColorTransformDestinationGamma } from './props/color-transform-destination-gamma';
import { ColorTransformDestinationGray } from './props/color-transform-destination-gray';
import { ColorTransformDestinationGreen } from './props/color-transform-destination-green';
import { ColorTransformDestinationGreenModification } from './props/color-transform-destination-green-modification';
import { ColorTransformDestinationGreenOffset } from './props/color-transform-destination-green-offset';
import { ColorTransformDestinationHue } from './props/color-transform-destination-hue';
import { ColorTransformDestinationHueModulate } from './props/color-transform-destination-hue-modulate';
import { ColorTransformDestinationHueOffset } from './props/color-transform-destination-hue-offset';
import { ColorTransformDestinationInverse } from './props/color-transform-destination-inverse';
import { ColorTransformDestinationInverseGamma } from './props/color-transform-destination-inverse-gamma';
import { ColorTransformDestinationLuminance } from './props/color-transform-destination-luminance';
import { ColorTransformDestinationLuminanceModulation } from './props/color-transform-destination-luminance-modulation';
import { ColorTransformDestinationLuminanceOffset } from './props/color-transform-destination-luminance-offset';
import { ColorTransformDestinationRed } from './props/color-transform-destination-red';
import { ColorTransformDestinationRedModulation } from './props/color-transform-destination-red-modulation';
import { ColorTransformDestinationRedOffset } from './props/color-transform-destination-red-offset';
import { ColorTransformDestinationSaturation } from './props/color-transform-destination-saturation';
import { ColorTransformDestinationSaturationModulation } from './props/color-transform-destination-saturation-modulation';
import { ColorTransformDestinationSaturationOffset } from './props/color-transform-destination-saturation-offset';
import { ColorTransformDestinationShade } from './props/color-transform-destination-shade';
import { ColorTransformDestinationTint } from './props/color-transform-destination-tint';
export class DrawingColorPropertiesDestinationBase extends ElementDestination {
    constructor(data, color) {
        super(data);
        this.color = color;
        this.colorModelInfo = new DrawingColorModelInfo();
    }
    get elementHandlerTable() {
        return DrawingColorPropertiesDestinationBase.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setColorPropertyValue(reader);
        });
    }
    processElementClose(_reader) {
        this.color.color = this.colorModelInfo;
    }
}
DrawingColorPropertiesDestinationBase.handlerTable = new MapCreator()
    .add('alpha', (data) => new ColorTransformDestinationAlpha(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('alphaMod', (data) => new ColorTransformDestinationAlphaModulation(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('alphaOff', (data) => new ColorTransformDestinationAlphaOffset(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('blue', (data) => new ColorTransformDestinationBlue(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('blueMod', (data) => new ColorTransformDestinationBlueModification(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('blueOff', (data) => new ColorTransformDestinationBlueOffset(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('comp', (data) => new ColorTransformDestinationComplement(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('gamma', (data) => new ColorTransformDestinationGamma(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('gray', (data) => new ColorTransformDestinationGray(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('green', (data) => new ColorTransformDestinationGreen(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('greenMod', (data) => new ColorTransformDestinationGreenModification(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('greenOff', (data) => new ColorTransformDestinationGreenOffset(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('hue', (data) => new ColorTransformDestinationHue(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('hueMod', (data) => new ColorTransformDestinationHueModulate(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('hueOff', (data) => new ColorTransformDestinationHueOffset(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('inv', (data) => new ColorTransformDestinationInverse(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('invGamma', (data) => new ColorTransformDestinationInverseGamma(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('lum', (data) => new ColorTransformDestinationLuminance(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('lumMod', (data) => new ColorTransformDestinationLuminanceModulation(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('lumOff', (data) => new ColorTransformDestinationLuminanceOffset(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('red', (data) => new ColorTransformDestinationRed(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('redMod', (data) => new ColorTransformDestinationRedModulation(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('redOff', (data) => new ColorTransformDestinationRedOffset(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('sat', (data) => new ColorTransformDestinationSaturation(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('satMod', (data) => new ColorTransformDestinationSaturationModulation(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('satOff', (data) => new ColorTransformDestinationSaturationOffset(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('shade', (data) => new ColorTransformDestinationShade(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .add('tint', (data) => new ColorTransformDestinationTint(data, DrawingColorPropertiesDestinationBase.getThis(data).color))
    .get();
