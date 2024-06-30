import { __awaiter } from "tslib";
import { LuminanceModulationColorTransform } from '../../../../../../core/model/drawing/transform/luminance-modulation-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationLuminanceModulation extends ColorTransformDestinationBase {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new LuminanceModulationColorTransform(this.getIntegerValue(reader)));
        });
    }
}
