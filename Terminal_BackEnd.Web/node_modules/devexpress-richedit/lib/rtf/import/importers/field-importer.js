import { Field } from '../../../core/model/fields/field';
import { RichUtils } from '../../../core/model/rich-utils';
import { FieldCodeEndRun, FieldCodeStartRun, FieldResultEndRun } from '../../../core/model/runs/simple-runs';
import { RtfFieldInfo } from '../model/fields/rtf-field-info';
import { RtfBaseImporter } from './importer-base';
export class RtfFieldImporter extends RtfBaseImporter {
    constructor(data) {
        super(data);
        this.updateFieldsOnPaste = true;
    }
    get fields() { return this.data.positionStates.last.fields; }
    get currentField() { return this.fields.last; }
    startField() {
        this.fields.push(new RtfFieldInfo());
    }
    ensureStartMarkAdded() {
        if (this.currentField.startPos != -1)
            return;
        this.currentField.startPos = this.data.importers.character.logPosition;
        this.currentField.startRun = this.addMarkRun(FieldCodeStartRun, RichUtils.specialCharacters.FieldCodeStartRun);
    }
    ensureSeparatorMarkAdded() {
        if (this.currentField.separatorPos != -1)
            return;
        this.currentField.separatorPos = this.data.importers.character.logPosition;
        this.currentField.separatorRun = this.addMarkRun(FieldCodeEndRun, RichUtils.specialCharacters.SeparatorMark);
    }
    ensureEndMarkAdded() {
        if (this.currentField.endPos != -1)
            return;
        this.currentField.endRun = this.addMarkRun(FieldResultEndRun, RichUtils.specialCharacters.FieldResultEndRun);
        this.currentField.endPos = this.data.importers.character.logPosition;
    }
    addMarkRun(runConstr, text) {
        const charImporter = this.data.importers.character;
        const startRun = this.currentField.startRun;
        if (!startRun)
            return charImporter.addSimpleRun(runConstr, text, false);
        const run = new runConstr(charImporter.logPosition, this.data.importers.paragraph.paragraph, startRun.getCharPropsBundle(this.documentModel));
        return charImporter.addRun(run, text);
    }
    endField() {
        const fieldInfo = this.fields.last;
        if (fieldInfo.isShapeField) {
        }
        this.ensureStartMarkAdded();
        this.ensureSeparatorMarkAdded();
        this.ensureEndMarkAdded();
        this.createFieldWithResult(fieldInfo);
        this.fields.pop();
    }
    getFormattingSourceRun(_field) {
        return null;
    }
    setFieldRunFormatting(_fieldCodeStart, _sourceRun) {
    }
    calculateFieldIndex(fields, newFieldStartPosition) {
        for (let fieldIndex = fields.length - 1; fieldIndex >= 0; fieldIndex--) {
            if (fields[fieldIndex].getFieldStartPosition() < newFieldStartPosition) {
                return fieldIndex + 1;
            }
        }
        return 0;
    }
    createFieldWithResult(fieldInfo) {
        const sd = this.data.subDocument;
        const fieldIndex = this.calculateFieldIndex(sd.fields, fieldInfo.startPos);
        const field = new Field(sd.positionManager, fieldIndex, fieldInfo.startPos, fieldInfo.separatorPos, fieldInfo.endPos, fieldInfo.isCodeView, null);
        Field.addField(sd.fields, field);
    }
    processShapeFieldContentCore(drawingObjectRun, inlinePicture, _inlinePictureRunIndex) {
        if (drawingObjectRun == null || inlinePicture == null || !drawingObjectRun.Inline)
            return;
    }
    processMixedShapeFieldContent() {
        if (this.subDocument.chunks[0].textRuns.length < 4)
            return;
    }
    processShapeFieldContent() {
        if (this.subDocument.chunks[0].textRuns.length < 3)
            return;
    }
    pushState() {
    }
    popState() {
    }
    startImportSubDocument() {
    }
    finalizeSubDocument() {
    }
}
