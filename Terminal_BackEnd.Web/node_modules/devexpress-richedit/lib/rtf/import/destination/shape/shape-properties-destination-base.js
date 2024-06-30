import { Chunk } from '../../../../core/model/chunk';
import { DXColor } from '../../../../core/model/color/dx-color';
import { SubDocumentInfoType } from '../../../../core/model/enums';
import { AnchorObjectTextWrapType } from '../../../../core/model/floating-objects/enums';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { RtfDrawingKeywords } from '../../../translation-table/rtf-drawing-keywords';
import { RtfShapePropertiesInfo } from '../../model/shape/shape-properties-info';
import { DestinationBase } from '../base/destination';
import { SkipDestination } from '../base/skip-destination';
import { DestinationType } from '../utils/destination-type';
import { DrawingObjectHorizontalPositionType, DrawingObjectVerticalPositionType } from './enums';
import { ShapePropertyDestination } from './shape-property-destination';
import { ShapeTextDestination } from './shape-text-destination';
export class ShapePropertiesDestinationBase extends DestinationBase {
    constructor(importer, shapeProperties = new RtfShapePropertiesInfo()) {
        super(importer);
        this.shapeProperties = shapeProperties;
    }
    get destinationType() { return DestinationType.ShapePropertiesDestinationBase; }
    get controlCharHT() { return null; }
    static getThis(rtfImporter) {
        return rtfImporter.destination;
    }
    static onShapeId(_importer, _parameterValue, _hasParameter) {
    }
    static onShapeTextKeyword(importer, _parameterValue, _hasParameter) {
        const destination = ShapePropertiesDestinationBase.getThis(importer);
        const textBox = importer.documentModel.createSubDocument(SubDocumentInfoType.TextBox, importer.subDocument.id, true);
        textBox.chunks = [new Chunk(textBox.positionManager.registerPosition(0), '', true)];
        destination.shapeProperties.addProperty(RtfDrawingKeywords.ShapeText, textBox.id);
        destination.markAsShape();
        importer.destination = new ShapeTextDestination(importer, textBox);
    }
    static onShapePropertyKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new ShapePropertyDestination(importer, ShapePropertiesDestinationBase.getThis(importer).shapeProperties);
    }
    static onShapeResultKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new SkipDestination(importer);
    }
    static onShapeLockedKeyword(importer, _parameterValue, _hasParameter) {
        ShapePropertiesDestinationBase.getThis(importer).shapeProperties.addProperty(RtfDrawingKeywords.ShapeLocked, ShapePropertiesDestinationBase.trueIntValue);
    }
    static onShapeWrapTextSideKeyword(importer, parameterValue, hasParameter) {
        if (hasParameter)
            ShapePropertiesDestinationBase.getThis(importer).shapeProperties.addProperty(RtfDrawingKeywords.ShapeWrapTextSide, parameterValue);
    }
    static onShapeWrapTextTypeZOrderKeyword(importer, parameterValue, hasParameter) {
        if (hasParameter) {
            const destination = ShapePropertiesDestinationBase.getThis(importer);
            const rawWrapType = destination.shapeProperties.getPropertyOrNull(RtfDrawingKeywords.ShapeWrapTextType);
            if (rawWrapType !== null && rawWrapType == AnchorObjectTextWrapType.None)
                destination.shapeProperties.addProperty(RtfDrawingKeywords.ShapeWrapTextTypeZOrder, parameterValue);
        }
    }
    static onShapeWrapTextTypeKeyword(importer, parameterValue, hasParameter) {
        if (hasParameter) {
            const newWrapType = ShapePropertiesDestinationBase.convertDrawingObjectTextWrapType(parameterValue);
            if (newWrapType == AnchorObjectTextWrapType.None)
                return;
            ShapePropertiesDestinationBase.getThis(importer).shapeProperties.addProperty(RtfDrawingKeywords.ShapeWrapTextType, newWrapType);
        }
    }
    static convertDrawingObjectTextWrapType(parameterValue) {
        let textWrapType = AnchorObjectTextWrapType.None;
        NumberMapUtils.forEach(RtfDrawingKeywords.DrawingObjectTextWrapTypeTable, (obj, key) => {
            if (parameterValue == obj)
                textWrapType = key;
        });
        return textWrapType;
    }
    static onShapeHorizontalPositionTypePageKeyword(importer, _parameterValue, _hasParameter) {
        ShapePropertiesDestinationBase.setDrawingObjectHorizontalPositionType(ShapePropertiesDestinationBase.getThis(importer).shapeProperties, DrawingObjectHorizontalPositionType.Page);
    }
    static onShapeHorizontalPositionTypeMarginKeyword(importer, _parameterValue, _hasParameter) {
        ShapePropertiesDestinationBase.setDrawingObjectHorizontalPositionType(ShapePropertiesDestinationBase.getThis(importer).shapeProperties, DrawingObjectHorizontalPositionType.Margin);
    }
    static onShapeHorizontalPositionTypeColumnKeyword(importer, _parameterValue, _hasParameter) {
        ShapePropertiesDestinationBase.setDrawingObjectHorizontalPositionType(ShapePropertiesDestinationBase.getThis(importer).shapeProperties, DrawingObjectHorizontalPositionType.Column);
    }
    static onShapeHorizontalPositionTypeIgnoreKeyword(importer, _parameterValue, _hasParameter) {
        ShapePropertiesDestinationBase.getThis(importer).shapeProperties.addProperty(RtfDrawingKeywords.ShapeIgnoreLegacyHorizontalPositionType, ShapePropertiesDestinationBase.trueIntValue);
    }
    static onShapeVerticalPositionTypePageKeyword(importer, _parameterValue, _hasParameter) {
        ShapePropertiesDestinationBase.setDrawingObjectVerticalPositionType(ShapePropertiesDestinationBase.getThis(importer).shapeProperties, DrawingObjectVerticalPositionType.Page);
    }
    static onShapeVerticalPositionTypeMarginKeyword(importer, _parameterValue, _hasParameter) {
        ShapePropertiesDestinationBase.setDrawingObjectVerticalPositionType(ShapePropertiesDestinationBase.getThis(importer).shapeProperties, DrawingObjectVerticalPositionType.Margin);
    }
    static onShapeVerticalPositionTypeParagraphKeyword(importer, _parameterValue, _hasParameter) {
        ShapePropertiesDestinationBase.setDrawingObjectVerticalPositionType(ShapePropertiesDestinationBase.getThis(importer).shapeProperties, DrawingObjectVerticalPositionType.Paragraph);
    }
    static onShapeVerticalPositionTypeIgnoreKeyword(importer, _parameterValue, _hasParameter) {
        ShapePropertiesDestinationBase.getThis(importer).shapeProperties.addProperty(RtfDrawingKeywords.ShapeIgnoreLegacyVerticalPositionType, ShapePropertiesDestinationBase.trueIntValue);
    }
    static onShapeLeftKeyword(importer, parameterValue, hasParameter) {
        if (hasParameter)
            ShapePropertiesDestinationBase.getThis(importer).onShapeLeftKeyword(parameterValue);
    }
    static onShapeTopKeyword(importer, parameterValue, hasParameter) {
        if (hasParameter)
            ShapePropertiesDestinationBase.getThis(importer).onShapeTopKeyword(parameterValue);
    }
    static onShapeRightKeyword(importer, parameterValue, hasParameter) {
        if (hasParameter)
            ShapePropertiesDestinationBase.getThis(importer).onShapeRightKeyword(parameterValue);
    }
    static onShapeBottomKeyword(importer, parameterValue, hasParameter) {
        if (hasParameter)
            ShapePropertiesDestinationBase.getThis(importer).onShapeBottomKeyword(parameterValue);
    }
    static onShapeZOrderKeyword(importer, parameterValue, hasParameter) {
        if (hasParameter)
            ShapePropertiesDestinationBase.getThis(importer).shapeProperties.addProperty(RtfDrawingKeywords.ShapeZOrder, Math.max(0, parameterValue));
    }
    static setDrawingObjectVerticalPositionType(shapePropertiesInfo, drawingObjectVerticalPositionType) {
        shapePropertiesInfo.addProperty(RtfDrawingKeywords.DXInternalLegacyVerticalPositionAlignment, drawingObjectVerticalPositionType);
    }
    static setDrawingObjectHorizontalPositionType(shapePropertiesInfo, drawingObjectHorizontalPositionType) {
        shapePropertiesInfo.addProperty(RtfDrawingKeywords.DXInternalLegacyHorizontalPositionAlignment, drawingObjectHorizontalPositionType);
    }
    processControlCharCore(_ch) { }
    processCharCore(_ch) { }
    processKeywordCore(keyword, parameterValue, hasParameter) {
        const translator = this.keywordHT[keyword];
        if (translator !== undefined) {
            translator(this.importer, parameterValue, hasParameter);
            return true;
        }
        return false;
    }
    hasColorProperty(name) {
        return this.shapeProperties.getPropertyOrNull(name) != null;
    }
    getColorPropertyValue(name) {
        const r = this.shapeProperties.getNullableColorProperty(name);
        return r != null ? r : DXColor.empty;
    }
    onShapeLeftKeyword(parameterValue) {
        this.shapeProperties.addProperty(RtfDrawingKeywords.ShapeLeft, parameterValue);
        this.markAsShape();
    }
    onShapeTopKeyword(parameterValue) {
        this.shapeProperties.addProperty(RtfDrawingKeywords.ShapeTop, parameterValue);
        this.markAsShape();
    }
    onShapeRightKeyword(parameterValue) {
        this.shapeProperties.addProperty(RtfDrawingKeywords.ShapeRight, parameterValue);
        this.markAsShape();
    }
    onShapeBottomKeyword(parameterValue) {
        this.shapeProperties.addProperty(RtfDrawingKeywords.ShapeBottom, parameterValue);
        this.markAsShape();
    }
    markAsShape() {
        this.shapeProperties.addProperty(RtfDrawingKeywords.DXInternalIsShape, ShapePropertiesDestinationBase.trueIntValue);
    }
}
ShapePropertiesDestinationBase.distanceFromText = 114305;
ShapePropertiesDestinationBase.trueIntValue = 1;
