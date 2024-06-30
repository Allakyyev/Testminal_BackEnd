import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../core/layout/document-layout-details-level';
import { LayoutPosition } from '../../core/layout/layout-position';
import { CanvasState } from './canvas-states';
export var RelativePosition;
(function (RelativePosition) {
    RelativePosition[RelativePosition["Top"] = 0] = "Top";
    RelativePosition[RelativePosition["Bottom"] = 1] = "Bottom";
    RelativePosition[RelativePosition["Inside"] = 2] = "Inside";
})(RelativePosition || (RelativePosition = {}));
export class ScrollState {
    byModelPosition(selection) {
        return this.byModelPositionCore(selection.activeSubDocument, selection.endOfLine, selection.pageIndex);
    }
    byModelPositionCore(subDocument, endOfLine, pageIndex) {
        return (new ModelStateByModelPosition(subDocument, endOfLine, pageIndex));
    }
    get byScrollInfo() {
        return (new ModelStateByPageInfo());
    }
    get nothing() { return new ModelStateEmpty(); }
}
export class ModelStateByModelPosition {
    constructor(subDocument, endOfLine, pageIndex) {
        this._subDocument = subDocument;
        this.endOfLine = endOfLine;
        this.pageIndex = pageIndex;
    }
    get subDocument() {
        var _a;
        return this._subDocument = (_a = this._subDocument) === null || _a === void 0 ? void 0 : _a.getActualSubDocument();
    }
    getModelPosition() {
        return this.modelPosition;
    }
    setModelPosition(modelPosition) {
        this.modelPosition = modelPosition;
        return this;
    }
    useCurrentPosition(selection) {
        return this.setModelPosition(selection.anchorPosition);
    }
    setVerticalOffset(getVerticalOffset) {
        this.getVerticalOffset = getVerticalOffset;
        return this;
    }
    useStdOffset() {
        return this.setVerticalOffset(() => 0);
    }
    setRelativePosition(relativePosition) {
        this.relativePosition = relativePosition;
        return this;
    }
    useStdRelativePosition() {
        return this.setRelativePosition(RelativePosition.Inside);
    }
    getCanvasState(layout) {
        const modelPos = this.modelPosition;
        const cursorPos = this.subDocument.isMain()
            ? new LayoutPositionMainSubDocumentCreator(layout, this.subDocument, modelPos, DocumentLayoutDetailsLevel.Character)
                .create(new LayoutPositionCreatorConflictFlags().setDefault(this.endOfLine), new LayoutPositionCreatorConflictFlags().setDefault(false))
            : new LayoutPositionOtherSubDocumentCreator(layout, this.subDocument, modelPos, this.pageIndex, DocumentLayoutDetailsLevel.Character)
                .create(new LayoutPositionCreatorConflictFlags().setDefault(this.endOfLine), new LayoutPositionCreatorConflictFlags().setDefault(false));
        return cursorPos ? new CanvasState(cursorPos, this.relativePosition, this.getVerticalOffset) : null;
    }
}
export class ModelStateByPageInfo {
    setPageInfo(scrollTopInfo) {
        this.getVerticalOffset = () => scrollTopInfo.topPositionRelativePage;
        this.pageIndex = scrollTopInfo.pageIndex;
        this.relativePosition = RelativePosition.Top;
        return this;
    }
    getCanvasState(layout) {
        return layout.isFullyFormatted || layout.isPageValid(this.pageIndex + 1) ?
            new CanvasState(new LayoutPosition(DocumentLayoutDetailsLevel.Page).initByIndexes(this.pageIndex).applyObjectsAsMainSubDocument(layout, -1), this.relativePosition, this.getVerticalOffset) :
            null;
    }
}
export class ModelStateEmpty {
    getCanvasState(_layout) {
        return null;
    }
}
