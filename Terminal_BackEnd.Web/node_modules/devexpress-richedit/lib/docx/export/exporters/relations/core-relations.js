import { RelationsBaseExporter } from './base';
export class CoreRelationsExporter extends RelationsBaseExporter {
    get filePath() { return '_rels/.rels'; }
    fillWriter() {
        this.addRel(this.data.idGenerator.documentRelationId, this.data.constants.rels.officeDocumentType, 'word/document.xml');
        this.addRel(this.data.idGenerator.calcCorePropertiesDocumentRelationId(), this.data.constants.rels.corePropertiesNamespace, 'docProps/core.xml');
    }
}
