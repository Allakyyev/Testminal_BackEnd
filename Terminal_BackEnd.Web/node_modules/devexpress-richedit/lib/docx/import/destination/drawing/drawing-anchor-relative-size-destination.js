import { __awaiter } from "tslib";
import { MapCreator } from '../../../../base-utils/map-creator';
import { RelativeHeightType, RelativeWidthType } from '../../../../core/model/floating-objects/enums';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { TranslationTables } from '../../../translation-table/translation-tables';
import { ElementDestination, LeafElementDestination } from '../destination';
export class DrawingAnchorRelativeSizeBaseDestination extends ElementDestination {
    constructor(data, anchorDestination) {
        super(data);
        this.value = 100 * 1000;
        this.anchorDestination = anchorDestination;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    processElementClose(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.processElementCloseCore(reader);
        });
    }
    processElementCloseCore(_reader) { throw new Error('not implemented'); }
}
export class DrawingAnchorHorizontalRelativeSizeDestination extends DrawingAnchorRelativeSizeBaseDestination {
    constructor(data, anchorDestination) {
        super(data, anchorDestination);
    }
    get elementHandlerTable() {
        return DrawingAnchorHorizontalRelativeSizeDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    static onPictureWidth(data, _reader) {
        return new DrawingAnchorRelativeSizeValueDestination(data, DrawingAnchorHorizontalRelativeSizeDestination.getThis(data));
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = reader.getAttribute('relativeFrom');
            this.relativeFrom = this.data.readerHelper.getWpEnumValueCore(value, TranslationTables.floatingObjectRelativeFromHorizontalTable.importMap, RelativeWidthType.Page);
        });
    }
    processElementCloseCore(_reader) {
        const obj = this.anchorDestination.floatingObjectImportInfo.size;
        obj.relativeWidthType = this.relativeFrom;
        obj.relativeSize.width = this.value;
        if (this.value > 0)
            obj.setUseAbsoluteWidth(false);
    }
}
DrawingAnchorHorizontalRelativeSizeDestination.handlerTable = new MapCreator()
    .add('pctWidth', DrawingAnchorHorizontalRelativeSizeDestination.onPictureWidth)
    .get();
export class DrawingAnchorVerticalRelativeSizeDestination extends DrawingAnchorRelativeSizeBaseDestination {
    constructor(data, anchorDestination) {
        super(data, anchorDestination);
    }
    get elementHandlerTable() {
        return DrawingAnchorVerticalRelativeSizeDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    static onPictureHeight(data, _reader) {
        return new DrawingAnchorRelativeSizeValueDestination(data, DrawingAnchorVerticalRelativeSizeDestination.getThis(data));
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = reader.getAttribute('relativeFrom');
            this.relativeFrom = this.data.readerHelper.getWpEnumValueCore(value, TranslationTables.floatingObjectRelativeFromVerticalTable.importMap, RelativeHeightType.Page);
        });
    }
    processElementCloseCore(_reader) {
        const obj = this.anchorDestination.floatingObjectImportInfo.size;
        obj.relativeHeightType = this.relativeFrom;
        obj.relativeSize.height = this.value;
        if (this.value > 0)
            obj.setUseAbsoluteHeight(false);
    }
}
DrawingAnchorVerticalRelativeSizeDestination.handlerTable = new MapCreator()
    .add('pctHeight', DrawingAnchorVerticalRelativeSizeDestination.onPictureHeight)
    .get();
export class DrawingAnchorRelativeSizeValueDestination extends LeafElementDestination {
    constructor(data, positionDestination) {
        super(data);
        this.sizeDestination = positionDestination;
    }
    processText(reader) {
        const text = reader.value;
        if (!StringUtils.isNullOrEmpty(text))
            this.sizeDestination.value = this.data.readerHelper.getIntegerValueCore(text, 100 * 1000);
        return true;
    }
}
