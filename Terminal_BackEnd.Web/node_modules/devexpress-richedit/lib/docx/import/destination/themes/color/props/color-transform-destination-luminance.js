import { __awaiter } from "tslib";
import { LuminanceColorTransform } from '../../../../../../core/model/drawing/transform/luminance-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationLuminance extends ColorTransformDestinationBase {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new LuminanceColorTransform(this.getIntegerValue(reader)));
        });
    }
}
