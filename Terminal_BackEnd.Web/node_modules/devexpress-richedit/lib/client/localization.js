import { formatMessage } from 'devextreme/localization';
import { AlertMessageText } from '../base/commands/dialogs/dialog-alert-message-command';
import { Browser } from '@devexpress/utils/lib/browser';
import { EncodeUtils } from '@devexpress/utils/lib/utils/encode';
export class Localization {
    static getLocalizatedString(id, arg = '') {
        return EncodeUtils.decodeHtml(formatMessage(id, arg))
            .replace(/<br [/]>/g, '\n');
    }
    static getAlertText(id) {
        if (!this.alertTexts) {
            this.alertTexts = {};
            this.alertTexts[AlertMessageText.ModelIsChanged] = this.getLocalizatedString("ASPxRichEditStringId.ModelIsChangedError");
            this.alertTexts[AlertMessageText.SessionHasExpired] = this.getLocalizatedString("ASPxRichEditStringId.SessionHasExpiredError");
            this.alertTexts[AlertMessageText.OpeningAndOverstoreImpossible] = this.getLocalizatedString("ASPxRichEditStringId.OpeningAndOverstoreImpossibleError");
            this.alertTexts[AlertMessageText.ClipboardAccessDenied] = this.getLocalizatedString("ASPxRichEditStringId.ClipboardAccessDeniedError", Browser.MacOSPlatform ? "Command" : "Ctrl");
            this.alertTexts[AlertMessageText.InnerException] = this.getLocalizatedString("ASPxRichEditStringId.InnerExceptionsError");
            this.alertTexts[AlertMessageText.AuthException] = this.getLocalizatedString("ASPxRichEditStringId.AuthExceptionsError");
            this.alertTexts[AlertMessageText.CantOpenFile] = this.getLocalizatedString("ASPxRichEditStringId.CantOpenDocumentError");
            this.alertTexts[AlertMessageText.CantSaveFile] = this.getLocalizatedString("ASPxRichEditStringId.CantSaveDocumentError");
            this.alertTexts[AlertMessageText.DocVariableException] = this.getLocalizatedString("ASPxRichEditStringId.DocVariableExceptionError");
            this.alertTexts[AlertMessageText.PathTooLongException] = "";
            this.alertTexts[AlertMessageText.InvalidDocumentFormat] = this.getLocalizatedString("ASPxRichEditStringId.InvalidDocumentFormatError");
            this.alertTexts[AlertMessageText.SpellingCheckCompleted] = this.getLocalizatedString("ASPxRichEditStringId.SpellingCheckCompletedInformation");
            this.alertTexts[AlertMessageText.ClipboardAccessDeniedTouch] = this.getLocalizatedString("ASPxRichEditStringId.ClipboardAccessDeniedErrorTouch");
            this.alertTexts[AlertMessageText.CantSaveToEmptyPath] = this.getLocalizatedString("ASPxRichEditStringId.CantSaveToEmptyPathError");
            "";
            this.alertTexts[AlertMessageText.InsertContentFromServerException] = this.getLocalizatedString("ASPxRichEditStringId.InsertContentFromServerExceptionError");
            this.alertTexts[AlertMessageText.DocumentImportError] = this.getLocalizatedString("ASPxRichEditStringId.InvalidDocumentFormatError");
        }
        return this.alertTexts[id];
    }
}
