import { __awaiter } from "tslib";
import { BlueColorTransform } from '../../../../../../core/model/drawing/transform/blue-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationBlue extends ColorTransformDestinationBase {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new BlueColorTransform(this.getIntegerValue(reader)));
        });
    }
}
