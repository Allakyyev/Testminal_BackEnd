import { __awaiter } from "tslib";
import { GammaColorTransform } from '../../../../../../core/model/drawing/transform/gamma-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationGamma extends ColorTransformDestinationBase {
    processElementOpen(_reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new GammaColorTransform());
        });
    }
}
