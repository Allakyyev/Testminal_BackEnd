import { __awaiter } from "tslib";
import { RedOffsetColorTransform } from '../../../../../../core/model/drawing/transform/red-offset-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationRedOffset extends ColorTransformDestinationBase {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new RedOffsetColorTransform(this.getIntegerValue(reader)));
        });
    }
}
