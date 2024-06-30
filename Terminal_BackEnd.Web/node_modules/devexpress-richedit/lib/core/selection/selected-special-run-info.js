import { RunType } from '../model/runs/run-type';
import { isDefined } from '@devexpress/utils/lib/utils/common';
export class SelectedSpecialRunInfo {
    constructor() {
        this.noSpecRun();
    }
    get picturePos() {
        return isDefined(this.picturePosition) ? this.picturePosition.value : -1;
    }
    get textBoxPos() {
        return isDefined(this.textBoxPosition) ? this.textBoxPosition.value : -1;
    }
    noSpecRun() {
        this.setSpecRunInfo(null, -1, -1, false, -1);
    }
    setSpecRunInfo(parentSubDocument, picturePos, textBoxPos, isAnchoredObject, textBoxInnerSubDocumentId) {
        if (isDefined(this.picturePosition)) {
            this.parentSubDocument.positionManager.unregisterSpecRunPosition();
            this.picturePosition = null;
        }
        if (picturePos > -1)
            this.picturePosition = parentSubDocument.positionManager.registerSpecRunPosition(picturePos);
        if (isDefined(this.textBoxPosition)) {
            this.parentSubDocument.positionManager.unregisterSpecRunPosition();
            this.textBoxPosition = null;
        }
        if (textBoxPos > -1)
            this.textBoxPosition = parentSubDocument.positionManager.registerSpecRunPosition(textBoxPos);
        this.parentSubDocument = parentSubDocument;
        this.isAnchoredObject = isAnchoredObject;
        this.textBoxInnerSubDocumentId = textBoxInnerSubDocumentId;
    }
    init(intervalsInfo, model) {
        const activeSubDocument = intervalsInfo.subDocument;
        if (this.getActualTextBoxInnerSubDocumentId(model) == activeSubDocument.id)
            return;
        if (!intervalsInfo.multiselection && intervalsInfo.interval.length == 1) {
            const pos = intervalsInfo.interval.start;
            const run = activeSubDocument.getRunByPosition(pos);
            switch (run.getType()) {
                case RunType.AnchoredTextBoxRun:
                    this.setSpecRunInfo(activeSubDocument, -1, pos, true, run.subDocId);
                    break;
                case RunType.AnchoredPictureRun:
                    this.setSpecRunInfo(activeSubDocument, pos, -1, true, -1);
                    break;
                case RunType.InlinePictureRun:
                    this.setSpecRunInfo(activeSubDocument, pos, -1, false, -1);
                    break;
                default: this.noSpecRun();
            }
        }
        else
            this.noSpecRun();
    }
    getTextBoxInnerSubDocumentId() {
        return this.textBoxInnerSubDocumentId;
    }
    get isSelectedAnchorObject() {
        return this.isAnchoredObject;
    }
    getParentSubDocument() {
        return this.parentSubDocument;
    }
    getPosition() {
        return this.picturePos > -1 ? this.picturePos : this.textBoxPos;
    }
    getPicturePosition() {
        return this.picturePos;
    }
    getTextBoxPosition() {
        return this.textBoxPos;
    }
    isPictureSelected() {
        return this.picturePos > -1;
    }
    isTextBoxSelected() {
        return this.textBoxPos > -1;
    }
    isSelected() {
        return this.isPictureSelected() || this.isTextBoxSelected();
    }
    clone() {
        const obj = new SelectedSpecialRunInfo();
        obj.picturePosition = this.picturePosition;
        obj.textBoxPosition = this.textBoxPosition;
        obj.parentSubDocument = this.parentSubDocument;
        obj.isAnchoredObject = this.isAnchoredObject;
        obj.textBoxInnerSubDocumentId = this.textBoxInnerSubDocumentId;
        return obj;
    }
    getActualTextBoxInnerSubDocumentId(model) {
        if (this.textBoxInnerSubDocumentId < 1)
            return this.textBoxInnerSubDocumentId;
        this.textBoxInnerSubDocumentId = model.subDocumentsCollection.collection[this.textBoxInnerSubDocumentId].getActualSubDocument().id;
        return this.textBoxInnerSubDocumentId;
    }
}
