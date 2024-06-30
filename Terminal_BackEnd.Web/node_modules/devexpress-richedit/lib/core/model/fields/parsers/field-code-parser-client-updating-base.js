import { Errors } from '@devexpress/utils/lib/errors';
import { SelectionIntervalsInfo } from '../../../selection/selection-intervals-info';
import { ChangeFieldHyperlinkInfoHistoryItem } from '../../history/items/change-field-hyperlink-info-history-item';
import { FieldInsertHistoryItem } from '../../history/items/field-insert-history-item';
import { Field, HyperlinkInfo } from '../field';
import { FieldCodeParser, FieldCodeParserState, FieldMailMergeType } from './field-code-parser';
export class FieldCodeParserClientUpdatingBase extends FieldCodeParser {
    getMailMergeType() {
        return FieldMailMergeType.NonMailMerge;
    }
    parseCodeCurrentFieldInternal(_responce) {
        this.removeInterval(this.getTopField().getResultInterval());
        if (this.parseSwitchesAndArgs(true))
            this.fillResult();
        this.parserState = FieldCodeParserState.end;
        return true;
    }
    createLocalHyperLink(interval, bookmarkName) {
        this.modelManager.history.addAndRedo(new FieldInsertHistoryItem(this.modelManager.modelManipulator, this.subDocument, interval.start, 0, interval.length, false, this.inputPos.charPropsBundle));
        let fieldIndex = Field.normedBinaryIndexOf(this.subDocument.fields, interval.start + 1);
        let field = this.subDocument.fields[fieldIndex];
        const hyperlinkInfo = new HyperlinkInfo("", bookmarkName, "", false);
        this.modelManager.history.addAndRedo(new ChangeFieldHyperlinkInfoHistoryItem(this.modelManager.modelManipulator, this.subDocument, field.index, hyperlinkInfo));
        this.inputPos.setIntervals(SelectionIntervalsInfo.fromInterval(this.subDocument, field.getCodeInterval()));
        this.replaceTextByInterval(field.getCodeInterval(), this.modelManager.model.simpleFormattersManager.formatString("HYPERLINK \\l \"{0}\"", bookmarkName));
    }
    fillResult() {
        throw new Error(Errors.NotImplemented);
    }
}
