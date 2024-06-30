import { CommandBase } from '../../base/commands/command-base';
import { SimpleCommandState } from '../../base/commands/command-states';
import { DocumentInfo } from '../../base/rich-edit-core';
import { DocumentFormat } from '../../core/document-format';
import { FileNameHelper } from '../../core/formats/file-name-helper';
import { ControlOptions, DocumentCapability } from '../../core/model/options/control';
import { FileUtils } from '@devexpress/utils/lib/utils/file';
import { exportModelToBlob } from '../../model-api/formats/exporter';
export class DownloadDocumentCommand extends CommandBase {
    getState() {
        var state = new SimpleCommandState(this.isEnabled());
        state.visible = this.control.modelManager.richOptions.control.save !== DocumentCapability.Hidden;
        return state;
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
    executeCore(_state, options) {
        const format = options.param && options.param.documentFormat !== undefined && options.param.documentFormat !== null ?
            options.param.documentFormat : DocumentFormat.OpenXml;
        this.download(this.getFileName(options), format);
        return true;
    }
    download(fileName, documentFormat) {
        const core = this.control;
        if (core.fileDownloaded)
            return;
        if (fileName === "")
            fileName = DocumentInfo.defaultDocumentName;
        const finalFileName = fileName + FileNameHelper.convertToString(documentFormat);
        exportModelToBlob(this.control.modelManager.modelManipulator, documentFormat, blob => FileUtils.startDownloadFileLocal(blob, finalFileName));
        core.fileDownloaded = true;
        setTimeout(() => {
            core.fileDownloaded = false;
        }, 1);
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.save);
    }
    canModify() {
        return true;
    }
    getFileName(options) {
        return this.control.documentInfo.getFileNameForDownload(options.param ? options.param.fileName : null);
    }
}
export class DownloadDocxCommand extends DownloadDocumentCommand {
    executeCore(_state, options) {
        this.download(this.getFileName(options), DocumentFormat.OpenXml);
        return true;
    }
}
export class DownloadRtfCommand extends DownloadDocumentCommand {
    executeCore(_state, options) {
        this.download(this.getFileName(options), DocumentFormat.Rtf);
        return true;
    }
}
export class DownloadTxtCommand extends DownloadDocumentCommand {
    executeCore(_state, options) {
        this.download(this.getFileName(options), DocumentFormat.PlainText);
        return true;
    }
}
export class DownloadDocumentParameters {
    constructor(documentFormat, fileName = "") {
        this.documentFormat = documentFormat;
        this.fileName = fileName;
    }
}
