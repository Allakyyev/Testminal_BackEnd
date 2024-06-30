import { InsertTextManipulatorParams } from '../../manipulators/text-manipulator/insert-text-manipulator-params';
import { RunType } from '../../runs/run-type';
import { SubDocumentPosition } from '../../sub-document';
import { SequenceInfo } from '../field';
import { FieldName } from '../names';
import { FieldSwitchType } from './field-code-parser';
import { FieldCodeParserClientUpdatingBase } from './field-code-parser-client-updating-base';
export class FieldCodeParserSeq extends FieldCodeParserClientUpdatingBase {
    get name() { return FieldName.Seq; }
    fillResult() {
        let field = this.getTopField();
        let sequenceInfo = this.updateSequenceInfo(field);
        if (!sequenceInfo || sequenceInfo.hidesResult) {
            this.removeInterval(this.getTopField().getResultInterval());
            return true;
        }
        let currentValue = 0;
        for (let i = 0; i <= field.index; i++) {
            const currentField = this.subDocument.fields[i];
            const currentInfo = currentField.getSequenceInfo();
            if (currentInfo && currentInfo.identifier == sequenceInfo.identifier) {
                if (!currentInfo.repeats)
                    currentValue++;
                if (currentInfo.resets)
                    currentValue = currentInfo.resetsWith;
            }
        }
        let resultText = this.getFormattedResult(currentValue);
        this.removeInterval(this.getTopField().getResultInterval());
        this.setInputPositionState();
        this.modelManager.modelManipulator.text.insertTextViaHistory(new InsertTextManipulatorParams(new SubDocumentPosition(this.subDocument, this.getTopField().getResultInterval().start), this.inputPos.charPropsBundle, RunType.TextRun, resultText));
        return true;
    }
    updateSequenceInfo(field) {
        let repeatsSwitch;
        let hidesResultSwitch;
        let resetsSwitch;
        for (let i = 0, switchInfo; switchInfo = this.switchInfoList[i]; i++)
            if (switchInfo.type == FieldSwitchType.FieldSpecific) {
                switch (switchInfo.name.toLocaleUpperCase()) {
                    case "C":
                        repeatsSwitch = switchInfo;
                        break;
                    case "H":
                        hidesResultSwitch = switchInfo;
                        break;
                    case "R":
                        resetsSwitch = switchInfo;
                        break;
                }
            }
        const identifier = !!this.parameterInfoList[0] ? this.parameterInfoList[0].text : "";
        let sequenceInfo = new SequenceInfo(identifier, !!repeatsSwitch, !!hidesResultSwitch, !!resetsSwitch, resetsSwitch ? Number(resetsSwitch.arg) : 0);
        field.setNewSequenceInfo(sequenceInfo);
        return sequenceInfo;
    }
    needUpdateInfo() {
        return true;
    }
    updateInfoCore() {
        this.updateSequenceInfo(this.getTopField());
    }
}
