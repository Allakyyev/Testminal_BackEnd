import { RichEditClientCommand } from '../../base/commands/client-command';
import { CommandManager } from '../../base/commands/command-manager';
import { DownloadDocumentCommand, DownloadDocxCommand, DownloadRtfCommand, DownloadTxtCommand } from './download-document-command';
import { ExportDocumentCommand } from './export-document-command';
import { InsertPictureCommand } from './insert-picture-command';
import { MailMergeCommand } from './mail-merge-command';
import { NewDocumentCommand } from './new-document-command';
import { OpenDocumentCommand } from './open-document-command';
export class ClientCommandManager extends CommandManager {
    constructor(control, printNonce) {
        super(control, printNonce);
        this.createCommand(control, RichEditClientCommand.OpenDocumentLocally, OpenDocumentCommand);
        this.createCommand(control, RichEditClientCommand.InsertPictureLocally, InsertPictureCommand);
        this.createCommand(control, RichEditClientCommand.CreateNewDocumentLocally, NewDocumentCommand);
        this.createCommand(control, RichEditClientCommand.ExportDocument, ExportDocumentCommand);
        this.createCommand(control, RichEditClientCommand.DownloadDocumentLocally, DownloadDocumentCommand);
        this.createCommand(control, RichEditClientCommand.DownloadDocx, DownloadDocxCommand);
        this.createCommand(control, RichEditClientCommand.DownloadRtf, DownloadRtfCommand);
        this.createCommand(control, RichEditClientCommand.DownloadTxt, DownloadTxtCommand);
        this.createCommand(control, RichEditClientCommand.MailMergeOnClient, MailMergeCommand);
    }
}
