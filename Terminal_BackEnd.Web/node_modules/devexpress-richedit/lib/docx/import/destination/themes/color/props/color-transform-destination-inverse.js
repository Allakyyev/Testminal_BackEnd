import { __awaiter } from "tslib";
import { InverseColorTransform } from '../../../../../../core/model/drawing/transform/inverse-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationInverse extends ColorTransformDestinationBase {
    processElementOpen(_reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new InverseColorTransform());
        });
    }
}
