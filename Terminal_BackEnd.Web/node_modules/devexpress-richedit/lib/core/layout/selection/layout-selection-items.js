import { Rectangle } from '@devexpress/utils/lib/geometry/rectangle';
import { RendererClassNames } from '../../canvas/renderer-class-names';
import { zIndexCssClassType } from '../../canvas/renderes/z-index-helper';
import { Point } from '@devexpress/utils/lib/geometry/point';
export class LayoutSelectionItem extends Rectangle {
    constructor() {
        super(0, 0, 0, 0);
    }
    isCursor() {
        return false;
    }
    get zIndexClassType() {
        return zIndexCssClassType.SelRow;
    }
    get baseClassName() {
        return RendererClassNames.SELECTION_ROW;
    }
    static create(pos, size, floatingObjectId, constr) {
        const item = new constr();
        item.floatingObjectId = floatingObjectId;
        return item.setPosition(new Point(pos.pageArea.x + pos.column.x + pos.row.x, pos.pageArea.y + pos.column.y + pos.row.y))
            .setSize(size);
    }
    equals(obj) {
        return this.floatingObjectId == obj.floatingObjectId && super.equals(obj);
    }
}
LayoutSelectionItem.mainPageAreaSelection = -1;
LayoutSelectionItem.headerFooterPageAreaSelection = -2;
export class LayoutSelectionCursorItem extends LayoutSelectionItem {
    isCursor() {
        return true;
    }
    get zIndexClassType() {
        return zIndexCssClassType.SelCursor;
    }
    get baseClassName() {
        return [RendererClassNames.SELECTION_CURSOR, RendererClassNames.CURSOR_NO_BLINK_CLASS_NAME].join(" ");
    }
}
export class LayoutSelectionMisspelledItem extends LayoutSelectionItem {
    get zIndexClassType() {
        return zIndexCssClassType.SelMissp;
    }
    get baseClassName() {
        return RendererClassNames.SELECTION_MISSPELLED;
    }
}
export class LayoutSelectionSearchItem extends LayoutSelectionItem {
    get zIndexClassType() {
        return zIndexCssClassType.SelSearch;
    }
    get baseClassName() {
        return [RendererClassNames.SELECTION_ROW, RendererClassNames.SELECTION_SEARCH].join(" ");
    }
}
export class LayoutRangePermissionItem extends LayoutSelectionItem {
    get zIndexClassType() {
        return zIndexCssClassType.SelRange;
    }
    get baseClassName() {
        return RendererClassNames.SELECTION_RANGE_PERMISSION;
    }
    equals(obj) {
        return this.color == obj.color && super.equals(obj);
    }
}
export class LayoutSelectionFloatingObjectItem extends LayoutSelectionItem {
    get zIndexClassType() {
        return zIndexCssClassType.SelRow;
    }
    get baseClassName() {
        return [RendererClassNames.SELECTION_ROW, RendererClassNames.SELECTION_FLOATING_OBJECTS].join(" ");
    }
}
