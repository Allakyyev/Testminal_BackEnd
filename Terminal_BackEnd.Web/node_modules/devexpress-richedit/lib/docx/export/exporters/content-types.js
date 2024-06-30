import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
import { ContentType, DocxNsType } from '../../utils/constants';
import { ExporterBaseWithRootElement } from './base';
import { NumberingsExporter } from './numberings';
export class ContentTypesExporter extends ExporterBaseWithRootElement {
    constructor(data) {
        super(data);
        this.usedContentTypes = {};
        this.overriddenContentTypes = {};
        this.registerContentType('rels', ContentType.relations);
        this.registerContentType('xml', ContentType.xml);
        this.registerContentTypeOverride('/word/document.xml', ContentType.mainDocument);
        if (NumberingsExporter.shouldExportNumbering(data.model))
            this.registerContentTypeOverride('/word/numbering.xml', ContentType.numbering);
        this.registerContentTypeOverride('/word/styles.xml', ContentType.styles);
        this.registerContentTypeOverride('/word/settings.xml', ContentType.settings);
        this.registerContentTypeOverride('/docProps/core.xml', ContentType.coreProperties);
    }
    get filePath() { return '[Content_Types].xml'; }
    get rootElement() { return 'Types'; }
    get rootNSPrefix() { return ''; }
    get rootNSValue() { return this.data.constants.namespaces[DocxNsType.ContentTypes].namespace; }
    registerContentTypeOverride(partName, contentType) {
        this.overriddenContentTypes[partName] = contentType;
    }
    registerContentType(partName, contentType) {
        this.usedContentTypes[partName] = contentType;
    }
    fillWriter() {
        StringMapUtils.forEach(this.usedContentTypes, (contentType, extension) => {
            this.writer.elementStart('Default');
            this.writer.attr('Extension', extension);
            this.writer.attr('ContentType', contentType);
            this.writer.endElement();
        });
        StringMapUtils.forEach(this.overriddenContentTypes, (contentType, partName) => {
            this.writer.elementStart('Override');
            this.writer.attr('PartName', partName);
            this.writer.attr('ContentType', contentType);
            this.writer.endElement();
        });
    }
}
