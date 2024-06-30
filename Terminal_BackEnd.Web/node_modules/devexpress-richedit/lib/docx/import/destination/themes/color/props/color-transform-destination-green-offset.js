import { __awaiter } from "tslib";
import { GreenOffsetColorTransform } from '../../../../../../core/model/drawing/transform/green-offset-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationGreenOffset extends ColorTransformDestinationBase {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new GreenOffsetColorTransform(this.getIntegerValue(reader)));
        });
    }
}
