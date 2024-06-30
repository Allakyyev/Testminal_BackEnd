import { Table } from '../../../tables/main-structures/table';
import { TableCell } from '../../../tables/main-structures/table-cell';
import { TableRow } from '../../../tables/main-structures/table-row';
import { TableConditionalFormattingCalculator } from '../../../tables/table-utils';
import { JSONEnumTableCell } from '../../enums/table/json-table-cell-enums';
import { JSONEnumTable, JSONEnumTableParentCellInfo } from '../../enums/table/json-table-enums';
import { JSONEnumTableRow } from '../../enums/table/json-table-row-enums';
import { JSONTablePropertiesConverter } from './json-table-properties-converter';
import { JSONTableHeightUnitConverter, JSONTableWidthUnitConverter } from './json-table-unit-converter';
export class JSONTableImporter {
    static importTables(subDocument, jsonTables) {
        if (!jsonTables)
            return;
        const tablesMap = {};
        const subDocumentTables = subDocument.tables;
        for (let jsonTable of jsonTables) {
            const newTable = new Table(JSONTablePropertiesConverter.convertFromJSON(jsonTable[JSONEnumTable.TableProperties], subDocument.documentModel.cache.colorModelInfoCache, subDocument.documentModel.cache.shadingInfoCache), subDocument.documentModel.tableStyles[jsonTable[JSONEnumTable.StyleIndex]]);
            subDocumentTables.push(newTable);
            newTable.index = jsonTable[JSONEnumTable.Index];
            tablesMap[newTable.index] = newTable;
            newTable.nestedLevel = jsonTable[JSONEnumTable.NestedLevel];
            newTable.preferredWidth = JSONTableWidthUnitConverter.convertFromJSON(jsonTable[JSONEnumTable.PreferredWidth]);
            newTable.lookTypes = jsonTable[JSONEnumTable.LookTypes];
            const parentCellContent = jsonTable[JSONEnumTable.ParentCell];
            newTable.parentCell = parentCellContent ? JSONTableImporter.getParentCell(parentCellContent, tablesMap) : null;
            for (let jsonRow of jsonTable[JSONEnumTable.Rows])
                newTable.rows.push(JSONTableImporter.importTableRow(jsonRow, subDocument, newTable));
            TableConditionalFormattingCalculator.updateTableWithoutHistory(subDocument.documentModel, newTable);
        }
        Table.sort(subDocumentTables);
        Table.fillTableByLevels(subDocument);
    }
    static importTableRow(jsonRow, subDocument, parentTable) {
        const rowProps = subDocument.documentModel.cache.tableRowPropertiesCache.getItemByJsonKey(jsonRow[JSONEnumTableRow.TableRowPropertiesIndex]);
        const newTableRow = new TableRow(parentTable, rowProps);
        newTableRow.gridBefore = jsonRow[JSONEnumTableRow.GridBefore];
        newTableRow.gridAfter = jsonRow[JSONEnumTableRow.GridAfter];
        newTableRow.widthBefore = JSONTableWidthUnitConverter.convertFromJSON(jsonRow[JSONEnumTableRow.WidthBefore]);
        newTableRow.widthAfter = JSONTableWidthUnitConverter.convertFromJSON(jsonRow[JSONEnumTableRow.WidthAfter]);
        newTableRow.height = JSONTableHeightUnitConverter.convertFromJSON(jsonRow[JSONEnumTableRow.Height]);
        newTableRow.tablePropertiesException = JSONTablePropertiesConverter.convertFromJSON(jsonRow[JSONEnumTableRow.TablePropertiesException], subDocument.documentModel.cache.colorModelInfoCache, subDocument.documentModel.cache.shadingInfoCache);
        for (let rawCell of jsonRow[JSONEnumTableRow.Cells])
            newTableRow.cells.push(JSONTableImporter.importTableCell(rawCell, subDocument, newTableRow));
        return newTableRow;
    }
    static importTableCell(jsonCell, subDocument, parentRow) {
        const cellProps = subDocument.documentModel.cache.tableCellPropertiesCache.getItemByJsonKey(jsonCell[JSONEnumTableCell.TableCellPropertiesIndex]);
        const newTableCell = new TableCell(parentRow, cellProps);
        newTableCell.style = null;
        newTableCell.columnSpan = jsonCell[JSONEnumTableCell.ColumnSpan];
        newTableCell.preferredWidth = JSONTableWidthUnitConverter.convertFromJSON(jsonCell[JSONEnumTableCell.PreferredWidth]);
        newTableCell.verticalMerging = jsonCell[JSONEnumTableCell.VerticalMerging];
        newTableCell.startParagraphPosition = subDocument.positionManager.registerPosition(jsonCell[JSONEnumTableCell.StartParagraphPosition]);
        newTableCell.endParagrapPosition = subDocument.positionManager.registerPosition(jsonCell[JSONEnumTableCell.EndParagraphPosition]);
        return newTableCell;
    }
    static getParentCell(content, tablesMap) {
        const tableIndex = content[JSONEnumTableParentCellInfo.TableIndex];
        const table = tablesMap[tableIndex];
        return table.rows[content[JSONEnumTableParentCellInfo.RowIndex]].cells[content[JSONEnumTableParentCellInfo.CellIndex]];
    }
}
