export class TranslationTablesData {
    constructor() {
        this.importMap = {};
        this.exportMap = {};
    }
    getValueOnImport(key, defaultValue) {
        const mlData = this.importMap[key];
        return mlData ? mlData.modelValue : defaultValue;
    }
}
