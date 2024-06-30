import { __awaiter } from "tslib";
import { HueOffsetColorTransform } from '../../../../../../core/model/drawing/transform/hue-offset-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationHueOffset extends ColorTransformDestinationBase {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new HueOffsetColorTransform(this.getIntegerValue(reader)));
        });
    }
}
