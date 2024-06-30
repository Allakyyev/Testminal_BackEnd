import { ImportFieldInfo } from '../../model/import-field-info';
import { ElementDestination } from '../destination';
export class FieldDestinationBase extends ElementDestination {
    processFieldBegin(disableUpdate, locked, hideByParent) {
        const fieldInfo = new ImportFieldInfo();
        fieldInfo.disableUpdate = disableUpdate;
        fieldInfo.locked = locked;
        fieldInfo.hideByParent = hideByParent;
        fieldInfo.index = this.data.subDocumentInfo.fieldImporter.currIndex++;
        this.data.subDocumentInfo.fieldImporter.processFieldBegin(fieldInfo);
    }
    processFieldSeparator() {
        this.data.subDocumentInfo.fieldImporter.applyToLastField((fieldInfo) => {
            if (fieldInfo.codeEndPos == -1)
                this.data.subDocumentInfo.fieldImporter.processFieldSeparator(fieldInfo);
        });
    }
    processFieldEnd() {
        this.data.subDocumentInfo.fieldImporter.applyToLastField((fieldInfo) => {
            const field = this.data.subDocumentInfo.fieldImporter.processFieldEnd(fieldInfo);
            if (this.data.subDocumentInfo.fieldImporter.fieldInfoStack.count > 0)
                this.data.subDocumentInfo.fieldImporter.fieldInfoStack.last.nestedFields.push(field);
        });
    }
}
