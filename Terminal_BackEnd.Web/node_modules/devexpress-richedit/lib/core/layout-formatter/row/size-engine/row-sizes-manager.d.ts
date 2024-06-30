import { AnchorObjectBoundsInfo } from '../../floating/layout-row-bounds-manager';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { LayoutBox } from '../../../layout/main-structures/layout-boxes/layout-box';
import { LayoutTabSpaceBox } from '../../../layout/main-structures/layout-boxes/layout-tab-space-box';
import { RowFormatter } from '../formatter';
import { IRowSpacingBeforeApplier } from '../utils/row-spacing-before-applier';
import { RowFormattingInfo } from './row-formatting-info';
import { RowHeightCalculator } from './row-height-calculator';
export declare class RowSizesManager {
    heightCalculator: RowHeightCalculator;
    private rowFormatter;
    rowFormattingInfo: RowFormattingInfo;
    private row;
    rowStartPos: number;
    constructor(rowFormatter: RowFormatter, outerHorizontalRowContentBounds: FixedInterval, minY: number, rowSpacingBeforeApplier: IRowSpacingBeforeApplier, boundsOfAnchoredOblectsOnThisColumn: AnchorObjectBoundsInfo[], isFirstRowInParagraph: boolean);
    private addNumberingListBoxes;
    addFullWord(boxes: LayoutBox[]): AddFullWordResult;
    addWordByChars(boxes: LayoutBox[]): number;
    addTabBox(box: LayoutTabSpaceBox): void;
    addBox(): void;
    private addBoxIgnoreWidth;
    anywayAddBox(): void;
    restartAllRow(deleteAnchoredObjects?: boolean): void;
    finishLogicalRow(nextIndex: number, prevRowEndPos: number): void;
    finishRow(): boolean;
    addNumberingBoxes(): boolean;
    private getTabEndPos;
    private tryPlaceNumberingBoxes;
    private calculateNumberingListBoxOffset;
}
export declare class AddFullWordResult {
    readonly isSuccess: boolean;
    readonly requiredWidth?: number;
    constructor(isSuccess: boolean, requiredWidth?: number);
}
//# sourceMappingURL=row-sizes-manager.d.ts.map