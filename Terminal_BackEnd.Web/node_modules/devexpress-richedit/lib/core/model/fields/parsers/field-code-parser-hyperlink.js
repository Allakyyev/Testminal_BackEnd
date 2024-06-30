import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ApplyFieldHyperlinkStyleHistoryItem } from '../../history/items/apply-field-hyperlink-style-history-item';
import { ChangeFieldHyperlinkInfoHistoryItem } from '../../history/items/change-field-hyperlink-info-history-item';
import { SubDocumentInterval } from '../../sub-document';
import { HyperlinkInfo } from '../field';
import { FieldName } from '../names';
import { FieldCodeParserState, FieldSwitchType } from './field-code-parser';
import { FieldCodeParserClientUpdatingBase } from './field-code-parser-client-updating-base';
export class FieldCodeParserHyperlink extends FieldCodeParserClientUpdatingBase {
    get name() { return FieldName.Hyperlink; }
    parseCodeCurrentFieldInternal(_responce) {
        if (this.parseSwitchesAndArgs(true))
            this.fillResult();
        else
            this.removeInterval(this.getTopField().getResultInterval());
        this.parserState = FieldCodeParserState.end;
        return true;
    }
    fillResult() {
        var field = this.getTopField();
        var text = this.parameterInfoList[0] ? this.parameterInfoList[0].text : "";
        var newHyperlinkInfo = this.updateHyperlinkInfo(field, text);
        if (!newHyperlinkInfo) {
            if (!this.modelManager.richOptions.fields.keepHyperlinkResultForInvalidReference)
                this.removeInterval(this.getTopField().getResultInterval());
            return true;
        }
        var modelManipulator = this.modelManager.modelManipulator;
        var resultInterval = field.getResultInterval();
        if (resultInterval.length == 0) {
            var resultText = text.length > 0 ? text : "#" + newHyperlinkInfo.anchor;
            var newResultInterval = new FixedInterval(resultInterval.start, resultText.length);
            this.setInputPositionState();
            this.replaceTextByInterval(resultInterval, resultText);
            this.modelManager.history.addAndRedo(new ApplyFieldHyperlinkStyleHistoryItem(modelManipulator, new SubDocumentInterval(this.subDocument, newResultInterval)));
        }
        this.modelManager.history.addAndRedo(new ChangeFieldHyperlinkInfoHistoryItem(modelManipulator, this.subDocument, field.index, newHyperlinkInfo));
        return true;
    }
    updateHyperlinkInfo(field, text) {
        var newHyperlinkInfo = field.isHyperlinkField() ? field.getHyperlinkInfo().clone() : new HyperlinkInfo("", "", "", false);
        newHyperlinkInfo.visited = false;
        var tipSwitch;
        var bookmarkSwitch;
        for (var i = 0, switchInfo; switchInfo = this.switchInfoList[i]; i++)
            if (switchInfo.type == FieldSwitchType.FieldSpecific) {
                switch (switchInfo.name.toLocaleUpperCase()) {
                    case "O":
                        tipSwitch = switchInfo;
                        break;
                    case "L":
                        bookmarkSwitch = switchInfo;
                        break;
                }
            }
        newHyperlinkInfo.tip = tipSwitch ? tipSwitch.arg : "";
        var splitted = text.split("#");
        if (splitted.length == 1) {
            newHyperlinkInfo.uri = splitted[0];
            newHyperlinkInfo.anchor = bookmarkSwitch ? bookmarkSwitch.arg : "";
            if (newHyperlinkInfo.uri == "" && newHyperlinkInfo.anchor == "")
                return null;
        }
        else {
            newHyperlinkInfo.uri = splitted[0];
            newHyperlinkInfo.anchor = splitted[1];
        }
        return newHyperlinkInfo;
    }
}
