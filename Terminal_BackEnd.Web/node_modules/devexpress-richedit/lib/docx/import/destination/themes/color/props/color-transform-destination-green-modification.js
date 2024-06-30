import { __awaiter } from "tslib";
import { GreenModulationColorTransform } from '../../../../../../core/model/drawing/transform/green-modulation-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationGreenModification extends ColorTransformDestinationBase {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new GreenModulationColorTransform(this.getIntegerValue(reader)));
        });
    }
}
