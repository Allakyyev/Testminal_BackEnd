import { SectionColumnCountHistoryItem, SectionColumnsInfoHistoryItem, SectionEqualWidthColumnsHistoryItem } from '../../../core/model/history/items/section-properties-history-items';
import { ControlOptions } from '../../../core/model/options/control';
import { SectionColumnProperties } from '../../../core/model/section/section-column-properties';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { SectionPropertiesCommandBase } from '../section-properties/section-properties-command-base';
import { SectionPropertiesApplyType } from './dialog-page-setup-command';
import { DialogParametersBase, ShowDialogCommandBase } from './show-dialog-command-base';
export class DialogColumnsCommand extends ShowDialogCommandBase {
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.sections) && this.selection.activeSubDocument.isMain() &&
            SectionPropertiesCommandBase.rangePermissionIncludeFullSection(this.control, this.selection.activeSubDocument, this.selection.intervals);
    }
    createParameters(_options) {
        var columnsInfo = new ColumnsInfoUI();
        var secProps = this.inputPosition.getMergedSectionPropertiesRaw();
        columnsInfo.equalColumnWidth = secProps.equalWidthColumns;
        if (secProps.pageWidth != undefined && secProps.marginLeft != undefined && secProps.marginRight != undefined)
            columnsInfo.pageWidth = secProps.pageWidth - secProps.marginLeft - secProps.marginRight;
        else
            columnsInfo.pageWidth = ColumnsInfoUI.minColumnWidth;
        var columnCount = secProps.columnCount == undefined ? 0 : secProps.columnCount;
        columnsInfo.changeColumnCount(columnCount);
        for (var i = 0, info; info = secProps.columnsInfo[i]; i++) {
            columnsInfo.columns[i].width = info.width;
            columnsInfo.columns[i].spacing = info.space;
        }
        return new ColumnsDialogParameters().init(columnsInfo, this.control.uiUnitConverter);
    }
    applyParameters(_state, newParams) {
        var interval = this.getInterval(newParams.columnsInfo.applyType);
        var modelManipulator = this.modelManipulator;
        var columnsInfo = newParams.columnsInfo;
        this.history.beginTransaction();
        var columns = [];
        for (var i = 0, columnInfo; columnInfo = columnsInfo.columns[i]; i++) {
            var column = new SectionColumnProperties(columnInfo.width, columnInfo.spacing);
            columns.push(column);
        }
        this.history.addAndRedo(new SectionColumnsInfoHistoryItem(modelManipulator, interval, columns));
        this.history.addAndRedo(new SectionColumnCountHistoryItem(modelManipulator, interval, columnsInfo.columnCount));
        this.history.addAndRedo(new SectionEqualWidthColumnsHistoryItem(modelManipulator, interval, columnsInfo.equalColumnWidth));
        this.history.endTransaction();
        return true;
    }
    getInterval(applyTo) {
        if (applyTo == SectionPropertiesApplyType.WholeDocument)
            return new FixedInterval(0, this.control.modelManager.model.mainSubDocument.getDocumentEndPosition() - 1);
        var selectedSections = this.control.modelManager.model.getSectionsByInterval(this.selection.lastSelectedInterval);
        if (applyTo == SectionPropertiesApplyType.SelectedSections) {
            var lastSection = selectedSections[selectedSections.length - 1];
            return FixedInterval.fromPositions(selectedSections[0].startLogPosition.value, lastSection.startLogPosition.value + lastSection.getLength() - 1);
        }
        if (applyTo == SectionPropertiesApplyType.ThisPointForward)
            return FixedInterval.fromPositions(selectedSections[0].startLogPosition.value, this.control.modelManager.model.mainSubDocument.getDocumentEndPosition());
        return new FixedInterval(selectedSections[0].startLogPosition.value, selectedSections[0].getLength() - 1);
    }
    getDialogName() {
        return "Columns";
    }
}
export class ColumnsDialogParameters extends DialogParametersBase {
    init(columnsInfo, unitConverter) {
        this.columnsInfo = columnsInfo;
        this.unitConverter = unitConverter;
        return this;
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        var columnsInfo = new ColumnsInfoUI();
        columnsInfo.copyFrom(obj.columnsInfo);
        this.columnsInfo = columnsInfo;
        this.unitConverter = obj.unitConverter;
    }
    clone() {
        const newInstance = new ColumnsDialogParameters();
        newInstance.copyFrom(this);
        return newInstance;
    }
    applyConverter(_converter) {
        return this;
    }
}
export class ColumnsInfoUI {
    constructor() {
        this.columns = [];
        this.equalColumnWidth = false;
        this.applyType = SectionPropertiesApplyType.WholeDocument;
    }
    getMaxColumnCount() {
        return Math.ceil(this.pageWidth / (ColumnsInfoUI.minColumnWidth + ColumnsInfoUI.minSpacingWidth));
    }
    hasColumnsNull() {
        if (this.columnCount > this.columns.length)
            return true;
        for (var i = 0; i < this.columnCount; i++) {
            if (!this.columns[i].width)
                return true;
            if (!this.columns[i].spacing && this.columns[i].spacing != 0)
                return true;
        }
        return false;
    }
    hasColumnsInfoUINull() {
        if (!this.columnCount)
            return true;
        return this.hasColumnsNull();
    }
    changeColumnCount(count) {
        if (count < 0)
            return;
        count = Math.min(count, this.getMaxColumnCount());
        var previousCount = this.columns.length;
        var hasColumnInfoUINull = this.hasColumnsInfoUINull();
        for (var i = this.columns.length; i < count; i++)
            this.columns[i] = new ColumnInfoUI(i + 1);
        this.columns.splice(count);
        this.columnCount = count;
        if (hasColumnInfoUINull) {
            this.calculateEqualColumnsOnChangeCount();
            return;
        }
        if (!this.equalColumnWidth && previousCount > 0)
            this.calculateNotEqualColumnsOnChangeCount(previousCount);
        else
            this.calculateEqualColumnsOnChangeCount();
    }
    calculateEqualColumnsOnChangeCount() {
        if (this.columns.length <= 0)
            return;
        var spacingValue;
        if (this.columns[0].spacing && this.columns[0].spacing != 0)
            spacingValue = this.columns[0].spacing;
        else
            spacingValue = ColumnsInfoUI.minColumnWidth;
        this.calculateUniformColumnsByColumnSpacing(spacingValue);
    }
    calculateNotEqualColumnsOnChangeCount(previousCount) {
        if (this.columns.length <= 0)
            return;
        if (this.columns.length == 1)
            this.columns[0].width = this.pageWidth;
        var calculateCount = Math.min(previousCount, this.columns.length);
        for (var i = 0; i < calculateCount; i++)
            this.columns[i].width = Math.max(ColumnsInfoUI.minColumnWidth, this.columns[i].width * previousCount / this.columns.length);
        for (var i = 0; i < calculateCount - 1; i++)
            this.columns[i].spacing = Math.max(ColumnsInfoUI.minSpacingWidth, this.columns[i].spacing * (previousCount - 1) / (this.columns.length - 1));
        if (calculateCount > 0)
            for (var i = calculateCount; i < this.columns.length; i++)
                this.columns[i].width = this.columns[calculateCount - 1].width;
        if (calculateCount > 1)
            for (var i = calculateCount - 1; i < this.columns.length - 1; i++)
                this.columns[i].spacing = this.columns[calculateCount - 2].spacing;
        this.disableTheLastSpacing();
        this.correctColumns();
    }
    correctColumns() {
        if (!this.columnCount || this.columnCount <= 0)
            return;
        var difference = -this.calculateAvailableSpace();
        var calculatorWidth = new ColumnsDistributionWidthPriorityCalculator(this.columns);
        var calculatorSpacing = new ColumnsDistributionSpacingPriorityCalculator(this.columns);
        var sumWidth = calculatorWidth.calculateTotal(0, this.columns.length - 1);
        var sumSpacing = calculatorSpacing.calculateTotal(0, this.columns.length - 1);
        var partWidth = sumWidth / (sumWidth + sumSpacing);
        var differenceWidth = Math.ceil(difference * partWidth);
        var differenceSpacing = difference - differenceWidth;
        calculatorWidth.distributeSpace(0, this.columns.length - 1, differenceWidth);
        calculatorSpacing.distributeSpace(0, this.columns.length - 2, differenceSpacing);
    }
    disableTheLastSpacing() {
        this.columns[this.columns.length - 1].spacing = 0;
    }
    recalculateColumnsByWidthAfterIndex(index) {
        if (this.hasColumnsInfoUINull())
            return;
        if (this.equalColumnWidth)
            this.calculateColumnWidthForUniformColumns();
        else
            this.changeColumnsNotEqualByWidthAfterIndex(index);
    }
    recalculateColumnsBySpacingAfterIndex(index) {
        if (this.hasColumnsInfoUINull())
            return;
        if (this.equalColumnWidth)
            this.calculateColumnSpacingForUniformColumns();
        else
            this.changeColumnsNotEqualBySpacingAfterIndex(index);
    }
    calculateUniformColumnsCore(columnWidth, columnSpacing, restWidth, restSpacing) {
        var calculatorWidth = new ColumnsDistributionWidthPriorityCalculator(this.columns);
        var calculatorSpacing = new ColumnsDistributionSpacingPriorityCalculator(this.columns);
        calculatorWidth.setAllValues(columnWidth, restWidth);
        calculatorSpacing.setAllValues(columnSpacing, restSpacing);
        this.disableTheLastSpacing();
    }
    calculateColumnWidthForUniformColumns() {
        var columnWidth = (this.columns[0].width) ? this.columns[0].width : ColumnsInfoUI.minColumnWidth;
        this.calculateUniformColumnsByColumnWidth(columnWidth);
    }
    calculateUniformColumnsByColumnWidth(columnWidth) {
        if (!this.columnCount || this.columnCount <= 0)
            return;
        if (this.columnCount <= 1)
            columnWidth = this.pageWidth;
        if (columnWidth * this.columnCount > this.pageWidth)
            columnWidth = this.pageWidth / this.columnCount;
        columnWidth = Math.max(columnWidth, ColumnsInfoUI.minColumnWidth);
        var dividend = this.pageWidth - columnWidth * this.columnCount;
        var divider = Math.max(1, this.columnCount - 1);
        var restSpacing = dividend % divider;
        var columnSpacing = dividend / divider;
        this.calculateUniformColumnsCore(columnWidth, columnSpacing, 0, restSpacing);
    }
    calculateColumnSpacingForUniformColumns() {
        if (this.hasColumnsInfoUINull())
            return;
        var columnSpacing = (this.columns[0].spacing) ? this.columns[0].spacing : ColumnsInfoUI.minSpacingWidth;
        this.calculateUniformColumnsByColumnSpacing(columnSpacing);
    }
    calculateUniformColumnsByColumnSpacing(columnSpacing) {
        if (!this.columnCount || this.columnCount <= 0)
            return;
        columnSpacing = Math.max(columnSpacing, ColumnsInfoUI.minSpacingWidth);
        if (columnSpacing * (this.columnCount - 1) > this.pageWidth - ColumnsInfoUI.minColumnWidth * this.columnCount)
            columnSpacing = Math.ceil((this.pageWidth - ColumnsInfoUI.minColumnWidth * this.columnCount) / (this.columnCount - 1));
        if (this.columnCount == 1)
            columnSpacing = 0;
        var dividend = Math.ceil(this.pageWidth - columnSpacing * (this.columnCount - 1));
        var restWidth = Math.ceil(dividend % this.columnCount);
        var columnWidth = Math.ceil(dividend / this.columnCount);
        this.calculateUniformColumnsCore(columnWidth, columnSpacing, restWidth, 0);
    }
    calculateAvailableSpace() {
        var usedSpace = 0;
        for (var i = 0; i < this.columnCount; i++)
            usedSpace += ((this.columns[i].width) ? this.columns[i].width : 0) + ((this.columns[i].spacing) ? this.columns[i].spacing : 0);
        return this.pageWidth - usedSpace;
    }
    changeColumnsNotEqualByWidthAfterIndex(index) {
        if (!this.columnCount || this.columnCount <= 0 || index >= this.columnCount)
            return;
        var calculatorWidth = new ColumnsDistributionWidthPriorityCalculator(this.columns);
        var calculatorSpacing = new ColumnsDistributionSpacingPriorityCalculator(this.columns);
        calculatorWidth.correctValue(index);
        var difference = -this.calculateAvailableSpace();
        difference = calculatorWidth.distributeSpace(index + 1, this.columnCount - 1, difference);
        difference = calculatorWidth.distributeSpace(0, index - 1, difference);
        difference = calculatorSpacing.distributeSpace(0, this.columnCount - 2, difference);
        this.columns[index].width -= difference;
        this.disableTheLastSpacing();
    }
    changeColumnsNotEqualBySpacingAfterIndex(index) {
        if (!this.columnCount || this.columnCount <= 0 || index >= this.columnCount)
            return;
        var calculatorWidth = new ColumnsDistributionWidthPriorityCalculator(this.columns);
        var calculatorSpacing = new ColumnsDistributionSpacingPriorityCalculator(this.columns);
        calculatorSpacing.correctValue(index);
        var difference = -this.calculateAvailableSpace();
        difference = calculatorWidth.distributeSpace(index + 1, this.columnCount - 1, difference);
        difference = calculatorWidth.distributeSpace(0, index, difference);
        difference = calculatorSpacing.distributeSpace(0, index - 1, difference);
        difference = calculatorSpacing.distributeSpace(index + 1, this.columnCount - 2, difference);
        this.columns[index].spacing -= difference;
        this.disableTheLastSpacing();
    }
    clone() {
        var obj = new ColumnsInfoUI();
        obj.copyFrom(this);
        return obj;
    }
    copyFrom(info) {
        this.applyType = info.applyType;
        this.equalColumnWidth = info.equalColumnWidth;
        this.pageWidth = info.pageWidth;
        this.changeColumnCount(info.columns.length);
        for (var i = 0; i < this.columns.length; i++) {
            this.columns[i].width = info.columns[i].width;
            this.columns[i].spacing = info.columns[i].spacing;
        }
    }
}
ColumnsInfoUI.minColumnWidth = 720;
ColumnsInfoUI.minSpacingWidth = 0;
export class ColumnInfoUI {
    constructor(num) {
        this.num = num;
    }
}
export class ColumnsDistributionCalculator {
    constructor(columns) {
        this.columns = [];
        this.columns = columns;
    }
    calculateTotal(from, to) {
        var result = 0;
        for (var i = from; i <= to; i++)
            result += this.getValue(this.columns[i]);
        return result;
    }
    hasEnoughSpaceForDistribution(from, to, space) {
        var total = this.calculateTotal(from, to);
        return space < total - this.getMinValue() * (to - from + 1);
    }
    setMinValues(from, to, space) {
        for (var i = from; i <= to; i++) {
            space -= this.getValue(this.columns[i]) - this.getMinValue();
            this.setValue(this.columns[i], this.getMinValue());
        }
        return space;
    }
    correctValue(index) {
        if (index >= this.columns.length)
            return;
        if (this.getValue(this.columns[index]) < this.getMinValue())
            this.setValue(this.columns[index], this.getMinValue());
    }
    distributeRemainder(from, to, remainder) {
        var correction = (remainder > 0) ? 1 : -1;
        while (remainder != 0) {
            for (var i = from; i <= to && (remainder != 0); i++) {
                var newValue = this.getValue(this.columns[i]) - correction;
                if (newValue > this.getMinValue()) {
                    this.setValue(this.columns[i], newValue);
                    remainder -= correction;
                }
            }
        }
        return 0;
    }
    distributeSpaceCore(from, to, space) {
        var remainder = Math.round(space % (to - from + 1));
        var difference = Math.round(space / (to - from + 1));
        for (var i = from; i <= to; i++) {
            var newValue = this.getValue(this.columns[i]) - difference;
            if (newValue >= this.getMinValue())
                this.setValue(this.columns[i], newValue);
            else {
                this.setValue(this.columns[i], this.getMinValue());
                remainder += (this.getMinValue() - newValue);
            }
        }
        this.distributeRemainder(from, to, remainder);
        return 0;
    }
    distributeSpace(from, to, space) {
        if (from > to)
            return space;
        if (this.hasEnoughSpaceForDistribution(from, to, space))
            return this.distributeSpaceCore(from, to, space);
        else
            return this.setMinValues(from, to, space);
    }
    setAllValues(value, rest) {
        var count = this.columns.length;
        for (var i = 0; i < count; i++)
            this.setValue(this.columns[i], value);
        this.distributeSpace(0, count - 1, -rest);
    }
    getMinValue() { return null; }
    getValue(_column) { return null; }
    setValue(_column, _value) { }
}
export class ColumnsDistributionWidthPriorityCalculator extends ColumnsDistributionCalculator {
    getMinValue() {
        return 720;
    }
    getValue(column) {
        return (column.width) ? column.width : 0;
    }
    setValue(column, value) {
        column.width = value;
    }
}
export class ColumnsDistributionSpacingPriorityCalculator extends ColumnsDistributionCalculator {
    getMinValue() {
        return 0;
    }
    getValue(column) {
        return (column.spacing) ? column.spacing : 0;
    }
    setValue(column, value) {
        column.spacing = value;
    }
}
export class ColumnsEditorController {
    constructor(parameters) {
        this.presets = [];
        this.columnsInfo = parameters.columnsInfo;
        this.unitConverter = parameters.unitConverter;
        this.presets.push(new SingleColumnsInfoPreset());
        this.presets.push(new TwoColumnsInfoPreset());
        this.presets.push(new ThreeColumnsInfoPreset());
        this.presets.push(new LeftNarrowColumnsInfoPreset());
        this.presets.push(new RightNarrowColumnsInfoPreset());
    }
    changeColumnCount(count) {
        this.columnsInfo.changeColumnCount(count);
    }
    setEqualColumnWidth(value) {
        this.columnsInfo.equalColumnWidth = value;
        if (value)
            this.columnsInfo.calculateColumnSpacingForUniformColumns();
    }
    applyPreset(index) {
        this.presets[index].applyTo(this.columnsInfo);
    }
    matchPreset(index) {
        return this.presets[index].matchTo(this.columnsInfo);
    }
    getWidth(index) {
        var width = this.columnsInfo.columns[index].width;
        return this.unitConverter.twipsToUI(width);
    }
    getSpacing(index) {
        var spacing = this.columnsInfo.columns[index].spacing;
        return this.unitConverter.twipsToUI(spacing);
    }
    setWidth(index, value) {
        var width = this.unitConverter.UIToTwips(value);
        this.columnsInfo.columns[index].width = width;
        this.columnsInfo.recalculateColumnsByWidthAfterIndex(index);
    }
    setSpacing(index, value) {
        var spacing = this.unitConverter.UIToTwips(value);
        this.columnsInfo.columns[index].spacing = spacing;
        this.columnsInfo.recalculateColumnsBySpacingAfterIndex(index);
    }
}
export class ColumnsInfoPreset {
    getSpacing() { return 1800; }
    matchTo(_columnsInfo) { return false; }
}
export class UniformColumnsInfoPreset extends ColumnsInfoPreset {
    getColumnCount() { return null; }
    matchTo(columnsInfo) {
        if (!columnsInfo.equalColumnWidth)
            return false;
        if (!columnsInfo.columnCount)
            return false;
        return columnsInfo.columnCount == this.getColumnCount();
    }
    applyTo(columnsInfo) {
        columnsInfo.equalColumnWidth = true;
        if (columnsInfo.columns.length > 0)
            columnsInfo.columns[0].spacing = this.getSpacing();
        columnsInfo.changeColumnCount(this.getColumnCount());
    }
}
export class SingleColumnsInfoPreset extends UniformColumnsInfoPreset {
    getColumnCount() { return 1; }
}
export class TwoColumnsInfoPreset extends UniformColumnsInfoPreset {
    getColumnCount() { return 2; }
}
export class ThreeColumnsInfoPreset extends UniformColumnsInfoPreset {
    getColumnCount() { return 3; }
}
export class TwoNonUniformColumnsInfoPreset extends ColumnsInfoPreset {
    getFirstColumnRelativeWidth() { return null; }
    matchTo(columnsInfo) {
        if (columnsInfo.equalColumnWidth)
            return false;
        if (columnsInfo.columnCount != 2)
            return false;
        if (columnsInfo.columns.length != 2)
            return false;
        if (!columnsInfo.columns[0].width)
            return false;
        if (!columnsInfo.columns[0].spacing && columnsInfo.columns[1].spacing != 0)
            return false;
        if (!columnsInfo.columns[1].width)
            return false;
        if (!columnsInfo.columns[1].spacing && columnsInfo.columns[1].spacing != 0)
            return false;
        var totalWidth = columnsInfo.pageWidth - this.getSpacing();
        if (columnsInfo.columns[0].width != Math.round(totalWidth * this.getFirstColumnRelativeWidth()))
            return false;
        if (columnsInfo.columns[0].spacing != this.getSpacing())
            return false;
        if (columnsInfo.columns[1].width != Math.round(totalWidth - columnsInfo.columns[0].width))
            return false;
        return columnsInfo.columns[1].spacing == 0;
    }
    applyTo(columnsInfo) {
        columnsInfo.equalColumnWidth = false;
        columnsInfo.changeColumnCount(2);
        var totalWidth = columnsInfo.pageWidth - this.getSpacing();
        columnsInfo.columns[0].width = Math.round(totalWidth * this.getFirstColumnRelativeWidth());
        columnsInfo.columns[0].spacing = this.getSpacing();
        columnsInfo.columns[1].width = Math.round(totalWidth - columnsInfo.columns[0].width);
        columnsInfo.columns[1].spacing = 0;
    }
}
export class LeftNarrowColumnsInfoPreset extends TwoNonUniformColumnsInfoPreset {
    getFirstColumnRelativeWidth() { return 0.292; }
}
export class RightNarrowColumnsInfoPreset extends TwoNonUniformColumnsInfoPreset {
    getFirstColumnRelativeWidth() { return 0.708; }
}
