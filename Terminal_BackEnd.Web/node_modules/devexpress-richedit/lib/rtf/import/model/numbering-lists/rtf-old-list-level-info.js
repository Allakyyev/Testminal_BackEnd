import { MaskedCharacterProperties } from '../../../../core/model/character/character-properties';
import { FontInfo } from '../../../../core/model/fonts/font-info';
import { ListLevelProperties } from '../../../../core/model/numbering-lists/list-level-properties';
export class RtfOldListLevelInfo {
    constructor() {
        this.characterProperties = new MaskedCharacterProperties();
        this.characterProperties.fontInfo = new FontInfo();
        this.characterProperties.fontSize = 12;
        this.characterProperties.setAllUse();
        this.listLevelProperties = new ListLevelProperties();
        this.textBefore = "";
        this.textAfter = "";
        this.indent = 0;
    }
    clone() {
        return null;
    }
    copyFrom(_obj) {
    }
}
