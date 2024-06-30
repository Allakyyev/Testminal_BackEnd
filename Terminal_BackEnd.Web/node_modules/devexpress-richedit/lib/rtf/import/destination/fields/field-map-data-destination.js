import { DestinationBase } from '../base/destination';
import { StringPropertyBaseDestination } from '../base/string-property-base-destination';
import { DestinationType } from '../utils/destination-type';
export var MailMergeFieldType;
(function (MailMergeFieldType) {
    MailMergeFieldType[MailMergeFieldType["Null"] = 0] = "Null";
    MailMergeFieldType[MailMergeFieldType["DbColumn"] = 1] = "DbColumn";
})(MailMergeFieldType || (MailMergeFieldType = {}));
export class FieldMapData {
}
export class FieldMapDataDestination extends DestinationBase {
    constructor() {
        super(...arguments);
        this.fieldsMapData = [];
    }
    get destinationType() { return DestinationType.FieldMapDataDestination; }
    get controlCharHT() { return null; }
    static getFieldMapDataForEdit(importer) {
        const fieldsMapData = importer.destination.fieldsMapData;
        if (fieldsMapData.length == 0)
            fieldsMapData.push(new FieldMapData());
        return fieldsMapData[fieldsMapData.length - 1];
    }
    static onNullFieldTypeKeyword(importer, _parameterValue, _hasParameter) {
        const fieldMapData = FieldMapDataDestination.getFieldMapDataForEdit(importer);
        fieldMapData.fieldType = MailMergeFieldType.Null;
    }
    static onColumnFieldTypeKeyword(importer, _parameterValue, _hasParameter) {
        const fieldMapData = FieldMapDataDestination.getFieldMapDataForEdit(importer);
        fieldMapData.fieldType = MailMergeFieldType.DbColumn;
    }
    static onAddressFieldTypeKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onSalutationFieldTypeKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onMappedFieldTypeKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onBarcodeFieldTypeKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onColumnNameKeyword(importer, _parameterValue, _hasParameter) {
        const fieldMapData = FieldMapDataDestination.getFieldMapDataForEdit(importer);
        importer.destination = new StringPropertyBaseDestination(importer, (value) => {
            fieldMapData.columnName = value;
        });
    }
    static onMappedNameKeyword(importer, _parameterValue, _hasParameter) {
        const fieldMapData = FieldMapDataDestination.getFieldMapDataForEdit(importer);
        importer.destination = new StringPropertyBaseDestination(importer, (value) => {
            fieldMapData.mappedName = value;
        });
    }
    static onColumnIndexKeyword(importer, parameterValue, hasParameter) {
        const fieldMapData = FieldMapDataDestination.getFieldMapDataForEdit(importer);
        fieldMapData.columnIndex = hasParameter ? parameterValue : -1;
    }
    static onDynamicAddressKeyword(importer, parameterValue, hasParameter) {
        if (!hasParameter)
            parameterValue = 1;
        const fieldMapData = FieldMapDataDestination.getFieldMapDataForEdit(importer);
        if (parameterValue == 0)
            fieldMapData.dynamicAddress = false;
        else
            fieldMapData.dynamicAddress = true;
    }
    static onLanguageIdKeyword(importer, parameterValue, hasParameter) {
        if (!hasParameter || parameterValue < 0)
            parameterValue = 0;
        const fieldMapData = FieldMapDataDestination.getFieldMapDataForEdit(importer);
        fieldMapData.mergeFieldNameLanguageId = parameterValue;
    }
    createClone() {
        return new FieldMapDataDestination(this.importer);
    }
}
