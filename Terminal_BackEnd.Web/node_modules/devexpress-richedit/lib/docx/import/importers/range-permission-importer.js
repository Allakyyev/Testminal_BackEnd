import { RangePermission } from '../../../core/model/range-permissions';
import { BoundaryInterval } from '@devexpress/utils/lib/intervals/boundary';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
export class RangePermissionImporter {
    constructor(data) {
        this.data = data;
        this.rangePermissions = {};
    }
    insertRangePermissions() {
        NumberMapUtils.forEach(this.rangePermissions, (range) => {
            if (range.validate(this.data.subDocument)) {
                if (range.columnFirst < 0 && range.columnLast < 0) {
                    this.addPermission(range, range.start, range.end);
                    return;
                }
                for (let i = range.firstRowIndex; i <= range.lastRowIndex; i++)
                    this.createDocumentPermissions(range, i);
            }
        });
        this.data.subDocument.rangePermissions.sort((a, b) => a.start != b.start ? a.start - b.start : a.end - b.end);
    }
    createDocumentPermissions(range, rowIndex) {
        const cells = range.table.rows[rowIndex].cells;
        const cellsCount = cells.length;
        if (range.columnFirst < cellsCount) {
            const firstCellStartLogPosition = cells[range.columnFirst].startParagraphPosition.value;
            const lastCellEndLogPosition = cells[Math.min(range.columnLast, cellsCount - 1)].endParagrapPosition.value;
            if (range.start < lastCellEndLogPosition && range.end > firstCellStartLogPosition)
                this.addPermission(range, Math.max(range.start, firstCellStartLogPosition), Math.min(range.end, lastCellEndLogPosition));
        }
    }
    addPermission(info, start, end) {
        if (end >= start)
            this.data.subDocument.rangePermissions.push(new RangePermission(this.data.subDocument.positionManager, new BoundaryInterval(start, end + 1), info.userName ? info.userName : '', info.group ? info.group : ''));
    }
}
