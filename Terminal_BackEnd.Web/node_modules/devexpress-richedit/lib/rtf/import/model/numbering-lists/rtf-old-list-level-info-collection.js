import { RtfOldListLevelInfo } from './rtf-old-list-level-info';
export class RtfOldListLevelInfoCollection {
    constructor() {
        this.listLevelInfo = [];
    }
    getByIndex(index) {
        if (this.listLevelInfo.length <= index)
            this.ensureLevelIndex(index);
        return this.listLevelInfo[index];
    }
    ensureLevelIndex(index) {
        const count = this.listLevelInfo.length;
        for (let i = count; i <= index; i++) {
            this.listLevelInfo.push(new RtfOldListLevelInfo());
        }
    }
}
