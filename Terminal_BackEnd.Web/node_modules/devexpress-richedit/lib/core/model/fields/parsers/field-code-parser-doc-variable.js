import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { JSONUpdateFieldCommandResult } from '../../json/enums/json-field-enums';
import { ServerModelInserter } from '../../json/importers/server-model-inserter';
import { RichUtils } from '../../rich-utils';
import { SubDocumentPosition } from '../../sub-document';
import { FieldDocVariableRequestData } from '../field-request-manager';
import { FieldName } from '../names';
import { FieldCodeParser, FieldCodeParserState, FieldMailMergeType } from './field-code-parser';
export class FieldCodeParserDocVariable extends FieldCodeParser {
    get name() { return FieldName.DocVariable; }
    getMailMergeType() {
        return FieldMailMergeType.NonMailMerge;
    }
    parseCodeCurrentFieldInternal(responce) {
        if (responce && this.fieldID != undefined && responce[this.fieldID]) {
            if (this.applyResponse(responce[this.fieldID]))
                this.parserState = FieldCodeParserState.resultPartCreated;
            else
                this.parserState = FieldCodeParserState.end;
            return true;
        }
        if (!this.parseSwitchesAndArgs(true)) {
            this.parserState = FieldCodeParserState.end;
            return true;
        }
        if (this.insertDefaultText()) {
            this.parserState = FieldCodeParserState.end;
            return true;
        }
        if (!this.placeRequest()) {
            this.parserState = FieldCodeParserState.end;
            return true;
        }
        return false;
    }
    insertDefaultText() {
        return false;
    }
    placeRequest() {
        if (this.parameterInfoList.length < 1)
            return false;
        this.fieldID = this.subDocument.fieldsWaitingForUpdate.requestManager.add(this.subDocument, this.getRequestData());
        return true;
    }
    getRequestData() {
        return new FieldDocVariableRequestData(this.getTopField().getAllFieldInterval(), this.parameterInfoList[0].text, ListUtils.map(this.parameterInfoList, (paramInfo) => paramInfo.clone(), 1));
    }
    getFormattedResult(value) {
        return RichUtils.replaceParagraphEndCharsWithLineBreak(super.getFormattedResult(value));
    }
    applyResponse(response) {
        var fieldResultInterval = this.getTopField().getResultInterval();
        this.setInputPositionState();
        var simpleText = response[JSONUpdateFieldCommandResult.SimpleText];
        if (simpleText !== undefined) {
            if (simpleText !== null)
                if (simpleText !== "")
                    this.replaceTextByInterval(fieldResultInterval, this.getFormattedResult(simpleText));
                else
                    this.removeInterval(fieldResultInterval);
            return true;
        }
        else if (!response[JSONUpdateFieldCommandResult.Caches]) {
            const rangeCopy = response[JSONUpdateFieldCommandResult.DocumentModel];
            this.removeInterval(fieldResultInterval);
            rangeCopy.insertTo(this.modelManager.modelManipulator, new SubDocumentPosition(this.subDocument, this.getTopField().getResultStartPosition()));
        }
        else {
            this.removeInterval(fieldResultInterval);
            ServerModelInserter.insertDocumentModelFromServer(this.modelManager, response, this.getTopField().getResultStartPosition(), this.subDocument.id);
            return true;
        }
    }
}
