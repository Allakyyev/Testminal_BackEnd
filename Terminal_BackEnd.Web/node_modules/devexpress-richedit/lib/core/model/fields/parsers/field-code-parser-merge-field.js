import { JSONUpdateFieldCommandResult } from '../../json/enums/json-field-enums';
import { InsertTextManipulatorParams } from '../../manipulators/text-manipulator/insert-text-manipulator-params';
import { RunType } from '../../runs/run-type';
import { SubDocumentInterval, SubDocumentPosition } from '../../sub-document';
import { FieldMailMergeRequestData } from '../field-request-manager';
import { FieldName } from '../names';
import { FieldMailMergeType } from './field-code-parser';
import { FieldCodeParserDocVariable } from './field-code-parser-doc-variable';
export class FieldCodeParserMailMerge extends FieldCodeParserDocVariable {
    get name() { return FieldName.MergeField; }
    getMailMergeType() {
        return FieldMailMergeType.MailMerge;
    }
    insertDefaultText() {
        if (this.modelManager.richOptions.mailMerge.isEnabled && this.modelManager.richOptions.mailMerge.viewMergedData)
            return false;
        const defaultText = this.modelManager.model.simpleFormattersManager.formatString("<<{0}>>", this.parameterInfoList[0].text);
        this.setInputPositionState();
        this.modelManager.modelManipulator.range.removeInterval(new SubDocumentInterval(this.subDocument, this.getTopField().getResultInterval()), true, false);
        this.modelManager.modelManipulator.text.insertTextViaHistory(new InsertTextManipulatorParams(new SubDocumentPosition(this.subDocument, this.getTopField().getResultInterval().start), this.inputPos.charPropsBundle, RunType.TextRun, defaultText));
        return true;
    }
    getRequestData() {
        return new FieldMailMergeRequestData(this.parameterInfoList[0].text);
    }
    getMergeFieldName() {
        if (this.parameterInfoList.length == 0)
            this.parseSwitchesAndArgs(true);
        return this.parameterInfoList[0] ? this.parameterInfoList[0].text : '';
    }
    applyResponse(response) {
        const simpleText = response[JSONUpdateFieldCommandResult.SimpleText];
        if (simpleText === null)
            return false;
        const fieldResultInterval = this.getTopField().getResultInterval();
        this.modelManager.modelManipulator.range.removeInterval(new SubDocumentInterval(this.subDocument, fieldResultInterval), true, false);
        if (simpleText !== "") {
            this.setInputPositionState();
            this.modelManager.modelManipulator.text.insertTextViaHistory(new InsertTextManipulatorParams(new SubDocumentPosition(this.subDocument, fieldResultInterval.start), this.inputPos.charPropsBundle, RunType.TextRun, this.getFormattedResult(simpleText)));
        }
        return true;
    }
}
