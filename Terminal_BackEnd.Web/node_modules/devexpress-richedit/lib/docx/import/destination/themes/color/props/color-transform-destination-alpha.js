import { __awaiter } from "tslib";
import { AlphaColorTransform } from '../../../../../../core/model/drawing/transform/alpha-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationAlpha extends ColorTransformDestinationBase {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new AlphaColorTransform(this.getIntegerValue(reader)));
        });
    }
}
