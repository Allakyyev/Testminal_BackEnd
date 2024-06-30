import { ApiParametersChecker } from '../../api-utils/api-utils/parameter-checker';
import { RichEditClientCommand } from '../../base/commands/client-command';
import { BorderLineStyle } from '../../core/model/borders/enums';
import { ModelParametersChecker } from '../../model-api/api-utils/model-parameter-checker';
import { ContextMenuCommandId, FileTabCommandId, FloatingObjectsFormatTabCommandId, HeaderAndFooterTabCommandId, HomeTabCommandId, InsertTabCommandId, MailMergeTabCommandId, PageLayoutTabCommandId, ReferencesTabCommandId, TableDesignTabCommandId, TableLayoutTabCommandId, ViewTabCommandId } from '../public/commands/enum';
export function executeApiCommandCore(commandManager, commandId, parameter) {
    const modelCommandId = commandId;
    const command = commandManager.getCommand(modelCommandId);
    if (!command)
        return false;
    let allowExecute = true;
    switch (commandId) {
        case FileTabCommandId.CreateDocument:
            parameter = undefined;
            break;
        case FileTabCommandId.OpenDocument:
            parameter = undefined;
            break;
        case FileTabCommandId.ExportDocument:
            parameter = undefined;
            break;
        case FileTabCommandId.DownloadDocumentMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case FileTabCommandId.DownloadDocx:
            parameter = undefined;
            break;
        case FileTabCommandId.DownloadRtf:
            parameter = undefined;
            break;
        case FileTabCommandId.DownloadTxt:
            parameter = undefined;
            break;
        case FileTabCommandId.PrintDocument:
            parameter = undefined;
            break;
        case HomeTabCommandId.ChangeCaseMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case HomeTabCommandId.AlignParagraphMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case HomeTabCommandId.LineSpacingMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case HomeTabCommandId.Undo:
            parameter = undefined;
            break;
        case HomeTabCommandId.Redo:
            parameter = undefined;
            break;
        case HomeTabCommandId.Cut:
            parameter = undefined;
            break;
        case HomeTabCommandId.Copy:
            parameter = undefined;
            break;
        case HomeTabCommandId.Paste:
            parameter = undefined;
            break;
        case HomeTabCommandId.ChangeFontName: {
            const name = ApiParametersChecker.check(parameter, 2, false, [
                ApiParametersChecker.stringDescriptor('parameter', (val) => val, false)
            ]);
            parameter = name;
            break;
        }
        case HomeTabCommandId.ChangeFontSize: {
            const size = ApiParametersChecker.check(parameter, 2, false, [
                ApiParametersChecker.numberDescriptor('parameter', val => val, 0)
            ]);
            parameter = size;
            break;
        }
        case HomeTabCommandId.IncreaseFontSize:
            parameter = undefined;
            break;
        case HomeTabCommandId.DecreaseFontSize:
            parameter = undefined;
            break;
        case HomeTabCommandId.ChangeFontForeColor: {
            const color = ApiParametersChecker.check(parameter, 2, false, ModelParametersChecker.colorDescriptors('parameter'));
            parameter = color;
            break;
        }
        case HomeTabCommandId.ShowFontDialog:
            parameter = undefined;
            break;
        case HomeTabCommandId.ToggleFontBold:
        case HomeTabCommandId.ToggleFontItalic:
        case HomeTabCommandId.ToggleFontUnderline:
        case HomeTabCommandId.ToggleFontDoubleUnderline:
        case HomeTabCommandId.ToggleFontStrikeout:
        case HomeTabCommandId.ToggleFontSubscript:
        case HomeTabCommandId.ToggleFontSuperscript:
        case HomeTabCommandId.CapitalizationToggleCase:
        case HomeTabCommandId.ToggleBulletedList:
        case HomeTabCommandId.ToggleNumberedList:
        case HomeTabCommandId.ToggleMultilevelList:
        case HomeTabCommandId.ToggleParagraphAlignmentLeft:
        case HomeTabCommandId.ToggleParagraphAlignmentCenter:
        case HomeTabCommandId.ToggleParagraphAlignmentRight:
        case HomeTabCommandId.ToggleParagraphAlignmentJustify:
        case HomeTabCommandId.ToggleShowHiddenSymbols:
            {
                parameter = getRevertValue(command);
                break;
            }
        case HomeTabCommandId.CapitalizationSentenceCase:
            parameter = undefined;
            break;
        case HomeTabCommandId.CapitalizationUpperCase:
            parameter = undefined;
            break;
        case HomeTabCommandId.CapitalizationLowerCase:
            parameter = undefined;
            break;
        case HomeTabCommandId.CapitalizeEachWordCase:
            parameter = undefined;
            break;
        case HomeTabCommandId.ClearFormatting:
            parameter = undefined;
            break;
        case HomeTabCommandId.SetSingleParagraphSpacing:
            parameter = undefined;
            break;
        case HomeTabCommandId.SetSesquialteralParagraphSpacing:
            parameter = undefined;
            break;
        case HomeTabCommandId.SetDoubleParagraphSpacing:
            parameter = undefined;
            break;
        case HomeTabCommandId.AddSpacingBeforeParagraph:
            parameter = undefined;
            break;
        case HomeTabCommandId.AddSpacingAfterParagraph:
            parameter = undefined;
            break;
        case HomeTabCommandId.RemoveSpacingBeforeParagraph:
            parameter = undefined;
            break;
        case HomeTabCommandId.RemoveSpacingAfterParagraph:
            parameter = undefined;
            break;
        case HomeTabCommandId.ChangeShading: {
            const color = ApiParametersChecker.check(parameter, 2, false, ModelParametersChecker.colorDescriptors('parameter'));
            parameter = color;
            break;
        }
        case HomeTabCommandId.ChangeStyle: {
            const styleName = ApiParametersChecker.check(parameter, 2, false, [
                ApiParametersChecker.stringDescriptor('parameter', (val) => val, false)
            ]);
            parameter = styleName;
            break;
        }
        case HomeTabCommandId.Find:
            parameter = undefined;
            break;
        case HomeTabCommandId.Replace:
            parameter = undefined;
            break;
        case HomeTabCommandId.ChangeFontHighlightColor: {
            const color = ApiParametersChecker.check(parameter, 2, false, ModelParametersChecker.colorDescriptors('parameter'));
            parameter = color;
            break;
        }
        case InsertTabCommandId.ShowInsertTableDialog:
            parameter = undefined;
            break;
        case InsertTabCommandId.InsertPicture:
            parameter = undefined;
            break;
        case InsertTabCommandId.ShowBookmarkDialog:
            parameter = undefined;
            break;
        case InsertTabCommandId.ShowHyperlinkDialog:
            parameter = undefined;
            break;
        case InsertTabCommandId.InsertHeader:
            parameter = undefined;
            break;
        case InsertTabCommandId.InsertFooter:
            parameter = undefined;
            break;
        case InsertTabCommandId.InsertPageNumberField:
            parameter = undefined;
            break;
        case InsertTabCommandId.InsertPageCountField:
            parameter = undefined;
            break;
        case InsertTabCommandId.InsertFloatingTextBox:
            parameter = undefined;
            break;
        case PageLayoutTabCommandId.MarginsMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case PageLayoutTabCommandId.OrientationMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case PageLayoutTabCommandId.SizeMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case PageLayoutTabCommandId.ColumnsMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case PageLayoutTabCommandId.BreaksMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case PageLayoutTabCommandId.SetSectionNormalPageMargins:
            parameter = undefined;
            break;
        case PageLayoutTabCommandId.SetSectionNarrowPageMargins:
            parameter = undefined;
            break;
        case PageLayoutTabCommandId.SetSectionModeratePageMargins:
            parameter = undefined;
            break;
        case PageLayoutTabCommandId.SetSectionWidePageMargins:
            parameter = undefined;
            break;
        case PageLayoutTabCommandId.ShowMarginsPageSetupDialog:
            parameter = undefined;
            break;
        case PageLayoutTabCommandId.SetPortraitPageOrientation:
            parameter = undefined;
            break;
        case PageLayoutTabCommandId.SetLandscapePageOrientation:
            parameter = undefined;
            break;
        case PageLayoutTabCommandId.SetSectionLetterPaperSize:
            parameter = undefined;
            break;
        case PageLayoutTabCommandId.SetSectionLegalPaperSize:
            parameter = undefined;
            break;
        case PageLayoutTabCommandId.SetSectionFolioPaperSize:
            parameter = undefined;
            break;
        case PageLayoutTabCommandId.SetSectionA4PaperSize:
            parameter = undefined;
            break;
        case PageLayoutTabCommandId.SetSectionB5PaperSize:
            parameter = undefined;
            break;
        case PageLayoutTabCommandId.SetSectionExecutivePaperSize:
            parameter = undefined;
            break;
        case PageLayoutTabCommandId.SetSectionA5PaperSize:
            parameter = undefined;
            break;
        case PageLayoutTabCommandId.SetSectionA6PaperSize:
            parameter = undefined;
            break;
        case PageLayoutTabCommandId.ShowPageSetupDialog:
            parameter = undefined;
            break;
        case PageLayoutTabCommandId.SetSectionOneColumn:
            parameter = undefined;
            break;
        case PageLayoutTabCommandId.SetSectionTwoColumns:
            parameter = undefined;
            break;
        case PageLayoutTabCommandId.SetSectionThreeColumns:
            parameter = undefined;
            break;
        case PageLayoutTabCommandId.InsertPageBreak:
            parameter = undefined;
            break;
        case PageLayoutTabCommandId.InsertColumnBreak:
            parameter = undefined;
            break;
        case PageLayoutTabCommandId.InsertSectionBreakNextPage:
            parameter = undefined;
            break;
        case PageLayoutTabCommandId.InsertSectionBreakEvenPage:
            parameter = undefined;
            break;
        case PageLayoutTabCommandId.InsertSectionBreakOddPage:
            parameter = undefined;
            break;
        case PageLayoutTabCommandId.ChangePageColor: {
            const color = ApiParametersChecker.check(parameter, 2, false, ModelParametersChecker.colorDescriptors('parameter'));
            parameter = color;
            break;
        }
        case ReferencesTabCommandId.AddTextMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case ReferencesTabCommandId.InsertCaptionMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case ReferencesTabCommandId.InsertTableOfFiguresMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case ReferencesTabCommandId.InsertTableOfContents:
            parameter = undefined;
            break;
        case ReferencesTabCommandId.SetParagraphBodyTextLevel:
            parameter = undefined;
            break;
        case ReferencesTabCommandId.SetParagraphHeading1Level:
            parameter = undefined;
            break;
        case ReferencesTabCommandId.SetParagraphHeading2Level:
            parameter = undefined;
            break;
        case ReferencesTabCommandId.SetParagraphHeading3Level:
            parameter = undefined;
            break;
        case ReferencesTabCommandId.SetParagraphHeading4Level:
            parameter = undefined;
            break;
        case ReferencesTabCommandId.SetParagraphHeading5Level:
            parameter = undefined;
            break;
        case ReferencesTabCommandId.SetParagraphHeading6Level:
            parameter = undefined;
            break;
        case ReferencesTabCommandId.SetParagraphHeading7Level:
            parameter = undefined;
            break;
        case ReferencesTabCommandId.SetParagraphHeading8Level:
            parameter = undefined;
            break;
        case ReferencesTabCommandId.SetParagraphHeading9Level:
            parameter = undefined;
            break;
        case ReferencesTabCommandId.CreateFigureCaptionField:
            parameter = undefined;
            break;
        case ReferencesTabCommandId.CreateTableCaptionField:
            parameter = undefined;
            break;
        case ReferencesTabCommandId.CreateEquationCaptionField:
            parameter = undefined;
            break;
        case ReferencesTabCommandId.CreateTableOfFiguresField:
            parameter = undefined;
            break;
        case ReferencesTabCommandId.CreateTableOfTablesField:
            parameter = undefined;
            break;
        case ReferencesTabCommandId.CreateTableOfEquationsField:
            parameter = undefined;
            break;
        case ReferencesTabCommandId.UpdateTableOfContents:
            parameter = undefined;
            break;
        case MailMergeTabCommandId.CreateFieldMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case MailMergeTabCommandId.CreateField:
            parameter = undefined;
            break;
        case MailMergeTabCommandId.CreateDateField:
            parameter = undefined;
            break;
        case MailMergeTabCommandId.CreateTimeField:
            parameter = undefined;
            break;
        case MailMergeTabCommandId.CreatePageField:
            parameter = undefined;
            break;
        case MailMergeTabCommandId.CreateNumPagesField:
            parameter = undefined;
            break;
        case MailMergeTabCommandId.CreateEmptyMergeField:
            parameter = undefined;
            break;
        case MailMergeTabCommandId.CreateEmptyDocVariableField:
            parameter = undefined;
            break;
        case MailMergeTabCommandId.ShowInsertMergeFieldDialog:
            parameter = undefined;
            break;
        case MailMergeTabCommandId.ToggleViewMergedData:
            parameter = undefined;
            break;
        case MailMergeTabCommandId.ShowAllFieldCodes:
            parameter = undefined;
            break;
        case MailMergeTabCommandId.ShowAllFieldResults:
            parameter = undefined;
            break;
        case MailMergeTabCommandId.UpdateAllFields:
            parameter = undefined;
            break;
        case MailMergeTabCommandId.GoToFirstDataRecord:
            parameter = undefined;
            break;
        case MailMergeTabCommandId.GoToPreviousDataRecord:
            parameter = undefined;
            break;
        case MailMergeTabCommandId.GoToNextDataRecord:
            parameter = undefined;
            break;
        case MailMergeTabCommandId.GoToLastDataRecord:
            parameter = undefined;
            break;
        case MailMergeTabCommandId.ShowMailMergeDialog:
            parameter = undefined;
            break;
        case ViewTabCommandId.SwitchToSimpleView:
            parameter = undefined;
            break;
        case ViewTabCommandId.SwitchToPrintLayout:
            parameter = undefined;
            break;
        case ViewTabCommandId.ToggleShowHorizontalRuler:
            parameter = undefined;
            break;
        case ViewTabCommandId.ToggleFullScreen:
            parameter = undefined;
            break;
        case HeaderAndFooterTabCommandId.GoToPageHeader:
            parameter = undefined;
            break;
        case HeaderAndFooterTabCommandId.GoToPageFooter:
            parameter = undefined;
            break;
        case HeaderAndFooterTabCommandId.GoToPreviousPageHeaderFooter:
            parameter = undefined;
            break;
        case HeaderAndFooterTabCommandId.GoToNextPageHeaderFooter:
            parameter = undefined;
            break;
        case HeaderAndFooterTabCommandId.LinkHeaderFooterToPrevious:
            parameter = undefined;
            break;
        case HeaderAndFooterTabCommandId.ToggleDifferentFirstPage:
            parameter = undefined;
            break;
        case HeaderAndFooterTabCommandId.ToggleDifferentOddAndEvenPages:
            parameter = undefined;
            break;
        case HeaderAndFooterTabCommandId.ChangeHeaderOffset: {
            parameter = getNumberParameter(parameter);
            break;
        }
        case HeaderAndFooterTabCommandId.ChangeFooterOffset: {
            parameter = getNumberParameter(parameter);
            break;
        }
        case HeaderAndFooterTabCommandId.CloseHeaderFooter:
            parameter = undefined;
            break;
        case TableDesignTabCommandId.TableStyleOptionsMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case TableDesignTabCommandId.BordersMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case TableDesignTabCommandId.ToggleFirstRow:
            parameter = undefined;
            break;
        case TableDesignTabCommandId.ToggleLastRow:
            parameter = undefined;
            break;
        case TableDesignTabCommandId.ToggleBandedRows:
            parameter = undefined;
            break;
        case TableDesignTabCommandId.ToggleFirstColumn:
            parameter = undefined;
            break;
        case TableDesignTabCommandId.ToggleLastColumn:
            parameter = undefined;
            break;
        case TableDesignTabCommandId.ToggleBandedColumn:
            parameter = undefined;
            break;
        case TableDesignTabCommandId.ChangeTableStyle: {
            const styleName = ApiParametersChecker.check(parameter, 2, false, [
                ApiParametersChecker.stringDescriptor('parameter', (val) => val, false)
            ]);
            parameter = styleName;
            break;
        }
        case TableDesignTabCommandId.ChangeTableRepositoryItemBorderStyle: {
            const style = ApiParametersChecker.check(parameter, 2, false, [
                ApiParametersChecker.stringDescriptor('parameter', (val) => {
                    val = val.toLowerCase();
                    switch (val) {
                        case 'none': break;
                        case 'dashed': break;
                        case 'double': break;
                        case 'dotted': break;
                        case 'single': break;
                        default: val = 'single';
                    }
                    return val;
                }, false)
            ]);
            switch (style) {
                case 'none':
                    parameter = BorderLineStyle.None;
                    break;
                case 'dashed':
                    parameter = BorderLineStyle.Dashed;
                    break;
                case 'double':
                    parameter = BorderLineStyle.Double;
                    break;
                case 'dotted':
                    parameter = BorderLineStyle.Dotted;
                    break;
                case 'single':
                    parameter = BorderLineStyle.Single;
                    break;
                default: parameter = BorderLineStyle.Single;
            }
            break;
        }
        case TableDesignTabCommandId.ChangeTableRepositoryItemBorderWidth: {
            const width = ApiParametersChecker.check(parameter, 2, false, [
                ApiParametersChecker.numberDescriptor('parameter', val => val, 0)
            ]);
            parameter = width;
            break;
        }
        case TableDesignTabCommandId.ChangeTableRepositoryItemBorderColor: {
            const color = ApiParametersChecker.check(parameter, 2, false, ModelParametersChecker.colorDescriptors('parameter'));
            parameter = color;
            break;
        }
        case TableDesignTabCommandId.ToggleTableCellsBottomBorder:
            parameter = undefined;
            break;
        case TableDesignTabCommandId.ToggleTableCellsTopBorder:
            parameter = undefined;
            break;
        case TableDesignTabCommandId.ToggleTableCellsLeftBorder:
            parameter = undefined;
            break;
        case TableDesignTabCommandId.ToggleTableCellsRightBorder:
            parameter = undefined;
            break;
        case TableDesignTabCommandId.ToggleTableCellNoBorder:
            parameter = undefined;
            break;
        case TableDesignTabCommandId.ToggleTableCellAllBorders:
            parameter = undefined;
            break;
        case TableDesignTabCommandId.ToggleTableCellOutsideBorders:
            parameter = undefined;
            break;
        case TableDesignTabCommandId.ToggleTableCellInsideBorders:
            parameter = undefined;
            break;
        case TableDesignTabCommandId.ToggleTableCellInsideHorizontalBorders:
            parameter = undefined;
            break;
        case TableDesignTabCommandId.ToggleTableCellInsideVerticalBorders:
            parameter = undefined;
            break;
        case TableDesignTabCommandId.ToggleTableViewGridlines:
            parameter = undefined;
            break;
        case TableDesignTabCommandId.ChangeTableCellShading: {
            const color = ApiParametersChecker.check(parameter, 2, false, ModelParametersChecker.colorDescriptors('parameter'));
            parameter = color;
            break;
        }
        case TableLayoutTabCommandId.SelectMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case TableLayoutTabCommandId.DeleteMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case TableLayoutTabCommandId.InsertMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case TableLayoutTabCommandId.AutoFitMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case TableLayoutTabCommandId.AlignmentMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case TableLayoutTabCommandId.SelectTableCell:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.SelectTableColumn:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.SelectTableRow:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.SelectTable:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.ToggleShowTableGridLines:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.ShowDeleteCellsDialog:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.DeleteTableColumns:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.DeleteTableRows:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.DeleteTable:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.InsertTableRowAbove:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.InsertTableRowBelow:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.InsertTableColumnToTheLeft:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.InsertTableColumnToTheRight:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.MergeTableCells:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.ShowSplitCellsDialog:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.SetAutoFitContents:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.SetAutoFitWindow:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.SetFixedColumnWidth:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.TableCellAlignTopLeft:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.TableCellAlignTopCenter:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.TableCellAlignTopRight:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.TableCellAlignMiddleLeft:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.TableCellAlignMiddleCenter:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.TableCellAlignMiddleRight:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.TableCellAlignBottomLeft:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.TableCellAlignBottomCenter:
            parameter = undefined;
            break;
        case TableLayoutTabCommandId.TableCellAlignBottomRight:
            parameter = undefined;
            break;
        case FloatingObjectsFormatTabCommandId.WrapTextMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case FloatingObjectsFormatTabCommandId.PositionMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case FloatingObjectsFormatTabCommandId.BringToFrontMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case FloatingObjectsFormatTabCommandId.SendToBackMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case FloatingObjectsFormatTabCommandId.ChangeFloatingObjectFillColor: {
            const color = ApiParametersChecker.check(parameter, 2, false, ModelParametersChecker.colorDescriptors('parameter'));
            parameter = color;
            break;
        }
        case FloatingObjectsFormatTabCommandId.ChangeFloatingObjectOutlineColor: {
            const color = ApiParametersChecker.check(parameter, 2, false, ModelParametersChecker.colorDescriptors('parameter'));
            parameter = color;
            break;
        }
        case FloatingObjectsFormatTabCommandId.ChangeFloatingObjectOutlineWidth: {
            const width = ApiParametersChecker.check(parameter, 2, false, [
                ApiParametersChecker.numberDescriptor('parameter', val => val, 0)
            ]);
            parameter = width;
            break;
        }
        case FloatingObjectsFormatTabCommandId.SetFloatingObjectInlineTextWrapType:
            parameter = undefined;
            break;
        case FloatingObjectsFormatTabCommandId.SetFloatingObjectSquareTextWrapType:
            parameter = undefined;
            break;
        case FloatingObjectsFormatTabCommandId.SetFloatingObjectTightTextWrapType:
            parameter = undefined;
            break;
        case FloatingObjectsFormatTabCommandId.SetFloatingObjectThroughTextWrapType:
            parameter = undefined;
            break;
        case FloatingObjectsFormatTabCommandId.SetFloatingObjectTopAndBottomTextWrapType:
            parameter = undefined;
            break;
        case FloatingObjectsFormatTabCommandId.SetFloatingObjectBehindTextWrapType:
            parameter = undefined;
            break;
        case FloatingObjectsFormatTabCommandId.SetFloatingObjectInFrontOfTextWrapType:
            parameter = undefined;
            break;
        case FloatingObjectsFormatTabCommandId.SetFloatingObjectTopLeftAlignment:
            parameter = undefined;
            break;
        case FloatingObjectsFormatTabCommandId.SetFloatingObjectTopCenterAlignment:
            parameter = undefined;
            break;
        case FloatingObjectsFormatTabCommandId.SetFloatingObjectTopRightAlignment:
            parameter = undefined;
            break;
        case FloatingObjectsFormatTabCommandId.SetFloatingObjectMiddleLeftAlignment:
            parameter = undefined;
            break;
        case FloatingObjectsFormatTabCommandId.SetFloatingObjectMiddleCenterAlignment:
            parameter = undefined;
            break;
        case FloatingObjectsFormatTabCommandId.SetFloatingObjectMiddleRightAlignment:
            parameter = undefined;
            break;
        case FloatingObjectsFormatTabCommandId.SetFloatingObjectBottomLeftAlignment:
            parameter = undefined;
            break;
        case FloatingObjectsFormatTabCommandId.SetFloatingObjectBottomCenterAlignment:
            parameter = undefined;
            break;
        case FloatingObjectsFormatTabCommandId.SetFloatingObjectBottomRightAlignment:
            parameter = undefined;
            break;
        case FloatingObjectsFormatTabCommandId.FloatingObjectBringForward:
            parameter = undefined;
            break;
        case FloatingObjectsFormatTabCommandId.FloatingObjectBringToFront:
            parameter = undefined;
            break;
        case FloatingObjectsFormatTabCommandId.FloatingObjectBringInFrontOfText:
            parameter = undefined;
            break;
        case FloatingObjectsFormatTabCommandId.FloatingObjectSendBackward:
            parameter = undefined;
            break;
        case FloatingObjectsFormatTabCommandId.FloatingObjectSendToBack:
            parameter = undefined;
            break;
        case FloatingObjectsFormatTabCommandId.FloatingObjectSendBehindText:
            parameter = undefined;
            break;
        case ContextMenuCommandId.ApplySpellingSuggestion: {
            const suggestion = ApiParametersChecker.check(parameter, 2, false, [
                ApiParametersChecker.stringDescriptor('parameter', val => val, true)
            ]);
            parameter = suggestion;
            break;
        }
        case ContextMenuCommandId.NoSpellingSuggestions:
            parameter = undefined;
            break;
        case ContextMenuCommandId.IgnoreSpellingError:
            parameter = undefined;
            break;
        case ContextMenuCommandId.IgnoreAllSpellingErrors:
            parameter = undefined;
            break;
        case ContextMenuCommandId.AddWordToDictionary:
            parameter = undefined;
            break;
        case ContextMenuCommandId.OpenHyperlink:
            parameter = undefined;
            break;
        case ContextMenuCommandId.ShowEditHyperlinkDialog:
            parameter = undefined;
            break;
        case ContextMenuCommandId.RemoveHyperlink:
            parameter = undefined;
            break;
        case ContextMenuCommandId.UpdateField:
            parameter = undefined;
            break;
        case ContextMenuCommandId.ToggleFieldCodes:
            parameter = undefined;
            break;
        case ContextMenuCommandId.RestartNumberedList:
            parameter = undefined;
            break;
        case ContextMenuCommandId.ContinueNumberedList:
            parameter = undefined;
            break;
        case ContextMenuCommandId.Cut:
            parameter = undefined;
            break;
        case ContextMenuCommandId.Copy:
            parameter = undefined;
            break;
        case ContextMenuCommandId.Paste:
            parameter = undefined;
            break;
        case ContextMenuCommandId.TableMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case ContextMenuCommandId.InsertTableColumnToTheLeft:
            parameter = undefined;
            break;
        case ContextMenuCommandId.InsertTableColumnToTheRight:
            parameter = undefined;
            break;
        case ContextMenuCommandId.InsertTableRowAbove:
            parameter = undefined;
            break;
        case ContextMenuCommandId.InsertTableRowBelow:
            parameter = undefined;
            break;
        case ContextMenuCommandId.ShowInsertTableCellsDialog:
            parameter = undefined;
            break;
        case ContextMenuCommandId.ShowDeleteTableCellsDialog:
            parameter = undefined;
            break;
        case ContextMenuCommandId.ShowSplitCellsDialog:
            parameter = undefined;
            break;
        case ContextMenuCommandId.MergeTableCells:
            parameter = undefined;
            break;
        case ContextMenuCommandId.DecreaseParagraphIndent:
            parameter = undefined;
            break;
        case ContextMenuCommandId.IncreaseParagraphIndent:
            parameter = undefined;
            break;
        case ContextMenuCommandId.ShowFontDialog:
            parameter = undefined;
            break;
        case ContextMenuCommandId.ShowParagraphDialog:
            parameter = undefined;
            break;
        case ContextMenuCommandId.ShowBookmarkDialog:
            parameter = undefined;
            break;
        case ContextMenuCommandId.ShowHyperlinkDialog:
            parameter = undefined;
            break;
        case ContextMenuCommandId.ChangeFloatingObjectTextWrapTypeMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case ContextMenuCommandId.SetFloatingObjectInlineTextWrapType:
            parameter = undefined;
            break;
        case ContextMenuCommandId.SetFloatingObjectSquareTextWrapType:
            parameter = undefined;
            break;
        case ContextMenuCommandId.SetFloatingObjectTightTextWrapType:
            parameter = undefined;
            break;
        case ContextMenuCommandId.SetFloatingObjectThroughTextWrapType:
            parameter = undefined;
            break;
        case ContextMenuCommandId.SetFloatingObjectTopAndBottomTextWrapType:
            parameter = undefined;
            break;
        case ContextMenuCommandId.SetFloatingObjectBehindTextWrapType:
            parameter = undefined;
            break;
        case ContextMenuCommandId.SetFloatingObjectInFrontOfTextWrapType:
            parameter = undefined;
            break;
        case ContextMenuCommandId.FloatingObjectBringForwardMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case ContextMenuCommandId.FloatingObjectBringForward:
            parameter = undefined;
            break;
        case ContextMenuCommandId.FloatingObjectBringToFront:
            parameter = undefined;
            break;
        case ContextMenuCommandId.FloatingObjectBringInFrontOfText:
            parameter = undefined;
            break;
        case ContextMenuCommandId.FloatingObjectSendBackwardMenu:
            parameter = undefined;
            allowExecute = false;
            break;
        case ContextMenuCommandId.FloatingObjectSendBackward:
            parameter = undefined;
            break;
        case ContextMenuCommandId.FloatingObjectSendToBack:
            parameter = undefined;
            break;
        case ContextMenuCommandId.FloatingObjectSendBehindText:
            parameter = undefined;
            break;
        case ContextMenuCommandId.SelectAll:
            parameter = undefined;
            break;
        default: allowExecute = false;
    }
    return allowExecute || allowExecuteInternalCommand(modelCommandId) ? command.execute(false, parameter) : false;
}
function allowExecuteInternalCommand(commandId) {
    if (commandId == RichEditClientCommand.ShowTabsForm)
        return true;
    if (commandId == RichEditClientCommand.ShowCreateHyperlinkForm)
        return true;
    return false;
}
function getRevertValue(command) {
    return !command.getState().value;
}
function getNumberParameter(parameter) {
    return ApiParametersChecker.check(parameter, 2, false, [
        ApiParametersChecker.numberDescriptor('parameter', (val) => val)
    ]);
}
