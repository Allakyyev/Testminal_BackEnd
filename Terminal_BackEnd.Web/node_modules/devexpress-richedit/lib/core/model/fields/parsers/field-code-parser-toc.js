import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { TabLeaderType } from '../../../layout/main-structures/layout-boxes/layout-tab-space-box';
import { MaskedParagraphPropertiesBundleFull } from '../../../rich-utils/properties-bundle';
import { ConstBookmark } from '../../bookmarks';
import { CreateBookmarkHistoryItem } from '../../history/items/bookmark-history-items';
import { FieldInsertHistoryItem } from '../../history/items/field-insert-history-item';
import { DeleteTabAtParagraphHistoryItem, InsertTabToParagraphHistoryItem } from '../../history/items/paragraph-properties-history-items';
import { InsertParagraphManipulatorParams } from '../../manipulators/paragraph-manipulator/insert-paragraph-manipulator-params';
import { TabAlign } from '../../paragraph/paragraph';
import { ParagraphStyle, TabInfo } from '../../paragraph/paragraph-style';
import { RichUtils } from '../../rich-utils';
import { SubDocumentInterval, SubDocumentIntervals, SubDocumentPosition } from '../../sub-document';
import { Field } from '../field';
import { TocFieldRequestManager } from '../field-request-manager';
import { FieldName } from '../names';
import { FieldsWaitingForUpdate, UpdateFieldsOptions } from '../tree-creator';
import { FieldSwitchType } from './field-code-parser';
import { FieldCodeParserClientUpdatingBase } from './field-code-parser-client-updating-base';
import { ModelIterator } from '../../model-iterator';
export class FieldCodeParserToc extends FieldCodeParserClientUpdatingBase {
    get name() { return FieldName.Toc; }
    fillResult() {
        this.modelManager.history.beginTransaction();
        const params = this.getTocParserParams();
        const tocElements = this.createTocElements(params);
        this.setInputPositionState();
        this.resetParagraphTabs();
        if (tocElements.length > 0)
            this.createToc(tocElements, params);
        else
            this.insertNoTocText();
        this.modelManager.history.endTransaction();
        return true;
    }
    createTocElements(params) {
        if (params.fromTc)
            return this.createTocElementsByTc(params);
        if (params.fromSeq)
            return this.createTocElementsBySeq(params);
        return this.createTocElementsByOutlineLevel(params);
    }
    createTocElementsByTc(params) {
        let tocElements = [];
        for (let i = 0, field; field = this.subDocument.fields[i]; i++)
            if (field.isTcField()) {
                const tcInfo = field.getTcInfo();
                if (tcInfo.identifier.toUpperCase() == params.tcIdentifier.toUpperCase() &&
                    (!params.useSpecifiedTcLevels || (tcInfo.level >= params.tcLevelStart && tcInfo.level <= params.tcLevelEnd))) {
                    const bookmarkName = this.getBookmarkName(field.getAllFieldInterval());
                    if (this.isValidHeading(tcInfo.text))
                        tocElements.push(new TocElement(bookmarkName, tcInfo.text, tcInfo.level, false));
                }
            }
        return tocElements;
    }
    createTocElementsBySeq(params) {
        let tocElements = [];
        for (let i = 0, field; field = this.subDocument.fields[i]; i++)
            if (field.isSequenceField()) {
                const seqInfo = field.getSequenceInfo();
                if (seqInfo.identifier.toUpperCase() == params.seqIdentifier.toUpperCase()) {
                    const paragraph = this.subDocument.getParagraphByPosition(field.getCodeStartPosition());
                    const paragraphInterval = paragraph.interval;
                    paragraphInterval.length -= 1;
                    const text = this.subDocument.getSimpleText(paragraphInterval).trim();
                    const bookmarkName = this.getBookmarkName(paragraphInterval);
                    if (this.isValidHeading(text))
                        tocElements.push(new TocElement(bookmarkName, text, 1, false));
                }
            }
        return tocElements;
    }
    createTocElementsByOutlineLevel(params) {
        let tocElements = [];
        for (let i = 0, paragraph; paragraph = this.subDocument.paragraphs[i]; i++) {
            const styleOutlineLevel = paragraph.paragraphStyle.getMergedParagraphProperties().outlineLevel;
            const level = params.fromOutlineLevel && styleOutlineLevel <= 0 ?
                paragraph.getParagraphMergedProperties().outlineLevel :
                styleOutlineLevel;
            if (level > 0 && (!params.useSpecifiedLevels || (level >= params.specifiedLevelStart && level <= params.specifiedLevelEnd))) {
                const paragraphInterval = this.getParagraphInterval(paragraph);
                const bookmarkName = this.getBookmarkName(paragraphInterval);
                const mainText = this.subDocument.getSimpleText(paragraph.interval).trim()
                    .replace(new RegExp(RichUtils.specialCharacters.TabMark, "gi"), RichUtils.specialCharacters.Space);
                let text = mainText;
                const hasNumbering = paragraph.getNumberingListIndex() >= 0;
                if (hasNumbering)
                    text = paragraph.getNumberingListText() + paragraph.getNumberingListSeparatorChar() + mainText;
                if (this.isValidHeading(text))
                    tocElements.push(new TocElement(bookmarkName, text, level, hasNumbering));
            }
        }
        return tocElements;
    }
    static getParagraphInterval(subDocument, paragraph) {
        const characterIterator = new ModelIterator(subDocument, false);
        const paragraphMarkPosition = paragraph.interval.end - 1;
        characterIterator.setPosition(paragraph.startLogPosition.value);
        while (characterIterator.getAbsolutePosition() < paragraphMarkPosition && this.isWhiteSpace(characterIterator.getCurrentChar())) {
            if (!characterIterator.moveToNextChar())
                break;
        }
        const intervalStart = characterIterator.getAbsolutePosition();
        const length = paragraph.interval.length - (intervalStart - paragraph.startLogPosition.value) - 1;
        return new FixedInterval(intervalStart, length);
    }
    getParagraphInterval(paragraph) {
        return FieldCodeParserToc.getParagraphInterval(this.subDocument, paragraph);
    }
    static isWhiteSpace(ch) {
        return RichUtils.isWhitespace.test(ch) || ch == RichUtils.specialCharacters.NonBreakingSpace || ch == RichUtils.specialCharacters.PageBreak || ch == RichUtils.specialCharacters.ColumnBreak || ch == RichUtils.specialCharacters.LineBreak;
    }
    createToc(tocElements, params) {
        let fieldsForUpdate = [];
        for (let i = 0, tocElement; tocElement = tocElements[i]; i++) {
            const startPos = this.interval.start;
            this.resetParagraphTabs();
            this.insertHeading(tocElement);
            if (tocElement.hasNumbering)
                this.insertTocNumberingTabInfo(tocElement.level);
            if (!params.useCustomSeparator)
                this.insertDotTabInfo();
            if (!params.omitsPageNumbers || tocElement.level < params.omitsPageNumbersStart || tocElement.level > params.omitsPageNumbersEnd) {
                this.insertSeparator(params);
                fieldsForUpdate.push(this.insetPageRef(tocElement));
            }
            if (params.asHyperlink)
                this.createLocalHyperLink(FixedInterval.fromPositions(startPos, this.interval.end), tocElement.bookmarkName);
            this.setParagraphStyle(tocElement);
            if (tocElements[i + 1]) {
                this.removeInterval(this.interval);
                this.modelManager.modelManipulator.paragraph.insertParagraphViaHistory(new InsertParagraphManipulatorParams(new SubDocumentPosition(this.subDocument, this.interval.start), this.inputPos.charPropsBundle, MaskedParagraphPropertiesBundleFull.notSetted, true, () => { }));
            }
        }
        if (fieldsForUpdate.length > 0) {
            let intervalsForUpdate = [];
            ListUtils.forEach(fieldsForUpdate, (field) => {
                intervalsForUpdate.push(field.getAllFieldInterval());
            });
            new FieldsWaitingForUpdate(this.modelManager, this.layoutFormatterManager, new TocFieldRequestManager(), new SubDocumentIntervals(this.subDocument, intervalsForUpdate), new UpdateFieldsOptions(), () => { }).update(null);
        }
    }
    insertNoTocText() {
        this.replaceTextByInterval(this.interval, this.layoutFormatterManager.stringResources.commonLabels.noTocEntriesFound);
    }
    resetParagraphTabs() {
        const paragraphIndex = this.subDocument.getParagraphIndexByPosition(this.interval.start);
        const paragraph = this.subDocument.paragraphs[paragraphIndex];
        let tabs = paragraph.getTabs();
        let tab;
        while (tab = tabs.positions.pop())
            this.modelManager.history.addAndRedo(new DeleteTabAtParagraphHistoryItem(this.modelManager.modelManipulator, new SubDocumentInterval(this.subDocument, paragraph.interval), tab));
    }
    setParagraphStyle(tocElement) {
        const paragraph = this.subDocument.paragraphs[this.subDocument.getParagraphIndexByPosition(this.interval.start)];
        this.modelManager.modelManipulator.style.applyParagraphStyleByName(new SubDocumentInterval(this.subDocument, paragraph.interval), `${ParagraphStyle.tocStyleName} ${tocElement.level}`);
    }
    insertHeading(tocElement) {
        this.replaceTextByInterval(this.interval, tocElement.text);
    }
    insertSeparator(params) {
        const separator = params.useCustomSeparator ? params.separator : RichUtils.specialCharacters.TabMark;
        this.replaceTextByInterval(this.interval, separator);
    }
    insertDotTabInfo() {
        const sectionProperties = this.modelManager.model.getSectionByPosition(this.interval.start).sectionProperties;
        const tabPosition = sectionProperties.pageWidth - sectionProperties.marginLeft - sectionProperties.marginRight;
        this.insertTabInfo(tabPosition, TabLeaderType.Dots, TabAlign.Right, false);
    }
    insertTocNumberingTabInfo(level) {
        const tocTabWidth = UnitConverter.inchesToTwips(0.31) + (level - 1) * UnitConverter.inchesToTwips(0.15);
        this.insertTabInfo(tocTabWidth, TabLeaderType.None, TabAlign.Left, false);
    }
    insertTabInfo(tabPosition, tabLeaderType, tabAlign, isDefault) {
        const interval = this.interval;
        const tabInfo = new TabInfo(tabPosition, tabAlign, tabLeaderType, false, isDefault);
        this.modelManager.history.addAndRedo(new InsertTabToParagraphHistoryItem(this.modelManager.modelManipulator, new SubDocumentInterval(this.subDocument, interval), tabInfo));
    }
    insetPageRef(tocElement) {
        const interval = this.interval;
        this.modelManager.history.addAndRedo(new FieldInsertHistoryItem(this.modelManager.modelManipulator, this.subDocument, interval.start, 0, interval.length, false, this.inputPos.charPropsBundle));
        let fieldIndex = Field.normedBinaryIndexOf(this.subDocument.fields, interval.start + 1);
        let field = this.subDocument.fields[fieldIndex];
        const code = this.modelManager.model.simpleFormattersManager.formatString("PAGEREF \"{0}\" \\h", tocElement.bookmarkName);
        this.replaceTextByInterval(field.getCodeInterval(), code);
        return field;
    }
    getTocParserParams() {
        let params = new TocParserParameters();
        for (let i = 0, switchInfo; switchInfo = this.switchInfoList[i]; i++)
            if (switchInfo.type == FieldSwitchType.FieldSpecific) {
                switch (switchInfo.name.toLocaleUpperCase()) {
                    case "H":
                        params.asHyperlink = true;
                        break;
                    case "F":
                        params.tcIdentifier = switchInfo.arg;
                        params.fromTc = !!params.tcIdentifier;
                        break;
                    case "C":
                        params.seqIdentifier = switchInfo.arg;
                        params.fromSeq = !!params.seqIdentifier;
                        break;
                    case "U":
                        params.fromOutlineLevel = true;
                        break;
                    case "P":
                        params.useCustomSeparator = true;
                        params.separator = switchInfo.arg;
                        break;
                    case "O":
                        const oArg = new RangedArg(switchInfo.arg);
                        params.useSpecifiedLevels = oArg.isValid();
                        params.specifiedLevelStart = oArg.getStart();
                        params.specifiedLevelEnd = oArg.getEnd();
                        break;
                    case "L":
                        const lArg = new RangedArg(switchInfo.arg);
                        params.useSpecifiedTcLevels = lArg.isValid();
                        params.tcLevelStart = lArg.getStart();
                        params.tcLevelEnd = lArg.getEnd();
                        break;
                    case "N":
                        params.omitsPageNumbers = true;
                        const nArg = new RangedArg(switchInfo.arg);
                        if (nArg.isValid()) {
                            params.omitsPageNumbersStart = nArg.getStart();
                            params.omitsPageNumbersEnd = nArg.getEnd();
                        }
                        else {
                            params.omitsPageNumbersStart = 1;
                            params.omitsPageNumbersEnd = 9;
                        }
                        break;
                }
            }
        return params;
    }
    isValidHeading(text) {
        if (!text)
            return false;
        for (let i = 0, char; char = text[i]; i++)
            if (!RichUtils.isWhitespace.test(char))
                return true;
        return false;
    }
    get interval() {
        let pos = this.getTopField().getResultInterval().end;
        return new FixedInterval(pos, 0);
    }
    getBookmarkName(interval) {
        const bookmark = ListUtils.elementBy(this.subDocument.bookmarks, (bm) => bm.isToc() &&
            bm.start == interval.start && bm.end == interval.end);
        return bookmark ? bookmark.name : this.createNewBookmark(interval);
    }
    createNewBookmark(interval) {
        const name = this.generateNewBookmarkName();
        this.modelManager.history.addAndRedo(new CreateBookmarkHistoryItem(this.modelManager.modelManipulator, this.subDocument, new ConstBookmark(interval, name)));
        return name;
    }
    generateNewBookmarkName() {
        while (true) {
            const name = this.modelManager.model.simpleFormattersManager.formatString("_Toc{0}", MathUtils.getRandomInt(0, 10000000000));
            for (let i = 0, bookmark; bookmark = this.subDocument.bookmarks[i]; i++)
                if (bookmark.name.toUpperCase() == name.toUpperCase())
                    continue;
            return name;
        }
    }
}
export class TocParserParameters {
    constructor() {
        this.asHyperlink = false;
        this.fromOutlineLevel = false;
        this.fromTc = false;
        this.fromSeq = false;
        this.useCustomSeparator = false;
        this.useSpecifiedLevels = false;
        this.omitsPageNumbers = false;
        this.useSpecifiedTcLevels = false;
    }
}
export class TocElement {
    constructor(bookmarkName, text, level, hasNumbering) {
        this.bookmarkName = bookmarkName;
        this.text = text;
        this.level = level;
        this.hasNumbering = hasNumbering;
    }
}
export class RangedArg {
    constructor(arg) {
        this.start = Number(arg.split('-')[0]);
        this.end = Number(arg.split('-')[1]);
    }
    getStart() {
        return this.isValid() ? this.start : null;
    }
    getEnd() {
        return this.isValid() ? this.end : null;
    }
    isValid() {
        return !isNaN(this.start) && !isNaN(this.end) && this.start >= 0 && this.end >= 0 && this.end >= this.start;
    }
}
