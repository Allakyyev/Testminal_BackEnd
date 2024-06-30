import { DocxNsType } from '../../utils/constants';
import { ExporterBaseWithRootElement } from './base';
export class CorePropertiesExporter extends ExporterBaseWithRootElement {
    get filePath() { return 'docProps/core.xml'; }
    get rootElement() { return 'coreProperties'; }
    get rootNSPrefix() { return this.data.constants.namespaces[DocxNsType.CP].prefix; }
    get rootNSValue() { return this.data.constants.namespaces[DocxNsType.CP].namespace; }
    fillWriter() {
        this.registerNamespaces();
        this.writer.writeDCEmptyElement('title');
        this.writer.writeDCEmptyElement('subject');
        this.writer.writeDCEmptyElement('creator');
        this.writer.writeCPEmptyElement('keywords');
        this.writer.writeDCEmptyElement('description');
        this.writer.writeCPEmptyElement('lastModifiedBy');
        this.writer.elementStartNS(DocxNsType.CP, 'revision');
        this.writer.writeString('1');
        this.writer.endElement();
        const date = this.getDateTime();
        this.writer.elementStartNS(DocxNsType.DcTerms, 'created');
        this.writer.attrNS(DocxNsType.Xsi, 'type', 'dcterms:W3CDTF');
        this.writer.writeString(date);
        this.writer.endElement();
        this.writer.elementStartNS(DocxNsType.DcTerms, 'modified');
        this.writer.attrNS(DocxNsType.Xsi, 'type', 'dcterms:W3CDTF');
        this.writer.writeString(date);
        this.writer.endElement();
    }
    registerNamespaces() {
        this.writer.addNamespaceToRootElement(DocxNsType.DC);
        this.writer.addNamespaceToRootElement(DocxNsType.DcTerms);
        this.writer.addNamespaceToRootElement(DocxNsType.DcmiType);
        this.writer.addNamespaceToRootElement(DocxNsType.Xsi);
    }
    getDateTime() {
        const date = new Date();
        const dateString = date.getFullYear() + '-' + this.getLastTwoSlice(date.getMonth() + 1) + '-' + this.getLastTwoSlice(date.getDate());
        const timeString = 'T' + this.getLastTwoSlice(date.getHours()) + ':' + this.getLastTwoSlice(date.getMinutes()) + ':' + this.getLastTwoSlice(date.getSeconds()) + 'Z';
        return dateString + timeString;
    }
    getLastTwoSlice(value) {
        return ('0' + value).slice(-2);
    }
}
