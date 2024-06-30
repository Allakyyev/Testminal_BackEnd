import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { LayoutBoxType } from '../../layout/main-structures/layout-boxes/layout-box';
import { TextBufferChangedSubDocumentChange } from '../changes/sub-document/text/text-buffer-changed';
import { HistoryItemIntervalState } from '../history/states/history-item-state';
import { HistoryItemTextBufferStateObject } from '../history/states/history-item-state-object';
import { SentenceStructureBuilder } from '../sentence-model-builder';
import { BaseManipulator } from './base-manipulator';
export class TextCaseManipulator extends BaseManipulator {
    applyUpperCase(layoutFormatterManager, selection, subDocument, interval) {
        return (new UpperCaseModifier(layoutFormatterManager, selection, subDocument, this.modelManipulator, interval)).modify();
    }
    applyLowerCase(layoutFormatterManager, selection, subDocument, interval) {
        return (new LowerCaseModifier(layoutFormatterManager, selection, subDocument, this.modelManipulator, interval)).modify();
    }
    applyCapitalizeEachWordCase(layoutFormatterManager, selection, subDocument, interval) {
        return (new CapitalizeEachWordCaseModifier(layoutFormatterManager, selection, subDocument, this.modelManipulator, interval)).modify();
    }
    applyToggleCase(layoutFormatterManager, selection, subDocument, interval) {
        return (new ToggleCaseModifier(layoutFormatterManager, selection, subDocument, this.modelManipulator, interval)).modify();
    }
    applySentenceCase(layoutFormatterManager, selection, subDocument, interval) {
        return (new SentenceCaseModifier(layoutFormatterManager, selection, subDocument, this.modelManipulator, interval)).modify();
    }
    applyBufferState(subDocument, oldState) {
        var chunks = subDocument.chunks;
        for (var i = 0, stateValue; stateValue = oldState.objects[i]; i++) {
            var oldText = stateValue.value;
            var oldTextPosition = stateValue.interval.start;
            var chunkIndex = SearchUtils.normedInterpolationIndexOf(chunks, (c) => c.startLogPosition.value, oldTextPosition);
            for (var chunk; oldText.length > 0 && (chunk = chunks[chunkIndex]); chunkIndex++) {
                var currPosForInsertInThisChunk = oldTextPosition - chunk.startLogPosition.value;
                var chunkTextBefore = chunk.textBuffer.substr(0, currPosForInsertInThisChunk);
                var chunkTextAfter = chunk.textBuffer.substr(currPosForInsertInThisChunk + oldText.length);
                var lengthInsertedText = chunk.textBuffer.length - currPosForInsertInThisChunk - chunkTextAfter.length;
                chunk.textBuffer = [chunkTextBefore, oldText.substr(0, lengthInsertedText), chunkTextAfter].join("");
                oldTextPosition += lengthInsertedText;
                oldText = oldText.substr(lengthInsertedText);
            }
        }
        if (!oldState.isEmpty())
            this.modelManipulator.notifyModelChanged(new TextBufferChangedSubDocumentChange(subDocument.id, oldState));
    }
}
class TextCaseModifierBase {
    constructor(layoutFormatterManager, selection, subDocument, modelManipulator, interval) {
        this.layoutFormatterManager = layoutFormatterManager;
        this.selection = selection;
        this.subDocument = subDocument;
        this.interval = interval;
        this.modelManipulator = modelManipulator;
    }
    modify() {
        this.newState = new HistoryItemIntervalState();
        this.oldState = new HistoryItemIntervalState();
        var sentences = SentenceStructureBuilder.getBuilder(this.layoutFormatterManager, this.selection, this.subDocument, this.interval, true).sentences;
        for (var sentenceIndex = 0, sentence; sentence = sentences[sentenceIndex]; sentenceIndex++)
            this.modifyCore(sentence);
        this.modelManipulator.textCase.applyBufferState(this.subDocument, this.newState);
        if (!this.newState.isEmpty())
            this.modelManipulator.notifyModelChanged(new TextBufferChangedSubDocumentChange(this.subDocument.id, this.newState));
        return this.oldState;
    }
}
class TextCaseSimpleModifier extends TextCaseModifierBase {
    modifyCore(sentence) {
        for (var wordIndex = 0, wordInfo; wordInfo = sentence.words[wordIndex]; wordIndex++) {
            for (var wordPartIndex = 0, wordPart; wordPart = wordInfo.parts[wordPartIndex]; wordPartIndex++) {
                if (wordPart.position < this.interval.start)
                    continue;
                if (wordPart.position >= this.interval.end)
                    return;
                switch (wordPart.type) {
                    case LayoutBoxType.Text:
                        this.oldState.register(new HistoryItemTextBufferStateObject(wordPart.position, wordPart.text));
                        var newText = this.applyModifier(wordIndex, wordPartIndex, wordPart.text);
                        this.newState.register(new HistoryItemTextBufferStateObject(wordPart.position, newText));
                        break;
                }
            }
        }
    }
}
class LowerCaseModifier extends TextCaseSimpleModifier {
    applyModifier(_wordIndex, _wordPartIndex, text) {
        return text.toLowerCase();
    }
}
class UpperCaseModifier extends TextCaseSimpleModifier {
    applyModifier(_wordIndex, _wordPartIndex, text) {
        return text.toUpperCase();
    }
}
class CapitalizeEachWordCaseModifier extends TextCaseSimpleModifier {
    applyModifier(_wordIndex, wordPartIndex, text) {
        return wordPartIndex == 0 ? text[0].toUpperCase() + text.substr(1).toLowerCase() : text.toLowerCase();
    }
}
class ToggleCaseModifier extends TextCaseSimpleModifier {
    applyModifier(_wordIndex, _wordPartIndex, text) {
        var result = "";
        for (var i = 0; i < text.length; i++) {
            var char = text[i];
            var lowerChar = char.toLowerCase();
            result += lowerChar === char ? char.toUpperCase() : lowerChar;
        }
        return result;
    }
}
class SentenceCaseModifier extends TextCaseSimpleModifier {
    applyModifier(wordIndex, wordPartIndex, text) {
        return wordIndex == 0 && wordPartIndex == 0 ? text[0].toUpperCase() + text.substr(1).toLowerCase() : text.toLowerCase();
    }
}
