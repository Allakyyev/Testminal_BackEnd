import { __awaiter } from "tslib";
import { ComplementColorTransform } from '../../../../../../core/model/drawing/transform/complement-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationComplement extends ColorTransformDestinationBase {
    processElementOpen(_reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new ComplementColorTransform());
        });
    }
}
