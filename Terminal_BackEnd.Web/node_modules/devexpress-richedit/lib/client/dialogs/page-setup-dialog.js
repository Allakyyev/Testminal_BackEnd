import { formatMessage } from 'devextreme/localization';
import { SectionPropertiesApplyType } from '../../base/commands/dialogs/dialog-page-setup-command';
import { SectionStartType } from '../../core/model/section/enums';
import { PaperKind, PaperSizeConverter } from '../../core/model/section/paper-kind';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { DialogBase } from './dialog-base';
export class PageSetupDialog extends DialogBase {
    constructor() {
        super(...arguments);
        this.lockOrientation = false;
        this.lockKind = false;
        this.lockSize = false;
    }
    getTitle() {
        return formatMessage('ASPxRichEditStringId.PageSetupTitle');
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
                    itemType: 'tabbed',
                    tabPanelOptions: {
                        deferRendering: false,
                        selectedIndex: this.parameters.initialTab
                    },
                    tabs: [
                        {
                            title: formatMessage('ASPxRichEditStringId.Margins'),
                            items: [
                                {
                                    itemType: 'group',
                                    caption: formatMessage('ASPxRichEditStringId.Margins'),
                                    colCount: 2,
                                    items: [
                                        {
                                            dataField: 'marginTop',
                                            editorType: 'dxNumberBox',
                                            label: { text: formatMessage('ASPxRichEditStringId.Top'), location: 'left' },
                                            editorOptions: {
                                                value: this.parameters.marginTop,
                                                showSpinButtons: true,
                                                step: 0.1,
                                                format: '#0.##'
                                            }
                                        },
                                        {
                                            dataField: 'marginLeft',
                                            editorType: 'dxNumberBox',
                                            label: { text: formatMessage('ASPxRichEditStringId.Left'), location: 'left' },
                                            editorOptions: {
                                                value: this.parameters.marginLeft,
                                                showSpinButtons: true,
                                                step: 0.1,
                                                format: '#0.##'
                                            }
                                        },
                                        {
                                            dataField: 'marginBottom',
                                            editorType: 'dxNumberBox',
                                            label: { text: formatMessage('ASPxRichEditStringId.Bottom'), location: 'left' },
                                            editorOptions: {
                                                value: this.parameters.marginBottom,
                                                showSpinButtons: true,
                                                step: 0.1,
                                                format: '#0.##'
                                            }
                                        },
                                        {
                                            dataField: 'marginRight',
                                            editorType: 'dxNumberBox',
                                            label: { text: formatMessage('ASPxRichEditStringId.Right'), location: 'left' },
                                            editorOptions: {
                                                value: this.parameters.marginRight,
                                                showSpinButtons: true,
                                                step: 0.1,
                                                format: '#0.##'
                                            }
                                        }
                                    ]
                                },
                                {
                                    itemType: 'group',
                                    caption: formatMessage('ASPxRichEditStringId.Orientation'),
                                    items: [
                                        {
                                            dataField: 'landscape',
                                            editorType: 'dxRadioGroup',
                                            label: { visible: false },
                                            editorOptions: {
                                                items: [
                                                    { text: formatMessage('ASPxRichEditStringId.Portrait'), value: false },
                                                    { text: formatMessage('ASPxRichEditStringId.Landscape'), value: true }
                                                ],
                                                valueExpr: 'value',
                                                value: this.parameters.landscape,
                                                onValueChanged: () => { this.onOrientationChanged(); },
                                                onInitialized: (e) => { this.orientationRadioGroup = e.component; }
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            title: formatMessage('ASPxRichEditStringId.Paper'),
                            items: [
                                {
                                    itemType: 'group',
                                    caption: formatMessage('ASPxRichEditStringId.PaperSize'),
                                    colCount: 2,
                                    items: [
                                        {
                                            editorType: 'dxSelectBox',
                                            label: { visible: false },
                                            colSpan: 2,
                                            editorOptions: {
                                                items: this.getPaperKinds(),
                                                valueExpr: 'value',
                                                displayExpr: 'text',
                                                onValueChanged: (e) => { this.onPaperKindChanged(e.component.option('value')); },
                                                onInitialized: (e) => { this.pageKindSelectBox = e.component; }
                                            }
                                        },
                                        {
                                            dataField: 'pageWidth',
                                            editorType: 'dxNumberBox',
                                            label: { text: formatMessage('ASPxRichEditStringId.Width'), location: 'left' },
                                            editorOptions: {
                                                value: this.parameters.pageWidth,
                                                showSpinButtons: true,
                                                step: 0.1,
                                                format: '#0.##',
                                                onValueChanged: () => { this.onPaperSizeChanged(); },
                                                onInitialized: (e) => { this.pageWidthNumberBox = e.component; }
                                            }
                                        },
                                        {
                                            dataField: 'pageHeight',
                                            editorType: 'dxNumberBox',
                                            label: { text: formatMessage('ASPxRichEditStringId.Height'), location: 'left' },
                                            editorOptions: {
                                                value: this.parameters.pageHeight,
                                                showSpinButtons: true,
                                                step: 0.1,
                                                format: '#0.##',
                                                onValueChanged: () => { this.onPaperSizeChanged(); },
                                                onInitialized: (e) => { this.pageHeightNumberBox = e.component; }
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            title: formatMessage('ASPxRichEditStringId.Layout'),
                            items: [
                                {
                                    itemType: 'group',
                                    caption: formatMessage('ASPxRichEditStringId.Section'),
                                    items: [
                                        {
                                            dataField: 'startType',
                                            editorType: 'dxSelectBox',
                                            label: { text: formatMessage('ASPxRichEditStringId.SectionStart'), location: 'left' },
                                            editorOptions: {
                                                items: [
                                                    { text: formatMessage('ASPxRichEditStringId.Continuous'), value: SectionStartType.Continuous },
                                                    { text: formatMessage('ASPxRichEditStringId.NewPage'), value: SectionStartType.NextPage },
                                                    { text: formatMessage('ASPxRichEditStringId.EvenPage'), value: SectionStartType.EvenPage },
                                                    { text: formatMessage('ASPxRichEditStringId.OddPage'), value: SectionStartType.OddPage }
                                                ],
                                                valueExpr: 'value',
                                                displayExpr: 'text',
                                                value: this.parameters.startType
                                            }
                                        }
                                    ]
                                },
                                {
                                    itemType: 'group',
                                    caption: formatMessage('ASPxRichEditStringId.HeadersAndFooters'),
                                    items: [
                                        {
                                            dataField: 'headerDifferentOddAndEven',
                                            editorType: 'dxCheckBox',
                                            label: { visible: false },
                                            editorOptions: {
                                                value: !!this.parameters.headerDifferentOddAndEven,
                                                text: formatMessage('ASPxRichEditStringId.DifferentOddAndEven')
                                            }
                                        },
                                        {
                                            dataField: 'headerDifferentFirstPage',
                                            editorType: 'dxCheckBox',
                                            label: { visible: false },
                                            editorOptions: {
                                                value: !!this.parameters.headerDifferentFirstPage,
                                                text: formatMessage('ASPxRichEditStringId.DifferentFirstPage')
                                            }
                                        },
                                        {
                                            dataField: 'headerOffset',
                                            editorType: 'dxNumberBox',
                                            label: { text: formatMessage('ASPxRichEditStringId.FromEdge') + ' ' + formatMessage('ASPxRichEditStringId.Header'), location: 'left' },
                                            editorOptions: {
                                                value: this.parameters.headerOffset,
                                                showSpinButtons: true,
                                                step: 0.1,
                                                format: '#0.##'
                                            }
                                        },
                                        {
                                            dataField: 'footerOffset',
                                            editorType: 'dxNumberBox',
                                            label: { text: formatMessage('ASPxRichEditStringId.FromEdge') + ' ' + formatMessage('ASPxRichEditStringId.Footer'), location: 'left' },
                                            editorOptions: {
                                                value: this.parameters.footerOffset,
                                                showSpinButtons: true,
                                                step: 0.1,
                                                format: '#0.##'
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    dataField: 'applyTo',
                    editorType: 'dxSelectBox',
                    label: { text: formatMessage('ASPxRichEditStringId.ApplyTo'), location: 'left' },
                    editorOptions: {
                        items: [
                            { text: formatMessage('ASPxRichEditStringId.WholeDocument'), value: SectionPropertiesApplyType.WholeDocument },
                            { text: formatMessage('ASPxRichEditStringId.CurrentSection'), value: SectionPropertiesApplyType.CurrentSection },
                            { text: formatMessage('ASPxRichEditStringId.SelectedSections'), value: SectionPropertiesApplyType.SelectedSections },
                            { text: formatMessage('ASPxRichEditStringId.ThisPointForward'), value: SectionPropertiesApplyType.ThisPointForward }
                        ],
                        valueExpr: 'value',
                        displayExpr: 'text',
                        value: this.parameters.applyTo
                    }
                }
            ]
        };
    }
    afterShowing() {
        if (this.parameters.pageWidth && this.parameters.pageHeight)
            this.onPaperSizeChanged();
    }
    getPaperKinds() {
        const enumTexts = Object.keys(PaperKind).map(key => PaperKind[key]).filter(v => typeof v === 'string');
        const enumValues = Object.keys(PaperKind).map(key => PaperKind[key]).filter(v => typeof v === 'number');
        return enumValues.map((value, index) => { return { text: enumTexts[index], value: value }; });
    }
    onPaperKindChanged(kind) {
        this.lockKind = true;
        const size = PaperSizeConverter.calculatePaperSize(kind);
        if (!this.lockSize) {
            this.pageWidthNumberBox.option('value', this.richedit.uiUnitConverter.twipsToUI(size.width));
            this.pageHeightNumberBox.option('value', this.richedit.uiUnitConverter.twipsToUI(size.height));
        }
        this.updateOrientation(size.width > size.height);
        this.lockKind = false;
    }
    onPaperSizeChanged() {
        this.lockSize = true;
        const width = this.pageWidthNumberBox.option('value');
        const height = this.pageHeightNumberBox.option('value');
        this.updatePaperKind(width, height);
        this.updateOrientation(width > height);
        this.lockSize = false;
    }
    onOrientationChanged() {
        this.lockOrientation = true;
        const landscape = this.orientationRadioGroup.option('value');
        const width = this.pageWidthNumberBox.option('value');
        const height = this.pageHeightNumberBox.option('value');
        if (landscape) {
            this.pageWidthNumberBox.option('value', Math.max(width, height));
            this.pageHeightNumberBox.option('value', Math.min(width, height));
            this.updatePaperKind(Math.max(width, height), Math.min(width, height));
        }
        else {
            this.pageWidthNumberBox.option('value', Math.min(width, height));
            this.pageHeightNumberBox.option('value', Math.max(width, height));
            this.updatePaperKind(Math.min(width, height), Math.max(width, height));
        }
        this.lockOrientation = false;
    }
    updatePaperKind(width, height) {
        if (this.lockKind)
            return;
        const size = new Size(this.richedit.uiUnitConverter.UIToTwips(width), this.richedit.uiUnitConverter.UIToTwips(height));
        let paperKind = PaperSizeConverter.calculatePaperKind(size, 0, this.richedit.uiUnitConverter.UIToTwips(0.01));
        if (paperKind == PaperKind.Custom)
            paperKind = PaperSizeConverter.calculatePaperKind(new Size(size.height, size.width), 0, this.richedit.uiUnitConverter.UIToTwips(0.01));
        this.pageKindSelectBox.option('value', paperKind >= 0 ? paperKind : null);
    }
    updateOrientation(landscape) {
        if (!this.lockOrientation)
            this.orientationRadioGroup.option('value', landscape);
    }
    updateParameters(parameters, data) {
        parameters.marginTop = data.marginTop;
        parameters.marginLeft = data.marginLeft;
        parameters.marginBottom = data.marginBottom;
        parameters.marginRight = data.marginRight;
        parameters.landscape = data.landscape;
        parameters.pageWidth = data.pageWidth;
        parameters.pageHeight = data.pageHeight;
        parameters.startType = data.startType;
        parameters.headerDifferentOddAndEven = data.headerDifferentOddAndEven;
        parameters.headerDifferentFirstPage = data.headerDifferentFirstPage;
        parameters.headerOffset = data.headerOffset;
        parameters.footerOffset = data.footerOffset;
        parameters.applyTo = data.applyTo;
    }
}
