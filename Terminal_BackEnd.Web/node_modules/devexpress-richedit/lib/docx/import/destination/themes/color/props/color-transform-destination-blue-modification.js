import { __awaiter } from "tslib";
import { BlueModulationColorTransform } from '../../../../../../core/model/drawing/transform/blue-modulation-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationBlueModification extends ColorTransformDestinationBase {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new BlueModulationColorTransform(this.getIntegerValue(reader)));
        });
    }
}
