export class WriterHelper {
    static convertToHexString(value) {
        return value.toString(16);
    }
    static getValueFromTables(table, value, defaultValue) {
        const res = table.exportMap[value];
        return res !== undefined ?
            res.mlValue.openXmlValue :
            table.exportMap[defaultValue].mlValue.openXmlValue;
    }
    static getValueFromTablesExplicitDefault(table, value, defaultValue) {
        const res = table.exportMap[value];
        return res !== undefined ?
            res.mlValue.openXmlValue :
            defaultValue;
    }
}
