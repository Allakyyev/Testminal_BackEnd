import { EncodeUtils } from '@devexpress/utils/lib/utils/encode';
import { HtmlConverter } from '../rich-utils/html-converter';
export class MeasureInfo {
    constructor(text, charProp) {
        this.text = text;
        this.charProp = charProp;
        this.resultSize = this.charProp.getSize(this.text);
    }
    get signCssString() {
        return HtmlConverter.getSizeSignificantCssString(this.charProp);
    }
}
export class MeasureInfoText extends MeasureInfo {
    getEncodedText() {
        return EncodeUtils.encodeHtml(this.text);
    }
}
export class MeasureInfoNonText extends MeasureInfo {
    getEncodedText() {
        return this.text;
    }
}
