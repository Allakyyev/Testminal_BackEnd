import { RtfImportData } from '../../rtf-import-data';
import { TableRtfTableManagerState } from './manager-state';
import { RtfTableReaderStateBase } from './state-base';
export class NoTableRtfTableReaderState extends RtfTableReaderStateBase {
    constructor() {
        super(...arguments);
        this.defaultNestingLevel = 1;
    }
    onEndParagraph(paragraphFormattingInfo) {
        if (!paragraphFormattingInfo.inTableParagraph)
            return;
        const newState = this.changeState();
        newState.onEndParagraph(paragraphFormattingInfo);
    }
    onStartNestedTableProperties() {
        RtfImportData.throwInvalidRtfFile();
    }
    onEndRow() {
        RtfImportData.throwInvalidRtfFile();
    }
    onEndCell() {
        const newState = this.changeState();
        newState.onEndCell();
    }
    onEndNestedRow() {
        RtfImportData.throwInvalidRtfFile();
    }
    onEndNestedCell() {
        const newState = this.changeState();
        newState.onEndNestedCell();
    }
    onTableRowDefaults() {
    }
    changeState() {
        const newState = new TableRtfTableManagerState(this.reader);
        this.reader.changeState(newState);
        return newState;
    }
}
