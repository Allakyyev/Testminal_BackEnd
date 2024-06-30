import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { DocumentRenderer } from '../../../canvas/renderes/common/document-renderer';
import { RULLER_NUMBER_CORRECTION } from '../settings';
export const TABLE_COLUMN_SEPARATOR_RULER_LINE_CLASS_NAME = " table";
export var SnapTo;
(function (SnapTo) {
    SnapTo[SnapTo["LeftSide"] = 0] = "LeftSide";
    SnapTo[SnapTo["RightSide"] = 1] = "RightSide";
})(SnapTo || (SnapTo = {}));
export var RulerLineDisplayType;
(function (RulerLineDisplayType) {
    RulerLineDisplayType[RulerLineDisplayType["Normal"] = 0] = "Normal";
    RulerLineDisplayType[RulerLineDisplayType["TableColumn"] = 1] = "TableColumn";
})(RulerLineDisplayType || (RulerLineDisplayType = {}));
export class RulerVerticalLineControl {
    constructor(canvas, settings, rulerControlElement) {
        this.borderWidth = 0;
        this.rulerControlLeft = 0;
        this.rulerControlWidth = 0;
        this.viewElementLeft = 0;
        this.canvas = canvas;
        this.rulerControlElement = rulerControlElement;
        this.rootElement = DocumentRenderer.renderContainer(settings.styles.line.className);
        this.rootElement.style.display = "block";
        this.borderWidth = DomUtils.getHorizontalBordersWidth(this.rootElement);
    }
    dispose() {
        DomUtils.hideNode(this.rootElement);
        this.rootElement = null;
    }
    show(type) {
        if (type == RulerLineDisplayType.TableColumn)
            DomUtils.addClassName(this.rootElement, TABLE_COLUMN_SEPARATOR_RULER_LINE_CLASS_NAME);
        else
            DomUtils.removeClassName(this.rootElement, TABLE_COLUMN_SEPARATOR_RULER_LINE_CLASS_NAME);
        this.rootElement.style.height = this.canvas.clientHeight + "px";
        this.rootElement.style.top = this.canvas.offsetTop + "px";
        this.rulerControlLeft = this.rulerControlElement.offsetLeft;
        this.rulerControlWidth = this.rulerControlElement.offsetWidth;
        this.viewElementLeft = this.canvas.offsetLeft;
        this.canvas.parentElement.insertBefore(this.rootElement, this.canvas);
    }
    hide() {
        DomUtils.hideNode(this.rootElement);
    }
    setPosition(value, snapTo) {
        if (snapTo == SnapTo.RightSide)
            value = this.rulerControlLeft + this.rulerControlWidth - RULLER_NUMBER_CORRECTION - value;
        else if (snapTo == SnapTo.LeftSide)
            value = this.rulerControlLeft + RULLER_NUMBER_CORRECTION + value - this.borderWidth;
        this.rootElement.style.left = this.viewElementLeft + value + "px";
    }
}
