import { TableRowProperties } from '../../../core/model/tables/properties/table-row-properties';
import { TableWidthUnit, TableWidthUnitType } from '../../../core/model/tables/secondary-structures/table-units';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { ImportedTableRowInfo } from '../containers/tables';
import { HtmlTagImporterBase } from './base';
import { HtmlTableTagImporter } from './table';
import { HtmlTdTagImporter } from './td';
export class HtmlTrTagImporter extends HtmlTagImporterBase {
    constructor() {
        super(...arguments);
        this.cells = [];
    }
    elementTag() {
        return HtmlTrTagImporter.tagName;
    }
    importBefore() {
        this.rowElement = this.element;
        this.gridBeforeInfo = HtmlTrTagImporter.importGridBefore(this.rowElement);
    }
    isImportChilds() {
        return true;
    }
    importAfter() {
        if (this.cells.length) {
            const tableImporter = this.getClosestImporterByTagName(HtmlTableTagImporter.tagName);
            HtmlTdTagImporter.addVerticalMergedCells(this.importer, tableImporter, this);
            const { gridAfter, widthAfter } = HtmlTrTagImporter.importGridAfter(this.rowElement);
            const props = new TableRowProperties();
            tableImporter.rows.push(new ImportedTableRowInfo(this.gridBeforeInfo.gridBefore, gridAfter, this.gridBeforeInfo.widthBefore, widthAfter, props, this.cells));
        }
    }
    static importGridBefore(row) {
        let gridBefore = 0;
        let widthBefore = 0;
        const gridBeforeMatches = row.innerHTML.match(/^<td[^>]*mso-cell-special:\s*placeholder[^>]*><\/td>/gi);
        if (gridBeforeMatches && gridBeforeMatches.length) {
            const cellBeforeColSpan = gridBeforeMatches[0].replace(/<td[^>]*colspan="(\d+)"[^>]*><\/td>/gi, "$1");
            gridBefore = cellBeforeColSpan == gridBeforeMatches[0] ? 1 : parseInt(cellBeforeColSpan);
            const cellBeforeWidth = gridBeforeMatches[0].replace(/<td[^>]*width="(\d+)"[^>]*><\/td>/gi, "$1");
            widthBefore = cellBeforeWidth == gridBeforeMatches[0] ? 0 : UnitConverter.pixelsToTwips(parseFloat(cellBeforeWidth));
        }
        return { gridBefore: gridBefore, widthBefore: TableWidthUnit.create(widthBefore, TableWidthUnitType.ModelUnits) };
    }
    static importGridAfter(row) {
        let gridAfter = 0;
        let widthAfter = 0;
        const gridAfterMatches = row.innerHTML.match(/<td[^>]*mso-cell-special:\s*placeholder[^>]*><\/td>$/gi);
        if (gridAfterMatches && gridAfterMatches.length) {
            const cellAfterColSpan = gridAfterMatches[0].replace(/<td[^>]*colspan="(\d+)"[^>]*><\/td>/gi, "$1");
            gridAfter = cellAfterColSpan == gridAfterMatches[0] ? 1 : parseInt(cellAfterColSpan);
            const cellAfterWidth = gridAfterMatches[0].replace(/<td[^>]*width="(\d+)"[^>]*><\/td>/gi, "$1");
            widthAfter = cellAfterWidth == gridAfterMatches[0] ? 0 : UnitConverter.pixelsToTwips(parseFloat(cellAfterWidth));
        }
        return { gridAfter: gridAfter, widthAfter: TableWidthUnit.create(widthAfter, TableWidthUnitType.ModelUnits) };
    }
}
HtmlTrTagImporter.tagName = "TR";
