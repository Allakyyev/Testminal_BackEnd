import { StringUtils } from '@devexpress/utils/lib/utils/string';
export class OpenXmlRelation {
    constructor(id, target, type, targetMode) {
        this.id = id;
        this.target = target;
        this.type = type;
        this.targetMode = targetMode;
    }
    isEmpty() {
        return StringUtils.isNullOrEmpty(this.id) ||
            StringUtils.isNullOrEmpty(this.type) ||
            StringUtils.isNullOrEmpty(this.target);
    }
}
