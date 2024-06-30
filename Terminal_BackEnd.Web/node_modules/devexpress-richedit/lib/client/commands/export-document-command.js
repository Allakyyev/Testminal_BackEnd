import { CommandBase } from '../../base/commands/command-base';
import { SimpleCommandState } from '../../base/commands/command-states';
import { ControlOptions, DocumentCapability } from '../../core/model/options/control';
import { exportModelToBase64 } from '../../model-api/formats/exporter';
export class ExportDocumentCommandOptions {
    constructor(documentFormat, reason, documentName) {
        this.documentFormat = documentFormat;
        this.reason = reason;
        this.documentName = documentName;
    }
}
export class ExportDocumentCommand extends CommandBase {
    getState() {
        var state = new SimpleCommandState(this.isEnabled());
        state.visible = this.control.modelManager.richOptions.control.save !== DocumentCapability.Hidden;
        return state;
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return parameter instanceof ExportDocumentCommandOptions ? parameter : new ExportDocumentCommandOptions();
    }
    executeCore(_state, options) {
        const richedit = this.control.owner;
        const param = options.param;
        const format = this.getExportDocumentFormat(richedit.core, param);
        const fileName = param.documentName !== undefined && param.documentName !== null ?
            param.documentName :
            this.control.documentInfo.getFileNameForDownload();
        const reason = param.reason ? param.reason : '';
        exportModelToBase64(this.control.modelManager.modelManipulator, format, base64 => this.exportCore(richedit, base64, fileName, format, reason));
        return true;
    }
    getExportDocumentFormat(core, param) {
        if (param.documentFormat !== undefined && param.documentFormat !== null)
            return param.documentFormat;
        if (!this.control.commandManager.isPublicApiCall && core.saveDocumentFormat !== undefined && core.saveDocumentFormat !== null)
            return core.saveDocumentFormat;
        return core.getExportDocumentFormat();
    }
    exportCore(richedit, base64, fileName, format, reason) {
        this.base64 = base64;
        const apiDocFormat = format;
        if (richedit.savingEventIsEmpty() && !richedit.exportUrl) {
            console.warn('The Save button does nothing. To learn more, follow ' +
                'https://docs.devexpress.com/AspNetCore/400972/office-inspired-controls/controls/rich-edit/document-management#save-a-document');
        }
        else {
            const savingResult = richedit.raiseSaving(base64, fileName, apiDocFormat, reason);
            if (!savingResult)
                richedit.sendExportRequest(base64, fileName, apiDocFormat, reason);
        }
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.save) &&
            !this.control.owner.documentSaved;
    }
    canModify() {
        return true;
    }
}
