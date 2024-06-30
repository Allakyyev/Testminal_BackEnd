import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { MaskedCharacterPropertiesBundle } from '../../../rich-utils/properties-bundle';
import { FieldInsertedSubDocumentChange } from '../../changes/sub-document/field/inserted';
import { Field } from '../../fields/field';
import { InsertTextManipulatorParams } from '../../manipulators/text-manipulator/insert-text-manipulator-params';
import { RichUtils } from '../../rich-utils';
import { RunType } from '../../runs/run-type';
import { SubDocumentPosition } from '../../sub-document';
import { HistoryItem } from '../base/history-item';
export class FieldInsertHistoryItem extends HistoryItem {
    constructor(modelManipulator, subDocument, startCodePos, codePartLength, resultPartLength, showCode, charPropsBundle) {
        super(modelManipulator);
        this.subDocument = subDocument;
        this.startFieldPos = startCodePos;
        this.separatorPos = this.startFieldPos + 1 + codePartLength;
        this.endPos = this.separatorPos + 1 + resultPartLength + 1;
        this.showCode = showCode;
        this.charPropsBundle = charPropsBundle;
    }
    redo() {
        var specChars = RichUtils.specialCharacters;
        var textManipulator = this.modelManipulator.text;
        const characterStyle = this.charPropsBundle.style;
        const charProp = this.charPropsBundle.props;
        textManipulator.insertTextInner(new InsertTextManipulatorParams(new SubDocumentPosition(this.subDocument, this.startFieldPos), new MaskedCharacterPropertiesBundle(charProp, characterStyle), RunType.FieldCodeStartRun, specChars.FieldCodeStartRun));
        textManipulator.insertTextInner(new InsertTextManipulatorParams(new SubDocumentPosition(this.subDocument, this.separatorPos), new MaskedCharacterPropertiesBundle(charProp, characterStyle), RunType.FieldCodeEndRun, specChars.FieldCodeEndRun));
        textManipulator.insertTextInner(new InsertTextManipulatorParams(new SubDocumentPosition(this.subDocument, this.endPos - 1), new MaskedCharacterPropertiesBundle(charProp, characterStyle), RunType.FieldResultEndRun, specChars.FieldResultEndRun));
        var fields = this.subDocument.fields;
        var fieldIndex = Field.normedBinaryIndexOf(fields, this.startFieldPos + 1);
        var newFieldIndex = fieldIndex + 1;
        var newField = new Field(this.subDocument.positionManager, newFieldIndex, this.startFieldPos, this.separatorPos, this.endPos, this.showCode, undefined);
        Field.addField(fields, newField);
        this.modelManipulator.notifyModelChanged(new FieldInsertedSubDocumentChange(this.subDocument.id, this.startFieldPos, this.separatorPos, this.endPos));
    }
    undo() {
        this.modelManipulator.range.removeIntervalWithoutHistory(this.subDocument, new FixedInterval(this.startFieldPos, 1), false);
        this.modelManipulator.range.removeIntervalWithoutHistory(this.subDocument, new FixedInterval(this.endPos - 2, 1), false);
        this.modelManipulator.range.removeIntervalWithoutHistory(this.subDocument, new FixedInterval(this.separatorPos - 1, 1), false);
    }
}
