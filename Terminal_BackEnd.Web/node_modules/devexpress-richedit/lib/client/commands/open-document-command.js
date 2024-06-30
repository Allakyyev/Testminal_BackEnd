import { CommandBase } from '../../base/commands/command-base';
import { SimpleCommandState } from '../../base/commands/command-states';
import { AlertMessageDialogParameters, AlertMessageText } from '../../base/commands/dialogs/dialog-alert-message-command';
import { DocumentInfo } from '../../base/rich-edit-core';
import { DocumentFormat, documentFormatIntoMimeType, mimeTypeIntoDocumentFormat } from '../../core/document-format';
import { FileNameHelper } from '../../core/formats/file-name-helper';
import { FontCorrector } from '../../core/model/creator/font-corrector';
import { FieldCodeParserHyperlink } from '../../core/model/fields/parsers/field-code-parser-hyperlink';
import { FieldCodeParserNumPages } from '../../core/model/fields/parsers/field-code-parser-num-pages';
import { FieldCodeParserPage } from '../../core/model/fields/parsers/field-code-parser-page';
import { FieldsWaitingForUpdate } from '../../core/model/fields/tree-creator';
import { updateFieldSequenceInfo } from '../../core/model/fields/update-sequence-info';
import { ChunkSizeCorrector } from '../../core/model/manipulators/text-manipulator/chunk-size-corrector';
import { ControlOptions, DocumentCapability } from '../../core/model/options/control';
import { Browser } from '@devexpress/utils/lib/browser';
import { Errors } from '@devexpress/utils/lib/errors';
import { Base64Utils } from '@devexpress/utils/lib/utils/base64';
import { isDefined, isString } from '@devexpress/utils/lib/utils/common';
import { FileUtils } from '@devexpress/utils/lib/utils/file';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { createImporter } from '../../model-api/formats/importer';
import { NewDocumentCommand } from './new-document-command';
export class OpenDocumentCommand extends CommandBase {
    constructor() {
        super(...arguments);
        this.suppressUpdateFields = false;
    }
    getState() {
        var state = new SimpleCommandState(this.isEnabled());
        state.visible = this.control.modelManager.richOptions.control.open !== DocumentCapability.Hidden;
        return state;
    }
    executeCore(_state, options) {
        if (this.control.getModifiedState() && !this.control.owner.confirmOnLosingChanges() ||
            this.control.activeDocumentImporter)
            return false;
        const fileInfo = options.param;
        if (fileInfo) {
            const { file, documentFormat } = OpenDocumentCommand.getFileAndDocumentFormat(fileInfo);
            const fileName = OpenDocumentCommand.getFileNameWithoutExtension(fileInfo.fileName, documentFormat);
            return this.executeOpening(file, fileName, documentFormat, fileInfo.callback);
        }
        else {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = Browser.AndroidMobilePlatform ?
                'text/plain,text/rtf,application/rtf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-word.document.macroEnabled.12' :
                '.txt,.docx,.rtf,.docm';
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const format = OpenDocumentCommand.getDocumentFormatByFileName(file.name);
                    const fileName = OpenDocumentCommand.getFileNameWithoutExtension(file.name, format);
                    this.executeOpening(file, fileName, format, null);
                }
            }, false);
            input.click();
        }
        return true;
    }
    executeOpening(file, fileName, format, callback) {
        const core = this.control;
        const throwInvalidFile = reason => {
            throw new Error(Errors.InternalException + " " + reason);
        };
        core.activeDocumentImporter = createImporter(format, throwInvalidFile);
        if (!core.activeDocumentImporter)
            return false;
        this.beforeOpen();
        core.activeDocumentImporter.importFromFile(file, this.control.modelManager.richOptions, (documentModel, formatImagesImporter) => {
            core.activeDocumentImporter = null;
            this.openCore(fileName, format, documentModel, formatImagesImporter);
            if (!this.suppressUpdateFields)
                this.updateSomeFields();
            if (callback)
                callback(true, null);
        }, (reason) => {
            core.activeDocumentImporter = null;
            this.control.loadingPanelManager.loadingPanel.setVisible(false);
            NewDocumentCommand.newDocumentInner.call(this);
            if (callback)
                callback(false, `Document importer error(${reason.toString()})`);
            else
                this.showErrorDialog();
        });
        return true;
    }
    showErrorDialog() {
        const params = new AlertMessageDialogParameters();
        params.messageTextId = AlertMessageText.DocumentImportError;
        this.control.owner.showDialog("ErrorMessage", params, () => { }, () => { }, true);
    }
    updateSomeFields() {
        this.control.beginUpdate();
        NumberMapUtils.forEach(this.control.modelManager.model.subDocuments, (sd) => {
            for (let field of sd.fields) {
                const fieldParser = FieldsWaitingForUpdate.getParser(this.control.modelManager, this.control.layoutFormatterManager, this.control.createFieldRequestManager(), sd, field);
                if ((fieldParser instanceof FieldCodeParserNumPages || fieldParser instanceof FieldCodeParserPage) && sd.isHeaderFooter() ||
                    fieldParser instanceof FieldCodeParserHyperlink && !field.getHyperlinkInfo()) {
                    fieldParser.parseCodeCurrentFieldInternal(null);
                }
            }
        });
        this.control.endUpdate();
        this.control.modelManager.history.clear();
        this.control.setModifiedFalse();
    }
    beforeOpen() {
        this.control.closeDocument();
        this.control.loadingPanelManager.loadingPanel.setVisible(true);
    }
    openCore(fileName, documentFormat, documentModel, formatImagesImporter) {
        new ChunkSizeCorrector().correctChunkSizeAtChunkIndex(documentModel.mainSubDocument, 0);
        new FontCorrector(this.control.modelManager.modelManipulator, documentModel, this.control.modelManager.richOptions.fonts).correct();
        const documentInfo = new DocumentInfo(fileName, true, documentFormat);
        this.control.initialize('', documentInfo, NumberMapUtils.mapLength(documentModel.subDocuments), documentModel);
        updateFieldSequenceInfo(this.control.modelManager, this.control.layoutFormatterManager, this.control.createFieldRequestManager());
        formatImagesImporter.import(this.control.modelManager.modelManipulator);
        this.control.modelManager.modelManipulator.documentProtectionProperties.filterRangePermissions();
        this.control.selection.beginUpdate();
        const selectionUpdated = this.control.selection.changeState((newState) => newState.setPosition(0).resetKeepX().setEndOfLine(false)
            .setPageIndex(-1).setSubDocument(this.control.modelManager.model.mainSubDocument));
        this.control.layoutFormatterManager.openDocument();
        this.control.inputPosition.reset();
        this.control.layout.pageColor = documentModel.getActualPageBackgroundColor();
        this.control.layoutFormatterManager.restartManager.restartFromPage(0, 0, true);
        this.control.layoutFormatterManager.forceFormatPage(0);
        this.control.barHolder.setEnabled(true);
        this.control.horizontalRulerControl.setEnable(true);
        this.control.selection.endUpdate();
        if (!selectionUpdated)
            this.control.selection.raiseSelectionChanged();
        this.control.loadingPanelManager.loadingPanel.setVisible(false);
        this.control.spellChecker.check();
        this.control.layoutFormatterManager.runFormattingAsync();
        this.control.barHolder.forceUpdate();
        this.control.owner.raiseDocumentLoaded();
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.open);
    }
    isEnabledInClosedDocument() {
        return true;
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
    static getFileAndDocumentFormat(fileInfo) {
        if (isString(fileInfo.fileContent)) {
            let documentFormat;
            const docFormatByMimeType = mimeTypeIntoDocumentFormat[Base64Utils.getKnownMimeType(fileInfo.fileContent)];
            if (docFormatByMimeType !== undefined) {
                documentFormat = docFormatByMimeType;
            }
            else {
                documentFormat = isDefined(fileInfo.documentFormat) ?
                    fileInfo.documentFormat :
                    OpenDocumentCommand.getDocumentFormatByFileName(fileInfo.fileName);
            }
            const file = Base64Utils.getFileFromBase64(Base64Utils.deleteDataUrlPrefix(fileInfo.fileContent), '', {
                type: documentFormatIntoMimeType[documentFormat]
            });
            return { file, documentFormat };
        }
        else if (FileUtils.isFile(fileInfo.fileContent)) {
            let documentFormat;
            if (isDefined(fileInfo.documentFormat)) {
                documentFormat = fileInfo.documentFormat;
            }
            else {
                const formatByMimeType = mimeTypeIntoDocumentFormat[fileInfo.fileContent.type];
                if (formatByMimeType !== undefined) {
                    documentFormat = formatByMimeType;
                }
                else {
                    documentFormat = FileNameHelper.convertToDocumentFormat(fileInfo.fileContent.name);
                    if (documentFormat === DocumentFormat.Undefined)
                        documentFormat = OpenDocumentCommand.getDocumentFormatByFileName(fileInfo.fileName);
                }
            }
            return { file: fileInfo.fileContent, documentFormat };
        }
        else if (fileInfo.fileContent instanceof Blob) {
            const documentFormat = isDefined(fileInfo.documentFormat) ?
                fileInfo.documentFormat :
                OpenDocumentCommand.getDocumentFormatByFileName(fileInfo.fileName);
            const file = FileUtils.createFile([fileInfo.fileContent], fileInfo.fileName, {
                type: documentFormatIntoMimeType[documentFormat]
            });
            return { file, documentFormat };
        }
        else {
            const documentFormat = isDefined(fileInfo.documentFormat) ?
                fileInfo.documentFormat :
                OpenDocumentCommand.getDocumentFormatByFileName(fileInfo.fileName);
            return { file: FileUtils.createFile([fileInfo.fileContent], fileInfo.fileName, {
                    type: documentFormatIntoMimeType[documentFormat]
                }), documentFormat };
        }
    }
    static getDocumentFormatByFileName(fileName) {
        const docFormatByFileName = FileNameHelper.convertToDocumentFormat(fileName);
        return docFormatByFileName === DocumentFormat.Undefined ? DocumentFormat.OpenXml : docFormatByFileName;
    }
    static getFileNameWithoutExtension(fileName, format) {
        const formatAsString = FileNameHelper.convertToString(format);
        return StringUtils.endsAt(fileName, formatAsString) ? fileName.slice(0, -formatAsString.length) : fileName;
    }
}
export class FileInfo {
    constructor(callback, fileContent, fileName, documentFormat) {
        this.callback = callback;
        this.fileContent = fileContent;
        this.fileName = fileName ? fileName : '';
        this.documentFormat = documentFormat;
    }
}
