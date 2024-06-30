import { RtfBaseImporter } from './importer-base';
export class RtfCommentsImporter extends RtfBaseImporter {
    constructor(data) {
        super(data);
    }
    insertComments() {
    }
    pushState() {
    }
    popState() {
    }
    startImportSubDocument() {
    }
    finalizeSubDocument() {
        this.insertComments();
    }
}
