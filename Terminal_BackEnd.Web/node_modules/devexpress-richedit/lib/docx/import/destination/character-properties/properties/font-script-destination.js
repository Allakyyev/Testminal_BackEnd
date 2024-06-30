import { __awaiter } from "tslib";
import { CharacterPropertyDescriptor } from '../../../../../core/model/character/character-property-descriptor';
import { CharacterFormattingScript } from '../../../../../core/model/character/enums';
import { DocxNsType } from '../../../../utils/constants';
import { CharacterFormattingLeafElementDestination } from '../character-formatting-leaf-element-destination';
export class FontScriptDestination extends CharacterFormattingLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = reader.getAttributeNS('val', this.data.constants.namespaces[DocxNsType.WordProcessing].namespace);
            switch (value) {
                case 'baseline':
                    this.setProperty(CharacterFormattingScript.Normal);
                    break;
                case 'subscript':
                    this.setProperty(CharacterFormattingScript.Subscript);
                    break;
                case 'superscript':
                    this.setProperty(CharacterFormattingScript.Superscript);
                    break;
            }
        });
    }
    getDescriptor() {
        return CharacterPropertyDescriptor.script;
    }
}
