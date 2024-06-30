import { MaskedCharacterPropertiesBundle } from '../../rich-utils/properties-bundle';
import { RunBase } from './run-base';
import { RunType } from './run-type';
export class TextRun extends RunBase {
    constructor(startOffset, length, paragraph, charPropsBundle) {
        super(startOffset, paragraph, charPropsBundle);
        this.length = length;
    }
    getLength() {
        return this.length;
    }
    setLength(newLength) {
        this.length = newLength;
    }
    getType() {
        return RunType.TextRun;
    }
    incLength(additionalLength) {
        this.length += additionalLength;
    }
    clone() {
        return new TextRun(this.startOffset, this.length, this.paragraph, new MaskedCharacterPropertiesBundle(this.maskedCharacterProperties, this.characterStyle));
    }
    cloneToNewSubDocument(subDocument) {
        return new TextRun(this.startOffset, this.length, subDocument.getParagraphByPosition(this.paragraph.startLogPosition.value), new MaskedCharacterPropertiesBundle(subDocument.documentModel.cache.maskedCharacterPropertiesCache.getItem(this.maskedCharacterProperties), subDocument.documentModel.stylesManager.getCharacterStyleByName(this.characterStyle.styleName)));
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.length = obj.length;
    }
}
