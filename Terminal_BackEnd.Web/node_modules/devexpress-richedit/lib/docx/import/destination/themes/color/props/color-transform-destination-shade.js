import { __awaiter } from "tslib";
import { ShadeColorTransform } from '../../../../../../core/model/drawing/transform/shade-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationShade extends ColorTransformDestinationBase {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new ShadeColorTransform(this.getIntegerValue(reader)));
        });
    }
}
