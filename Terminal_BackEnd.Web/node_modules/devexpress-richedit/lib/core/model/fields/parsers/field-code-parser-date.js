import { DateTimeFieldFormatter } from '@devexpress/utils/lib/formatters/date-time-field';
import { FieldName } from '../names';
import { FieldSwitchType } from './field-code-parser';
import { FieldCodeParserClientUpdatingBase } from './field-code-parser-client-updating-base';
export class FieldCodeParserDate extends FieldCodeParserClientUpdatingBase {
    get name() { return FieldName.Date; }
    fillResult() {
        const dateFormatter = new DateTimeFieldFormatter(this.modelManager.richOptions.cultureOpts);
        const currDate = new Date();
        let dateText;
        var dateFormatSwitches = [];
        for (var i = 0, switchInfo; switchInfo = this.switchInfoList[i]; i++)
            if (switchInfo.type == FieldSwitchType.DateAndTime)
                dateFormatSwitches.push(switchInfo);
        switch (dateFormatSwitches.length) {
            case 1:
                dateText = dateFormatter.format(currDate, dateFormatSwitches[0].arg);
                break;
            case 0:
            default:
                dateText = dateFormatter.format(currDate, this.getDefaultFormat());
                break;
        }
        if (dateText) {
            this.setInputPositionState();
            this.replaceTextByInterval(this.getTopField().getResultInterval(), dateText);
        }
        return true;
    }
    getDefaultFormat() {
        return this.modelManager.richOptions.fields.defaultDateFormat;
    }
}
