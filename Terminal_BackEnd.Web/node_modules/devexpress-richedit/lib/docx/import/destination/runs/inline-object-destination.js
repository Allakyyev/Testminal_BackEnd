import { MapCreator } from '../../../../base-utils/map-creator';
import { FormatImagesImporterData } from '../../../../core/formats/utils/images-import';
import { AnchorObjectHorizontalPositionAlignment, AnchorObjectHorizontalPositionType, AnchorObjectVerticalPositionAlignment, AnchorObjectVerticalPositionType, DrawingTextAnchoringType } from '../../../../core/model/floating-objects/enums';
import { InlinePictureInfo } from '../../../../core/model/manipulators/picture-manipulator/insert-picture-manipulator-params';
import { ImageLoadingOptions } from '../../../../core/model/manipulators/picture-manipulator/loader/image-loading-options';
import { RichUtils } from '../../../../core/model/rich-utils';
import { InlinePictureRun } from '../../../../core/model/runs/inline-picture-run';
import { SubDocumentPosition } from '../../../../core/model/sub-document';
import { Errors } from '@devexpress/utils/lib/errors';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
import { TranslationTables } from '../../../translation-table/translation-tables';
import { InlinePictureCssParser } from '../../css-engine/inline-picture-css-parser';
import { FloatingObjectImportInfo, ShapeType } from '../../model/floating-object-import-info';
import { ElementDestination } from '../destination';
import { VMLShapeDestination } from '../vml/v-mlshape-destination';
export class InlineObjectDestination extends ElementDestination {
    constructor(data) {
        super(data);
        this.floatingObjectImportInfo = new FloatingObjectImportInfo(this.data);
    }
    get elementHandlerTable() {
        return InlineObjectDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    processElementClose(_reader) {
        if (this.floatingObjectImportInfo.shapeType == ShapeType.TextBox && this.floatingObjectImportInfo.subDocId >= 0) {
            this.floatingObjectImportInfo.isFloatingObject = true;
            this.importFloatingObject(this.getCssParser(new Size(0, 0)));
            this.floatingObjectImportInfo.insertFloatingObject(this.documentModel.cache.imageCache);
        }
        else {
            if (this.floatingObjectImportInfo.imageId === null)
                return;
            const cssParser = this.getCssParser(new Size(0, 0));
            let imageRun;
            this.importFloatingObject(this.getCssParser(new Size(0, 0)));
            if (cssParser.position != 'absolute') {
                const cacheInfo = this.documentModel.cache.imageCache.getPictureData(this.floatingObjectImportInfo.imageId);
                if (!cacheInfo)
                    throw new Error(Errors.InternalException);
                const pos = this.data.subDocumentInfo.positionImporter.currPosition;
                imageRun = new InlinePictureRun(pos, this.data.subDocumentInfo.paragraphImporter.paragraph, this.data.subDocumentInfo.characterImporter.charPropsBundle, InlinePictureInfo.defaultInfo(cacheInfo));
                this.data.subDocumentInfo.characterImporter.addRun(imageRun, RichUtils.specialCharacters.ObjectMark);
                this.data.formatImagesImporter.registerImageRun(new FormatImagesImporterData(new SubDocumentPosition(this.data.subDocument, pos), ImageLoadingOptions.initByActualSize(this.floatingObjectImportInfo.size.absoluteSize), imageRun));
                imageRun.info.containerProperties.copyFrom(this.floatingObjectImportInfo.constainerProperties);
                imageRun.info.nonVisualDrawingProperties.copyFrom(this.floatingObjectImportInfo.objectNonVisualProperties);
            }
            else {
                this.floatingObjectImportInfo.isFloatingObject = true;
                imageRun = this.floatingObjectImportInfo.insertFloatingObject(this.documentModel.cache.imageCache);
            }
        }
    }
    getCssParser(size) {
        const cssParser = new InlinePictureCssParser(this.data.documentModel, this.data.readerHelper, size);
        try {
            cssParser.parseAttribute(this.style);
        }
        catch (_a) { }
        return cssParser;
    }
    importFloatingObject(cssParser) {
        this.floatingObjectImportInfo.anchorInfo.zOrder = cssParser.zOrder;
        this.floatingObjectImportInfo.size.absoluteSize = new Size(cssParser.size.width, cssParser.size.height);
        this.floatingObjectImportInfo.anchorInfo.topDistance = cssParser.topDistance;
        this.floatingObjectImportInfo.anchorInfo.bottomDistance = cssParser.bottomDistance;
        this.floatingObjectImportInfo.anchorInfo.leftDistance = cssParser.leftDistance;
        this.floatingObjectImportInfo.anchorInfo.rightDistance = cssParser.rightDistance;
        this.floatingObjectImportInfo.anchorInfo.offset = cssParser.offset;
        this.floatingObjectImportInfo.anchorInfo.hidden = !!cssParser.hidden;
        if (cssParser.horizontalPositionAlignment != undefined &&
            cssParser.horizontalPositionAlignment != AnchorObjectHorizontalPositionAlignment.None)
            this.floatingObjectImportInfo.anchorInfo.horizontalPositionAlignment = cssParser.horizontalPositionAlignment;
        if (cssParser.verticalPositionAlignment != undefined && cssParser.verticalPositionAlignment != AnchorObjectVerticalPositionAlignment.None)
            this.floatingObjectImportInfo.anchorInfo.verticalPositionAlignment = cssParser.verticalPositionAlignment;
        if (cssParser.useRelativeWidth) {
            this.floatingObjectImportInfo.size.relativeSize.width = cssParser.widthPercent;
            this.floatingObjectImportInfo.size.relativeWidthType = cssParser.fromWidth;
        }
        if (cssParser.useRelativeHeight) {
            this.floatingObjectImportInfo.size.relativeSize.height = cssParser.heightPercent;
            this.floatingObjectImportInfo.size.relativeHeightType = cssParser.fromHeight;
        }
        if (cssParser.horizontalPositionType)
            this.floatingObjectImportInfo.anchorInfo.horizontalPositionType = this.convertToHorizontalPositionType(cssParser.horizontalPositionType);
        if (cssParser.verticalPositionType)
            this.floatingObjectImportInfo.anchorInfo.verticalPositionType = this.convertToVerticalPositionType(cssParser.verticalPositionType);
        if (cssParser.textBoxVerticalAlignment && cssParser.textBoxVerticalAlignment != DrawingTextAnchoringType.Top)
            this.floatingObjectImportInfo.textBoxProperties.verticalAlignment = cssParser.textBoxVerticalAlignment;
        if (cssParser.useWrapText)
            this.floatingObjectImportInfo.textBoxProperties.wrapText = cssParser.wrapText;
        if (cssParser.useRotation)
            this.floatingObjectImportInfo.size.rotation = cssParser.rotation;
    }
    convertToHorizontalPositionType(value) {
        const result = StringMapUtils.elementBy(TranslationTables.horizontalPositionTypeAttributeTable.importMap, (elem) => elem.mlValue.openXmlValue == value);
        return result === null ? AnchorObjectHorizontalPositionType.Column : result.modelValue;
    }
    convertToVerticalPositionType(value) {
        const result = StringMapUtils.elementBy(TranslationTables.verticalPositionTypeAttributeTable.importMap, (elem) => elem.mlValue.openXmlValue == value);
        return result === null ? AnchorObjectVerticalPositionType.Paragraph : result.modelValue;
    }
}
InlineObjectDestination.handlerTable = new MapCreator()
    .add('shape', (data) => new VMLShapeDestination(data, InlineObjectDestination.getThis(data)))
    .add('rect', (data) => new VMLShapeDestination(data, InlineObjectDestination.getThis(data)))
    .get();
