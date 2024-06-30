import { StringHelper } from '../../../../core/formats/utils/string-helper';
import { MaskedCharacterProperties } from '../../../../core/model/character/character-properties';
import { ListLevelProperties } from '../../../../core/model/numbering-lists/list-level-properties';
import { MaskedParagraphProperties } from '../../../../core/model/paragraph/paragraph-properties';
import { RichUtils } from '../../../../core/model/rich-utils';
import { ListLevelDisplayTextHelper } from '../../../utils/list-level-display-text-helper';
export class RtfListLevel {
    constructor() {
        this.text = "";
        this.numbers = "";
        this.initialize();
        this.listLevelProperties.start = 1;
        this.listLevelProperties.separator = RichUtils.specialCharacters.TabMark;
        this.listLevelProperties.displayFormatString = "{0}.";
        this.listLevelProperties.relativeRestartLevel = 0;
    }
    initialize() {
        this.characterProperties = new MaskedCharacterProperties();
        this.paragraphProperties = new MaskedParagraphProperties();
        this.listLevelProperties = new ListLevelProperties();
    }
    createDisplayFormatString() {
        const placeholderIndices = this.createPlaceholderIndices();
        if (this.text.length == 0)
            return '';
        else
            return StringHelper.removeSpecialSymbols(this.createDisplayFormatStringCore(placeholderIndices));
    }
    createPlaceholderIndices() {
        var count = Math.min(9, this.numbers.length);
        var result = new Array();
        result.push(0);
        for (let i = 0; i < count; i++)
            if (this.numbers.charCodeAt(i) <= this.text.length)
                result.push(this.numbers.charCodeAt(i));
        result.push(this.text.length);
        return result;
    }
    createDisplayFormatStringCore(placeholderIndices) {
        return ListLevelDisplayTextHelper.createDisplayFormatStringCore(placeholderIndices, this.text);
    }
}
