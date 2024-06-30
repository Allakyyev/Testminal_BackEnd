import { DestinationType } from '../utils/destination-type';
import { CodeFieldDestination } from './code-field-destination';
import { FieldSubDestination } from './field-sub-destination';
import { ResultFieldDestination } from './result-field-destination';
export class FieldDestination extends FieldSubDestination {
    get destinationType() { return DestinationType.FieldDestination; }
    get controlCharHT() { return null; }
    static onFieldInstructionStartKeyword(importer, _parameterValue, _hasParameter) {
        const destination = importer.destination;
        if (destination.nestedGroupLevel <= 1)
            importer.throwInvalidRtfFile();
        importer.destination = new CodeFieldDestination(importer);
    }
    static onFieldResultStartKeyword(importer, _parameterValue, _hasParameter) {
        const destination = importer.destination;
        if (destination.nestedGroupLevel <= 1)
            importer.throwInvalidRtfFile();
        importer.destination = FieldDestination.createFieldResultDestination(importer);
    }
    static createFieldResultDestination(importer) {
        return new ResultFieldDestination(importer);
    }
    static onFieldLockKeyword(importer, _parameterValue, _hasParameter) {
        importer.importers.field.fields.last.locked = true;
    }
    static onFieldCodeViewKeyword(importer, _parameterValue, _hasParameter) {
        if (!importer.importers.field.updateFieldsOnPaste)
            importer.importers.field.fields.last.isCodeView = true;
    }
    static onFieldEditKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onFieldDirtyKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onFieldPrivateKeyword(_importer, _parameterValue, _hasParameter) {
    }
    startNewField() {
    }
    onDestinationClose() {
        this.importer.importers.field.endField();
    }
    createInstance() {
        return new FieldDestination(this.importer);
    }
}
