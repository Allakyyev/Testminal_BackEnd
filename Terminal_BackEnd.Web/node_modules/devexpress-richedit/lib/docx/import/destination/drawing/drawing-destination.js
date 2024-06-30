import { __awaiter } from "tslib";
import { MapCreator } from '../../../../base-utils/map-creator';
import { FormatImagesImporterData } from '../../../../core/formats/utils/images-import';
import { SubDocumentInfoType } from '../../../../core/model/enums';
import { HyperlinkInfo } from '../../../../core/model/fields/field';
import { AnchorObjectHorizontalPositionAlignment, AnchorObjectHorizontalPositionType, AnchorObjectVerticalPositionAlignment, AnchorObjectVerticalPositionType } from '../../../../core/model/floating-objects/enums';
import { InlinePictureInfo } from '../../../../core/model/manipulators/picture-manipulator/insert-picture-manipulator-params';
import { ImageLoadingOptions } from '../../../../core/model/manipulators/picture-manipulator/loader/image-loading-options';
import { RichUtils } from '../../../../core/model/rich-utils';
import { InlinePictureRun } from '../../../../core/model/runs/inline-picture-run';
import { TextRun } from '../../../../core/model/runs/text-run';
import { SubDocumentPosition } from '../../../../core/model/sub-document';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Constants } from '@devexpress/utils/lib/constants';
import { Point } from '@devexpress/utils/lib/geometry/point';
import { Comparers } from '@devexpress/utils/lib/utils/comparers';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { TranslationTables } from '../../../translation-table/translation-tables';
import { DocxNsType } from '../../../utils/constants';
import { StringValueParser } from '../../../utils/string-value-parser';
import { UnitsConverter } from '../../../utils/units-converter';
import { FloatingObjectImportInfo, ShapeType } from '../../model/floating-object-import-info';
import { ElementDestination, LeafElementDestination } from '../destination';
import { AltChunkDestination } from '../document/alt-chunk-destination';
import { BodyDestinationBase } from '../document/body-destination-base';
import { ParagraphDestination } from '../paragraph/paragraph-destination';
import { TableDestination } from '../table/table/table-destination';
import { DrawingAnchorHorizontalPositionDestination, DrawingAnchorVerticalPositionDestination } from './drawing-anchor-position-destination';
import { DrawingAnchorHorizontalRelativeSizeDestination, DrawingAnchorVerticalRelativeSizeDestination } from './drawing-anchor-relative-size-destination';
import { DrawingAnchorWrapNoneDestination, DrawingAnchorWrapSquareDestination, DrawingAnchorWrapThroughDestination, DrawingAnchorWrapTightDestination, DrawingAnchorWrapTopAndBottomDestination } from './drawing-anchor-wrap-destination';
import { NonVisualPicturePropertiesDestination } from './non-visual-pucture-properties-destination';
import { WordProcessingShapePropertiesDestination } from './shape-properties-destination';
export class DrawingDestination extends ElementDestination {
    constructor(data) {
        super(data);
        this.floatingObjectImportInfo = new FloatingObjectImportInfo(data);
    }
    get elementHandlerTable() {
        return DrawingDestination.handlerTable;
    }
    get imageId() {
        return this.floatingObjectImportInfo.imageId;
    }
    static onInline(data, _reader) {
        DrawingDestination.getThis(data).floatingObjectImportInfo.isFloatingObject = false;
        return new DrawingInlineDestination(data, DrawingDestination.getThis(data).floatingObjectImportInfo);
    }
    static onAnchor(data, _reader) {
        DrawingDestination.getThis(data).floatingObjectImportInfo.isFloatingObject = true;
        return new DrawingAnchorDestination(data, DrawingDestination.getThis(data).floatingObjectImportInfo);
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    processElementClose(_reader) {
        if (!this.floatingObjectImportInfo.isFloatingObject) {
            if (this.imageId === null)
                return;
            const insertPicture = () => {
                const cacheInfo = this.data.documentModel.cache.imageCache.getPictureData(this.imageId);
                const pos = this.data.subDocumentInfo.positionImporter.currPosition;
                const imageRun = new InlinePictureRun(pos, this.data.subDocumentInfo.paragraphImporter.paragraph, this.data.subDocumentInfo.characterImporter.charPropsBundle, InlinePictureInfo.defaultInfo(cacheInfo));
                this.data.subDocumentInfo.characterImporter.addRun(imageRun, RichUtils.specialCharacters.ObjectMark);
                this.data.formatImagesImporter.registerImageRun(new FormatImagesImporterData(new SubDocumentPosition(this.data.subDocument, pos), ImageLoadingOptions.initByActualSize(this.floatingObjectImportInfo.size.absoluteSize), imageRun));
                imageRun.info.containerProperties.copyFrom(this.floatingObjectImportInfo.constainerProperties);
                imageRun.info.nonVisualDrawingProperties.copyFrom(this.floatingObjectImportInfo.objectNonVisualProperties);
            };
            if (this.floatingObjectImportInfo.hyperlinkInfo) {
                this.data.subDocumentInfo.fieldImporter.insertFullField(() => {
                    const codePos = this.data.subDocumentInfo.positionImporter.currPosition;
                    const code = HyperlinkInfo.getNewCodeText(this.floatingObjectImportInfo.hyperlinkInfo);
                    const codeRun = new TextRun(codePos, code.length, this.data.subDocumentInfo.paragraphImporter.paragraph, this.data.subDocumentInfo.characterImporter.charPropsBundle);
                    this.data.subDocumentInfo.characterImporter.addRunAtPos(codeRun, code, codePos);
                }, () => {
                    insertPicture();
                }, this.floatingObjectImportInfo.hyperlinkInfo);
            }
            else {
                insertPicture();
            }
        }
        else {
            this.floatingObjectImportInfo.insertFloatingObject(this.documentModel.cache.imageCache);
        }
    }
}
DrawingDestination.handlerTable = new MapCreator()
    .add('inline', DrawingDestination.onInline)
    .add('anchor', DrawingDestination.onAnchor)
    .get();
export class DrawingInlineDestination extends ElementDestination {
    constructor(data, floatingObjectImportInfo) {
        super(data);
        this.floatingObjectImportInfo = floatingObjectImportInfo;
    }
    get elementHandlerTable() {
        return DrawingInlineDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    static onExtent(data, _reader) {
        return new DrawingInlineExtentDestination(data, DrawingInlineDestination.getThis(data).floatingObjectImportInfo);
    }
    static onGraphic(data, _reader) {
        return new DrawingInlineGraphicDestination(data, DrawingInlineDestination.getThis(data).floatingObjectImportInfo);
    }
    static onDocumentProperties(data, _reader) {
        const floatingObjectImportInfo = DrawingInlineDestination.getThis(data).floatingObjectImportInfo;
        return new DrawingAnchorDocumentPropertiesDestination(data, floatingObjectImportInfo, floatingObjectImportInfo.constainerProperties);
    }
    static onCNvGraphicFramePr(data, _reader) {
        return new DrawingGraphicFramePropertyDestination(data, DrawingInlineDestination.getThis(data));
    }
}
DrawingInlineDestination.handlerTable = new MapCreator()
    .add('extent', DrawingInlineDestination.onExtent)
    .add('graphic', DrawingInlineDestination.onGraphic)
    .add('docPr', DrawingInlineDestination.onDocumentProperties)
    .add('cNvGraphicFramePr', DrawingInlineDestination.onCNvGraphicFramePr)
    .get();
export class DrawingAnchorDestination extends ElementDestination {
    constructor(data, floatingObjectImportInfo) {
        super(data);
        this.floatingObjectImportInfo = floatingObjectImportInfo;
    }
    get elementHandlerTable() {
        return DrawingAnchorDestination.handlerTable;
    }
    get floatingObject() {
        return this.floatingObjectImportInfo.anchorInfo;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    static onExtent(data, _reader) {
        return new DrawingInlineExtentDestination(data, DrawingAnchorDestination.getThis(data).floatingObjectImportInfo);
    }
    static onGraphic(data, _reader) {
        return new DrawingInlineGraphicDestination(data, DrawingAnchorDestination.getThis(data).floatingObjectImportInfo);
    }
    static onSimplePosition(data, _reader) {
        return new DrawingAnchorSimplePositionDestination(data, DrawingAnchorDestination.getThis(data));
    }
    static onAnchorHorizontalRelativeSize(data, _reader) {
        return new DrawingAnchorHorizontalRelativeSizeDestination(data, DrawingAnchorDestination.getThis(data));
    }
    static onAnchorVerticalRelativeSize(data, _reader) {
        return new DrawingAnchorVerticalRelativeSizeDestination(data, DrawingAnchorDestination.getThis(data));
    }
    static onHorizontalPosition(data, _reader) {
        return new DrawingAnchorHorizontalPositionDestination(data, DrawingAnchorDestination.getThis(data));
    }
    static onVerticalPosition(data, _reader) {
        return new DrawingAnchorVerticalPositionDestination(data, DrawingAnchorDestination.getThis(data));
    }
    static onWrapNone(data, _reader) {
        return new DrawingAnchorWrapNoneDestination(data, DrawingAnchorDestination.getThis(data));
    }
    static onWrapSquare(data, _reader) {
        return new DrawingAnchorWrapSquareDestination(data, DrawingAnchorDestination.getThis(data));
    }
    static onWrapThrough(data, _reader) {
        return new DrawingAnchorWrapThroughDestination(data, DrawingAnchorDestination.getThis(data));
    }
    static onWrapTight(data, _reader) {
        return new DrawingAnchorWrapTightDestination(data, DrawingAnchorDestination.getThis(data));
    }
    static onWrapTopAndBottom(data, _reader) {
        return new DrawingAnchorWrapTopAndBottomDestination(data, DrawingAnchorDestination.getThis(data));
    }
    static onCNvGraphicFramePr(data, _reader) {
        return new DrawingGraphicFramePropertyDestination(data, DrawingAnchorDestination.getThis(data));
    }
    static onAnchorDocumentProperties(data, _reader) {
        const floatingObjectImportInfo = DrawingAnchorDestination.getThis(data).floatingObjectImportInfo;
        return new DrawingAnchorDocumentPropertiesDestination(data, floatingObjectImportInfo, floatingObjectImportInfo.constainerProperties);
    }
    isChoiceNamespaceSupported(requeriesNamespaceUri) {
        if (Comparers.stringIgnoreCase(requeriesNamespaceUri, this.data.constants.namespaces[DocxNsType.Wp14].namespace) == 0)
            return true;
        return super.isChoiceNamespaceSupported(requeriesNamespaceUri);
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = this.floatingObject;
            let value;
            value = this.data.readerHelper.getIntegerValue(reader, 'distT', Number.MIN_VALUE);
            if (value != Number.MIN_VALUE)
                obj.topDistance = this.convertEmuToDocumentUnits(value);
            value = this.data.readerHelper.getIntegerValue(reader, 'distB', Number.MIN_VALUE);
            if (value != Number.MIN_VALUE)
                obj.bottomDistance = this.convertEmuToDocumentUnits(value);
            value = this.data.readerHelper.getIntegerValue(reader, 'distL', Number.MIN_VALUE);
            if (value != Number.MIN_VALUE)
                obj.leftDistance = this.convertEmuToDocumentUnits(value);
            value = this.data.readerHelper.getIntegerValue(reader, 'distR', Number.MIN_VALUE);
            if (value != Number.MIN_VALUE)
                obj.rightDistance = this.convertEmuToDocumentUnits(value);
            value = this.data.readerHelper.getIntegerValue(reader, 'relativeHeight', Number.MIN_VALUE);
            if (value != Number.MIN_VALUE)
                obj.zOrder = Math.max(value, 0);
            this.useSimplePosition = this.data.readerHelper.getOnOffValue(reader, 'simplePos', false);
            obj.allowOverlap = this.data.readerHelper.getOnOffValue(reader, 'allowOverlap', true);
            if (this.data.readerHelper.getOnOffValue(reader, 'behindDoc', false))
                obj.isBehindDoc = true;
            if (this.data.readerHelper.getOnOffValue(reader, 'hidden', false))
                obj.hidden = true;
            if (this.data.readerHelper.getOnOffValue(reader, 'layoutInCell', false))
                obj.layoutTableCell = true;
            if (this.data.readerHelper.getOnOffValue(reader, 'locked', false))
                obj.locked = true;
        });
    }
    convertEmuToDocumentUnits(value) {
        return Math.round(UnitConverter.centimetersToTwipsF(value / 36000.0 / 10));
    }
}
DrawingAnchorDestination.handlerTable = new MapCreator()
    .add('extent', DrawingAnchorDestination.onExtent)
    .add('graphic', DrawingAnchorDestination.onGraphic)
    .add('simplePos', DrawingAnchorDestination.onSimplePosition)
    .add('positionH', DrawingAnchorDestination.onHorizontalPosition)
    .add('positionV', DrawingAnchorDestination.onVerticalPosition)
    .add('wrapNone', DrawingAnchorDestination.onWrapNone)
    .add('wrapSquare', DrawingAnchorDestination.onWrapSquare)
    .add('wrapThrough', DrawingAnchorDestination.onWrapThrough)
    .add('wrapTight', DrawingAnchorDestination.onWrapTight)
    .add('wrapTopAndBottom', DrawingAnchorDestination.onWrapTopAndBottom)
    .add('cNvGraphicFramePr', DrawingAnchorDestination.onCNvGraphicFramePr)
    .add('docPr', DrawingAnchorDestination.onAnchorDocumentProperties)
    .add('sizeRelH', DrawingAnchorDestination.onAnchorHorizontalRelativeSize)
    .add('sizeRelV', DrawingAnchorDestination.onAnchorVerticalRelativeSize)
    .get();
export class DrawingGraphicFramePropertyDestination extends ElementDestination {
    constructor(data, destination) {
        super(data);
        this.size = destination.floatingObjectImportInfo.size;
    }
    get elementHandlerTable() {
        return DrawingGraphicFramePropertyDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    static onGraphicFrameLocks(data, _reader) {
        return new DrawingGraphicFrameLocksDestination(data, DrawingGraphicFramePropertyDestination.getThis(data));
    }
}
DrawingGraphicFramePropertyDestination.handlerTable = new MapCreator()
    .add('graphicFrameLocks', DrawingGraphicFramePropertyDestination.onGraphicFrameLocks)
    .get();
export class DrawingGraphicFrameLocksDestination extends LeafElementDestination {
    constructor(data, anchorDestination) {
        super(data);
        this.size = anchorDestination.size;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = this.size;
            const value = reader.getAttribute('noChangeAspect');
            if (!StringUtils.isNullOrEmpty(value))
                obj.lockAspectRatio = this.data.readerHelper.getOnOffValueBool(value, false);
        });
    }
}
export class DrawingInlineExtentDestination extends LeafElementDestination {
    constructor(data, floatingObjectImportInfo) {
        super(data);
        this.floatingObjectImportInfo = floatingObjectImportInfo;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const cx = reader.getAttribute('cx');
            const cy = reader.getAttribute('cy');
            this.floatingObjectImportInfo.size.setUseAbsoluteHeight(true);
            this.floatingObjectImportInfo.size.setUseAbsoluteWidth(true);
            this.floatingObjectImportInfo.size.absoluteSize.width =
                Math.round(UnitConverter.centimetersToTwips(this.data.readerHelper.getIntegerValueCore(cx, 0) / 36000.0 / 10));
            this.floatingObjectImportInfo.size.absoluteSize.height =
                Math.round(UnitConverter.centimetersToTwips(this.data.readerHelper.getIntegerValueCore(cy, 0) / 36000.0 / 10));
        });
    }
}
export class DrawingAnchorDocumentPropertiesDestination extends ElementDestination {
    constructor(data, floatingObjectImportInfo, nonVisualProperties) {
        super(data);
        this.floatingObjectImportInfo = floatingObjectImportInfo;
        this.nonVisualProperties = nonVisualProperties;
    }
    get elementHandlerTable() {
        return DrawingAnchorDocumentPropertiesDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    static onHyperlinkClick(data, _reader) {
        const hyperlinkInfo = new HyperlinkInfo('', '', '', false);
        DrawingAnchorDocumentPropertiesDestination.getThis(data).floatingObjectImportInfo.hyperlinkInfo = hyperlinkInfo;
        return new HyperlinkClickDestination(data, hyperlinkInfo);
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = reader.getAttribute('name');
            if (!StringUtils.isNullOrEmpty(name))
                this.nonVisualProperties.name = name;
            const id = this.data.readerHelper.getIntegerValue(reader, 'id', Number.MIN_VALUE);
            if (id != Number.MIN_VALUE)
                this.nonVisualProperties.id = id;
            const description = reader.getAttribute('descr');
            if (!StringUtils.isNullOrEmpty(description))
                this.nonVisualProperties.description = description;
            const title = reader.getAttribute('title');
            if (!StringUtils.isNullOrEmpty(title))
                this.nonVisualProperties.title = title;
        });
    }
}
DrawingAnchorDocumentPropertiesDestination.handlerTable = new MapCreator()
    .add('hlinkClick', DrawingAnchorDocumentPropertiesDestination.onHyperlinkClick)
    .get();
