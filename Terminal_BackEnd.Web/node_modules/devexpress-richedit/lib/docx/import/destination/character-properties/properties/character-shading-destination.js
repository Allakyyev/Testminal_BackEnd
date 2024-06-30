import { __awaiter } from "tslib";
import { CharacterPropertyDescriptor } from '../../../../../core/model/character/character-property-descriptor';
import { ShadingHelper } from '../../shading/shading-helper';
import { CharacterFormattingLeafElementDestination } from '../character-formatting-leaf-element-destination';
export class CharacterShadingDestination extends CharacterFormattingLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setProperty(ShadingHelper.getShadingValue(this.data, reader));
        });
    }
    getDescriptor() {
        return CharacterPropertyDescriptor.shadingInfo;
    }
}
