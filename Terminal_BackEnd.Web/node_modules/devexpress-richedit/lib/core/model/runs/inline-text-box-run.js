import { MaskedCharacterPropertiesBundle } from '../../rich-utils/properties-bundle';
import { NonVisualDrawingObjectInfo } from '../manipulators/picture-manipulator/non-visual-drawing-object-info';
import { TextBoxRun } from './run-base';
import { RunType } from './run-type';
export class InlineTextBoxRun extends TextBoxRun {
    constructor(startOffset, paragraph, charPropsBundle, shape, subDocId, size, textBoxProperties, containerProperties = new NonVisualDrawingObjectInfo()) {
        super(startOffset, paragraph, charPropsBundle, shape, subDocId, textBoxProperties, containerProperties);
        this.size = size;
    }
    getType() {
        return RunType.InlineTextBoxRun;
    }
    clone() {
        return new InlineTextBoxRun(this.startOffset, this.paragraph, new MaskedCharacterPropertiesBundle(this.maskedCharacterProperties, this.characterStyle), this.shape.clone(), this.subDocId, this.size.clone(), this.textBoxProperties.clone());
    }
    cloneToNewSubDocument(subDocument) {
        return new InlineTextBoxRun(this.startOffset, subDocument.getParagraphByPosition(this.paragraph.startLogPosition.value), new MaskedCharacterPropertiesBundle(subDocument.documentModel.cache.maskedCharacterPropertiesCache.getItem(this.maskedCharacterProperties), subDocument.documentModel.stylesManager.getCharacterStyleByName(this.characterStyle.styleName)), this.shape.clone(), this.subDocId, this.size.clone(), this.textBoxProperties.clone());
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.size = obj.size.clone();
    }
}
