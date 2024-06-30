import { TcInfo } from '../field';
import { FieldName } from '../names';
import { FieldSwitchType } from './field-code-parser';
import { FieldCodeParserClientUpdatingBase } from './field-code-parser-client-updating-base';
export class FieldCodeParserTc extends FieldCodeParserClientUpdatingBase {
    get name() { return FieldName.Tc; }
    fillResult() {
        const field = this.getTopField();
        this.updateTcInfo(field);
        return true;
    }
    updateTcInfo(field) {
        let identifierSwitch, levelSwitch;
        for (let i = 0, switchInfo; switchInfo = this.switchInfoList[i]; i++)
            if (switchInfo.type == FieldSwitchType.FieldSpecific) {
                switch (switchInfo.name.toLocaleUpperCase()) {
                    case "F":
                        identifierSwitch = switchInfo;
                        break;
                    case "L":
                        levelSwitch = switchInfo;
                        break;
                }
            }
        if (identifierSwitch && identifierSwitch.arg) {
            const text = !!this.parameterInfoList[0] ? this.parameterInfoList[0].text : "";
            const tcInfo = new TcInfo(identifierSwitch.arg, text, levelSwitch ? Number(levelSwitch.arg) : 1);
            field.setNewTcInfo(tcInfo);
        }
    }
    needUpdateInfo() {
        return true;
    }
    updateInfoCore() {
        this.updateTcInfo(this.getTopField());
    }
}
