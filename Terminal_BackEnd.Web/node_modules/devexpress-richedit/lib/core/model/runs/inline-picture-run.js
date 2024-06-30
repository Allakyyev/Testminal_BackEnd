import { MaskedCharacterPropertiesBundle } from '../../rich-utils/properties-bundle';
import { PictureRun } from './run-base';
import { RunType } from './run-type';
export class InlinePictureRun extends PictureRun {
    constructor(startOffset, paragraph, charPropsBundle, info) {
        super(startOffset, paragraph, charPropsBundle, info);
        this.info.publicAPIID = this.info.publicAPIID >= 0 ? this.info.publicAPIID : this.getNextPublicAPIId();
    }
    get publicAPIId() { return this.info.publicAPIID; }
    getType() {
        return RunType.InlinePictureRun;
    }
    clone() {
        const newInfo = this.info.clone();
        newInfo.publicAPIID = -1;
        return new InlinePictureRun(this.startOffset, this.paragraph, new MaskedCharacterPropertiesBundle(this.maskedCharacterProperties, this.characterStyle), newInfo);
    }
    cloneToNewSubDocument(subDocument) {
        const newInfo = this.info.cloneToNewSubDocument(subDocument);
        return new InlinePictureRun(this.startOffset, subDocument.getParagraphByPosition(this.paragraph.startLogPosition.value), new MaskedCharacterPropertiesBundle(subDocument.documentModel.cache.maskedCharacterPropertiesCache.getItem(this.maskedCharacterProperties), subDocument.documentModel.stylesManager.getCharacterStyleByName(this.characterStyle.styleName)), newInfo);
    }
    getNextPublicAPIId() {
        return InlinePictureRun.nextPublicAPIId++;
    }
}
InlinePictureRun.nextPublicAPIId = 0;
