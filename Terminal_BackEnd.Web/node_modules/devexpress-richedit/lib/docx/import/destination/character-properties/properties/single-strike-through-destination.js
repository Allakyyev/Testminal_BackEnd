import { __awaiter } from "tslib";
import { CharacterPropertyDescriptor } from '../../../../../core/model/character/character-property-descriptor';
import { StrikeoutType } from '../../../../../core/model/character/enums';
import { CharacterFormattingLeafElementDestination } from '../character-formatting-leaf-element-destination';
export class SingleStrikeThroughDestination extends CharacterFormattingLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = this.data.readerHelper.getWpSTOnOffValue(reader, 'val');
            this.setProperty(value ? StrikeoutType.Single : StrikeoutType.None);
        });
    }
    getDescriptor() {
        return CharacterPropertyDescriptor.strikeoutType;
    }
}
