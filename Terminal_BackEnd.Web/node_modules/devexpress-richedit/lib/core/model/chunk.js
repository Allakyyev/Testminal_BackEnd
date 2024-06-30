import { ListUtils } from '@devexpress/utils/lib/utils/list';
export class Chunk {
    constructor(startLogPosition, textBuffer, isLast) {
        this.textBuffer = "";
        this.textRuns = [];
        this.startLogPosition = startLogPosition;
        this.textBuffer = textBuffer;
        this.isLast = isLast;
    }
    getEndPosition() {
        return this.startLogPosition.value + this.textBuffer.length;
    }
    getRunText(run) {
        return this.textBuffer.substr(run.startOffset, run.getLength());
    }
    getTextInChunk(offsetAtStartChunk, length) {
        return this.textBuffer.substr(offsetAtStartChunk, length);
    }
    splitRun(runIndex, offset) {
        var run = this.textRuns[runIndex];
        if (!run)
            throw new Error("Undefined run");
        if (offset >= run.getLength())
            throw new Error("Offset >= run.length");
        var newRun = run.createSimularity(run.startOffset + offset, run.getLength() - offset, run.paragraph, run.characterStyle, run.maskedCharacterProperties);
        run.setLength(offset);
        this.textRuns.splice(runIndex + 1, 0, newRun);
    }
    clone(subDocument) {
        const result = new Chunk(subDocument.positionManager.registerPosition(this.startLogPosition.value), this.textBuffer.slice(0), this.isLast);
        result.textRuns = ListUtils.map(this.textRuns, r => r.cloneToNewSubDocument(subDocument));
        return result;
    }
}
