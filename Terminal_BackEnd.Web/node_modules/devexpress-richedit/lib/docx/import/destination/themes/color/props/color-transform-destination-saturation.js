import { __awaiter } from "tslib";
import { SaturationColorTransform } from '../../../../../../core/model/drawing/transform/saturation-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationSaturation extends ColorTransformDestinationBase {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new SaturationColorTransform(this.getIntegerValue(reader)));
        });
    }
}
