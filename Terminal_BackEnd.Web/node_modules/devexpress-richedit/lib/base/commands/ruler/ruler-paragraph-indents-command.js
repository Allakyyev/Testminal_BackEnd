import { ParagraphFirstLineIndentHistoryItem, ParagraphFirstLineIndentTypeHistoryItem, ParagraphLeftIndentHistoryItem, ParagraphRightIndentHistoryItem } from '../../../core/model/history/items/paragraph-properties-history-items';
import { ParagraphFirstLineIndent } from '../../../core/model/paragraph/paragraph-properties';
import { RichUtils } from '../../../core/model/rich-utils';
import { SubDocumentInterval } from '../../../core/model/sub-document';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { CommandBase, CommandOptions } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class RulerParagraphLeftIndentsCommandValue extends CommandOptions {
    constructor(control, hanging, firstLine) {
        super(control);
        this.hanging = hanging;
        this.firstLine = firstLine;
    }
}
export class RulerParagraphLeftIndentsCommand extends CommandBase {
    DEPRECATEDCorrectlMainCommandOptions(options) {
        options.intervalsInfo.subDocument = this.selection.activeSubDocument;
        options.intervalsInfo.intervals = this.selection.intervals;
    }
    getState(options = this.convertToCommandOptions(undefined)) {
        if (!options.subDocument)
            this.DEPRECATEDCorrectlMainCommandOptions(options);
        const info = RichUtils.getSelectedParagraphs(options.intervalsInfo.intervals, options.subDocument);
        var parProps = info.paragraphs[0].getParagraphMergedProperties();
        var leftIndent = UnitConverter.twipsToPixelsF(parProps.leftIndent);
        var fstLineIndent = UnitConverter.twipsToPixelsF(parProps.firstLineIndent);
        switch (parProps.firstLineIndentType) {
            case ParagraphFirstLineIndent.Indented:
                return new SimpleCommandState(this.isEnabled(), new RulerParagraphLeftIndentsCommandValue(this.control, leftIndent, leftIndent + fstLineIndent));
            case ParagraphFirstLineIndent.None:
                return new SimpleCommandState(this.isEnabled(), new RulerParagraphLeftIndentsCommandValue(this.control, leftIndent, leftIndent));
            case ParagraphFirstLineIndent.Hanging:
                return new SimpleCommandState(this.isEnabled(), new RulerParagraphLeftIndentsCommandValue(this.control, leftIndent, leftIndent - fstLineIndent));
        }
        return new SimpleCommandState(this.isEnabled());
    }
    getIntervalsForModifying() {
        return RichUtils.getIntervalsOfSelectedParagraphs(this.selection.intervals, this.selection.activeSubDocument);
    }
    executeCore(_state, options) {
        const indents = options;
        const subDocument = options.subDocument;
        var hanging = UnitConverter.pixelsToTwips(indents.hanging);
        var fstLine = UnitConverter.pixelsToTwips(indents.firstLine);
        var firstLineIndent = Math.abs(hanging - fstLine);
        var firstLineIndentType = ParagraphFirstLineIndent.None;
        if (hanging < fstLine)
            firstLineIndentType = ParagraphFirstLineIndent.Indented;
        else if (hanging > fstLine)
            firstLineIndentType = ParagraphFirstLineIndent.Hanging;
        var modelManipulator = this.modelManipulator;
        this.history.beginTransaction();
        for (let interval of options.intervalsInfo.intervals) {
            this.history.addAndRedo(new ParagraphFirstLineIndentHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), firstLineIndent, true));
            this.history.addAndRedo(new ParagraphFirstLineIndentTypeHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), firstLineIndentType, true));
            this.history.addAndRedo(new ParagraphLeftIndentHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), hanging, true));
        }
        this.history.endTransaction();
        return true;
    }
}
export class RulerParagraphRightIndentCommand extends CommandBase {
    getState(options = this.convertToCommandOptions(undefined)) {
        var info = RichUtils.getSelectedParagraphs(options.intervalsInfo.intervals, options.subDocument);
        var parWithMaxRightIndent = info.paragraphs[0];
        for (var i = 1, paragraph; paragraph = info.paragraphs[i]; i++)
            if (paragraph.getParagraphMergedProperties().rightIndent > parWithMaxRightIndent.getParagraphMergedProperties().rightIndent)
                parWithMaxRightIndent = paragraph;
        var rightIndent = UnitConverter.twipsToPixelsF(parWithMaxRightIndent.getParagraphMergedProperties().rightIndent);
        return new SimpleCommandState(this.isEnabled(), new RulerParagraphLeftIndentsCommandValue(this.control, rightIndent, undefined));
    }
    getIntervalsForModifying() {
        return RichUtils.getIntervalsOfSelectedParagraphs(this.selection.intervals, this.selection.activeSubDocument);
    }
    executeCore(state, options) {
        this.history.beginTransaction();
        for (var i = 0, interval; interval = state.value.intervalsInfo.intervals[i]; i++)
            this.history.addAndRedo(new ParagraphRightIndentHistoryItem(this.modelManipulator, new SubDocumentInterval(options.subDocument, interval), UnitConverter.pixelsToTwips(options.param), true));
        this.history.endTransaction();
        return true;
    }
}
