import { DestinationType } from '../utils/destination-type';
import { TCFieldState } from './enums';
import { FieldSubDestination } from './field-sub-destination';
export class TableContentFieldDestination extends FieldSubDestination {
    constructor(importer, createField) {
        super(importer);
        if (!createField)
            return;
        this.insertTextCore(TableContentFieldDestination.tcFieldName);
    }
    get destinationType() { return DestinationType.TableContentFieldDestination; }
    tableOfContentsEntryLevelNumberKeyword(parameterValue, hasParameter) {
        this.closeQuotes();
        super.tableOfContentsEntryLevelNumberKeyword(parameterValue, hasParameter);
        this.insertSpace();
    }
    tableOfContentsEntryTypeTableKeyword(parameterValue, hasParameter) {
        this.closeQuotes();
        super.tableOfContentsEntryTypeTableKeyword(parameterValue, hasParameter);
        this.insertSpace();
    }
    processTextCore(text) {
        this.openQuotes();
        super.processTextCore(text);
    }
    createInstance() {
        return this.importer.createTableContentFieldDestination(false);
    }
    onDestinationClose() {
        this.openQuotes();
        this.closeQuotes();
        const info = this.importer.importers.field.fields.pop();
        info.insertInstructionBeforeFieldCode = !this.importer.importers.character.characterFormatting.coreProperties.hidden;
        this.importer.importers.field.TCFieldState = TCFieldState.None;
    }
    openQuotes() {
        if (this.importer.importers.field.TCFieldState == TCFieldState.None) {
            this.importer.importers.field.TCFieldState = TCFieldState.QuotesOpened;
            this.insertTextCore(TableContentFieldDestination.quote);
        }
    }
    closeQuotes() {
        if (this.importer.importers.field.TCFieldState == TCFieldState.QuotesOpened) {
            this.insertTextCore(TableContentFieldDestination.quote);
            this.importer.importers.field.TCFieldState = TCFieldState.QuotesClosed;
        }
    }
    insertSpace() {
        if (this.importer.importers.field.TCFieldState == TCFieldState.None)
            this.insertTextCore(TableContentFieldDestination.space);
    }
}
TableContentFieldDestination.tcFieldName = "tc ";
TableContentFieldDestination.quote = "\"";
TableContentFieldDestination.space = " ";
