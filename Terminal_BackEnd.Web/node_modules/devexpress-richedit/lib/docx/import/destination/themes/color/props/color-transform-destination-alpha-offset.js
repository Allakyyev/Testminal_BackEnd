import { __awaiter } from "tslib";
import { AlphaOffsetColorTransform } from '../../../../../../core/model/drawing/transform/alpha-offset-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationAlphaOffset extends ColorTransformDestinationBase {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new AlphaOffsetColorTransform(this.getIntegerValue(reader)));
        });
    }
}
