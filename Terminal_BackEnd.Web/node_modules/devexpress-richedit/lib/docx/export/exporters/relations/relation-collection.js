import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { RelationsBaseExporter } from './base';
export class RelationCollectionExporter extends RelationsBaseExporter {
    constructor(data, filePath) {
        super(data);
        this._filePath = filePath;
        this.collection = [];
        this.imageRelationsTable = {};
        this.hyperlinkRelationsTable = {};
        this.exportedExternalImageRelationsTable = {};
    }
    get filePath() { return this._filePath; }
    fillWriter() {
        this.generateFileRelationCore(this.imageRelationsTable, this.data.constants.rels.relsImage);
        this.generateFileRelationCore(this.exportedExternalImageRelationsTable, this.data.constants.rels.relsImage, true);
        this.generateHyperlinkRelationsCore(this.hyperlinkRelationsTable, this.data.constants.rels.officeHyperlinkType);
        for (const rel of this.collection)
            this.addRel(rel.id, rel.type, rel.target);
    }
    generateFileRelationCore(relationTable, relationType, external = false) {
        StringMapUtils.forEach(relationTable, (path, relationId) => this.addRel(relationId, relationType, path, external));
    }
    isWriteToZip() { return this.numRels > 0; }
    generateHyperlinkRelationsCore(relationTable, relationType) {
        StringMapUtils.forEach(relationTable, (path, relationId) => this.addRel(relationId, relationType, path, !StringUtils.startsAt(path, '#')));
    }
}
