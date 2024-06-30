import { ModelChangeType } from '../enums';
export class CreateStyleLinkModelChange {
    constructor(paragraphStyleName) {
        this.paragraphStyleName = paragraphStyleName;
        this.type = ModelChangeType.CreateStyleLink;
    }
}
