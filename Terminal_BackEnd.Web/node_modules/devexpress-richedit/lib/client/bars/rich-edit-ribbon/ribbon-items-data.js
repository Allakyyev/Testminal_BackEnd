import { formatMessage } from 'devextreme/localization';
import { RichEditClientCommand as Command } from '../../../base/commands/client-command';
import { BorderLineStyle } from '../../../core/model/borders/enums';
import { JSONFontInfoProperty } from '../../../core/model/json/enums/json-character-enums';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { Constants } from '../../_constants';
import { loadDefaultMessages } from '../../default-localization';
import { RibbonTabType } from '../../public/ribbon/tab';
export class RibbonItemsData {
    static getDefaultItems() {
        loadDefaultMessages();
        const fonts = Constants.defaultFontsList.map(f => {
            const name = f[JSONFontInfoProperty.Name];
            return { text: name, value: name };
        });
        const fontSizes = Constants.getFontSizesList().map(s => {
            return { text: s.toString(), value: s };
        });
        function getTrimmedMessage(id) {
            const message = formatMessage(id);
            const trimmedFromEnd = StringUtils.trimEnd(message, ['\\.']);
            return StringUtils.trimStart(trimmedFromEnd, ['\\&']);
        }
        const fileToolBarItems = [
            { type: 'Button', text: formatMessage("OfficeStringId.MenuCmd_NewEmptyDocument"), icon: 'dxre-icon-New', alwaysShowText: true, name: Command.CreateNewDocumentLocally },
            { type: 'Button', text: formatMessage('ASPxRichEditStringId.OpenButton'), icon: 'dxre-icon-Open', alwaysShowText: true, name: Command.OpenDocumentLocally },
            { type: 'Button', text: formatMessage('ASPxRichEditStringId.SaveAsButton'), icon: 'dxre-icon-Save', alwaysShowText: true, name: Command.ExportDocument },
            {
                type: 'Menu',
                name: Command.DownloadDocumentLocally,
                text: formatMessage('ASPxRichEditStringId.DownloadButton'),
                icon: 'dxre-icon-Download',
                alwaysShowText: true,
                items: [
                    { text: formatMessage("ASPxRichEditStringId.Download_WordDocument"), name: Command.DownloadDocx },
                    { text: formatMessage("ASPxRichEditStringId.Download_RichTextFormat"), name: Command.DownloadRtf },
                    { text: formatMessage("ASPxRichEditStringId.Download_PlainText"), name: Command.DownloadTxt }
                ]
            },
            { type: 'Button', text: getTrimmedMessage("OfficeStringId.MenuCmd_Print"), icon: 'dxre-icon-Print', alwaysShowText: true, name: Command.PrintDocumentOnClient }
        ];
        const homeToolbarItems = [
            { type: 'Button', text: formatMessage('ASPxRichEditStringId.GroupUndo'), icon: 'dxre-icon-Undo', name: Command.Undo },
            { type: 'Button', text: formatMessage("OfficeStringId.MenuCmd_Redo"), icon: 'dxre-icon-Redo', name: Command.Redo },
            { type: 'Button', text: formatMessage("OfficeStringId.MenuCmd_CutSelection"), icon: 'dxre-icon-Cut', name: Command.CutSelection, beginGroup: true },
            { type: 'Button', text: formatMessage("OfficeStringId.MenuCmd_CopySelection"), icon: 'dxre-icon-Copy', name: Command.CopySelection },
            { type: 'Button', text: formatMessage("OfficeStringId.MenuCmd_Paste"), icon: 'dxre-icon-Paste', name: Command.PasteSelection },
            { type: 'SelectBox', dataSource: fonts, width: 150, name: Command.ChangeFontName, beginGroup: true, displayExpr: "text", valueExpr: "value" },
            { type: 'SelectBox', dataSource: fontSizes, width: 70, name: Command.ChangeFontSize, beginGroup: true, acceptCustomValue: true,
                displayExpr: "text", valueExpr: "value", onCustomItemCreating: function (e) { e.customItem = { text: e.text, value: parseFloat(e.text) }; } },
            { type: 'Button', text: formatMessage("OfficeStringId.MenuCmd_IncreaseFontSize"), icon: 'dxre-icon-FontSizeIncrease', name: Command.IncreaseFontSize, beginGroup: true },
            { type: 'Button', text: formatMessage("OfficeStringId.MenuCmd_DecreaseFontSize"), icon: 'dxre-icon-FontSizeDecrease', name: Command.DecreaseFontSize },
            { type: 'ColorBox', text: formatMessage("OfficeStringId.MenuCmd_ChangeFontColor"), value: '#ff0000', name: Command.ChangeFontForeColor, beginGroup: true },
            { type: 'Button', text: formatMessage('ASPxRichEditStringId.MenuCmd_Font_settings'), icon: 'dxre-icon-ChangeFontStyle', name: Command.ShowFontForm, beginGroup: true },
            { type: 'Button', text: formatMessage('OfficeStringId.MenuCmd_ToggleFontBold'), icon: 'dxre-icon-Bold', name: Command.ToggleFontBold, isToggleMode: true, beginGroup: true },
            { type: 'Button', text: formatMessage('OfficeStringId.MenuCmd_ToggleFontItalic'), icon: 'dxre-icon-Italic', name: Command.ToggleFontItalic, isToggleMode: true },
            { type: 'Button', text: formatMessage('OfficeStringId.MenuCmd_ToggleFontUnderline'), icon: 'dxre-icon-Underline', name: Command.ToggleFontUnderline, isToggleMode: true },
            { type: 'Button', text: formatMessage('OfficeStringId.MenuCmd_ToggleFontStrikeout'), icon: 'dxre-icon-Strikeout', name: Command.ToggleFontStrikeout, isToggleMode: true },
            { type: 'Button', text: formatMessage('ASPxRichEditStringId.CharacterFormattingScript_Subscript'), icon: 'dxre-icon-Subscript', name: Command.ToggleFontSubscript, isToggleMode: true },
            { type: 'Button', text: formatMessage('ASPxRichEditStringId.CharacterFormattingScript_Superscript'), icon: 'dxre-icon-Superscript', name: Command.ToggleFontSuperscript, isToggleMode: true },
            {
                type: 'Menu',
                name: Command.ChangeCaseMenu,
                text: formatMessage('XtraRichEditStringId.MenuCmd_ChangeTextCase'),
                icon: 'dxre-icon-ChangeTextCase',
                items: [
                    { text: formatMessage('ASPxRichEditStringId.MenuCmd_MakeTextSentenceCase'), name: Command.SentenceCase },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_MakeTextUpperCase'), name: Command.MakeTextUpperCase },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_MakeTextLowerCase'), name: Command.MakeTextLowerCase },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_CapitalizeEachWordTextCase'), name: Command.CapitalizeEachWordTextCase },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleTextCase'), name: Command.ToggleTextCase }
                ]
            },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.ClearFormatting'), icon: 'dxre-icon-ClearFormatting', name: Command.ClearFormatting },
            { type: 'Button', text: getTrimmedMessage('XtraRichEditStringId.MenuCmd_InsertBulletListDescription'), icon: 'dxre-icon-ListBullets', name: Command.ToggleBulletedListItem, isToggleMode: true, beginGroup: true },
            { type: 'Button', text: getTrimmedMessage('XtraRichEditStringId.MenuCmd_InsertSimpleListDescription'), icon: 'dxre-icon-ListNumbers', name: Command.ToggleNumberingListItem, isToggleMode: true },
            { type: 'Button', text: getTrimmedMessage('XtraRichEditStringId.MenuCmd_InsertMultilevelListDescription'), icon: 'dxre-icon-ListMultilevel', name: Command.ToggleMultilevelListItem, isToggleMode: true },
            {
                type: 'Menu',
                name: Command.AlignParagraphMenu,
                text: formatMessage('ASPxRichEditStringId.MenuCmd_Align_Paragraph'),
                icon: 'dxre-icon-AlignLeft',
                beginGroup: true,
                items: [
                    { text: formatMessage('XtraRichEditStringId.Caption_ParagraphAlignment_Left'), name: Command.ToggleParagraphAlignmentLeft, icon: 'dxre-icon-AlignLeft' },
                    { text: formatMessage('XtraRichEditStringId.Caption_ParagraphAlignment_Center'), name: Command.ToggleParagraphAlignmentCenter, icon: 'dxre-icon-AlignCenter' },
                    { text: formatMessage('XtraRichEditStringId.Caption_ParagraphAlignment_Right'), name: Command.ToggleParagraphAlignmentRight, icon: 'dxre-icon-AlignRight' },
                    { text: formatMessage('XtraRichEditStringId.Caption_ParagraphAlignment_Justify'), name: Command.ToggleParagraphAlignmentJustify, icon: 'dxre-icon-AlignJustify' }
                ]
            },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleWhitespace'), icon: 'dxre-icon-ShowHidden', name: Command.ToggleShowWhitespace, isToggleMode: true },
            {
                type: 'Menu',
                name: Command.LineSpacingMenu,
                icon: 'dxre-icon-LineSpacing',
                text: formatMessage('XtraRichEditStringId.MenuCmd_ChangeParagraphLineSpacing'),
                items: [
                    { text: '1.0', name: Command.SetSingleParagraphSpacing },
                    { text: '1.5', name: Command.SetSesquialteralParagraphSpacing },
                    { text: '2.0', name: Command.SetDoubleParagraphSpacing },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_AddSpacingBeforeParagraph'), name: Command.AddSpacingBeforeParagraph },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_AddSpacingAfterParagraph'), name: Command.AddSpacingAfterParagraph },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_RemoveSpacingBeforeParagraph'), name: Command.RemoveSpacingBeforeParagraph },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_RemoveSpacingAfterParagraph'), name: Command.RemoveSpacingAfterParagraph }
                ]
            },
            { type: 'ColorBox', text: formatMessage('XtraRichEditStringId.MenuCmd_ChangeParagraphBackColorDescription'), value: '#fff', name: Command.ChangeParagraphBackColor, beginGroup: true },
            { type: 'SelectBox', width: 130, name: Command.ChangeStyle, dataSource: Constants.getParagraphStylesList(),
                displayExpr: 'text', valueExpr: 'value', beginGroup: true, acceptCustomValue: true },
            { type: 'Button', text: formatMessage('ASPxRichEditStringId.FindReplace_Find'), icon: 'dxre-icon-Find', name: Command.Find, beginGroup: true },
            { type: 'Button', text: formatMessage('ASPxRichEditStringId.FindReplace_Replace'), icon: 'dxre-icon-Replace', name: Command.Replace }
        ];
        const insertToolbarItems = [
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_InsertTable'), icon: 'dxre-icon-InsertTable', alwaysShowText: true, name: Command.ShowInsertTableForm },
            { type: 'Button', text: formatMessage("OfficeStringId.MenuCmd_InsertFloatingObjectPicture"), icon: 'dxre-icon-InsertImage', alwaysShowText: true, name: Command.InsertPictureLocally },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_ShowBookmarkForm'), icon: 'dxre-icon-Bookmark', alwaysShowText: true, name: Command.ShowBookmarkForm, beginGroup: true },
            { type: 'Button', text: formatMessage('OfficeStringId.MenuCmd_Hyperlink'), icon: 'dxre-icon-Hyperlink', alwaysShowText: true, name: Command.ShowHyperlinkForm },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_EditPageHeader'), icon: 'dxre-icon-Header', alwaysShowText: true, name: Command.InsertHeader, beginGroup: true },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_EditPageFooter'), icon: 'dxre-icon-Footer', alwaysShowText: true, name: Command.InsertFooter },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_InsertPageNumberField'), icon: 'dxre-icon-InsertPageNumber', alwaysShowText: true, name: Command.InsertPageNumberField },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_InsertPageCountField'), icon: 'dxre-icon-InsertPageCount', alwaysShowText: true, name: Command.InsertPageCountField },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_InsertTextBox'), icon: 'dxre-icon-InsertTextBox', alwaysShowText: true, name: Command.InsertAnchoredTextBox, beginGroup: true }
        ];
        const pageLayoutToolbarItems = [
            {
                type: 'Menu',
                name: Command.MarginsMenu,
                icon: 'dxre-icon-PageMargins',
                text: formatMessage('ASPxRichEditStringId.Margins'),
                alwaysShowText: true,
                items: [
                    { text: formatMessage('ASPxRichEditStringId.Normal'), icon: 'dxre-icon-PageMarginsNormal', name: Command.SetNormalSectionPageMargins },
                    { text: formatMessage('ASPxRichEditStringId.MarginsNarrow'), icon: 'dxre-icon-PageMarginsNarrow', name: Command.SetNarrowSectionPageMargins },
                    { text: formatMessage('ASPxRichEditStringId.MarginsModerate'), icon: 'dxre-icon-PageMarginsModerate', name: Command.SetModerateSectionPageMargins },
                    { text: formatMessage('ASPxRichEditStringId.MarginsWide'), icon: 'dxre-icon-PageMarginsWide', name: Command.SetWideSectionPageMargins },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ShowPageMarginsSetupForm'), name: Command.ShowPageMarginsSetupForm, beginGroup: true }
                ]
            },
            {
                type: 'Menu',
                name: Command.OrientationMenu,
                icon: 'dxre-icon-PageOrientation',
                text: formatMessage('ASPxRichEditStringId.Orientation'),
                alwaysShowText: true,
                items: [
                    { text: formatMessage('ASPxRichEditStringId.Portrait'), icon: 'dxre-icon-PageOrientationPortrait', name: Command.SetPortraitPageOrientation },
                    { text: formatMessage('ASPxRichEditStringId.Landscape'), icon: 'dxre-icon-PageOrientationLandscape', name: Command.SetLandscapePageOrientation }
                ]
            },
            {
                type: 'Menu',
                name: Command.SizeMenu,
                icon: 'dxre-icon-PaperSize',
                alwaysShowText: true,
                text: formatMessage('ASPxRichEditStringId.TableProperties_Size'),
                items: [
                    { text: 'Letter', name: Command.SetSectionLetterPaperKind },
                    { text: 'Legal', name: Command.SetSectionLegalPaperKind },
                    { text: 'Folio', name: Command.SetSectionFolioPaperKind },
                    { text: 'A4', name: Command.SetSectionA4PaperKind },
                    { text: 'B5', name: Command.SetSectionB5PaperKind },
                    { text: 'Executive', name: Command.SetSectionExecutivePaperKind },
                    { text: 'A5', name: Command.SetSectionA5PaperKind },
                    { text: 'A6', name: Command.SetSectionA6PaperKind },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ShowPagePaperSetupForm'), name: Command.ShowPagePaperSetupForm, beginGroup: true }
                ]
            },
            {
                type: 'Menu',
                name: Command.ColumnsMenu,
                icon: 'dxre-icon-Columns',
                alwaysShowText: true,
                text: formatMessage('ASPxRichEditStringId.ColumnsTitle'),
                items: [
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_SetSectionOneColumn'), icon: 'dxre-icon-ColumnsOne', name: Command.SetSectionOneColumn },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_SetSectionTwoColumns'), icon: 'dxre-icon-ColumnsTwo', name: Command.SetSectionTwoColumns },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_SetSectionThreeColumns'), icon: 'dxre-icon-ColumnsThree', name: Command.SetSectionThreeColumns },
                ]
            },
            {
                type: 'Menu',
                name: Command.BreaksMenu,
                icon: 'dxre-icon-InsertSectionBreakNextPage',
                alwaysShowText: true,
                text: formatMessage('XtraRichEditStringId.MenuCmd_InsertBreak'),
                items: [
                    { text: formatMessage('XtraRichEditStringId.FloatingObjectLayoutOptionsForm_HorizontalPositionTypePage'), icon: 'dxre-icon-InsertPageBreak', name: Command.InsertPageBreak },
                    { text: formatMessage('ASPxRichEditStringId.TableProperties_Column'), icon: 'dxre-icon-InsertColumnBreak', name: Command.InsertColumnBreak },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_InsertSectionBreakNextPage'), icon: 'dxre-icon-InsertSectionBreakNextPage', name: Command.InsertSectionBreakNextPage },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_InsertSectionBreakEvenPage'), icon: 'dxre-icon-InsertSectionBreakEvenPage', name: Command.InsertSectionBreakEvenPage },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_InsertSectionBreakOddPage'), icon: 'dxre-icon-InsertSectionBreakOddPage', name: Command.InsertSectionBreakOddPage }
                ]
            },
            { type: 'ColorBox', text: formatMessage('XtraRichEditStringId.MenuCmd_ChangePageColor'), value: '#fff', name: Command.ChangePageColor, beginGroup: true }
        ];
        const referencesToolbarItems = [
            { type: 'Button', text: formatMessage('ASPxRichEditStringId.GroupTableOfContents'), icon: 'dxre-icon-InsertTableOfContents', alwaysShowText: true, name: Command.CreateTocField },
            {
                type: 'Menu',
                name: Command.AddTextMenu,
                icon: 'dxre-icon-AddParagraphToTableOfContents',
                text: formatMessage('XtraRichEditStringId.MenuCmd_AddParagraphsToTableOfContents'),
                alwaysShowText: true,
                items: [
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_SetParagraphBodyTextLevel'), name: Command.SetParagraphBodyTextLevel },
                    { text: formatMessage('ASPxRichEditStringId.Level') + ' 1', name: Command.SetParagraphHeading1Level },
                    { text: formatMessage('ASPxRichEditStringId.Level') + ' 2', name: Command.SetParagraphHeading2Level },
                    { text: formatMessage('ASPxRichEditStringId.Level') + ' 3', name: Command.SetParagraphHeading3Level },
                    { text: formatMessage('ASPxRichEditStringId.Level') + ' 4', name: Command.SetParagraphHeading4Level },
                    { text: formatMessage('ASPxRichEditStringId.Level') + ' 5', name: Command.SetParagraphHeading5Level },
                    { text: formatMessage('ASPxRichEditStringId.Level') + ' 6', name: Command.SetParagraphHeading6Level },
                    { text: formatMessage('ASPxRichEditStringId.Level') + ' 7', name: Command.SetParagraphHeading7Level },
                    { text: formatMessage('ASPxRichEditStringId.Level') + ' 8', name: Command.SetParagraphHeading8Level },
                    { text: formatMessage('ASPxRichEditStringId.Level') + ' 9', name: Command.SetParagraphHeading9Level }
                ]
            },
            {
                type: 'Menu',
                name: Command.InsertCaptionMenu,
                icon: 'dxre-icon-InsertCaption',
                text: formatMessage('XtraRichEditStringId.MenuCmd_InsertCaptionPlaceholder'),
                beginGroup: true,
                alwaysShowText: true,
                items: [
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_InsertFiguresCaption'), icon: 'dxre-icon-InsertFigureCaption', name: Command.CreateFigureCaptionField },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_InsertTablesCaption'), icon: 'dxre-icon-InsertTableCaption', name: Command.CreateTableCaptionField },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_InsertEquationsCaption'), icon: 'dxre-icon-InsertTableOfEquations', name: Command.CreateEquationCaptionField }
                ]
            },
            {
                type: 'Menu',
                name: Command.InsertTableOfFiguresMenu,
                icon: 'dxre-icon-InsertTableOfCaptions',
                text: formatMessage('XtraRichEditStringId.MenuCmd_InsertTableOfFiguresPlaceholder'),
                alwaysShowText: true,
                items: [
                    { text: formatMessage('XtraRichEditStringId.DefaultStyleName_tableoffigures'), icon: 'dxre-icon-InsertFigureCaption', name: Command.CreateTableOfFiguresField },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_InsertTableOfTables'), icon: 'dxre-icon-InsertTableCaption', name: Command.CreateTableOfTablesField },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_InsertTableOfEquations'), icon: 'dxre-icon-InsertTableOfEquations', name: Command.CreateTableOfEquationsField }
                ]
            },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_UpdateTableOfContents'), icon: 'dxre-icon-UpdateTableOfContents', alwaysShowText: true, name: Command.UpdateTableOfContents, beginGroup: true }
        ];
        const mailMergeToolbarItems = [
            {
                type: 'Menu',
                name: Command.CreateFieldMenu,
                icon: 'dxre-icon-InsertDataField',
                text: formatMessage('ASPxRichEditStringId.MenuCmd_CreateField'),
                alwaysShowText: true,
                items: [
                    { text: formatMessage('ASPxRichEditStringId.MenuCmd_Empty'), name: Command.CreateField },
                    { text: formatMessage('ASPxRichEditStringId.CreateDateField'), name: Command.CreateDateField },
                    { text: formatMessage('ASPxRichEditStringId.CreateTimeField'), name: Command.CreateTimeField },
                    { text: formatMessage('ASPxRichEditStringId.CreatePageField'), name: Command.CreatePageField },
                    { text: formatMessage('ASPxRichEditStringId.CreatePageCountField'), name: Command.InsertPageCountField },
                    { text: formatMessage('ASPxRichEditStringId.CreateEmptyMergeField'), name: Command.CreateEmptyMergeField },
                    { text: formatMessage('ASPxRichEditStringId.CreateEmptyDocVariableField'), name: Command.CreateEmptyDocVariableField }
                ]
            },
            { type: 'Button', text: formatMessage('ASPxRichEditStringId.InsertMergeFieldTitle'), icon: 'dxre-icon-InsertDataField', alwaysShowText: true, name: Command.ShowInsertMergeFieldForm, },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleViewMergedData'), icon: 'dxre-icon-ViewMergedData', alwaysShowText: true, name: Command.ToggleViewMergedData, beginGroup: true, isToggleMode: true },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_ShowAllFieldCodes'), icon: 'dxre-icon-ShowAllFieldCodes', alwaysShowText: true, name: Command.ShowAllFieldCodes },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_ShowAllFieldResults'), icon: 'dxre-icon-ShowAllFieldResults', alwaysShowText: true, name: Command.ShowAllFieldResults },
            { type: 'Button', text: formatMessage('ASPxRichEditStringId.MenuCmd_UpdateAllFields'), icon: 'dxre-icon-UpdateField', alwaysShowText: true, name: Command.UpdateAllFields },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_FirstDataRecord'), icon: 'dxre-icon-First', name: Command.GoToFirstDataRecord, beginGroup: true },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_PreviousDataRecord'), icon: 'dxre-icon-Prev', name: Command.GoToPreviousDataRecord },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_NextDataRecord'), icon: 'dxre-icon-Next', name: Command.GoToNextDataRecord },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_LastDataRecord'), icon: 'dxre-icon-Last', name: Command.GoToLastDataRecord },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_MailMergeSaveDocumentAsCommand'), icon: 'dxre-icon-MailMerge', alwaysShowText: true, name: Command.ShowFinishAndMergeForm, beginGroup: true }
        ];
        const viewToolbarItems = [
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_SimpleView'), icon: 'dxre-icon-SimpleView', alwaysShowText: true, name: Command.SwitchToSimpleView, isToggleMode: true },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_SwitchToPrintLayoutView'), icon: 'dxre-icon-PrintLayoutView', alwaysShowText: true, name: Command.SwitchToPrintLayoutView, isToggleMode: true },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleShowHorizontalRuler'), icon: 'dxre-icon-RulerHorizontal', alwaysShowText: true, name: Command.ToggleShowHorizontalRuler, isToggleMode: true, beginGroup: true },
            { type: 'Button', text: formatMessage('ASPxRichEditStringId.MenuCmd_ToggleFullScreen'), icon: 'dxre-icon-FullScreen', alwaysShowText: true, name: Command.FullScreen, isToggleMode: true, beginGroup: true },
        ];
        return [
            { title: formatMessage('ASPxRichEditStringId.PageFile'), items: fileToolBarItems, id: RibbonTabType.File },
            { title: formatMessage('ASPxRichEditStringId.PageHome'), items: homeToolbarItems, id: RibbonTabType.Home },
            { title: formatMessage('ASPxRichEditStringId.PageInsert'), items: insertToolbarItems, id: RibbonTabType.Insert },
            { title: formatMessage('ASPxRichEditStringId.PagePageLayout'), items: pageLayoutToolbarItems, id: RibbonTabType.PageLayout },
            { title: formatMessage('ASPxRichEditStringId.PageReferences'), items: referencesToolbarItems, id: RibbonTabType.References },
            { title: formatMessage('ASPxRichEditStringId.PageMailings'), items: mailMergeToolbarItems, id: RibbonTabType.MailMerge },
            { title: formatMessage('ASPxRichEditStringId.PageView'), items: viewToolbarItems, id: RibbonTabType.View },
        ];
    }
    static getDefaultContextItemsCategories() {
        loadDefaultMessages();
        const headerAndFooter = [
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_GoToPageHeader'), icon: 'dxre-icon-GoToHeader', name: Command.GoToPageHeader },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_GoToPageFooter'), icon: 'dxre-icon-GoToFooter', name: Command.GoToPageFooter },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_GoToPreviousHeaderFooter'), icon: 'dxre-icon-ShowPrevious', name: Command.GoToPreviousPageHeaderFooter },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_GoToNextHeaderFooter'), icon: 'dxre-icon-ShowNext', name: Command.GoToNextPageHeaderFooter },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleHeaderFooterLinkToPrevious'), icon: 'dxre-icon-LinkToPrevious', name: Command.LinkHeaderFooterToPrevious },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleDifferentFirstPage'), icon: 'dxre-icon-DifferentFirstPage', name: Command.ToggleDifferentFirstPage, beginGroup: true },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleDifferentOddAndEvenPages'), icon: 'dxre-icon-DifferentOddAndEvenPages', name: Command.ToggleDifferentOddAndEvenPages },
            { type: 'NumberBox', text: formatMessage('ASPxRichEditStringId.MenuCmd_HeaderOffset'), name: Command.ChangeHeaderOffset, min: 0, max: 20, step: 0.1, width: 200, beginGroup: true },
            { type: 'NumberBox', text: formatMessage('ASPxRichEditStringId.MenuCmd_FooterOffset'), name: Command.ChangeFooterOffset, min: 0, max: 20, step: 0.1, width: 220, beginGroup: true },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_ClosePageHeaderFooter'), icon: 'dxre-icon-ClearHeaderAndFooter', name: Command.ClosePageHeaderFooter, beginGroup: true },
        ];
        const tableDesign = [
            {
                type: 'Menu',
                name: Command.TableStyleOptionsMenu,
                alwaysShowText: true,
                text: formatMessage('XtraRichEditStringId.Caption_GroupTableStyleOptions'),
                icon: 'dxre-icon-SplitTableCells',
                items: [
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleFirstRow'), name: Command.ToggleFirstRow },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleLastRow'), name: Command.ToggleLastRow },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleBandedRows'), name: Command.ToggleBandedRows },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleFirstColumn'), name: Command.ToggleFirstColumn, beginGroup: true },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleLastColumn'), name: Command.ToggleLastColumn },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleBandedColumn'), name: Command.ToggleBandedColumn }
                ]
            },
            { type: 'SelectBox', width: 180, name: Command.ApplyTableStyle, dataSource: Constants.getTableStylesList(),
                displayExpr: 'text', valueExpr: 'value', beginGroup: true },
            {
                type: 'SelectBox', width: 100, displayExpr: 'text', valueExpr: 'value', name: Command.ChangeTableBorderStyleRepositoryItem, beginGroup: true,
                dataSource: [
                    { text: formatMessage('ASPxRichEditStringId.UnderlineType_None'), value: BorderLineStyle.None },
                    { text: formatMessage('ASPxRichEditStringId.UnderlineType_Single'), value: BorderLineStyle.Single },
                    { text: formatMessage('ASPxRichEditStringId.UnderlineType_Dotted'), value: BorderLineStyle.Dotted },
                    { text: formatMessage('ASPxRichEditStringId.UnderlineType_Dashed'), value: BorderLineStyle.Dashed },
                    { text: formatMessage('ASPxRichEditStringId.UnderlineType_Double'), value: BorderLineStyle.Double }
                ]
            },
            {
                type: 'SelectBox', width: 110, displayExpr: 'text', valueExpr: 'value', name: Command.ChangeTableBorderWidthRepositoryItem, beginGroup: true,
                dataSource: [
                    { text: '0.25 pt', value: 5 },
                    { text: '0.5 pt', value: 10 },
                    { text: '0.75 pt', value: 15 },
                    { text: '1 pt', value: 20 },
                    { text: '1.5 pt', value: 30 },
                    { text: '2 pt', value: 40 }
                ]
            },
            { type: 'ColorBox', text: formatMessage('XtraRichEditStringId.MenuCmd_ChangeCurrentBorderRepositoryItemColor'), value: '#000', name: Command.ChangeTableBorderColorRepositoryItem, beginGroup: true },
            {
                type: 'Menu',
                name: Command.BordersMenu,
                text: formatMessage('ASPxRichEditStringId.BorderShading_Borders'),
                alwaysShowText: true,
                icon: 'dxre-icon-BordersAll',
                beginGroup: true,
                items: [
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleTableCellsBottomBorder'), icon: 'dxre-icon-BorderBottom', name: Command.ToggleTableCellsBottomBorder },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleTableCellsTopBorder'), icon: 'dxre-icon-BorderTop', name: Command.ToggleTableCellsTopBorder },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleTableCellsLeftBorder'), icon: 'dxre-icon-BorderLeft', name: Command.ToggleTableCellsLeftBorder },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleTableCellsRightBorder'), icon: 'dxre-icon-BorderRight', name: Command.ToggleTableCellsRightBorder },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ResetTableCellsBorders'), icon: 'dxre-icon-BorderNone', name: Command.ToggleTableCellNoBorder, beginGroup: true },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleTableCellsAllBorders'), icon: 'dxre-icon-BordersAll', name: Command.ToggleTableCellAllBorders },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleTableCellsOutsideBorder'), icon: 'dxre-icon-BorderOutside', name: Command.ToggleTableCellOutsideBorders },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleTableCellsInsideBorder'), icon: 'dxre-icon-BordersInside', name: Command.ToggleTableCellInsideBorders },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleTableCellsInsideHorizontalBorder'), icon: 'dxre-icon-BorderInsideHorizontal', name: Command.ToggleTableCellInsideHorizontalBorders, beginGroup: true },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleTableCellsInsideVerticalBorder'), icon: 'dxre-icon-BorderInsideVertical', name: Command.ToggleTableCellInsideVerticalBorders },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleShowTableGridLines'), icon: 'dxre-icon-ViewTableGridlines', name: Command.ToggleShowTableGridLines, beginGroup: true }
                ]
            },
            { type: 'ColorBox', text: formatMessage('ASPxRichEditStringId.BorderShading_Shading'), value: '#fff', name: Command.ChangeTableCellShading, beginGroup: true }
        ];
        const tableLayout = [
            {
                type: 'Menu',
                name: Command.SelectMenu,
                text: formatMessage('XtraRichEditStringId.MenuCmd_SelectTableElements'),
                icon: 'dxre-icon-Select',
                items: [
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_SelectTableCell'), icon: 'dxre-icon-SelectTableCell', name: Command.SelectTableCell },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_SelectTableColumns'), icon: 'dxre-icon-SelectTableColumn', name: Command.SelectTableColumn },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_SelectTableRow'), icon: 'dxre-icon-SelectTableRow', name: Command.SelectTableRow },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_SelectTable'), icon: 'dxre-icon-SelectTable', name: Command.SelectTable }
                ]
            },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleShowTableGridLines'), icon: 'dxre-icon-ViewTableGridlines', alwaysShowText: true, name: Command.ToggleShowTableGridLines, isToggleMode: true },
            {
                type: 'Menu',
                name: Command.DeleteMenu,
                text: formatMessage('XtraRichEditStringId.MenuCmd_DeleteTableElements'),
                icon: 'dxre-icon-DeleteTable',
                beginGroup: true,
                alwaysShowText: true,
                items: [
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_DeleteTableCells'), icon: 'dxre-icon-DeleteTableCells', name: Command.ShowDeleteTableCellsForm },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_DeleteTableColumns'), icon: 'dxre-icon-DeleteTableColumns', name: Command.DeleteTableColumns },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_DeleteTableRows'), icon: 'dxre-icon-DeleteTableRows', name: Command.DeleteTableRows },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_DeleteTable'), icon: 'dxre-icon-DeleteTable', name: Command.DeleteTable }
                ]
            },
            {
                type: 'Menu',
                name: Command.InsertMenu,
                text: formatMessage('ASPxRichEditStringId.InsertButton'),
                icon: 'dxre-icon-InsertTableRowsBelow',
                alwaysShowText: true,
                items: [
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_InsertTableRowAbove'), icon: 'dxre-icon-InsertTableRowsAbove', name: Command.InsertTableRowAbove },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_InsertTableRowBelow'), icon: 'dxre-icon-InsertTableRowsBelow', name: Command.InsertTableRowBelow },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_InsertTableColumnToTheLeft'), icon: 'dxre-icon-InsertTableColumnsToTheLeft', name: Command.InsertTableColumnToTheLeft },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_InsertTableColumnToTheRight'), icon: 'dxre-icon-InsertTableColumnsToTheRight', name: Command.InsertTableColumnToTheRight }
                ]
            },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_MergeTableCells'), icon: 'dxre-icon-MergeTableCells', alwaysShowText: true, name: Command.MergeTableCells, beginGroup: true },
            { type: 'Button', text: formatMessage('XtraRichEditStringId.MenuCmd_SplitTableCellsMenuItem'), icon: 'dxre-icon-SplitTable', alwaysShowText: true, name: Command.ShowSplitTableCellsForm },
            {
                type: 'Menu',
                name: Command.AutoFitMenu,
                text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleTableAutoFitPlaceholder'),
                icon: 'dxre-icon-TableAutoFitContents',
                beginGroup: true,
                alwaysShowText: true,
                items: [
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleTableAutoFitContents'), icon: 'dxre-icon-TableAutoFitContents', name: Command.SetAutoFitContents },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleTableAutoFitWindow'), icon: 'dxre-icon-TableAutoFitWindow', name: Command.SetAutoFitWindow },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleTableFixedColumnWidth'), icon: 'dxre-icon-TableFixedColumnWidth', name: Command.SetFixedColumnWidth }
                ]
            },
            {
                type: 'Menu',
                name: Command.AlignmentMenu,
                text: formatMessage('ASPxRichEditStringId.Alignment'),
                icon: 'dxre-icon-AlignTopLeft',
                alwaysShowText: true,
                beginGroup: true,
                items: [
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleTableCellsTopLeftAlignment'), icon: 'dxre-icon-AlignTopLeft', name: Command.TableCellAlignTopLeft },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleTableCellsTopCenterAlignment'), icon: 'dxre-icon-AlignTopCenter', name: Command.TableCellAlignTopCenter },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleTableCellsTopRightAlignment'), icon: 'dxre-icon-AlignTopRight', name: Command.TableCellAlignTopRight },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleTableCellsMiddleLeftAlignment'), icon: 'dxre-icon-AlignMiddleLeft', name: Command.TableCellAlignMiddleLeft, beginGroup: true },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleTableCellsMiddleCenterAlignment'), icon: 'dxre-icon-AlignMiddleCenter', name: Command.TableCellAlignMiddleCenter },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleTableCellsMiddleRightAlignment'), icon: 'dxre-icon-AlignMiddleRight', name: Command.TableCellAlignMiddleRight },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleTableCellsBottomLeftAlignment'), icon: 'dxre-icon-AlignBottomLeft', name: Command.TableCellAlignBottomLeft, beginGroup: true },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleTableCellsBottomCenterAlignment'), icon: 'dxre-icon-AlignBottomCenter', name: Command.TableCellAlignBottomCenter },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_ToggleTableCellsBottomRightAlignment'), icon: 'dxre-icon-AlignBottomRight', name: Command.TableCellAlignBottomRight }
                ]
            },
        ];
        const floatingObjects = [
            { type: 'ColorBox', text: formatMessage('XtraRichEditStringId.MenuCmd_ChangeFloatingObjectFillColor'), value: '#fff', name: Command.ChangeFloatingObjectFillColor, beginGroup: true },
            { type: 'ColorBox', text: formatMessage('XtraRichEditStringId.MenuCmd_ChangeFloatingObjectOutlineColor'), value: '#000', name: Command.ChangeFloatingObjectOutlineColor, beginGroup: true },
            {
                type: 'SelectBox', width: 110, displayExpr: 'text', valueExpr: 'value', name: Command.ChangeFloatingObjectOutlineWidth, beginGroup: true,
                dataSource: [
                    { text: '0 pt', value: 0 },
                    { text: '0.25 pt', value: 5 },
                    { text: '0.5 pt', value: 10 },
                    { text: '0.75 pt', value: 15 },
                    { text: '1 pt', value: 20 },
                    { text: '1.5 pt', value: 30 },
                    { text: '2.25 pt', value: 45 },
                    { text: '3 pt', value: 60 },
                    { text: '4.5 pt', value: 90 },
                    { text: '6 pt', value: 120 },
                ]
            },
            {
                type: 'Menu',
                name: Command.WrapTextMenu,
                text: formatMessage('XtraRichEditStringId.MenuCmd_ChangeFloatingObjectTextWrapType'),
                icon: 'dxre-icon-TextWrapSquare',
                alwaysShowText: true,
                beginGroup: true,
                items: [
                    { text: formatMessage('ASPxRichEditStringId.LayoutOptions_Inline'), icon: 'dxre-icon-TextWrapInline', name: Command.SetFloatingObjectInlineTextWrapType },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_SetFloatingObjectSquareTextWrapType'), icon: 'dxre-icon-TextWrapSquare', name: Command.SetFloatingObjectSquareTextWrapType },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_SetFloatingObjectTightTextWrapType'), icon: 'dxre-icon-TextWrapTight', name: Command.SetFloatingObjectTightTextWrapType },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_SetFloatingObjectThroughTextWrapType'), icon: 'dxre-icon-TextWrapThrough', name: Command.SetFloatingObjectThroughTextWrapType },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_SetFloatingObjectTopAndBottomTextWrapType'), icon: 'dxre-icon-TextWrapTopAndBottom', name: Command.SetFloatingObjectTopAndBottomTextWrapType },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_SetFloatingObjectBehindTextWrapType'), icon: 'dxre-icon-TextWrapBehind', name: Command.SetFloatingObjectBehindTextWrapType },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_SetFloatingObjectInFrontOfTextWrapType'), icon: 'dxre-icon-TextWrapInFrontOfText', name: Command.SetFloatingObjectInFrontOfTextWrapType },
                ]
            },
            {
                type: 'Menu',
                name: Command.PositionMenu,
                text: formatMessage('ASPxRichEditStringId.GroupHeaderFooterToolsDesignPosition'),
                icon: 'dxre-icon-AlignFloatingObjectTopRight',
                alwaysShowText: true,
                items: [
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_SetFloatingObjectTopLeftAlignment'), icon: 'dxre-icon-AlignFloatingObjectTopLeft', name: Command.SetFloatingObjectTopLeftAlignment },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_SetFloatingObjectTopCenterAlignment'), icon: 'dxre-icon-AlignFloatingObjectTopCenter', name: Command.SetFloatingObjectTopCenterAlignment },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_SetFloatingObjectTopRightAlignment'), icon: 'dxre-icon-AlignFloatingObjectTopRight', name: Command.SetFloatingObjectTopRightAlignment },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_SetFloatingObjectMiddleLeftAlignment'), icon: 'dxre-icon-AlignFloatingObjectMiddleLeft', name: Command.SetFloatingObjectMiddleLeftAlignment, beginGroup: true },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_SetFloatingObjectMiddleCenterAlignment'), icon: 'dxre-icon-AlignFloatingObjectMiddleCenter', name: Command.SetFloatingObjectMiddleCenterAlignment },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_SetFloatingObjectMiddleRightAlignment'), icon: 'dxre-icon-AlignFloatingObjectMiddleRight', name: Command.SetFloatingObjectMiddleRightAlignment },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_SetFloatingObjectBottomLeftAlignment'), icon: 'dxre-icon-AlignFloatingObjectBottomLeft', name: Command.SetFloatingObjectBottomLeftAlignment, beginGroup: true },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_SetFloatingObjectBottomCenterAlignment'), icon: 'dxre-icon-AlignFloatingObjectBottomCenter', name: Command.SetFloatingObjectBottomCenterAlignment },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_SetFloatingObjectBottomRightAlignment'), icon: 'dxre-icon-AlignFloatingObjectBottomRight', name: Command.SetFloatingObjectBottomRightAlignment },
                ]
            },
            {
                type: 'Menu',
                name: Command.BringForwardMenu,
                text: formatMessage("OfficeStringId.MenuCmd_FloatingObjectBringForward"),
                icon: 'dxre-icon-FloatingObjectBringForward',
                alwaysShowText: true,
                items: [
                    { text: formatMessage("OfficeStringId.MenuCmd_FloatingObjectBringForward"), icon: 'dxre-icon-FloatingObjectBringForward', name: Command.FloatingObjectBringForward },
                    { text: formatMessage("OfficeStringId.MenuCmd_FloatingObjectBringToFront"), icon: 'dxre-icon-FloatingObjectBringToFront', name: Command.FloatingObjectBringToFront },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_FloatingObjectBringInFrontOfText'), icon: 'dxre-icon-FloatingObjectBringInFrontOfText', name: Command.FloatingObjectBringInFrontOfText }
                ]
            },
            {
                type: 'Menu',
                name: Command.SendBackwardMenu,
                text: formatMessage("OfficeStringId.MenuCmd_FloatingObjectSendBackward"),
                icon: 'dxre-icon-FloatingObjectSendBackward',
                alwaysShowText: true,
                items: [
                    { text: formatMessage("OfficeStringId.MenuCmd_FloatingObjectSendBackward"), icon: 'dxre-icon-FloatingObjectSendBackward', name: Command.FloatingObjectSendBackward },
                    { text: formatMessage("OfficeStringId.MenuCmd_FloatingObjectSendToBack"), icon: 'dxre-icon-FloatingObjectSendToBack', name: Command.FloatingObjectSendToBack },
                    { text: formatMessage('XtraRichEditStringId.MenuCmd_FloatingObjectSendBehindText'), icon: 'dxre-icon-FloatingObjectSendBehindText', name: Command.FloatingObjectSendBehindText }
                ]
            },
        ];
        return [
            {
                name: Command.ContextItem_HeadersFooters,
                items: [
                    { title: formatMessage('ASPxRichEditStringId.PageHeaderAndFooter'), items: headerAndFooter, id: RibbonTabType.HeadersFooters }
                ]
            },
            {
                name: Command.ContextItem_Tables,
                items: [
                    { title: formatMessage('ASPxRichEditStringId.PageTableDesign'), items: tableDesign, id: RibbonTabType.TableDesign },
                    { title: formatMessage('ASPxRichEditStringId.PageTableLayout'), items: tableLayout, id: RibbonTabType.TableLayout }
                ]
            },
            {
                name: Command.ContextItem_FloatingObjects,
                items: [
                    { title: formatMessage('ASPxRichEditStringId.PageFloatingObjects'), items: floatingObjects, id: RibbonTabType.FloatingObjectsFormat }
                ]
            }
        ];
    }
}
