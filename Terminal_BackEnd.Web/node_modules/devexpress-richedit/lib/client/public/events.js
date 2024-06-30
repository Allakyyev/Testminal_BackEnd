import { CalculateDocumentVariableEventArgs, EventArgs } from '../../document-processor/docvar-args';
export class Event {
    constructor() {
        this._handlerInfoList = [];
    }
    addHandler(handler, executionContext) {
        this.removeHandler(handler, executionContext);
        const handlerInfo = new HandlerInfo(handler, executionContext);
        this._handlerInfoList.push(handlerInfo);
    }
    removeHandler(handler, executionContext) {
        for (let i = this._handlerInfoList.length - 1; i >= 0; i--) {
            const handlerInfo = this._handlerInfoList[i];
            if (handlerInfo.handler == handler && (!handlerInfo.executionContext && !executionContext || handlerInfo.executionContext == executionContext))
                this._handlerInfoList.splice(i, 1);
        }
    }
    clearHandlers() {
        this._handlerInfoList = [];
    }
    _fireEvent(obj, args) {
        for (let i = 0, handlerInfo; handlerInfo = this._handlerInfoList[i]; i++)
            handlerInfo.handler.call(handlerInfo.executionContext, obj, args);
    }
    isEmpty() {
        return this._handlerInfoList.length == 0;
    }
}
class HandlerInfo {
    constructor(handler, executionContext) {
        this.handler = handler;
        this.executionContext = executionContext;
    }
}
export class RichEditEvent extends Event {
}
export class SelectionChangedEvent extends RichEditEvent {
}
export class DocumentLoadedEvent extends RichEditEvent {
}
export class DocumentChangedEvent extends RichEditEvent {
}
export class DocumentFormattedEvent extends RichEditEvent {
}
export class ActiveSubDocumentChangedEvent extends RichEditEvent {
}
export class GotFocusEvent extends RichEditEvent {
}
export class LostFocusEvent extends RichEditEvent {
}
export class HyperlinkClickEvent extends RichEditEvent {
}
export class PointerDownEvent extends RichEditEvent {
}
export class PointerUpEvent extends RichEditEvent {
}
export class KeyDownEvent extends RichEditEvent {
}
export class KeyUpEvent extends RichEditEvent {
}
export class CalculateDocumentVariableEvent extends RichEditEvent {
}
export class ContentInsertedEvent extends RichEditEvent {
}
export class ContentRemovedEvent extends RichEditEvent {
}
export class CharacterPropertiesChangedEvent extends RichEditEvent {
}
export class ParagraphPropertiesChangedEvent extends RichEditEvent {
}
export class AutoCorrectEvent extends RichEditEvent {
}
export class SavingEvent extends RichEditEvent {
}
export class SavedEvent extends RichEditEvent {
}
export class CustomCommandExecutedEvent extends RichEditEvent {
}
export class PdfExportingEvent extends RichEditEvent {
}
export class PdfExportedEvent extends RichEditEvent {
}
export class CommandStateChangedEvent extends RichEditEvent {
}
export class ContextMenuShowingEvent extends RichEditEvent {
}
export class CalculateDocumentVariableAsyncEvent extends RichEditEvent {
}
export class HyperlinkClickEventArgs extends EventArgs {
    constructor(htmlEvent, handled, targetUri, hyperlinkType, hyperlink) {
        super();
        this.handled = handled;
        this.htmlEvent = htmlEvent;
        this.hyperlinkType = hyperlinkType;
        this.targetUri = targetUri;
        this.hyperlink = hyperlink;
    }
}
export class PointerEventArgs extends EventArgs {
    constructor(htmlEvent) {
        super();
        this.handled = false;
        this.htmlEvent = htmlEvent;
    }
}
export class KeyboardEventArgs extends EventArgs {
    constructor(htmlEvent) {
        super();
        this.handled = false;
        this.htmlEvent = htmlEvent;
    }
}
export class ContentChangedEventArgs extends EventArgs {
    constructor(subDocumentId, interval) {
        super();
        this.subDocumentId = subDocumentId;
        this.interval = interval;
    }
}
export class ContentRemovedEventArgs extends ContentChangedEventArgs {
    constructor(subDocumentId, interval, removedText) {
        super(subDocumentId, interval);
        this.removedText = removedText;
    }
}
export class ParagraphPropertiesChangedEventArgs extends EventArgs {
    constructor(subDocumentId, paragraphIndex) {
        super();
        this.subDocumentId = subDocumentId;
        this.paragraphIndex = paragraphIndex;
    }
}
export class AutoCorrectEventArgs extends EventArgs {
    constructor(text, interval) {
        super();
        this.handled = false;
        this.text = text;
        this.interval = interval;
    }
}
export class SavingEventArgs extends EventArgs {
    constructor(base64, fileName, format, reason) {
        super();
        this.handled = false;
        this.base64 = base64;
        this.fileName = fileName;
        this.format = format;
        this.reason = reason;
    }
}
export class SavedEventArgs extends EventArgs {
    constructor(success, reason) {
        super();
        this.success = success;
        this.reason = reason;
    }
}
export class CustomCommandExecutedEventArgs extends EventArgs {
    constructor(commandName, parameter) {
        super();
        this.commandName = commandName;
        this.parameter = parameter;
    }
}
export class DocumentFormattedEventArgs extends EventArgs {
    constructor(pageCount) {
        super();
        this.pageCount = pageCount;
    }
}
export class PdfExportingEventArgs extends EventArgs {
    constructor(base64, blob, blobStream, handled) {
        super();
        this.base64 = base64;
        this.blob = blob;
        this.blobStream = blobStream;
        this.handled = handled;
    }
}
export class PdfExportedEventArgs extends EventArgs {
    constructor(success) {
        super();
        this.success = success;
    }
}
export class CommandStateChangedEventArgs extends EventArgs {
    constructor(commands) {
        super();
        this.commands = commands;
    }
}
export class ContextMenuShowingEventArgs extends EventArgs {
    constructor(contextMenu) {
        super();
        this.contextMenu = contextMenu;
    }
}
export var DocumentLinkType;
(function (DocumentLinkType) {
    DocumentLinkType[DocumentLinkType["Hyperlink"] = 0] = "Hyperlink";
    DocumentLinkType[DocumentLinkType["Bookmark"] = 1] = "Bookmark";
    DocumentLinkType[DocumentLinkType["EmailAddress"] = 2] = "EmailAddress";
    DocumentLinkType[DocumentLinkType["Document"] = 3] = "Document";
})(DocumentLinkType || (DocumentLinkType = {}));
export { CalculateDocumentVariableEventArgs };
export { EventArgs };
