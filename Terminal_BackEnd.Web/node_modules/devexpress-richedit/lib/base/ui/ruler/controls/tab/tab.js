import { EvtUtils } from '@devexpress/utils/lib/utils/evt';
import { TabLeaderType } from '../../../../../core/layout/main-structures/layout-boxes/layout-tab-space-box';
import { TabAlign } from '../../../../../core/model/paragraph/paragraph';
import { TabInfo } from '../../../../../core/model/paragraph/paragraph-style';
import { MinMaxNumber } from '@devexpress/utils/lib/class/min-max';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { DocumentRenderer } from '../../../../canvas/renderes/common/document-renderer';
import { RichEditClientCommand } from '../../../../commands/client-command';
import { RULLER_NUMBER_CORRECTION } from '../../settings';
import { RulerMultiControl } from '../owner';
import { RulerShadow } from '../shadow';
import { RulerLineDisplayType, SnapTo } from '../vertical-line';
import { RulerTabUtils } from './utils';
const RULLER_TABMARK_Y_POSITION = 6;
var TabAction;
(function (TabAction) {
    TabAction[TabAction["None"] = 0] = "None";
    TabAction[TabAction["Insert"] = 1] = "Insert";
    TabAction[TabAction["Delete"] = 2] = "Delete";
    TabAction[TabAction["Move"] = 3] = "Move";
})(TabAction || (TabAction = {}));
export class RulerTabsControlState {
    constructor(tabs, enabled) {
        this.tabs = tabs;
        this.enabled = enabled;
    }
    clone() {
        return new RulerTabsControlState(ListUtils.deepCopy(this.tabs), this.enabled);
    }
}
export class RulerTabViewState {
    constructor(position, align) {
        this.position = position;
        this.align = align;
    }
    equals(obj) {
        return this.position == obj.position && this.align == obj.align;
    }
    clone() {
        return new RulerTabViewState(this.position, this.align);
    }
}
export class RulerTabsControl extends RulerMultiControl {
    constructor() {
        super(...arguments);
        this.tabAction = TabAction.None;
        this.newTab = null;
        this.deleteTab = false;
    }
    getModelState() {
        this.modelData.settings.showTabs = this.modelData.commandManager.getCommand(RichEditClientCommand.InsertTabRuler).getState().enabled;
        if (this.modelData.settings.showTabs) {
            const paragraph = this.modelData.selection.activeSubDocument.getParagraphByPosition(this.modelData.selection.intervalsInfo.interval.start);
            const tabs = ListUtils.map(paragraph.getTabs().positions, tab => {
                const newTab = tab.clone();
                newTab.position = UnitConverter.twipsToPixelsF(tab.position);
                return newTab;
            });
            return new RulerTabsControlState(tabs, true);
        }
        else
            return new RulerTabsControlState([], false);
    }
    updateView() {
        const offset = this.controls.paragraphLeftPosition;
        this.viewState = ListUtils.map(this.currModelState.tabs, tab => new RulerTabViewState(offset + tab.position, tab.alignment));
        this.setCount(this.viewState.length);
        ListUtils.forEach2(this.subControls, this.viewState, (control, viewState) => control.setValue(viewState));
    }
    createSubControl() {
        return new RulerTabControl(this.modelData, this.controls);
    }
    isTabMarkZone(evt) {
        return EvtUtils.getEventY(evt) - DomUtils.getAbsolutePositionY(this.controls.ruler.rootElement) >= RULLER_TABMARK_Y_POSITION;
    }
    onMouseDown(source, evt) {
        if (!this.currModelState.enabled || this.modelData.isReadOnly)
            return false;
        const exactHit = this.calculateExactHit(source);
        if (exactHit)
            return true;
        if (this.tryInsertNewTab(evt))
            return true;
        return false;
    }
    calculateExactHit(source) {
        let exactHit = ListUtils.unsafeAnyOf(this.subControls, (subControl, index) => {
            if (subControl.canHandle(source)) {
                this.handleControlIndex = index;
                this.updatePresentation();
                return true;
            }
            return false;
        });
        return exactHit;
    }
    updatePresentation() {
        this.controls.lineControl.show(RulerLineDisplayType.Normal);
        this.activeSubControl.lineControlSetPosition();
    }
    tryInsertNewTab(evt) {
        const pos = EvtUtils.getEventX(evt) - DomUtils.getAbsolutePositionX(this.controls.ruler.rootElement) - RULLER_NUMBER_CORRECTION
            - this.controls.paragraphLeftPosition;
        if (this.isTabMarkZone(evt) && pos >= this.minPosition() && pos <= this.maxPosition()) {
            this.tabAction = TabAction.Insert;
            this.handleControlIndex = this.currModelState.tabs.length;
            const tabPosition = this.controls.chooseClosestAnchorPosition(pos, [], new MinMaxNumber(this.minPosition(), this.maxPosition()));
            this.newTab = new TabInfo(tabPosition, this.controls.tabTypeBox.align, TabLeaderType.None, false, false);
            this.currModelState.tabs.push(this.newTab.clone());
            this.updateView();
            this.updatePresentation();
            return true;
        }
        return false;
    }
    onMouseMove(distance, source) {
        const deleteTab = !DomUtils.isItParent(this.controls.ruler.rootElement, source);
        if (deleteTab != this.deleteTab) {
            this.deleteTab = deleteTab;
            this.activeSubControl.setVisible(!this.deleteTab);
        }
        super.onMouseMove(distance, source);
        if (this.tabAction == TabAction.None) {
            this.tabAction = TabAction.Move;
            this.activeSubControl.showShadow();
        }
    }
    onMouseUp() {
        this.activeSubControl.setVisible(!this.deleteTab);
        switch (this.tabAction) {
            case TabAction.Insert: {
                if (this.deleteTab) {
                    this.currModelState = this.prevModelState.clone();
                    this.updateView();
                }
                else {
                    const tab = this.currModelState.tabs[this.handleControlIndex];
                    this.modelData.commandManager.getCommand(RichEditClientCommand.InsertTabRuler)
                        .execute(this.modelData.commandManager.isPublicApiCall, { position: tab.position, align: tab.alignment });
                }
                break;
            }
            case TabAction.Move: {
                if (this.deleteTab) {
                    this.modelData.commandManager.getCommand(RichEditClientCommand.DeleteTabRuler)
                        .execute(this.modelData.commandManager.isPublicApiCall, this.prevModelState.tabs[this.handleControlIndex].position);
                }
                else {
                    this.modelData.commandManager.getCommand(RichEditClientCommand.MoveTabRuler)
                        .execute(this.modelData.commandManager.isPublicApiCall, {
                        start: this.prevModelState.tabs[this.handleControlIndex].position,
                        end: this.currModelState.tabs[this.handleControlIndex].position
                    });
                }
                break;
            }
        }
        this.finishHandle();
    }
    finishHandle() {
        super.finishHandle();
        this.tabAction = TabAction.None;
        this.newTab = null;
        this.deleteTab = false;
        this.subControls.forEach(control => control.setVisible(true));
    }
    minPosition() {
        return Math.min(this.controls.leftIndent.currModelState.modelValue, this.controls.firstLineIndent.currModelState.modelValue);
    }
    maxPosition() {
        return this.controls.paragraphRightPosition - this.controls.rightIndent.currModelState.modelValue - this.controls.paragraphLeftPosition;
    }
    calculateNewModelState(distance) {
        switch (this.tabAction) {
            case TabAction.Insert: {
                const startPos = this.newTab.position;
                const currTab = this.currModelState.tabs[this.handleControlIndex];
                currTab.position = this.controls.chooseClosestAnchorPosition(startPos + distance, [startPos], new MinMaxNumber(this.minPosition(), this.maxPosition()));
                break;
            }
            case TabAction.Move: {
                const startPos = this.prevModelState.tabs[this.handleControlIndex].position;
                const currTab = this.currModelState.tabs[this.handleControlIndex];
                currTab.position = this.controls.chooseClosestAnchorPosition(startPos + distance, [startPos], new MinMaxNumber(this.minPosition(), this.maxPosition()));
                break;
            }
        }
    }
}
class RulerTabControl {
    constructor(modelData, controls) {
        this.viewState = new RulerTabViewState(0, -1);
        this.shadow = null;
        this.controls = controls;
        this.modelData = modelData;
        this.rootElement = DocumentRenderer.renderContainer(modelData.settings.styles.tab.className + " " + RulerTabUtils.getSpriteClassName(this.viewState.align, modelData.settings));
        this.applyTemplate();
        controls.ruler.rootElement.appendChild(this.rootElement);
        this.rootElement.style.marginTop = (controls.divisions.height - this.rootElement.offsetHeight) + "px";
        this.setCorrection();
    }
    dispose() {
        this.hideShadow();
        DomUtils.hideNode(this.rootElement);
        this.rootElement = null;
    }
    setVisible(visible) {
        this.rootElement.style.display = visible ? 'block' : 'none';
    }
    canHandle(source) { return source == this.rootElement && this.modelData.settings.showTabs; }
    showShadow() {
        this.shadow = new RulerShadow(this.rootElement);
    }
    hideShadow() {
        if (this.shadow) {
            this.shadow.dispose();
            this.shadow = null;
        }
    }
    lineControlSetPosition() {
        this.controls.lineControl.setPosition(this.viewState.position, SnapTo.LeftSide);
    }
    setValue(viewState) {
        if (!this.viewState || !viewState.equals(this.viewState)) {
            this.viewState = viewState.clone();
            this.changeAlign();
            this.rootElement.style.left = viewState.position - this.leftCorrection + RULLER_NUMBER_CORRECTION + "px";
        }
    }
    setCorrection() {
        switch (this.viewState.align) {
            case TabAlign.Left:
                this.leftCorrection = 0;
                break;
            case TabAlign.Right:
                this.leftCorrection = this.rootElement.offsetWidth;
                break;
            case TabAlign.Center:
            case TabAlign.Decimal:
                this.leftCorrection = Math.round(this.rootElement.offsetWidth / 2);
                break;
        }
    }
    changeAlign() {
        this.rootElement.className = this.modelData.settings.styles.tab.className + " " +
            RulerTabUtils.getSpriteClassName(this.viewState.align, this.modelData.settings);
        this.applyTemplate();
        this.rootElement.title = this.modelData.settings.titles[RulerTabUtils.getTabTitlePropertyName(this.viewState.align)];
        this.setCorrection();
    }
    applyTemplate() {
        const template = RulerTabUtils.getTemplate(this.viewState.align);
        if (template)
            this.rootElement.innerHTML = template;
    }
}
