import { TablePosition } from '../../../model/tables/main-structures/table';
import { BaseFormatter } from '../../formatter/base-formatter';
export declare class TableAnchoredObjectsHolder {
    holder: Map<TablePosition, number[]>;
    addTableCellAnchoredObject(tblPos: TablePosition, anchObjId: number): void;
    getTableCellAnchoredObjects(tblPos: TablePosition, formatter: BaseFormatter): import("../../../layout/main-structures/layout-boxes/layout-anchored-object-box").LayoutAnchoredObjectBox[];
    shallowCopy(): TableAnchoredObjectsHolder;
}
//# sourceMappingURL=table-anchored-objects-holder.d.ts.map