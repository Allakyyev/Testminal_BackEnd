import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { ColumnCalculator } from '../../../core/layout-formatter/formatter/utils/columns-calculator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { ParagraphFirstLineIndentHistoryItem, ParagraphLeftIndentHistoryItem } from '../../../core/model/history/items/paragraph-properties-history-items';
import { ParagraphFirstLineIndent } from '../../../core/model/paragraph/paragraph-properties';
import { SubDocumentInterval } from '../../../core/model/sub-document';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { ParagraphIndentCommandBase } from './paragraph-indent-command-base';
export class ChangeParagraphLeftIndentCommand extends ParagraphIndentCommandBase {
    executeCore(_state, options) {
        const subDocument = options.subDocument;
        var paragraphIndices = subDocument.getParagraphIndicesByIntervals(this.selection.intervals);
        var result = false;
        this.history.beginTransaction();
        var tabs = this.getTabs(paragraphIndices, subDocument);
        let paragraphIndicesLength = paragraphIndices.length;
        for (let i = 0; i < paragraphIndicesLength; i++) {
            let paragraphIndex = paragraphIndices[i];
            result = this.applyLeftIndentToParagraph(subDocument.paragraphs[paragraphIndex], tabs) || result;
        }
        this.history.endTransaction();
        return result;
    }
    applyLeftIndentToParagraph(paragraph, tabs) {
        var newLeftIndent = this.getNewLeftIndent(paragraph, tabs);
        var maxLeftIndent = this.getMaxLeftIndent(paragraph);
        var parInterval = paragraph.interval;
        if (newLeftIndent === paragraph.getParagraphMergedProperties().leftIndent)
            return false;
        if (newLeftIndent >= 0) {
            if (paragraph.getParagraphMergedProperties().firstLineIndentType === ParagraphFirstLineIndent.Hanging) {
                var firstLineLeftIndent = newLeftIndent - paragraph.getParagraphMergedProperties().firstLineIndent;
                if (firstLineLeftIndent < 0)
                    newLeftIndent -= firstLineLeftIndent;
            }
        }
        var modelManipulator = this.modelManipulator;
        this.history.addAndRedo(new ParagraphLeftIndentHistoryItem(modelManipulator, new SubDocumentInterval(this.selection.activeSubDocument, parInterval), newLeftIndent, true));
        if (paragraph.getParagraphMergedProperties().firstLineIndentType == ParagraphFirstLineIndent.Indented) {
            var distanceToRight = maxLeftIndent - (paragraph.getParagraphMergedProperties().leftIndent + paragraph.getParagraphMergedProperties().firstLineIndent);
            if (distanceToRight < 0) {
                this.history.addAndRedo(new ParagraphFirstLineIndentHistoryItem(modelManipulator, new SubDocumentInterval(this.selection.activeSubDocument, parInterval), paragraph.getParagraphMergedProperties().firstLineIndent + distanceToRight, true));
            }
        }
        return true;
    }
}
export class IncrementParagraphLeftIndentCommand extends ChangeParagraphLeftIndentCommand {
    getNewLeftIndent(paragraph, tabs) {
        var paragraphProperties = paragraph.getParagraphMergedProperties();
        var nearRightDefaultTab = this.getNearRightDefaultTab(paragraphProperties.leftIndent);
        var nearRightTab = this.getNearRightTab(paragraphProperties.leftIndent, tabs);
        var result = (nearRightDefaultTab < nearRightTab || nearRightTab === paragraphProperties.leftIndent) ? nearRightDefaultTab : nearRightTab;
        var position = this.getPosition(paragraph);
        if (!position) {
            var section = this.control.modelManager.model.getSectionByPosition(paragraph.startLogPosition.value);
            var minimalColumnSize = ColumnCalculator.findMinimalColumnSize(section.sectionProperties);
            return Math.min(result, UnitConverter.pixelsToTwips(minimalColumnSize.width));
        }
        return Math.min(result, UnitConverter.pixelsToTwips(position.column.width));
    }
    getMaxLeftIndent(paragraph) {
        var position = this.getPosition(paragraph);
        if (position)
            return UnitConverter.pixelsToTwips(position.column.width);
        else {
            var section = this.control.modelManager.model.getSectionByPosition(paragraph.startLogPosition.value);
            return UnitConverter.pixelsToTwips(ColumnCalculator.findMinimalColumnSize(section.sectionProperties).width);
        }
    }
    getPosition(paragraph) {
        var subDocument = this.selection.activeSubDocument;
        return (subDocument.isMain() ? new LayoutPositionMainSubDocumentCreator(this.control.layout, subDocument, paragraph.startLogPosition.value, DocumentLayoutDetailsLevel.Column)
            : new LayoutPositionOtherSubDocumentCreator(this.control.layout, subDocument, paragraph.startLogPosition.value, this.selection.pageIndex, DocumentLayoutDetailsLevel.Column))
            .create(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(true));
    }
}
export class DecrementParagraphLeftIndentCommand extends ChangeParagraphLeftIndentCommand {
    getNewLeftIndent(paragraph, tabs) {
        var paragraphProperties = paragraph.getParagraphMergedProperties();
        var nearLeftDefaultTab = this.getNearLeftDefaultTab(paragraphProperties.leftIndent);
        var nearLeftTab = this.getNearLeftTab(paragraphProperties.leftIndent, tabs);
        return (nearLeftDefaultTab > nearLeftTab || nearLeftTab == paragraphProperties.leftIndent) ? nearLeftDefaultTab : nearLeftTab;
    }
    getMaxLeftIndent(_paragraph) {
        return Number.MAX_VALUE;
    }
}
