import { __awaiter } from "tslib";
import { TintColorTransform } from '../../../../../../core/model/drawing/transform/tint-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationTint extends ColorTransformDestinationBase {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new TintColorTransform(this.getIntegerValue(reader)));
        });
    }
}
