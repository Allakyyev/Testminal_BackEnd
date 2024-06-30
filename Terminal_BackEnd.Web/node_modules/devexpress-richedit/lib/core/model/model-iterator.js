import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { FullChunkAndRunInfo } from './full-chunk-and-run-info';
export class ModelIterator extends FullChunkAndRunInfo {
    constructor(subDocument, ignoreHiddenRuns) {
        super(-1, null, -1, null, 0);
        this.subDocument = subDocument;
        this.chunks = subDocument.chunks;
        this.ignoreHiddenRuns = ignoreHiddenRuns;
    }
    setPositionByFullRunInfo(runInfo) {
        if (this.run && this.getAbsolutePosition() == runInfo.getAbsolutePosition())
            return;
        this.chunkIndex = runInfo.chunkIndex;
        this.chunk = runInfo.chunk;
        this.runs = this.chunk.textRuns;
        this.runIndex = runInfo.runIndex;
        this.run = runInfo.run;
        this.charOffset = runInfo.charOffset;
        if (this.ignoreHiddenRuns && this.run.getCharacterMergedProperties().hidden)
            this.moveToNextRun();
    }
    setPosition(pos) {
        if (this.run && this.getAbsolutePosition() == pos)
            return;
        this.chunkIndex = SearchUtils.normedInterpolationIndexOf(this.chunks, (c) => c.startLogPosition.value, pos);
        this.chunk = this.chunks[this.chunkIndex];
        var runOffset = pos - this.chunk.startLogPosition.value;
        this.runs = this.chunk.textRuns;
        this.runIndex = SearchUtils.normedInterpolationIndexOf(this.runs, (r) => r.startOffset, runOffset);
        this.run = this.runs[this.runIndex];
        this.charOffset = runOffset - this.run.startOffset;
        if (this.ignoreHiddenRuns && this.run.getCharacterMergedProperties().hidden)
            this.moveToNextRun();
    }
    moveToNextChar() {
        if (this.charOffset + 1 < this.run.getLength()) {
            this.charOffset++;
            return true;
        }
        return this.moveToNextRun();
    }
    moveToPrevChar() {
        if (this.charOffset > 0) {
            this.charOffset--;
            return true;
        }
        return this.moveToPrevRun();
    }
    moveToNextRun() {
        if (this.runIndex + 1 < this.runs.length) {
            this.charOffset = 0;
            this.runIndex++;
            this.run = this.runs[this.runIndex];
            if (this.ignoreHiddenRuns && this.run.getCharacterMergedProperties().hidden)
                return this.moveToNextRun();
            return true;
        }
        if (this.chunkIndex + 1 < this.chunks.length) {
            this.charOffset = 0;
            this.runIndex = 0;
            this.chunkIndex++;
            this.chunk = this.chunks[this.chunkIndex];
            this.runs = this.chunk.textRuns;
            this.run = this.runs[this.runIndex];
            if (this.ignoreHiddenRuns && this.run.getCharacterMergedProperties().hidden)
                return this.moveToNextRun();
            return true;
        }
        return false;
    }
    moveToPrevRun() {
        if (this.runIndex > 0) {
            this.runIndex--;
            this.run = this.runs[this.runIndex];
            this.charOffset = this.run.getLength() - 1;
            if (this.ignoreHiddenRuns && this.run.getCharacterMergedProperties().hidden)
                return this.moveToPrevRun();
            return true;
        }
        if (this.chunkIndex > 0) {
            this.chunkIndex--;
            this.chunk = this.chunks[this.chunkIndex];
            this.runs = this.chunk.textRuns;
            this.runIndex = this.runs.length - 1;
            this.run = this.runs[this.runIndex];
            this.charOffset = this.run.getLength() - 1;
            if (this.ignoreHiddenRuns && this.run.getCharacterMergedProperties().hidden)
                return this.moveToPrevRun();
            return true;
        }
        return false;
    }
    clone() {
        var newIterator = new ModelIterator(this.subDocument, this.ignoreHiddenRuns);
        newIterator.chunks = this.chunks;
        newIterator.chunk = this.chunk;
        newIterator.chunkIndex = this.chunkIndex;
        newIterator.runs = this.runs;
        newIterator.run = this.run;
        newIterator.runIndex = this.runIndex;
        newIterator.charOffset = this.charOffset;
        return newIterator;
    }
}
