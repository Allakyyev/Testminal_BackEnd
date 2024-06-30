import { Section } from '../../../core/model/section/section';
import { SectionProperties } from '../../../core/model/section/section-properties';
export class SectionImporter {
    constructor(data) {
        this.data = data;
        this.createSection();
    }
    insertSection() {
        this.data.subDocumentInfo.paragraphImporter.insertParagraph(true);
        this.finishSection();
        this.createSection();
    }
    finishSection() {
        this.section.setLength(this.data.subDocument, this.data.subDocumentInfo.positionImporter.currPosition - this.section.startLogPosition.value);
    }
    createSection() {
        this.properties = this.getDefaultSectionProperties();
        this.section = new Section(this.data.documentModel, this.data.subDocument.positionManager.registerPosition(this.data.subDocumentInfo.positionImporter.currPosition), 0, this.properties);
        const sectionCount = this.data.documentModel.sections.length;
        if (sectionCount > 0) {
            const prevSection = this.data.documentModel.sections[sectionCount - 1];
            this.section.headers.copyFrom(prevSection.headers);
            this.section.footers.copyFrom(prevSection.footers);
        }
        this.data.documentModel.sections.push(this.section);
    }
    getDefaultSectionProperties() {
        return new SectionProperties();
    }
}
