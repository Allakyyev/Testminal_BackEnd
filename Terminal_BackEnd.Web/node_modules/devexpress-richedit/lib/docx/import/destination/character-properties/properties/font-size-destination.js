import { __awaiter } from "tslib";
import { CharacterPropertyDescriptor } from '../../../../../core/model/character/character-property-descriptor';
import { CharacterFormattingLeafElementDestination } from '../character-formatting-leaf-element-destination';
export class FontSizeDestination extends CharacterFormattingLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = this.data.readerHelper.getWpSTIntegerValue(reader, 'val', -1);
            if (value > 0)
                this.setProperty(Math.max(1, value / 2));
        });
    }
    getDescriptor() {
        return CharacterPropertyDescriptor.size;
    }
}
