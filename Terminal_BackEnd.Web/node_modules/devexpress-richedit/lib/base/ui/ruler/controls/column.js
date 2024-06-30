import { MinMaxNumber } from '@devexpress/utils/lib/class/min-max';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { DocumentRenderer } from '../../../canvas/renderes/common/document-renderer';
import { RichEditClientCommand } from '../../../commands/client-command';
import { RICH_EDIT_CLASS_NAME_PREFIX, RULLER_NUMBER_CORRECTION } from '../settings';
import { RulerMultiControl } from './owner';
import { RulerLineDisplayType, SnapTo } from './vertical-line';
const MinColumnWidth = UnitConverter.centimeterToPixel(1.5);
const MinColumnSpace = UnitConverter.centimeterToPixel(0.25);
const COLUMN_HANDLE_CLASS_NAME = RICH_EDIT_CLASS_NAME_PREFIX + "columnHandle";
const COLUMN_LEFT_PART_HANDLE_CLASS_NAME = RICH_EDIT_CLASS_NAME_PREFIX + "columnHandleLeftPart";
const COLUMN_RIGHT_PART_HANDLE_CLASS_NAME = RICH_EDIT_CLASS_NAME_PREFIX + "columnHandleRightPart";
class ColumnSectionProperties {
    constructor(width, space) {
        this.width = width;
        this.space = space;
    }
    clone() {
        return new ColumnSectionProperties(this.width, this.space);
    }
    equals(obj) {
        return this.width == obj.width &&
            this.space == obj.space;
    }
}
export var ColumnAction;
(function (ColumnAction) {
    ColumnAction[ColumnAction["None"] = 0] = "None";
    ColumnAction[ColumnAction["ColumnMove"] = 1] = "ColumnMove";
    ColumnAction[ColumnAction["ColumnSpace"] = 2] = "ColumnSpace";
    ColumnAction[ColumnAction["ColumnWidth"] = 3] = "ColumnWidth";
})(ColumnAction || (ColumnAction = {}));
export class RulerColumnModelState {
    constructor(leftPos, width, space) {
        this.leftPos = leftPos;
        this.width = width;
        this.space = space;
    }
    get rightPos() { return this.leftPos + this.width; }
    clone() {
        return new RulerColumnModelState(this.leftPos, this.width, this.space);
    }
    equals(obj) {
        return this.leftPos == obj.leftPos &&
            this.width == obj.width &&
            this.space == obj.space;
    }
}
export class RulerColumnsModelState {
    constructor(columns, equalWidth, columnActiveIndex, enabled) {
        this.columns = columns;
        this.equalWidth = equalWidth;
        this.columnActiveIndex = columnActiveIndex;
        this.enabled = enabled;
    }
    get activeColumn() { return this.columns[this.columnActiveIndex]; }
    clone() {
        return new RulerColumnsModelState(ListUtils.deepCopy(this.columns), this.equalWidth, this.columnActiveIndex, this.enabled);
    }
}
export class RulerColumnsControl extends RulerMultiControl {
    getModelState() {
        const state = this.modelData.commandManager.getCommand(RichEditClientCommand.RulerSectionColumnsSettings).getState();
        let prevColumnLeftPos = 0;
        const modelColumns = ListUtils.map(state.value, (column) => {
            const result = new RulerColumnModelState(prevColumnLeftPos, column.width, column.space);
            prevColumnLeftPos = result.rightPos + result.space;
            return result;
        });
        return new RulerColumnsModelState(modelColumns, state.equalWidth, state.activeIndex, state.enabled);
    }
    updateView() {
        if (this.controls.tables.currModelState.columnSeparators.hasItems || !this.modelData.selection.activeSubDocument.isMain()) {
            this.viewState = [];
            this.setCount(0);
        }
        else {
            const offset = this.controls.leftMargin.currModelState.modelValue;
            this.viewState = ListUtils.map(this.currModelState.columns, column => {
                const result = column.clone();
                result.leftPos += offset;
                return result;
            }, 0, this.currModelState.columns.length - 1);
            this.setCount(this.viewState.length);
            ListUtils.forEach2(this.subControls, this.viewState, (control, viewState) => control.setValue(viewState));
        }
    }
    createSubControl() {
        return new RulerColumnState(this.controls);
    }
    marginsChanged(diff) {
        if (this.prevModelState.equalWidth) {
            const colCount = this.prevModelState.columns.length;
            const columnWidthDiff = diff / colCount;
            let prevColumnLeftPos = 0;
            this.currModelState.columns = this.prevModelState.columns.map(oldColumn => {
                const result = new RulerColumnModelState(prevColumnLeftPos, oldColumn.width - columnWidthDiff, oldColumn.space);
                prevColumnLeftPos = result.rightPos + result.space;
                return result;
            });
        }
    }
    onMouseDown(source, _evt) {
        if (!this.currModelState.enabled)
            return false;
        if (ListUtils.unsafeAnyOf(this.subControls, (subControl, index) => {
            this.action = subControl.getAction(source);
            if (this.action != ColumnAction.None) {
                this.handleControlIndex = index;
                return true;
            }
            return false;
        })) {
            this.controls.lineControl.show(RulerLineDisplayType.Normal);
            this.activeSubControl.lineControlSetPosition();
            this.activeSubControl.showShadow();
            return true;
        }
        return false;
    }
    onMouseUp() {
        this.modelData.commandManager.getCommand(RichEditClientCommand.RulerSectionColumnsSettings)
            .execute(this.modelData.commandManager.isPublicApiCall, this.currModelState.columns.map(col => new ColumnSectionProperties(col.width, col.space)));
        this.finishHandle();
    }
    calculateNewModelState(distance) {
        switch (this.action) {
            case ColumnAction.ColumnMove:
                this.calculateNewModelStateColumnMove(distance);
                return;
            case ColumnAction.ColumnSpace:
                this.calculateNewModelStateColumnSpace(distance, false);
                return;
            case ColumnAction.ColumnWidth:
                this.calculateNewModelStateColumnSpace(distance, true);
                return;
        }
    }
    calculateNewModelStateColumnMove(distance) {
        const leftMargin = this.controls.leftMargin.prevModelState.modelValue;
        const column = this.prevModelState.columns[this.handleControlIndex];
        const initialPos = leftMargin + column.rightPos;
        const newPos = this.controls.chooseClosestAnchorPosition(initialPos + distance, [initialPos], new MinMaxNumber(leftMargin + column.leftPos + MinColumnWidth, leftMargin + this.prevModelState.columns[this.handleControlIndex + 1].rightPos - MinColumnWidth - column.space));
        const correctedDistance = newPos - initialPos;
        const currColumn = this.currModelState.columns[this.handleControlIndex] = this.prevModelState.columns[this.handleControlIndex].clone();
        const nextColumn = this.currModelState.columns[this.handleControlIndex + 1] = this.prevModelState.columns[this.handleControlIndex + 1].clone();
        currColumn.width += correctedDistance;
        nextColumn.leftPos += correctedDistance;
        nextColumn.width -= correctedDistance;
    }
    calculateNewModelStateColumnSpace(distance, leftEdge) {
        if (this.prevModelState.equalWidth) {
            const columnCount = this.currModelState.columns.length;
            const leftMargin = this.controls.leftMargin.prevModelState.modelValue;
            const column = this.prevModelState.columns[this.handleControlIndex];
            const maxColumnSpace = (ListUtils.last(this.prevModelState.columns).rightPos - MinColumnWidth * columnCount) / (columnCount - 1);
            const maxColumnWidth = (ListUtils.last(this.prevModelState.columns).rightPos - MinColumnSpace * (columnCount - 1)) / columnCount;
            const bounds = leftEdge ?
                new MinMaxNumber(leftMargin + MinColumnWidth * (this.handleControlIndex + 1) + maxColumnSpace * this.handleControlIndex, leftMargin + maxColumnWidth * (this.handleControlIndex + 1) + MinColumnSpace * this.handleControlIndex) :
                new MinMaxNumber(leftMargin + (maxColumnWidth + MinColumnSpace) * (this.handleControlIndex + 1), leftMargin + (MinColumnWidth + maxColumnSpace) * (this.handleControlIndex + 1));
            const initialPos = leftMargin + column.rightPos + (leftEdge ? 0 : column.space);
            const newPos = this.controls.chooseClosestAnchorPosition(initialPos + distance, [initialPos], bounds);
            const correctedDistance = newPos - initialPos;
            const diffS = leftEdge ?
                -correctedDistance * columnCount / (columnCount - (this.handleControlIndex + 1)) :
                correctedDistance * columnCount / (this.handleControlIndex + 1);
            const diffW = leftEdge ?
                diffS - diffS / columnCount :
                diffS - diffS / columnCount;
            this.currModelState = this.prevModelState.clone();
            let prevColumnLeftPos = 0;
            ListUtils.forEach(this.currModelState.columns, (col, index) => {
                col.leftPos = prevColumnLeftPos;
                col.space += index == columnCount - 1 ? 0 : diffS;
                col.width -= diffW;
                prevColumnLeftPos = col.rightPos + col.space;
            });
        }
        else {
            const leftMargin = this.controls.leftMargin.prevModelState.modelValue;
            const column = this.prevModelState.columns[this.handleControlIndex];
            const bounds = leftEdge ?
                new MinMaxNumber(leftMargin + column.leftPos + MinColumnWidth, leftMargin + this.prevModelState.columns[this.handleControlIndex + 1].leftPos - MinColumnSpace) :
                new MinMaxNumber(leftMargin + column.rightPos + MinColumnSpace, leftMargin + this.prevModelState.columns[this.handleControlIndex + 1].rightPos - MinColumnWidth);
            const initialPos = leftMargin + column.rightPos + (leftEdge ? 0 : column.space);
            const newPos = this.controls.chooseClosestAnchorPosition(initialPos + distance, [initialPos], bounds);
            const correctedDistance = newPos - initialPos;
            const currColumn = this.currModelState.columns[this.handleControlIndex] = this.prevModelState.columns[this.handleControlIndex].clone();
            const nextColumn = this.currModelState.columns[this.handleControlIndex + 1] = this.prevModelState.columns[this.handleControlIndex + 1].clone();
            if (leftEdge) {
                currColumn.width += correctedDistance;
                currColumn.space -= correctedDistance;
            }
            else {
                currColumn.space += correctedDistance;
                nextColumn.leftPos += correctedDistance;
                nextColumn.width -= correctedDistance;
            }
        }
    }
}
class RulerColumnState {
    constructor(controls) {
        this.controls = controls;
        this.rootElement = DocumentRenderer.renderContainer(COLUMN_HANDLE_CLASS_NAME);
        this.leftElement = DocumentRenderer.renderContainer(COLUMN_LEFT_PART_HANDLE_CLASS_NAME);
        this.rightElement = DocumentRenderer.renderContainer(COLUMN_RIGHT_PART_HANDLE_CLASS_NAME);
        this.rootElement.appendChild(this.leftElement);
        this.rootElement.appendChild(this.rightElement);
        controls.ruler.rootElement.appendChild(this.rootElement);
    }
    dispose() {
        DomUtils.hideNode(this.rootElement);
        this.rootElement = null;
    }
    showShadow() { }
    hideShadow() { }
    lineControlSetPosition() {
        let pos;
        switch (this.controls.columns.action) {
            case ColumnAction.ColumnMove:
                pos = this.viewState.rightPos + this.viewState.space / 2;
                break;
            case ColumnAction.ColumnSpace:
                pos = this.viewState.rightPos + this.viewState.space;
                break;
            case ColumnAction.ColumnWidth:
                pos = this.viewState.rightPos;
                break;
        }
        this.controls.lineControl.setPosition(pos, SnapTo.LeftSide);
    }
    setValue(viewState) {
        if (!this.viewState || !this.viewState.equals(viewState)) {
            this.viewState = viewState.clone();
            this.rootElement.style.left = RULLER_NUMBER_CORRECTION + viewState.rightPos + "px";
            this.rootElement.style.width = viewState.space + "px";
        }
    }
    getAction(source) {
        if (source == this.rightElement)
            return ColumnAction.ColumnSpace;
        if (source == this.leftElement)
            return ColumnAction.ColumnWidth;
        if (source == this.rootElement && !this.controls.columns.currModelState.equalWidth)
            return ColumnAction.ColumnMove;
        return ColumnAction.None;
    }
}
