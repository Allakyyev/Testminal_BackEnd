export class SearchSettings {
    copyFrom(obj) {
        this.filterInterval = obj.filterInterval;
    }
    clone() {
        const result = new SearchSettings();
        result.copyFrom(this);
        return result;
    }
}
