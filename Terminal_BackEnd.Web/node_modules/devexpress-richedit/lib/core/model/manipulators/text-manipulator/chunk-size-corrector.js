import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { Chunk } from '../../chunk';
import { RunsBaseManipulator } from '../runs-base-manipulator';
export class ChunkSizeCorrector {
    constructor() {
        this.maxChunkSize = 4096;
        this.maxRunSizeCoeff = 0.25;
        this.maxRunSize = Math.floor(this.maxRunSizeCoeff * this.maxChunkSize);
    }
    correctChunkSizeAtChunkIndex(subDocument, chunkIndex) {
        this.subDocument = subDocument;
        this.chunks = subDocument.chunks;
        this.originChunk = this.chunks[chunkIndex];
        this.originChunkIndex = chunkIndex;
        this.originChunkRuns = this.originChunk.textRuns;
        this.startCorrect();
    }
    correctChunkSizeAtInsertPosition(subDocument, insertPosition) {
        this.subDocument = subDocument;
        this.chunks = subDocument.chunks;
        const originRunInfo = this.subDocument.getRunAndIndexesByPosition(insertPosition);
        this.originChunk = originRunInfo.chunk;
        this.originChunkRuns = originRunInfo.chunk.textRuns;
        this.originChunkIndex = originRunInfo.chunkIndex;
        this.startCorrect();
    }
    startCorrect() {
        if (this.originChunk.textBuffer.length <= this.maxChunkSize)
            return;
        this.needMoveLength = this.originChunk.textBuffer.length - this.maxChunkSize;
        if (this.needMoveLength < this.maxChunkSize) {
            if (this.isMoveToPrevChunk())
                return;
            if (this.isMoveToNextChunk())
                return;
        }
        this.moveToNewNextChunks();
    }
    isMoveToPrevChunk() {
        const prevChunk = this.chunks[this.originChunkIndex - 1];
        if (!prevChunk)
            return false;
        let runIndexFrom = 0;
        let run;
        let totallyMoveLength = 0;
        for (; run = this.originChunkRuns[runIndexFrom]; runIndexFrom++) {
            if (run.getLength() > this.maxRunSize) {
                this.originChunk.splitRun(runIndexFrom, this.maxRunSize);
            }
            totallyMoveLength += run.getLength();
            if (totallyMoveLength >= this.needMoveLength)
                break;
        }
        if (totallyMoveLength + prevChunk.textBuffer.length > this.maxChunkSize)
            return false;
        let prevChunkOffset = prevChunk.textBuffer.length;
        for (; runIndexFrom >= 0; runIndexFrom--) {
            run = this.originChunkRuns.shift();
            prevChunk.textRuns.push(run);
            run.startOffset = prevChunkOffset;
            prevChunkOffset += run.getLength();
        }
        prevChunk.textBuffer += this.originChunk.textBuffer.substr(0, totallyMoveLength);
        this.originChunk.textBuffer = this.originChunk.textBuffer.substr(totallyMoveLength);
        this.subDocument.positionManager.unregisterPosition(this.originChunk.startLogPosition);
        this.originChunk.startLogPosition = this.subDocument.positionManager.registerPosition(this.originChunk.startLogPosition.value + totallyMoveLength);
        RunsBaseManipulator.moveRunsInChunk(this.originChunk, 0, -totallyMoveLength);
        return true;
    }
    isMoveToNextChunk() {
        const nextChunk = this.chunks[this.originChunkIndex + 1];
        if (!nextChunk)
            return false;
        let runIndexFrom = this.originChunkRuns.length - 1;
        let run;
        let totallyMoveLength = 0;
        for (; run = this.originChunkRuns[runIndexFrom]; runIndexFrom--) {
            while (run.getLength() > this.maxRunSize) {
                this.originChunk.splitRun(runIndexFrom, this.maxRunSize);
                run = this.originChunkRuns[++runIndexFrom];
            }
            totallyMoveLength += run.getLength();
            if (totallyMoveLength >= this.needMoveLength)
                break;
        }
        if (totallyMoveLength + nextChunk.textBuffer.length > this.maxChunkSize)
            return false;
        RunsBaseManipulator.moveRunsInChunk(nextChunk, 0, totallyMoveLength);
        let offsetFirstRun = totallyMoveLength;
        for (runIndexFrom = this.originChunkRuns.length - runIndexFrom; runIndexFrom > 0; runIndexFrom--) {
            run = this.originChunkRuns.pop();
            nextChunk.textRuns.unshift(run);
            offsetFirstRun -= run.getLength();
            run.startOffset = offsetFirstRun;
        }
        const startMovedPosition = this.originChunk.textBuffer.length - totallyMoveLength;
        nextChunk.textBuffer = this.originChunk.textBuffer.substring(startMovedPosition) + nextChunk.textBuffer;
        this.originChunk.textBuffer = this.originChunk.textBuffer.substring(0, startMovedPosition);
        this.subDocument.positionManager.unregisterPosition(nextChunk.startLogPosition);
        nextChunk.startLogPosition = this.subDocument.positionManager.registerPosition(nextChunk.startLogPosition.value - totallyMoveLength);
        return true;
    }
    moveToNewNextChunks() {
        const isLast = ListUtils.last(this.chunks).isLast;
        let runIndexFrom = this.originChunkRuns.length - 1;
        let run;
        let totallyMoveLength = 0;
        for (; run = this.originChunkRuns[runIndexFrom]; runIndexFrom--) {
            while (run.getLength() > this.maxRunSize) {
                this.originChunk.splitRun(runIndexFrom, this.maxRunSize);
                run = this.originChunkRuns[++runIndexFrom];
            }
            totallyMoveLength += run.getLength();
            if (totallyMoveLength >= this.needMoveLength)
                break;
        }
        let newChunk = undefined;
        let runOffset = 0;
        let indexInsertNewChunk = this.originChunkIndex + 1;
        let chunkStartPosition = this.originChunk.startLogPosition.value + this.originChunkRuns[runIndexFrom].startOffset;
        for (let currRunIndex = runIndexFrom; run = this.originChunkRuns[currRunIndex]; currRunIndex++) {
            if (newChunk == undefined || runOffset + run.getLength() > this.maxChunkSize) {
                if (newChunk)
                    newChunk.textBuffer = this.originChunk.textBuffer.substr(newChunk.startLogPosition.value - this.originChunk.startLogPosition.value, runOffset);
                newChunk = new Chunk(this.subDocument.positionManager.registerPosition(chunkStartPosition), "", false);
                this.chunks.splice(indexInsertNewChunk, 0, newChunk);
                indexInsertNewChunk++;
                runOffset = 0;
            }
            newChunk.textRuns.push(run);
            run.startOffset = runOffset;
            chunkStartPosition += run.getLength();
            runOffset += run.getLength();
        }
        newChunk.textBuffer = this.originChunk.textBuffer.substr(newChunk.startLogPosition.value - this.originChunk.startLogPosition.value, runOffset);
        const originPrevRun = this.originChunkRuns[runIndexFrom - 1];
        this.originChunk.textBuffer = this.originChunk.textBuffer.substring(0, originPrevRun.startOffset + originPrevRun.getLength());
        this.originChunkRuns.splice(runIndexFrom);
        this.originChunk.isLast = false;
        this.chunks[this.chunks.length - 1].isLast = isLast;
    }
}
