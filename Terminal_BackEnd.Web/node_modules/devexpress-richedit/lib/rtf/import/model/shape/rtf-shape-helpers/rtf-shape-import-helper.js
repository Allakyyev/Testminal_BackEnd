import { AnchorObjectHorizontalPositionAlignment, AnchorObjectHorizontalPositionType, AnchorObjectTextWrapType, AnchorObjectVerticalPositionAlignment, AnchorObjectVerticalPositionType } from '../../../../../core/model/floating-objects/enums';
import { RtfDrawingKeywords } from '../../../../translation-table/rtf-drawing-keywords';
import { RtfContainerPropertiesHelper } from './rtf-container-properties-helper';
import { RtfDrawingObjectRunPropertiesHelper } from './rtf-drawing-object-run-properties-helper';
import { RtfDrawingTextBodyPropertiesHelper } from './rtf-drawing-text-body-properties-helper';
import { RtfOutlinePropertiesHelper } from './rtf-outline-properties-helper';
export class RtfShapeImportHelper {
    constructor(shapeProperties) {
        this.shapeProperties = shapeProperties;
    }
    setDefaults(anchorInfo) {
        anchorInfo.horizontalPositionType = AnchorObjectHorizontalPositionType.Margin;
        anchorInfo.verticalPositionType = AnchorObjectVerticalPositionType.Margin;
        anchorInfo.wrapType = AnchorObjectTextWrapType.None;
        anchorInfo.horizontalPositionAlignment = AnchorObjectHorizontalPositionAlignment.None;
        anchorInfo.verticalPositionAlignment = AnchorObjectVerticalPositionAlignment.None;
    }
    applyDrawingObjectRunProperties(anchorInfo, nonVisualDrawingObjectProperties, size) {
        this.setDefaults(anchorInfo);
        this.applyRunProperties(anchorInfo);
        this.applyContainerProperties(anchorInfo, size);
        this.applyNonVisualDrawingObjectProperties(anchorInfo, nonVisualDrawingObjectProperties);
    }
    applyAnchoredTextBoxRunProperties(run) {
        this.applyBodyProperties(run.textBoxProperties);
        this.applyNonVisualDrawingObjectProperties(run.anchorInfo, run.containerProperties);
        this.applyShapeProperties(run.shape);
        this.applyDrawingObjectRunProperties(run.anchorInfo, run.containerProperties, run.size);
    }
    applyAnchoredPictureRunProperties(run) {
        this.applyNonVisualDrawingObjectProperties(run.anchorInfo, run.info.containerProperties);
        this.applyShapeProperties(run.shape);
        this.applyDrawingObjectRunProperties(run.anchorInfo, run.info.nonVisualDrawingProperties, null);
    }
    applyInlinePictureRunProperties(run) {
        this.applyNonVisualDrawingObjectPropertiesCore(run.info.containerProperties);
        this.applyShapeProperties(run.shape);
        this.applyNonVisualDrawingObjectPropertiesCore(run.info.nonVisualDrawingProperties);
    }
    applyRunProperties(anchorInfo) {
        new RtfDrawingObjectRunPropertiesHelper(this.shapeProperties).applyProperties(anchorInfo);
    }
    applyContainerProperties(anchorInfo, size) {
        new RtfContainerPropertiesHelper(this.shapeProperties).applyProperties(anchorInfo, size);
    }
    applyNonVisualDrawingObjectProperties(anchorInfo, constainerProperties) {
        this.applyNonVisualDrawingObjectPropertiesCore(constainerProperties);
        this.shapeProperties.trySetProperty(RtfDrawingKeywords.Hidden, value => anchorInfo.hidden = value);
    }
    applyNonVisualDrawingObjectPropertiesCore(constainerProperties) {
        this.shapeProperties.trySetProperty(RtfDrawingKeywords.Name, value => constainerProperties.name = value);
        this.shapeProperties.trySetProperty(RtfDrawingKeywords.Description, value => constainerProperties.description = value);
    }
    applyShapeProperties(shape) {
        const filled = this.shapeProperties.getNullableColorProperty(RtfDrawingKeywords.Filled);
        const fillColor = this.shapeProperties.getNullableColorProperty(RtfDrawingKeywords.FillColor);
        if (filled && fillColor)
            shape.fillColor = fillColor;
        new RtfOutlinePropertiesHelper(this.shapeProperties).applyProperties(shape);
    }
    applyBodyProperties(textBoxProperties) {
        new RtfDrawingTextBodyPropertiesHelper(this.shapeProperties).applyProperties(textBoxProperties);
    }
}
