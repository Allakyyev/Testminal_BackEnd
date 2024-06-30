export class EventArgs {
}
export class CalculateDocumentVariableEventArgs extends EventArgs {
    constructor(fieldInterval, variableName, args) {
        super();
        this.fieldInterval = fieldInterval;
        this.variableName = variableName;
        this.args = args;
        this.value = null;
        this.keepLastParagraph = false;
    }
}
export class DocumentVariableData {
    constructor(callback, fieldInterval, variableName, args) {
        this.callback = callback;
        this.fieldInterval = fieldInterval;
        this.variableName = variableName;
        this.args = args;
    }
}
export class CalculateDocumentVariableAsyncEventArgs extends EventArgs {
    constructor(data) {
        super();
        this.data = data;
    }
}
