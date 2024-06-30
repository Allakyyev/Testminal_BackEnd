import { Errors } from '@devexpress/utils/lib/errors';
import { TableBasedHistoryItem } from './create-table-history-item';
export class TablePropertiesHistoryItemBase extends TableBasedHistoryItem {
    constructor(modelManipulator, boundSubDocument, tableIndex, newValue) {
        super(modelManipulator, boundSubDocument, tableIndex);
        this.newValue = newValue;
    }
}
export class TablePropertiesUseHistoryItemBase extends TablePropertiesHistoryItemBase {
    constructor(modelManipulator, boundSubDocument, tableIndex, newValues, newUse) {
        super(modelManipulator, boundSubDocument, tableIndex, newValues);
        this.newUse = newUse;
    }
    redo() {
        this.oldState = this.getManipulator().setValue(this.boundSubDocument, this.tableIndex, this.newValue, this.newUse);
    }
    undo() {
        this.getManipulator().restoreValue(this.boundSubDocument, this.oldState);
    }
    getManipulator() {
        throw new Error(Errors.NotImplemented);
    }
}
export class TablePropertiesComplexUseHistoryItemBase extends TablePropertiesHistoryItemBase {
    constructor(modelManipulator, boundSubDocument, tableIndex, newValues, newUses) {
        super(modelManipulator, boundSubDocument, tableIndex, newValues);
        if (newValues.length !== newUses.length)
            throw new Error("newValues.length should be equal to newUses.length");
        this.newUses = newUses;
    }
    redo() {
        this.oldState = this.getManipulator().setValue(this.boundSubDocument, this.tableIndex, this.newValue, this.newUses);
    }
    undo() {
        this.getManipulator().restoreValue(this.boundSubDocument, this.oldState);
    }
    getManipulator() {
        throw new Error(Errors.NotImplemented);
    }
}
export class TableCellMarginsHistoryItem extends TablePropertiesComplexUseHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.table.tableProperties.cellMargins;
    }
}
export class TableCellSpacingHistoryItem extends TablePropertiesUseHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.table.tableProperties.cellSpacing;
    }
}
export class TableIndentHistoryItem extends TablePropertiesUseHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.table.tableProperties.indent;
    }
}
export class TablePreferredWidthHistoryItem extends TablePropertiesHistoryItemBase {
    redo() {
        this.oldState = this.modelManipulator.table.tableProperties.preferredWidth.setValue(this.boundSubDocument, this.tableIndex, this.newValue);
    }
    undo() {
        this.modelManipulator.table.tableProperties.preferredWidth.restoreValue(this.boundSubDocument, this.oldState);
    }
}
export class TableBordersHistoryItem extends TablePropertiesComplexUseHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.table.tableProperties.borders;
    }
}
export class TableTableStyleColumnBandSizeHistoryItem extends TablePropertiesUseHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.table.tableProperties.tableStyleColumnBandSize;
    }
}
export class TableTableStyleRowBandSizeHistoryItem extends TablePropertiesUseHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.table.tableProperties.tableStyleRowBandSize;
    }
}
export class TableAvoidDoubleBordersHistoryItem extends TablePropertiesUseHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.table.tableProperties.avoidDoubleBorders;
    }
}
export class TableLayoutTypeHistoryItem extends TablePropertiesUseHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.table.tableProperties.layoutType;
    }
}
export class TableLookTypesHistoryItem extends TablePropertiesHistoryItemBase {
    redo() {
        this.oldState = this.modelManipulator.table.tableProperties.lookTypes.setValue(this.boundSubDocument, this.tableIndex, this.newValue);
        this.modelManipulator.table.resetParagraphCharacterMergedProperties(this.boundSubDocument, this.tableIndex);
    }
    undo() {
        this.modelManipulator.table.tableProperties.lookTypes.restoreValue(this.boundSubDocument, this.oldState);
        this.modelManipulator.table.resetParagraphCharacterMergedProperties(this.boundSubDocument, this.tableIndex);
    }
}
export class TableShadingInfoHistoryItem extends TablePropertiesUseHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.table.tableProperties.shadingInfo;
    }
}
export class TableTableRowAlignmentHistoryItem extends TablePropertiesUseHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.table.tableProperties.tableRowAlignment;
    }
}
export class TableIsTableOverlapHistoryItem extends TablePropertiesUseHistoryItemBase {
    getManipulator() {
        return this.modelManipulator.table.tableProperties.isTableOverlap;
    }
}
