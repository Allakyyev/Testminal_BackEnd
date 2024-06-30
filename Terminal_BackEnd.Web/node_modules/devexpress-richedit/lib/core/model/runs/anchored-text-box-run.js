import { MaskedCharacterPropertiesBundle } from '../../rich-utils/properties-bundle';
import { NonVisualDrawingObjectInfo } from '../manipulators/picture-manipulator/non-visual-drawing-object-info';
import { RunBase, TextBoxRun } from './run-base';
import { RunType } from './run-type';
export class AnchoredTextBoxRun extends TextBoxRun {
    constructor(startOffset, paragraph, charPropsBundle, shape, subDocId, size, anchorInfo, objectId, textBoxProperties, containerProperties = new NonVisualDrawingObjectInfo()) {
        super(startOffset, paragraph, charPropsBundle, shape, subDocId, textBoxProperties, containerProperties);
        this.size = size;
        this.anchorInfo = anchorInfo;
        this.anchoredObjectID = objectId < 0 ? RunBase.anchoredObjectIdCounter++ : objectId;
    }
    getType() {
        return RunType.AnchoredTextBoxRun;
    }
    clone() {
        return new AnchoredTextBoxRun(this.startOffset, this.paragraph, new MaskedCharacterPropertiesBundle(this.maskedCharacterProperties, this.characterStyle), this.shape.clone(), this.subDocId, this.size.clone(), this.anchorInfo.clone(), -1, this.textBoxProperties.clone(), this.containerProperties.clone());
    }
    cloneToNewSubDocument(subDocument) {
        return new AnchoredTextBoxRun(this.startOffset, subDocument.getParagraphByPosition(this.paragraph.startLogPosition.value), new MaskedCharacterPropertiesBundle(subDocument.documentModel.cache.maskedCharacterPropertiesCache.getItem(this.maskedCharacterProperties), subDocument.documentModel.stylesManager.getCharacterStyleByName(this.characterStyle.styleName)), this.shape.clone(), this.subDocId, this.size.clone(), this.anchorInfo.clone(), -1, this.textBoxProperties.clone());
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.anchorInfo = obj.anchorInfo.clone();
        this.size = obj.size.clone();
    }
}
