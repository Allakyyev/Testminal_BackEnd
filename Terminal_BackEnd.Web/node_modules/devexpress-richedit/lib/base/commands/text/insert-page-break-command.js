import { InsertParagraphManipulatorParams } from '../../../core/model/manipulators/paragraph-manipulator/insert-paragraph-manipulator-params';
import { InsertTextManipulatorParams } from '../../../core/model/manipulators/text-manipulator/insert-text-manipulator-params';
import { ControlOptions, PageBreakInsertMode } from '../../../core/model/options/control';
import { RichUtils } from '../../../core/model/rich-utils';
import { RunType } from '../../../core/model/runs/run-type';
import { SubDocumentPosition } from '../../../core/model/sub-document';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class InsertPageBreakCommand extends CommandBase {
    getState(options = this.convertToCommandOptions(undefined)) {
        return new SimpleCommandState(this.isEnabled(options));
    }
    executeCore(_state, options) {
        this.history.addTransaction(() => {
            this.addSelectionBefore();
            let pos = options.intervalsInfo.position;
            if (this.control.modelManager.richOptions.control.pageBreakInsertMode === PageBreakInsertMode.NewLine)
                pos = CommandBase.replaceTextByParagraph(this.control.modelManager, this.inputPosition, options.intervalsInfo.subDocInterval).end;
            pos = this.modelManipulator.text.insertTextViaHistory(new InsertTextManipulatorParams(new SubDocumentPosition(options.subDocument, pos), this.inputPosition.charPropsBundle, RunType.TextRun, RichUtils.specialCharacters.PageBreak)).insertedInterval.end;
            pos = this.modelManipulator.paragraph.insertParagraphViaHistory(InsertParagraphManipulatorParams.makeParamsByPosition(new SubDocumentPosition(options.subDocument, pos), this.inputPosition)).end;
            this.addSelectionAfter(pos);
        });
        return true;
    }
    isEnabled(options) {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.paragraphs) &&
            this.selection.tableInfo.extendedData.numRows == 0 && options.subDocument.isMain();
    }
}
