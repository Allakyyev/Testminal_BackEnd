import { Errors } from '@devexpress/utils/lib/errors';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { JSONUpdateFieldCommand, JSONUpdateFieldCommandDocVariableInfo, JSONUpdateFieldCommandDocVariableParameters, JSONUpdateFieldCommandInfo } from '../json/enums/json-field-enums';
export class FieldRequestManager {
    constructor() {
        this.updateMap = {};
    }
    getSubDocumentData(subDocument) {
        let sdData = this.updateMap[subDocument.id];
        if (!sdData)
            this.updateMap[subDocument.id] = sdData = {};
        return sdData;
    }
    clear(subDocument) {
        if (this.updateMap[subDocument.id])
            delete this.updateMap[subDocument.id];
    }
    add(subDocument, data) {
        const sdData = this.getSubDocumentData(subDocument);
        const fieldId = FieldRequestManager.fieldId++;
        sdData[fieldId] = data;
        return fieldId;
    }
    checkResponse(subDocument, response) {
        const sdData = this.getSubDocumentData(subDocument);
        if (sdData && ((NumberMapUtils.isEmpty(sdData) ? !!response : !response) ||
            NumberMapUtils.containsBy(sdData, (_requestInfo, fieldId) => !response[fieldId])))
            throw new Error(Errors.InternalException);
    }
    requestAsJson(subDocument) {
        return {
            [JSONUpdateFieldCommand.ActiveRecord]: this.activeRecord,
            [JSONUpdateFieldCommand.Info]: NumberMapUtils.map(this.getSubDocumentData(subDocument), (reqData) => reqData.asJson())
        };
    }
}
FieldRequestManager.fieldId = 0;
export class TocFieldRequestManager extends FieldRequestManager {
    sendRequest(_subDocument, _activeRecord, _immediateSendRequest) {
    }
    forceSendDelayedRequests() {
    }
}
export class FieldRequestData {
}
export class FieldDocVariableRequestData extends FieldRequestData {
    constructor(fieldInterval, fieldName, parameters) {
        super();
        this.fieldInterval = fieldInterval;
        this.fieldName = fieldName;
        this.parameters = parameters;
    }
    get serverUpdateFieldType() { return ServerUpdateFieldType.DocVariable; }
    asJson() {
        return {
            [JSONUpdateFieldCommandInfo.ServerUpdateFieldType]: this.serverUpdateFieldType,
            [JSONUpdateFieldCommandInfo.Data]: {
                [JSONUpdateFieldCommandDocVariableInfo.FieldName]: this.fieldName,
                [JSONUpdateFieldCommandDocVariableInfo.Parameters]: ListUtils.map(this.parameters, (paramInfo) => {
                    return {
                        [JSONUpdateFieldCommandDocVariableParameters.PureText]: paramInfo.text,
                        [JSONUpdateFieldCommandDocVariableParameters.IntervalStart]: paramInfo.interval.start,
                        [JSONUpdateFieldCommandDocVariableParameters.IntervalEnd]: paramInfo.interval.end,
                    };
                })
            },
        };
    }
}
export class FieldMailMergeRequestData extends FieldRequestData {
    constructor(fieldName) {
        super();
        this.fieldName = fieldName;
    }
    get serverUpdateFieldType() { return ServerUpdateFieldType.MergeField; }
    asJson() {
        return {
            [JSONUpdateFieldCommandInfo.ServerUpdateFieldType]: this.serverUpdateFieldType,
            [JSONUpdateFieldCommandInfo.Data]: {
                [JSONUpdateFieldCommandDocVariableInfo.FieldName]: this.fieldName
            }
        };
    }
}
export var ServerUpdateFieldType;
(function (ServerUpdateFieldType) {
    ServerUpdateFieldType[ServerUpdateFieldType["DocVariable"] = 1] = "DocVariable";
    ServerUpdateFieldType[ServerUpdateFieldType["MergeField"] = 2] = "MergeField";
})(ServerUpdateFieldType || (ServerUpdateFieldType = {}));
