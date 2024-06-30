import { NumberingList } from '../../../core/model/numbering-lists/numbering-list';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { DocxNsType } from '../../utils/constants';
import { ExporterBaseWithRootElement } from './base';
export class StylesExporter extends ExporterBaseWithRootElement {
    get filePath() { return 'word/styles.xml'; }
    get rootElement() { return 'styles'; }
    get rootNSPrefix() { return this.data.constants.namespaces[DocxNsType.WordProcessing].prefix; }
    get rootNSValue() { return this.data.constants.namespaces[DocxNsType.WordProcessing].namespace; }
    fillWriter() {
        this.exportDocumentDefaults();
        ListUtils.forEach(this.data.model.paragraphStyles, (style, index) => this.data.parStyleExporter.export(style, index));
        ListUtils.forEach(this.data.model.characterStyles, (style, index) => this.data.charStyleExporter.export(style, index));
        ListUtils.forEach(this.data.model.tableStyles, (style, index) => this.data.tblStyleExporter.export(style, index));
    }
    exportDocumentDefaults() {
        this.writer.writeWpStartElement('docDefaults');
        this.exportDocumentCharacterDefaults();
        this.exportDocumentParagraphDefaults();
        this.writer.endElement();
    }
    exportDocumentCharacterDefaults() {
        this.writer.writeWpStartElement('rPrDefault');
        this.writer.writeWpStartElement('rPr');
        this.data.charPropsExporter.exportRunPropertiesCore(this.data.model.defaultCharacterProperties);
        this.writer.endElement();
        this.writer.endElement();
    }
    exportDocumentParagraphDefaults() {
        this.writer.writeWpStartElement('pPrDefault');
        this.writer.writeWpStartElement('pPr');
        this.data.parPropsExporter.exportParagraphPropertiesCore(this.data.model.defaultParagraphProperties, NumberingList.NumberingListNotSettedIndex, 0, null, true);
        this.writer.endElement();
        this.writer.endElement();
    }
}
