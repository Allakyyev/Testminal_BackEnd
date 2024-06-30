import { MapCreator } from '../../../base-utils/map-creator';
import { BorderLineStyle } from '../../../core/model/borders/enums';
import { MaskedParagraphProperties, ParagraphAlignment, ParagraphFirstLineIndent, ParagraphLineSpacingType, ParagraphPropertiesMask } from '../../../core/model/paragraph/paragraph-properties';
import { TableWidthUnit, TableWidthUnitType } from '../../../core/model/tables/secondary-structures/table-units';
import { Errors } from '@devexpress/utils/lib/errors';
import { AttrUtils } from '@devexpress/utils/lib/utils/attr';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { HtmlImportUtils } from './utils';
export class HtmlImporterMaskedParagraphProperties {
    import(colorProvider, element, isTableCellTag) {
        this.result = new MaskedParagraphProperties();
        this.element = element;
        this.elementStyle = element.style;
        const calculatedStyle = DomUtils.getCurrentStyle(element);
        this.importAlignment();
        this.importFirstLineIndent();
        this.importLeftIndent();
        this.importRightIndent();
        this.importLineSpacing();
        this.importSpacingBefore();
        this.importSpacingAfter();
        if (!isTableCellTag) {
            this.importTopBorder(colorProvider, calculatedStyle);
            this.importRightBorder(colorProvider, calculatedStyle);
            this.importBottomBorder(colorProvider, calculatedStyle);
            this.importLeftBorder(colorProvider, calculatedStyle);
        }
        return this.result;
    }
    importAlignment() {
        let textAlign = this.elementStyle.textAlign;
        if (!textAlign || !textAlign.length) {
            const parentCell = DomUtils.getParentByTagName(this.element, "TD");
            if (parentCell)
                textAlign = AttrUtils.getElementAttribute(parentCell, "align");
        }
        this.result.alignment = HtmlImportUtils.getPropertyByMap(HtmlImporterMaskedParagraphProperties.MapAlignmentToType, textAlign, ParagraphAlignment.Left);
        this.result.setUseValue(ParagraphPropertiesMask.UseAlignment, this.result.alignment != ParagraphAlignment.Left);
    }
    importFirstLineIndent() {
        const firstLineIndent = HtmlImportUtils.getValueInTwips(this.elementStyle.textIndent);
        if (firstLineIndent != null && firstLineIndent != 0) {
            this.result.firstLineIndentType = firstLineIndent > 0 ? ParagraphFirstLineIndent.Indented : ParagraphFirstLineIndent.Hanging;
            this.result.firstLineIndent = Math.abs(firstLineIndent);
            this.result.setUseValue(ParagraphPropertiesMask.UseFirstLineIndent, true);
        }
    }
    importLeftIndent() {
        const leftIndent = HtmlImportUtils.getValueInTwips(this.elementStyle.marginLeft);
        if (leftIndent != null && leftIndent >= 0) {
            this.result.leftIndent = leftIndent;
            this.result.setUseValue(ParagraphPropertiesMask.UseLeftIndent, true);
        }
    }
    importRightIndent() {
        const rightIndent = HtmlImportUtils.getValueInTwips(this.elementStyle.marginRight);
        if (rightIndent != null && rightIndent >= 0) {
            this.result.rightIndent = rightIndent;
            this.result.setUseValue(ParagraphPropertiesMask.UseRightIndent, true);
        }
    }
    importSpacingBefore() {
        const spacingBefore = HtmlImportUtils.getValueInTwips(this.elementStyle.marginTop);
        if (spacingBefore != null && spacingBefore >= 0) {
            this.result.spacingBefore = spacingBefore;
            this.result.setUseValue(ParagraphPropertiesMask.UseSpacingBefore, true);
        }
    }
    importSpacingAfter() {
        const spacingAfter = HtmlImportUtils.getValueInTwips(this.elementStyle.marginBottom);
        if (spacingAfter != null && spacingAfter >= 0) {
            this.result.spacingAfter = spacingAfter;
            this.result.setUseValue(ParagraphPropertiesMask.UseSpacingAfter, true);
        }
    }
    importLineSpacing() {
        this.result.setUseValue(ParagraphPropertiesMask.UseLineSpacing, true);
        this.result.setUseValue(ParagraphPropertiesMask.UseBeforeAutoSpacing, true);
        this.result.setUseValue(ParagraphPropertiesMask.UseAfterAutoSpacing, true);
        const stringLineHeight = this.elementStyle.lineHeight;
        const height = HtmlImportUtils.getTableWidthUnit(stringLineHeight);
        if (height == null) {
            this.setSpacingAsMultiple(parseFloat(stringLineHeight));
            return;
        }
        switch (height.type) {
            case TableWidthUnitType.FiftiethsOfPercent:
                this.setSpacingAsMultiple(height.value / TableWidthUnit.MAX_PERCENT_WIDTH);
                break;
            case TableWidthUnitType.ModelUnits:
                this.result.lineSpacing = height.value;
                this.result.lineSpacingType = this.elementStyle["mso-line-height-rule"] == "exactly" ?
                    ParagraphLineSpacingType.Exactly :
                    ParagraphLineSpacingType.AtLeast;
                break;
            case TableWidthUnitType.Nil:
            case TableWidthUnitType.Auto:
                break;
            default: throw new Error(Errors.InternalException);
        }
    }
    setSpacingAsMultiple(multipleValue) {
        if (!multipleValue || isNaN(multipleValue))
            return;
        this.result.lineSpacing = multipleValue;
        this.result.lineSpacingType =
            MathUtils.numberCloseTo(multipleValue, 1.5) ? ParagraphLineSpacingType.Sesquialteral :
                (MathUtils.numberCloseTo(multipleValue, 2) ? ParagraphLineSpacingType.Double :
                    (MathUtils.numberCloseTo(multipleValue, 1) ? ParagraphLineSpacingType.Single :
                        ParagraphLineSpacingType.Multiple));
    }
    importTopBorder(colorProvider, calculatedStyle) {
        const borderTopInfo = HtmlImportUtils.getBorderInfo(colorProvider, calculatedStyle.borderTopWidth, calculatedStyle.borderTopStyle, calculatedStyle.borderTopColor);
        if (borderTopInfo) {
            this.result.topBorder.copyFrom(borderTopInfo);
            this.result.setUseValue(ParagraphPropertiesMask.UseTopBorder, borderTopInfo.style != BorderLineStyle.None);
        }
    }
    importRightBorder(colorProvider, calculatedStyle) {
        const borderRightInfo = HtmlImportUtils.getBorderInfo(colorProvider, calculatedStyle.borderRightWidth, calculatedStyle.borderRightStyle, calculatedStyle.borderRightColor);
        if (borderRightInfo) {
            this.result.rightBorder.copyFrom(borderRightInfo);
            this.result.setUseValue(ParagraphPropertiesMask.UseRightBorder, borderRightInfo.style != BorderLineStyle.None);
        }
    }
    importBottomBorder(colorProvider, calculatedStyle) {
        const borderBottomInfo = HtmlImportUtils.getBorderInfo(colorProvider, calculatedStyle.borderBottomWidth, calculatedStyle.borderBottomStyle, calculatedStyle.borderBottomColor);
        if (borderBottomInfo) {
            this.result.bottomBorder.copyFrom(borderBottomInfo);
            this.result.setUseValue(ParagraphPropertiesMask.UseBottomBorder, borderBottomInfo.style != BorderLineStyle.None);
        }
    }
    importLeftBorder(colorProvider, calculatedStyle) {
        const borderLeftInfo = HtmlImportUtils.getBorderInfo(colorProvider, calculatedStyle.borderLeftWidth, calculatedStyle.borderLeftStyle, calculatedStyle.borderLeftColor);
        if (borderLeftInfo) {
            this.result.leftBorder.copyFrom(borderLeftInfo);
            this.result.setUseValue(ParagraphPropertiesMask.UseLeftBorder, borderLeftInfo.style != BorderLineStyle.None);
        }
    }
}
HtmlImporterMaskedParagraphProperties.MapAlignmentToType = new MapCreator()
    .add("right", ParagraphAlignment.Right)
    .add("justify", ParagraphAlignment.Justify)
    .add("center", ParagraphAlignment.Center)
    .get();
