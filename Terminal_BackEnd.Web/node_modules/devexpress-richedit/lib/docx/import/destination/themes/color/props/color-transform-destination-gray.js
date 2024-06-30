import { __awaiter } from "tslib";
import { GrayscaleColorTransform } from '../../../../../../core/model/drawing/transform/grayscale-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationGray extends ColorTransformDestinationBase {
    processElementOpen(_reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new GrayscaleColorTransform());
        });
    }
}
