import { boolToInt } from '@devexpress/utils/lib/utils/common';
import { SectionColumnProperties } from '../../../section/section-column-properties';
import { SectionProperties } from '../../../section/section-properties';
import { JSONSectionProperty } from '../../enums/json-section-enums';
import { JSONColumnsSectionPropertiesConverter } from './json-columns-section-properties-converter';
export class JSONSectionPropertiesConverter {
    static convertFromJSON(obj) {
        var result = new SectionProperties();
        result.marginLeft = obj[JSONSectionProperty.MarginLeft];
        result.marginTop = obj[JSONSectionProperty.MarginTop];
        result.marginRight = obj[JSONSectionProperty.MarginRight];
        result.marginBottom = obj[JSONSectionProperty.MarginBottom];
        result.columnCount = obj[JSONSectionProperty.ColumnCount];
        result.space = obj[JSONSectionProperty.Space];
        result.columnsInfo = JSONColumnsSectionPropertiesConverter.convertFromJSON(obj[JSONSectionProperty.ColumnsInfo]);
        result.pageWidth = obj[JSONSectionProperty.PageWidth];
        result.pageHeight = obj[JSONSectionProperty.PageHeight];
        result.startType = obj[JSONSectionProperty.StartType];
        result.landscape = !!obj[JSONSectionProperty.Landscape];
        result.equalWidthColumns = !!obj[JSONSectionProperty.EqualWidthColumns];
        result.differentFirstPage = !!obj[JSONSectionProperty.DifferentFirstPage];
        result.headerOffset = obj[JSONSectionProperty.HeaderOffset];
        result.footerOffset = obj[JSONSectionProperty.FooterOffset];
        result.paperKind = obj[JSONSectionProperty.PaperKind];
        result.firstPageNumber = obj[JSONSectionProperty.FirstPageNumber];
        result.continueNumbering = !!obj[JSONSectionProperty.ContinueNumbering];
        if (!result.equalWidthColumns)
            while (result.columnCount > result.columnsInfo.length)
                result.columnsInfo.push(new SectionColumnProperties(0, 0));
        return result;
    }
    static convertToJSON(source) {
        var result = {};
        result[JSONSectionProperty.MarginLeft] = source.marginLeft;
        result[JSONSectionProperty.MarginTop] = source.marginTop;
        result[JSONSectionProperty.MarginRight] = source.marginRight;
        result[JSONSectionProperty.MarginBottom] = source.marginBottom;
        result[JSONSectionProperty.ColumnCount] = source.columnCount;
        result[JSONSectionProperty.Space] = source.space;
        result[JSONSectionProperty.ColumnsInfo] = JSONColumnsSectionPropertiesConverter.convertToJSON(source.columnsInfo);
        result[JSONSectionProperty.PageWidth] = source.pageWidth;
        result[JSONSectionProperty.PageHeight] = source.pageHeight;
        result[JSONSectionProperty.StartType] = source.startType;
        result[JSONSectionProperty.Landscape] = boolToInt(source.landscape);
        result[JSONSectionProperty.EqualWidthColumns] = boolToInt(source.equalWidthColumns);
        result[JSONSectionProperty.DifferentFirstPage] = boolToInt(source.differentFirstPage);
        result[JSONSectionProperty.HeaderOffset] = source.headerOffset;
        result[JSONSectionProperty.FooterOffset] = source.footerOffset;
        result[JSONSectionProperty.PaperKind] = source.paperKind;
        result[JSONSectionProperty.FirstPageNumber] = source.firstPageNumber;
        result[JSONSectionProperty.ContinueNumbering] = boolToInt(source.continueNumbering);
        return result;
    }
}
