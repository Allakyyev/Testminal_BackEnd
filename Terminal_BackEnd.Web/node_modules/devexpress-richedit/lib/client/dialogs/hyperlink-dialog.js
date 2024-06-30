import { formatMessage } from 'devextreme/localization';
import { DialogBase } from './dialog-base';
export class HyperlinkDialog extends DialogBase {
    constructor() {
        super(...arguments);
        this.mailtoPrefix = 'mailto:';
        this.subjectPrefix = '?subject=';
    }
    getTitle() {
        return formatMessage("ASPxRichEditStringId.HyperlinkTitle");
    }
    getMaxWidth() {
        return 500;
    }
    getFormOptions() {
        return {
            labelLocation: 'top',
            colCount: 1,
            items: [
                {
                    itemType: "tabbed",
                    tabPanelOptions: {
                        deferRendering: false,
                        selectedIndex: this.parameters.anchor ? 1 : this.isLinkMailTo(this.parameters.url) ? 2 : 0,
                        onInitialized: (e) => { this.tabPanel = e.component; }
                    },
                    tabs: [
                        {
                            title: formatMessage("ASPxRichEditStringId.Hyperlink_WebPage"),
                            items: [
                                {
                                    dataField: 'url',
                                    editorType: 'dxTextBox',
                                    label: { text: formatMessage("ASPxRichEditStringId.Hyperlink_Url"), location: 'left' },
                                    editorOptions: {
                                        value: this.isLinkMailTo(this.parameters.url) ? '' : this.parameters.url ? this.parameters.url : 'https://'
                                    }
                                },
                                {
                                    dataField: 'text',
                                    editorType: 'dxTextBox',
                                    label: { text: formatMessage("ASPxRichEditStringId.Hyperlink_Text"), location: 'left' },
                                    editorOptions: {
                                        value: this.parameters.text,
                                        disabled: !this.parameters.canChangeDisplayText
                                    }
                                },
                                {
                                    dataField: 'tooltip',
                                    editorType: 'dxTextBox',
                                    label: { text: formatMessage("ASPxRichEditStringId.Hyperlink_ToolTip"), location: 'left' },
                                    editorOptions: {
                                        value: this.parameters.tooltip
                                    }
                                }
                            ]
                        },
                        {
                            title: formatMessage("ASPxRichEditStringId.Hyperlink_PlaceInThisDocument"),
                            items: [
                                {
                                    dataField: 'anchor',
                                    editorType: 'dxSelectBox',
                                    label: { text: formatMessage("ASPxRichEditStringId.Hyperlink_Bookmark"), location: 'left' },
                                    editorOptions: {
                                        items: this.parameters.bookmarkNames,
                                        value: this.parameters.anchor
                                    }
                                },
                                {
                                    dataField: 'text',
                                    editorType: 'dxTextBox',
                                    label: { text: formatMessage("ASPxRichEditStringId.Hyperlink_Text"), location: 'left' },
                                    editorOptions: {
                                        value: this.parameters.text,
                                        disabled: !this.parameters.canChangeDisplayText
                                    }
                                },
                                {
                                    dataField: 'tooltip',
                                    editorType: 'dxTextBox',
                                    label: { text: formatMessage("ASPxRichEditStringId.Hyperlink_ToolTip"), location: 'left' },
                                    editorOptions: {
                                        value: this.parameters.tooltip
                                    }
                                }
                            ]
                        },
                        {
                            title: formatMessage("ASPxRichEditStringId.Hyperlink_EmailAddress"),
                            items: [
                                {
                                    dataField: 'email',
                                    editorType: 'dxTextBox',
                                    label: { text: formatMessage("ASPxRichEditStringId.Hyperlink_EmailTo"), location: 'left' },
                                    editorOptions: {
                                        value: this.getEmail(this.parameters.url)
                                    }
                                },
                                {
                                    dataField: 'subject',
                                    editorType: 'dxTextBox',
                                    label: { text: formatMessage("ASPxRichEditStringId.Hyperlink_Subject"), location: 'left' },
                                    editorOptions: {
                                        value: this.getSubject(this.parameters.url)
                                    }
                                },
                                {
                                    dataField: 'text',
                                    editorType: 'dxTextBox',
                                    label: { text: formatMessage("ASPxRichEditStringId.Hyperlink_Text"), location: 'left' },
                                    editorOptions: {
                                        value: this.parameters.text,
                                        disabled: !this.parameters.canChangeDisplayText
                                    }
                                },
                                {
                                    dataField: 'tooltip',
                                    editorType: 'dxTextBox',
                                    label: { text: formatMessage("ASPxRichEditStringId.Hyperlink_ToolTip"), location: 'left' },
                                    editorOptions: {
                                        value: this.parameters.tooltip
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    }
    isLinkMailTo(url) {
        return url.toLowerCase().indexOf(this.mailtoPrefix) > -1;
    }
    getSubject(url) {
        const subjectIndex = url.toLowerCase().indexOf(this.subjectPrefix);
        return subjectIndex == -1 ? '' : decodeURI(url.substring(subjectIndex + this.subjectPrefix.length));
    }
    getEmail(url) {
        if (!this.isLinkMailTo(url))
            return '';
        const mailtoIndex = url.toLowerCase().indexOf(this.mailtoPrefix), subjectIndex = url.toLowerCase().indexOf(this.subjectPrefix), endIndex = subjectIndex > -1 ? subjectIndex : url.length;
        return url.substring(mailtoIndex + this.mailtoPrefix.length, endIndex);
    }
    updateParameters(parameters, data) {
        parameters.text = data.text;
        parameters.tooltip = data.tooltip;
        const tabPanelSelectedIndex = this.tabPanel.option('selectedIndex');
        if (tabPanelSelectedIndex == 0)
            parameters.url = data.url;
        else if (tabPanelSelectedIndex == 1)
            parameters.anchor = data.anchor;
        else {
            const subject = data.subject ? this.subjectPrefix + data.subject : '';
            parameters.url = this.mailtoPrefix + data.email + subject;
        }
    }
}
