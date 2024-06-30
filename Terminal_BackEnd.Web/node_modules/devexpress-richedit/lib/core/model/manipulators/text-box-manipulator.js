import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { AnchoredTextBoxInsertedSubDocumentChange } from '../changes/sub-document/text/anchored-text-box-inserted';
import { SubDocumentInfoType } from '../enums';
import { InsertAnchoredTextBoxHistoryItem } from '../history/items/floating-objects/insert-anchored-picture-history-item';
import { RichUtils } from '../rich-utils';
import { RunType } from '../runs/run-type';
import { RunsBaseManipulator } from './runs-base-manipulator';
export class BaseTextBoxInfo {
    constructor(innerSubDocument, size, shape, anchorInfo, textBoxProperties, containerProperties) {
        this.innerSubDocument = innerSubDocument;
        this.size = size;
        this.shape = shape;
        this.anchorInfo = anchorInfo;
        this.textBoxProperties = textBoxProperties;
        this.containerProperties = containerProperties;
    }
}
export class TextBoxManipulator extends RunsBaseManipulator {
    insertAnchoredTextBoxViaHistoty(subDocPos, charPropsBundle, textBoxInfo) {
        this.history.addAndRedo(new InsertAnchoredTextBoxHistoryItem(this.modelManipulator, subDocPos, charPropsBundle, textBoxInfo));
    }
    insertAnchoredTextBox(subDocPos, charPropsBundle, textBoxInfo) {
        const subDocument = subDocPos.subDocument;
        const insertPositionAtStartDocument = subDocPos.position;
        if (subDocument.isTextBox())
            throw new Error("TextBox can not be inserted into another TextBox");
        const insertedRun = this.modelManipulator.text.insertRunInternal(subDocPos, charPropsBundle, RunType.AnchoredTextBoxRun, RichUtils.specialCharacters.ObjectMark);
        const textBoxRun = subDocument.chunks[insertedRun.chunkIndex].textRuns[insertedRun.runIndex];
        textBoxRun.size.copyFrom(textBoxInfo.size);
        textBoxRun.shape.copyFrom(textBoxInfo.shape);
        textBoxRun.anchorInfo = textBoxInfo.anchorInfo.clone();
        textBoxRun.containerProperties.copyFrom(textBoxInfo.containerProperties);
        let textBoxSubDoc = textBoxInfo.innerSubDocument ?
            textBoxInfo.innerSubDocument :
            this.model.createSubDocument(SubDocumentInfoType.TextBox, subDocument.id);
        textBoxRun.subDocId = textBoxSubDoc.id;
        subDocument.chunks[insertedRun.chunkIndex].textRuns[insertedRun.runIndex].paragraph.length++;
        this.modelManipulator.notifyModelChanged(new AnchoredTextBoxInsertedSubDocumentChange(subDocument.id, textBoxRun.anchoredObjectID, textBoxRun.subDocId, insertPositionAtStartDocument, textBoxInfo.anchorInfo, textBoxRun.containerProperties));
        const interval = new FixedInterval(insertPositionAtStartDocument, 1);
        this.modelManipulator.floatingObject.textBoxSize.setValue(subDocument, interval, textBoxInfo.size);
        this.modelManipulator.floatingObject.shape.fillColor.setValue(subDocument, interval, textBoxInfo.shape.fillColor);
        this.modelManipulator.floatingObject.shape.outlineColor.setValue(subDocument, interval, textBoxInfo.shape.outlineColor);
        this.modelManipulator.floatingObject.shape.outlineWidth.setValue(subDocument, interval, textBoxInfo.shape.outlineWidth);
        this.modelManipulator.floatingObject.textBoxProperties.setValue(subDocument, interval, textBoxInfo.textBoxProperties);
        return textBoxRun;
    }
}
