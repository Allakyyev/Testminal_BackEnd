import { __awaiter } from "tslib";
import { HueColorTransform } from '../../../../../../core/model/drawing/transform/hue-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationHue extends ColorTransformDestinationBase {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new HueColorTransform(this.getIntegerValue(reader)));
        });
    }
}
