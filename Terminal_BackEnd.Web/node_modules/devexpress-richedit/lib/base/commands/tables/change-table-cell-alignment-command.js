import { ParagraphAlignmentHistoryItem } from '../../../core/model/history/items/paragraph-properties-history-items';
import { TableCellVerticalAlignmentHistoryItem } from '../../../core/model/history/items/tables/table-cell-properties-history-items';
import { ControlOptions } from '../../../core/model/options/control';
import { ParagraphAlignment } from '../../../core/model/paragraph/paragraph-properties';
import { SubDocumentInterval } from '../../../core/model/sub-document';
import { TableCellVerticalAlignmentMerger } from '../../../core/model/tables/properties-mergers/table-cell-properties-merger';
import { TableCellPropertiesMask } from '../../../core/model/tables/properties/table-cell-properties';
import { TableCellVerticalAlignment } from '../../../core/model/tables/secondary-structures/table-base-structures';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RichEditClientCommand } from '../client-command';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ChangeTableCellAlignmentCommandBase extends CommandBase {
    getRelatedCommands() {
        return {
            [RichEditClientCommand.TableCellAlignBottomCenter]: true,
            [RichEditClientCommand.TableCellAlignBottomLeft]: true,
            [RichEditClientCommand.TableCellAlignBottomRight]: true,
            [RichEditClientCommand.TableCellAlignMiddleCenter]: true,
            [RichEditClientCommand.TableCellAlignMiddleLeft]: true,
            [RichEditClientCommand.TableCellAlignMiddleRight]: true,
            [RichEditClientCommand.TableCellAlignTopCenter]: true,
            [RichEditClientCommand.TableCellAlignTopLeft]: true,
            [RichEditClientCommand.TableCellAlignTopRight]: true,
        };
    }
    getState() {
        let state = new SimpleCommandState(true, false);
        state.enabled = this.isEnabled() && this.selection.tableInfo.extendedData.numRows > 0;
        state.value = this.isChecked(this.selection.activeSubDocument);
        return state;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables);
    }
    isChecked(subDocument) {
        const tableInfo = this.selection.tableInfo;
        return tableInfo.extendedData.allOfCells((cellInfo) => new TableCellVerticalAlignmentMerger().getProperty(cellInfo.cell.properties, tableInfo.table.style, cellInfo.cell.conditionalFormatting, this.control.modelManager.model.defaultTableCellProperties) === this.verticalAlignment &&
            subDocument.getParagraphByPosition(cellInfo.cell.startParagraphPosition.value).getParagraphMergedProperties().alignment === this.horizontalAlignment);
    }
    executeCore(_state, options) {
        this.history.beginTransaction();
        let tableInfo = this.selection.tableInfo;
        let subDocument = options.subDocument;
        let table = tableInfo.table;
        tableInfo.extendedData.foreach(() => { }, (cellInfo, rowInfo) => {
            const cell = cellInfo.cell;
            if (cell.properties.verticalAlignment !== this.verticalAlignment || !cell.properties.getUseValue(TableCellPropertiesMask.UseVerticalAlignment)) {
                this.history.addAndRedo(new TableCellVerticalAlignmentHistoryItem(this.modelManipulator, subDocument, table.index, rowInfo.rowIndex, cellInfo.cellIndex, this.verticalAlignment, true));
            }
            const paragraphIndices = subDocument.getParagraphsIndices(cell.interval);
            ListUtils.forEach(subDocument.paragraphs, (paragraph) => {
                if (paragraph.getParagraphMergedProperties().alignment !== this.horizontalAlignment)
                    this.history.addAndRedo(new ParagraphAlignmentHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocument, paragraph.interval), this.horizontalAlignment, true));
            }, paragraphIndices.start, paragraphIndices.end);
        });
        this.history.endTransaction();
        return true;
    }
}
export class ChangeTableCellTopLeftAlignmentCommand extends ChangeTableCellAlignmentCommandBase {
    constructor() {
        super(...arguments);
        this.horizontalAlignment = ParagraphAlignment.Left;
        this.verticalAlignment = TableCellVerticalAlignment.Top;
    }
}
export class ChangeTableCellTopCenterAlignmentCommand extends ChangeTableCellAlignmentCommandBase {
    constructor() {
        super(...arguments);
        this.horizontalAlignment = ParagraphAlignment.Center;
        this.verticalAlignment = TableCellVerticalAlignment.Top;
    }
}
export class ChangeTableCellTopRightAlignmentCommand extends ChangeTableCellAlignmentCommandBase {
    constructor() {
        super(...arguments);
        this.horizontalAlignment = ParagraphAlignment.Right;
        this.verticalAlignment = TableCellVerticalAlignment.Top;
    }
}
export class ChangeTableCellMiddleLeftAlignmentCommand extends ChangeTableCellAlignmentCommandBase {
    constructor() {
        super(...arguments);
        this.horizontalAlignment = ParagraphAlignment.Left;
        this.verticalAlignment = TableCellVerticalAlignment.Center;
    }
}
export class ChangeTableCellMiddleCenterAlignmentCommand extends ChangeTableCellAlignmentCommandBase {
    constructor() {
        super(...arguments);
        this.horizontalAlignment = ParagraphAlignment.Center;
        this.verticalAlignment = TableCellVerticalAlignment.Center;
    }
}
export class ChangeTableCellMiddleRightAlignmentCommand extends ChangeTableCellAlignmentCommandBase {
    constructor() {
        super(...arguments);
        this.horizontalAlignment = ParagraphAlignment.Right;
        this.verticalAlignment = TableCellVerticalAlignment.Center;
    }
}
export class ChangeTableCellBottomLeftAlignmentCommand extends ChangeTableCellAlignmentCommandBase {
    constructor() {
        super(...arguments);
        this.horizontalAlignment = ParagraphAlignment.Left;
        this.verticalAlignment = TableCellVerticalAlignment.Bottom;
    }
}
export class ChangeTableCellBottomCenterAlignmentCommand extends ChangeTableCellAlignmentCommandBase {
    constructor() {
        super(...arguments);
        this.horizontalAlignment = ParagraphAlignment.Center;
        this.verticalAlignment = TableCellVerticalAlignment.Bottom;
    }
}
export class ChangeTableCellBottomRightAlignmentCommand extends ChangeTableCellAlignmentCommandBase {
    constructor() {
        super(...arguments);
        this.horizontalAlignment = ParagraphAlignment.Right;
        this.verticalAlignment = TableCellVerticalAlignment.Bottom;
    }
}
