import { JSONEnumTableCell } from '../enums/table/json-table-cell-enums';
import { JSONEnumTable, JSONEnumTableParentCellInfo } from '../enums/table/json-table-enums';
import { JSONEnumTableRow } from '../enums/table/json-table-row-enums';
import { JSONTablePropertiesConverter } from '../importers/table/json-table-properties-converter';
import { JSONTableHeightUnitConverter, JSONTableWidthUnitConverter } from '../importers/table/json-table-unit-converter';
export class JSONTableExporter {
    static exportTables(subDocument, jsonTables) {
        const tableStyles = subDocument.documentModel.tableStyles;
        for (let table of subDocument.tables) {
            let jsonTable = {};
            jsonTable[JSONEnumTable.StyleIndex] = tableStyles.indexOf(table.style);
            jsonTable[JSONEnumTable.NestedLevel] = table.nestedLevel;
            let jsonTableProperties = JSONTablePropertiesConverter.convertToJSON(table.properties);
            jsonTable[JSONEnumTable.TableProperties] = jsonTableProperties;
            jsonTable[JSONEnumTable.Index] = table.index;
            let jsonTableWidthUnitProperty = JSONTableWidthUnitConverter.convertToJSON(table.preferredWidth);
            jsonTable[JSONEnumTable.PreferredWidth] = jsonTableWidthUnitProperty;
            jsonTable[JSONEnumTable.LookTypes] = table.lookTypes;
            if (table.parentCell) {
                let parentCell = {};
                parentCell[JSONEnumTableParentCellInfo.CellIndex] = table.parentCell.parentRow.cells.indexOf(table.parentCell);
                parentCell[JSONEnumTableParentCellInfo.RowIndex] = table.rows.indexOf(table.parentCell.parentRow);
                parentCell[JSONEnumTableParentCellInfo.TableIndex] = table.parentCell.parentRow.parentTable.index;
                jsonTable[JSONEnumTable.ParentCell] = parentCell;
            }
            JSONTableExporter.exportTableRows(subDocument, table.rows, jsonTable[JSONEnumTable.Rows] = []);
            jsonTables.push(jsonTable);
        }
    }
    static exportTableRows(subDocument, tableRows, jsonRows) {
        const tableRowPropertiesCache = subDocument.documentModel.cache.tableRowPropertiesCache;
        for (let row of tableRows) {
            let jsonRow = {};
            jsonRow[JSONEnumTableRow.GridBefore] = row.gridBefore;
            jsonRow[JSONEnumTableRow.GridAfter] = row.gridAfter;
            jsonRow[JSONEnumTableRow.WidthAfter] = JSONTableWidthUnitConverter.convertToJSON(row.widthAfter);
            jsonRow[JSONEnumTableRow.WidthBefore] = JSONTableWidthUnitConverter.convertToJSON(row.widthBefore);
            let tableRowPropertiesIndex = tableRowPropertiesCache.indexOf(row.properties);
            jsonRow[JSONEnumTableRow.TableRowPropertiesIndex] = tableRowPropertiesIndex;
            jsonRow[JSONEnumTableRow.TablePropertiesException] =
                JSONTablePropertiesConverter.convertToJSON(row.tablePropertiesException);
            jsonRow[JSONEnumTableRow.Height] = JSONTableHeightUnitConverter.convertToJSON(row.height);
            JSONTableExporter.exportCells(subDocument, row.cells, jsonRow[JSONEnumTableRow.Cells] = []);
            jsonRows.push(jsonRow);
        }
    }
    static exportCells(subDocument, cells, jsonCells) {
        const cellStyles = subDocument.documentModel.tableCellStyles;
        const tableCellPropertiesCache = subDocument.documentModel.cache.tableCellPropertiesCache;
        for (let cell of cells) {
            let jsonCell = {};
            jsonCell[JSONEnumTableCell.StyleIndex] = cellStyles.indexOf(cell.style);
            let tableCellPropertiesIndex = tableCellPropertiesCache.indexOf(cell.properties);
            jsonCell[JSONEnumTableCell.TableCellPropertiesIndex] = tableCellPropertiesIndex;
            jsonCell[JSONEnumTableCell.ColumnSpan] = cell.columnSpan;
            jsonCell[JSONEnumTableCell.PreferredWidth] = JSONTableWidthUnitConverter.convertToJSON(cell.preferredWidth);
            jsonCell[JSONEnumTableCell.VerticalMerging] = cell.verticalMerging;
            jsonCell[JSONEnumTableCell.StartParagraphPosition] = cell.startParagraphPosition.value;
            jsonCell[JSONEnumTableCell.EndParagraphPosition] = cell.endParagrapPosition.value;
            jsonCells.push(jsonCell);
        }
    }
}
