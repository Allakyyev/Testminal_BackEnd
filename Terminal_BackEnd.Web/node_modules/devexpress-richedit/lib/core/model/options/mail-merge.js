export class MailMergeOptions {
    constructor() {
        this.isEnabled = false;
        this.viewMergedData = false;
        this.activeRecordIndex = 0;
        this.recordCount = 0;
        this.allowInsertFields = false;
    }
    copyFrom(obj) {
        this.isEnabled = obj.isEnabled;
        this.viewMergedData = obj.viewMergedData;
        this.activeRecordIndex = obj.activeRecordIndex;
        this.recordCount = obj.recordCount;
        this.allowInsertFields = obj.allowInsertFields;
    }
    clone() {
        const result = new MailMergeOptions();
        result.copyFrom(this);
        return result;
    }
}
