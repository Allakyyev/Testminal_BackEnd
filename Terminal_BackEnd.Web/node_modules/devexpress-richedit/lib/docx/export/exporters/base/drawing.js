import { DXColor } from '../../../../core/model/color/dx-color';
import { AnchorObjectHorizontalPositionAlignment, AnchorObjectHorizontalPositionType, AnchorObjectTextWrapSide, AnchorObjectTextWrapType, AnchorObjectVerticalPositionAlignment, AnchorObjectVerticalPositionType, DrawingTextAnchoringType, RelativeHeightType, RelativeWidthType } from '../../../../core/model/floating-objects/enums';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Constants } from '@devexpress/utils/lib/constants';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { EnumUtils } from '@devexpress/utils/lib/utils/enum';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { TranslationTables } from '../../../translation-table/translation-tables';
import { DocxNsType } from '../../../utils/constants';
import { InlineDrawingObject } from '../../utils/inline-drawing-object';
import { WriterHelper } from '../../utils/writer-helper';
import { BaseExporter } from '../base';
import { ImageExporter } from './image-exporter';
export class DrawingExporter extends BaseExporter {
    writeFloatingObjectDrawing(drawingObject, modelImageId) {
        this.writer.writeWpStartElement('drawing');
        this.writeFloatingObjectAnchor(drawingObject, modelImageId);
        this.writer.endElement();
    }
    writeFloatingObjectTextBoxContent2010(drawingObject, textBoxContent) {
        this.writer.writeMcStartElement('AlternateContent');
        this.writer.writeMcStartElement('Choice');
        this.writer.attr('Requires', this.data.constants.namespaces[DocxNsType.Wps].prefix);
        this.writer.writeWpStartElement('drawing');
        this.writeFloatingObjectAnchorTextBox(drawingObject, textBoxContent);
        this.writer.endElement();
        this.writer.endElement();
        this.writer.endElement();
    }
    writeFloatingObjectTxbxContent(content) {
        this.writer.writeWpStartElement('txbxContent');
        const contentExporter = this.data.createTextBoxExporter(content);
        contentExporter.exportTextBoxContent();
        this.writer.endElement();
    }
    writeFloatingObjectAnchor(drawingObject, modelImageId) {
        this.writer.writeWpDrawingStartElement(drawingObject.isFloatingObject ? 'anchor' : 'inline');
        const id = this.data.drawingElementId;
        this.data.drawingElementId++;
        this.exportFloatingObjectProperties(drawingObject, id);
        this.writeFloatingObjectPictureContent(modelImageId, drawingObject, id);
        if (drawingObject.isFloatingObject) {
            this.writeFloatingObjectPercentWidth(drawingObject);
            this.writeFloatingObjectPercentHeight(drawingObject);
        }
        this.writer.endElement();
    }
    writeFloatingObjectAnchorTextBox(drawingObject, textBoxContent) {
        this.writer.writeWpDrawingStartElement('anchor');
        const id = this.data.drawingElementId;
        this.data.drawingElementId++;
        this.exportFloatingObjectProperties(drawingObject, id);
        this.writeFloatingObjectTextBoxContent(textBoxContent, drawingObject);
        if (drawingObject.isFloatingObject) {
            this.writeFloatingObjectPercentWidth(drawingObject);
            this.writeFloatingObjectPercentHeight(drawingObject);
        }
        this.writer.endElement();
    }
    writeFloatingObjectTextBoxContent(content, drawingObject) {
        this.writer.writeDrawingStartElement('graphic');
        this.writeFloatingTextObjectGraphicData(content, drawingObject);
        this.writer.endElement();
    }
    writeFloatingObjectPictureContent(modelImageId, drawingObject, id) {
        this.writer.writeDrawingStartElement('graphic');
        this.writeFloatingObjectGraphicData(modelImageId, drawingObject, id);
        this.writer.endElement();
    }
    writeFloatingObjectPic(modelImageId, drawingObject, id) {
        this.writer.writePicDrawingStartElement('pic');
        this.writeFloatingObjectNvPicPr(drawingObject.nonVisualDrawingObjectProperties, id);
        this.writeFloatingObjectBlipFill(modelImageId, drawingObject);
        this.writeFloatingObjectPicSpPr(drawingObject);
        this.writer.endElement();
    }
    writeFloatingObjectNvPicPr(nonVisualProperties, id) {
        this.writer.writePicDrawingStartElement('nvPicPr');
        this.writeFloatingObjectCNvPr(nonVisualProperties, id);
        this.writeFloatingObjectCNvPicPr();
        this.writer.endElement();
    }
    writeFloatingObjectCNvPr(nonVisualProperties, id) {
        this.writer.writePicDrawingStartElement('cNvPr');
        this.writer.writeIntValue('id', id);
        this.writer.attr('name', nonVisualProperties && !StringUtils.isNullOrEmpty(nonVisualProperties.name) ?
            nonVisualProperties.name : 'Picture ' + id);
        this.writer.endElement();
    }
    writeFloatingObjectCNvPicPr() {
        this.writer.writePicDrawingStartElement('cNvPicPr');
        this.writer.endElement();
    }
    writeFloatingObjectWpsSpPr(drawingObject) {
        this.writer.writeWpsStartElement('spPr');
        this.writeFloatingObjectSpPr(drawingObject);
        this.writer.endElement();
    }
    writeFloatingObjectPicSpPr(drawingObject) {
        this.writer.writePicDrawingStartElement('spPr');
        this.writeFloatingObjectSpPr(drawingObject);
        this.writer.endElement();
    }
    writeFloatingObjectBlipFill(modelImageId, drawingObject) {
        this.writer.writePicDrawingStartElement('blipFill');
        this.writeFloatingObjectBlip(modelImageId);
        this.writeFloatingObjectSourceRect(drawingObject);
        this.writeFloatingObjectStretchAndSourceRect(drawingObject);
        this.writer.endElement();
    }
    writeFloatingObjectBlip(modelImageId) {
        const cache = this.data.model.cache.imageCache.getPictureData(modelImageId);
        const exporter = new ImageExporter(this.data);
        const imageRelationId = cache.isLoaded ? exporter.exportImageData(modelImageId, cache.base64) : exporter.exportImageUrl(modelImageId, cache.imageUrl);
        this.writer.writeDrawingStartElement('blip');
        this.writer.attrNS(DocxNsType.Rels, cache.isLoaded ? 'embed' : 'link', imageRelationId);
        this.writer.endElement();
    }
    writeFloatingObjectSourceRect(drawingObject) {
        const sourceRect = drawingObject.sourceRect;
        if (sourceRect.isEmpty())
            return;
        this.writer.writeDrawingStartElement('srcRect');
        this.writer.writeIntValue('l', sourceRect.left);
        this.writer.writeIntValue('t', sourceRect.top);
        this.writer.writeIntValue('r', sourceRect.right);
        this.writer.writeIntValue('b', sourceRect.bottom);
        this.writer.endElement();
    }
    writeFloatingObjectStretchAndSourceRect(drawingObject) {
        this.writer.writeDrawingStartElement('stretch');
        if (drawingObject.sourceRect.isEmpty()) {
            this.writer.writeDrawingStartElement('fillRect');
            this.writer.endElement();
        }
        this.writer.endElement();
    }
    writeFloatingObjectPrstGeom() {
        this.writer.writeDrawingStartElement('prstGeom');
        this.writer.attr('prst', 'rect');
        this.writer.endElement();
    }
    writeFloatingObjectSpPr(drawingObject) {
        this.writeFloatingObjectXfrm(drawingObject);
        this.writeFloatingObjectPrstGeom();
        if (drawingObject.shape) {
            if (drawingObject.shape.fillColor)
                this.writeFloatingObjectSolidFill(drawingObject.shape.fillColor);
            if (drawingObject.shape.outlineColor)
                this.writeFloatingObjectLn(drawingObject.shape);
        }
        const inlineObject = drawingObject instanceof InlineDrawingObject ? drawingObject : null;
        if (inlineObject != null)
            this.writeFloatingObjectSolidFill(inlineObject.fillColor);
    }
    writeFloatingObjectLn(shape) {
        this.writer.writeDrawingStartElement('ln');
        if (shape.outlineWidth)
            this.writer.writeIntValue('w', UnitConverter.twipsToEmu(shape.outlineWidth));
        this.writeFloatingObjectSolidFill(shape.outlineColor);
        this.writer.endElement();
    }
    writeFloatingObjectSolidFill(color) {
        if (DXColor.isTransparentOrEmptyorNoColor(color)) {
            this.writer.writeDrawingStartElement('noFill');
            this.writer.endElement();
        }
        else {
            this.writer.writeDrawingStartElement('solidFill');
            this.writeFloatingObjectSrgbClr(color);
            this.writer.endElement();
        }
    }
    writeFloatingObjectSrgbClr(color) {
        this.writer.writeDrawingStartElement('srgbClr');
        this.writer.attr('val', ColorUtils.colorToHash(color).substr(1));
        if (ColorUtils.getAlpha(color) != 255) {
            this.writer.writeDrawingStartElement('alpha');
            const alpha = Math.round(ColorUtils.getAlpha(color) / Constants.MAX_BYTE * 100) * 1000;
            this.writer.writeIntValue('val', alpha);
            this.writer.endElement();
        }
        this.writer.endElement();
    }
    writeFloatingObjectXfrm(run) {
        this.writer.writeDrawingStartElement('xfrm');
        if (run.shape && run.useRotation)
            this.writer.writeIntValue('rot', run.rotation);
        this.writeFloatingObjectOff();
        this.writeFloatingObjectExt(run);
        this.writer.endElement();
    }
    writeFloatingObjectGraphicData(modelImageId, run, id) {
        this.writer.writeDrawingStartElement('graphicData');
        this.writer.attr('uri', this.data.constants.namespaces[DocxNsType.DrawingMLPicture].namespace);
        this.writeFloatingObjectPic(modelImageId, run, id);
        this.writer.endElement();
    }
    writeFloatingTextObjectGraphicData(content, drawingObject) {
        this.writer.writeDrawingStartElement('graphicData');
        this.writer.attr('uri', this.data.constants.namespaces[DocxNsType.Wps].namespace);
        this.writeFloatingObjectWsp(content, drawingObject);
        this.writer.endElement();
    }
    writeFloatingObjectWsp(content, drawingObject) {
        this.writer.writeWpsStartElement('wsp');
        this.writer.writeWpsStartElement('cNvSpPr');
        this.writer.endElement();
        this.writeFloatingObjectWpsSpPr(drawingObject);
        this.writeFloatingObjectTxbx(content);
        this.writeFloatingObjectBodyPr(drawingObject.textBoxProperties);
        this.writer.endElement();
    }
    writeFloatingObjectTxbx(content) {
        this.writer.writeWpsStartElement('txbx');
        this.writeFloatingObjectTxbxContent(content);
        this.writer.endElement();
    }
    writeFloatingObjectBodyPr(properties) {
        this.writer.writeWpsStartElement('bodyPr');
        this.writer.attr('wrap', properties.wrapText ? 'square' : 'none');
        if (properties.leftMargin >= 0)
            this.writer.writeIntValue('lIns', UnitConverter.twipsToEmu(properties.leftMargin));
        if (properties.topMargin >= 0)
            this.writer.writeIntValue('tIns', UnitConverter.twipsToEmu(properties.topMargin));
        if (properties.rightMargin >= 0)
            this.writer.writeIntValue('rIns', UnitConverter.twipsToEmu(properties.rightMargin));
        if (properties.bottomMargin >= 0)
            this.writer.writeIntValue('bIns', UnitConverter.twipsToEmu(properties.bottomMargin));
        if (properties.verticalAlignment != null)
            this.writer.attr('anchor', this.convertTextBoxVerticalAlignment(properties.verticalAlignment));
        if (properties.upright)
            this.writer.writeBoolValue('upright', properties.upright);
        if (properties.resizeShapeToFitText != null) {
            if (properties.resizeShapeToFitText)
                this.writer.writeDrawingStartElement('spAutoFit');
            else
                this.writer.writeDrawingStartElement('noAutofit');
            this.writer.endElement();
        }
        this.writer.endElement();
    }
    convertTextBoxVerticalAlignment(value) {
        return WriterHelper.getValueFromTables(TranslationTables.drawingTextAnchoringType, value, DrawingTextAnchoringType.Top);
    }
    writeFloatingObjectOff() {
        this.writer.writeDrawingStartElement('off');
        this.writer.writeIntValue('x', 0);
        this.writer.writeIntValue('y', 0);
        this.writer.endElement();
    }
    writeFloatingObjectExt(run) {
        this.writer.writeDrawingStartElement('ext');
        this.writer.writeIntValue('cx', UnitConverter.twipsToEmu(Math.max(0, run.actualSize.width)));
        this.writer.writeIntValue('cy', UnitConverter.twipsToEmu(Math.max(0, run.actualSize.height)));
        this.writer.endElement();
    }
    writeFloatingObjectPercentWidth(run) {
        if (run.useRelativeWidth) {
            this.writer.writeWp14DrawingStartElement('sizeRelH');
            this.writer.attr('relativeFrom', WriterHelper.getValueFromTables(TranslationTables.floatingObjectRelativeFromHorizontalTable, run.relativeWidthType, RelativeWidthType.Page));
            this.writer.writeWp14DrawingStartElement('pctWidth');
            this.writer.writeString(run.relativeSize.width.toString());
            this.writer.endElement();
            this.writer.endElement();
        }
    }
    writeFloatingObjectPercentHeight(run) {
        if (run.useRelativeHeight) {
            this.writer.writeWp14DrawingStartElement('sizeRelV');
            this.writer.attr('relativeFrom', WriterHelper.getValueFromTables(TranslationTables.floatingObjectRelativeFromVerticalTable, run.relativeHeightType, RelativeHeightType.Page));
            this.writer.writeWp14DrawingStartElement('pctHeight');
            this.writer.writeString(run.relativeSize.height.toString());
            this.writer.endElement();
            this.writer.endElement();
        }
    }
    exportFloatingObjectProperties(drawingObject, id) {
        if (drawingObject.isFloatingObject) {
            this.writer.writeIntValue('simplePos', 0);
            this.writer.writeBoolValue('allowOverlap', drawingObject.allowOverlap);
            this.writer.writeBoolValue('behindDoc', drawingObject.isBehindDoc);
            this.writer.writeBoolValue('layoutInCell', drawingObject.layoutInTableCell);
            this.writer.writeBoolValue('locked', drawingObject.locked);
            this.writer.writeIntValue('relativeHeight', Math.max(0, drawingObject.zOrder));
            if (drawingObject.useBottomDistance && drawingObject.bottomDistance >= 0)
                this.writer.writeIntValue('distB', UnitConverter.twipsToEmu(drawingObject.bottomDistance));
            if (drawingObject.useLeftDistance && drawingObject.leftDistance >= 0)
                this.writer.writeIntValue('distL', UnitConverter.twipsToEmu(drawingObject.leftDistance));
            if (drawingObject.useRightDistance && drawingObject.rightDistance >= 0)
                this.writer.writeIntValue('distR', UnitConverter.twipsToEmu(drawingObject.rightDistance));
            if (drawingObject.useTopDistance && drawingObject.topDistance >= 0)
                this.writer.writeIntValue('distT', UnitConverter.twipsToEmu(drawingObject.topDistance));
            if (drawingObject.useHidden)
                this.writer.writeBoolValue('hidden', drawingObject.hidden);
            this.writeFloatingObjectSimplePosition();
            if (drawingObject.horizontalPositionAlignment == AnchorObjectHorizontalPositionAlignment.None &&
                drawingObject.usePercentOffset && drawingObject.percentOffset.x != 0)
                this.writeFloatingObjectPercentPositionH2010(drawingObject);
            else
                this.writeFloatingObjectPositionH(drawingObject);
            if (drawingObject.verticalPositionAlignment == AnchorObjectVerticalPositionAlignment.None &&
                drawingObject.usePercentOffset && drawingObject.percentOffset.y != 0)
                this.writeFloatingObjectPercentPositionV2010(drawingObject);
            else
                this.writeFloatingObjectPositionV(drawingObject);
        }
        this.writeFloatingObjectExtent(drawingObject);
        this.writeFloatingObjectEffectExtent(drawingObject);
        if (drawingObject.isFloatingObject)
            this.writeFloatingObjectWrap(drawingObject);
        this.writeFloatingObjectDocPr(drawingObject, id);
        this.writeFloatingObjectCNvGraphicFramePr(drawingObject);
    }
    writeFloatingObjectPositionV(drawingObject) {
        this.writeFloatingObjectPositionVCore(drawingObject, this.writeFloatingObjectVerticalOffset);
    }
    writeFloatingObjectPositionVCore(drawingObject, writeVerticalOffsetAction) {
        this.writer.writeWpDrawingStartElement('positionV');
        this.writer.attr('relativeFrom', WriterHelper.getValueFromTables(TranslationTables.floatingObjectVerticalPositionTypeTable, drawingObject.verticalPositionType, AnchorObjectVerticalPositionType.Page));
        if (drawingObject.verticalPositionAlignment != AnchorObjectVerticalPositionAlignment.None)
            this.writeFloatingObjectVerticalPositionAlignment(drawingObject);
        else
            writeVerticalOffsetAction.call(this, drawingObject);
        this.writer.endElement();
    }
    writeFloatingObjectVerticalOffset(drawingObject) {
        this.writer.writeWpDrawingStartElement('posOffset');
        this.writer.writeString(UnitConverter.twipsToEmu(drawingObject.offset.y).toString());
        this.writer.endElement();
    }
    writeFloatingObjectVerticalPositionAlignment(drawingObject) {
        this.writer.writeWpDrawingStartElement('align');
        this.writer.writeString(WriterHelper.getValueFromTablesExplicitDefault(TranslationTables.floatingObjectVerticalPositionAlignmentTable, drawingObject.verticalPositionAlignment, ''));
        this.writer.endElement();
    }
    writeFloatingObjectPercentPositionH2010(drawingObject) {
        this.writer.writeMcStartElement('AlternateContent');
        this.writer.writeMcStartElement('Choice');
        this.writer.attr('Requires', this.data.constants.namespaces[DocxNsType.Wp14].prefix);
        this.writeFloatingObjectPositionHCore(drawingObject, this.writeFloatingObjectPercentHorizontalOffset);
        this.writer.endElement();
        this.writer.writeMcStartElement('Fallback');
        this.writeFloatingObjectPositionH(drawingObject);
        this.writer.endElement();
        this.writer.endElement();
    }
    writeFloatingObjectPercentPositionV2010(drawingObject) {
        this.writer.writeMcStartElement('AlternateContent');
        this.writer.writeMcStartElement('Choice');
        this.writer.attr('Requires', this.data.constants.namespaces[DocxNsType.Wp14].prefix);
        this.writeFloatingObjectPositionVCore(drawingObject, this.writeFloatingObjectPercentVerticalOffset);
        this.writer.endElement();
        this.writer.writeMcStartElement('Fallback');
        this.writeFloatingObjectPositionV(drawingObject);
        this.writer.endElement();
        this.writer.endElement();
    }
    writeFloatingObjectPercentVerticalOffset(drawingObject) {
        this.writer.writeWp14DrawingStartElement('pctPosVOffset');
        this.writer.writeString(drawingObject.percentOffset.y.toString());
        this.writer.endElement();
    }
    writeFloatingObjectPercentHorizontalOffset(drawingObject) {
        this.writer.writeWp14DrawingStartElement('pctPosHOffset');
        this.writer.writeString(drawingObject.percentOffset.x.toString());
        this.writer.endElement();
    }
    writeFloatingObjectPositionH(drawingObject) {
        this.writeFloatingObjectPositionHCore(drawingObject, this.writeFloatingObjectHorizontalOffset);
    }
    writeFloatingObjectPositionHCore(drawingObject, writeHorizontalOffsetAction) {
        this.writer.writeWpDrawingStartElement('positionH');
        this.writer.attr('relativeFrom', WriterHelper.getValueFromTables(TranslationTables.floatingObjectHorizontalPositionTypeTable, drawingObject.horizontalPositionType, AnchorObjectHorizontalPositionType.Page));
        if (drawingObject.horizontalPositionAlignment != AnchorObjectHorizontalPositionAlignment.None)
            this.writeFloatingObjectHorizontalPositionAlignment(drawingObject);
        else
            writeHorizontalOffsetAction.call(this, drawingObject);
        this.writer.endElement();
    }
    writeFloatingObjectHorizontalOffset(drawingObject) {
        this.writer.writeWpDrawingStartElement('posOffset');
        this.writer.writeString(UnitConverter.twipsToEmu(drawingObject.offset.x).toString());
        this.writer.endElement();
    }
    writeFloatingObjectHorizontalPositionAlignment(drawingObject) {
        this.writer.writeWpDrawingStartElement('align');
        this.writer.writeString(WriterHelper.getValueFromTablesExplicitDefault(TranslationTables.floatingObjectHorizontalPositionAlignmentTable, drawingObject.horizontalPositionAlignment, ''));
        this.writer.endElement();
    }
    writeFloatingObjectSimplePosition() {
        this.writer.writeWpDrawingStartElement('simplePos');
        this.writer.writeIntValue('x', 0);
        this.writer.writeIntValue('y', 0);
        this.writer.endElement();
    }
    writeFloatingObjectExtent(drawingObject) {
        this.writer.writeWpDrawingStartElement('extent');
        this.writer.writeIntValue('cx', UnitConverter.twipsToEmu(Math.max(0, drawingObject.actualSize.width)));
        this.writer.writeIntValue('cy', UnitConverter.twipsToEmu(Math.max(drawingObject.actualSize.height, 0)));
        this.writer.endElement();
    }
    writeFloatingObjectEffectExtent(run) {
        if (!run.useRotation)
            return;
        this.writer.writeWpDrawingStartElement('effectExtent');
        const effectExtent = new EffectExtent(UnitConverter.twipsToEmu(run.actualSize.width), UnitConverter.twipsToEmu(run.actualSize.height), run.rotation);
        effectExtent.calculate();
        this.writer.writeIntValue('l', effectExtent.horizontalIndent);
        this.writer.writeIntValue('t', effectExtent.verticalIndent);
        this.writer.writeIntValue('r', effectExtent.horizontalIndent);
        this.writer.writeIntValue('b', effectExtent.verticalIndent);
        this.writer.endElement();
    }
    writeFloatingObjectWrap(run) {
        const textWrapType = TranslationTables.floatingObjectTextWrapTypeTable.exportMap[run.textWrapType];
        if (textWrapType !== undefined) {
            this.writeWpDrawingElement(run, textWrapType.mlValue.openXmlValue, EnumUtils.isAnyOf(run.textWrapType, AnchorObjectTextWrapType.Square, AnchorObjectTextWrapType.Through, AnchorObjectTextWrapType.Tight));
        }
    }
    writeWpDrawingElement(run, elementName, useTextWrapSide) {
        this.writer.writeWpDrawingStartElement(elementName);
        if (useTextWrapSide)
            this.writer.attr('wrapText', WriterHelper.getValueFromTables(TranslationTables.floatingObjectTextWrapSideTable, run.textWrapSide, AnchorObjectTextWrapSide.Both));
        this.writeWpWrapPolygonElement(run);
        this.writer.endElement();
    }
    writeWpWrapPolygonElement(run) {
        if (run.textWrapType != AnchorObjectTextWrapType.Through && run.textWrapType != AnchorObjectTextWrapType.Tight)
            return;
        this.writer.writeWpDrawingStartElement('wrapPolygon');
        this.writeWpDrawingStart();
        this.writeWpLineToDrawingElement(0, 21600);
        this.writeWpLineToDrawingElement(21600, 21600);
        this.writeWpLineToDrawingElement(21600, 0);
        this.writeWpLineToDrawingElement(0, 0);
        this.writer.endElement();
    }
    writeWpDrawingStart() {
        this.writer.writeWpDrawingStartElement('start');
        this.writer.writeIntValue('x', 0);
        this.writer.writeIntValue('y', 0);
        this.writer.endElement();
    }
    writeWpLineToDrawingElement(x, y) {
        this.writer.writeWpDrawingStartElement('lineTo');
        this.writer.writeIntValue('x', x);
        this.writer.writeIntValue('y', y);
        this.writer.endElement();
    }
    writeFloatingObjectCNvGraphicFramePr(run) {
        this.writer.writeWpDrawingStartElement('cNvGraphicFramePr');
        this.writeFloatingObjectGraphicFrameLocks(run);
        this.writer.endElement();
    }
    writeFloatingObjectGraphicFrameLocks(run) {
        this.writer.writeDrawingStartElement('graphicFrameLocks');
        if (run.lockAspectRatio) {
            this.writer.writeBoolValue('noChangeAspect', run.lockAspectRatio);
        }
        this.writer.endElement();
    }
    writeFloatingObjectDocPr(drawingObject, id) {
        this.writeElementDocPrCore(drawingObject, id);
    }
    writeElementDocPrCore(drawingObject, id) {
        const name = !StringUtils.isNullOrEmpty(drawingObject.containerProperties.name) ? drawingObject.containerProperties.name :
            (drawingObject.isTextBox ? `Text Box ${id.toString()}` : `Picture ${id.toString()}`);
        const hyperlinkInfo = drawingObject.hyperlinkInfo;
        this.writer.writeWpDrawingStartElement('docPr');
        this.writer.writeIntValue('id', id);
        if (!StringUtils.isNullOrEmpty(name))
            this.writer.attr('name', name);
        if (!StringUtils.isNullOrEmpty(drawingObject.containerProperties.description))
            this.writer.attr('descr', drawingObject.containerProperties.description);
        if (!StringUtils.isNullOrEmpty(drawingObject.containerProperties.title))
            this.writer.attr("title", drawingObject.containerProperties.title);
        if (hyperlinkInfo != null)
            this.writeHyperlinkClick(hyperlinkInfo);
        this.writer.endElement();
    }
    writeHyperlinkClick(hyperlinkInfo) {
        this.writer.writeDrawingStartElement('hlinkClick');
        let target = hyperlinkInfo.uri;
        if (!StringUtils.isNullOrEmpty(hyperlinkInfo.anchor))
            target += '#' + hyperlinkInfo.anchor;
        if (!StringUtils.isNullOrEmpty(target)) {
            const relId = this.data.idGenerator.calcDocumentRelationId();
            this.data.subDocumentExporter.hyperlinkRelationsTable[relId] = target;
            this.writer.attrNS(DocxNsType.Rels, 'id', relId);
        }
        if (!StringUtils.isNullOrEmpty(hyperlinkInfo.anchor))
            this.writer.attr('tgtFrame', hyperlinkInfo.anchor);
        if (!StringUtils.isNullOrEmpty(hyperlinkInfo.tip))
            this.writer.attr('tooltip', hyperlinkInfo.tip);
        this.writer.endElement();
    }
}
class EffectExtent {
    constructor(width, height, rotation) {
        this.width = width;
        this.height = height;
        this.rotation = rotation;
    }
    calculate() {
        const angle = UnitConverter.twipsToDegree(this.rotation) * Math.PI / 180;
        const xCoordinateA = Math.floor(this.width / 2);
        const yCoordinateA = Math.floor(this.height / 2);
        const newXCoordinateA = Math.floor(xCoordinateA * Math.cos(angle) - yCoordinateA * Math.sin(angle));
        const newYCoordinateA = Math.floor(xCoordinateA * Math.sin(angle) + yCoordinateA * Math.cos(angle));
        const xCoordinateB = xCoordinateA;
        const yCoordinateB = -yCoordinateA;
        const newXCoordinateB = Math.floor(xCoordinateB * Math.cos(angle) - yCoordinateB * Math.sin(angle));
        const newYCoordinateB = Math.floor(xCoordinateB * Math.sin(angle) + yCoordinateB * Math.cos(angle));
        if (Math.abs(newXCoordinateA) > Math.abs(newXCoordinateB)) {
            this.horizontalIndent = Math.abs(Math.abs(newXCoordinateA) - Math.abs(xCoordinateA));
            this.verticalIndent = Math.abs(Math.abs(newYCoordinateB) - Math.abs(yCoordinateB));
        }
        else {
            this.horizontalIndent = Math.abs(Math.abs(newXCoordinateB) - Math.abs(xCoordinateB));
            this.verticalIndent = Math.abs(Math.abs(newYCoordinateA) - Math.abs(yCoordinateA));
        }
        if ((UnitConverter.twipsToDegree(this.rotation) - 90) % 180 == 0)
            this.horizontalIndent = 0;
    }
}
