import { DXEncoding } from '../encoding/dx-encoding';
import { RtfFontInfo } from '../model/character/rtf-font-info';
import { DestinationBase } from './base/destination';
import { DestinationType } from './utils/destination-type';
export class FontTableDestination extends DestinationBase {
    constructor(importer, nestedState = false) {
        super(importer);
        this.nestedState = nestedState;
        this.fontInfo = new RtfFontInfo();
        this.emptyFontInfo = true;
    }
    get destinationType() { return DestinationType.FontTableDestination; }
    get controlCharHT() { return null; }
    get keywordHT() { return null; }
    processKeywordCore(keyword, parameterValue, hasParameter) {
        if (!hasParameter)
            parameterValue = 0;
        this.emptyFontInfo = false;
        switch (keyword) {
            case "f":
                this.fontInfo.id = parameterValue;
                break;
            case "fcharset":
                this.onFontCharset(parameterValue);
                break;
            case "bin":
                return super.processKeywordCore(keyword, parameterValue, hasParameter);
            default:
                return false;
        }
        return true;
    }
    createClone() {
        return new FontTableDestination(this.importer, true);
    }
    addFontInfo() {
        if (this.nestedState && this.emptyFontInfo)
            return;
        this.importer.importers.font.addRtfFontInfo(this.fontInfo);
        this.fontInfo = new RtfFontInfo();
        this.emptyFontInfo = true;
    }
    processCharCore(ch) {
        if (ch == ';') {
            this.addFontInfo();
            this.importer.setCodePage(this.importer.documentProperties.defaultCodePage);
        }
        else {
            if (this.fontInfo.name.length < 256)
                this.fontInfo.name += ch;
            this.emptyFontInfo = false;
        }
    }
    onFontCharset(parameterValue) {
        this.fontInfo.charset = parameterValue;
        if (this.fontInfo.charset >= 0)
            this.importer.setCodePage(DXEncoding.codePageFromCharset(this.fontInfo.charset));
    }
    beforePopRtfState() {
        if (this.nestedState && !this.emptyFontInfo)
            this.addFontInfo();
        super.beforePopRtfState();
    }
    afterPopRtfState() {
        const fontInfo = this.importer.importers.font.fonts.getRtfFontInfoById(this.importer.importers.font.defaultFontNumber);
        this.importer.importers.character.characterFormatting.coreProperties.fontInfo = fontInfo.getCoreObjectByName(this.importer.documentModel);
        if (fontInfo != this.importer.importers.font.fonts.defaultRtfFontInfo && fontInfo.charset >= 0)
            this.importer.documentProperties.defaultCodePage = DXEncoding.codePageFromCharset(fontInfo.charset);
        this.importer.setCodePage(this.importer.documentProperties.defaultCodePage);
    }
}
