export class RtfFieldInfo {
    constructor() {
        this.startPos = -1;
        this.separatorPos = -1;
        this.endPos = -1;
        this.locked = false;
        this.isHyperlink = false;
        this.isShapeField = false;
        this.isCodeView = false;
        this.insertInstructionBeforeFieldCode = false;
        this.instruction = '';
    }
}
