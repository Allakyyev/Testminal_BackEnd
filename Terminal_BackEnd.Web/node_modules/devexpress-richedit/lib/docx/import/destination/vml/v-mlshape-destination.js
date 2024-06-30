import { __awaiter } from "tslib";
import { MapCreator } from '../../../../base-utils/map-creator';
import { ColorHelper } from '../../../../core/model/color/color';
import { DXColor } from '../../../../core/model/color/dx-color';
import { SubDocumentInfoType } from '../../../../core/model/enums';
import { HyperlinkInfo } from '../../../../core/model/fields/field';
import { AnchorObjectTextWrapSide } from '../../../../core/model/floating-objects/enums';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { TranslationTables } from '../../../translation-table/translation-tables';
import { DocxNsType } from '../../../utils/constants';
import { StringValueParser } from '../../../utils/string-value-parser';
import { UnitsConverter } from '../../../utils/units-converter';
import { OpenXmlColorImportHelper } from '../../color/open-xml-color-import-helper';
import { ShapeType } from '../../model/floating-object-import-info';
import { ElementDestination, LeafElementDestination } from '../destination';
import { TextBoxContentDestination } from '../drawing/drawing-destination';
export class VMLShapeDestination extends ElementDestination {
    constructor(data, inlineObjectDestination) {
        super(data);
        this.inlineObjectDestination = inlineObjectDestination;
    }
    get elementHandlerTable() {
        return VMLShapeDestination.handlerTable;
    }
    get floatingObjectImportInfo() {
        return this.inlineObjectDestination.floatingObjectImportInfo;
    }
    get style() {
        return this.inlineObjectDestination.style;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    static onWrap(data, _reader) {
        return new WrapDestination(data, VMLShapeDestination.getThis(data).floatingObjectImportInfo.anchorInfo);
    }
    static onLock(data, _reader) {
        return new ShapeLockDestination(data, VMLShapeDestination.getThis(data).floatingObjectImportInfo.size);
    }
    static onTextBox(data, _reader) {
        VMLShapeDestination.getThis(data).floatingObjectImportInfo.shapeType = ShapeType.TextBox;
        return new VMLTextBoxDestination(data, VMLShapeDestination.getThis(data).floatingObjectImportInfo);
    }
    static onAnchorLock(data, _reader) {
        return new AnchorLockDestination(data, VMLShapeDestination.getThis(data).floatingObjectImportInfo.anchorInfo);
    }
    static onImageData(data, _reader) {
        return new VmlShapeImageDataDestination(data, VMLShapeDestination.getThis(data).floatingObjectImportInfo);
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.inlineObjectDestination.style = reader.getAttribute('style');
            this.readFloatingObjectProperties(reader);
            this.readShapeProperties(reader);
            const name = reader.getAttribute('id');
            if (!StringUtils.isNullOrEmpty(name) && StringUtils.isNullOrEmpty(this.floatingObjectImportInfo.constainerProperties.name))
                this.floatingObjectImportInfo.constainerProperties.name = name;
            this.readFlatingObjectHyperlinkInfo(reader);
        });
    }
    readFlatingObjectHyperlinkInfo(reader) {
        const href = reader.getAttribute('href');
        if (StringUtils.isNullOrEmpty(href))
            return;
        const hyperlinkInfo = new HyperlinkInfo('', '', '', false);
        const anchorSeparatorIndex = href.lastIndexOf('#');
        if (anchorSeparatorIndex >= 0) {
            hyperlinkInfo.uri = href.substring(0, anchorSeparatorIndex);
            hyperlinkInfo.anchor = href.substring(anchorSeparatorIndex + 1);
        }
        else
            hyperlinkInfo.uri = href;
        const title = reader.getAttribute('title');
        if (!StringUtils.isNullOrEmpty(title))
            hyperlinkInfo.tip = title;
        this.floatingObjectImportInfo.hyperlinkInfo = hyperlinkInfo;
    }
    processElementClose(reader) {
        super.processElementClose(reader);
        const shape = this.floatingObjectImportInfo.shape;
        try {
            this.applyShapeProperties(shape);
        }
        catch (_a) { }
    }
    applyShapeProperties(shape) {
        if (this.floatingObjectImportInfo.shapeType == ShapeType.TextBox)
            this.applyTextBoxShapeProperties(shape);
        else
            this.applyPictureShapeProperties(shape);
    }
    applyTextBoxShapeProperties(shape) {
        if (this.isStroked) {
            if (this.outlineColor == DXColor.empty)
                this.outlineColor = ColorHelper.BLACK_COLOR;
            shape.outlineColor = this.outlineColor;
        }
        if (this.isFilled) {
            if (this.fillColor != DXColor.empty)
                shape.fillColor = this.fillColor;
        }
        if (this.outlineWidth == Number.MIN_SAFE_INTEGER)
            this.outlineWidth = 0.75;
        shape.outlineWidth = Math.round(UnitConverter.pointsToTwips(this.outlineWidth));
    }
    applyPictureShapeProperties(shape) {
        if (this.isStroked) {
            if (this.outlineColor != DXColor.empty)
                shape.outlineColor = this.outlineColor;
        }
        if (this.isFilled) {
            if (this.fillColor != DXColor.empty)
                shape.fillColor = this.fillColor;
        }
        if (this.outlineWidth != Number.MIN_SAFE_INTEGER)
            shape.outlineWidth = Math.round(UnitConverter.pointsToTwips(this.outlineWidth));
    }
    readFloatingObjectProperties(reader) {
        const properties = this.floatingObjectImportInfo.anchorInfo;
        this.readFloatingObjectPropertiesCore(reader, properties);
    }
    readShapeProperties(reader) {
        try {
            this.readShapePropertiesCore(reader);
        }
        catch (_a) { }
    }
    readFloatingObjectPropertiesCore(reader, properties) {
        if (!StringUtils.isNullOrEmpty(reader.getAttribute('side')))
            properties.wrapSide = this.data.readerHelper.getWpEnumValue(reader, 'wrapText', TranslationTables.floatingObjectTextWrapSideTable.importMap, AnchorObjectTextWrapSide.Both);
        const layoutInTableCell = reader.getAttributeNS('allowincell', this.data.constants.namespaces[DocxNsType.Office].namespace);
        if (!StringUtils.isNullOrEmpty(layoutInTableCell))
            properties.layoutTableCell = this.getBoolValue(layoutInTableCell);
        else
            properties.layoutTableCell = true;
        const allowOverlap = reader.getAttributeNS('allowoverlap', this.data.constants.namespaces[DocxNsType.Office].namespace);
        if (!StringUtils.isNullOrEmpty(allowOverlap))
            properties.allowOverlap = this.getBoolValue(allowOverlap);
    }
    readShapePropertiesCore(reader) {
        const strokedAttribute = reader.getAttribute('stroked');
        this.isStroked = strokedAttribute != 'f' && strokedAttribute != 'false';
        const filledAttribute = reader.getAttribute('filled');
        this.isFilled = filledAttribute != 'f' && filledAttribute != 'false';
        const outlineColor = OpenXmlColorImportHelper.tryConvertAttributeToColor(this.data, reader, 'strokecolor');
        this.outlineColor = outlineColor == undefined ? ColorHelper.BLACK_COLOR : outlineColor;
        const fillColor = OpenXmlColorImportHelper.tryConvertAttributeToColor(this.data, reader, 'fillcolor');
        this.fillColor = fillColor == undefined || fillColor == DXColor.empty ? ColorUtils.LIGHT_COLOR : fillColor;
        this.outlineWidth = this.data.readerHelper.getFloatValueInPoints(reader, 'strokeweight', Number.MIN_SAFE_INTEGER);
    }
    getBoolValue(value) {
        return value == 't';
    }
}
VMLShapeDestination.handlerTable = new MapCreator()
    .add('wrap', VMLShapeDestination.onWrap)
    .add('lock', VMLShapeDestination.onLock)
    .add('textbox', VMLShapeDestination.onTextBox)
    .add('anchorlock', VMLShapeDestination.onAnchorLock)
    .add('imagedata', VMLShapeDestination.onImageData)
    .get();
