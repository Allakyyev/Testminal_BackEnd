export class ChunkAndRunIndexes {
    constructor(chunkIndex, runIndex) {
        this.chunkIndex = chunkIndex;
        this.runIndex = runIndex;
    }
}
export class FullChunkAndRunInfo {
    constructor(chunkIndex, chunk, runIndex, run, charOffset = 0) {
        this.chunkIndex = chunkIndex;
        this.chunk = chunk;
        this.runIndex = runIndex;
        this.run = run;
        this.charOffset = charOffset;
    }
    getAbsoluteRunPosition() {
        return this.chunk.startLogPosition.value + this.run.startOffset;
    }
    getAbsolutePosition() {
        return this.getAbsoluteRunPosition() + this.charOffset;
    }
    getAbsoluteEndRunPosition() {
        return this.getAbsoluteRunPosition() + this.run.getLength();
    }
    getCurrentChar() {
        return this.chunk.textBuffer[this.run.startOffset + this.charOffset];
    }
    getRunText(from = 0, length = this.run.getLength()) {
        return this.chunk.textBuffer.substr(this.run.startOffset + from, length);
    }
}
