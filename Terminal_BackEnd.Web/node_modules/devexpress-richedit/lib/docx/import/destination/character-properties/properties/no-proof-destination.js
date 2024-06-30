import { __awaiter } from "tslib";
import { CharacterPropertyDescriptor } from '../../../../../core/model/character/character-property-descriptor';
import { CharacterFormattingLeafElementDestination } from '../character-formatting-leaf-element-destination';
export class NoProofDestination extends CharacterFormattingLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setProperty(this.data.readerHelper.getWpSTOnOffValue(reader, 'val'));
        });
    }
    getDescriptor() {
        return CharacterPropertyDescriptor.noProof;
    }
}
