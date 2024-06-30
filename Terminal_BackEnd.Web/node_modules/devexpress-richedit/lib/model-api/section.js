import { ApiParametersChecker } from '../api-utils/api-utils/parameter-checker';
import { SectionColumnCountHistoryItem, SectionEqualWidthColumnsHistoryItem, SectionFooterOffsetHistoryItem, SectionHeaderOffsetHistoryItem, SectionLandscapeHistoryItem, SectionMarginBottomHistoryItem, SectionMarginLeftHistoryItem, SectionMarginRightHistoryItem, SectionMarginTopHistoryItem, SectionPageHeightHistoryItem, SectionPageWidthHistoryItem, SectionPaperKindHistoryItem } from '../core/model/history/items/section-properties-history-items';
import { Constants } from '@devexpress/utils/lib/constants';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { PaperKind, PaperSizeConverter } from '../core/model/section/paper-kind';
import { convertToIntervalApi } from './interval';
import { MarginsApi, SizeApi } from './size';
import { HeaderFooterTypeApi, SubDocumentApi } from './sub-document';
import { Size } from '@devexpress/utils/lib/geometry/size';
export class SectionApi {
    constructor(processor, section) {
        this._section = section;
        this._processor = processor;
    }
    get index() {
        return SearchUtils.normedInterpolationIndexOf(this._processor.modelManager.model.sections, s => s.startLogPosition.value, this._section.startLogPosition.value);
    }
    get interval() {
        return convertToIntervalApi(this._section.interval);
    }
    get margins() {
        const margins = this._section.sectionProperties.margins.clone();
        return new MarginsApi(margins.left, margins.right, margins.top, margins.bottom);
    }
    set margins(margins) {
        margins = ApiParametersChecker.check(margins, 1, false, [
            ApiParametersChecker.objectDescriptor('margins', 'Margins', (val) => val)
        ]);
        ApiParametersChecker.check(margins.left, 1, false, [
            ApiParametersChecker.numberDescriptor('margins.left', (val) => val, 0, Constants.MAX_SAFE_INTEGER)
        ]);
        ApiParametersChecker.check(margins.left, 1, false, [
            ApiParametersChecker.numberDescriptor('margins.right', (val) => val, 0, Constants.MAX_SAFE_INTEGER)
        ]);
        ApiParametersChecker.check(margins.left, 1, false, [
            ApiParametersChecker.numberDescriptor('margins.top', (val) => val, 0, Constants.MAX_SAFE_INTEGER)
        ]);
        ApiParametersChecker.check(margins.left, 1, false, [
            ApiParametersChecker.numberDescriptor('margins.bottom', (val) => val, 0, Constants.MAX_SAFE_INTEGER)
        ]);
        this._processor.beginUpdate();
        this._processor.modelManager.history.addTransaction(history => {
            history.addAndRedo(new SectionMarginLeftHistoryItem(this._processor.modelManager.modelManipulator, this._section.interval, margins.left));
            history.addAndRedo(new SectionMarginRightHistoryItem(this._processor.modelManager.modelManipulator, this._section.interval, margins.right));
            history.addAndRedo(new SectionMarginTopHistoryItem(this._processor.modelManager.modelManipulator, this._section.interval, margins.top));
            history.addAndRedo(new SectionMarginBottomHistoryItem(this._processor.modelManager.modelManipulator, this._section.interval, margins.bottom));
        });
        this._processor.endUpdate();
    }
    get columnCount() {
        return this._section.sectionProperties.columnCount;
    }
    set columnCount(columnCount) {
        columnCount = ApiParametersChecker.check(columnCount, 1, false, [
            ApiParametersChecker.numberDescriptor('columnCount', (val) => val, 1, 64)
        ]);
        this._processor.modelManager.history.addTransaction(history => {
            history.addAndRedo(new SectionColumnCountHistoryItem(this._processor.modelManager.modelManipulator, this._section.interval, columnCount));
            history.addAndRedo(new SectionEqualWidthColumnsHistoryItem(this._processor.modelManager.modelManipulator, this._section.interval, true));
        });
    }
    get pageSize() {
        const size = this._section.sectionProperties.pageSize.clone();
        return new SizeApi(size.width, size.height);
    }
    set pageSize(size) {
        size = ApiParametersChecker.check(size, 1, false, [
            ApiParametersChecker.objectDescriptor('size', 'Size', (val) => val)
        ]);
        ApiParametersChecker.check(size.width, 1, false, [
            ApiParametersChecker.numberDescriptor('size.width', (val) => val, 1, Constants.MAX_SAFE_INTEGER)
        ]);
        ApiParametersChecker.check(size.height, 1, false, [
            ApiParametersChecker.numberDescriptor('size.height', (val) => val, 1, Constants.MAX_SAFE_INTEGER)
        ]);
        const sectionInterval = this._section.interval;
        const secProps = this._section.sectionProperties;
        const newLandscape = size.width > size.height;
        const oldLandscape = secProps.landscape;
        this._processor.modelManager.history.beginTransaction();
        if (oldLandscape !== newLandscape)
            this._processor.modelManager.history.addAndRedo(new SectionLandscapeHistoryItem(this._processor.modelManager.modelManipulator, sectionInterval, newLandscape));
        if (secProps.pageWidth !== size.width || secProps.pageHeight != size.height)
            this._processor.modelManager.history.addAndRedo(new SectionPaperKindHistoryItem(this._processor.modelManager.modelManipulator, sectionInterval, PaperSizeConverter.calculatePaperKind(new Size(size.width, size.height), PaperKind.Custom, 0, PaperKind.Letter)));
        if (secProps.pageWidth !== size.width)
            this._processor.modelManager.history.addAndRedo(new SectionPageWidthHistoryItem(this._processor.modelManager.modelManipulator, sectionInterval, size.width));
        if (secProps.pageHeight !== size.height)
            this._processor.modelManager.history.addAndRedo(new SectionPageHeightHistoryItem(this._processor.modelManager.modelManipulator, sectionInterval, size.height));
        this._processor.modelManager.history.endTransaction();
    }
    get headerOffset() {
        return this._section.sectionProperties.headerOffset;
    }
    set headerOffset(offset) {
        offset = ApiParametersChecker.check(offset, 1, false, [
            ApiParametersChecker.numberDescriptor('offset', (val) => val, 0, Constants.MAX_SAFE_INTEGER)
        ]);
        this._processor.modelManager.history.addAndRedo(new SectionHeaderOffsetHistoryItem(this._processor.modelManager.modelManipulator, this._section.interval, offset));
    }
    get footerOffset() {
        return this._section.sectionProperties.footerOffset;
    }
    set footerOffset(offset) {
        offset = ApiParametersChecker.check(offset, 1, false, [
            ApiParametersChecker.numberDescriptor('offset', (val) => val, 0, Constants.MAX_SAFE_INTEGER)
        ]);
        this._processor.modelManager.history.addAndRedo(new SectionFooterOffsetHistoryItem(this._processor.modelManager.modelManipulator, this._section.interval, offset));
    }
    get paperSize() {
        return this._section.sectionProperties.paperKind;
    }
    set paperSize(paperSize) {
        const modelPaperKind = ApiParametersChecker.check(paperSize, 1, false, [
            ApiParametersChecker.enumDescriptor('paperSize', (val) => val, PaperSizeApi, 'PaperSize')
        ]);
        const modelManipulator = this._processor.modelManager.modelManipulator;
        const history = this._processor.modelManager.history;
        const sectionInterval = this._section.interval;
        this._processor.modelManager.history.beginTransaction();
        try {
            history.addAndRedo(new SectionPaperKindHistoryItem(modelManipulator, sectionInterval, modelPaperKind));
            if (modelPaperKind != PaperKind.Custom) {
                const size = PaperSizeConverter.calculatePaperSize(modelPaperKind);
                history.addAndRedo(new SectionPageWidthHistoryItem(modelManipulator, sectionInterval, size.width));
                history.addAndRedo(new SectionPageHeightHistoryItem(modelManipulator, sectionInterval, size.height));
            }
        }
        finally {
            this._processor.modelManager.history.endTransaction();
        }
    }
    get landscape() {
        return this._section.sectionProperties.landscape;
    }
    set landscape(landscape) {
        landscape = ApiParametersChecker.check(landscape, 1, false, [
            ApiParametersChecker.booleanDescriptor('landscape', v => v)
        ]);
        this._processor.modelManager.history.addAndRedo(new SectionLandscapeHistoryItem(this._processor.modelManager.modelManipulator, this._section.interval, landscape));
    }
    getHeader(type = HeaderFooterTypeApi.Primary, createIfNotExist = true) {
        const hfType = ApiParametersChecker.check(type, 1, false, [
            ApiParametersChecker.enumDescriptor('type', (val) => val, HeaderFooterTypeApi, 'HeaderFooterType')
        ]);
        let sdInfo = this._section.headers.getObject(hfType);
        if (!sdInfo && createIfNotExist) {
            const sectionIndex = SearchUtils.normedInterpolationIndexOf(this._processor.modelManager.model.sections, s => s.startLogPosition.value, this._section.startLogPosition.value);
            this._processor.modelManager.modelManipulator.header.insertHeaderFooter(sectionIndex, true, hfType);
            sdInfo = this._section.headers.getObject(hfType);
        }
        return sdInfo ? new SubDocumentApi(this._processor, sdInfo.getSubDocument(this._processor.modelManager.model)) : null;
    }
    getFooter(type = HeaderFooterTypeApi.Primary, createIfNotExist = true) {
        const hfType = ApiParametersChecker.check(type, 1, false, [
            ApiParametersChecker.enumDescriptor('type', (val) => val, HeaderFooterTypeApi, 'HeaderFooterType')
        ]);
        let sdInfo = this._section.footers.getObject(hfType);
        if (!sdInfo && createIfNotExist) {
            const sectionIndex = SearchUtils.normedInterpolationIndexOf(this._processor.modelManager.model.sections, s => s.startLogPosition.value, this._section.startLogPosition.value);
            this._processor.modelManager.modelManipulator.header.insertHeaderFooter(sectionIndex, false, hfType);
            sdInfo = this._section.footers.getObject(hfType);
        }
        return sdInfo ? new SubDocumentApi(this._processor, sdInfo.getSubDocument(this._processor.modelManager.model)) : null;
    }
}
export var PaperSizeApi;
(function (PaperSizeApi) {
    PaperSizeApi[PaperSizeApi["Custom"] = 0] = "Custom";
    PaperSizeApi[PaperSizeApi["Letter"] = 1] = "Letter";
    PaperSizeApi[PaperSizeApi["LetterSmall"] = 2] = "LetterSmall";
    PaperSizeApi[PaperSizeApi["Tabloid"] = 3] = "Tabloid";
    PaperSizeApi[PaperSizeApi["Ledger"] = 4] = "Ledger";
    PaperSizeApi[PaperSizeApi["Legal"] = 5] = "Legal";
    PaperSizeApi[PaperSizeApi["Statement"] = 6] = "Statement";
    PaperSizeApi[PaperSizeApi["Executive"] = 7] = "Executive";
    PaperSizeApi[PaperSizeApi["A3"] = 8] = "A3";
    PaperSizeApi[PaperSizeApi["A4"] = 9] = "A4";
    PaperSizeApi[PaperSizeApi["A4Small"] = 10] = "A4Small";
    PaperSizeApi[PaperSizeApi["A5"] = 11] = "A5";
    PaperSizeApi[PaperSizeApi["B4"] = 12] = "B4";
    PaperSizeApi[PaperSizeApi["B5"] = 13] = "B5";
    PaperSizeApi[PaperSizeApi["Folio"] = 14] = "Folio";
    PaperSizeApi[PaperSizeApi["Quarto"] = 15] = "Quarto";
    PaperSizeApi[PaperSizeApi["Standard10x14"] = 16] = "Standard10x14";
    PaperSizeApi[PaperSizeApi["Standard11x17"] = 17] = "Standard11x17";
    PaperSizeApi[PaperSizeApi["Note"] = 18] = "Note";
    PaperSizeApi[PaperSizeApi["Number9Envelope"] = 19] = "Number9Envelope";
    PaperSizeApi[PaperSizeApi["Number10Envelope"] = 20] = "Number10Envelope";
    PaperSizeApi[PaperSizeApi["Number11Envelope"] = 21] = "Number11Envelope";
    PaperSizeApi[PaperSizeApi["Number12Envelope"] = 22] = "Number12Envelope";
    PaperSizeApi[PaperSizeApi["Number14Envelope"] = 23] = "Number14Envelope";
    PaperSizeApi[PaperSizeApi["CSheet"] = 24] = "CSheet";
    PaperSizeApi[PaperSizeApi["DSheet"] = 25] = "DSheet";
    PaperSizeApi[PaperSizeApi["ESheet"] = 26] = "ESheet";
    PaperSizeApi[PaperSizeApi["DLEnvelope"] = 27] = "DLEnvelope";
    PaperSizeApi[PaperSizeApi["C5Envelope"] = 28] = "C5Envelope";
    PaperSizeApi[PaperSizeApi["C3Envelope"] = 29] = "C3Envelope";
    PaperSizeApi[PaperSizeApi["C4Envelope"] = 30] = "C4Envelope";
    PaperSizeApi[PaperSizeApi["C6Envelope"] = 31] = "C6Envelope";
    PaperSizeApi[PaperSizeApi["C65Envelope"] = 32] = "C65Envelope";
    PaperSizeApi[PaperSizeApi["B4Envelope"] = 33] = "B4Envelope";
    PaperSizeApi[PaperSizeApi["B5Envelope"] = 34] = "B5Envelope";
    PaperSizeApi[PaperSizeApi["B6Envelope"] = 35] = "B6Envelope";
    PaperSizeApi[PaperSizeApi["ItalyEnvelope"] = 36] = "ItalyEnvelope";
    PaperSizeApi[PaperSizeApi["MonarchEnvelope"] = 37] = "MonarchEnvelope";
    PaperSizeApi[PaperSizeApi["PersonalEnvelope"] = 38] = "PersonalEnvelope";
    PaperSizeApi[PaperSizeApi["USStandardFanfold"] = 39] = "USStandardFanfold";
    PaperSizeApi[PaperSizeApi["GermanStandardFanfold"] = 40] = "GermanStandardFanfold";
    PaperSizeApi[PaperSizeApi["GermanLegalFanfold"] = 41] = "GermanLegalFanfold";
    PaperSizeApi[PaperSizeApi["IsoB4"] = 42] = "IsoB4";
    PaperSizeApi[PaperSizeApi["JapanesePostcard"] = 43] = "JapanesePostcard";
    PaperSizeApi[PaperSizeApi["Standard9x11"] = 44] = "Standard9x11";
    PaperSizeApi[PaperSizeApi["Standard10x11"] = 45] = "Standard10x11";
    PaperSizeApi[PaperSizeApi["Standard15x11"] = 46] = "Standard15x11";
    PaperSizeApi[PaperSizeApi["InviteEnvelope"] = 47] = "InviteEnvelope";
    PaperSizeApi[PaperSizeApi["LetterExtra"] = 50] = "LetterExtra";
    PaperSizeApi[PaperSizeApi["LegalExtra"] = 51] = "LegalExtra";
    PaperSizeApi[PaperSizeApi["TabloidExtra"] = 52] = "TabloidExtra";
    PaperSizeApi[PaperSizeApi["A4Extra"] = 53] = "A4Extra";
    PaperSizeApi[PaperSizeApi["LetterTransverse"] = 54] = "LetterTransverse";
    PaperSizeApi[PaperSizeApi["A4Transverse"] = 55] = "A4Transverse";
    PaperSizeApi[PaperSizeApi["LetterExtraTransverse"] = 56] = "LetterExtraTransverse";
    PaperSizeApi[PaperSizeApi["APlus"] = 57] = "APlus";
    PaperSizeApi[PaperSizeApi["BPlus"] = 58] = "BPlus";
    PaperSizeApi[PaperSizeApi["LetterPlus"] = 59] = "LetterPlus";
    PaperSizeApi[PaperSizeApi["A4Plus"] = 60] = "A4Plus";
    PaperSizeApi[PaperSizeApi["A5Transverse"] = 61] = "A5Transverse";
    PaperSizeApi[PaperSizeApi["B5Transverse"] = 62] = "B5Transverse";
    PaperSizeApi[PaperSizeApi["A3Extra"] = 63] = "A3Extra";
    PaperSizeApi[PaperSizeApi["A5Extra"] = 64] = "A5Extra";
    PaperSizeApi[PaperSizeApi["B5Extra"] = 65] = "B5Extra";
    PaperSizeApi[PaperSizeApi["A2"] = 66] = "A2";
    PaperSizeApi[PaperSizeApi["A3Transverse"] = 67] = "A3Transverse";
    PaperSizeApi[PaperSizeApi["A3ExtraTransverse"] = 68] = "A3ExtraTransverse";
    PaperSizeApi[PaperSizeApi["JapaneseDoublePostcard"] = 69] = "JapaneseDoublePostcard";
    PaperSizeApi[PaperSizeApi["A6"] = 70] = "A6";
    PaperSizeApi[PaperSizeApi["JapaneseEnvelopeKakuNumber2"] = 71] = "JapaneseEnvelopeKakuNumber2";
    PaperSizeApi[PaperSizeApi["JapaneseEnvelopeKakuNumber3"] = 72] = "JapaneseEnvelopeKakuNumber3";
    PaperSizeApi[PaperSizeApi["JapaneseEnvelopeChouNumber3"] = 73] = "JapaneseEnvelopeChouNumber3";
    PaperSizeApi[PaperSizeApi["JapaneseEnvelopeChouNumber4"] = 74] = "JapaneseEnvelopeChouNumber4";
    PaperSizeApi[PaperSizeApi["LetterRotated"] = 75] = "LetterRotated";
    PaperSizeApi[PaperSizeApi["A3Rotated"] = 76] = "A3Rotated";
    PaperSizeApi[PaperSizeApi["A4Rotated"] = 77] = "A4Rotated";
    PaperSizeApi[PaperSizeApi["A5Rotated"] = 78] = "A5Rotated";
    PaperSizeApi[PaperSizeApi["B4JisRotated"] = 79] = "B4JisRotated";
    PaperSizeApi[PaperSizeApi["B5JisRotated"] = 80] = "B5JisRotated";
    PaperSizeApi[PaperSizeApi["JapanesePostcardRotated"] = 81] = "JapanesePostcardRotated";
    PaperSizeApi[PaperSizeApi["JapaneseDoublePostcardRotated"] = 82] = "JapaneseDoublePostcardRotated";
    PaperSizeApi[PaperSizeApi["A6Rotated"] = 83] = "A6Rotated";
    PaperSizeApi[PaperSizeApi["JapaneseEnvelopeKakuNumber2Rotated"] = 84] = "JapaneseEnvelopeKakuNumber2Rotated";
    PaperSizeApi[PaperSizeApi["JapaneseEnvelopeKakuNumber3Rotated"] = 85] = "JapaneseEnvelopeKakuNumber3Rotated";
    PaperSizeApi[PaperSizeApi["JapaneseEnvelopeChouNumber3Rotated"] = 86] = "JapaneseEnvelopeChouNumber3Rotated";
    PaperSizeApi[PaperSizeApi["JapaneseEnvelopeChouNumber4Rotated"] = 87] = "JapaneseEnvelopeChouNumber4Rotated";
    PaperSizeApi[PaperSizeApi["B6Jis"] = 88] = "B6Jis";
    PaperSizeApi[PaperSizeApi["B6JisRotated"] = 89] = "B6JisRotated";
    PaperSizeApi[PaperSizeApi["Standard12x11"] = 90] = "Standard12x11";
    PaperSizeApi[PaperSizeApi["JapaneseEnvelopeYouNumber4"] = 91] = "JapaneseEnvelopeYouNumber4";
    PaperSizeApi[PaperSizeApi["JapaneseEnvelopeYouNumber4Rotated"] = 92] = "JapaneseEnvelopeYouNumber4Rotated";
    PaperSizeApi[PaperSizeApi["Prc16K"] = 93] = "Prc16K";
    PaperSizeApi[PaperSizeApi["Prc32K"] = 94] = "Prc32K";
    PaperSizeApi[PaperSizeApi["Prc32KBig"] = 95] = "Prc32KBig";
    PaperSizeApi[PaperSizeApi["PrcEnvelopeNumber1"] = 96] = "PrcEnvelopeNumber1";
    PaperSizeApi[PaperSizeApi["PrcEnvelopeNumber2"] = 97] = "PrcEnvelopeNumber2";
    PaperSizeApi[PaperSizeApi["PrcEnvelopeNumber3"] = 98] = "PrcEnvelopeNumber3";
    PaperSizeApi[PaperSizeApi["PrcEnvelopeNumber4"] = 99] = "PrcEnvelopeNumber4";
    PaperSizeApi[PaperSizeApi["PrcEnvelopeNumber5"] = 100] = "PrcEnvelopeNumber5";
    PaperSizeApi[PaperSizeApi["PrcEnvelopeNumber6"] = 101] = "PrcEnvelopeNumber6";
    PaperSizeApi[PaperSizeApi["PrcEnvelopeNumber7"] = 102] = "PrcEnvelopeNumber7";
    PaperSizeApi[PaperSizeApi["PrcEnvelopeNumber8"] = 103] = "PrcEnvelopeNumber8";
    PaperSizeApi[PaperSizeApi["PrcEnvelopeNumber9"] = 104] = "PrcEnvelopeNumber9";
    PaperSizeApi[PaperSizeApi["PrcEnvelopeNumber10"] = 105] = "PrcEnvelopeNumber10";
    PaperSizeApi[PaperSizeApi["Prc16KRotated"] = 106] = "Prc16KRotated";
    PaperSizeApi[PaperSizeApi["Prc32KRotated"] = 107] = "Prc32KRotated";
    PaperSizeApi[PaperSizeApi["Prc32KBigRotated"] = 108] = "Prc32KBigRotated";
    PaperSizeApi[PaperSizeApi["PrcEnvelopeNumber1Rotated"] = 109] = "PrcEnvelopeNumber1Rotated";
    PaperSizeApi[PaperSizeApi["PrcEnvelopeNumber2Rotated"] = 110] = "PrcEnvelopeNumber2Rotated";
    PaperSizeApi[PaperSizeApi["PrcEnvelopeNumber3Rotated"] = 111] = "PrcEnvelopeNumber3Rotated";
    PaperSizeApi[PaperSizeApi["PrcEnvelopeNumber4Rotated"] = 112] = "PrcEnvelopeNumber4Rotated";
    PaperSizeApi[PaperSizeApi["PrcEnvelopeNumber5Rotated"] = 113] = "PrcEnvelopeNumber5Rotated";
    PaperSizeApi[PaperSizeApi["PrcEnvelopeNumber6Rotated"] = 114] = "PrcEnvelopeNumber6Rotated";
    PaperSizeApi[PaperSizeApi["PrcEnvelopeNumber7Rotated"] = 115] = "PrcEnvelopeNumber7Rotated";
    PaperSizeApi[PaperSizeApi["PrcEnvelopeNumber8Rotated"] = 116] = "PrcEnvelopeNumber8Rotated";
    PaperSizeApi[PaperSizeApi["PrcEnvelopeNumber9Rotated"] = 117] = "PrcEnvelopeNumber9Rotated";
    PaperSizeApi[PaperSizeApi["PrcEnvelopeNumber10Rotated"] = 118] = "PrcEnvelopeNumber10Rotated";
})(PaperSizeApi || (PaperSizeApi = {}));
