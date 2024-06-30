import { ClientModelManager } from '../../core/model-manager';
import { DocumentProcessorBase } from '../../document-processor/processor';
import { DocumentProcessorBaseApi } from '../../document-processor/public/processor';
import { FieldClientRequestManager, FieldClientRequestManagerOptions } from '../model/fields/field-client-request-manager';
export class DocumentProcessorClient extends DocumentProcessorBase {
    createFieldRequestManager() {
        const options = new FieldClientRequestManagerOptions(null, () => false, this.onCalculateDocumentVariable ? this.onCalculateDocumentVariable : () => { }, () => { });
        return new FieldClientRequestManager(options);
    }
    createModelManager(model, richOptions) {
        return new ClientModelManager(model, richOptions, this);
    }
}
export class DocumentProcessorApi extends DocumentProcessorBaseApi {
    constructor(options) {
        super();
        this._processor = new DocumentProcessorClient(options);
    }
}
