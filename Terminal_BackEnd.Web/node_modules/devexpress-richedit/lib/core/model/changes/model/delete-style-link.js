import { ModelChangeType } from '../enums';
export class DeleteStyleLinkModelChange {
    constructor(paragraphStyleName) {
        this.paragraphStyleName = paragraphStyleName;
        this.type = ModelChangeType.DeleteStyleLink;
    }
}