export class WrapDestination extends LeafElementDestination {
    constructor(data, floatingObjectProperties) {
        super(data);
        this.floatingObject = floatingObjectProperties;
    }
    importTextWrapType(reader) {
        const textWrapType = reader.getAttribute('type');
        const result = StringMapUtils.elementBy(TranslationTables.floatingObjectTextWrapTypeTable.importMap, (elem) => elem.mlValue.wordMLValue == textWrapType);
        if (result)
            this.floatingObject.wrapType = result.modelValue;
    }
    importTextWrapSide(reader) {
        const textWrapSide = reader.getAttribute('side');
        const result = StringMapUtils.elementBy(TranslationTables.floatingObjectTextWrapSideTable.importMap, (elem) => elem.mlValue.wordMLValue == textWrapSide);
        if (result)
            this.floatingObject.wrapSide = result.modelValue;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.importTextWrapType(reader);
            this.importTextWrapSide(reader);
        });
    }
}
export class ShapeLockDestination extends LeafElementDestination {
    constructor(data, size) {
        super(data);
        this.size = size;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const aspectRatioValue = reader.getAttribute('aspectratio');
            if (!StringUtils.isNullOrEmpty(aspectRatioValue))
                this.size.lockAspectRatio = (aspectRatioValue == 't');
        });
    }
}
export class AnchorLockDestination extends LeafElementDestination {
    constructor(data, floatingObjectProperties) {
        super(data);
        this.floatingObjectProperties = floatingObjectProperties;
    }
    processElementOpen(_reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.floatingObjectProperties.locked = true;
        });
    }
}
export class VMLTextBoxDestination extends ElementDestination {
    constructor(data, floatingObjectImportInfo) {
        super(data);
        this.floatingObjectImportInfo = floatingObjectImportInfo;
        this.floatingObjectImportInfo.shapeType = ShapeType.TextBox;
        this.data.pushCurrentSubDocument(this.documentModel.createSubDocument(SubDocumentInfoType.TextBox, this.data.subDocument.id, true));
    }
    get elementHandlerTable() {
        return VMLTextBoxDestination.handlerTable;
    }
    static onTextBoxContent(data, _reader) {
        return new TextBoxContentDestination(data);
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const style = reader.getAttribute('style');
            const inset = reader.getAttribute('inset');
            const textBoxProperties = this.floatingObjectImportInfo.textBoxProperties;
            if (StringUtils.isNullOrEmpty(style))
                textBoxProperties.resizeShapeToFitText = false;
            else
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
VMLTextBoxDestination.handlerTable = new MapCreator()
    .add('txbxContent', VMLTextBoxDestination.onTextBoxContent)
    .get();
export class VmlShapeImageDataDestination extends LeafElementDestination {
    constructor(data, floatingObjectImportInfo) {
        super(data);
        this.floatingObjectImportInfo = floatingObjectImportInfo;
        this.floatingObjectImportInfo.shapeType = ShapeType.PictureFrame;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const relationId = reader.getAttributeNS('id', this.data.constants.relsNamespaceConst);
            if (!StringUtils.isNullOrEmpty(relationId)) {
                const imageId = yield this.data.relationsStack.last.lookupImageByRelationId(relationId, 'word');
                if (imageId != null)
                    this.floatingObjectImportInfo.imageId = imageId;
                return;
            }
        });
    }
}
