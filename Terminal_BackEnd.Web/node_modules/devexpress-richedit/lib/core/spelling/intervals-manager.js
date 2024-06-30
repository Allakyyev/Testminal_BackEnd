import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { Field } from '../model/fields/field';
import { JSONCheckSpellingCommand } from '../model/json/enums/json-general-enums';
import { ModelIterator } from '../model/model-iterator';
import { RunType } from '../model/runs/run-type';
import { ModelWordPositionHelper } from './helpers';
import { IgnoredInterval, MisspelledInterval, UncheckedInterval } from './intervals';
import { IgnoredIntervalCollection, IgnoredWordsCollection, MisspelledIntervalCollection, UncheckedIntervalCollection } from './intervals-collections';
import { SpellingErrorInfo, SpellingErrorType } from './spell-checker';
export class SpellCheckerIntervalsManager {
    constructor(subDocument) {
        this.subDocument = subDocument;
        this.uncheckedIntervalCollection = new UncheckedIntervalCollection();
        this.misspelledIntervalCollection = new MisspelledIntervalCollection();
        this.ignoredIntervalCollection = new IgnoredIntervalCollection();
        this.ignoredWordsCollection = new IgnoredWordsCollection();
        this.isInitialize = false;
    }
    initializeUncheckedIntervals() {
        if (!this.isInitialize) {
            this.createUncheckedIntervals(0, this.subDocument.getDocumentEndPosition());
            this.isInitialize = true;
        }
    }
    reset() {
        this.uncheckedIntervalCollection.clear();
        this.misspelledIntervalCollection.clear();
        this.ignoredIntervalCollection.clear();
        this.ignoredWordsCollection.clear();
        this.isInitialize = false;
    }
    getIntervalsToCheck() {
        this.splitUncheckedIntervals();
        let results = [];
        let totalLength = 0;
        let uncheckedIntervals = this.uncheckedIntervalCollection.getIntervals();
        const maxRequestLength = this.subDocument.documentModel.modelOptions.maxSpellRequestLength;
        for (let i = 0, uncheckedInterval; uncheckedInterval = uncheckedIntervals[i]; i++) {
            if (uncheckedInterval.info.isChecking || totalLength > maxRequestLength) {
                this.removeEmptyUncheckedIntervals(i);
                return results;
            }
            this.expandUncheckedInterval(uncheckedInterval);
            if (uncheckedInterval.length > 0) {
                this.prepareUncheckedInterval(uncheckedInterval);
                uncheckedInterval.info.isChecking = true;
                totalLength += uncheckedInterval.length;
                results.push(uncheckedInterval);
            }
        }
        this.removeEmptyUncheckedIntervals();
        return results;
    }
    applyCheckResults(checkedIntervals) {
        for (let i = 0, checkedInterval; checkedInterval = checkedIntervals[i]; i++) {
            const startPosition = checkedInterval[JSONCheckSpellingCommand.StartPosition];
            const endPosition = checkedInterval[JSONCheckSpellingCommand.EndPosition];
            const checkingInterval = this.uncheckedIntervalCollection.findCheckingIntervalByPositions(startPosition, endPosition);
            if (checkingInterval) {
                let isIntervalStartWithParagraph = startPosition === ModelWordPositionHelper.getPrevWordStartPosition(this.subDocument, startPosition);
                this.misspelledIntervalCollection.deleteOldIntervals(checkingInterval, isIntervalStartWithParagraph);
                this.createMisspelledIntervals(checkedInterval[JSONCheckSpellingCommand.SpellingErrors], checkingInterval);
                this.uncheckedIntervalCollection.deleteIntervalsByPositions(startPosition, endPosition, true);
            }
        }
    }
    onModelIntervalChanged(start, length, isSeparator) {
        this.uncheckedIntervalCollection.onModelIntervalChanged(start, length, isSeparator);
        this.misspelledIntervalCollection.onModelIntervalChanged(start, length, isSeparator);
        this.ignoredIntervalCollection.onModelIntervalChanged(start, length, isSeparator);
    }
    getMisspelledIntervals() {
        return this.misspelledIntervalCollection.getIntervals();
    }
    getUncheckedIntervalsCount() {
        return this.uncheckedIntervalCollection.getIntervals().length;
    }
    getSelectedMisspelledInterval(selectionIntervals) {
        let selectedInterval = null;
        this.misspelledIntervalCollection.forEach(interval => {
            const expandedInterval = new FixedInterval(interval.start, interval.length);
            Field.correctIntervalDueToFieldsWithoutUiChecks(this.subDocument, expandedInterval);
            if (expandedInterval.containsInterval(selectionIntervals[0]))
                selectedInterval = interval;
        });
        return selectedInterval;
    }
    findNextMisspelledInterval(position) {
        return this.misspelledIntervalCollection.findNext(position);
    }
    addIgnoredInterval(start, end, word) {
        this.ignoredIntervalCollection.add(new IgnoredInterval(start, end, word));
    }
    deleteMisspelledIntervalsByPositions(start, end) {
        this.misspelledIntervalCollection.deleteIntervalsByPositions(start, end);
    }
    ignoreAll(word) {
        this.ignoredWordsCollection.add(word);
        this.misspelledIntervalCollection.forEach((interval, index) => {
            if (interval.errorInfo.word == word && interval.errorInfo.errorType == SpellingErrorType.Misspelling) {
                this.misspelledIntervalCollection.remove(index);
            }
        });
    }
    removeIntervalsWithErrorByWord(word) {
        this.misspelledIntervalCollection.forEach((interval, index) => {
            if (interval.errorInfo.word == word && interval.errorInfo.errorType == SpellingErrorType.Misspelling)
                this.misspelledIntervalCollection.remove(index);
        });
    }
    getIntervalsWithErrorByWord(word) {
        let intervals = [];
        this.misspelledIntervalCollection.forEach(interval => {
            if (interval.errorInfo.word == word && interval.errorInfo.errorType == SpellingErrorType.Misspelling) {
                intervals.push(new FixedInterval(interval.start, interval.length));
            }
        });
        return intervals;
    }
    expandUncheckedInterval(interval) {
        let expandIntervalStart = ModelWordPositionHelper.getPrevWordStartPosition(this.subDocument, interval.start);
        let expandIntervalEnd = ModelWordPositionHelper.getNextWordEndPosition(this.subDocument, interval.end);
        interval.start = expandIntervalStart;
        interval.length = Math.max(0, expandIntervalEnd - expandIntervalStart);
    }
    removeEmptyUncheckedIntervals(maxIndex = this.uncheckedIntervalCollection.getIntervals().length) {
        this.uncheckedIntervalCollection.forEach((interval, index) => {
            if (maxIndex < index && interval.length == 0)
                this.uncheckedIntervalCollection.remove(index);
        });
    }
    prepareUncheckedInterval(interval) {
        let iterator = new ModelIterator(this.subDocument, false);
        let textToCheck = "";
        let hiddenIntervals = [];
        let ignoredLength = 0;
        let ignoredStart = 0;
        let fieldLevel = 0;
        let isPreviouslyHiddeh = false;
        iterator.setPosition(interval.start);
        do {
            if (!iterator.run.getCharacterMergedProperties().hidden && iterator.run.getType() !== RunType.FieldCodeStartRun && fieldLevel === 0) {
                textToCheck += iterator.getCurrentChar();
                if (isPreviouslyHiddeh) {
                    hiddenIntervals.push(new FixedInterval(ignoredStart, ignoredLength));
                    ignoredLength = 0;
                    isPreviouslyHiddeh = false;
                }
                ignoredStart++;
            }
            else {
                ignoredLength++;
                isPreviouslyHiddeh = true;
                if (iterator.run.getType() == RunType.FieldCodeStartRun)
                    fieldLevel++;
                if (iterator.run.getType() == RunType.FieldResultEndRun)
                    fieldLevel--;
            }
        } while (iterator.getAbsolutePosition() < interval.end && iterator.moveToNextChar());
        interval.info.textToCheck = textToCheck;
        interval.info.hiddenIntervals = hiddenIntervals;
    }
    createUncheckedIntervals(start, end) {
        let intervalCount = 0;
        let iterator = new ModelIterator(this.subDocument, true);
        iterator.setPosition(start);
        do {
            if (iterator.run.getType() == RunType.ParagraphRun) {
                let currentPosition = iterator.getAbsolutePosition();
                let length = currentPosition - start;
                if (length > 0) {
                    this.uncheckedIntervalCollection.add(new UncheckedInterval(start, length));
                    intervalCount++;
                }
                start = currentPosition + 1;
            }
        } while (iterator.getAbsolutePosition() < end && iterator.moveToNextRun());
        if (intervalCount == 0 && end > start)
            this.uncheckedIntervalCollection.add(new UncheckedInterval(start, end - start));
    }
    splitUncheckedIntervals() {
        let uncheckedIntervals = this.uncheckedIntervalCollection.getIntervals();
        const maxRequestLength = this.subDocument.documentModel.modelOptions.maxSpellRequestLength;
        for (let i = 0, uncheckedInterval; uncheckedInterval = uncheckedIntervals[i]; i++) {
            if (uncheckedInterval.info.isChecking)
                return;
            if (!uncheckedInterval.info.isSplitted) {
                if (uncheckedInterval.length > maxRequestLength) {
                    const start = uncheckedInterval.start;
                    const end = uncheckedInterval.end;
                    this.uncheckedIntervalCollection.remove(i);
                    this.createUncheckedIntervals(start, end);
                }
                else
                    uncheckedInterval.info.isSplitted = true;
            }
        }
    }
    createMisspelledIntervals(spellingErrors, checkingInterval) {
        for (let i = 0, error; error = spellingErrors[i]; i++) {
            let errorStart = error[JSONCheckSpellingCommand.ErrorStart] + checkingInterval.start;
            let errorLength = error[JSONCheckSpellingCommand.ErrorLength];
            for (let j = 0, hiddenInterval; hiddenInterval = checkingInterval.info.hiddenIntervals[j]; j++) {
                if (error[JSONCheckSpellingCommand.ErrorStart] > hiddenInterval.start)
                    errorStart += hiddenInterval.length;
                else if (hiddenInterval.start < error[JSONCheckSpellingCommand.ErrorStart] + error[JSONCheckSpellingCommand.ErrorLength])
                    errorLength += hiddenInterval.length;
            }
            const word = error[JSONCheckSpellingCommand.ErrorWord];
            if (!this.ignoredIntervalCollection.contains(errorStart, errorLength, word) &&
                (!this.ignoredWordsCollection.contains(word) || error[JSONCheckSpellingCommand.ErrorType] != SpellingErrorType.Misspelling)) {
                const spellingErrorInfo = new SpellingErrorInfo(error[JSONCheckSpellingCommand.ErrorType], error[JSONCheckSpellingCommand.Suggestions], word);
                const misspelledInterval = new MisspelledInterval(errorStart, errorLength, spellingErrorInfo);
                this.misspelledIntervalCollection.addIfNotExists(misspelledInterval);
            }
        }
    }
}
