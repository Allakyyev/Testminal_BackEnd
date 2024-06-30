import { DestinationType } from '../utils/destination-type';
import { FieldSubDestination } from './field-sub-destination';
export class CodeFieldDestination extends FieldSubDestination {
    get destinationType() { return DestinationType.CodeFieldDestination; }
    get currentInfo() { return this.importer.importers.field.currentField; }
    createInstance() {
        return new CodeFieldDestination(this.importer);
    }
    processTextCore(text) {
        this.currentInfo.instruction += text;
        this.importer.importers.field.ensureStartMarkAdded();
        super.processTextCore(text);
    }
    processCharCore(ch) {
        this.currentInfo.instruction += ch;
        this.importer.importers.field.ensureStartMarkAdded();
        super.processCharCore(ch);
    }
    onDestinationClose() {
        const fieldType = this.getCurrentFieldType();
        this.currentInfo.isShapeField = fieldType == "shape";
        const fieldImporter = this.importer.importers.field;
        fieldImporter.ensureStartMarkAdded();
        fieldImporter.ensureSeparatorMarkAdded();
    }
    getCurrentFieldType() {
        const tokens = this.currentInfo.instruction.split(/\s+/);
        let result = tokens.filter(token => token !== '')[0];
        return result ? result.toLowerCase() : result;
    }
}
