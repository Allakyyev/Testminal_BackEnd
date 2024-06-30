import { MapCreator } from '../../../base-utils/map-creator';
import { AnchorObjectHorizontalPositionAlignment, AnchorObjectVerticalPositionAlignment, DrawingTextAnchoringType, RelativeHeightType, RelativeWidthType } from '../../../core/model/floating-objects/enums';
import { Point } from '@devexpress/utils/lib/geometry/point';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { TranslationTables } from '../../translation-table/translation-tables';
import { StringValueParser } from '../../utils/string-value-parser';
import { UnitsConverter } from '../../utils/units-converter';
export class InlinePictureCssParser {
    constructor(documentModel, readerHelper, originalSize) {
        this.documentModel = documentModel;
        this.readerHelper = readerHelper;
        this.originalSize = originalSize;
        this.size = originalSize;
        this.cssKeywordTable = this.createCssKeywordTable();
        this.topDistance = 0;
        this.bottomDistance = 0;
        this.leftDistance = 180;
        this.rightDistance = 180;
        this.fromWidth = RelativeWidthType.Page;
        this.fromHeight = RelativeHeightType.Page;
        this.offset = new Point(0, 0);
    }
    parseAttribute(style) {
        const attributes = style.split(';');
        ListUtils.forEach(attributes, (attr) => {
            const pair = attr.split(':');
            const key = pair[0].toUpperCase();
            const value = pair[1];
            const handler = this.cssKeywordTable[key];
            if (handler)
                handler(value);
        });
    }
    getFloatingObjectHorizontalPositionAlignment(value) {
        return this.readerHelper.getWpEnumValueCore(value, TranslationTables.floatingObjectHorizontalPositionAlignmentTable.importMap, AnchorObjectHorizontalPositionAlignment.None);
    }
    getFloatingObjectVerticalPositionAlignment(value) {
        return this.readerHelper.getWpEnumValueCore(value, TranslationTables.floatingObjectVerticalPositionAlignmentTable.importMap, AnchorObjectVerticalPositionAlignment.None);
    }
    getWrapText(value) {
        return value == 'square';
    }
    getFloatingObjectVerticalAlignment(value) {
        return this.readerHelper.getWpEnumValueCore(value, TranslationTables.drawingTextAnchoringType.importMap, DrawingTextAnchoringType.Top);
    }
    getFloatingObjectRelativeFromHorizontal(value) {
        return this.readerHelper.getWpEnumValueCore(value, TranslationTables.floatingObjectCssRelativeFromHorizontalTable.importMap, RelativeWidthType.Margin);
    }
    getFloatingObjectRelativeFromVertical(value) {
        return this.readerHelper.getWpEnumValueCore(value, TranslationTables.floatingObjectCssRelativeFromVerticalTable.importMap, RelativeHeightType.Margin);
    }
    getPercentValue(value) {
        value = value.trim();
        if (StringUtils.endsAt(value, '%')) {
            try {
                const result = parseFloat(value.substr(0, value.length - 1));
                if (result)
                    return result * 1000;
            }
            catch (_a) { }
        }
        else {
            try {
                const result = parseInt(value, 10);
                if (result)
                    return result * 1000;
            }
            catch (_b) { }
        }
        return 100 * 1000;
    }
    cssWidth(propertiesValue) {
        const valueInfo = StringValueParser.parse(propertiesValue);
        let value = UnitsConverter.valueUnitToModelUnitsF(valueInfo);
        if (valueInfo.unit === '%')
            value = value * this.originalSize.width;
        this.size.width = value;
    }
    cssHeight(propertiesValue) {
        const valueInfo = StringValueParser.parse(propertiesValue);
        let value = UnitsConverter.valueUnitToModelUnitsF(valueInfo);
        if (valueInfo.unit === '%')
            value = value * this.originalSize.height;
        this.size.height = value;
    }
    cssVerticalPositionType(propertiesValue) {
        this.verticalPositionType = propertiesValue;
    }
    cssHorizontalPositionType(propertiesValue) {
        this.horizontalPositionType = propertiesValue;
    }
    cssHorizontalPositionAlignment(propertiesValue) {
        this.horizontalPositionAlignment = this.getFloatingObjectHorizontalPositionAlignment(propertiesValue);
    }
    cssVerticalPositionAlignment(propertiesValue) {
        this.verticalPositionAlignment = this.getFloatingObjectVerticalPositionAlignment(propertiesValue);
    }
    cssTextBoxVerticalAlignment(propertiesValue) {
        this.textBoxVerticalAlignment = this.getFloatingObjectVerticalAlignment(propertiesValue);
    }
    cssTextBoxWrapType(propertiesValue) {
        this.wrapText = this.getWrapText(propertiesValue);
        this.useWrapText = true;
    }
    cssZOrder(propertiesValue) {
        this.zOrder = Math.max(parseInt(propertiesValue, 10), 0);
    }
    cssTopDistance(propertiesValue) {
        const valueInfo = StringValueParser.parse(propertiesValue);
        const value = UnitsConverter.valueUnitToModelUnitsF(valueInfo);
        this.topDistance = value;
    }
    cssLeftDistance(propertiesValue) {
        const valueInfo = StringValueParser.parse(propertiesValue);
        const value = UnitsConverter.valueUnitToModelUnitsF(valueInfo);
        this.leftDistance = value;
    }
    cssRightDistance(propertiesValue) {
        const valueInfo = StringValueParser.parse(propertiesValue);
        const value = UnitsConverter.valueUnitToModelUnitsF(valueInfo);
        this.rightDistance = value;
    }
    cssBottomDistance(propertiesValue) {
        const valueInfo = StringValueParser.parse(propertiesValue);
        const value = UnitsConverter.valueUnitToModelUnitsF(valueInfo);
        this.bottomDistance = value;
    }
    cssMsoWidthPercent(propertiesValue) {
        this.widthPercent = this.getPercentValue(propertiesValue);
        this.useRelativeWidth = true;
    }
    cssMsoHeightPercent(propertiesValue) {
        this.heightPercent = this.getPercentValue(propertiesValue);
        this.useRelativeHeight = true;
    }
    cssMsoWidthRelative(propertiesValue) {
        this.fromWidth = this.getFloatingObjectRelativeFromHorizontal(propertiesValue);
        this.useRelativeWidth = true;
    }
    cssMsoHeightRelative(propertiesValue) {
        this.fromHeight = this.getFloatingObjectRelativeFromVertical(propertiesValue);
        this.useRelativeHeight = true;
    }
    cssPosition(value) {
        this.position = value;
    }
    cssOffsetX(propertiesValue) {
        const valueInfo = StringValueParser.parse(propertiesValue);
        const value = UnitsConverter.valueUnitToModelUnitsF(valueInfo);
        this.offset.x = value;
    }
    cssOffsetY(propertiesValue) {
        const valueInfo = StringValueParser.parse(propertiesValue);
        const value = UnitsConverter.valueUnitToModelUnitsF(valueInfo);
        this.offset.y = value;
    }
    cssRotation(propertiesValue) {
        this.useRotation = true;
        const valueInfo = StringValueParser.parse(propertiesValue);
        this.rotation = UnitsConverter.rotationUnitToModelUnits(valueInfo);
    }
    cssVisibility(propertiesValue) {
        this.hidden = propertiesValue === 'hidden';
    }
    createCssKeywordTable() {
        const cssKeywordTable = new MapCreator()
            .add('width'.toUpperCase(), (value) => this.cssWidth(value))
            .add('height'.toUpperCase(), (value) => this.cssHeight(value))
            .add('z-index'.toUpperCase(), (value) => this.cssZOrder(value))
            .add('mso-wrap-distance-top'.toUpperCase(), (value) => this.cssTopDistance(value))
            .add('mso-wrap-distance-left'.toUpperCase(), (value) => this.cssLeftDistance(value))
            .add('mso-wrap-distance-right'.toUpperCase(), (value) => this.cssRightDistance(value))
            .add('mso-wrap-distance-bottom'.toUpperCase(), (value) => this.cssBottomDistance(value))
            .add('margin-left'.toUpperCase(), (value) => this.cssOffsetX(value))
            .add('margin-top'.toUpperCase(), (value) => this.cssOffsetY(value))
            .add('mso-position-horizontal'.toUpperCase(), (value) => this.cssHorizontalPositionAlignment(value))
            .add('mso-position-vertical'.toUpperCase(), (value) => this.cssVerticalPositionAlignment(value))
            .add('mso-position-vertical-relative'.toUpperCase(), (value) => this.cssVerticalPositionType(value))
            .add('mso-position-horizontal-relative'.toUpperCase(), (value) => this.cssHorizontalPositionType(value))
            .add('v-text-anchor'.toUpperCase(), (value) => this.cssTextBoxVerticalAlignment(value))
            .add('mso-wrap-style'.toUpperCase(), (value) => this.cssTextBoxWrapType(value))
            .add('rotation'.toUpperCase(), (value) => this.cssRotation(value))
            .add('mso-width-percent'.toUpperCase(), (value) => this.cssMsoWidthPercent(value))
            .add('mso-height-percent'.toUpperCase(), (value) => this.cssMsoHeightPercent(value))
            .add('mso-width-relative'.toUpperCase(), (value) => this.cssMsoWidthRelative(value))
            .add('mso-height-relative'.toUpperCase(), (value) => this.cssMsoHeightRelative(value))
            .add('position'.toUpperCase(), (value) => this.cssPosition(value))
            .add('visibility'.toUpperCase(), (value) => this.cssVisibility(value))
            .get();
        return cssKeywordTable;
    }
}