export class HyperlinkClickDestination extends LeafElementDestination {
    constructor(data, hyperlinkInfo) {
        super(data);
        this.hyperlinkInfo = hyperlinkInfo;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const tooltip = reader.getAttribute('tooltip');
            if (!StringUtils.isNullOrEmpty(tooltip))
                this.hyperlinkInfo.tip = tooltip;
            const relId = yield reader.getAttributeNS('id', this.data.constants.relsNamespaceConst);
            if (!StringUtils.isNullOrEmpty(relId)) {
                const relation = this.data.relationsStack.last.lookupRelationById(relId);
                if (relation != null) {
                    const target = relation.target;
                    if (relation.targetMode == 'External')
                        this.hyperlinkInfo.uri = target;
                    else {
                        const charIndex = target.indexOf('#');
                        this.hyperlinkInfo.anchor = target.substring(charIndex);
                    }
                }
            }
        });
    }
}
export class DrawingInlineGraphicDestination extends ElementDestination {
    constructor(data, floatingObjectImportInfo) {
        super(data);
        this.floatingObjectImportInfo = floatingObjectImportInfo;
    }
    get elementHandlerTable() {
        return DrawingInlineGraphicDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    static onGraphicData(data, _reader) {
        return new DrawingInlineGraphicDataDestination(data, DrawingInlineGraphicDestination.getThis(data).floatingObjectImportInfo);
    }
}
DrawingInlineGraphicDestination.handlerTable = new MapCreator()
    .add('graphicData', DrawingInlineGraphicDestination.onGraphicData)
    .get();
export class DrawingInlineGraphicDataDestination extends ElementDestination {
    constructor(data, floatingObjectImportInfo) {
        super(data);
        this.floatingObjectImportInfo = floatingObjectImportInfo;
    }
    get elementHandlerTable() {
        return DrawingInlineGraphicDataDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    static onPicture(data, _reader) {
        return new DrawingInlineGraphicDataPictureDestination(data, DrawingInlineGraphicDataDestination.getThis(data).floatingObjectImportInfo);
    }
    static onWordProcessingShape(data, _reader) {
        return new WordProcessingShapeDestination(data, DrawingInlineGraphicDataDestination.getThis(data).floatingObjectImportInfo);
    }
    static onDrawingGroupShape(data, _reader) {
        return new DrawingGroupShapeDestination(data, DrawingInlineGraphicDataDestination.getThis(data).floatingObjectImportInfo);
    }
}
DrawingInlineGraphicDataDestination.handlerTable = new MapCreator()
    .add('pic', DrawingInlineGraphicDataDestination.onPicture)
    .add('wsp', DrawingInlineGraphicDataDestination.onWordProcessingShape)
    .add('wgp', DrawingInlineGraphicDataDestination.onDrawingGroupShape)
    .get();
export class DrawingGroupShapeDestination extends DrawingInlineGraphicDataDestination {
}
export class DrawingInlineGraphicDataPictureDestination extends ElementDestination {
    constructor(data, floatingObjectImportInfo) {
        super(data);
        this.floatingObjectImportInfo = floatingObjectImportInfo;
    }
    get elementHandlerTable() {
        return DrawingInlineGraphicDataPictureDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    static onPictureNonVisualProperties(data, _reader) {
        return new NonVisualPicturePropertiesDestination(data, DrawingInlineGraphicDataPictureDestination.getThis(data).floatingObjectImportInfo);
    }
    static onBlipFill(data, _reader) {
        return new PictureBlipFillDestination(data, DrawingInlineGraphicDataPictureDestination.getThis(data).floatingObjectImportInfo);
    }
    static onShapeProperties(data, _reader) {
        const dest = DrawingInlineGraphicDataPictureDestination.getThis(data);
        return new WordProcessingShapePropertiesDestination(data, dest.floatingObjectImportInfo.shape, dest.floatingObjectImportInfo.size);
    }
    static onAlternateContent(data, _reader) {
        return DrawingInlineGraphicDataPictureDestination.getThis(data);
    }
    static onChoice(data, _reader) {
        return DrawingInlineGraphicDataPictureDestination.getThis(data);
    }
    static onFallback(data, _reader) {
        return DrawingInlineGraphicDataPictureDestination.getThis(data);
    }
}
DrawingInlineGraphicDataPictureDestination.handlerTable = new MapCreator()
    .add('nvPicPr', DrawingInlineGraphicDataPictureDestination.onPictureNonVisualProperties)
    .add('blipFill', DrawingInlineGraphicDataPictureDestination.onBlipFill)
    .add('AlternateContent', DrawingInlineGraphicDataPictureDestination.onAlternateContent)
    .add('Choice', DrawingInlineGraphicDataPictureDestination.onChoice)
    .add('Fallback', DrawingInlineGraphicDataPictureDestination.onFallback)
    .add('spPr', DrawingInlineGraphicDataPictureDestination.onShapeProperties)
    .get();
export class PictureBlipFillDestination extends ElementDestination {
    constructor(data, floatingObjectImportInfo) {
        super(data);
        this.floatingObjectImportInfo = floatingObjectImportInfo;
    }
    get elementHandlerTable() {
        return PictureBlipFillDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    static onBlip(data, _reader) {
        return new PictureBlipDestination(data, PictureBlipFillDestination.getThis(data).floatingObjectImportInfo);
    }
    static onSourceRect(data, _reader) {
        return new SourceRectDestination(data, PictureBlipFillDestination.getThis(data).floatingObjectImportInfo);
    }
}
PictureBlipFillDestination.handlerTable = new MapCreator()
    .add('blip', PictureBlipFillDestination.onBlip)
    .add('srcRect', PictureBlipFillDestination.onSourceRect)
    .get();
export class PictureBlipDestination extends LeafElementDestination {
    constructor(data, floatingObjectImportInfo) {
        super(data);
        this.floatingObjectImportInfo = floatingObjectImportInfo;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = reader.getAttributeNS('embed', this.data.constants.relsNamespaceConst);
            if (!StringUtils.isNullOrEmpty(id)) {
                let imageId = yield this.data.relationsStack.last.lookupImageByRelationId(id, 'word');
                if (imageId == null)
                    imageId = yield this.data.relationsStack.last.lookupImageByRelationId(id, '');
                if (imageId != null)
                    this.floatingObjectImportInfo.imageId = imageId;
                return;
            }
            id = reader.getAttributeNS("link", this.data.constants.relsNamespaceConst);
            if (StringUtils.isNullOrEmpty(id))
                return;
            const imageId = yield this.data.relationsStack.last.lookupExternalImageByRelationId(id);
            if (imageId)
                this.floatingObjectImportInfo.imageId = imageId;
        });
    }
}
export class SourceRectDestination extends LeafElementDestination {
    constructor(data, floatingObjectImportInfo) {
        super(data);
        this.floatingObjectImportInfo = floatingObjectImportInfo;
    }
    processElementOpen(_reader) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    getThousandthOfPercentValue(reader, attributeName, defaultValue) {
        const value = reader.getAttribute(attributeName);
        if (StringUtils.isNullOrEmpty(value))
            return defaultValue;
        if (value[value.length - 1] == '%') {
            return this.getPercentValue(value, defaultValue);
        }
        else {
            return this.data.readerHelper.getIntegerValueCore(value, defaultValue);
        }
    }
    getPercentValue(value, defaultValue) {
        value = value.substr(0, value.length - 1);
        let percent;
        try {
            percent = parseFloat(value);
        }
        catch (_a) { }
        if (percent)
            return Math.round(percent * 1000);
        else
            return defaultValue;
    }
}
export class DrawingAnchorSimplePositionDestination extends LeafElementDestination {
    constructor(data, anchorDestination) {
        super(data);
        this.anchorDestination = anchorDestination;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.anchorDestination.useSimplePosition)
                return;
            let x = this.data.readerHelper.getIntegerValue(reader, 'x', Number.MIN_VALUE);
            let y = this.data.readerHelper.getIntegerValue(reader, 'y', Number.MIN_VALUE);
            if (x != Number.MIN_VALUE && y != Number.MIN_VALUE) {
                x = this.anchorDestination.convertEmuToDocumentUnits(x);
                y = this.anchorDestination.convertEmuToDocumentUnits(y);
                this.anchorDestination.floatingObject.offset = new Point(x, y);
                this.anchorDestination.floatingObject.horizontalPositionType = AnchorObjectHorizontalPositionType.Page;
                this.anchorDestination.floatingObject.verticalPositionType = AnchorObjectVerticalPositionType.Page;
                this.anchorDestination.floatingObject.horizontalPositionAlignment = AnchorObjectHorizontalPositionAlignment.Left;
                this.anchorDestination.floatingObject.verticalPositionAlignment = AnchorObjectVerticalPositionAlignment.Top;
            }
        });
    }
}
export class WordProcessingShapeDestination extends ElementDestination {
    constructor(data, floatingObjectImportInfo) {
        super(data);
        this.floatingObjectImportInfo = floatingObjectImportInfo;
    }
    get elementHandlerTable() {
        return WordProcessingShapeDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    static onTextBox(data, _reader) {
        return new TextBoxDestination(data, WordProcessingShapeDestination.getThis(data).floatingObjectImportInfo);
    }
    static onTextBoxProperties(data, _reader) {
        return new TextBoxPropertiesDestination(data, WordProcessingShapeDestination.getThis(data).floatingObjectImportInfo.textBoxProperties);
    }
    static onNonVisualDrawingProperties(data, _reader) {
        const floatingObjectImportInfo = WordProcessingShapeDestination.getThis(data).floatingObjectImportInfo;
        return new DrawingAnchorDocumentPropertiesDestination(data, floatingObjectImportInfo, floatingObjectImportInfo.constainerProperties);
    }
    static onShapeProperties(data, _reader) {
        const dest = WordProcessingShapeDestination.getThis(data);
        return new WordProcessingShapePropertiesDestination(data, dest.floatingObjectImportInfo.shape, dest.floatingObjectImportInfo.size);
    }
}
WordProcessingShapeDestination.handlerTable = new MapCreator()
    .add('txbx', WordProcessingShapeDestination.onTextBox)
    .add("cNvPr", WordProcessingShapeDestination.onNonVisualDrawingProperties)
    .add('bodyPr', WordProcessingShapeDestination.onTextBoxProperties)
    .add('spPr', WordProcessingShapeDestination.onShapeProperties)
    .get();
export class TextBoxDestination extends ElementDestination {
    constructor(data, floatingObjectImportInfo) {
        super(data);
        this.floatingObjectImportInfo = floatingObjectImportInfo;
        this.floatingObjectImportInfo.shapeType = ShapeType.TextBox;
        this.data.pushCurrentSubDocument(this.documentModel.createSubDocument(SubDocumentInfoType.TextBox, this.data.subDocument.id, true));
    }
    get elementHandlerTable() {
        return TextBoxDestination.handlerTable;
    }
    static onTextBoxContent(data, _reader) {
        return new TextBoxContentDestination(data);
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const style = reader.getAttribute('style');
            const inset = reader.getAttribute('inset');
            const textBoxProperties = this.floatingObjectImportInfo.textBoxProperties;
            if (!StringUtils.isNullOrEmpty(style))
                textBoxProperties.resizeShapeToFitText = this.getResizeShapeToFitText(style);
            if (StringUtils.isNullOrEmpty(inset))
                return;
            const margins = this.getMargins(inset);
            textBoxProperties.leftMargin = this.getValidMarginValue(margins[0], 144);
            textBoxProperties.rightMargin = this.getValidMarginValue(margins[1], 144);
            textBoxProperties.topMargin = this.getValidMarginValue(margins[2], 72);
            textBoxProperties.bottomMargin = this.getValidMarginValue(margins[3], 72);
        });
    }
    processElementClose(_reader) {
        this.floatingObjectImportInfo.subDocId = this.data.subDocument.id;
        this.data.popCurrentSubDocument();
    }
    getMargins(strMargins) {
        const result = new Array(4);
        const margins = strMargins.split(',');
        for (let i = 0; i < margins.length; i++)
            result[i] = this.getFloatValue(margins[i]);
        if (margins.length < 4)
            for (let i = margins.length; i < result.length; i++)
                result[i] = 72 + ((i < 2) ? 72 : 0);
        return result;
    }
    getResizeShapeToFitText(style) {
        return style.substring(style.length - 1) == 't';
    }
    getValidMarginValue(value, defaultValue) {
        if (value < 0)
            return defaultValue;
        else
            return value;
    }
    getFloatValue(numb) {
        const valueUnit = StringValueParser.parse(numb);
        if (valueUnit.isEmpty || valueUnit.value == undefined)
            return Number.MIN_VALUE;
        return UnitsConverter.valueUnitToModelUnitsF(valueUnit);
    }
}
TextBoxDestination.handlerTable = new MapCreator()
    .add('txbxContent', TextBoxDestination.onTextBoxContent)
    .get();
