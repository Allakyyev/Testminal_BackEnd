import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { ColumnCalculator } from '../../../core/layout-formatter/formatter/utils/columns-calculator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { ParagraphFirstLineIndentHistoryItem, ParagraphFirstLineIndentTypeHistoryItem } from '../../../core/model/history/items/paragraph-properties-history-items';
import { ParagraphFirstLineIndent } from '../../../core/model/paragraph/paragraph-properties';
import { SubDocumentInterval } from '../../../core/model/sub-document';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { RichEditClientCommand } from '../client-command';
import { ParagraphIndentCommandBase } from './paragraph-indent-command-base';
export class ChangeParagraphIndentFromFirstRowCommandBase extends ParagraphIndentCommandBase {
    executeCore(_state, options) {
        const subDocument = options.subDocument;
        var paragraphIndices = subDocument.getParagraphIndicesByIntervals(options.intervalsInfo.intervals);
        var firstParagraph = subDocument.paragraphs[paragraphIndices[0]];
        if (this.needUpdateFirstLineIndent(firstParagraph)) {
            this.history.beginTransaction();
            var maxFirstLineIndent = this.getMaxFirstLineIndent(firstParagraph, subDocument);
            var tabs = this.getTabs(paragraphIndices, subDocument);
            var firstLineIndent = this.getFirstLineIndent(firstParagraph, tabs);
            this.assignParagraphFirstLineIndent(firstParagraph, firstLineIndent, maxFirstLineIndent, subDocument);
            this.history.endTransaction();
            return true;
        }
        else
            return this.getParagraphLeftIndentCommand().execute(this.control.commandManager.isPublicApiCall);
    }
    assignParagraphFirstLineIndent(paragraph, firstLineIndent, maxValue, subDocument) {
        if (firstLineIndent > 0) {
            this.history.addAndRedo(new ParagraphFirstLineIndentTypeHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocument, paragraph.interval), ParagraphFirstLineIndent.Indented, true));
            var distanceToRight = maxValue - (paragraph.getParagraphMergedProperties().leftIndent + firstLineIndent);
            if (distanceToRight < 0)
                firstLineIndent += distanceToRight;
            this.history.addAndRedo(new ParagraphFirstLineIndentHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocument, paragraph.interval), firstLineIndent, true));
        }
        else if (firstLineIndent < 0) {
            this.history.addAndRedo(new ParagraphFirstLineIndentTypeHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocument, paragraph.interval), ParagraphFirstLineIndent.Hanging, true));
            this.history.addAndRedo(new ParagraphFirstLineIndentHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocument, paragraph.interval), Math.abs(firstLineIndent), true));
        }
        else {
            this.history.addAndRedo(new ParagraphFirstLineIndentTypeHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocument, paragraph.interval), ParagraphFirstLineIndent.None, true));
            this.history.addAndRedo(new ParagraphFirstLineIndentHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocument, paragraph.interval), 0, true));
        }
    }
    getFirstLineIndentAbsPosition(paragraphProperties) {
        switch (paragraphProperties.firstLineIndentType) {
            case ParagraphFirstLineIndent.Indented:
                return paragraphProperties.leftIndent + paragraphProperties.firstLineIndent;
            case ParagraphFirstLineIndent.Hanging:
                return paragraphProperties.leftIndent - paragraphProperties.firstLineIndent;
            default:
                return paragraphProperties.leftIndent;
        }
    }
}
export class IncrementParagraphIndentFromFirstRowCommand extends ChangeParagraphIndentFromFirstRowCommandBase {
    getParagraphLeftIndentCommand() {
        return this.control.commandManager.getCommand(RichEditClientCommand.IncrementParagraphLeftIndent);
    }
    getMaxFirstLineIndent(paragraph, subDocument) {
        var logPosition = paragraph.startLogPosition.value;
        var layoutPosition = (subDocument.isMain()
            ? new LayoutPositionMainSubDocumentCreator(this.control.layout, subDocument, logPosition, DocumentLayoutDetailsLevel.Column)
            : new LayoutPositionOtherSubDocumentCreator(this.control.layout, subDocument, logPosition, this.selection.pageIndex, DocumentLayoutDetailsLevel.Column))
            .create(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(true));
        if (layoutPosition)
            return UnitConverter.pixelsToTwips(layoutPosition.column.width);
        else {
            var section = this.control.modelManager.model.getSectionByPosition(paragraph.startLogPosition.value);
            return UnitConverter.pixelsToTwips(ColumnCalculator.findMinimalColumnSize(section.sectionProperties).width);
        }
    }
    getFirstLineIndent(paragraph, tabs) {
        var paragraphProperties = paragraph.getParagraphMergedProperties();
        var firstLineIndentAbsPosition = this.getFirstLineIndentAbsPosition(paragraphProperties);
        var nearestRightTab = this.getNearRightTab(firstLineIndentAbsPosition, tabs);
        var nearestDefaultTab = this.getNearRightDefaultTab(firstLineIndentAbsPosition);
        if (nearestRightTab > firstLineIndentAbsPosition)
            return Math.min(nearestRightTab, nearestDefaultTab) - paragraphProperties.leftIndent;
        return nearestDefaultTab - paragraphProperties.leftIndent;
    }
    needUpdateFirstLineIndent(paragraph) {
        var paragraphProperties = paragraph.getParagraphMergedProperties();
        var currentIndent = paragraphProperties.leftIndent;
        var rightDefaultTab = this.getNearRightDefaultTab(paragraphProperties.leftIndent + paragraphProperties.firstLineIndentType);
        switch (paragraphProperties.firstLineIndentType) {
            case ParagraphFirstLineIndent.Indented:
                currentIndent += paragraphProperties.firstLineIndent;
                break;
            case ParagraphFirstLineIndent.Hanging:
                currentIndent -= paragraphProperties.firstLineIndent;
        }
        return currentIndent < rightDefaultTab;
    }
}
export class DecrementParagraphIndentFromFirstRowCommand extends ChangeParagraphIndentFromFirstRowCommandBase {
    getMaxFirstLineIndent(_paragraph, _subDocument) {
        return Number.MAX_VALUE;
    }
    getFirstLineIndent(paragraph, tabs) {
        var paragraphProperties = paragraph.getParagraphMergedProperties();
        var firstLineIndentAbsPosition = this.getFirstLineIndentAbsPosition(paragraphProperties);
        var nearestLeftTab = this.getNearLeftTab(firstLineIndentAbsPosition, tabs);
        var nearestDefaultTab = this.getNearLeftDefaultTab(firstLineIndentAbsPosition);
        return Math.max(0, Math.max(nearestLeftTab, nearestDefaultTab) - paragraphProperties.leftIndent);
    }
    needUpdateFirstLineIndent(paragraph) {
        var paragraphProperties = paragraph.getParagraphMergedProperties();
        return paragraphProperties.firstLineIndentType === ParagraphFirstLineIndent.Indented;
    }
    getParagraphLeftIndentCommand() {
        return this.control.commandManager.getCommand(RichEditClientCommand.DecrementParagraphLeftIndent);
    }
}
