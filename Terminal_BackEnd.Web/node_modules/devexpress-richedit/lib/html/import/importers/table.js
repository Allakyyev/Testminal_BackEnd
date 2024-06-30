import { ColorModelInfo } from '../../../core/model/color/color-model-info';
import { ShadingInfo } from '../../../core/model/shadings/shading-info';
import { TableProperties, TablePropertiesMask } from '../../../core/model/tables/properties/table-properties';
import { TableLayoutType } from '../../../core/model/tables/secondary-structures/table-base-structures';
import { TableWidthUnit, TableWidthUnitType } from '../../../core/model/tables/secondary-structures/table-units';
import { AttrUtils } from '@devexpress/utils/lib/utils/attr';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { TableInfo } from '../containers/tables';
import { HtmlImportUtils } from '../utils/utils';
import { HtmlTagImporterBase } from './base';
export class HtmlTableTagImporter extends HtmlTagImporterBase {
    constructor() {
        super(...arguments);
        this.rows = [];
    }
    elementTag() {
        return HtmlTableTagImporter.tagName;
    }
    importBefore() {
        const lastTableInfo = ListUtils.last(this.importer.importedTablesInfo);
        if (lastTableInfo && ListUtils.last(ListUtils.last(lastTableInfo.rows).cells).endPosition == this.importer.currPosition ||
            !this.importer.prevRunIsParagraph)
            this.importer.addParagraphRun(null, this.element);
        ListUtils.last(this.importer.levelInfo).allowInsertRuns = false;
        this.element.innerHTML = this.element.innerHTML.replace(/<td([^>]*mso-cell-special:\s*placeholder[^>]*)>[\s\S]*?<\/td>/gi, "<td$1></td>");
    }
    isImportChilds() {
        return true;
    }
    importAfter() {
        if (!this.element.rows.length)
            return;
        const tbl = new TableInfo(this.getTableWidth(), this.getTableProperties(this.colorProvider), this.rows);
        if (!(tbl.width.type == TableWidthUnitType.ModelUnits && tbl.width.value > 0))
            if (!ListUtils.unsafeAnyOf(this.rows, (row) => ListUtils.unsafeAnyOf(row.cells, (cell) => cell.preferredWidth.type == TableWidthUnitType.ModelUnits && cell.preferredWidth.value > 0))) {
                tbl.width.type = TableWidthUnitType.FiftiethsOfPercent;
                tbl.width.value = 100 * TableWidthUnit.MUTLIPLIER_FOR_PERCENTS;
            }
        this.importer.importedTablesInfo.push(tbl);
    }
    getTableProperties(colorProvider) {
        const tblProps = new TableProperties();
        tblProps.layoutType = TableLayoutType.Autofit;
        tblProps.setUseValue(TablePropertiesMask.UseTableLayout, true);
        const tableStyle = DomUtils.getCurrentStyle(this.element);
        HtmlImportUtils.setBorders(colorProvider, tblProps, tblProps.borders, tableStyle, TablePropertiesMask.UseTopBorder, TablePropertiesMask.UseRightBorder, TablePropertiesMask.UseBottomBorder, TablePropertiesMask.UseLeftBorder);
        const tableMarginLeft = HtmlImportUtils.getTableWidthUnit(tableStyle.marginLeft);
        if (tableMarginLeft && tableMarginLeft.type != TableWidthUnitType.Nil) {
            tblProps.indent = tableMarginLeft;
            tblProps.setUseValue(TablePropertiesMask.UseTableIndent, true);
        }
        if (tableStyle.borderSpacing && tableStyle.borderCollapse != "collapse") {
            const cellSpacing = HtmlImportUtils.getTableWidthUnit(tableStyle.borderSpacing.split(" ")[0]);
            if (cellSpacing && cellSpacing.type != TableWidthUnitType.Nil) {
                tblProps.cellSpacing = cellSpacing;
                tblProps.setUseValue(TablePropertiesMask.UseCellSpacing, true);
            }
        }
        const tableBackgroundColor = ColorUtils.fromString(tableStyle.backgroundColor);
        if (tableBackgroundColor) {
            tblProps.shadingInfo = ShadingInfo.createByColor(ColorModelInfo.makeByColor(tableBackgroundColor));
            tblProps.setUseValue(TablePropertiesMask.UseShadingInfoIndex, true);
        }
        return tblProps;
    }
    getTableWidth() {
        let tableWidth = HtmlImportUtils.getTableWidthUnit(this.element.style.width || AttrUtils.getElementAttribute(this.element, "width"));
        if (!tableWidth) {
            const parentCell = DomUtils.getParentByTagName(this.element, "TD");
            if (parentCell)
                tableWidth = HtmlImportUtils.getTableWidthUnit(parentCell.style.width || AttrUtils.getElementAttribute(parentCell, "width"));
        }
        return tableWidth ? tableWidth : new TableWidthUnit().init(0, TableWidthUnitType.Auto);
    }
}
HtmlTableTagImporter.tagName = "TABLE";
