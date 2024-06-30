import { ColorHelper } from '../../../core/model/color/color';
import { ColorModelInfo } from '../../../core/model/color/color-model-info';
import { TableCellShadingInfoHistoryItem } from '../../../core/model/history/items/tables/table-cell-properties-history-items';
import { ControlOptions } from '../../../core/model/options/control';
import { ShadingInfo } from '../../../core/model/shadings/shading-info';
import { TableCellPropertiesMask } from '../../../core/model/tables/properties/table-cell-properties';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ChangeTableCellShadingCommand extends CommandBase {
    getState() {
        let state = new SimpleCommandState(this.isEnabled());
        if (state.enabled) {
            const tableInfo = this.selection.tableInfo;
            let templateColor;
            if (ListUtils.allOf(tableInfo.extendedData.rows, (rowInfo) => ListUtils.allOf(rowInfo.cells, (cellInfo) => {
                if (cellInfo.cell.properties.getUseValue(TableCellPropertiesMask.UseShadingInfoIndex)) {
                    const currCellColor = cellInfo.cell.properties.shadingInfo.getActualColor(this.colorProvider);
                    if (templateColor === undefined) {
                        templateColor = currCellColor;
                        return true;
                    }
                    else
                        return currCellColor == templateColor;
                }
                else
                    return true;
            }))) {
                switch (templateColor) {
                    case undefined:
                        state.value = undefined;
                        break;
                    case ColorHelper.NO_COLOR:
                        state.value = null;
                        break;
                    default: ColorUtils.colorToHash(templateColor);
                }
            }
            else
                state.value = undefined;
        }
        state.denyUpdateValue = true;
        return state;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables) && this.selection.tableInfo.extendedData.numRows > 0;
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return ColorHelper.anyToColor(parameter, ColorHelper.NO_COLOR);
    }
    executeCore(_state, options) {
        this.history.beginTransaction();
        let color = options.param;
        let tableInfo = this.selection.tableInfo;
        let table = tableInfo.table;
        tableInfo.extendedData.foreach(() => { }, (cellInfo, rowInfo) => {
            if (cellInfo.cell.properties.shadingInfo.getActualColor(this.colorProvider) !== color ||
                !cellInfo.cell.properties.getUseValue(TableCellPropertiesMask.UseShadingInfoIndex)) {
                this.history.addAndRedo(new TableCellShadingInfoHistoryItem(this.modelManipulator, options.subDocument, table.index, rowInfo.rowIndex, cellInfo.cellIndex, ShadingInfo.createByColor(ColorModelInfo.makeByColor(color)), true));
            }
        });
        this.history.endTransaction();
        return true;
    }
}
