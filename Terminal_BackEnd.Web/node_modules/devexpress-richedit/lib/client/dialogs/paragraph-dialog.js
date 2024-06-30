import { formatMessage } from 'devextreme/localization';
import { RichEditClientCommand } from '../../base/commands/client-command';
import { ParagraphAlignment, ParagraphFirstLineIndent, ParagraphLineSpacingType } from '../../core/model/paragraph/paragraph-properties';
import { DialogBase } from './dialog-base';
export class ParagraphDialog extends DialogBase {
    getTitle() {
        return formatMessage('ASPxRichEditStringId.ParagraphTitle');
    }
    getMaxWidth() {
        return 650;
    }
    getFormOptions() {
        return {
            items: [{
                    itemType: "tabbed",
                    tabPanelOptions: {
                        deferRendering: false
                    },
                    tabs: [{
                            title: formatMessage('ASPxRichEditStringId.ParagraphTab0'),
                            items: [{
                                    itemType: "group",
                                    caption: formatMessage('ASPxRichEditStringId.General'),
                                    colCount: 2,
                                    items: [{
                                            dataField: 'alignment',
                                            editorType: 'dxSelectBox',
                                            label: { text: formatMessage('ASPxRichEditStringId.Alignment'), location: 'top' },
                                            editorOptions: {
                                                items: [
                                                    { text: formatMessage('ASPxRichEditStringId.Left'), value: ParagraphAlignment.Left },
                                                    { text: formatMessage('ASPxRichEditStringId.Right'), value: ParagraphAlignment.Right },
                                                    { text: formatMessage('ASPxRichEditStringId.Centered'), value: ParagraphAlignment.Center },
                                                    { text: formatMessage('ASPxRichEditStringId.Justified'), value: ParagraphAlignment.Justify }
                                                ],
                                                valueExpr: 'value',
                                                displayExpr: 'text',
                                                value: this.parameters.alignment
                                            }
                                        },
                                        {
                                            dataField: 'outlineLevel',
                                            editorType: 'dxSelectBox',
                                            label: { text: formatMessage('ASPxRichEditStringId.OutlineLevel'), location: 'top' },
                                            editorOptions: {
                                                items: [
                                                    { text: formatMessage('ASPxRichEditStringId.BodyText'), value: 0 },
                                                    { text: formatMessage('ASPxRichEditStringId.Level') + ' 1', value: 1 },
                                                    { text: formatMessage('ASPxRichEditStringId.Level') + ' 2', value: 2 },
                                                    { text: formatMessage('ASPxRichEditStringId.Level') + ' 3', value: 3 },
                                                    { text: formatMessage('ASPxRichEditStringId.Level') + ' 4', value: 4 },
                                                    { text: formatMessage('ASPxRichEditStringId.Level') + ' 5', value: 5 },
                                                    { text: formatMessage('ASPxRichEditStringId.Level') + ' 6', value: 6 },
                                                    { text: formatMessage('ASPxRichEditStringId.Level') + ' 7', value: 7 },
                                                    { text: formatMessage('ASPxRichEditStringId.Level') + ' 8', value: 8 },
                                                    { text: formatMessage('ASPxRichEditStringId.Level') + ' 9', value: 9 }
                                                ],
                                                valueExpr: 'value',
                                                displayExpr: 'text',
                                                value: this.parameters.outlineLevel
                                            }
                                        }]
                                },
                                {
                                    itemType: "group",
                                    caption: formatMessage('ASPxRichEditStringId.Indentation'),
                                    colCount: 4,
                                    items: [{
                                            dataField: 'leftIndent',
                                            editorType: 'dxNumberBox',
                                            label: { text: formatMessage('ASPxRichEditStringId.Left'), location: 'top' },
                                            editorOptions: {
                                                value: this.parameters.leftIndent,
                                                showSpinButtons: true,
                                                step: 0.1,
                                                format: '#0.##'
                                            }
                                        },
                                        {
                                            dataField: 'rightIndent',
                                            editorType: 'dxNumberBox',
                                            label: { text: formatMessage('ASPxRichEditStringId.Right'), location: 'top' },
                                            editorOptions: {
                                                value: this.parameters.rightIndent,
                                                showSpinButtons: true,
                                                step: 0.1,
                                                format: '#0.##'
                                            }
                                        },
                                        {
                                            dataField: 'firstLineIndentType',
                                            editorType: 'dxSelectBox',
                                            label: { text: formatMessage('ASPxRichEditStringId.Special'), location: 'top' },
                                            editorOptions: {
                                                items: [
                                                    { text: formatMessage('ASPxRichEditStringId.none'), value: ParagraphFirstLineIndent.None },
                                                    { text: formatMessage('ASPxRichEditStringId.FirstLine'), value: ParagraphFirstLineIndent.Indented },
                                                    { text: formatMessage('ASPxRichEditStringId.Hanging'), value: ParagraphFirstLineIndent.Hanging }
                                                ],
                                                valueExpr: 'value',
                                                displayExpr: 'text',
                                                value: this.parameters.firstLineIndentType
                                            }
                                        },
                                        {
                                            dataField: 'firstLineIndent',
                                            editorType: 'dxNumberBox',
                                            label: { text: formatMessage('ASPxRichEditStringId.By'), location: 'top' },
                                            editorOptions: {
                                                value: this.parameters.firstLineIndent,
                                                showSpinButtons: true,
                                                step: 0.1,
                                                format: '#0.##'
                                            }
                                        }]
                                },
                                {
                                    itemType: "group",
                                    caption: formatMessage('ASPxRichEditStringId.Spacing'),
                                    colCount: 4,
                                    items: [{
                                            dataField: 'spacingBefore',
                                            editorType: 'dxNumberBox',
                                            label: { text: formatMessage('ASPxRichEditStringId.Before'), location: 'top' },
                                            editorOptions: {
                                                value: this.parameters.spacingBefore,
                                                showSpinButtons: true,
                                                step: 0.1,
                                                format: '#0.##'
                                            }
                                        },
                                        {
                                            dataField: 'spacingAfter',
                                            editorType: 'dxNumberBox',
                                            label: { text: formatMessage('ASPxRichEditStringId.After'), location: 'top' },
                                            editorOptions: {
                                                value: this.parameters.spacingAfter,
                                                showSpinButtons: true,
                                                step: 0.1,
                                                format: '#0.##'
                                            }
                                        },
                                        {
                                            dataField: 'lineSpacingType',
                                            editorType: 'dxSelectBox',
                                            label: { text: formatMessage('ASPxRichEditStringId.LineSpacing'), location: 'top' },
                                            editorOptions: {
                                                items: [
                                                    { text: formatMessage('ASPxRichEditStringId.Single'), value: ParagraphLineSpacingType.Single },
                                                    { text: formatMessage('ASPxRichEditStringId.spacing_1_5_lines'), value: ParagraphLineSpacingType.Sesquialteral },
                                                    { text: formatMessage('ASPxRichEditStringId.Double'), value: ParagraphLineSpacingType.Double },
                                                    { text: formatMessage('ASPxRichEditStringId.Multiple'), value: ParagraphLineSpacingType.Multiple },
                                                    { text: formatMessage('ASPxRichEditStringId.Exactly'), value: ParagraphLineSpacingType.Exactly },
                                                    { text: formatMessage('ASPxRichEditStringId.AtLeast'), value: ParagraphLineSpacingType.AtLeast }
                                                ],
                                                valueExpr: 'value',
                                                displayExpr: 'text',
                                                value: this.parameters.lineSpacingType,
                                                onValueChanged: (e) => { this.updateAtNumberBox(e.component.option('value')); }
                                            }
                                        },
                                        {
                                            dataField: 'lineSpacing',
                                            editorType: 'dxNumberBox',
                                            label: { text: formatMessage('ASPxRichEditStringId.At'), location: 'top' },
                                            editorOptions: {
                                                showSpinButtons: true,
                                                format: '#0.##',
                                                onInitialized: (e) => { this.atNumberBox = e.component; }
                                            }
                                        }]
                                },
                                {
                                    dataField: 'contextualSpacing',
                                    editorType: 'dxCheckBox',
                                    label: { visible: false },
                                    editorOptions: {
                                        value: this.parameters.contextualSpacing,
                                        text: formatMessage('ASPxRichEditStringId.NoSpace')
                                    }
                                }]
                        }, {
                            title: formatMessage('ASPxRichEditStringId.ParagraphTab1'),
                            items: [{
                                    itemType: "group",
                                    caption: formatMessage('ASPxRichEditStringId.Pagination'),
                                    items: [
                                        {
                                            dataField: 'pageBreakBefore',
                                            editorType: 'dxCheckBox',
                                            label: { visible: false },
                                            editorOptions: {
                                                value: this.parameters.pageBreakBefore,
                                                text: formatMessage('ASPxRichEditStringId.PBB')
                                            }
                                        }
                                    ]
                                }]
                        }]
                }]
        };
    }
    afterShowing() {
        const data = this.form.option("formData");
        const type = data.lineSpacingType;
        this.updateAtNumberBox(type);
    }
    updateAtNumberBox(type) {
        switch (type) {
            case ParagraphLineSpacingType.Single:
            case ParagraphLineSpacingType.Sesquialteral:
            case ParagraphLineSpacingType.Double:
                this.atNumberBox.option('value', undefined);
                this.atNumberBox.option('disabled', true);
                break;
            case ParagraphLineSpacingType.Multiple:
                this.atNumberBox.option('step', 0.5);
                this.atNumberBox.option('disabled', false);
                this.atNumberBox.option('value', this.parameters.lineSpacingMultiple);
                this.atNumberBox.option('min', 1);
                break;
            default:
                this.atNumberBox.option('step', 0.1);
                this.atNumberBox.option('disabled', false);
                this.atNumberBox.option('value', this.parameters.lineSpacing);
                this.atNumberBox.option('min', undefined);
                break;
        }
    }
    getToolbarItems() {
        return [this.getTabsToolbarItem(), this.getOkToolbarItem(), this.getCancelToolbarItem()];
    }
    getTabsToolbarItem() {
        return {
            widget: 'dxButton',
            location: 'before',
            toolbar: 'bottom',
            options: {
                text: formatMessage('ASPxRichEditStringId.TabsTitle') + '...',
                onClick: () => {
                    this.popupDialog.hide();
                    const commandManager = this.richedit.commandManager;
                    commandManager.getCommand(RichEditClientCommand.ShowTabsForm).execute(commandManager.isPublicApiCall);
                }
            }
        };
    }
    updateParameters(parameters, data) {
        parameters.alignment = data.alignment;
        parameters.outlineLevel = data.outlineLevel;
        parameters.leftIndent = data.leftIndent;
        parameters.rightIndent = data.rightIndent;
        parameters.firstLineIndentType = data.firstLineIndentType;
        parameters.firstLineIndent = data.firstLineIndent;
        parameters.spacingBefore = data.spacingBefore;
        parameters.spacingAfter = data.spacingAfter;
        const lineSpacingType = data.lineSpacingType;
        parameters.lineSpacingType = lineSpacingType;
        if (lineSpacingType == ParagraphLineSpacingType.Multiple)
            parameters.lineSpacingMultiple = data.lineSpacing;
        if (lineSpacingType == ParagraphLineSpacingType.Exactly || lineSpacingType == ParagraphLineSpacingType.AtLeast)
            parameters.lineSpacing = data.lineSpacing;
        parameters.contextualSpacing = data.contextualSpacing;
        parameters.keepLinesTogether = data.keepLinesTogether;
        parameters.pageBreakBefore = data.pageBreakBefore;
    }
}
