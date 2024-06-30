import { __awaiter } from "tslib";
import { AlphaModulationColorTransform } from '../../../../../../core/model/drawing/transform/alpha-modulation-color-transform';
import { ColorTransformDestinationBase } from './color-transform-destination-base';
export class ColorTransformDestinationAlphaModulation extends ColorTransformDestinationBase {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.color.transforms.add(new AlphaModulationColorTransform(this.getIntegerValue(reader)));
        });
    }
}
