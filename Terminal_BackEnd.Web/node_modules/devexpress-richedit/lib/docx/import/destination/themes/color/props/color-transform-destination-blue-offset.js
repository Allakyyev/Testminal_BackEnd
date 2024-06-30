import { __awaiter } from "tslib";
import { BlueOffsetColorTransform } from '../../../../../../core/model/drawing/transform/blue-offset-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationBlueOffset extends ColorTransformDestinationBase {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new BlueOffsetColorTransform(this.getIntegerValue(reader)));
        });
    }
}
