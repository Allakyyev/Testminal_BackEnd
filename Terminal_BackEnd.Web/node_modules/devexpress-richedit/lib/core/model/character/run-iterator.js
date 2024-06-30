import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
export class RunIterator {
    constructor(runs, chunks, sections, indexForChunks, indexForSections) {
        this.currentRun = null;
        this.currentChunk = null;
        this.currentSection = null;
        this.runs = [];
        this.chunks = [];
        this.sections = [];
        this.currentRunIndex = 0;
        this.currentChunkIndex = 0;
        this.currentSectionIndex = 0;
        this.indexForChunks = [];
        this.indexForSections = [];
        this.runs = runs;
        this.chunks = chunks;
        this.sections = sections;
        this.indexForChunks = indexForChunks;
        this.indexForSections = indexForSections;
    }
    moveNext() {
        this.currentRun = this.runs[this.currentRunIndex];
        if (this.currentRun) {
            this.currentChunk = this.chunks[this.currentChunkIndex];
            this.currentSection = this.sections[this.currentSectionIndex];
            if (this.currentRunIndex == this.indexForChunks[this.currentChunkIndex])
                this.currentChunkIndex++;
            if (this.currentRunIndex == this.indexForSections[this.currentSectionIndex])
                this.currentSectionIndex++;
            this.currentRunIndex++;
            return true;
        }
        else {
            this.currentChunk = undefined;
            this.currentSection = undefined;
            return false;
        }
    }
    currentInterval() {
        if (this.currentRun)
            return new FixedInterval(this.currentChunk.startLogPosition.value + this.currentRun.startOffset, this.currentRun.getLength());
        else
            return new FixedInterval(this.chunks[0].startLogPosition.value + this.runs[0].startOffset, this.runs[0].getLength());
    }
    getFirstRun() {
        return this.runs[0];
    }
    getLastRun() {
        return this.runs[this.runs.length - 1];
    }
    getRunsCount() {
        return this.runs.length;
    }
    reset() {
        this.currentRunIndex = 0;
        this.currentChunkIndex = 0;
        this.currentSectionIndex = 0;
    }
}
