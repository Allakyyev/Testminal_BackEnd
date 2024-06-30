import { RichEditDocumentBaseApi as RichEditDocument } from '../../base-api/document';
import { HistoryApi as History } from '../../base-api/history';
import { KeyCode } from '../../base-api/key-code';
import { RichEditLayoutApi as RichEditLayout } from '../../base-api/layout-api';
import { LoadingPanelApi } from '../../base-api/loading-panel';
import { RichEditSelectionApi as RichEditSelection } from '../../base-api/selection-api';
import { SubDocumentBaseApi } from '../../base-api/sub-document';
import { convertToFunction } from '../../base-utils/utils';
import { RichEditClientCommand } from '../../base/commands/client-command';
import { AssignShortcutCommandOptions } from '../../base/commands/shortcuts/assign-shortcut-command';
import { ReadOnlyMode } from '../../base/interfaces/i-rich-edit-core';
import { DocumentFormat } from '../../core/document-format';
import { Base64Utils } from '@devexpress/utils/lib/utils/base64';
import { isDefined, isString } from '@devexpress/utils/lib/utils/common';
import { FileUtils } from '@devexpress/utils/lib/utils/file';
import { KeyUtils } from '@devexpress/utils/lib/utils/key';
import { OpenXmlMimeType, PlainTextMimeType, RtfMimeType } from '@devexpress/utils/lib/utils/mime-type';
import { EventArgs } from '../../document-processor/docvar-args';
import { DocumentProcessorBaseApi } from '../../document-processor/public/processor';
import { FieldNameApi } from '../../model-api/field';
import { ModelFontApi } from '../../model-api/fonts/model-font';
import { DocumentFormatApi } from '../../model-api/formats/enum';
import { exportModelToBase64, exportModelToBlob } from '../../model-api/formats/exporter';
import { RangePermissionApi } from '../../model-api/range-permission';
import { UnitConverterApi as UnitConverter } from '../../model-api/unit-converter';
import { downloadPdf, pdfExport } from '../../pdf/api/pdf';
import { ClientRichEdit } from '../client-rich-edit';
import { DownloadDocumentParameters } from '../commands/download-document-command';
import { ExportDocumentCommandOptions } from '../commands/export-document-command';
import { MailMergeCommandParameters } from '../commands/mail-merge-command';
import { FileInfo, OpenDocumentCommand } from '../commands/open-document-command';
import { AuthenticationOptionsApi } from './api/authentication-options';
import { MailMergeOptionsApi } from './api/mail-merge-options';
import { RangePermissionOptionsApi } from './api/range-permission-options';
import { Paddings, SimpleViewSettings } from './api/simple-view';
import { SpellCheckerOptionsApi } from './api/spell-checker-options';
import { Events } from './client-events';
import { CommandState, executeApiCommand, getApiCommandState } from './commands/commands';
import { ContextMenuCommandId, FileTabCommandId, FloatingObjectsFormatTabCommandId, HeaderAndFooterTabCommandId, HomeTabCommandId, InsertTabCommandId, MailMergeTabCommandId, PageLayoutTabCommandId, ReferencesTabCommandId, TableDesignTabCommandId, TableLayoutTabCommandId, ViewTabCommandId } from './commands/enum';
import { ContextMenuRuntime } from './context-menu/menu';
import { DocumentProcessorApi } from './document-processor';
import { NusaSettings } from './nusa/settings';
import { Utils } from './utils';
class RichEditPublic {
    constructor(htmlElement, options) {
        this._native = new ClientRichEdit(htmlElement, options, this);
        this.document = new RichEditDocument(this._native.core);
        this.selection = new RichEditSelection(this._native.core);
        this.layout = new RichEditLayout(this._native.core);
        this.history = new History(this._native.core);
        this.unitConverter = new UnitConverter();
        this.mailMergeOptions = new MailMergeOptionsApi(this._native);
        this.authenticationOptions = new AuthenticationOptionsApi(this._native);
        this.simpleViewSettings = new SimpleViewSettings(this._native);
        this.contextMenu = new ContextMenuRuntime(this._native);
        this.rangePermissionOptions = new RangePermissionOptionsApi(this._native);
        this.nusaSettings = new NusaSettings(this._native);
        this.spellCheckerOptions = new SpellCheckerOptionsApi(this._native.core);
        this._native.allowDocumentLoadedEventCall = false;
        const initialDoc = this._native.document;
        const afterDocumentOpened = (openDocCallback) => {
            if (this.isDisposed)
                return;
            if (this._native.onInit) {
                const initFunc = isString(this._native.onInit) ? convertToFunction(this._native.onInit) : this._native.onInit;
                initFunc(this, new EventArgs());
            }
            openDocCallback();
            this._native.allowDocumentLoadedEventCall = true;
            if (!this._native.core.activeDocumentImporter)
                this._native.raiseDocumentLoaded();
            this._native.activeContextTabManager.forbidChangeActiveTabIndex = false;
        };
        if (initialDoc && isDefined(initialDoc.content)) {
            const onDocumentLoaded = isDefined(initialDoc.onLoaded) ?
                (isString(initialDoc.onLoaded) ? convertToFunction(initialDoc.onLoaded) : initialDoc.onLoaded) :
                () => { };
            this.openDocument(initialDoc.content, initialDoc.name, initialDoc.format, success => {
                afterDocumentOpened(() => onDocumentLoaded(success));
            });
        }
        else {
            this.newDocument();
            afterDocumentOpened(() => { });
        }
    }
    get events() { return this._native.events; }
    exportToBase64(callback, documentFormat) {
        const format = isDefined(documentFormat) ? documentFormat : this._native.core.getExportDocumentFormat();
        exportModelToBase64(this._native.core.modelManager.modelManipulator, format, callback);
    }
    exportToBlob(callback, documentFormat) {
        const format = isDefined(documentFormat) ? documentFormat : this._native.core.getExportDocumentFormat();
        exportModelToBlob(this._native.core.modelManager.modelManipulator, format, callback);
    }
    exportToArrayBuffer(callback, documentFormat) {
        this.exportToBlob(blob => {
            const reader = new FileReader();
            reader.onloadend = () => callback(reader.result);
            reader.readAsArrayBuffer(blob);
        }, documentFormat);
    }
    exportToFile(callback, documentFormat) {
        const format = isDefined(documentFormat) ? documentFormat : this._native.core.getExportDocumentFormat();
        let mimeType = '';
        switch (format) {
            case DocumentFormat.Rtf:
                mimeType = RtfMimeType;
                break;
            case DocumentFormat.OpenXml:
                mimeType = OpenXmlMimeType;
                break;
            case DocumentFormat.PlainText:
                mimeType = PlainTextMimeType;
                break;
        }
        const fileName = OpenDocumentCommand.getFileNameWithoutExtension(this.documentName, format);
        const extension = Utils.documentFormatToExtension(format);
        exportModelToBlob(this._native.core.modelManager.modelManipulator, format, blob => callback(FileUtils.createFile([blob], fileName + extension, { type: mimeType })));
    }
    exportToPdf(documentName, options) {
        const core = this._native.core;
        pdfExport(core, (blob, stream) => {
            Base64Utils.fromBlobAsArrayBuffer(blob, base64 => {
                const handled = this._native.raisePdfExporting(base64, blob, stream, false);
                const exportUrl = core.modelManager.richOptions.pdf.exportUrl;
                if (!handled && exportUrl)
                    this._native.sendExportPdfRequest(base64, this._native.core.documentInfo.getFileNameForDownload(documentName), exportUrl);
            });
        }, options);
    }
    downloadPdf(documentName, options) {
        downloadPdf(this._native.core, this._native.core.documentInfo.getFileNameForDownload(documentName), options);
    }
    adjust() {
        this._native.adjustControl();
    }
    get isDocumentImported() {
        return !this._native.core.activeDocumentImporter;
    }
    get fullScreen() {
        return this._native.isInFullScreenMode;
    }
    set fullScreen(value) {
        const command = this._native.core.commandManager.getCommand(RichEditClientCommand.FullScreen);
        command.execute(true, value);
    }
    get viewType() {
        return this._native.core.innerClientProperties.viewsSettings.viewType;
    }
    set viewType(type) {
        const command = this._native.core.commandManager.getCommand(RichEditClientCommand.ChangeViewType);
        command.execute(true, type);
    }
    get readOnly() {
        return this._native.core.readOnly == ReadOnlyMode.Persistent;
    }
    set readOnly(value) {
        if (this.readOnly != value) {
            this._native.core.readOnly = value ? ReadOnlyMode.Persistent : ReadOnlyMode.None;
            this._native.core.barHolder.updateItemsState();
            this._native.core.horizontalRulerControl.update();
            this._native.core.beginUpdate();
            const currState = this._native.core.innerClientProperties.showHiddenSymbols;
            const cmd = this._native.core.commandManager.getCommand(RichEditClientCommand.ToggleShowWhitespace);
            cmd.execute(this._native.core.commandManager.isPublicApiCall, !currState);
            cmd.execute(this._native.core.commandManager.isPublicApiCall, currState);
            this._native.core.endUpdate();
        }
    }
    get isDisposed() {
        return !this._native.core;
    }
    get showHorizontalRuler() {
        return this._native.core.horizontalRulerControl.getVisible();
    }
    set showHorizontalRuler(value) {
        const command = this._native.core.commandManager.getCommand(RichEditClientCommand.ToggleShowHorizontalRuler);
        command.execute(true, value);
    }
    focus() {
        this._native.core.focusManager.captureFocus();
    }
    get fileName() {
        return this._native.core.documentInfo.fileName;
    }
    set fileName(name) {
        this._native.core.documentInfo.fileName = name;
    }
    get documentSaveFormat() {
        return this._native.core.saveDocumentFormat;
    }
    set documentSaveFormat(format) {
        this._native.core.saveDocumentFormat = format;
    }
    get documentName() {
        return this._native.core.documentInfo.fileName;
    }
    set documentName(name) {
        this._native.core.documentInfo.fileName = name;
    }
    get documentFormat() {
        return this._native.core.documentInfo.documentFormat;
    }
    set documentFormat(format) {
        this._native.core.documentInfo.documentFormat = format;
    }
    get documentExtension() {
        return Utils.documentFormatToExtension(this._native.core.documentInfo.documentFormat);
    }
    set documentExtension(filePath) {
        const docFormat = Utils.getDocumentFormat(filePath);
        if (docFormat === null)
            console.warn(`Error: unknown extension. richEdit.documentExtension = "${filePath}"`);
        else
            this._native.core.documentInfo.documentFormat = docFormat;
    }
    get hasUnsavedChanges() { return !this._native.documentSaved; }
    set hasUnsavedChanges(value) { this._native.documentSaved = !value; }
    newDocument() {
        this._native.core.commandManager.getCommand(RichEditClientCommand.CreateNewDocumentLocally)
            .execute(true);
    }
    openDocument(fileContent, documentName, documentFormat, callback) {
        const fileInfo = isDefined(fileContent) ?
            new FileInfo(callback ? ((success, _reason) => callback(success)) : null, fileContent, documentName, documentFormat) :
            null;
        this._native.core.commandManager.getCommand(RichEditClientCommand.OpenDocumentLocally)
            .execute(true, fileInfo);
    }
    saveDocument(documentFormat, reason, documentName) {
        const oldReadonly = this._native.core.readOnly;
        this._native.core.readOnly = ReadOnlyMode.None;
        this._native.core.commandManager.getCommand(RichEditClientCommand.ExportDocument)
            .execute(true, new ExportDocumentCommandOptions(documentFormat, reason, documentName));
        this._native.core.readOnly = oldReadonly;
    }
    mailMerge(callback, mergeMode = MergeMode.NewParagraph, documentFormat = DocumentFormatApi.OpenXml, exportFrom, exportRecordsCount) {
        if (!this._native.rawDataSource) {
            console.warn('No data source');
            return;
        }
        const params = new MailMergeCommandParameters(callback, mergeMode, documentFormat, exportFrom, exportRecordsCount);
        this._native.core.commandManager.getCommand(RichEditClientCommand.MailMergeOnClient)
            .execute(true, params);
    }
    downloadDocument(documentFormat = DocumentFormatApi.OpenXml, documentName) {
        this._native.core.commandManager.getCommand(RichEditClientCommand.DownloadDocumentLocally)
            .execute(true, new DownloadDocumentParameters(documentFormat, documentName));
    }
    printDocument(mode) {
        this._native.core.commandManager.getCommand(RichEditClientCommand.PrintDocumentOnClient).execute(true, mode);
    }
    assignShortcut(shortcut, callback) {
        this._native.core.commandManager.getCommand(RichEditClientCommand.AssignShortcut)
            .execute(true, new AssignShortcutCommandOptions(this._native.core, KeyUtils.getShortcutCode(shortcut.keyCode, shortcut.ctrl, shortcut.shift, shortcut.alt, shortcut.meta), callback));
    }
    get printMode() { return this._native.core.modelManager.richOptions.printing.mode; }
    set printMode(val) { this._native.core.modelManager.richOptions.printing.mode = val; }
    updateRibbon(callback) {
        const oldRibbon = this._native.lastRibbonSettings;
        const oldRibbonBar = this._native.barHolder.ribbon;
        if (oldRibbonBar)
            oldRibbon.activeTabIndex = oldRibbonBar.getActiveTabIndex();
        callback(oldRibbon);
        this._native.core.beginUpdate();
        this._native.initRibbon(oldRibbon, this._native.core.modelManager.richOptions.fonts);
        this.adjust();
        this._native.core.endUpdate();
        this._native.core.barHolder.updateItemsState();
    }
    beginUpdate() {
        this._native.core.beginUpdate();
    }
    endUpdate() {
        this._native.core.endUpdate();
    }
    get loadingPanel() {
        return new LoadingPanelApi(this._native.core);
    }
    createDocumentProcessor(options = {}) {
        const modelManager = this._native.core.modelManager;
        const procOptions = modelManager.richOptions.clone();
        procOptions.spellChecker.isEnabled = false;
        const proc = new DocumentProcessorApi(procOptions);
        if (options.cloneCurrentModel)
            proc._importInnerDocument(modelManager.model.clone());
        else
            proc._initByEmptyModel();
        return proc;
    }
    dispose() {
        this._native.dispose();
        this.nusaSettings.unregister();
    }
    executeCommand(commandId, parameter) {
        return executeApiCommand(this._native.core.commandManager, commandId, parameter);
    }
    getCommandState(commandId) {
        var _a;
        return (_a = getApiCommandState(this._native.core.commandManager, commandId)) !== null && _a !== void 0 ? _a : new CommandState(false, false);
    }
    setCommandEnabled(command, enabled) {
        const coreCommandId = command;
        this._native.core.commandManager.setCommandEnabled(coreCommandId, enabled);
        this._native.core.barHolder.forceUpdate();
    }
}
export var ViewType;
(function (ViewType) {
    ViewType[ViewType["Simple"] = 0] = "Simple";
    ViewType[ViewType["PrintLayout"] = 1] = "PrintLayout";
})(ViewType || (ViewType = {}));
export var MergeMode;
(function (MergeMode) {
    MergeMode[MergeMode["NewParagraph"] = 0] = "NewParagraph";
    MergeMode[MergeMode["NewSection"] = 1] = "NewSection";
})(MergeMode || (MergeMode = {}));
var PrintModeApi;
(function (PrintModeApi) {
    PrintModeApi[PrintModeApi["Html"] = 1] = "Html";
    PrintModeApi[PrintModeApi["Pdf"] = 2] = "Pdf";
})(PrintModeApi || (PrintModeApi = {}));
export { CharacterPropertiesApi as CharacterProperties, CharacterPropertiesScriptApi as CharacterPropertiesScript } from '../../model-api/character-properties';
export { HyperlinkInfoApi as HyperlinkInfo } from '../../model-api/field';
export { IntervalApi as Interval } from '../../model-api/interval';
export { ListTypeApi as ListType, ListLevelNumberAlignmentApi as ListLevelNumberAlignment, ListLevelFormatApi as ListLevelFormat } from '../../model-api/lists/enums';
export { ListLevelSettingsApi as ListLevelSettings } from '../../model-api/lists/list-level-settings';
export { ListApi as List } from '../../model-api/lists/lists';
export { ParagraphAlignmentApi as ParagraphAlignment, ParagraphLineSpacingTypeApi as ParagraphLineSpacingType, ParagraphFirstLineIndentApi as ParagraphFirstLineIndent, ParagraphPropertiesApi as ParagraphProperties, ParagraphApi as Paragraph } from '../../model-api/paragraph';
export { MarginsApi as Margins, SizeApi as Size } from '../../model-api/size';
export { SubDocumentTypeApi as SubDocumentType, HeaderFooterTypeApi as HeaderFooterType, SectionBreakTypeApi as SectionBreakType, SubDocumentApi as SubDocument } from '../../model-api/sub-document';
export { BookmarkApi as Bookmark } from '../../model-api/bookmark';
export { BookmarkBaseApi as BookmarkBase } from '../../base-api/bookmark';
export { PaperSizeApi as PaperSize } from '../../model-api/section';
export { TableApi as Table } from '../../model-api/table/table';
export { SectionApi as Section } from '../../model-api/section';
export { SubDocumentCollectionBaseApi as SubDocumentCollectionBase } from '../../base-api/collections/sub-documents-collection';
export { ShortcutOptions } from '../../base-api/key-code';
export { RichEditDocumentApi as RichEditDocumentBase } from '../../model-api/document';
export { RichEditPublic as RichEdit };
export { BookmarkCollectionBaseApi as BookmarkCollectionBase } from '../../base-api/collections/bookmark-collection';
export { FieldApi as Field } from '../../model-api/field';
export { UpdateFieldsOptionsApi as UpdateFieldsOptions } from '../../model-api/collections/field-collection';
export { HyperlinkApi as Hyperlink } from '../../model-api/field';
export { TableCellApi as TableCell } from '../../model-api/table/table-cell';
export { TableRowApi as TableRow } from '../../model-api/table/table-row';
export { DocumentFormatApi as DocumentFormat };
export { ModelFontApi as Font };
export { LoadingPanelApi as LoadingPanel };
export { MailMergeOptionsApi as MailMergeOptions };
export { AuthenticationOptionsApi as AuthenticationOptions };
export { RangePermissionOptionsApi as RangePermissionOptions };
export { SpellCheckerOptionsApi as SpellCheckerOptions };
export { DocumentProcessorApi as DocumentProcessor };
export { DocumentProcessorBaseApi as DocumentProcessorBase };
export { SubDocumentBaseApi as SubDocumentBase };
export { FieldNameApi as FieldName };
export { PrintModeApi as PrintMode };
export { KeyCode };
export { Events };
export { RangePermissionApi as RangePermission };
export { Paddings };
export { FileTabCommandId };
export { HomeTabCommandId };
export { InsertTabCommandId };
export { PageLayoutTabCommandId };
export { ReferencesTabCommandId };
export { MailMergeTabCommandId };
export { ViewTabCommandId };
export { HeaderAndFooterTabCommandId };
export { TableDesignTabCommandId };
export { TableLayoutTabCommandId };
export { FloatingObjectsFormatTabCommandId };
export { ContextMenuCommandId };
export { WrapTypeApi as WrapType, WrapSideApi as WrapSide, FloatingObjectHorizontalAlignmentApi as FloatingObjectHorizontalAlignment, FloatingObjectHorizontalAnchorElementApi as FloatingObjectHorizontalAnchorElement, FloatingObjectHorizontalPositionTypeApi as FloatingObjectHorizontalPositionType, FloatingObjectVerticalAnchorElementApi as FloatingObjectVerticalAnchorElement, FloatingObjectVerticalAlignmentApi as FloatingObjectVerticalAlignment, FloatingObjectVerticalPositionTypeApi as FloatingObjectVerticalPositionType } from '../../model-api/images/image-enums';
export { HorizontalAbsolutePositionApi as HorizontalAbsolutePosition, HorizontalAlignedPositionApi as HorizontalAlignedPosition, HorizontalRelativePositionApi as HorizontalRelativePosition, VerticalAbsolutePositionApi as VerticalAbsolutePosition, VerticalAlignedPositionApi as VerticalAlignedPosition, VerticalRelativePositionApi as VerticalRelativePosition, } from '../../model-api/images/image-interfaces';
export { FloatingImageApi as FloatingImage } from '../../model-api/images/floating-image';
export { InlineImageApi as InlineImage } from '../../model-api/images/inline-image';
export { ImageApi as Image } from '../../model-api/images/image';
export { ImagesApi as Images } from '../../model-api/images/images';
export { ImageIteratorApi as ImageIterator } from '../../model-api/images/image-iterator';
export { ContextMenuItem } from './context-menu/item';
export { Utils } from './utils';
export { Characters } from './characters';
export * from './commands/enum';
