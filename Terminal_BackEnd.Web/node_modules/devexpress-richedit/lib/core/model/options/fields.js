import { convertToFunction } from '../../../base-utils/utils';
import { isDefined, isNonNullString } from '@devexpress/utils/lib/utils/common';
export class FieldsSettings {
    constructor() {
        this.openHyperlinkOnClick = false;
        this.updateFieldsBeforePrint = true;
        this.updateFieldsOnPaste = true;
        this.defaultTimeFormat = FieldsSettings.DEFAULT_TIME_FORMAT;
        this.defaultDateFormat = FieldsSettings.DEFAULT_DATE_FORMAT;
        this.openHyperlinkOnClick = false;
        this.keepHyperlinkResultForInvalidReference = false;
        this.createHyperlinkTooltip = (hyperlinkTooltip, hint) => {
            return `${hyperlinkTooltip}${hint}`;
        };
    }
    ;
    copyFrom(obj) {
        if (isDefined(obj.updateFieldsBeforePrint))
            this.updateFieldsBeforePrint = obj.updateFieldsBeforePrint;
        if (isDefined(obj.updateFieldsOnPaste))
            this.updateFieldsOnPaste = obj.updateFieldsOnPaste;
        if (isNonNullString(obj.defaultTimeFormat))
            this.defaultTimeFormat = obj.defaultTimeFormat;
        if (isNonNullString(obj.defaultDateFormat))
            this.defaultDateFormat = obj.defaultDateFormat;
        if (isDefined(obj.openHyperlinkOnClick))
            this.openHyperlinkOnClick = obj.openHyperlinkOnClick;
        if (isDefined(obj.keepHyperlinkResultForInvalidReference))
            this.keepHyperlinkResultForInvalidReference = obj.keepHyperlinkResultForInvalidReference;
        if (isDefined(obj.createHyperlinkTooltip) && obj.createHyperlinkTooltip !== '') {
            this.createHyperlinkTooltip = convertToFunction(obj.createHyperlinkTooltip);
        }
    }
    clone() {
        const result = new FieldsSettings();
        result.copyFrom(this);
        return result;
    }
}
FieldsSettings.DEFAULT_TIME_FORMAT = 'h:mm am/pm';
FieldsSettings.DEFAULT_DATE_FORMAT = 'M/d/yyyy';
