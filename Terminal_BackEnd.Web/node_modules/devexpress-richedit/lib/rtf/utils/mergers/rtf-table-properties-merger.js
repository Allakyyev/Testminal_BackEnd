import { TablePropertiesMergerBorderBottom, TablePropertiesMergerBorderHorizontal, TablePropertiesMergerBorderLeft, TablePropertiesMergerBorderRight, TablePropertiesMergerBorderTop, TablePropertiesMergerBorderVertical, TablePropertiesMergerCellSpacing, TablePropertiesMergerHorizontalAlignment, TablePropertiesMergerIndent, TablePropertiesMergerLayoutType, TablePropertiesMergerMarginBottom, TablePropertiesMergerMarginLeft, TablePropertiesMergerMarginRight, TablePropertiesMergerMarginTop, TablePropertiesMergerShadingInfo, TablePropertiesMergerStyleColumnBandSize, TablePropertiesMergerStyleRowBandSize } from '../../../core/model/tables/properties-mergers/table-properties-merger';
import { ConditionalTableStyleFormatting } from '../../../core/model/tables/secondary-structures/table-base-structures';
import { RtfTablePropertiesMergerBase } from './rtf-table-properties-merger-base';
export class RtfTablePropertiesMerger extends RtfTablePropertiesMergerBase {
    constructor(model) {
        super(model);
    }
    get defaultProperties() {
        return this.model.defaultTableProperties;
    }
    getMergedProperties(table) {
        return this.merge(table.properties, table.style, table, null, ConditionalTableStyleFormatting.WholeTable);
    }
    getStyleMergedProperties(style, tableStyle, conditionalTFormatting) {
        return this.merge(style.tableProperties, tableStyle, null, null, conditionalTFormatting);
    }
    merge(source, tableStyle, _table, _tablePropertiesException, conditionalFormatting) {
        const result = source.clone();
        result.indent = new TablePropertiesMergerIndent()
            .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
        result.cellSpacing = new TablePropertiesMergerCellSpacing()
            .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
        result.borders.leftBorder = new TablePropertiesMergerBorderLeft()
            .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
        result.borders.rightBorder = new TablePropertiesMergerBorderRight()
            .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
        result.borders.topBorder = new TablePropertiesMergerBorderTop()
            .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
        result.borders.bottomBorder = new TablePropertiesMergerBorderBottom()
            .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
        result.borders.insideVerticalBorder = new TablePropertiesMergerBorderVertical()
            .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
        result.borders.insideHorizontalBorder = new TablePropertiesMergerBorderHorizontal()
            .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
        result.cellMargins.left = new TablePropertiesMergerMarginLeft()
            .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
        result.cellMargins.right = new TablePropertiesMergerMarginRight()
            .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
        result.cellMargins.top = new TablePropertiesMergerMarginTop()
            .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
        result.cellMargins.bottom = new TablePropertiesMergerMarginBottom()
            .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
        result.layoutType = new TablePropertiesMergerLayoutType()
            .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
        result.shadingInfo = new TablePropertiesMergerShadingInfo()
            .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
        result.tableStyleColumnBandSize = new TablePropertiesMergerStyleColumnBandSize()
            .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
        result.tableStyleRowBandSize = new TablePropertiesMergerStyleRowBandSize()
            .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
        result.tableRowAlignment = new TablePropertiesMergerHorizontalAlignment()
            .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
        return result;
    }
}
