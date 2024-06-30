import { NumberingsExporter } from '../numberings';
import { RelationCollectionExporter } from './relation-collection';
export class DocumentRelationsExporter extends RelationCollectionExporter {
    constructor(data) {
        super(data, 'word/_rels/document.xml.rels');
        this.headerRelationsTable = {};
        this.footerRelationsTable = {};
        this.footNoteRelationsTable = {};
        this.endNoteRelationsTable = {};
        this.commentRelationsTable = {};
        this.commentsExtendedRelationsTable = {};
    }
    fillWriter() {
        super.fillWriter();
        this.generateFileRelationCore(this.headerRelationsTable, this.data.constants.rels.relsHeader);
        this.generateFileRelationCore(this.footerRelationsTable, this.data.constants.rels.relsFooter);
        this.generateFileRelationCore(this.footNoteRelationsTable, this.data.constants.rels.relsFootNote);
        this.generateFileRelationCore(this.endNoteRelationsTable, this.data.constants.rels.relsEndNote);
        this.generateFileRelationCore(this.commentsExtendedRelationsTable, this.data.constants.rels.relsCommentsExtended);
        this.generateFileRelationCore(this.commentRelationsTable, this.data.constants.rels.relsComment);
        this.addRel('RelStyle1', this.data.constants.rels.officeStylesType, 'styles.xml');
        if (this.data.model.webSettings.isBodyMarginsSet())
            this.addRel('RelWebSettings1', this.data.constants.rels.officeWebSettingsType, 'webSettings.xml');
        if (NumberingsExporter.shouldExportNumbering(this.data.model))
            this.addRel('RelNum1', this.data.constants.rels.officeNumberingType, 'numbering.xml');
        this.addRel('RelSettings1', this.data.constants.rels.officeDocumentSettings, 'settings.xml');
        this.addRel('RelTheme1', this.data.constants.rels.officeThemesType, 'theme/theme1.xml');
    }
}
