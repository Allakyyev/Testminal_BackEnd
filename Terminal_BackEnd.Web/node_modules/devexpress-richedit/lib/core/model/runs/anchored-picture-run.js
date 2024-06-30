import { MaskedCharacterPropertiesBundle } from '../../rich-utils/properties-bundle';
import { PictureRun, RunBase } from './run-base';
import { RunType } from './run-type';
export class AnchoredPictureRun extends PictureRun {
    constructor(startOffset, paragraph, charPropsBundle, info, objectId) {
        super(startOffset, paragraph, charPropsBundle, info);
        this.anchoredObjectID = objectId < 0 ? RunBase.anchoredObjectIdCounter++ : objectId;
    }
    get anchorInfo() { return this.info.anchorInfo; }
    ;
    set anchorInfo(val) { this.info.anchorInfo = val; }
    ;
    getType() {
        return RunType.AnchoredPictureRun;
    }
    clone() {
        return new AnchoredPictureRun(this.startOffset, this.paragraph, new MaskedCharacterPropertiesBundle(this.maskedCharacterProperties, this.characterStyle), this.info.clone(), -1);
    }
    cloneToNewSubDocument(subDocument) {
        return new AnchoredPictureRun(this.startOffset, subDocument.getParagraphByPosition(this.paragraph.startLogPosition.value), new MaskedCharacterPropertiesBundle(subDocument.documentModel.cache.maskedCharacterPropertiesCache.getItem(this.maskedCharacterProperties), subDocument.documentModel.stylesManager.getCharacterStyleByName(this.characterStyle.styleName)), this.info.cloneToNewSubDocument(subDocument), -1);
    }
}
