import { EnumUtils } from '@devexpress/utils/lib/utils/enum';
import { EncodeUtils } from '@devexpress/utils/lib/utils/encode';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { RunType } from '../runs/run-type';
import { CommandType } from './command-type';
import { JSONInsertTextCommandProperty } from './enums/json-character-enums';
import { JSONCommandParametersProperty, JSONPropertyStateBasedCommand } from './enums/json-top-level-enums';
export class ServerCommandRequest {
    constructor(requestType, subDocumentId, commandParams) {
        this.type = requestType;
        this.subDocumentId = subDocumentId;
        this.params = commandParams;
    }
    getJsonObject(withPostData) {
        const request = {};
        request[JSONCommandParametersProperty.CommandType] = this.type;
        request[JSONCommandParametersProperty.IncId] = this.id;
        request[JSONCommandParametersProperty.ServerParams] = this.prepareParams(this.params, withPostData);
        if (this.subDocumentId >= 0)
            request[JSONCommandParametersProperty.SubDocumentId] = this.subDocumentId;
        return request;
    }
    prepareParams(params, withPostData) {
        if (params === null || params === undefined)
            return params;
        const type = typeof params;
        if (type == "number" || type == "boolean")
            return params;
        if (type == "string")
            return withPostData ? EncodeUtils.prepareTextForCallBackRequest(params) : EncodeUtils.prepareTextForRequest(params);
        if (Array.isArray(params))
            return ListUtils.map(params, v => this.prepareParams(v, withPostData));
        if (params.toJSON)
            return params.toJSON();
        return NumberMapUtils.map(params, value => this.prepareParams(value, withPostData));
    }
    static isEditRequest(request) {
        return ServerCommandRequest.isEditCommandType(request.type);
    }
    static isEditCommandType(type) {
        return type < 0;
    }
    static isLoadCommandType(type) {
        return type > 0;
    }
    static isUIBlockingCommandType(type) {
        return type === CommandType.StartCommand || type === CommandType.OpenDocument || type === CommandType.NewDocument;
    }
    isOpenDocumentRequest() {
        return false;
    }
    isSaveDocumentRequest() {
        return false;
    }
    isSpellCheckerRequest() {
        return false;
    }
    isLoadNextChunksRequest() {
        return false;
    }
    isGetSetRtfRequest() {
        return false;
    }
    isForcePushRequest() {
        return false;
    }
    isPdfExportRequest() {
        return false;
    }
    extendTextRequest(_subDocumentId, _position, _textLength, _characterPropertiesJSON, _characterStyleName, _type, _text) {
        return false;
    }
}
export class EditCommandRequest extends ServerCommandRequest {
    getJsonObject(withPostData) {
        const request = super.getJsonObject(withPostData);
        request[JSONCommandParametersProperty.EditIncId] = this.editIncId;
        return request;
    }
}
export class LoadCommandRequest extends ServerCommandRequest {
    isOpenDocumentRequest() {
        return EnumUtils.isAnyOf(this.type, CommandType.OpenDocument, CommandType.NewDocument, CommandType.ReloadDocument);
    }
    isSaveDocumentRequest() {
        return this.type === CommandType.SaveDocument || this.type === CommandType.SaveAsDocument;
    }
    isSpellCheckerRequest() {
        return this.type === CommandType.CheckSpelling || this.type === CommandType.AddWordToDictionary;
    }
    isGetSetRtfRequest() {
        return EnumUtils.isAnyOf(this.type, CommandType.GetRtf, CommandType.InsertRtf);
    }
    isLoadNextChunksRequest() {
        return this.type == CommandType.LoadPieceTable;
    }
    isForcePushRequest() {
        return this.type === CommandType.ForceSyncWithServer;
    }
    isPdfExportRequest() {
        return this.type === CommandType.PdfExported;
    }
}
export class EditTextBufferCommandRequest extends EditCommandRequest {
    constructor(requestType, subDocumentId, text, commandParams) {
        super(requestType, subDocumentId, commandParams);
        this.text = text;
    }
    getJsonObject(withPostData) {
        this.params[JSONInsertTextCommandProperty.Text] = this.text;
        return super.getJsonObject(withPostData);
    }
    extendTextRequest(subDocumentId, position, textLength, characterPropertiesJSON, characterStyleName, type, text) {
        if (this.subDocumentId == subDocumentId &&
            type == RunType.TextRun &&
            this.type === CommandType.InsertSimpleRun &&
            this.params[JSONInsertTextCommandProperty.Position] + this.params[JSONInsertTextCommandProperty.Length] === position &&
            this.params[JSONInsertTextCommandProperty.RunType] === type &&
            this.params[JSONInsertTextCommandProperty.CharacterStyleName] === characterStyleName &&
            JSON.stringify(this.params[JSONInsertTextCommandProperty.CharacterProperties]) === JSON.stringify(characterPropertiesJSON)) {
            this.text += text;
            this.params[JSONInsertTextCommandProperty.Length] += textLength;
            return true;
        }
        else
            return false;
    }
}
export class ClientServerTextBufferChangedCommandRequest extends EditCommandRequest {
    constructor(requestType, subDocumentId, state, commandParams) {
        super(requestType, subDocumentId, commandParams);
        this.state = state;
    }
    getJsonObject(withPostData) {
        this.params[JSONPropertyStateBasedCommand.State] = this.state.toJSON(withPostData);
        return super.getJsonObject(withPostData);
    }
}
export class RequestParams {
    constructor(lockQueue = false, immediateSend = false, processOnCallback = false) {
        this.lockQueue = false;
        this.immediateSend = false;
        this.processOnCallback = false;
        this.lockQueue = lockQueue;
        this.immediateSend = immediateSend;
        this.processOnCallback = processOnCallback;
    }
}
