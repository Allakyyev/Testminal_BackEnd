import { Browser } from '@devexpress/utils/lib/browser';
import { RichEditClientCommand } from '../client-command';
import { DialogParametersBase, ShowDialogCommandBase } from './show-dialog-command-base';
export class DialogAlertMessageCommand extends ShowDialogCommandBase {
    createParameters(_options) {
        const parameters = new AlertMessageDialogParameters();
        parameters.messageTextId = this.getMessageTextId();
        return parameters;
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
}
export class DialogErrorMessageCommand extends DialogAlertMessageCommand {
    getDialogName() {
        return "ErrorMessage";
    }
}
export class DialogInformationMessageCommand extends DialogAlertMessageCommand {
    getDialogName() {
        return "InformationMessage";
    }
}
export class DialogWarningMessageCommand extends DialogAlertMessageCommand {
    getDialogName() {
        return "WarningMessage";
    }
}
export class ShowErrorModelIsChangedMessageCommand extends DialogErrorMessageCommand {
    getMessageTextId() {
        return AlertMessageText.ModelIsChanged;
    }
    afterClosing() {
        this.control.commandManager.getCommand(RichEditClientCommand.ReloadDocument).execute(this.control.commandManager.isPublicApiCall);
    }
}
export class ShowErrorSessionHasExpiredMessageCommand extends DialogErrorMessageCommand {
    getMessageTextId() {
        return AlertMessageText.SessionHasExpired;
    }
}
export class ShowErrorOpeningAndOverstoreImpossibleMessageCommand extends DialogErrorMessageCommand {
    getMessageTextId() {
        return AlertMessageText.OpeningAndOverstoreImpossible;
    }
}
export class ShowErrorCantSaveToEmptyPathMessageCommand extends DialogErrorMessageCommand {
    getMessageTextId() {
        return AlertMessageText.CantSaveToEmptyPath;
    }
}
export class ShowWarningClipboardAccessDeniedMessageCommand extends DialogWarningMessageCommand {
    getMessageTextId() {
        return Browser.TouchUI ? AlertMessageText.ClipboardAccessDeniedTouch : AlertMessageText.ClipboardAccessDenied;
    }
}
export class ShowErrorInnerExceptionMessageCommand extends DialogErrorMessageCommand {
    getMessageTextId() {
        return AlertMessageText.InnerException;
    }
    afterClosing() {
        this.control.commandManager.getCommand(RichEditClientCommand.ReloadDocument).execute(false);
    }
}
export class ShowErrorInvalidDocumentMessageCommand extends DialogErrorMessageCommand {
    getMessageTextId() {
        return AlertMessageText.InvalidDocumentFormat;
    }
}
export class ShowErrorAuthExceptionMessageCommand extends DialogErrorMessageCommand {
    getMessageTextId() {
        return AlertMessageText.AuthException;
    }
    afterClosing() {
        this.control.commandManager.getCommand(RichEditClientCommand.ReloadDocument).execute(this.control.commandManager.isPublicApiCall);
    }
}
export class ShowErrorCantOpenDocument extends DialogErrorMessageCommand {
    getMessageTextId() {
        return AlertMessageText.CantOpenFile;
    }
    isEnabledInClosedDocument() {
        return true;
    }
}
export class ShowErrorCantSaveDocument extends DialogErrorMessageCommand {
    getMessageTextId() {
        return AlertMessageText.CantSaveFile;
    }
}
export class ShowErrorPathTooLong extends DialogErrorMessageCommand {
    getMessageTextId() {
        return AlertMessageText.PathTooLongException;
    }
}
export class ShowErrorDocVariableExceptionCommand extends DialogErrorMessageCommand {
    getMessageTextId() {
        return AlertMessageText.DocVariableException;
    }
}
export class ShowInsertContentFromServerErrorDialogCommand extends DialogErrorMessageCommand {
    getMessageTextId() {
        return AlertMessageText.InsertContentFromServerException;
    }
}
export class ShowLoadPictureErrorDialogCommand extends DialogErrorMessageCommand {
    getMessageTextId() {
        return AlertMessageText.LoadPictureError;
    }
}
export class ShowSpellingCheckCompletedCommand extends DialogInformationMessageCommand {
    getMessageTextId() {
        return AlertMessageText.SpellingCheckCompleted;
    }
}
export class AlertMessageDialogParameters extends DialogParametersBase {
    copyFrom(obj) {
        super.copyFrom(obj);
        this.messageTextId = obj.messageTextId;
    }
    clone() {
        const newInstance = new AlertMessageDialogParameters();
        newInstance.copyFrom(this);
        return newInstance;
    }
    applyConverter(_converter) {
        return this;
    }
}
export var AlertMessageText;
(function (AlertMessageText) {
    AlertMessageText[AlertMessageText["ModelIsChanged"] = 0] = "ModelIsChanged";
    AlertMessageText[AlertMessageText["SessionHasExpired"] = 1] = "SessionHasExpired";
    AlertMessageText[AlertMessageText["OpeningAndOverstoreImpossible"] = 2] = "OpeningAndOverstoreImpossible";
    AlertMessageText[AlertMessageText["ClipboardAccessDenied"] = 3] = "ClipboardAccessDenied";
    AlertMessageText[AlertMessageText["InnerException"] = 4] = "InnerException";
    AlertMessageText[AlertMessageText["AuthException"] = 5] = "AuthException";
    AlertMessageText[AlertMessageText["CantOpenFile"] = 6] = "CantOpenFile";
    AlertMessageText[AlertMessageText["CantSaveFile"] = 7] = "CantSaveFile";
    AlertMessageText[AlertMessageText["DocVariableException"] = 8] = "DocVariableException";
    AlertMessageText[AlertMessageText["PathTooLongException"] = 9] = "PathTooLongException";
    AlertMessageText[AlertMessageText["InvalidDocumentFormat"] = 10] = "InvalidDocumentFormat";
    AlertMessageText[AlertMessageText["SpellingCheckCompleted"] = 11] = "SpellingCheckCompleted";
    AlertMessageText[AlertMessageText["ClipboardAccessDeniedTouch"] = 12] = "ClipboardAccessDeniedTouch";
    AlertMessageText[AlertMessageText["CantSaveToEmptyPath"] = 13] = "CantSaveToEmptyPath";
    AlertMessageText[AlertMessageText["InsertContentFromServerException"] = 14] = "InsertContentFromServerException";
    AlertMessageText[AlertMessageText["LoadPictureError"] = 15] = "LoadPictureError";
    AlertMessageText[AlertMessageText["DocumentImportError"] = 16] = "DocumentImportError";
})(AlertMessageText || (AlertMessageText = {}));
