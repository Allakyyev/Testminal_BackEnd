import { ApiParametersChecker } from '../../../api-utils/api-utils/parameter-checker';
import { LayoutPositionCreatorConflictFlags } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { LayoutPosition } from '../../../core/layout/layout-position';
import { LayoutColumn } from '../../../core/layout/main-structures/layout-column';
import { Table } from '../../../core/model/tables/main-structures/table';
import { TableConditionalFormattingCalculator } from '../../../core/model/tables/table-utils';
import { InputPositionBase } from '../../../core/selection/input-position-base';
import { SelectionIntervalsInfo } from '../../../core/selection/selection-intervals-info';
import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { ModelParametersChecker } from '../../api-utils/model-parameter-checker';
import { TableApi } from '../../table/table';
import { Collection } from '../collection';
export class TableCollection extends Collection {
    constructor(processor, subDocument) {
        super(processor);
        this._subDocument = subDocument;
    }
    create(position, columnCount, rowCount) {
        position = ApiParametersChecker.check(position, 1, false, [
            ApiParametersChecker.numberDescriptor("position", (n) => n, 0, this._subDocument.getDocumentEndPosition())
        ]);
        columnCount = ApiParametersChecker.check(columnCount, 2, false, [
            ApiParametersChecker.numberDescriptor("columnCount", (n) => n, 1, 63)
        ]);
        rowCount = ApiParametersChecker.check(rowCount, 3, false, [
            ApiParametersChecker.numberDescriptor("rowCount", (n) => n, 1)
        ]);
        const lp = LayoutPosition.ensure(this._processor.layoutFormatterManager, this._processor.selection, this._subDocument, position, DocumentLayoutDetailsLevel.Row, new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(false));
        const currentTable = Table.getTableByPosition(this._subDocument.tables, position, true);
        const availableWidth = currentTable ? lp.row.tableCellInfo.avaliableContentWidth :
            LayoutColumn.findSectionColumnWithMinimumWidth(lp.pageArea.columns);
        const inputPos = new InputPositionBase().setIntervals(SelectionIntervalsInfo.fromPosition(this._subDocument, position));
        this._processor.beginUpdate();
        const table = this._processor.modelManager.modelManipulator.table.insertTable(this._subDocument, rowCount, columnCount, position, availableWidth, inputPos, true);
        TableConditionalFormattingCalculator.updateTable(this._processor.modelManager, table, this._subDocument);
        this._processor.endUpdate();
        return new TableApi(this._processor, this._subDocument, table);
    }
    find(position) {
        const interval = ApiParametersChecker.check(position, 1, false, [
            ApiParametersChecker.numberDescriptor("position", (n) => new FixedInterval(n, 0)),
            ModelParametersChecker.intervalDescriptor("interval", (interval) => new FixedInterval(interval.start, interval.length))
        ]);
        const tables = this._subDocument.tables;
        if (tables.length == 0)
            return [];
        let tableIndex = tables[Math.max(0, SearchUtils.normedInterpolationIndexOf(tables, (t) => t.getStartPosition(), interval.start))]
            .getTopLevelParent().index;
        const resultTables = [];
        for (let table; table = tables[tableIndex]; tableIndex++) {
            const tableInterval = table.interval;
            const intersection = IntervalAlgorithms.getIntersection(tableInterval, interval);
            if (intersection && (!!intersection.length || tableInterval.contains(intersection.start)))
                resultTables.push(new TableApi(this._processor, this._subDocument, table));
            else if (!table.nestedLevel && table.getStartPosition() >= interval.end)
                break;
        }
        return resultTables;
    }
    _getItem(coreItem) {
        return new TableApi(this._processor, this._subDocument, coreItem);
    }
    _getCoreItems() {
        return this._subDocument.tables;
    }
}
