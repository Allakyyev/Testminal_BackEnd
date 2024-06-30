import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { FieldName } from '../names';
import { FieldSwitchType } from './field-code-parser';
import { FieldCodeParserClientUpdatingBase } from './field-code-parser-client-updating-base';
export class FieldCodeParserFillIn extends FieldCodeParserClientUpdatingBase {
    get name() { return FieldName.FillIn; }
    fillResult() {
        var _a, _b, _c;
        const switches = ListUtils.reducedMap(this.switchInfoList, switchInfo => switchInfo.type == FieldSwitchType.FieldSpecific ? switchInfo : null);
        const defaultPrompt = ((_a = switches[0]) === null || _a === void 0 ? void 0 : _a.name) == 'd' ? switches[0].arg : "";
        const prompt = (_c = (_b = this.parameterInfoList[0]) === null || _b === void 0 ? void 0 : _b.text) !== null && _c !== void 0 ? _c : '';
        const response = window.prompt(prompt, defaultPrompt);
        if (response) {
            this.setInputPositionState();
            this.replaceTextByInterval(this.getTopField().getResultInterval(), response);
        }
        return true;
    }
}
