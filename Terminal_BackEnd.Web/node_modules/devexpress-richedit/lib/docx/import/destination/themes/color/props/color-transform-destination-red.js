import { __awaiter } from "tslib";
import { RedColorTransform } from '../../../../../../core/model/drawing/transform/red-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationRed extends ColorTransformDestinationBase {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new RedColorTransform(this.getIntegerValue(reader)));
        });
    }
}
