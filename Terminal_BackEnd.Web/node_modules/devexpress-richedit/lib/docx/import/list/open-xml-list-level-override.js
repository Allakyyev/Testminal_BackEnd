import { MaskedCharacterProperties } from '../../../core/model/character/character-properties';
import { OverrideListLevel } from '../../../core/model/numbering-lists/list-level';
import { ListLevelProperties } from '../../../core/model/numbering-lists/list-level-properties';
import { MaskedParagraphProperties } from '../../../core/model/paragraph/paragraph-properties';
export class OpenXmlListLevelOverride {
    constructor(documentModel) {
        this.documentModel = documentModel;
    }
    get newStart() { return this._newStart; }
    set newStart(val) {
        this._newStart = val;
        this.overrideStart = true;
        if (this.level != null)
            this.applyStartOverride(this.level);
    }
    getOverrideListLevel() {
        if (this.level == null) {
            this.level = new OverrideListLevel(this.documentModel, MaskedCharacterProperties.createDefault(this.documentModel), MaskedParagraphProperties.createDefault(this.documentModel), new ListLevelProperties());
            this.applyStartOverride(this.level);
        }
        return this.level;
    }
    getOverrideListLevelCore(originalLevel) {
        if (this.level != null)
            return this.level;
        else if (this.overrideStart) {
            originalLevel.overrideStart = true;
            originalLevel.setNewStart(this._newStart);
        }
        return originalLevel;
    }
    applyStartOverride(level) {
        if (this.overrideStart) {
            level.overrideStart = true;
            level.changeListLevelProperties((prop) => prop.start = this._newStart);
        }
    }
}
