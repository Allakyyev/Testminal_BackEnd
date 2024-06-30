import { ClientModelManager } from '../core/model-manager';
import { InlinePictureInfo } from '../core/model/manipulators/picture-manipulator/insert-picture-manipulator-params';
import { ImageLoadingOptions } from '../core/model/manipulators/picture-manipulator/loader/image-loading-options';
import { EmptyBatchUpdatableObject } from '@devexpress/utils/lib/class/batch-updatable';
import { DataTransferUtils } from '@devexpress/utils/lib/utils/data-transfer';
import { EvtUtils } from '@devexpress/utils/lib/utils/evt';
import { RtfImporterOptions } from '../rtf/import/importer-options';
import { RtfImporter } from '../rtf/import/rtf-importer';
import { SubDocumentInterval, SubDocumentPosition } from '../core/model/sub-document';
import { RichEditClientCommand } from './commands/client-command';
import { CommandBase } from './commands/command-base';
export class ClipboardContentInserter {
    constructor(control) {
        this.control = control;
        this.processed = false;
    }
    insert(evt) {
        const plainTextItem = DataTransferUtils.getPlainTextItem(evt.clipboardData.items);
        const rtfItem = DataTransferUtils.getRtfTextItem(evt.clipboardData.items);
        const htmlItem = DataTransferUtils.getTransferItemByType(evt.clipboardData.items, 'text/html');
        if (rtfItem) {
            this.loadingPanelManager = this.control.loadingPanelManager.loadingPanel.showPanelDelayed(400);
            EvtUtils.preventEvent(evt);
            if (rtfItem)
                this.insertClipboardRtf(rtfItem);
            if (htmlItem)
                this.insertClipboardHtml(htmlItem);
            return true;
        }
        if (!plainTextItem) {
            const file = DataTransferUtils.getImageItem(evt.clipboardData.items);
            if (file) {
                EvtUtils.preventEvent(evt);
                this.insertClipboardPicture(file);
                return true;
            }
        }
        return false;
    }
    insertClipboardHtml(htmlItem) {
        try {
            htmlItem.getAsString((htmlText) => {
                if (this.processed)
                    return;
                const command = this.control.commandManager.getCommand(RichEditClientCommand.InsertHtml);
                command.execute(true, htmlText);
                this.processed = true;
            });
        }
        catch (_a) {
            console.warn("Html insert error");
        }
        finally {
            this.loadingPanelManager.hidePanel();
        }
    }
    insertClipboardPicture(file) {
        this.control.beginUpdate();
        this.control.isLoadingPictureFromClipboard = true;
        const charInfo = this.control.modelManager.model.cache.imageCache.createUnloadedInfoByFile(file);
        const subDocument = this.control.selection.activeSubDocument;
        const interval = this.control.selection.currState.interval.clone();
        this.control.modelManager.history.addTransaction(() => {
            CommandBase.addSelectionBefore(this.control);
            this.control.modelManager.modelManipulator.range.removeInterval(new SubDocumentInterval(subDocument, interval), true, true);
            this.control.modelManager.modelManipulator.picture.insertInlinePictureViaHistory(new SubDocumentPosition(subDocument, interval.start), this.control.inputPosition.charPropsBundle, InlinePictureInfo.defaultInfo(charInfo), new ImageLoadingOptions(true, undefined, () => this.control.isLoadingPictureFromClipboard = false));
            CommandBase.addSelectionAfter(this.control, interval.start + 1);
        });
        this.control.endUpdate();
    }
    insertClipboardRtf(rtfItem) {
        this.control.isLoadingPictureFromClipboard = true;
        rtfItem.getAsString((rtf) => {
            if (this.processed || !rtf)
                return;
            if (rtf.length > 100000)
                this.loadingPanelManager.executeIfTimerExpired();
            const options = new RtfImporterOptions(() => { });
            new RtfImporter(options).importFromString(rtf, this.control.modelManager.richOptions, (model, formatImagesImporter) => {
                this.loadingPanelManager.executeIfTimerExpired();
                formatImagesImporter.whenAllPicturesLoaded((_success) => {
                    this.loadingPanelManager.executeIfTimerExpired();
                    this.control.beginUpdate();
                    const subDocument = this.control.selection.activeSubDocument;
                    const interval = this.control.selection.currState.interval.clone();
                    this.control.modelManager.history.addTransaction(() => {
                        CommandBase.addSelectionBefore(this.control);
                        this.control.modelManager.modelManipulator.range.removeInterval(new SubDocumentInterval(subDocument, interval), true, true);
                        const result = this.control.modelManager.modelManipulator.subDocument.insertSubDocument(new SubDocumentPosition(subDocument, interval.start), new SubDocumentInterval(model.mainSubDocument, model.mainSubDocument.interval));
                        CommandBase.addSelectionAfter(this.control, result.insetedInterval.end);
                        model.updateHyperlinkFields(this.control, new SubDocumentInterval(subDocument, result.insetedInterval), result.newSubDocuments);
                    });
                    this.control.endUpdate();
                    this.control.isLoadingPictureFromClipboard = false;
                    this.control.commandManager.abortClipboardCommandExecution();
                }, 5000);
                const newModelManager = new ClientModelManager(model, this.control.modelManager.richOptions, new EmptyBatchUpdatableObject());
                formatImagesImporter.import(newModelManager.modelManipulator);
                this.loadingPanelManager.hidePanel();
                this.processed = true;
            }, (_reason) => {
                console.warn("Rtf insert error");
                this.loadingPanelManager.hidePanel();
            });
        });
    }
}
