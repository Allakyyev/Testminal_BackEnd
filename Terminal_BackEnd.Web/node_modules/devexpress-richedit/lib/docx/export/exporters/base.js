import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { XmlWriter } from '../../zip/xml-writer';
export class BaseExporter {
    constructor(data) {
        this.data = data;
    }
    get writer() { return this.data.writer; }
}
export class ExporterBaseWithRootElement extends BaseExporter {
    export() {
        const rootElementName = (StringUtils.isNullOrEmpty(this.rootNSPrefix) ? '' : `${this.rootNSPrefix}:`) + this.rootElement;
        this.data.writer = new XmlWriter(this.data.constants).initNS(rootElementName, this.rootNSValue);
        this.fillWriter();
        if (this.isWriteToZip())
            this.writeToZip(this.filePath, this.writer);
        this.data.popWriter();
    }
    get rootNSPrefix() { return ''; }
    get rootNSValue() { return ''; }
    isWriteToZip() { return true; }
    writeToZip(filePath, writer) {
        this.data.zipBuilder.addFile(filePath, writer);
    }
}