export class TextBoxContentDestination extends BodyDestinationBase {
    get elementHandlerTable() {
        return TextBoxContentDestination.handlerTable;
    }
}
TextBoxContentDestination.handlerTable = new MapCreator()
    .add('p', (data) => new ParagraphDestination(data))
    .add('tbl', (data) => new TableDestination(data))
    .add('bookmarkStart', BodyDestinationBase.onBookmarkStart)
    .add('bookmarkEnd', BodyDestinationBase.onBookmarkEnd)
    .add('permStart', BodyDestinationBase.onRangePermissionStart)
    .add('permEnd', BodyDestinationBase.onRangePermissionEnd)
    .add('sdt', BodyDestinationBase.onStructuredDocument)
    .add('altChunk', (data) => new AltChunkDestination(data))
    .add('customXml', BodyDestinationBase.onCustomXml)
    .add('del', BodyDestinationBase.onDeleted)
    .add('ins', BodyDestinationBase.onInserted)
    .get();
export class TextBoxPropertiesDestination extends ElementDestination {
    constructor(data, textBoxProperties) {
        super(data);
        this.textBoxProperties = textBoxProperties;
    }
    get elementHandlerTable() {
        return TextBoxPropertiesDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    static onDisableAutoFit(data, _reader) {
        TextBoxPropertiesDestination.getThis(data).textBoxProperties.resizeShapeToFitText = false;
        return null;
    }
    static onEnableAutoFit(data, _reader) {
        TextBoxPropertiesDestination.getThis(data).textBoxProperties.resizeShapeToFitText = true;
        return null;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            let value;
            value = this.data.readerHelper.getIntegerValue(reader, 'lIns', Number.MIN_VALUE);
            if (value != Number.MIN_VALUE)
                this.textBoxProperties.leftMargin = UnitConverter.emuToTwips(value);
            value = this.data.readerHelper.getIntegerValue(reader, 'rIns', Number.MIN_VALUE);
            if (value != Number.MIN_VALUE)
                this.textBoxProperties.rightMargin = UnitConverter.emuToTwips(value);
            value = this.data.readerHelper.getIntegerValue(reader, 'tIns', Number.MIN_VALUE);
            if (value != Number.MIN_VALUE)
                this.textBoxProperties.topMargin = UnitConverter.emuToTwips(value);
            value = this.data.readerHelper.getIntegerValue(reader, 'bIns', Number.MIN_VALUE);
            if (value != Number.MIN_VALUE)
                this.textBoxProperties.bottomMargin = UnitConverter.emuToTwips(value);
            const wrapType = reader.getAttribute('wrap');
            if (wrapType == 'square')
                this.textBoxProperties.wrapText = true;
            else if (wrapType == 'none')
                this.textBoxProperties.wrapText = false;
            const upright = reader.getAttribute('upright');
            if (!StringUtils.isNullOrEmpty(upright))
                this.textBoxProperties.upright = this.data.readerHelper.getOnOffValueBool(upright, this.textBoxProperties.upright);
            const invalidValue = (-1);
            const verticalAlignment = this.data.readerHelper.getWpEnumValue(reader, 'anchor', TranslationTables.drawingTextAnchoringType.importMap, invalidValue);
            if (verticalAlignment != invalidValue)
                this.textBoxProperties.verticalAlignment = verticalAlignment;
        });
    }
}
TextBoxPropertiesDestination.handlerTable = new MapCreator()
    .add('noAutofit', TextBoxPropertiesDestination.onDisableAutoFit)
    .add('spAutoFit', TextBoxPropertiesDestination.onEnableAutoFit)
    .get();
export class GraphicFrameDestination extends LeafElementDestination {
    constructor(data, size) {
        super(data);
        this.size = size;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = this.data.readerHelper.getIntegerValue(reader, 'rot', Constants.MIN_SAFE_INTEGER);
            if (value != Constants.MIN_SAFE_INTEGER)
                this.size.rotation = value;
        });
    }
}
