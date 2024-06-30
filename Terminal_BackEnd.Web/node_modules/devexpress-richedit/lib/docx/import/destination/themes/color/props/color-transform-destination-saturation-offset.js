import { __awaiter } from "tslib";
import { SaturationOffsetColorTransform } from '../../../../../../core/model/drawing/transform/saturation-offset-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationSaturationOffset extends ColorTransformDestinationBase {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new SaturationOffsetColorTransform(this.getIntegerValue(reader)));
        });
    }
}
