import { EvtUtils } from '@devexpress/utils/lib/utils/evt';
import { TabAlign } from '../../../../../core/model/paragraph/paragraph';
import { DomEventHandlersHolder } from '@devexpress/utils/lib/class/event-handlers-holder';
import { TouchUtils } from '@devexpress/utils/lib/utils/touch';
import { DocumentRenderer } from '../../../../canvas/renderes/common/document-renderer';
import { RICH_EDIT_CLASS_NAME_PREFIX } from '../../settings';
import { RulerBase } from '../base';
import { RulerTabUtils } from './utils';
const TAB_ALIGN_BOX_PART_HANDLE_CLASS_NAME = RICH_EDIT_CLASS_NAME_PREFIX + "rulertabAlignBox";
export class RulerTabTypeControl extends RulerBase {
    constructor(modelData, controls) {
        super(modelData, controls);
        this.evtHandlersHolder = new DomEventHandlersHolder();
        this.align = TabAlign.Left;
        this.innerSquareElement = DocumentRenderer.renderContainer("");
        this.alignElement = DocumentRenderer.renderContainer(RulerTabUtils.getSpriteClassName(this.align, this.modelData.settings));
        this.applyTemplate();
        this.innerSquareElement.appendChild(this.alignElement);
        this.rootElement.appendChild(this.innerSquareElement);
        this.controls.wrapper.rootElement.appendChild(this.rootElement);
        this.evtHandlersHolder.addListener(this.innerSquareElement, TouchUtils.touchMouseDownEventName, this.onMouseDown.bind(this));
    }
    getRootClassName() { return TAB_ALIGN_BOX_PART_HANDLE_CLASS_NAME; }
    ;
    init() {
        this.adjust();
    }
    dispose() {
        super.dispose();
        this.innerSquareElement = null;
        this.alignElement = null;
        this.evtHandlersHolder.removeAllListeners();
    }
    adjust() {
        const divisionOffsetTop = this.controls.divisions.rootElement.offsetTop + this.controls.ruler.rootElement.offsetTop;
        const size = this.controls.divisions.height;
        this.innerSquareElement.style.width = size + "px";
        this.innerSquareElement.style.height = size + "px";
        this.innerSquareElement.style.top = divisionOffsetTop + "px";
        this.innerSquareElement.style.left = divisionOffsetTop + "px";
        this.rootElement.style.width = size + 2 * divisionOffsetTop + "px";
        this.rootElement.style.height = size + 2 * divisionOffsetTop + "px";
        this.adjustAlignElement();
    }
    adjustAlignElement() {
        const size = this.innerSquareElement.offsetWidth;
        this.alignElement.style.top = (size - this.alignElement.offsetHeight) / 2 + "px";
        this.alignElement.style.left = (size - this.alignElement.offsetWidth) / 2 + "px";
        this.alignElement.title = this.modelData.settings.titles[RulerTabUtils.getTabTitlePropertyName(this.align)];
    }
    onMouseDown(evt) {
        if (!this.modelData.isReadOnly) {
            this.align++;
            if (this.align > TabAlign.Decimal)
                this.align = TabAlign.Left;
            this.alignElement.className = RulerTabUtils.getSpriteClassName(this.align, this.modelData.settings);
            this.applyTemplate();
            this.adjustAlignElement();
            EvtUtils.preventEvent(evt);
        }
    }
    applyTemplate() {
        const template = RulerTabUtils.getTemplate(this.align);
        if (template)
            this.alignElement.innerHTML = template;
    }
}
