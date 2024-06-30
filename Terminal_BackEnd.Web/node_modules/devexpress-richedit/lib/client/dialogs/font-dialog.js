import { formatMessage } from 'devextreme/localization';
import { CharacterFormattingScript, StrikeoutType, UnderlineType } from '../../core/model/character/enums';
import { Constants } from '../_constants';
import { DialogBase } from './dialog-base';
export class FontDialog extends DialogBase {
    getTitle() {
        return formatMessage('ASPxRichEditStringId.FontTitle');
    }
    getMaxWidth() {
        return 650;
    }
    getFormOptions() {
        const fonts = this.richedit.modelManager.model.cache.fontInfoCache.getFontNames(true);
        const fontSizes = Constants.getFontSizesList();
        return {
            colCount: 3,
            items: [{
                    dataField: 'fontName',
                    label: { text: formatMessage('ASPxRichEditStringId.Font'), location: 'top' },
                    editorType: 'dxSelectBox',
                    editorOptions: {
                        items: fonts,
                        value: this.parameters.fontName
                    }
                },
                {
                    dataField: 'fontStyle',
                    label: { text: formatMessage('ASPxRichEditStringId.FontStyle'), location: 'top' },
                    editorType: 'dxSelectBox',
                    editorOptions: {
                        items: [
                            { text: formatMessage('ASPxRichEditStringId.Normal'), value: 0 },
                            { text: formatMessage('ASPxRichEditStringId.Bold'), value: 1 },
                            { text: formatMessage('ASPxRichEditStringId.Italic'), value: 2 },
                            { text: formatMessage('ASPxRichEditStringId.BoldItalic'), value: 3 },
                        ],
                        valueExpr: 'value',
                        displayExpr: 'text',
                        value: this.parameters.fontStyle
                    }
                },
                {
                    dataField: 'fontSize',
                    label: { text: formatMessage('ASPxRichEditStringId.FontSize'), location: 'top' },
                    editorType: 'dxSelectBox',
                    editorOptions: {
                        items: fontSizes,
                        value: this.parameters.fontSize
                    }
                },
                {
                    dataField: 'fontColor',
                    label: { text: formatMessage('ASPxRichEditStringId.FontColor'), location: 'top' },
                    editorType: 'dxColorBox',
                    editorOptions: {
                        value: this.parameters.fontColor != 'Auto' ? this.parameters.fontColor : ''
                    }
                },
                {
                    dataField: 'fontUnderlineType',
                    label: { text: formatMessage('ASPxRichEditStringId.UnderlineStyle'), location: 'top' },
                    editorType: 'dxSelectBox',
                    editorOptions: {
                        items: [
                            { text: formatMessage('ASPxRichEditStringId.UnderlineType_None'), value: UnderlineType.None },
                            { text: formatMessage('ASPxRichEditStringId.UnderlineType_Single'), value: UnderlineType.Single },
                            { text: formatMessage('ASPxRichEditStringId.UnderlineType_Dotted'), value: UnderlineType.Dotted },
                            { text: formatMessage('ASPxRichEditStringId.UnderlineType_Dashed'), value: UnderlineType.Dashed },
                            { text: formatMessage('ASPxRichEditStringId.UnderlineType_DashDotted'), value: UnderlineType.DashDotted },
                            { text: formatMessage('ASPxRichEditStringId.UnderlineType_DashDotDotted'), value: UnderlineType.DashDotDotted },
                            { text: formatMessage('ASPxRichEditStringId.UnderlineType_Double'), value: UnderlineType.Double },
                            { text: formatMessage('ASPxRichEditStringId.UnderlineType_HeavyWave'), value: UnderlineType.HeavyWave },
                            { text: formatMessage('ASPxRichEditStringId.UnderlineType_LongDashed'), value: UnderlineType.LongDashed },
                            { text: formatMessage('ASPxRichEditStringId.UnderlineType_ThickSingle'), value: UnderlineType.ThickSingle },
                            { text: formatMessage('ASPxRichEditStringId.UnderlineType_ThickDotted'), value: UnderlineType.ThickDotted },
                            { text: formatMessage('ASPxRichEditStringId.UnderlineType_ThickDashed'), value: UnderlineType.ThickDashed },
                            { text: formatMessage('ASPxRichEditStringId.UnderlineType_ThickDashDotted'), value: UnderlineType.ThickDashDotted },
                            { text: formatMessage('ASPxRichEditStringId.UnderlineType_ThickDashDotDotted'), value: UnderlineType.ThickDashDotDotted },
                            { text: formatMessage('ASPxRichEditStringId.UnderlineType_ThickLongDashed'), value: UnderlineType.ThickLongDashed },
                            { text: formatMessage('ASPxRichEditStringId.UnderlineType_DoubleWave'), value: UnderlineType.DoubleWave },
                            { text: formatMessage('ASPxRichEditStringId.UnderlineType_Wave'), value: UnderlineType.Wave },
                            { text: formatMessage('ASPxRichEditStringId.UnderlineType_DashSmallGap'), value: UnderlineType.DashSmallGap }
                        ],
                        valueExpr: 'value',
                        displayExpr: 'text',
                        value: this.parameters.fontUnderlineType
                    }
                },
                {
                    dataField: 'fontUnderlineColor',
                    label: { text: formatMessage('ASPxRichEditStringId.UnderlineColor'), location: 'top' },
                    editorType: 'dxColorBox',
                    editorOptions: {
                        value: this.parameters.fontUnderlineColor != 'Auto' ? this.parameters.fontUnderlineColor : ''
                    }
                },
                {
                    dataField: 'fontStrikeoutType',
                    editorType: 'dxRadioGroup',
                    label: { visible: false },
                    editorOptions: {
                        items: [
                            { text: formatMessage('ASPxRichEditStringId.StrikeoutType_None'), value: StrikeoutType.None },
                            { text: formatMessage('ASPxRichEditStringId.StrikeoutType_Single'), value: StrikeoutType.Single },
                            { text: formatMessage('ASPxRichEditStringId.StrikeoutType_Double'), value: StrikeoutType.Double }
                        ],
                        valueExpr: "value",
                        value: this.parameters.fontStrikeoutType
                    }
                },
                {
                    dataField: 'script',
                    editorType: 'dxRadioGroup',
                    label: { visible: false },
                    editorOptions: {
                        items: [
                            { text: formatMessage('ASPxRichEditStringId.CharacterFormattingScript_Normal'), value: CharacterFormattingScript.Normal },
                            { text: formatMessage('ASPxRichEditStringId.CharacterFormattingScript_Subscript'), value: CharacterFormattingScript.Subscript },
                            { text: formatMessage('ASPxRichEditStringId.CharacterFormattingScript_Superscript'), value: CharacterFormattingScript.Superscript }
                        ],
                        valueExpr: 'value',
                        value: this.parameters.script
                    }
                },
                {
                    itemType: 'group',
                    items: [
                        {
                            dataField: 'smallCaps',
                            editorType: 'dxCheckBox',
                            label: { visible: false },
                            editorOptions: {
                                value: this.parameters.smallCaps,
                                text: formatMessage('ASPxRichEditStringId.SmallCaps'),
                                onInitialized: (e) => { this.smallCapsItem = e.component; },
                                onValueChanged: (e) => { this.updateAllCaps(e.component.option('value')); }
                            }
                        },
                        {
                            dataField: 'allCaps',
                            editorType: 'dxCheckBox',
                            label: { visible: false },
                            editorOptions: {
                                value: this.parameters.allCaps,
                                text: formatMessage('ASPxRichEditStringId.AllCaps'),
                                onInitialized: (e) => { this.allCapsItem = e.component; },
                                onValueChanged: (e) => { this.updateSmallCaps(e.component.option('value')); }
                            }
                        },
                        {
                            dataField: 'hidden',
                            editorType: 'dxCheckBox',
                            label: { visible: false },
                            editorOptions: {
                                value: this.parameters.hidden,
                                text: formatMessage('ASPxRichEditStringId.Hidden')
                            }
                        },
                        {
                            dataField: 'underlineWordsOnly',
                            editorType: 'dxCheckBox',
                            label: { visible: false },
                            editorOptions: {
                                value: this.parameters.underlineWordsOnly,
                                text: formatMessage('ASPxRichEditStringId.UnderlineWordsOnly')
                            }
                        }
                    ]
                }]
        };
    }
    updateAllCaps(smallCapsValue) {
        if (smallCapsValue)
            this.allCapsItem.option('value', false);
    }
    updateSmallCaps(allCapsValue) {
        if (allCapsValue)
            this.smallCapsItem.option('value', false);
    }
    updateParameters(parameters, data) {
        parameters.fontName = data.fontName === undefined ? null : data.fontName;
        parameters.fontSize = data.fontSize;
        parameters.fontStyle = data.fontStyle;
        if (data.fontColor !== '')
            parameters.fontColor = data.fontColor;
        parameters.fontUnderlineType = data.fontUnderlineType;
        if (data.fontUnderlineColor !== '')
            parameters.fontUnderlineColor = data.fontUnderlineColor;
        parameters.fontStrikeoutType = data.fontStrikeoutType;
        parameters.script = data.script;
        parameters.allCaps = data.allCaps;
        parameters.smallCaps = data.smallCaps;
        parameters.hidden = data.hidden;
        parameters.underlineWordsOnly = data.underlineWordsOnly;
    }
}
