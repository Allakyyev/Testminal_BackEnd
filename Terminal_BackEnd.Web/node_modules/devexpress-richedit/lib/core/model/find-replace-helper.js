import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { isDefined } from '@devexpress/utils/lib/utils/common';
import { LayoutBoxIteratorMainSubDocument } from '../layout-engine/layout-box-iterator/layout-box-iterator-main-sub-document';
import { LayoutBoxIteratorOtherSubDocument } from '../layout-engine/layout-box-iterator/layout-box-iterator-other-sub-document';
import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../layout/document-layout-details-level';
import { LayoutBoxType } from '../layout/main-structures/layout-boxes/layout-box';
import { MaskedCharacterPropertiesBundle } from '../rich-utils/properties-bundle';
import { InsertTextHistoryItem } from './history/items/insert-text-history-item';
import { InsertTextManipulatorParams } from './manipulators/text-manipulator/insert-text-manipulator-params';
import { RichUtils } from './rich-utils';
import { RunType } from './runs/run-type';
import { SubDocumentInterval, SubDocumentPosition } from './sub-document';
export var FindReplaceState;
(function (FindReplaceState) {
    FindReplaceState[FindReplaceState["Start"] = 0] = "Start";
    FindReplaceState[FindReplaceState["Found"] = 1] = "Found";
    FindReplaceState[FindReplaceState["DocumentBegin"] = 2] = "DocumentBegin";
    FindReplaceState[FindReplaceState["DocumentEnd"] = 3] = "DocumentEnd";
    FindReplaceState[FindReplaceState["SearchEnd"] = 4] = "SearchEnd";
})(FindReplaceState || (FindReplaceState = {}));
export var SearchDirection;
(function (SearchDirection) {
    SearchDirection[SearchDirection["Up"] = 1] = "Up";
    SearchDirection[SearchDirection["Down"] = 2] = "Down";
    SearchDirection[SearchDirection["All"] = 3] = "All";
})(SearchDirection || (SearchDirection = {}));
export class FindReplaceHelper {
    constructor(modelManager, layoutFormatterManager, pageIndex, subDocument, layout, storeSelection) {
        this.modelManager = modelManager;
        this.layoutFormatterManager = layoutFormatterManager;
        this.pageIndex = pageIndex;
        this.subDocument = subDocument;
        this.layout = layout;
        this.storeSelection = storeSelection;
    }
    setSearchParams(whatFind, replaceWith, searchDirection, matchCase, regularExpression, findWithPosition, wholeWordsOnly) {
        if (findWithPosition < 0 || findWithPosition > this.subDocument.getDocumentEndPosition())
            throw "In FindReplaceHelper setSearchParams findWithPosition < 0 || findWithPosition > this.subDocument.getDocumentEndPosition()";
        if (wholeWordsOnly && regularExpression)
            throw "In FindReplaceHelper setSearchParams can't set wholeWordsOnly && regularExpression";
        if (wholeWordsOnly && FindReplaceHelper.isCanSetWholeWordsOnlyForThisExpression(whatFind) >= 0)
            throw "In FindReplaceHelper setSearchParams whatFind expression consider not Alphanumeric char[" + FindReplaceHelper.isCanSetWholeWordsOnlyForThisExpression(whatFind) + "]";
        const recalculateSuppFunc = (this.template != (matchCase ? whatFind : whatFind.toUpperCase())) ||
            (this.regularExpression != regularExpression) || (this.matchCase != matchCase) ||
            (this.searchDirection == SearchDirection.Up && searchDirection != SearchDirection.Up) ||
            (this.searchDirection != SearchDirection.Up && searchDirection == SearchDirection.Up);
        this.replaceWith = replaceWith;
        this.searchDirection = searchDirection;
        this.regularExpression = regularExpression;
        this.matchCase = matchCase;
        this.wholeWordsOnly = wholeWordsOnly;
        this.template = this.matchCase ? whatFind : whatFind.toUpperCase();
        this.lastFound = null;
        this.state = FindReplaceState.Start;
        this.beginOrStartDocumentReach = false;
        this.findWithPosition = findWithPosition;
        this.currentPos = findWithPosition;
        this.templateLength = whatFind.length;
        if (!this.wholeWordsOnly && recalculateSuppFunc || !this.supportFunction)
            this.crateSupportFunction();
    }
    static isCanSetWholeWordsOnlyForThisExpression(expression) {
        for (let i = 0; i < expression.length; i++)
            if (!expression[i].match(RichUtils.isAlphanumeric))
                return i;
        return -1;
    }
    findNext() {
        if (this.state == FindReplaceState.SearchEnd)
            this.setSearchParams(this.template, this.replaceWith, this.searchDirection, this.matchCase, this.regularExpression, this.findWithPosition, this.wholeWordsOnly);
        let newState;
        switch (this.searchDirection) {
            case SearchDirection.Down:
                newState = this.findNextDown();
                break;
            case SearchDirection.All:
                newState = this.findNextAll();
                break;
            case SearchDirection.Up:
                newState = this.findNextUp();
                break;
        }
        if (newState == FindReplaceState.DocumentEnd || newState == FindReplaceState.DocumentBegin)
            this.beginOrStartDocumentReach = true;
        if (newState === FindReplaceState.Found && this.shouldSkipSearchInterval(this.subDocument.id, this.lastFound))
            return this.findNext();
        return newState;
    }
    shouldSkipSearchInterval(subDocumentId, interval) {
        if (!isDefined(this.modelManager.richOptions.search.filterInterval))
            return false;
        return !this.modelManager.richOptions.search.filterInterval(subDocumentId, interval);
    }
    findNextDown() {
        switch (this.state) {
            case FindReplaceState.Start:
            case FindReplaceState.Found:
                const isBelowStartPos = this.currentPos >= this.findWithPosition;
                if (this.findNextDownInternal(this.currentPos, isBelowStartPos ? this.subDocument.getDocumentEndPosition() : this.findWithPosition))
                    this.state = FindReplaceState.Found;
                else {
                    if (!isBelowStartPos || this.findWithPosition == 0)
                        this.state = FindReplaceState.SearchEnd;
                    else
                        this.state = FindReplaceState.DocumentEnd;
                }
                break;
            case FindReplaceState.DocumentEnd:
                if (this.findWithPosition == 0)
                    this.state = FindReplaceState.SearchEnd;
                else {
                    if (this.findNextDownInternal(0, this.findWithPosition))
                        this.state = FindReplaceState.Found;
                    else
                        this.state = FindReplaceState.SearchEnd;
                }
                break;
        }
        return this.state;
    }
    findNextUp() {
        switch (this.state) {
            case FindReplaceState.Start:
            case FindReplaceState.Found:
                const isAboveStartPos = this.currentPos <= this.findWithPosition;
                if (this.beginOrStartDocumentReach && isAboveStartPos) {
                    this.lastFound = null;
                    this.state = FindReplaceState.SearchEnd;
                    return this.state;
                }
                if (this.findNextUpInternal(isAboveStartPos ? 0 : this.findWithPosition, this.currentPos))
                    this.state = FindReplaceState.Found;
                else {
                    if (!isAboveStartPos || this.findWithPosition == this.subDocument.getDocumentEndPosition() - 1)
                        this.state = FindReplaceState.SearchEnd;
                    else
                        this.state = FindReplaceState.DocumentBegin;
                }
                break;
            case FindReplaceState.DocumentBegin:
                const docEnd = this.subDocument.getDocumentEndPosition();
                if (this.findWithPosition == docEnd - 1)
                    this.state = FindReplaceState.SearchEnd;
                else {
                    if (this.findNextUpInternal(this.findWithPosition, docEnd - 1))
                        this.state = FindReplaceState.Found;
                    else
                        this.state = FindReplaceState.SearchEnd;
                }
                break;
        }
        return this.state;
    }
    findNextAll() {
        while (this.findNextDown() == FindReplaceState.DocumentEnd)
            ;
        return this.state;
    }
    findNextDownInternal(lowerPosition, greaterPosition) {
        const charIterator = new ForwardCharacterIterator(this.modelManager, this.layoutFormatterManager, this.pageIndex, this.subDocument, lowerPosition, greaterPosition);
        if (this.wholeWordsOnly)
            return this.findNextDownWholeWordsOnly(charIterator, lowerPosition, greaterPosition);
        let offset = 0;
        let posWhenStartEquivalents = -1;
        while (charIterator.nextChar()) {
            if (!this.matchCase)
                charIterator.char = charIterator.char.toUpperCase();
            while (offset > 0 && this.template[offset] != charIterator.char) {
                offset = this.supportFunction[offset - 1];
                posWhenStartEquivalents++;
            }
            if (this.template[offset] == charIterator.char) {
                if (offset == 0)
                    posWhenStartEquivalents = charIterator.getCurrLogPosition();
                offset++;
            }
            if (offset == this.templateLength) {
                this.lastFound = FixedInterval.fromPositions(posWhenStartEquivalents, charIterator.getCurrLogPosition() + 1);
                this.currentPos = this.lastFound.end;
                return true;
            }
        }
        this.currentPos = greaterPosition;
        this.lastFound = null;
        return false;
    }
    findNextDownWholeWordsOnly(charIterator, lowerPosition, greaterPosition) {
        let offset = 0;
        if (this.layout.pages[0].getPosition() < lowerPosition &&
            this.isCharCanBeInWord((this.subDocument.isMain() ? new LayoutPositionMainSubDocumentCreator(this.layout, this.subDocument, lowerPosition - 1, DocumentLayoutDetailsLevel.Character)
                : new LayoutPositionOtherSubDocumentCreator(this.layout, this.subDocument, lowerPosition - 1, this.pageIndex, DocumentLayoutDetailsLevel.Character))
                .create(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(true))))
            offset = -1;
        let posWhenStartEquivalents = -1;
        while (charIterator.nextChar()) {
            if (offset == this.templateLength) {
                if (charIterator.char.match(RichUtils.isAlphanumeric)) {
                    offset = -1;
                    continue;
                }
                else {
                    this.lastFound = FixedInterval.fromPositions(posWhenStartEquivalents, charIterator.getCurrLogPosition() + 1);
                    this.currentPos = this.lastFound.end;
                    return true;
                }
            }
            if (offset < 0 && !charIterator.char.match(RichUtils.isAlphanumeric) ||
                offset >= 0 && this.template[offset] == (this.matchCase ? charIterator.char : charIterator.char.toUpperCase())) {
                offset += 1;
                if (offset == 0)
                    posWhenStartEquivalents = charIterator.getCurrLogPosition();
            }
            else
                offset = -1;
        }
        this.currentPos = greaterPosition;
        this.lastFound = null;
        return false;
    }
    findNextUpInternal(lowerPosition, greaterPosition) {
        if (greaterPosition < 1) {
            this.currentPos = 0;
            this.lastFound = null;
            return false;
        }
        const charIterator = new BackwardCharacterIterator(this.modelManager, this.layoutFormatterManager, this.pageIndex, this.subDocument, lowerPosition, greaterPosition);
        if (this.wholeWordsOnly)
            return this.findNextUpWholeWordsOnly(charIterator, greaterPosition);
        let offset = 0;
        const templateLastInd = this.templateLength - 1;
        let posWhenStartEquivalents = -1;
        while (charIterator.prevChar()) {
            if (!this.matchCase)
                charIterator.char = charIterator.char.toUpperCase();
            while (offset > 0 && this.template[templateLastInd - offset] != charIterator.char)
                offset = this.supportFunction[offset - 1];
            if (this.template[templateLastInd - offset] == charIterator.char) {
                if (offset == 0)
                    posWhenStartEquivalents = charIterator.getCurrLogPosition() + 1;
                offset++;
            }
            if (offset == this.templateLength) {
                this.lastFound = FixedInterval.fromPositions(charIterator.getCurrLogPosition(), posWhenStartEquivalents);
                this.currentPos = Math.max(0, this.lastFound.start - 1);
                return true;
            }
        }
        this.currentPos = 0;
        this.lastFound = null;
        return false;
    }
    findNextUpWholeWordsOnly(charIterator, greaterPosition) {
        let offset = 0;
        const layoutPage = this.subDocument.isMain() ? this.layout.getLastValidPage() : this.layout.pages[this.pageIndex];
        let posWhenStartEquivalents = -1;
        if (greaterPosition < layoutPage.getEndPosition() - 1 &&
            this.isCharCanBeInWord((this.subDocument.isMain() ? new LayoutPositionMainSubDocumentCreator(this.layout, this.subDocument, greaterPosition + 1, DocumentLayoutDetailsLevel.Character)
                : new LayoutPositionOtherSubDocumentCreator(this.layout, this.subDocument, greaterPosition + 1, this.pageIndex, DocumentLayoutDetailsLevel.Character))
                .create(new LayoutPositionCreatorConflictFlags().setDefault(true), new LayoutPositionCreatorConflictFlags().setDefault(false))))
            offset = -1;
        else
            posWhenStartEquivalents = charIterator.getCurrLogPosition();
        const templateLastInd = this.templateLength - 1;
        while (charIterator.prevChar()) {
            if (offset == this.templateLength) {
                if (charIterator.char.match(RichUtils.isAlphanumeric)) {
                    offset = -1;
                    continue;
                }
                else {
                    this.lastFound = FixedInterval.fromPositions(charIterator.getCurrLogPosition(), posWhenStartEquivalents + 1);
                    this.currentPos = this.lastFound.start;
                    return true;
                }
            }
            if (offset < 0) {
                offset = charIterator.char.match(RichUtils.isAlphanumeric) ? -1 : 0;
                if (offset == 0)
                    posWhenStartEquivalents = charIterator.getCurrLogPosition();
            }
            else {
                if (this.template[templateLastInd - offset] == (this.matchCase ? charIterator.char : charIterator.char.toUpperCase()))
                    offset += 1;
            }
        }
        if (offset == this.templateLength) {
            this.currentPos = 0;
            this.lastFound = new FixedInterval(0, posWhenStartEquivalents + 1);
            return true;
        }
        this.currentPos = 0;
        this.lastFound = null;
        return false;
    }
    isCharCanBeInWord(layoutPos) {
        if (!layoutPos)
            return false;
        layoutPos.switchToStartNextBoxInRow();
        if (layoutPos.box.getType() != LayoutBoxType.Text && layoutPos.box.getType() != LayoutBoxType.Dash)
            return false;
        let char;
        if (layoutPos.charOffset >= layoutPos.box.getLength()) {
            if (layoutPos.advanceToNextRow(this.layout))
                char = layoutPos.row.boxes[0].renderGetContent(null)[0];
            else
                return false;
        }
        else
            char = layoutPos.box.renderGetContent(null)[layoutPos.charOffset];
        return char.match(RichUtils.isAlphanumeric).length > 0;
    }
    getLastFound() {
        return this.lastFound ? this.lastFound.clone() : null;
    }
    replaceLastFound() {
        if (!this.lastFound || this.replaceWith === null || this.replaceWith === undefined)
            return;
        const modelManager = this.modelManager;
        const firstRun = this.subDocument.getRunByPosition(this.lastFound.start);
        const charStyle = firstRun.characterStyle;
        const maskedCharProp = firstRun.maskedCharacterProperties;
        modelManager.history.beginTransaction();
        this.storeSelection(new FixedInterval(this.lastFound.start, this.replaceWith.length));
        modelManager.modelManipulator.range.removeInterval(new SubDocumentInterval(this.subDocument, this.lastFound.clone()), true, false);
        if (this.replaceWith)
            modelManager.history.addAndRedo(new InsertTextHistoryItem(modelManager.modelManipulator, new InsertTextManipulatorParams(new SubDocumentPosition(this.subDocument, this.lastFound.start), new MaskedCharacterPropertiesBundle(maskedCharProp, charStyle), RunType.TextRun, this.replaceWith)));
        modelManager.history.endTransaction();
        const diff = this.replaceWith.length - this.templateLength;
        if (this.searchDirection != SearchDirection.Up)
            this.currentPos += diff;
        if (this.findWithPosition >= this.lastFound.end)
            this.findWithPosition += diff;
        this.lastFound = null;
    }
    replaceAll(startWithPos) {
        if (this.replaceWith === null || this.replaceWith === undefined)
            return;
        const modelManager = this.modelManager;
        const oldFindWithPosition = this.findWithPosition;
        this.setSearchParams(this.template, this.replaceWith, this.searchDirection, this.matchCase, this.regularExpression, 0, this.wholeWordsOnly);
        const history = modelManager.history;
        const storedPosition = this.subDocument.positionManager.registerPosition(startWithPos);
        this.currentPos = 0;
        const resultIntervals = [];
        while (this.findNextAll() == FindReplaceState.Found)
            if (!this.shouldSkipSearchInterval(this.subDocument.id, this.lastFound))
                resultIntervals.push(this.lastFound);
        if (resultIntervals.length) {
            history.beginTransaction();
            for (let i = resultIntervals.length - 1; i >= 0; i--) {
                const curr = resultIntervals[i];
                const firstRun = this.subDocument.getRunByPosition(curr.start);
                const charStyle = firstRun.characterStyle;
                const maskedCharProp = firstRun.maskedCharacterProperties;
                modelManager.modelManipulator.range.removeInterval(new SubDocumentInterval(this.subDocument, curr.clone()), true, false);
                if (this.replaceWith.length)
                    modelManager.history.addAndRedo(new InsertTextHistoryItem(modelManager.modelManipulator, new InsertTextManipulatorParams(new SubDocumentPosition(this.subDocument, curr.start), new MaskedCharacterPropertiesBundle(maskedCharProp, charStyle), RunType.TextRun, this.replaceWith)));
            }
            this.storeSelection(new FixedInterval(Math.min(storedPosition.value, this.subDocument.getDocumentEndPosition() - 1), 0));
            history.endTransaction();
        }
        this.subDocument.positionManager.unregisterPosition(storedPosition);
        this.setSearchParams(this.template, this.replaceWith, this.searchDirection, this.matchCase, this.regularExpression, oldFindWithPosition, this.wholeWordsOnly);
        return resultIntervals.length;
    }
    crateSupportFunction() {
        let template;
        if (this.searchDirection == SearchDirection.Up) {
            template = "";
            for (let i = this.templateLength - 1; i >= 0; i--)
                template += this.template[i];
        }
        else
            template = this.template;
        this.supportFunction = [0];
        for (let topBound = 2; topBound < this.templateLength; topBound++)
            this.supportFunction.push(FindReplaceHelper.calcOneElemSuppFunc(template, topBound));
    }
    static calcOneElemSuppFunc(template, topBound) {
        for (let offset = 1; offset < topBound; offset++) {
            const lenComparePhrase = topBound - offset;
            let i = 0;
            for (; i < lenComparePhrase; i++) {
                if (template[i] != template[i + offset])
                    break;
            }
            if (i == lenComparePhrase)
                return topBound - offset;
        }
        return 0;
    }
}
export class CharacterIteratorBase {
    constructor(modelManager, layoutFormatterManager, pageIndex, subDocument, startPosition, endPosition) {
        this.modelManager = modelManager;
        this.subDocument = subDocument;
        this.iterator = subDocument.isMain() ?
            new LayoutBoxIteratorMainSubDocument(subDocument, layoutFormatterManager.layout, startPosition, endPosition) :
            new LayoutBoxIteratorOtherSubDocument(subDocument, layoutFormatterManager.layout, startPosition, endPosition, pageIndex);
        while (!this.iterator.isInitialized())
            layoutFormatterManager.forceFormatPage(layoutFormatterManager.layout.validPageCount);
        this.char = null;
        this.charIndexInBox = -1;
    }
    getCurrLogPosition() {
        return this.iterator.position.getLogPosition(DocumentLayoutDetailsLevel.Box) + this.charIndexInBox;
    }
    getCharInternal() {
        switch (this.iterator.position.box.getType()) {
            case LayoutBoxType.Text:
                this.char = this.iterator.position.box.text[this.charIndexInBox];
                break;
            case LayoutBoxType.Dash:
                this.char = this.iterator.position.box.text[this.charIndexInBox];
                break;
            case LayoutBoxType.Space:
                this.char = RichUtils.specialCharacters.Space;
                break;
            case LayoutBoxType.TabSpace:
                this.char = RichUtils.specialCharacters.TabMark;
                break;
            case LayoutBoxType.ParagraphMark:
                this.char = RichUtils.specialCharacters.ParagraphMark;
                break;
            default:
                this.char = String.fromCharCode(0);
        }
    }
}
export class ForwardCharacterIterator extends CharacterIteratorBase {
    getCharInternal() {
        if (this.charIndexInBox >= this.iterator.position.box.getLength())
            return false;
        super.getCharInternal();
        return true;
    }
    nextChar() {
        if (this.charIndexInBox == -1) {
            this.iterator.moveNext(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(true));
            this.charIndexInBox = this.iterator.position.charOffset;
            if (this.iterator.position.getLogPosition(DocumentLayoutDetailsLevel.Box) + this.charIndexInBox < this.iterator.intervalEnd && this.getCharInternal())
                return true;
        }
        else
            this.charIndexInBox++;
        this.char = null;
        while (this.char == null && this.iterator.position.getLogPosition(DocumentLayoutDetailsLevel.Box) + this.charIndexInBox < this.iterator.intervalEnd) {
            if (!this.getCharInternal()) {
                if (this.iterator.moveNext(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(true)))
                    this.charIndexInBox = this.iterator.position.charOffset;
                else
                    return false;
            }
        }
        return !!this.char;
    }
}
export class BackwardCharacterIterator extends CharacterIteratorBase {
    getCharInternal() {
        if (this.charIndexInBox < 0)
            return false;
        super.getCharInternal();
        return true;
    }
    prevChar() {
        if (this.charIndexInBox == -1) {
            this.iterator.movePrev(new LayoutPositionCreatorConflictFlags().setDefault(true), new LayoutPositionCreatorConflictFlags().setDefault(false));
            this.charIndexInBox = this.iterator.position.charOffset - 1;
            if (this.charIndexInBox == -1) {
                if (!this.iterator.movePrev(new LayoutPositionCreatorConflictFlags().setDefault(true), new LayoutPositionCreatorConflictFlags().setDefault(false)))
                    return false;
                this.charIndexInBox = this.iterator.position.box.getLength() - 1;
            }
            if (this.getCharInternal())
                return true;
            this.charIndexInBox = -1;
        }
        else
            this.charIndexInBox--;
        this.char = null;
        while (this.char == null && this.iterator.position.getLogPosition(DocumentLayoutDetailsLevel.Box) + this.charIndexInBox >= this.iterator.intervalStart) {
            if (!this.getCharInternal()) {
                if (this.iterator.position.charOffset > 0)
                    this.iterator.movePrev(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(true));
                if (this.iterator.movePrev(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(true)))
                    this.charIndexInBox = this.iterator.position.box.getLength() - 1;
                else
                    return false;
            }
        }
        return !!this.char;
    }
}
