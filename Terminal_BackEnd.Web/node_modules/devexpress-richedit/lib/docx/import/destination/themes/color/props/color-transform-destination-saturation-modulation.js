import { __awaiter } from "tslib";
import { SaturationModulationColorTransform } from '../../../../../../core/model/drawing/transform/saturation-modulation-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationSaturationModulation extends ColorTransformDestinationBase {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new SaturationModulationColorTransform(this.getIntegerValue(reader)));
        });
    }
}
