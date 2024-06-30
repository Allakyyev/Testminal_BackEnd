import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { SpecialCharacters } from './special-characters';
export class RichUtils {
    static getSelectedParagraphs(intervals, subDocument) {
        intervals = IntervalAlgorithms.getMergedIntervals(intervals, true);
        var selectedParagraphs = [];
        for (var i = 0, interval; interval = intervals[i]; i++)
            selectedParagraphs = selectedParagraphs.concat(subDocument.getParagraphsByInterval(interval));
        selectedParagraphs = selectedParagraphs.sort(function (a, b) { return a.startLogPosition.value < b.startLogPosition.value ? -1 : 1; });
        var newSelectedParagraphs = [selectedParagraphs[0]];
        var prevLogPos = newSelectedParagraphs[0].startLogPosition.value;
        for (var i = 1, paragraph; paragraph = selectedParagraphs[i]; i++)
            if (paragraph.startLogPosition.value != prevLogPos) {
                newSelectedParagraphs.push(paragraph);
                prevLogPos = paragraph.startLogPosition.value;
            }
        return { paragraphs: newSelectedParagraphs, intervals: intervals };
    }
    static getIntervalsOfSelectedParagraphs(intervals, subDocument) {
        let result = [];
        const paragraphs = this.getSelectedParagraphs(intervals, subDocument).paragraphs;
        ListUtils.forEach(paragraphs, (p) => {
            result.push(FixedInterval.fromPositions(p.startLogPosition.value, p.getEndPosition()));
        });
        return result;
    }
    static getCopyPasteGuid(guids) {
        return `re-rangecopy&${guids.sguid}&${guids.cguid}`;
    }
    static getCopyPasteGuidLabel(guids) {
        return `id=\"${RichUtils.getCopyPasteGuid(guids)}\"`;
    }
    static getNextPredefinedFontSize(current) {
        var index = SearchUtils.normedInterpolationIndexOf(RichUtils.predefinedFontSizes, (a) => a, current);
        return RichUtils.predefinedFontSizes[index + 1] !== undefined ? RichUtils.predefinedFontSizes[index + 1] : (Math.floor(current / 10) * 10 + 10);
    }
    static getPreviousPredefinedFontSize(current) {
        var index = SearchUtils.binaryIndexOf(RichUtils.predefinedFontSizes, (a) => a - current);
        if (index > 0)
            return RichUtils.predefinedFontSizes[index - 1];
        if (index < 0)
            index = ~index;
        if (index === 0)
            return Math.max(1, current - 1);
        var predefinedFontsCount = RichUtils.predefinedFontSizes.length;
        if (index < predefinedFontsCount)
            return RichUtils.predefinedFontSizes[index - 1];
        var newValue = current % 10 > 0 ? (Math.floor(current / 10) * 10) : (Math.floor(current / 10) * 10 - 10);
        if (newValue >= RichUtils.predefinedFontSizes[predefinedFontsCount - 1])
            return newValue;
        return RichUtils.predefinedFontSizes[predefinedFontsCount - 1];
    }
    static replaceParagraphEndCharsWithLineBreak(text) {
        return text.replace(/(\r\n)|(\n)|(\r)/g, RichUtils.specialCharacters.LineBreak);
    }
}
RichUtils.isLatinLetter = /\w/;
RichUtils.isWhitespace = /\s/;
RichUtils.isAlphanumeric = /^[\u00C0-\u1FFF\u2C00-\uD7FF\w]+$/;
RichUtils.predefinedFontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
RichUtils.minFontSize = 1;
RichUtils.maxFontSize = 600;
RichUtils.specialCharacters = new SpecialCharacters();
