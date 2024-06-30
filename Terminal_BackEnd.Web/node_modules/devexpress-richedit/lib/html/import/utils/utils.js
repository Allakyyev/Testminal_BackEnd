import { MapCreator } from '../../../base-utils/map-creator';
import { BorderInfo } from '../../../core/model/borders/border-info';
import { BorderLineStyle } from '../../../core/model/borders/enums';
import { ColorHelper } from '../../../core/model/color/color';
import { TableWidthUnit, TableWidthUnitType } from '../../../core/model/tables/secondary-structures/table-units';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
export class HtmlImportUtils {
    static getTableWidthUnit(stringValue) {
        if (!stringValue)
            return null;
        const unitTypeMatches = stringValue.match(/(px|in|cm|mm|pt|pc|em|ex|%)/g);
        const unitType = unitTypeMatches ? unitTypeMatches[0] : "px";
        const numberValue = parseFloat(stringValue.replace(unitType, ''));
        if (isNaN(numberValue))
            return null;
        switch (unitType) {
            case "%":
                return new TableWidthUnit().init(numberValue * TableWidthUnit.MUTLIPLIER_FOR_PERCENTS, TableWidthUnitType.FiftiethsOfPercent);
            case "px":
                return new TableWidthUnit().init(UnitConverter.pixelsToTwips(numberValue), TableWidthUnitType.ModelUnits);
            case "in":
                return new TableWidthUnit().init(UnitConverter.inchesToTwips(numberValue), TableWidthUnitType.ModelUnits);
            case "cm":
                return new TableWidthUnit().init(UnitConverter.centimetersToTwips(numberValue), TableWidthUnitType.ModelUnits);
            case "mm":
                return new TableWidthUnit().init(UnitConverter.centimetersToTwips(numberValue) * 10, TableWidthUnitType.ModelUnits);
            case "pt":
                return new TableWidthUnit().init(UnitConverter.pointsToTwips(numberValue), TableWidthUnitType.ModelUnits);
            case "pc":
                return new TableWidthUnit().init(UnitConverter.picasToTwips(numberValue), TableWidthUnitType.ModelUnits);
            case "em":
            case "ex":
            default:
                return new TableWidthUnit().init(0, TableWidthUnitType.Nil);
        }
    }
    static getValueInTwips(stringValue) {
        const result = HtmlImportUtils.getTableWidthUnit(stringValue);
        if (result === null)
            return null;
        if (result.type == TableWidthUnitType.ModelUnits)
            return result.value;
        return 0;
    }
    static getBorderInfo(colorProvider, borderWidth, borderStyle, borderColor) {
        if ((!borderWidth || !borderWidth.length) && (!borderStyle || !borderStyle.length) && (!borderColor || !borderColor.length))
            return null;
        const border = new BorderInfo();
        const width = this.getTableWidthUnit(borderWidth);
        if (width != null && width.type == TableWidthUnitType.ModelUnits)
            border.width = width.value;
        border.style = HtmlImportUtils.MapBorderStyleToType[borderStyle];
        if (border.style === undefined)
            border.style = BorderLineStyle.None;
        const color = ColorUtils.fromString(borderColor);
        if (color != null)
            border.color = colorProvider.getModelColorFromRgba(color == ColorHelper.BLACK_COLOR ? 0 : color);
        return border;
    }
    static importBorder(colorProvider, props, borders, mask, setBorder, borderWidth, borderStyle, borderColor) {
        let borderInfo = HtmlImportUtils.getBorderInfo(colorProvider, borderWidth, borderStyle, borderColor);
        if (borderInfo) {
            setBorder(borders, borderInfo.clone());
            props.setUseValue(mask, borderInfo.style != BorderLineStyle.None);
        }
    }
    static setBorders(colorProvider, props, borders, style, topMask, rightMask, bottomMask, leftMask) {
        HtmlImportUtils.importBorder(colorProvider, props, borders, topMask, (brds, brd) => brds.topBorder = brd, style.borderTopWidth, style.borderTopStyle, style.borderTopColor);
        HtmlImportUtils.importBorder(colorProvider, props, borders, rightMask, (brds, brd) => brds.rightBorder = brd, style.borderRightWidth, style.borderRightStyle, style.borderRightColor);
        HtmlImportUtils.importBorder(colorProvider, props, borders, bottomMask, (brds, brd) => brds.bottomBorder = brd, style.borderBottomWidth, style.borderBottomStyle, style.borderBottomColor);
        HtmlImportUtils.importBorder(colorProvider, props, borders, leftMask, (brds, brd) => brds.leftBorder = brd, style.borderLeftWidth, style.borderLeftStyle, style.borderLeftColor);
    }
    static getPropertyByMap(map, elementBy, defaultValue) {
        const mapedElement = map[elementBy];
        return mapedElement !== undefined ? mapedElement : defaultValue;
    }
}
HtmlImportUtils.MapBorderStyleToType = new MapCreator()
    .add("dashed", BorderLineStyle.Dashed)
    .add("dotted", BorderLineStyle.Dotted)
    .add("double", BorderLineStyle.Double)
    .add("inset", BorderLineStyle.Inset)
    .add("outset", BorderLineStyle.Outset)
    .add("solid", BorderLineStyle.Single)
    .get();
