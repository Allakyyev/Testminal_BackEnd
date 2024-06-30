export class RtfTableReaderStateBase {
    constructor(reader) {
        this.reader = reader;
    }
    get data() { return this.reader.data; }
    get documentModel() { return this.data.documentModel; }
    get tableController() { return this.reader.tableController; }
}
