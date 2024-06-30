import { FieldsWaitingForUpdate } from './tree-creator';
export function updateFieldSequenceInfo(modelManager, layoutFormatterManager, fieldRequestManager) {
    for (let field of modelManager.model.mainSubDocument.fields) {
        const fieldParser = FieldsWaitingForUpdate.getParser(modelManager, layoutFormatterManager, fieldRequestManager, modelManager.model.mainSubDocument, field);
        if (fieldParser)
            fieldParser.updateInfo();
    }
}
