import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { RichUtils } from './rich-utils';
export class SimpleSentenceWord {
    constructor(position, text) {
        this.position = position;
        this.text = text;
    }
}
export class SimpleSentence {
    constructor() {
        this.words = [];
    }
}
export class SimpleSentenceStructureBuilder {
    constructor(text) {
        this.sentences = [];
        this.charIndex = 0;
        this.currSentence = null;
        this.currWord = null;
        this.text = text;
    }
    build() {
        for (; this.charIndex < this.text.length; this.charIndex++) {
            this.currChar = this.text[this.charIndex];
            switch (this.currChar) {
                case "?":
                case ".":
                case ";":
                case "!":
                case RichUtils.specialCharacters.SectionMark:
                case RichUtils.specialCharacters.ParagraphMark: {
                    if (this.currSentence) {
                        this.finishSentence();
                    }
                    else {
                        if (this.prevChar == '!' && this.currChar == '?' ||
                            this.prevChar == '"' ||
                            this.prevChar == '`' ||
                            this.prevChar == '?' && this.currChar == '?' ||
                            ((this.prevChar == '!' || this.prevChar == '?' || this.prevChar == '.' || this.prevChar == ';') &&
                                (this.currChar == RichUtils.specialCharacters.ParagraphMark || this.currChar == RichUtils.specialCharacters.SectionMark))) {
                        }
                        else {
                            this.addSentence();
                            this.finishSentence();
                        }
                    }
                    break;
                }
                case RichUtils.specialCharacters.LeftDoubleQuote:
                case RichUtils.specialCharacters.RightDoubleQuote:
                case RichUtils.specialCharacters.EmSpace:
                case RichUtils.specialCharacters.Space:
                case RichUtils.specialCharacters.TabMark:
                case RichUtils.specialCharacters.EmDash:
                case RichUtils.specialCharacters.EnDash:
                case RichUtils.specialCharacters.LineBreak:
                case RichUtils.specialCharacters.PageBreak:
                case RichUtils.specialCharacters.ColumnBreak:
                case RichUtils.specialCharacters.NonBreakingSpace:
                case RichUtils.specialCharacters.ObjectMark:
                case RichUtils.specialCharacters.Dot:
                case RichUtils.specialCharacters.TrademarkSymbol:
                case RichUtils.specialCharacters.CopyrightSymbol:
                case RichUtils.specialCharacters.RegisteredTrademarkSymbol:
                case RichUtils.specialCharacters.Ellipsis:
                case String.fromCharCode(160):
                case ",":
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
                case "\"":
                case "<":
                case ">":
                case "/":
                case "~":
                    this.finishWord();
                    break;
                default:
                    this.addNewWordPart();
                    break;
            }
            this.prevChar = this.currChar;
        }
        this.postprocessing();
        return this.sentences;
    }
    finishSentence() {
        this.finishWord();
        this.currSentence = null;
    }
    finishWord() {
        this.currWord = null;
    }
    addSentence() {
        this.currSentence = new SimpleSentence();
        this.sentences.push(this.currSentence);
        this.currWord = null;
    }
    addWord() {
        if (!this.currSentence)
            this.addSentence();
        this.currWord = new SimpleSentenceWord(this.charIndex, "");
        this.currSentence.words.push(this.currWord);
    }
    addNewWordPart() {
        if (!this.currWord)
            this.addWord();
        this.currWord.text += this.currChar;
    }
    postprocessing() {
        const separators = [RichUtils.specialCharacters.LeftSingleQuote, RichUtils.specialCharacters.RightSingleQuote, "'"];
        for (let sentInd = 0, sentence; sentence = this.sentences[sentInd];) {
            for (let wordInd = 0, word; word = sentence.words[wordInd];) {
                const trimmedFromStart = StringUtils.trimStart(word.text, separators);
                word.position -= word.text.length - trimmedFromStart.length;
                const trimmedFromBothSides = StringUtils.trimEnd(trimmedFromStart, separators);
                if (trimmedFromBothSides.length) {
                    word.text = trimmedFromBothSides;
                    wordInd++;
                }
                else
                    sentence.words.splice(wordInd, 1);
            }
            if (sentence.words.length)
                sentInd++;
            else
                this.sentences.splice(sentInd, 1);
        }
    }
}
