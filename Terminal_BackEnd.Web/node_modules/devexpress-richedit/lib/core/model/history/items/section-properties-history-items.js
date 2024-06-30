import { HistoryItem } from '../base/history-item';
export class SectionPropertiesHistoryItemBase extends HistoryItem {
    constructor(modelManipulator, interval, newValue) {
        super(modelManipulator);
        this.newValue = newValue;
        this.interval = interval;
    }
    redo() {
        this.oldState = this.getPropertiesManipulator().setValue(this.interval, this.newValue);
    }
    undo() {
        this.getPropertiesManipulator().restoreValue(this.oldState);
    }
}
export class SectionMarginLeftHistoryItem extends SectionPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.sectionProperties.marginLeft;
    }
}
export class SectionMarginTopHistoryItem extends SectionPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.sectionProperties.marginTop;
    }
}
export class SectionMarginRightHistoryItem extends SectionPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.sectionProperties.marginRight;
    }
}
export class SectionMarginBottomHistoryItem extends SectionPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.sectionProperties.marginBottom;
    }
}
export class SectionColumnCountHistoryItem extends SectionPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.sectionProperties.columnCount;
    }
}
export class SectionSpaceHistoryItem extends SectionPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.sectionProperties.space;
    }
}
export class SectionEqualWidthColumnsHistoryItem extends SectionPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.sectionProperties.equalWidthColumns;
    }
}
export class SectionColumnsInfoHistoryItem extends SectionPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.sectionProperties.columnsInfo;
    }
}
export class SectionPageWidthHistoryItem extends SectionPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.sectionProperties.pageWidth;
    }
}
export class SectionPageHeightHistoryItem extends SectionPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.sectionProperties.pageHeight;
    }
}
export class SectionStartTypeHistoryItem extends SectionPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.sectionProperties.startType;
    }
}
export class SectionLandscapeHistoryItem extends SectionPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.sectionProperties.landscape;
    }
}
export class SectionDifferentFirstPageHistoryItem extends SectionPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.sectionProperties.differentFirstPage;
    }
}
export class SectionHeaderOffsetHistoryItem extends SectionPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.sectionProperties.headerOffset;
    }
}
export class SectionFooterOffsetHistoryItem extends SectionPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.sectionProperties.footerOffset;
    }
}
export class SectionPaperKindHistoryItem extends SectionPropertiesHistoryItemBase {
    getPropertiesManipulator() {
        return this.modelManipulator.sectionProperties.paperKind;
    }
}
