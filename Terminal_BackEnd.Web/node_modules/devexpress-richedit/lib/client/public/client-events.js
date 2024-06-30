import { ActiveSubDocumentChangedEvent, AutoCorrectEvent, CalculateDocumentVariableAsyncEvent, CalculateDocumentVariableEvent, CharacterPropertiesChangedEvent, CommandStateChangedEvent, ContentInsertedEvent, ContentRemovedEvent, CustomCommandExecutedEvent, DocumentChangedEvent, DocumentFormattedEvent, DocumentLoadedEvent, GotFocusEvent, HyperlinkClickEvent, KeyDownEvent, KeyUpEvent, LostFocusEvent, ParagraphPropertiesChangedEvent, PdfExportedEvent, PdfExportingEvent, PointerDownEvent, PointerUpEvent, ContextMenuShowingEvent, SavedEvent, SavingEvent, SelectionChangedEvent } from './events';
export class Events {
    constructor() {
        this.selectionChanged = new SelectionChangedEvent();
        this.documentLoaded = new DocumentLoadedEvent();
        this.documentFormatted = new DocumentFormattedEvent();
        this.documentChanged = new DocumentChangedEvent();
        this.activeSubDocumentChanged = new ActiveSubDocumentChangedEvent();
        this.gotFocus = new GotFocusEvent();
        this.lostFocus = new LostFocusEvent();
        this.hyperlinkClick = new HyperlinkClickEvent();
        this.pointerDown = new PointerDownEvent();
        this.pointerUp = new PointerUpEvent();
        this.keyDown = new KeyDownEvent();
        this.keyUp = new KeyUpEvent();
        this.calculateDocumentVariable = new CalculateDocumentVariableEvent();
        this.contentInserted = new ContentInsertedEvent();
        this.contentRemoved = new ContentRemovedEvent();
        this.characterPropertiesChanged = new CharacterPropertiesChangedEvent();
        this.paragraphPropertiesChanged = new ParagraphPropertiesChangedEvent();
        this.autoCorrect = new AutoCorrectEvent();
        this.saving = new SavingEvent();
        this.saved = new SavedEvent();
        this.customCommandExecuted = new CustomCommandExecutedEvent();
        this.pdfExporting = new PdfExportingEvent();
        this.pdfExported = new PdfExportedEvent();
        this.commandStateChanged = new CommandStateChangedEvent();
        this.calculateDocumentVariableAsync = new CalculateDocumentVariableAsyncEvent();
        this.contextMenuShowing = new ContextMenuShowingEvent();
    }
    clear() {
        this.selectionChanged.clearHandlers();
        this.documentLoaded.clearHandlers();
        this.documentFormatted.clearHandlers();
        this.documentChanged.clearHandlers();
        this.activeSubDocumentChanged.clearHandlers();
        this.gotFocus.clearHandlers();
        this.lostFocus.clearHandlers();
        this.hyperlinkClick.clearHandlers();
        this.pointerDown.clearHandlers();
        this.pointerUp.clearHandlers();
        this.keyDown.clearHandlers();
        this.keyUp.clearHandlers();
        this.calculateDocumentVariable.clearHandlers();
        this.contentInserted.clearHandlers();
        this.contentRemoved.clearHandlers();
        this.characterPropertiesChanged.clearHandlers();
        this.paragraphPropertiesChanged.clearHandlers();
        this.autoCorrect.clearHandlers();
        this.saving.clearHandlers();
        this.saved.clearHandlers();
        this.customCommandExecuted.clearHandlers();
        this.pdfExporting.clearHandlers();
        this.pdfExported.clearHandlers();
        this.commandStateChanged.clearHandlers();
        this.contextMenuShowing.clearHandlers();
        this.calculateDocumentVariableAsync.clearHandlers();
    }
}
