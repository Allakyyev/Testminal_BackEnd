import { MapCreator } from '../../../../base-utils/map-creator';
import { CodePages } from '../../encoding/code-pages';
import { RtfFormattingInfo } from '../../model/character/rtf-formatting-info';
import { RtfParsingState } from '../../model/enums';
import { DestinationType } from '../utils/destination-type';
export class DestinationBase {
    constructor(importer) {
        if (importer) {
            this.importer = importer;
            this.subDocument = importer.subDocument;
            const rtfFormattingInfo = this.createRtfFormattingInfo();
            rtfFormattingInfo.copyFrom(importer.importers.character.characterFormatting.rtfFormattingInfo);
            importer.importers.character.characterFormatting.rtfFormattingInfo = rtfFormattingInfo;
        }
    }
    static get empty() { return EmptyDestination._empty; }
    createRtfFormattingInfo() {
        return new RtfFormattingInfo();
    }
    get keywordHT() { return this.importer.keywordHTHolder.getHt(this.destinationType); }
    equals(destination) {
        return destination.destinationType == this.destinationType;
    }
    static onSwitchToHexChar(importer, _ch) {
        importer.parsingState = RtfParsingState.HexData;
    }
    static onEscapedChar(importer, ch) {
        importer.flushDecoder();
        importer.destination.processChar(ch);
    }
    static onUnicodeKeyword(importer, parameterValue, _hasParameter) {
        const ch = String.fromCharCode(parameterValue & 0xFFFF);
        importer.parseUnicodeChar(ch);
    }
    static onOptionalGroupChar(importer, _ch) {
        if (importer.destination.nonEmpty)
            return;
        importer.flushDecoder();
        importer.optionalGroupLevel = importer.savedStatesCount;
    }
    static onBinKeyword(importer, parameterValue, hasParameter) {
        if (hasParameter && parameterValue != 0) {
            importer.binCharCount = parameterValue;
            importer.parsingState = RtfParsingState.BinData;
        }
        else {
            importer.decreaseSkipCount();
        }
    }
    static onAnsiKeyword(importer, _parameterValue, _hasParameter) {
        importer.setCodePage(CodePages.default);
    }
    static onMacKeyword(importer, _parameterValue, _hasParameter) {
        importer.documentProperties.defaultCodePage = DestinationBase.macCodePage;
        importer.setCodePage(DestinationBase.macCodePage);
    }
    static onPcKeyword(importer, _parameterValue, _hasParameter) {
        importer.documentProperties.defaultCodePage = DestinationBase.pcCodePage;
        importer.setCodePage(DestinationBase.pcCodePage);
    }
    static onPcaKeyword(importer, _parameterValue, _hasParameter) {
        importer.documentProperties.defaultCodePage = DestinationBase.pcaCodePage;
        importer.setCodePage(DestinationBase.pcaCodePage);
    }
    static onAnsiCodePageKeyword(importer, parameterValue, hasParameter) {
        if (hasParameter) {
            importer.documentProperties.defaultCodePage = parameterValue;
            importer.setCodePage(parameterValue);
        }
    }
    static onHyphAutoKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onUnicodeCountKeyword(importer, parameterValue, _hasParameter) {
        importer.importers.character.characterFormatting.rtfFormattingInfo.unicodeCharacterByteCount = parameterValue;
    }
    get canAppendText() { return false; }
    canProcessSpecialHexChar() { return false; }
    processControlChar(ch) {
        this.processControlCharCore(ch);
        this.nonEmpty = true;
    }
    processKeyword(keyword, parameterValue, hasParameter) {
        const result = this.processKeywordCore(keyword, parameterValue, hasParameter);
        this.nonEmpty = true;
        return result;
    }
    processChar(ch) {
        this.processCharCore(ch);
        this.nonEmpty = true;
    }
    processText(text) {
        this.processTextCore(text);
        this.nonEmpty = true;
    }
    processBinChar(ch) {
        this.processBinCharCore(ch);
        this.nonEmpty = true;
    }
    processSpecialHexChar(ch) {
        this.processSpecialHexCharCore(ch);
        this.nonEmpty = true;
    }
    processControlCharCore(ch) {
        let translator = null;
        if (this.controlCharHT != null)
            translator = this.controlCharHT[ch];
        if (translator == null)
            translator = DestinationBase.defaultControlCharHT[ch];
        if (translator != null)
            translator(this.importer, ch);
    }
    processKeywordCore(keyword, parameterValue, hasParameter) {
        let translator = null;
        const kwHt = this.keywordHT;
        if (kwHt)
            translator = kwHt[keyword];
        if (translator == null)
            translator = this.importer.keywordHTHolder.defaultKeywords[keyword];
        if (translator == null)
            return false;
        translator(this.importer, parameterValue, hasParameter);
        return true;
    }
    processCharCore(_ch) { }
    processTextCore(_text) { }
    processSpecialHexCharCore(_ch) { }
    processBinCharCore(_ch) { }
    beforePopRtfState() { }
    afterPopRtfState() { }
    increaseGroupLevel() { }
    beforeNestedGroupFinished(nestedDestination) {
        this.beforeNestedGroupFinishedCore(nestedDestination);
        this.nonEmpty = true;
    }
    beforeNestedGroupFinishedCore(_nestedDestination) {
    }
    nestedGroupFinished(_nestedDestination) {
    }
    afterNestedGroupFinished(_nestedDestination) {
    }
    clone() {
        return this.createClone();
    }
}
DestinationBase.macCodePage = 10000;
DestinationBase.pcCodePage = 437;
DestinationBase.pcaCodePage = 850;
DestinationBase.defaultControlCharHT = new MapCreator()
    .add('\'', DestinationBase.onSwitchToHexChar)
    .add('*', DestinationBase.onOptionalGroupChar)
    .get();
class EmptyDestination extends DestinationBase {
    get destinationType() { return DestinationType.EmptyDestination; }
    get controlCharHT() { return {}; }
    get keywordHT() { return {}; }
    createClone() {
        return new EmptyDestination();
    }
}
EmptyDestination._empty = new EmptyDestination();
