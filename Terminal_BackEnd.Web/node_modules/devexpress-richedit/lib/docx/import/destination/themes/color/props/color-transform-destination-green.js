import { __awaiter } from "tslib";
import { GreenColorTransform } from '../../../../../../core/model/drawing/transform/green-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationGreen extends ColorTransformDestinationBase {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new GreenColorTransform(this.getIntegerValue(reader)));
        });
    }
}
