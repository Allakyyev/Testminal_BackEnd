import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { ExporterBaseWithRootElement } from '../base';
export class RelationsBaseExporter extends ExporterBaseWithRootElement {
    constructor() {
        super(...arguments);
        this.numRels = 0;
    }
    get rootNSPrefix() { return ''; }
    get rootNSValue() { return this.data.constants.rels.packageRelsNamespace; }
    get rootElement() { return 'Relationships'; }
    addRel(id, type, target, external = false) {
        this.writer.elementStart('Relationship');
        this.writer.attr('Id', id);
        this.writer.attr('Type', type);
        this.writer.attr('Target', StringUtils.isNullOrEmpty(target) ? target : this.urlEncodeAsciiSpecialSymbols(target));
        if (external)
            this.writer.attr('TargetMode', 'External');
        this.writer.endElement();
        this.numRels++;
    }
    urlEncodeAsciiSpecialSymbols(url) {
        if (url) {
            if (url.indexOf(' ') >= 0)
                url = url.replace(' ', '%20');
            if (url.indexOf('\'') >= 0)
                url = url.replace("\'", '%27');
        }
        return url;
    }
}
