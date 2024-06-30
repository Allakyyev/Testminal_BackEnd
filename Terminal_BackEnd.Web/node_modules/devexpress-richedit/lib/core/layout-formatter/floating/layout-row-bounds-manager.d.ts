import { Rectangle } from '@devexpress/utils/lib/geometry/rectangle';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { LayoutAnchoredObjectBox } from '../../layout/main-structures/layout-boxes/layout-anchored-object-box';
import { FormatterManager } from '../managers/formatter-manager';
import { TableCell } from '../../model/tables/main-structures/table-cell';
export declare class RectangleRowBoundsCalculatorInfo extends Rectangle {
    tableIndex: number;
}
export declare class AnchorObjectBoundsInfo {
    bounds: Rectangle;
    cell: TableCell;
    canPutTextAtRight: boolean;
    canPutTextAtLeft: boolean;
    constructor(bounds: Rectangle, cell: TableCell);
}
export declare class LayoutRowBoundsCalculator {
    private rectangleBounds;
    private ancObjectsId;
    getRectangleBounds(manager: FormatterManager): AnchorObjectBoundsInfo[];
    addTableInTextObject(obj: LayoutAnchoredObjectBox, horizOuterBounds: FixedInterval): void;
    resetByColumn(objects: Record<number, LayoutAnchoredObjectBox>, horizOuterBounds: FixedInterval, ignoreFo: boolean): void;
    removeAnchorObjectId(id: number): void;
    private addAnchoredObject;
    private createAnchorObjectBoundsInfo;
    private static applySquareWrapSide;
}
//# sourceMappingURL=layout-row-bounds-manager.d.ts.map