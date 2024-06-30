import { DestinationBase } from './base/destination';
import { DestinationType } from './utils/destination-type';
export class DestinationRevisionAuthorTable extends DestinationBase {
    constructor() {
        super(...arguments);
        this.author = "";
    }
    get destinationType() { return DestinationType.DestinationRevisionAuthorTable; }
    get controlCharHT() { return null; }
    get keywordHT() { return null; }
    processCharCore(ch) {
        if (ch == ';') {
            this.importer.importers.rangePermission.revisionAuthors.authors.push(this.author);
            this.author = "";
        }
        else
            this.author += ch;
    }
    createClone() {
        return new DestinationRevisionAuthorTable(this.importer);
    }
}
