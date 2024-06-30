import { __awaiter } from "tslib";
import { HueModulationColorTransform } from '../../../../../../core/model/drawing/transform/hue-modulation-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationHueModulate extends ColorTransformDestinationBase {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new HueModulationColorTransform(this.getIntegerValue(reader)));
        });
    }
}
