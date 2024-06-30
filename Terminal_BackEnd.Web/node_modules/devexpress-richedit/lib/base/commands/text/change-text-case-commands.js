import { LayoutBoxType } from '../../../core/layout/main-structures/layout-boxes/layout-box';
import { FontCapsHistoryItem } from '../../../core/model/history/items/character-properties-history-items';
import { CapitalizeEachWordCaseHistoryItem, LowerCaseHistoryItem, SentenceCaseHistoryItem, ToggleCaseHistoryItem, UpperCaseHistoryItem } from '../../../core/model/history/items/text-run-change-case-history-item';
import { ControlOptions } from '../../../core/model/options/control';
import { SentenceStructureBuilder } from '../../../core/model/sentence-model-builder';
import { SubDocumentInterval } from '../../../core/model/sub-document';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { RichEditClientCommand } from '../client-command';
import { CommandBase } from '../command-base';
import { IntervalCommandStateEx } from '../command-states';
export class ChangeTextCaseCommandBaseBase extends CommandBase {
    getActualIntervals() {
        if (this.selection.isCollapsed())
            return [this.selection.activeSubDocument.getWholeWordInterval(this.selection.intervals[0].start, false, true)];
        return ListUtils.deepCopy(this.selection.intervalsInfo.intervals);
    }
    getState() {
        return new IntervalCommandStateEx(this.isEnabled(), this.getActualIntervals());
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.characterFormatting);
    }
}
export class ChangeTextCaseCommandBase extends ChangeTextCaseCommandBaseBase {
    getActualInterval() {
        if (this.selection.isCollapsed())
            return this.selection.activeSubDocument.getWholeWordInterval(this.selection.intervals[0].start, false, true);
        return this.selection.lastSelectedInterval.clone();
    }
    getState() {
        return new IntervalCommandStateEx(this.isEnabled(), this.getActualIntervals());
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.characterFormatting);
    }
    executeCore(state, _options) {
        if (state.intervals.length === 0 || state.intervals[0].length === 0)
            return false;
        var modelManipulator = this.modelManipulator;
        var subDocument = this.selection.activeSubDocument;
        this.history.addTransaction(() => {
            for (let i = 0, interval; interval = state.intervals[i]; i++) {
                this.history.addAndRedo(new (this.getHistoryItemName())(modelManipulator, new SubDocumentInterval(subDocument, interval), this.selection, this.control.layoutFormatterManager));
                this.history.addAndRedo(new FontCapsHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), false, true));
            }
        });
        return true;
    }
}
export class CapitalizeEachWordCaseCommand extends ChangeTextCaseCommandBase {
    getHistoryItemName() {
        return CapitalizeEachWordCaseHistoryItem;
    }
}
export class MakeTextLowerCaseCommand extends ChangeTextCaseCommandBase {
    getHistoryItemName() {
        return LowerCaseHistoryItem;
    }
}
export class MakeTextUpperCaseCommand extends ChangeTextCaseCommandBase {
    getHistoryItemName() {
        return UpperCaseHistoryItem;
    }
}
export class ToggleTextCaseCommand extends ChangeTextCaseCommandBase {
    getHistoryItemName() {
        return ToggleCaseHistoryItem;
    }
}
export class SentenceCaseCommand extends ChangeTextCaseCommandBase {
    getHistoryItemName() {
        return SentenceCaseHistoryItem;
    }
}
export class SwitchTextCaseCommand extends ChangeTextCaseCommandBaseBase {
    executeCore(state, options) {
        var executed = false;
        this.history.beginTransaction();
        for (let i = 0, interval; interval = state.intervals[i]; i++) {
            let commandId = this.getCommand(interval);
            let command = (this.control.commandManager.getCommand(commandId));
            executed = command.executeCore(state, options);
        }
        this.history.endTransaction();
        return executed;
    }
    getCommand(interval) {
        var sentences = SentenceStructureBuilder.getBuilder(this.control.layoutFormatterManager, this.selection, this.selection.activeSubDocument, interval, true).sentences;
        var atLeastOneCharInNotInFirstPositionOnSentenceInUpperCase = false;
        var atLeastOneSentenceFullSelected = false;
        var atLeastOneFirstCharInSentenceInLowerCase = false;
        var atLeastOneFirstCharInWordInLowerCase = false;
        var allNotFirstCharsInWordsIsLowerCase = true;
        var allCharsInUpperCase = true;
        var allFirstCharsInWordsInUpperCase = true;
        externalLoop: for (var sentenceIndex = 0, sentence; sentence = sentences[sentenceIndex]; sentenceIndex++) {
            if (sentence.words[0].parts[0].position >= interval.start && sentence.getLastWord().getLastWordPart().getEndPosition() <= interval.end)
                atLeastOneSentenceFullSelected = true;
            for (var wordIndex = 0, wordInfo; wordInfo = sentence.words[wordIndex]; wordIndex++) {
                for (var wordPartIndex = 0, wordPart; wordPart = wordInfo.parts[wordPartIndex]; wordPartIndex++) {
                    if (wordPart.position < interval.start)
                        continue;
                    if (wordPart.position >= interval.end)
                        break externalLoop;
                    if (wordPart.type == LayoutBoxType.Text) {
                        var firstWordChar = wordPart.text[0];
                        var otherWordChars = wordPart.text.substr(1);
                        if (wordIndex == 0 && wordPartIndex == 0) {
                            atLeastOneFirstCharInSentenceInLowerCase = atLeastOneFirstCharInSentenceInLowerCase || (StringUtils.stringInLowerCase(firstWordChar) && !StringUtils.stringInUpperCase(firstWordChar));
                            atLeastOneCharInNotInFirstPositionOnSentenceInUpperCase = atLeastOneCharInNotInFirstPositionOnSentenceInUpperCase || StringUtils.atLeastOneSymbolInUpperCase(otherWordChars);
                        }
                        else
                            atLeastOneCharInNotInFirstPositionOnSentenceInUpperCase = atLeastOneCharInNotInFirstPositionOnSentenceInUpperCase || StringUtils.atLeastOneSymbolInUpperCase(wordPart.text);
                        if (wordPartIndex == 0) {
                            atLeastOneFirstCharInWordInLowerCase = atLeastOneFirstCharInWordInLowerCase || (StringUtils.stringInLowerCase(firstWordChar) && !StringUtils.stringInUpperCase(firstWordChar));
                            allFirstCharsInWordsInUpperCase = allFirstCharsInWordsInUpperCase && StringUtils.stringInUpperCase(firstWordChar);
                        }
                        allNotFirstCharsInWordsIsLowerCase = allNotFirstCharsInWordsIsLowerCase && StringUtils.stringInLowerCase(otherWordChars);
                        allCharsInUpperCase = allCharsInUpperCase && StringUtils.stringInUpperCase(wordPart.text);
                    }
                }
            }
        }
        if (allCharsInUpperCase)
            return RichEditClientCommand.MakeTextLowerCase;
        if (allFirstCharsInWordsInUpperCase && allNotFirstCharsInWordsIsLowerCase)
            return RichEditClientCommand.MakeTextUpperCase;
        if (atLeastOneSentenceFullSelected && (atLeastOneFirstCharInSentenceInLowerCase || atLeastOneCharInNotInFirstPositionOnSentenceInUpperCase))
            return RichEditClientCommand.SentenceCase;
        if (atLeastOneFirstCharInWordInLowerCase && allNotFirstCharsInWordsIsLowerCase)
            return RichEditClientCommand.CapitalizeEachWordTextCase;
        return RichEditClientCommand.MakeTextUpperCase;
    }
}
