import { __awaiter } from "tslib";
import { RedModulationColorTransform } from '../../../../../../core/model/drawing/transform/red-modulation-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationRedModulation extends ColorTransformDestinationBase {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new RedModulationColorTransform(this.getIntegerValue(reader)));
        });
    }
}
