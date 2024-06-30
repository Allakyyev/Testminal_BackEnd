import { __awaiter } from "tslib";
import { MapCreator } from '../../../../base-utils/map-creator';
import { AnchorObjectHorizontalPositionAlignment, AnchorObjectHorizontalPositionType, AnchorObjectVerticalPositionAlignment, AnchorObjectVerticalPositionType } from '../../../../core/model/floating-objects/enums';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { TranslationTables } from '../../../translation-table/translation-tables';
import { ElementDestination, LeafElementDestination } from '../destination';
export class DrawingAnchorPositionBaseDestination extends ElementDestination {
    constructor(data, anchorDestination) {
        super(data);
        this.offset = Number.MIN_VALUE;
        this.percentOffset = Number.MIN_VALUE;
        this.anchorDestination = anchorDestination;
    }
    get elementHandlerTable() {
        return {};
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    static onPositionOffset(data, _reader) {
        return new DrawingAnchorPositionOffsetDestination(data, DrawingAnchorPositionBaseDestination.getThis(data));
    }
    static onPositionPercentOffset(data, _reader) {
        return new DrawingAnchorPositionPercentOffsetDestination(data, DrawingAnchorPositionBaseDestination.getThis(data));
    }
    processElementClose(reader) {
        if (this.anchorDestination.useSimplePosition)
            return;
        this.processElementCloseCore(reader);
    }
    processElementCloseCore(_reader) { throw new Error('not implemented'); }
}
export class DrawingAnchorHorizontalPositionDestination extends DrawingAnchorPositionBaseDestination {
    constructor(data, anchorDestination) {
        super(data, anchorDestination);
    }
    get elementHandlerTable() {
        return DrawingAnchorHorizontalPositionDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    static onHorizontalAlignment(data, _reader) {
        return new DrawingAnchorPositionHorizontalAlignmentDestination(data, DrawingAnchorHorizontalPositionDestination.getThis(data));
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = reader.getAttribute('relativeFrom');
            this.relativeTo = this.data.readerHelper.getWpEnumValueCore(value, TranslationTables.floatingObjectHorizontalPositionTypeTable.importMap, AnchorObjectHorizontalPositionType.Page);
        });
    }
    processElementCloseCore(_reader) {
        const obj = this.anchorDestination.floatingObject;
        const point = obj.offset.clone();
        point.x = this.anchorDestination.convertEmuToDocumentUnits(this.offset);
        if (this.offset != Number.MIN_VALUE)
            obj.offset = point;
        const percentOffset = obj.percentOffset.clone();
        percentOffset.x = this.percentOffset;
        if (this.percentOffset != Number.MIN_VALUE)
            obj.percentOffset = percentOffset;
        if (this.alignment != null && obj.horizontalPositionAlignment != this.alignment)
            obj.horizontalPositionAlignment = this.alignment;
        if (obj.horizontalPositionType != this.relativeTo)
            obj.horizontalPositionType = this.relativeTo;
    }
}
DrawingAnchorHorizontalPositionDestination.handlerTable = new MapCreator()
    .add('posOffset', DrawingAnchorHorizontalPositionDestination.onPositionOffset)
    .add('pctPosHOffset', DrawingAnchorHorizontalPositionDestination.onPositionPercentOffset)
    .add('align', DrawingAnchorHorizontalPositionDestination.onHorizontalAlignment)
    .get();
export class DrawingAnchorVerticalPositionDestination extends DrawingAnchorPositionBaseDestination {
    constructor(data, anchorDestination) {
        super(data, anchorDestination);
    }
    get elementHandlerTable() {
        return DrawingAnchorVerticalPositionDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    static onVerticalAlignment(data, _reader) {
        return new DrawingAnchorPositionVerticalAlignmentDestination(data, DrawingAnchorVerticalPositionDestination.getThis(data));
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = reader.getAttribute('relativeFrom');
            this.relativeTo = this.data.readerHelper.getWpEnumValueCore(value, TranslationTables.floatingObjectVerticalPositionTypeTable.importMap, AnchorObjectVerticalPositionType.Page);
        });
    }
    processElementCloseCore(_reader) {
        const obj = this.anchorDestination.floatingObject;
        const point = obj.offset.clone();
        point.y = this.anchorDestination.convertEmuToDocumentUnits(this.offset);
        if (this.offset != Number.MIN_VALUE)
            obj.offset = point;
        const percentOffset = obj.percentOffset.clone();
        percentOffset.y = this.percentOffset;
        if (this.percentOffset != Number.MIN_VALUE)
            obj.percentOffset = percentOffset;
        if (this.alignment != null && obj.verticalPositionAlignment != this.alignment)
            obj.verticalPositionAlignment = this.alignment;
        if (obj.verticalPositionType != this.relativeTo)
            obj.verticalPositionType = this.relativeTo;
    }
}
DrawingAnchorVerticalPositionDestination.handlerTable = new MapCreator()
    .add('posOffset', DrawingAnchorVerticalPositionDestination.onPositionOffset)
    .add('pctPosVOffset', DrawingAnchorVerticalPositionDestination.onPositionPercentOffset)
    .add('align', DrawingAnchorVerticalPositionDestination.onVerticalAlignment)
    .get();
export class DrawingAnchorPositionOffsetDestination extends LeafElementDestination {
    constructor(data, positionDestination) {
        super(data);
        this.positionDestination = positionDestination;
    }
    processText(reader) {
        this.positionDestination.offset = this.data.readerHelper.getIntegerValueCore(reader.value, 0);
        return true;
    }
}
export class DrawingAnchorPositionPercentOffsetDestination extends LeafElementDestination {
    constructor(data, positionDestination) {
        super(data);
        this.positionDestination = positionDestination;
    }
    processText(reader) {
        const text = reader.value;
        if (!StringUtils.isNullOrEmpty(text))
            this.positionDestination.percentOffset = this.data.readerHelper.getIntegerValueCore(text, 0);
        return true;
    }
}
export class DrawingAnchorPositionHorizontalAlignmentDestination extends LeafElementDestination {
    constructor(data, positionDestination) {
        super(data);
        this.positionDestination = positionDestination;
    }
    processText(reader) {
        const text = reader.value;
        if (!StringUtils.isNullOrEmpty(text))
            this.positionDestination.alignment = this.data.readerHelper.getWpEnumValueCore(text, TranslationTables.floatingObjectHorizontalPositionAlignmentTable.importMap, AnchorObjectHorizontalPositionAlignment.Left);
        return true;
    }
}
export class DrawingAnchorPositionVerticalAlignmentDestination extends LeafElementDestination {
    constructor(data, positionDestination) {
        super(data);
        this.positionDestination = positionDestination;
    }
    processText(reader) {
        const text = reader.value;
        if (!StringUtils.isNullOrEmpty(text))
            this.positionDestination.alignment = this.data.readerHelper.getWpEnumValueCore(text, TranslationTables.floatingObjectVerticalPositionAlignmentTable.importMap, AnchorObjectVerticalPositionAlignment.Top);
        return true;
    }
}
