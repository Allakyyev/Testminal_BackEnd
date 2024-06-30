export class RtfBaseImporter {
    constructor(data) {
        this.data = data;
    }
    get documentModel() { return this.data.documentModel; }
    get subDocument() { return this.data.subDocument; }
    applyState(states, state) {
        states.pop();
        states.push(state);
    }
}
