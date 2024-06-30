import { LayoutPosition } from '../../../layout/layout-position';
import { LayoutAnchoredObjectBox } from '../../../layout/main-structures/layout-boxes/layout-anchored-object-box';
import { LayoutPageArea } from '../../../layout/main-structures/layout-page-area';
import { TablePosition } from '../../../model/tables/main-structures/table';
export declare class FloatingRestartInfoHolder {
    anchorRestartFromPageIndex: number;
    oldAnchorObjectsFromPage: Record<number, LayoutAnchoredObjectBox>;
    oldOtherTextBoxPageAreas: Record<number, LayoutPageArea>;
    oldTableAnchorObjects: Map<TablePosition, number[]>;
    constructor();
    init(): void;
    storeInfo(lp: LayoutPosition): void;
    get isRestartByAnchorObjects(): boolean;
    setCalculatedObjects(lp: LayoutPosition): void;
}
//# sourceMappingURL=floating-restart-info-holder.d.ts.map