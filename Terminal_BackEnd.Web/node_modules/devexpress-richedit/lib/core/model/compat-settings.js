export class CompatSettings {
    clone() {
        const result = new CompatSettings();
        result.name = this.name;
        result.uri = this.uri;
        result.value = this.value;
        return result;
    }
}
