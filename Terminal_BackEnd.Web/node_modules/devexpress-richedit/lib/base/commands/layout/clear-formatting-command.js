import { ApplyCharacterStyleHistoryItem, ApplyParagraphStyleHistoryItem } from '../../../core/model/history/items/apply-style-history-items';
import { FontBoldHistoryItem, FontCapsHistoryItem, FontHiddenHistoryItem, FontHighlightColorHistoryItem, FontItalicHistoryItem, FontNameHistoryItem, FontNoProofHistoryItem, FontScriptHistoryItem, FontShadingInfoHistoryItem, FontSizeHistoryItem, FontSmallCapsHistoryItem, FontStrikeoutColorHistoryItem, FontStrikeoutTypeHistoryItem, FontStrikeoutWordsOnlyHistoryItem, FontTextColorHistoryItem, FontUnderlineColorHistoryItem, FontUnderlineTypeHistoryItem, FontUnderlineWordsOnlyHistoryItem } from '../../../core/model/history/items/character-properties-history-items';
import { ParagraphAfterAutoSpacingHistoryItem, ParagraphAlignmentHistoryItem, ParagraphBeforeAutoSpacingHistoryItem, ParagraphContextualSpacingHistoryItem, ParagraphDivIdHistoryItem, ParagraphFirstLineIndentHistoryItem, ParagraphFirstLineIndentTypeHistoryItem, ParagraphKeepLinesTogetherHistoryItem, ParagraphLeftIndentHistoryItem, ParagraphLineSpacingHistoryItem, ParagraphLineSpacingTypeHistoryItem, ParagraphOutlineLevelHistoryItem, ParagraphPageBreakBeforeHistoryItem, ParagraphRightIndentHistoryItem, ParagraphShadingInfoIndexHistoryItem, ParagraphSpacingAfterHistoryItem, ParagraphSpacingBeforeHistoryItem, ParagraphSuppressHyphenationHistoryItem, ParagraphSuppressLineNumbersHistoryItem, ParagraphWidowOrphanControlHistoryItem } from '../../../core/model/history/items/paragraph-properties-history-items';
import { ControlOptions } from '../../../core/model/options/control';
import { SubDocumentInterval } from '../../../core/model/sub-document';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RichEditClientCommand } from '../client-command';
import { CommandBase } from '../command-base';
import { IntervalCommandStateEx } from '../command-states';
export class ClearFormattingCommand extends CommandBase {
    getActualIntervals() {
        if (this.selection.isCollapsed())
            return [this.selection.activeSubDocument.getWholeWordInterval(this.selection.intervals[0].start)];
        return ListUtils.deepCopy(this.selection.intervalsInfo.intervals);
    }
    getState() {
        return new IntervalCommandStateEx(this.isEnabled(), this.getActualIntervals());
    }
    DEPRECATEDCorrectlMainCommandOptions(options) {
        options.intervalsInfo.intervals = this.getActualIntervals();
    }
    executeCore(_state, options) {
        const modelManipulator = this.modelManipulator;
        const model = modelManipulator.model;
        const subDocument = options.subDocument;
        this.history.beginTransaction();
        const defaultCharProperties = model.defaultCharacterProperties;
        if (options.intervalsInfo.intervals.length > 0) {
            for (let i = 0, interval; interval = options.intervalsInfo.intervals[i]; i++) {
                if (interval.length > 0) {
                    this.history.addAndRedo(new ApplyCharacterStyleHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), model.getDefaultCharacterStyle(), true));
                    this.history.addAndRedo(new FontBoldHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultCharProperties.fontBold, false));
                    this.history.addAndRedo(new FontCapsHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultCharProperties.allCaps, false));
                    this.history.addAndRedo(new FontSmallCapsHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultCharProperties.smallCaps, false));
                    this.history.addAndRedo(new FontUnderlineTypeHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultCharProperties.fontUnderlineType, false));
                    this.history.addAndRedo(new FontTextColorHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultCharProperties.textColor, false));
                    this.history.addAndRedo(new FontShadingInfoHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultCharProperties.shadingInfo, false));
                    this.history.addAndRedo(new FontHighlightColorHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultCharProperties.highlightColor, false));
                    this.history.addAndRedo(new FontHiddenHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultCharProperties.hidden, false));
                    this.history.addAndRedo(new FontItalicHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultCharProperties.fontItalic, false));
                    this.history.addAndRedo(new FontNameHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultCharProperties.fontInfo, false));
                    this.history.addAndRedo(new FontScriptHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultCharProperties.script, false));
                    this.history.addAndRedo(new FontSizeHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultCharProperties.fontSize, false));
                    this.history.addAndRedo(new FontStrikeoutTypeHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultCharProperties.fontStrikeoutType, false));
                    this.history.addAndRedo(new FontUnderlineColorHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultCharProperties.underlineColor, false));
                    this.history.addAndRedo(new FontUnderlineWordsOnlyHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultCharProperties.underlineWordsOnly, false));
                    this.history.addAndRedo(new FontStrikeoutWordsOnlyHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultCharProperties.strikeoutWordsOnly, false));
                    this.history.addAndRedo(new FontStrikeoutColorHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultCharProperties.strikeoutColor, false));
                    this.history.addAndRedo(new FontNoProofHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultCharProperties.noProof, false));
                }
            }
        }
        const paragraphIndices = this.control.selection.activeSubDocument.getParagraphIndicesByIntervals(options.intervalsInfo.intervals);
        for (let i = paragraphIndices.length - 1; i >= 0; i--) {
            if (!this.control.selection.activeSubDocument.isEditable([this.control.selection.activeSubDocument.paragraphs[i].interval]))
                continue;
            let paragraph = subDocument.paragraphs[paragraphIndices[i]];
            let interval = paragraph.interval;
            paragraph.onParagraphPropertiesChanged();
            this.history.addAndRedo(new ApplyParagraphStyleHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), model.getDefaultParagraphStyle()));
            const defaultParProperties = model.defaultParagraphProperties;
            this.history.addAndRedo(new ParagraphAlignmentHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultParProperties.alignment, false));
            this.history.addAndRedo(new ParagraphContextualSpacingHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultParProperties.contextualSpacing, false));
            this.history.addAndRedo(new ParagraphAfterAutoSpacingHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultParProperties.afterAutoSpacing, false));
            this.history.addAndRedo(new ParagraphShadingInfoIndexHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultParProperties.shadingInfo, false));
            this.history.addAndRedo(new ParagraphBeforeAutoSpacingHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultParProperties.beforeAutoSpacing, false));
            this.history.addAndRedo(new ParagraphFirstLineIndentHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultParProperties.firstLineIndent, false));
            this.history.addAndRedo(new ParagraphFirstLineIndentTypeHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultParProperties.firstLineIndentType, false));
            this.history.addAndRedo(new ParagraphKeepLinesTogetherHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultParProperties.keepLinesTogether, false));
            this.history.addAndRedo(new ParagraphLeftIndentHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultParProperties.leftIndent, false));
            this.history.addAndRedo(new ParagraphLineSpacingHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultParProperties.lineSpacing, false));
            this.history.addAndRedo(new ParagraphLineSpacingTypeHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultParProperties.lineSpacingType, false));
            this.history.addAndRedo(new ParagraphOutlineLevelHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultParProperties.outlineLevel, false));
            this.history.addAndRedo(new ParagraphPageBreakBeforeHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultParProperties.pageBreakBefore, false));
            this.history.addAndRedo(new ParagraphRightIndentHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultParProperties.rightIndent, false));
            this.history.addAndRedo(new ParagraphSpacingAfterHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultParProperties.spacingAfter, false));
            this.history.addAndRedo(new ParagraphSpacingBeforeHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultParProperties.spacingBefore, false));
            this.history.addAndRedo(new ParagraphSuppressHyphenationHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultParProperties.suppressHyphenation, false));
            this.history.addAndRedo(new ParagraphSuppressLineNumbersHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultParProperties.suppressLineNumbers, false));
            this.history.addAndRedo(new ParagraphWidowOrphanControlHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultParProperties.widowOrphanControl, false));
            this.history.addAndRedo(new ParagraphDivIdHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), defaultParProperties.divId, false));
        }
        this.control.commandManager.getCommand(RichEditClientCommand.DeleteNumerationFromParagraphs).execute(this.control.commandManager.isPublicApiCall);
        this.history.endTransaction();
        return true;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.characterFormatting);
    }
}
