import { MinMaxNumber } from '@devexpress/utils/lib/class/min-max';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { DocumentRenderer } from '../../../canvas/renderes/common/document-renderer';
import { RichEditClientCommand } from '../../../commands/client-command';
import { TableColumnSeparatorStruct } from '../../../commands/ruler/ruler-table-column-separators-command';
import { RulerChangeTableColumnWidthCommandParameters } from '../../../commands/ruler/ruler-table-commands';
import { RICH_EDIT_CLASS_NAME_PREFIX, RULLER_NUMBER_CORRECTION } from '../settings';
import { RulerMultiControl } from './owner';
import { RulerLineDisplayType, SnapTo } from './vertical-line';
import { RulerTemplateManager } from './template-manager';
const TABLE_COLUMN_SEPARATOR_MARGIN = 15;
const TABLE_COLUMN_SEPARATOR_HANDLE_CLASS_NAME = RICH_EDIT_CLASS_NAME_PREFIX + "rulerTableColumnSeparatorHandle";
export class RulerTableModelState {
    constructor(columnSeparators, tableIndex, enabled) {
        this.columnSeparators = columnSeparators;
        this.tableIndex = tableIndex;
        this.enabled = enabled;
    }
    clone() {
        return new RulerTableModelState(this.columnSeparators.clone(), this.tableIndex, this.enabled);
    }
}
export class RulerTableColumnViewState {
    constructor(leftMargin, rightMarginOfPrevColumn, position) {
        this.leftMargin = leftMargin;
        this.rightMarginOfPrevColumn = rightMarginOfPrevColumn;
        this.position = position;
    }
    equals(obj) {
        return this.leftMargin == obj.leftMargin && this.rightMarginOfPrevColumn == obj.rightMarginOfPrevColumn && this.position == obj.position;
    }
    clone() {
        return new RulerTableColumnViewState(this.leftMargin, this.rightMarginOfPrevColumn, this.position);
    }
}
export class RulerTablesControl extends RulerMultiControl {
    getModelState() {
        const state = this.modelData.commandManager.getCommand(RichEditClientCommand.RulerTableColumnSeparators).getState();
        return state.enabled ?
            new RulerTableModelState(state.value, state.value.tableIndex, state.enabled) :
            new RulerTableModelState(new TableColumnSeparatorStruct(), -1, false);
    }
    updateView() {
        const offset = this.controls.leftMargin.currModelState.modelValue + this.controls.columns.currModelState.activeColumn.leftPos;
        let rightMarginOfPrevColumn = 0;
        const cellSpacing = this.currModelState.columnSeparators.cellSpacing;
        this.viewState = ListUtils.map(this.currModelState.columnSeparators.items, item => {
            const viewState = new RulerTableColumnViewState(item.leftMargin + cellSpacing, rightMarginOfPrevColumn + cellSpacing, item.position + offset);
            rightMarginOfPrevColumn = item.rightMargin;
            return viewState;
        });
        this.setCount(this.viewState.length);
        ListUtils.forEach2(this.subControls, this.viewState, (control, modelState) => control.setValue(modelState));
    }
    createSubControl() {
        return new RulerTableColumnState(this.modelData, this.controls);
    }
    onMouseDown(source, _evt) {
        if (!this.currModelState.enabled)
            return false;
        return ListUtils.unsafeAnyOf(this.subControls, (subControl, index) => {
            if (subControl.canHandle(source)) {
                this.handleControlIndex = index;
                this.controls.lineControl.show(RulerLineDisplayType.TableColumn);
                this.activeSubControl.lineControlSetPosition();
                this.activeSubControl.showShadow();
                return true;
            }
            return false;
        });
    }
    onMouseUp() {
        const oldPos = this.prevModelState.columnSeparators.items[this.handleControlIndex].position;
        const newPos = this.currModelState.columnSeparators.items[this.handleControlIndex].position;
        const param = new RulerChangeTableColumnWidthCommandParameters(this.currModelState.tableIndex, newPos - oldPos, null, oldPos, true);
        this.modelData.commandManager.getCommand(RichEditClientCommand.RulerChangeTableColumnWidth)
            .execute(this.modelData.commandManager.isPublicApiCall, param);
        this.finishHandle();
    }
    calculateNewModelState(distance) {
        const leftOffset = this.controls.leftMargin.currModelState.modelValue + this.controls.columns.currModelState.activeColumn.leftPos;
        const prevItems = this.prevModelState.columnSeparators.items;
        const minVal = leftOffset + (this.handleControlIndex == 0 ? 0 : prevItems[this.handleControlIndex - 1].position + TABLE_COLUMN_SEPARATOR_MARGIN);
        const maxVal = leftOffset + (this.handleControlIndex == prevItems.length - 1 ?
            this.controls.columns.currModelState.activeColumn.width :
            prevItems[this.handleControlIndex + 1].position - TABLE_COLUMN_SEPARATOR_MARGIN);
        const oldPos = leftOffset + prevItems[this.handleControlIndex].position;
        const newPos = this.controls.chooseClosestAnchorPosition(oldPos + distance, [oldPos], new MinMaxNumber(minVal, maxVal));
        this.currModelState.columnSeparators.items[this.handleControlIndex].position =
            this.prevModelState.columnSeparators.items[this.handleControlIndex].position + newPos - oldPos;
    }
}
class RulerTableColumnState {
    constructor(modelData, controls) {
        this.controls = controls;
        this.rootElement = DocumentRenderer.renderContainer(TABLE_COLUMN_SEPARATOR_HANDLE_CLASS_NAME);
        this.separatorElement = DocumentRenderer.renderContainer(modelData.settings.styles.columnSeparatorImage.spriteCssClass);
        const template = RulerTemplateManager.getTableColumnDragElementTemplate();
        if (template)
            this.separatorElement.innerHTML = template;
        this.rootElement.appendChild(this.separatorElement);
        controls.ruler.rootElement.appendChild(this.rootElement);
        this.corectionValue = Math.floor(this.separatorElement.offsetWidth / 2);
    }
    dispose() {
        DomUtils.hideNode(this.rootElement);
        this.rootElement = null;
        this.separatorElement = null;
    }
    showShadow() { }
    hideShadow() { }
    lineControlSetPosition() {
        this.controls.lineControl.setPosition(this.viewState.position, SnapTo.LeftSide);
    }
    canHandle(source) {
        return source == this.separatorElement;
    }
    setValue(viewState) {
        if (!this.viewState || !viewState.equals(this.viewState)) {
            this.viewState = viewState.clone();
            this.rootElement.style.width = viewState.leftMargin + viewState.rightMarginOfPrevColumn + "px";
            this.rootElement.style.left = viewState.position - viewState.rightMarginOfPrevColumn + RULLER_NUMBER_CORRECTION + "px";
            this.separatorElement.style.left = viewState.rightMarginOfPrevColumn - this.corectionValue + "px";
        }
    }
}
