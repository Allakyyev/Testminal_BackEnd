import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { LayoutBoxIteratorMainSubDocument } from '../layout-engine/layout-box-iterator/layout-box-iterator-main-sub-document';
import { LayoutBoxIteratorOtherSubDocument } from '../layout-engine/layout-box-iterator/layout-box-iterator-other-sub-document';
import { LayoutPositionCreatorConflictFlags } from '../layout-engine/layout-position-creator';
import { LayoutBoxType } from '../layout/main-structures/layout-boxes/layout-box';
import { RichUtils } from './rich-utils';
export class SwitchTextCaseManipulator {
    constructor(dispatcher) {
        this.dispatcher = dispatcher;
    }
}
export class WordPart {
    constructor(position, text, type) {
        this.position = position;
        this.text = text;
        this.type = type;
    }
    merge(pos, text, type) {
        if (this.position + this.text.length == pos && this.type == type && (type == LayoutBoxType.Text || type == LayoutBoxType.Dash || type == LayoutBoxType.Space)) {
            this.text += text;
            return true;
        }
        return false;
    }
    getEndPosition() {
        return this.position + this.text.length;
    }
}
export class SentenceWord {
    constructor() {
        this.parts = [];
    }
    getLastWordPart() {
        return this.parts[this.parts.length - 1];
    }
}
export class Sentence {
    constructor() {
        this.words = [];
    }
    getLastWord() {
        return this.words[this.words.length - 1];
    }
}
export class SentenceStructureBuilder {
    constructor(subDocument, layout, selection, interval) {
        this.currSentence = null;
        this.currWord = null;
        this.currWordPart = null;
        this.isSentenceEnd = false;
        this.isWordEnd = false;
        this.findEndLastSentence = false;
        this.subDocument = subDocument;
        this.layout = layout;
        this.interval = interval;
        this.sentences = [];
        this.selection = selection;
    }
    static getBuilder(layoutFormatterManager, selection, subDocument, interval, splitByInterval) {
        const layout = layoutFormatterManager.layout;
        const builder = new SentenceStructureBuilder(subDocument, layout, selection, interval);
        while (!builder.build())
            layoutFormatterManager.forceFormatPage(layout.validPageCount);
        if (splitByInterval)
            SentenceStructureBuilder.splitPartsByInterval(builder.sentences, interval);
        SentenceStructureBuilder.correctFirstSentence(builder.sentences);
        return builder;
    }
    static correctFirstSentence(sentences) {
        var firstSentenceWords = sentences[0].words;
        for (var startFirstSentenceWordIndex = 0, word; word = firstSentenceWords[startFirstSentenceWordIndex]; startFirstSentenceWordIndex++) {
            var type = word.parts[0].type;
            if (type != LayoutBoxType.Space && type != LayoutBoxType.LineBreak && type != LayoutBoxType.TabSpace)
                break;
        }
        if (startFirstSentenceWordIndex > 0 && startFirstSentenceWordIndex < firstSentenceWords.length) {
            var newFirstSentence = new Sentence();
            for (; startFirstSentenceWordIndex > 0; startFirstSentenceWordIndex--)
                newFirstSentence.words.push(firstSentenceWords.shift());
            sentences.unshift(newFirstSentence);
        }
    }
    static splitPartsByInterval(sentences, interval) {
        SentenceStructureBuilder.splitPartsByPosition(sentences, interval.start);
        SentenceStructureBuilder.splitPartsByPosition(sentences, interval.end);
    }
    static splitPartsByPosition(sentences, position) {
        var sentenceIndex = Math.max(0, SearchUtils.normedInterpolationIndexOf(sentences, (s) => s.words[0].parts[0].position, position));
        var sentence = sentences[sentenceIndex];
        var wordIndex = Math.max(0, SearchUtils.normedInterpolationIndexOf(sentence.words, (w) => w.parts[0].position, position));
        var sentenceWord = sentence.words[wordIndex];
        for (var wordPartIndex = 0, part; part = sentenceWord.parts[wordPartIndex]; wordPartIndex++) {
            if (part.position > position)
                break;
        }
        wordPartIndex = wordPartIndex > 0 ? wordPartIndex - 1 : 0;
        part = sentenceWord.parts[wordPartIndex];
        if (position > part.position && position < part.position + part.text.length) {
            sentenceWord.parts.splice(wordPartIndex + 1, 0, new WordPart(position, part.text.substr(position - part.position), part.type));
            part.text = part.text.substr(0, position - part.position);
        }
    }
    build() {
        let endPosition = this.subDocument.isMain() ? this.layout.getLastValidPage().getEndPosition() : this.layout.pages[this.selection.pageIndex].getEndPosition();
        if (this.findEndLastSentence) {
            this.interval = FixedInterval.fromPositions(this.interval.end, endPosition);
            this.layoutBoxIterator.resetToInterval(this.interval.start, this.interval.end);
            this.collect();
        }
        else {
            if (this.needCalculateMoreLayout())
                return false;
            var firstSentenceStartPosition = this.findFirstSentenceStartPosition();
            this.layoutBoxIterator = this.subDocument.isMain() ? new LayoutBoxIteratorMainSubDocument(this.subDocument, this.layout, firstSentenceStartPosition, this.interval.end) : new LayoutBoxIteratorOtherSubDocument(this.subDocument, this.layout, firstSentenceStartPosition, this.interval.end, this.selection.pageIndex);
            this.addNewSentence();
            this.addNewWord();
            this.collect();
            this.findEndLastSentence = true;
        }
        if (this.currSentence.words.length == 1 && this.currWord.parts.length == 0) {
            this.sentences.pop();
            return true;
        }
        if (this.interval.end == endPosition)
            return this.layout.isFullyFormatted;
        else
            return this.build();
    }
    collect() {
        while (this.layoutBoxIterator.moveNext(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(false))) {
            var layoutPos = this.layoutBoxIterator.position;
            if (this.lastBox && this.lastBox === layoutPos.box)
                continue;
            this.lastBox = layoutPos.box;
            switch (layoutPos.box.getType()) {
                case LayoutBoxType.Text:
                    var textBox = layoutPos.box;
                    for (var charIndex = layoutPos.charOffset, currAbsolutePosition = layoutPos.getLogPosition() + charIndex, char; char = textBox.text[charIndex]; charIndex++, currAbsolutePosition++) {
                        switch (char) {
                            case ".":
                            case ";":
                                if (this.isSentenceEnd) {
                                    this.addNewSentence();
                                    this.addNewWord();
                                    if (this.findEndLastSentence)
                                        return;
                                }
                                this.addNewWordPart(currAbsolutePosition, char, LayoutBoxType.Text);
                                this.isSentenceEnd = true;
                                break;
                            case "!":
                                var prevChar = StringUtils.getSymbolFromEnd(this.currWordPart.text, 1);
                                if (this.isSentenceEnd && prevChar && prevChar != "!") {
                                    this.addNewSentence();
                                    this.addNewWord();
                                    if (this.findEndLastSentence)
                                        return;
                                }
                                this.addNewWordPart(currAbsolutePosition, char, LayoutBoxType.Text);
                                this.isSentenceEnd = true;
                                break;
                            case "?":
                                var prevChar = StringUtils.getSymbolFromEnd(this.currWordPart.text, 1);
                                if (this.isSentenceEnd && !(prevChar && prevChar == "!")) {
                                    this.addNewSentence();
                                    this.addNewWord();
                                    if (this.findEndLastSentence)
                                        return;
                                }
                                this.addNewWordPart(currAbsolutePosition, char, LayoutBoxType.Text);
                                this.isSentenceEnd = true;
                                break;
                            case RichUtils.specialCharacters.Dot:
                            case RichUtils.specialCharacters.Hyphen:
                            case RichUtils.specialCharacters.TrademarkSymbol:
                            case RichUtils.specialCharacters.CopyrightSymbol:
                            case RichUtils.specialCharacters.RegisteredTrademarkSymbol:
                            case RichUtils.specialCharacters.Ellipsis:
                            case RichUtils.specialCharacters.LeftDoubleQuote:
                            case RichUtils.specialCharacters.LeftSingleQuote:
                            case RichUtils.specialCharacters.RightDoubleQuote:
                            case RichUtils.specialCharacters.RightSingleQuote:
                            case RichUtils.specialCharacters.OpeningDoubleQuotationMark:
                            case RichUtils.specialCharacters.OpeningSingleQuotationMark:
                            case RichUtils.specialCharacters.ClosingDoubleQuotationMark:
                            case RichUtils.specialCharacters.ClosingSingleQuotationMark:
                            case RichUtils.specialCharacters.RegisteredTrademarkSymbol:
                            case RichUtils.specialCharacters.RegisteredTrademarkSymbol:
                            case ",":
                            case "@":
                            case "#":
                            case "$":
                            case "%":
                            case "^":
                            case "&":
                            case "*":
                            case "(":
                            case ")":
                            case "=":
                            case "+":
                            case "[":
                            case "]":
                            case "{":
                            case "}":
                            case "\\":
                            case "|":
                            case ":":
                            case "\'":
                            case "\"":
                            case "<":
                            case ">":
                            case "/":
                            case "~":
                            case "`":
                                if (this.isWordEnd)
                                    this.addNewWord();
                                this.addNewWordPart(currAbsolutePosition, char, LayoutBoxType.Text);
                                this.isWordEnd = true;
                                break;
                            default:
                                if (this.isSentenceEnd) {
                                    this.addNewSentence();
                                    this.addNewWord();
                                    if (this.findEndLastSentence)
                                        return;
                                    this.isSentenceEnd = false;
                                    this.isWordEnd = false;
                                }
                                else if (this.isWordEnd) {
                                    this.addNewWord();
                                    this.isWordEnd = false;
                                }
                                this.addNewWordPart(currAbsolutePosition, char, LayoutBoxType.Text);
                                break;
                        }
                    }
                    break;
                case LayoutBoxType.SectionMark:
                case LayoutBoxType.ParagraphMark:
                    this.addNewWordPart(layoutPos.getLogPosition(), " ", layoutPos.box.getType());
                    this.addNewSentence();
                    this.addNewWord();
                    if (this.findEndLastSentence)
                        return;
                    this.isSentenceEnd = false;
                    this.isWordEnd = false;
                    break;
                case LayoutBoxType.Dash:
                case LayoutBoxType.Space:
                case LayoutBoxType.TabSpace:
                    this.addNewWordPart(layoutPos.getLogPosition(), " ", layoutPos.box.getType());
                    this.isWordEnd = true;
                    break;
                default:
                    if (this.currWord.parts.length > 0)
                        this.addNewWord();
                    this.addNewWordPart(layoutPos.getLogPosition(), " ", layoutPos.box.getType());
                    if (!this.isSentenceEnd)
                        this.addNewWord();
                    break;
            }
        }
    }
    addNewSentence() {
        this.currSentence = new Sentence();
        this.sentences.push(this.currSentence);
        this.currWord = null;
        this.currWordPart = null;
    }
    addNewWord() {
        this.currWord = new SentenceWord();
        this.currSentence.words.push(this.currWord);
        this.currWordPart = null;
    }
    addNewWordPart(pos, text, type) {
        var mergeSuccess = this.currWordPart && this.currWordPart.merge(pos, text, type);
        if (!mergeSuccess) {
            this.currWordPart = new WordPart(pos, text, type);
            this.currWord.parts.push(this.currWordPart);
        }
    }
    needCalculateMoreLayout() {
        var lastValidPage = this.subDocument.isMain() ? this.layout.getLastValidPage() : this.layout.pages[this.selection.pageIndex];
        return lastValidPage && (this.subDocument.isMain() ? lastValidPage.getEndPosition() : lastValidPage.otherPageAreas[this.subDocument.id].getEndPosition()) < this.interval.end;
    }
    findFirstSentenceStartPosition() {
        var layoutBoxIterator = this.subDocument.isMain() ? new LayoutBoxIteratorMainSubDocument(this.subDocument, this.layout, 0, this.interval.start) : new LayoutBoxIteratorOtherSubDocument(this.subDocument, this.layout, 0, this.interval.start, this.selection.pageIndex);
        var suspiciousPosition = -1;
        var isFindSentenceStart = false;
        while (layoutBoxIterator.movePrev(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(true))) {
            var layoutPos = layoutBoxIterator.position;
            switch (layoutPos.box.getType()) {
                case LayoutBoxType.Text:
                    var textBox = layoutPos.box;
                    var lastIndexBox = layoutPos.charOffset > 0 || layoutPos.getLogPosition() >= this.interval.start ? layoutPos.charOffset : textBox.text.length - 1;
                    for (var charIndex = lastIndexBox, char; char = textBox.text[charIndex]; charIndex--) {
                        switch (char) {
                            case ".":
                            case "!":
                            case "?":
                            case ";":
                                if (layoutPos.getLogPosition() != this.interval.start)
                                    isFindSentenceStart = true;
                                break;
                            default:
                                suspiciousPosition = layoutPos.getLogPosition();
                                break;
                        }
                        if (isFindSentenceStart)
                            break;
                    }
                    break;
                case LayoutBoxType.SectionMark:
                case LayoutBoxType.ParagraphMark:
                    layoutBoxIterator.moveNext(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(false));
                    suspiciousPosition = layoutBoxIterator.position.getLogPosition();
                    isFindSentenceStart = true;
                    break;
            }
            if (isFindSentenceStart)
                break;
        }
        if (suspiciousPosition < 0)
            return layoutBoxIterator.position.getLogPosition();
        else
            return suspiciousPosition;
    }
}
