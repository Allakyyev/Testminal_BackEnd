import { formatMessage } from 'devextreme/localization';
import dxButton from 'devextreme/ui/button';
import dxList from 'devextreme/ui/list';
import { TabLeaderType } from '../../core/layout/main-structures/layout-boxes/layout-tab-space-box';
import { TabAlign } from '../../core/model/paragraph/paragraph';
import { TabInfo } from '../../core/model/paragraph/paragraph-style';
import { Comparers } from '@devexpress/utils/lib/utils/comparers';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { DialogBase } from './dialog-base';
export class TabsDialog extends DialogBase {
    constructor() {
        super(...arguments);
        this.deletedTabs = [];
        this.isClearAllHappend = false;
    }
    getTitle() {
        return formatMessage('ASPxRichEditStringId.TabsTitle');
    }
    getMaxWidth() {
        return 500;
    }
    getFormOptions() {
        this.tabProperties = this.parameters.tabProperties;
        return {
            colCount: 6,
            items: [
                {
                    colSpan: 3,
                    label: { text: formatMessage('ASPxRichEditStringId.Tabs_TabStopPosition'), location: 'top' },
                    editorType: 'dxTextBox',
                    editorOptions: {
                        onInitialized: (e) => { this.tabTextBox = e.component; },
                        onInput: () => { this.setButtonsEnabled(); }
                    }
                },
                {
                    colSpan: 3,
                    dataField: 'defaultTabStop',
                    editorType: 'dxNumberBox',
                    label: { text: formatMessage('ASPxRichEditStringId.Tabs_DefaultTabStops'), location: 'top' },
                    editorOptions: {
                        value: this.parameters.defaultTabStop,
                        showSpinButtons: true,
                        step: 0.1,
                        format: '#0.##'
                    }
                },
                {
                    colSpan: 3,
                    label: { visible: false },
                    template: () => {
                        const element = document.createElement('div');
                        this.tabsList = new dxList(element, {
                            height: 200,
                            noDataText: formatMessage('ASPxRichEditStringId.Tabs_NoTabs'),
                            selectionMode: 'single',
                            keyExpr: 'index',
                            onSelectionChanged: (e) => { this.onSelectedTabIndexChanged(e.component.option('selectedItemKeys')[0]); }
                        });
                        return element;
                    }
                },
                {
                    colSpan: 3,
                    template: () => {
                        const element = document.createElement('div');
                        this.toBeClearedList = element;
                        return element;
                    }
                },
                {
                    colSpan: 6,
                    editorType: 'dxRadioGroup',
                    label: { text: formatMessage('ASPxRichEditStringId.Tabs_Alignment'), location: 'top' },
                    editorOptions: {
                        items: [
                            { text: formatMessage('ASPxRichEditStringId.Tabs_Left'), value: TabAlign.Left },
                            { text: formatMessage('ASPxRichEditStringId.Tabs_Right'), value: TabAlign.Right },
                            { text: formatMessage('ASPxRichEditStringId.Tabs_Center'), value: TabAlign.Center },
                            { text: formatMessage('ASPxRichEditStringId.Tabs_Decimal'), value: TabAlign.Decimal }
                        ],
                        valueExpr: 'value',
                        layout: "horizontal",
                        onInitialized: (e) => { this.alignmentRadioGroup = e.component; },
                        onValueChanged: (e) => { this.setAlignmentValue(e.component.option('value')); }
                    }
                },
                {
                    colSpan: 6,
                    editorType: 'dxRadioGroup',
                    label: { text: formatMessage('ASPxRichEditStringId.Tabs_Leader'), location: 'top' },
                    editorOptions: {
                        items: [
                            { text: formatMessage('ASPxRichEditStringId.Tabs_None'), value: TabLeaderType.None },
                            { text: formatMessage('ASPxRichEditStringId.Tabs_Dots'), value: TabLeaderType.Dots },
                            { text: formatMessage('ASPxRichEditStringId.Tabs_ThickLine'), value: TabLeaderType.ThickLine },
                            { text: formatMessage('ASPxRichEditStringId.Tabs_Hyphens'), value: TabLeaderType.Hyphens },
                            { text: formatMessage('ASPxRichEditStringId.Tabs_Underline'), value: TabLeaderType.Underline },
                            { text: formatMessage('ASPxRichEditStringId.Tabs_EqualSign'), value: TabLeaderType.EqualSign },
                            { text: formatMessage('ASPxRichEditStringId.Tabs_MiddleDots'), value: TabLeaderType.MiddleDots }
                        ],
                        valueExpr: 'value',
                        layout: "horizontal",
                        onInitialized: (e) => { this.leaderRadioGroup = e.component; },
                        onValueChanged: (e) => { this.setLeaderValue(e.component.option('value')); }
                    }
                },
                {
                    colSpan: 2,
                    template: () => {
                        const element = document.createElement('div');
                        this.setBtn = new dxButton(element, {
                            text: formatMessage('ASPxRichEditStringId.Tabs_Set'),
                            width: '100%',
                            onClick: () => { this.setTab(); }
                        });
                        return element;
                    }
                },
                {
                    colSpan: 2,
                    template: () => {
                        const element = document.createElement('div');
                        this.clearBtn = new dxButton(element, {
                            text: formatMessage('ASPxRichEditStringId.Tabs_Clear'),
                            width: '100%',
                            onClick: () => { this.clearTab(); }
                        });
                        return element;
                    }
                },
                {
                    colSpan: 2,
                    template: () => {
                        const element = document.createElement('div');
                        new dxButton(element, {
                            text: formatMessage('ASPxRichEditStringId.Tabs_ClearAll'),
                            width: '100%',
                            onClick: () => { this.clearAllTab(); }
                        });
                        return element;
                    }
                }
            ]
        };
    }
    afterShowing() {
        this.updateForm();
    }
    setButtonsEnabled() {
        const text = this.tabTextBox.option('text');
        const disabled = text.length == 0;
        this.setBtn.option('disabled', disabled);
        this.clearBtn.option('disabled', disabled);
    }
    onSelectedTabIndexChanged(index) {
        const tabInfo = this.tabProperties.tabsInfo[index];
        if (tabInfo) {
            this.setTabPositionValue(tabInfo.position);
            this.alignmentRadioGroup.option('value', tabInfo.alignment);
            this.leaderRadioGroup.option('value', tabInfo.leader);
        }
        else {
            this.tabTextBox.option('value', '');
            this.alignmentRadioGroup.option('value', TabAlign.Left);
            this.leaderRadioGroup.option('value', TabLeaderType.None);
        }
        this.setButtonsEnabled();
    }
    setTab() {
        const currentTabsInfoIndex = this.getCurrentTabsInfoIndex();
        if (currentTabsInfoIndex > -1)
            return;
        const tabPositionText = this.getTabPositionText();
        const tabValue = Number(tabPositionText);
        if (isNaN(tabValue))
            return;
        const currentPosition = this.richedit.uiUnitConverter.UIToTwips(tabValue);
        const currentTabStopAlign = this.alignmentRadioGroup.option('value');
        const currentTabStopLeader = this.leaderRadioGroup.option('value');
        const tabInfo = new TabInfo(currentPosition, currentTabStopAlign, currentTabStopLeader, false, false);
        this.tabProperties.tabsInfo.push(tabInfo);
        this.sortTabsInfo();
        this.updateForm();
    }
    clearTab() {
        const currentTabsInfoIndex = this.getCurrentTabsInfoIndex();
        if (currentTabsInfoIndex < 0)
            return;
        const currentTabStopPosition = this.getRoundedPositionByTwips(this.tabProperties.tabsInfo[currentTabsInfoIndex].position);
        ListUtils.remove(this.deletedTabs, currentTabStopPosition);
        this.deletedTabs.push(currentTabStopPosition);
        this.deletedTabs.sort(Comparers.number);
        this.tabProperties.tabsInfo.splice(currentTabsInfoIndex, 1);
        this.updateForm();
    }
    sortTabsInfo() {
        this.tabProperties.tabsInfo.sort((i1, i2) => {
            if (i1.position > i2.position)
                return 1;
            else if (i1.position < i2.position)
                return -1;
            return 0;
        });
    }
    updateForm() {
        const items = this.tabProperties.tabsInfo.map((tabInfo, index) => {
            const position = this.getRoundedPositionByTwips(tabInfo.position);
            return this.createListItem(position + '', index++);
        });
        this.tabsList.option('items', items);
        this.onSelectedTabIndexChanged(0);
        this.updateClearedTabsLabel();
    }
    setAlignmentValue(value) {
        const currentTabsInfoIndex = this.getCurrentTabsInfoIndex();
        if (currentTabsInfoIndex > -1)
            this.tabProperties.tabsInfo[currentTabsInfoIndex].alignment = value;
    }
    setLeaderValue(value) {
        const currentTabsInfoIndex = this.getCurrentTabsInfoIndex();
        if (currentTabsInfoIndex > -1)
            this.tabProperties.tabsInfo[currentTabsInfoIndex].leader = value;
    }
    updateClearedTabsLabel() {
        let text = formatMessage('ASPxRichEditStringId.Tabs_TabStopsToBeCleared') + ": ";
        if (!this.isClearAllHappend)
            for (var i = 0; i < this.deletedTabs.length; i++)
                text += this.deletedTabs[i] + "; ";
        else
            text += 'All';
        this.toBeClearedList.innerHTML = text;
    }
    createListItem(text, index) {
        return { html: text, index: index };
    }
    clearAllTab() {
        this.tabProperties.tabsInfo = [];
        this.isClearAllHappend = true;
        this.updateForm();
    }
    getCurrentTabsInfoIndex() {
        const tabPositionText = this.getTabPositionText();
        const tabValue = Number(tabPositionText);
        if (!isNaN(tabValue)) {
            var currentPosition = this.getRoundedPosition(tabPositionText);
            for (var i = 0; i < this.tabProperties.tabsInfo.length; i++)
                if (this.getRoundedPositionByTwips(this.tabProperties.tabsInfo[i].position) == currentPosition)
                    return i;
        }
        return -1;
    }
    getTabPositionText() {
        return this.tabTextBox.option('text');
    }
    setTabPositionValue(value) {
        this.tabTextBox.option('value', this.getRoundedPositionByTwips(value).toString());
    }
    getRoundedPosition(position) {
        return Math.round(position * 100) / 100;
    }
    getRoundedPositionByTwips(position) {
        return this.getRoundedPosition(this.richedit.uiUnitConverter.twipsToUI(position));
    }
    getOkToolbarItem() {
        return {
            widget: 'dxButton',
            location: 'after',
            toolbar: 'bottom',
            options: {
                text: formatMessage('ASPxRichEditStringId.OkButton'),
                onClick: () => {
                    this.setTab();
                    this.applyParameters();
                    this.popupDialog.hide();
                    this.afterClosing();
                }
            }
        };
    }
    updateParameters(parameters, data) {
        parameters.defaultTabStop = data.defaultTabStop;
        parameters.tabProperties = this.tabProperties;
    }
}
