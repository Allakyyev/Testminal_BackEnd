import { __awaiter } from "tslib";
import { LuminanceOffsetColorTransform } from '../../../../../../core/model/drawing/transform/luminance-offset-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationLuminanceOffset extends ColorTransformDestinationBase {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new LuminanceOffsetColorTransform(this.getIntegerValue(reader)));
        });
    }
}
