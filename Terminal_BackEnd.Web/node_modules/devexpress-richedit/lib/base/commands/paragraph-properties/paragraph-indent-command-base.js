import { ControlOptions } from '../../../core/model/options/control';
import { ParagraphFirstLineIndent } from '../../../core/model/paragraph/paragraph-properties';
import { RichUtils } from '../../../core/model/rich-utils';
import { Comparers } from '@devexpress/utils/lib/utils/comparers';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ParagraphIndentCommandBase extends CommandBase {
    getState(options = this.convertToCommandOptions(undefined)) {
        return new SimpleCommandState(this.isEnabled(options));
    }
    isEnabled(_options) {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.paragraphFormatting);
    }
    getIntervalsForModifying() {
        return RichUtils.getIntervalsOfSelectedParagraphs(this.selection.intervals, this.selection.activeSubDocument);
    }
    getTabs(paragraphIndices, subDocument) {
        let endParagraphIndex = paragraphIndices[paragraphIndices.length - 1];
        let startParagraphIndex = paragraphIndices[0];
        let firstParagraph = subDocument.paragraphs[startParagraphIndex];
        let tabsInfo = firstParagraph.getTabs();
        let result = [];
        for (var i = 0, tabInfo; tabInfo = tabsInfo.positions[i]; i++) {
            result.push(tabInfo.position);
        }
        result.push(tabsInfo.defaultTabStop);
        if (paragraphIndices[0] === 0 && paragraphIndices.length === 1)
            result = result.concat(this.getParagraphTabs(firstParagraph));
        else {
            if (paragraphIndices[0] > 0)
                result = result.concat(this.getParagraphTabs(subDocument.paragraphs[startParagraphIndex - 1]));
            if (endParagraphIndex < subDocument.paragraphs.length - 1)
                result = result.concat(this.getParagraphTabs(subDocument.paragraphs[endParagraphIndex + 1]));
        }
        result.sort(Comparers.number);
        return result;
    }
    getNearRightDefaultTab(leftIndent) {
        var defTabWidth = this.control.modelManager.model.defaultTabWidth;
        return Math.floor((leftIndent / defTabWidth) + 1) * defTabWidth;
    }
    getNearLeftDefaultTab(leftIndent) {
        var defTabWidth = this.control.modelManager.model.defaultTabWidth;
        var nearestLeftDefaultTab = Math.floor(leftIndent / defTabWidth);
        if (nearestLeftDefaultTab > 0) {
            if (leftIndent % defTabWidth != 0)
                return nearestLeftDefaultTab * defTabWidth;
            else
                return (nearestLeftDefaultTab - 1) * defTabWidth;
        }
        return nearestLeftDefaultTab;
    }
    getNearRightTab(leftIndent, tabs) {
        for (var i = 0; i < tabs.length; i++) {
            if (leftIndent < tabs[i])
                return tabs[i];
        }
        return leftIndent;
    }
    getNearLeftTab(leftIndent, tabs) {
        for (var i = tabs.length - 1; i >= 0; i--) {
            if (leftIndent > tabs[i])
                return tabs[i];
        }
        return leftIndent;
    }
    getParagraphTabs(paragraph) {
        var result = [];
        var mergedProperties = paragraph.getParagraphMergedProperties();
        result.push(mergedProperties.leftIndent);
        if (mergedProperties.firstLineIndentType === ParagraphFirstLineIndent.Hanging)
            result.push(mergedProperties.leftIndent - mergedProperties.firstLineIndent);
        else if (mergedProperties.firstLineIndentType === ParagraphFirstLineIndent.Indented)
            result.push(mergedProperties.leftIndent + mergedProperties.firstLineIndent);
        return result;
    }
}
