import { BorderInfo } from '../../../core/model/borders/border-info';
import { BorderLineStyle } from '../../../core/model/borders/enums';
import { ColorHelper } from '../../../core/model/color/color';
import { ColorModelInfo } from '../../../core/model/color/color-model-info';
import { TableCellPropertiesMergerShadingInfo } from '../../../core/model/tables/properties-mergers/table-cell-properties-merger';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RichEditClientCommand } from '../client-command';
import { CommandSimpleOptions } from '../command-base';
import { SimpleCommandState } from '../command-states';
import { ToggleTableCellInsideHorizontalBordersCommand, ToggleTableCellInsideVerticalBordersCommand, ToggleTableCellsBottomBorderCommand, ToggleTableCellsLeftBorderCommand, ToggleTableCellsRightBorderCommand, ToggleTableCellsTopBorderCommand } from '../tables/toggle-table-cells-border-command';
import { DialogParametersBase, ShowDialogCommandBase } from './show-dialog-command-base';
export class DialogBorderShadingCommandBase extends ShowDialogCommandBase {
    getState() {
        const visible = this.selection.tableInfo.extendedData.numRows > 0;
        let state = new SimpleCommandState(this.isEnabled() && visible);
        state.visible = visible;
        return state;
    }
    makeParams(applyToWholeTable, colorProvider) {
        let dialogParams = new BorderShadingDialogParameters();
        let selection = this.selection;
        let tableInfo = selection.tableInfo;
        let startCell = tableInfo.extendedData.firstCell;
        let table = startCell.parentRow.parentTable;
        let selectionStateInfo;
        dialogParams.applyToWholeTable = applyToWholeTable;
        if ((typeof dialogParams.applyToWholeTable !== "boolean" && this.isNoFullSelectedCell(selection)) || dialogParams.applyToWholeTable === true) {
            selectionStateInfo = selection.getFloatingState();
            selection.deprecatedSetSelection(table.getStartPosition(), table.getEndPosition(), selection.endOfLine, -1, true);
            tableInfo = selection.tableInfo;
        }
        this.topBorderCommand = new ToggleTableCellsTopBorderCommand(this.control);
        this.rightBorderCommand = new ToggleTableCellsRightBorderCommand(this.control);
        this.bottomBorderCommand = new ToggleTableCellsBottomBorderCommand(this.control);
        this.leftBorderCommand = new ToggleTableCellsLeftBorderCommand(this.control);
        this.insideHorizontalBordersCommand = new ToggleTableCellInsideHorizontalBordersCommand(this.control);
        this.insideVerticalBordersCommand = new ToggleTableCellInsideVerticalBordersCommand(this.control);
        dialogParams.top = DialogBorderInfo.create(this.topBorderCommand.getGeneralizedBorder(), colorProvider);
        dialogParams.right = DialogBorderInfo.create(this.rightBorderCommand.getGeneralizedBorder(), colorProvider);
        dialogParams.bottom = DialogBorderInfo.create(this.bottomBorderCommand.getGeneralizedBorder(), colorProvider);
        dialogParams.left = DialogBorderInfo.create(this.leftBorderCommand.getGeneralizedBorder(), colorProvider);
        dialogParams.insideHorizontal = DialogBorderInfo.create(this.insideHorizontalBordersCommand.getGeneralizedBorder(), colorProvider);
        dialogParams.insideVertical = DialogBorderInfo.create(this.insideVerticalBordersCommand.getGeneralizedBorder(), colorProvider);
        dialogParams.init(this.colorProvider, tableInfo, this.modelManipulator.model);
        if (selectionStateInfo)
            this.selection.restoreFloatingState(selectionStateInfo);
        return dialogParams;
    }
    applyParameters(_state, newParams, initParams) {
        let selection = this.selection;
        let tableInfo = selection.tableInfo;
        let startCell = tableInfo.extendedData.firstCell;
        let table = startCell.parentRow.parentTable;
        let selectionStateInfo;
        if ((typeof newParams.applyToWholeTable !== "boolean" && this.isNoFullSelectedCell(selection)) || newParams.applyToWholeTable === true) {
            selectionStateInfo = selection.getFloatingState();
            selection.deprecatedSetSelection(table.getStartPosition(), table.getEndPosition(), selection.endOfLine, -1, true);
            tableInfo = selection.tableInfo;
        }
        let history = this.history;
        history.beginTransaction();
        let changed = false;
        if (newParams.backgroundColor !== initParams.backgroundColor) {
            this.control.commandManager.getCommand(RichEditClientCommand.ChangeTableCellShading).execute(this.control.commandManager.isPublicApiCall, new CommandSimpleOptions(this.control, this.control.commandManager.getCommand(RichEditClientCommand.ChangeTableCellShading).
                DEPRECATEDConvertOptionsParameter(newParams.backgroundColor)));
            changed = true;
        }
        if (newParams.top && !newParams.top.equals(initParams.top)) {
            this.topBorderCommand.execute(this.control.commandManager.isPublicApiCall, newParams.top.getBorderInfo());
            changed = true;
        }
        if (newParams.bottom && !newParams.bottom.equals(initParams.bottom)) {
            this.bottomBorderCommand.execute(this.control.commandManager.isPublicApiCall, newParams.bottom.getBorderInfo());
            changed = true;
        }
        if (newParams.right && !newParams.right.equals(initParams.right)) {
            this.rightBorderCommand.execute(this.control.commandManager.isPublicApiCall, newParams.right.getBorderInfo());
            changed = true;
        }
        if (newParams.left && !newParams.left.equals(initParams.left)) {
            this.leftBorderCommand.execute(this.control.commandManager.isPublicApiCall, newParams.left.getBorderInfo());
            changed = true;
        }
        if (newParams.insideHorizontal && !newParams.insideHorizontal.equals(initParams.insideHorizontal)) {
            this.insideHorizontalBordersCommand.execute(this.control.commandManager.isPublicApiCall, newParams.insideHorizontal.getBorderInfo());
            changed = true;
        }
        if (newParams.insideVertical && !newParams.insideVertical.equals(initParams.insideVertical)) {
            this.insideVerticalBordersCommand.execute(this.control.commandManager.isPublicApiCall, newParams.insideVertical.getBorderInfo());
            changed = true;
        }
        history.endTransaction();
        if (selectionStateInfo)
            this.selection.restoreFloatingState(selectionStateInfo);
        return changed || !!selectionStateInfo;
    }
    isNoFullSelectedCell(selection) {
        let tableInfo = selection.tableInfo;
        if (tableInfo.extendedData.numRows > 1 || tableInfo.extendedData.rows[0].cells.length > 1)
            return false;
        const startCell = tableInfo.extendedData.firstCell;
        return selection.intervals[0].start !== startCell.startParagraphPosition.value || selection.intervals[0].end !== startCell.endParagrapPosition.value;
    }
    getDialogName() {
        return "BorderShading";
    }
}
export class DialogBorderShadingCommand extends DialogBorderShadingCommandBase {
    createParameters(options) {
        return this.makeParams(options.param, this.control.modelManager.model.colorProvider);
    }
}
export class DialogServiceBorderShadingCommand extends DialogBorderShadingCommandBase {
    createParameters(_options) {
        return this.makeParams(null, this.control.modelManager.model.colorProvider);
    }
    afterClosing(options) {
        this.control.commandManager.getCommand(RichEditClientCommand.ShowTablePropertiesForm)
            .execute(this.control.commandManager.isPublicApiCall, new CommandSimpleOptions(this.control, options.param));
    }
}
export class BorderShadingDialogParameters extends DialogParametersBase {
    constructor() {
        super(...arguments);
        this.borderLineHorizontalInVisible = false;
        this.borderLineVerticalInVisible = false;
    }
    init(colorProvider, tableInfo, model) {
        let firstCell = tableInfo.extendedData.firstCell;
        let table = tableInfo.table;
        let backColorMerger = new TableCellPropertiesMergerShadingInfo();
        let backgroundColor = backColorMerger.getProperty(firstCell.properties, table.style, firstCell.conditionalFormatting, model.defaultTableCellProperties).getActualColor(colorProvider);
        this.backgroundColor = this.getColor(tableInfo.extendedData.allOfCells((cellInfo) => {
            const bc = backColorMerger.getProperty(cellInfo.cell.properties, table.style, cellInfo.cell.conditionalFormatting, model.defaultTableCellProperties);
            return backgroundColor == (bc ? bc.getActualColor(colorProvider) : null);
        }) ? backgroundColor : null);
        this.borderLineHorizontalInVisible = tableInfo.extendedData.numRows > 1;
        this.borderLineVerticalInVisible = ListUtils.unsafeAnyOf(tableInfo.extendedData.rows, (rowInfo) => rowInfo.cells.length > 1);
        this.setModeButton = this.getModeState();
    }
    getModeState() {
        if (this.isModeStateNone())
            return SetModeButtons.None;
        if (this.isModeStateAll())
            return SetModeButtons.All;
        if (this.isModeStateBox())
            return SetModeButtons.Box;
        if (this.isModeStateGrid())
            return SetModeButtons.Grid;
        return SetModeButtons.Custom;
    }
    isModeStateNone() {
        let borders = [this.top, this.right, this.bottom, this.left, this.insideVertical, this.insideHorizontal];
        for (let i = 0; i < borders.length; i++) {
            if (borders[i] != null && !(borders[i].style === BorderLineStyle.None || borders[i].width === 0))
                return false;
        }
        return true;
    }
    isModeStateAll() {
        let borders = [this.top, this.right, this.bottom, this.left];
        borders.push(this.insideVertical);
        borders.push(this.insideHorizontal);
        if ((borders[0] == null) || (borders[0].style === BorderLineStyle.None) || (borders[0].width === 0))
            return false;
        if (!this.borderLineHorizontalInVisible && !this.borderLineVerticalInVisible)
            return false;
        for (let i = 1; i < borders.length; i++) {
            if ((borders[i] == null) || !borders[0].equals(borders[i]))
                return false;
        }
        return true;
    }
    isModeStateBox() {
        let borders = [this.top, this.right, this.bottom, this.left];
        let bordersIn = [this.insideVertical, this.insideHorizontal];
        if ((borders[0] == null) || (borders[0].style === BorderLineStyle.None) || (borders[0].width === 0))
            return false;
        for (let i = 1; i < borders.length; i++) {
            if ((borders[i] == null) || !borders[0].equals(borders[i]))
                return false;
        }
        if (!this.borderLineHorizontalInVisible && !this.borderLineVerticalInVisible)
            return true;
        for (let i = 0; i < bordersIn.length; i++) {
            if ((bordersIn[i] == null) || !(bordersIn[i].style === BorderLineStyle.None || bordersIn[i].width === 0))
                return false;
        }
        return true;
    }
    isModeStateGrid() {
        let borders = [this.top, this.right, this.bottom, this.left];
        let bordersIn = [this.insideVertical, this.insideHorizontal];
        if ((borders[0] == null) || (borders[0].style === BorderLineStyle.None) || (borders[0].width === 0))
            return false;
        if (!this.borderLineHorizontalInVisible && !this.borderLineVerticalInVisible)
            return false;
        for (let i = 1; i < borders.length; i++) {
            if ((borders[i] == null) || !borders[0].equals(borders[i]))
                return false;
        }
        for (let i = 0; i < bordersIn.length; i++) {
            if ((bordersIn[i] == null) || bordersIn[i].style !== BorderLineStyle.Single || bordersIn[i].color !== borders[0].color || (bordersIn[i].width !== BorderShadingDialogParameters.gridWidth))
                return false;
        }
        return true;
    }
    getColor(color) {
        if (color == ColorHelper.AUTOMATIC_COLOR)
            return "Auto";
        if (color != undefined)
            return ColorUtils.colorToHash(color).toUpperCase();
        else
            return undefined;
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.backgroundColor = obj.backgroundColor;
        this.top = obj.top !== null ? obj.top.clone() : null;
        this.right = obj.right !== null ? obj.right.clone() : null;
        this.bottom = obj.bottom !== null ? obj.bottom.clone() : null;
        this.left = obj.left !== null ? obj.left.clone() : null;
        this.insideHorizontal = obj.insideHorizontal !== null ? obj.insideHorizontal.clone() : null;
        this.insideVertical = obj.insideVertical !== null ? obj.insideVertical.clone() : null;
        this.applyToWholeTable = obj.applyToWholeTable;
    }
    clone() {
        const newInstance = new BorderShadingDialogParameters();
        newInstance.copyFrom(this);
        return newInstance;
    }
    applyConverter(_converter) {
        return this;
    }
}
BorderShadingDialogParameters.gridWidth = UnitConverter.twipsToPointsF(15);
export class DialogBorderInfo {
    static create(borderInfo, colorProvider) {
        if (!borderInfo)
            return null;
        var dialogBorderInfo = new DialogBorderInfo();
        dialogBorderInfo.color = ColorUtils.colorToHash(borderInfo.color.toRgb(colorProvider)).toUpperCase();
        dialogBorderInfo.width = UnitConverter.twipsToPointsF(borderInfo.width);
        dialogBorderInfo.style = borderInfo.style;
        return dialogBorderInfo;
    }
    getBorderInfo() {
        const borderInfo = new BorderInfo();
        borderInfo.color = this.color === null ? ColorModelInfo.noColor : ColorModelInfo.makeByColor(ColorUtils.fromHashString(this.color));
        borderInfo.width = UnitConverter.pointsToTwips(this.width);
        borderInfo.style = this.style;
        return borderInfo;
    }
    equals(obj) {
        return obj && this.style == obj.style &&
            this.color == obj.color &&
            this.width == obj.width;
    }
    copyFrom(obj) {
        this.style = obj.style;
        this.color = obj.color;
        this.width = obj.width;
    }
    clone() {
        var result = new DialogBorderInfo();
        result.copyFrom(this);
        return result;
    }
}
export var SetModeButtons;
(function (SetModeButtons) {
    SetModeButtons[SetModeButtons["None"] = 0] = "None";
    SetModeButtons[SetModeButtons["Box"] = 1] = "Box";
    SetModeButtons[SetModeButtons["All"] = 2] = "All";
    SetModeButtons[SetModeButtons["Grid"] = 3] = "Grid";
    SetModeButtons[SetModeButtons["Custom"] = 4] = "Custom";
})(SetModeButtons || (SetModeButtons = {}));
