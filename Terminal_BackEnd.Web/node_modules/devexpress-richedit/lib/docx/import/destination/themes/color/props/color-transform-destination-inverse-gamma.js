import { __awaiter } from "tslib";
import { InverseGammaColorTransform } from '../../../../../../core/model/drawing/transform/inverse-gamma-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationInverseGamma extends ColorTransformDestinationBase {
    processElementOpen(_reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new InverseGammaColorTransform());
        });
    }
}
