import { Field } from '../../../core/model/fields/field';
import { RichUtils } from '../../../core/model/rich-utils';
import { FieldCodeEndRun, FieldCodeStartRun, FieldResultEndRun } from '../../../core/model/runs/simple-runs';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
export class FieldImporter {
    constructor(data) {
        this.currIndex = 0;
        this.data = data;
    }
    get fieldInfoStack() { return this.data.subDocumentInfo.fieldInfoStack; }
    get lastField() { return this.fieldInfoStack.last; }
    applyToLastField(action) {
        const lastField = this.lastField;
        if (lastField)
            action(lastField);
    }
    finishImport() {
    }
    processFieldBegin(fieldInfo) {
        const pos = this.data.subDocumentInfo.positionImporter.currPosition;
        fieldInfo.startPos = pos;
        this.data.subDocumentInfo.characterImporter.addRun(new FieldCodeStartRun(pos, this.data.subDocumentInfo.paragraphImporter.paragraph, this.data.subDocumentInfo.characterImporter.charPropsBundle), RichUtils.specialCharacters.FieldCodeStartRun);
        this.fieldInfoStack.push(fieldInfo);
    }
    processFieldSeparator(fieldInfo) {
        const pos = this.data.subDocumentInfo.positionImporter.currPosition;
        fieldInfo.codeEndPos = pos;
        this.data.subDocumentInfo.characterImporter.addRun(new FieldCodeEndRun(pos, this.data.subDocumentInfo.paragraphImporter.paragraph, this.data.subDocumentInfo.characterImporter.charPropsBundle), RichUtils.specialCharacters.FieldCodeEndRun);
    }
    processFieldEnd(fieldInfo) {
        if (fieldInfo.codeEndPos <= fieldInfo.startPos)
            this.processFieldSeparator(fieldInfo);
        const pos = this.data.subDocumentInfo.positionImporter.currPosition;
        fieldInfo.resultEndIndexPos = pos + 1;
        this.data.subDocumentInfo.characterImporter.addRun(new FieldResultEndRun(pos, this.data.subDocumentInfo.paragraphImporter.paragraph, this.data.subDocumentInfo.characterImporter.charPropsBundle), RichUtils.specialCharacters.FieldResultEndRun);
        return this.finishField(fieldInfo);
    }
    insertHyperlinkInstruction(info) {
        this.fieldInfoStack.last.hyperlinkInfo = info;
    }
    deleteInvalidFieldsInfo() {
        while (this.fieldInfoStack.count > 0) {
            const fieldInfo = this.fieldInfoStack.pop();
            if (fieldInfo.codeEndPos != -1)
                this.data.subDocumentInfo.characterImporter.deleteOneSimpleRun(fieldInfo.codeEndPos);
            this.data.subDocumentInfo.characterImporter.deleteOneSimpleRun(fieldInfo.startPos);
        }
    }
    finishField(fieldInfo) {
        const subDocument = this.data.subDocument;
        const field = new Field(subDocument.positionManager, fieldInfo.index, fieldInfo.startPos, fieldInfo.codeEndPos, fieldInfo.resultEndIndexPos, false, fieldInfo.hyperlinkInfo);
        ListUtils.forEach(fieldInfo.nestedFields, (f) => f.parent = field);
        field.disableUpdate = fieldInfo.disableUpdate;
        field.hideByParent = fieldInfo.hideByParent;
        field.locked = fieldInfo.locked;
        subDocument.fields[fieldInfo.index] = field;
        this.fieldInfoStack.pop();
        return field;
    }
    insertFullField(insertCode, insertResult, hyperlinkInfo) {
        this.data.subDocumentInfo.fieldImporter.currIndex++;
        const startFieldPos = this.data.subDocumentInfo.positionImporter.currPosition;
        const fieldCodeStartRun = new FieldCodeStartRun(startFieldPos, this.data.subDocumentInfo.paragraphImporter.paragraph, this.data.subDocumentInfo.characterImporter.charPropsBundle);
        this.data.subDocumentInfo.characterImporter.addRun(fieldCodeStartRun, RichUtils.specialCharacters.FieldCodeStartRun);
        insertCode();
        const separatorPos = this.data.subDocumentInfo.positionImporter.currPosition;
        const fieldCodeEndRun = new FieldCodeEndRun(separatorPos, this.data.subDocumentInfo.paragraphImporter.paragraph, this.data.subDocumentInfo.characterImporter.charPropsBundle);
        this.data.subDocumentInfo.characterImporter.addRun(fieldCodeEndRun, RichUtils.specialCharacters.FieldCodeEndRun);
        insertResult();
        const endPos = this.data.subDocumentInfo.positionImporter.currPosition;
        const fieldResultEndRun = new FieldResultEndRun(endPos, this.data.subDocumentInfo.paragraphImporter.paragraph, this.data.subDocumentInfo.characterImporter.charPropsBundle);
        this.data.subDocumentInfo.characterImporter.addRun(fieldResultEndRun, RichUtils.specialCharacters.FieldResultEndRun);
        const fields = this.data.subDocument.fields;
        const newFieldIndex = fields.length;
        const newField = new Field(this.data.subDocument.positionManager, newFieldIndex, startFieldPos, separatorPos, endPos + 1, false, hyperlinkInfo);
        Field.addField(fields, newField);
    }
}
