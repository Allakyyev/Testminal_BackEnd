import { RichEditUnit } from '../../../base-utils/unit-converter';
import { PaperKind, PaperSizeConverter } from '../../../core/model/section/paper-kind';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { BoundaryInterval } from '@devexpress/utils/lib/intervals/boundary';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RulerColumnsControl } from './controls/column';
import { DivisionInfo, RulerDivisionsControl } from './controls/divisions';
import { RulerFirstLineIndentDragHandle } from './controls/indent/first-line';
import { RulerLeftIndentDragHandle } from './controls/indent/left';
import { RulerRightIndentDragHandle } from './controls/indent/right';
import { RulerLeftMarginDragHandle } from './controls/margin/left';
import { RulerRightMarginDragHandle } from './controls/margin/right';
import { RulerControl } from './controls/ruler';
import { RulerTabsControl } from './controls/tab/tab';
import { RulerTabTypeControl } from './controls/tab/tab-type';
import { RulerTablesControl } from './controls/table';
import { RulerVerticalLineControl } from './controls/vertical-line';
import { RulerWrapper } from './controls/wrapper';
import { RulerMouseEventsManager } from './events/mouse';
import { RulerViewElementScrollManager } from './events/scroll';
import { RulerMouseHandler } from './mouse-handler';
export class RulerControls {
    constructor(canvas, modelData) {
        this.mouseEventsManager = new RulerMouseEventsManager();
        this.viewElementScrollManager = new RulerViewElementScrollManager();
        this.canvas = canvas;
        const divisionInfo = DivisionInfo.create(modelData.unitType);
        const maxPageWidth = UnitConverter.twipsToPixelsF(PaperSizeConverter.calculatePaperSize(PaperKind.PrcEnvelopeNumber10Rotated).width);
        this.moveStepSize = modelData.unitType == RichEditUnit.Inch ? divisionInfo.stepSize / 2 : divisionInfo.stepSize;
        this.wrapper = new RulerWrapper(modelData, this);
        this.ruler = new RulerControl(modelData, this);
        this.tabTypeBox = new RulerTabTypeControl(modelData, this);
        this.divisions = new RulerDivisionsControl(modelData, this, divisionInfo, maxPageWidth);
        this.leftMargin = new RulerLeftMarginDragHandle(modelData, this, maxPageWidth);
        this.rightMargin = new RulerRightMarginDragHandle(modelData, this, maxPageWidth);
        this.leftIndent = new RulerLeftIndentDragHandle(modelData, this);
        this.firstLineIndent = new RulerFirstLineIndentDragHandle(modelData, this);
        this.rightIndent = new RulerRightIndentDragHandle(modelData, this);
        this.columns = new RulerColumnsControl(modelData, this);
        this.tables = new RulerTablesControl(modelData, this);
        this.tabs = new RulerTabsControl(modelData, this);
        this.ruler.init();
        this.tabTypeBox.init();
        this.lineControl = new RulerVerticalLineControl(this.canvas, modelData.settings, this.ruler.rootElement);
        this.mouseHandler = new RulerMouseHandler(modelData, this);
        this.mouseEventsManager.addListener(this.mouseHandler);
        this.viewElementScrollManager.addListener(this.ruler, this.canvas);
    }
    get paragraphLeftPosition() {
        let pos = this.leftMargin.currModelState.modelValue + this.columns.currModelState.activeColumn.leftPos;
        if (this.tables.currModelState.columnSeparators.hasItems) {
            const item = this.tables.currModelState.columnSeparators.currItem;
            pos += this.tables.currModelState.columnSeparators.cellSpacing + item.leftMargin + item.position;
        }
        return pos;
    }
    get paragraphRightPosition() {
        const colSeps = this.tables.currModelState.columnSeparators;
        if (colSeps.hasItems) {
            const nextSeparatorItem = colSeps.items[colSeps.index + 1];
            return this.leftMargin.currModelState.modelValue + this.columns.currModelState.activeColumn.leftPos +
                (nextSeparatorItem.position - colSeps.cellSpacing - colSeps.currItem.rightMargin);
        }
        else
            return this.leftMargin.currModelState.modelValue + this.columns.currModelState.activeColumn.rightPos;
    }
    dispose() {
        this.lineControl.dispose();
        this.wrapper.dispose();
        this.ruler.dispose();
        this.tabTypeBox.dispose();
        this.divisions.dispose();
        this.leftMargin.dispose();
        this.rightMargin.dispose();
        this.leftIndent.dispose();
        this.firstLineIndent.dispose();
        this.rightIndent.dispose();
        this.columns.dispose();
        this.tables.dispose();
        this.tabs.dispose();
        this.mouseEventsManager.dispose();
        this.viewElementScrollManager.dispose();
    }
    update() {
        this.updateModelState();
        this.updateView();
    }
    updateModelState() {
        this.ruler.updateModelState();
        this.leftMargin.updateModelState();
        this.rightMargin.updateModelState();
        this.divisions.updateModelState();
        this.columns.updateModelState();
        this.tables.updateModelState();
        this.rightIndent.updateModelState();
        this.leftIndent.updateModelState();
        this.firstLineIndent.updateModelState();
        this.tabs.updateModelState();
    }
    updateView() {
        this.ruler.updateView();
        this.leftMargin.updateView();
        this.rightMargin.updateView();
        this.divisions.updateView();
        this.columns.updateView();
        this.tables.updateView();
        this.rightIndent.updateView();
        this.leftIndent.updateView();
        this.firstLineIndent.updateView();
        this.tabs.updateView();
    }
    adjust() {
        this.ruler.adjust();
    }
    chooseClosestAnchorPosition(leftPos, additionalPositions, minMax) {
        const boundInterval = new BoundaryInterval(minMax.minElement, minMax.maxElement);
        let poss = ListUtils.addListOnTail(this.getClosestAnchorPositions(leftPos, 0), additionalPositions);
        poss.push(minMax.minElement);
        poss.push(minMax.maxElement);
        poss = ListUtils.reducedMap(poss, p => boundInterval.containsWithIntervalEnd(p) ? p : null).sort((a, b) => a - b);
        return poss.length ?
            ListUtils.min(poss, p => Math.abs(p - leftPos)) :
            ListUtils.min([minMax.minElement, minMax.maxElement], p => Math.abs(p - leftPos));
    }
    getClosestAnchorPositions(leftPos, relative) {
        const stepIndex = (leftPos - relative) / this.moveStepSize;
        return [this.moveStepSize * Math.floor(stepIndex), this.moveStepSize * Math.ceil(stepIndex)];
    }
}
