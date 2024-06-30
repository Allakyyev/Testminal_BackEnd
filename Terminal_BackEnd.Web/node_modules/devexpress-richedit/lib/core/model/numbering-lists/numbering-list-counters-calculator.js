export class NumberingListCountersCalculator {
    constructor(list) {
        this.counters = [];
        this.usedListIndecies = {};
        this.currentParagraphIndex = -1;
        this.list = list;
        for (var i = 0, listLevel; listLevel = this.list.levels[i]; i++) {
            this.counters.push(listLevel.getListLevelProperties().start - 1);
        }
    }
    calculateCounters(paragraph) {
        this.currentParagraphIndex = -1;
        return this.calculateNextCounters(paragraph);
    }
    calculateNextCounters(paragraph) {
        var paragraphs = paragraph.subDocument.paragraphs;
        if (paragraphs[this.currentParagraphIndex] !== paragraph) {
            var abstractNumberingList = paragraph.getAbstractNumberingList();
            for (var i = this.currentParagraphIndex + 1, currentParagraph; currentParagraph = paragraph.subDocument.paragraphs[i]; i++) {
                this.currentParagraphIndex++;
                if (this.shouldAdvanceListLevelCounters(currentParagraph, abstractNumberingList))
                    this.advanceListLevelCounters(currentParagraph, currentParagraph.getListLevelIndex());
                if (currentParagraph === paragraph)
                    break;
            }
        }
        return this.getActualRangeCounters(paragraph.getListLevelIndex());
    }
    getLastCounters(paragraph) {
        return this.getActualRangeCounters(paragraph.getListLevelIndex());
    }
    shouldAdvanceListLevelCounters(paragraph, abstractNumberingList) {
        return paragraph.getAbstractNumberingList() === abstractNumberingList;
    }
    advanceListLevelCounters(paragraph, listLevelIndex) {
        var numberingListIndex = paragraph.getNumberingListIndex();
        var numberingList = paragraph.subDocument.documentModel.numberingLists[numberingListIndex];
        var level = numberingList.levels[listLevelIndex];
        if (level.overrideStart && !this.usedListIndecies[numberingListIndex]) {
            this.usedListIndecies[numberingListIndex] = true;
            this.counters[listLevelIndex] = level.getNewStart();
        }
        else
            this.counters[listLevelIndex]++;
        this.advanceSkippedLevelCounters(listLevelIndex);
        this.restartNextLevelCounters(listLevelIndex);
    }
    advanceSkippedLevelCounters(listLevelIndex) {
        for (var i = 0; i < listLevelIndex; i++) {
            var listLevel = this.list.levels[i];
            if (this.counters[i] == listLevel.getListLevelProperties().start - 1)
                this.counters[i]++;
        }
    }
    restartNextLevelCounters(listLevelIndex) {
        var restartedLevels = [];
        restartedLevels[listLevelIndex] = true;
        var countersLength = this.counters.length;
        for (var i = listLevelIndex + 1; i < countersLength; i++) {
            var listLevelProperties = this.list.levels[i].getListLevelProperties();
            if (!listLevelProperties.suppressRestart) {
                var restartLevel = i - listLevelProperties.relativeRestartLevel - 1;
                if (restartLevel >= 0 && restartLevel < countersLength && restartedLevels[restartLevel]) {
                    this.counters[i] = listLevelProperties.start - 1;
                    restartedLevels[i] = true;
                }
            }
        }
    }
    getActualRangeCounters(listLevelIndex) {
        var rangeCounters = [];
        for (var i = 0; i <= listLevelIndex; i++)
            rangeCounters[i] = this.counters[i];
        return rangeCounters;
    }
}
