import { Errors } from '@devexpress/utils/lib/errors';
export class LayoutBoxIteratorBase {
    constructor(subDocument, layout, intervalStart, intervalEnd) {
        this.layout = layout;
        this.subDocument = subDocument;
        this.intervalStart = intervalStart;
        this.intervalEnd = intervalEnd;
        this.lastModelPosition = -1;
    }
    isInitialized() {
        throw new Error(Errors.NotImplemented);
    }
    resetToInterval(intervalStart, intervalEnd) {
        this.intervalStart = intervalStart;
        this.intervalEnd = intervalEnd;
        this.lastModelPosition = -1;
        return this.isInitialized();
    }
    moveNext(endRowConflictFlags, middleRowConflictFlags) {
        this.endRowConflictFlags = endRowConflictFlags.clone();
        this.middleRowConflictFlags = middleRowConflictFlags.clone();
        if (this.lastModelPosition < 0) {
            this.position = this.getNewLayoutPosition(this.intervalStart, this.endRowConflictFlags, this.middleRowConflictFlags);
            if (!this.position && this.endRowConflictFlags.atLeastOneIsFalse())
                this.position = this.getNewLayoutPosition(this.intervalStart, this.endRowConflictFlags.setDefault(true), this.middleRowConflictFlags);
            if (this.position) {
                this.lastModelPosition = this.position.getLogPosition();
                return true;
            }
        }
        if (this.lastModelPosition > this.intervalEnd || this.lastModelPosition < 0)
            return false;
        if (this.lastModelPosition == this.intervalEnd)
            return this.setBoundPosition(this.intervalEnd, this.position, (boundPos) => boundPos < this.lastModelPosition);
        const prevPosition = this.position.clone();
        if (!this.advancePosition())
            return this.position.charOffset != this.position.box.getLength() ?
                this.setBoundPosition(this.intervalEnd, prevPosition, (boundPos) => boundPos < this.lastModelPosition) :
                false;
        const currModelPos = this.position.getLogPosition();
        if (currModelPos >= this.intervalEnd)
            return this.setBoundPosition(this.intervalEnd, prevPosition, (boundPos) => boundPos < this.lastModelPosition);
        this.lastModelPosition = currModelPos;
        return true;
    }
    movePrev(endRowConflictFlags, middleRowConflictFlags) {
        this.endRowConflictFlags = endRowConflictFlags.clone();
        this.middleRowConflictFlags = middleRowConflictFlags.clone();
        if (this.lastModelPosition < 0) {
            this.position = this.getNewLayoutPosition(this.intervalEnd, this.endRowConflictFlags, this.middleRowConflictFlags);
            if (!this.position && this.endRowConflictFlags.atLeastOneIsFalse())
                this.position = this.getNewLayoutPosition(this.intervalEnd, this.endRowConflictFlags.setDefault(true), this.middleRowConflictFlags);
            if (this.position) {
                this.lastModelPosition = this.position.getLogPosition();
                return true;
            }
        }
        if (this.lastModelPosition < this.intervalStart || this.lastModelPosition < 0)
            return false;
        if (this.lastModelPosition == this.intervalStart)
            return this.setBoundPosition(this.intervalStart, this.position, (boundPos) => boundPos > this.lastModelPosition);
        const prevPosition = this.position.clone();
        if (!this.advancePositionBack())
            return false;
        const currModelPos = this.position.getLogPosition();
        if (currModelPos <= this.intervalStart)
            return this.setBoundPosition(this.intervalStart, prevPosition, (boundPos) => boundPos > this.lastModelPosition);
        this.lastModelPosition = currModelPos;
        return true;
    }
    setBoundPosition(logPosition, prevPosition, boundFunc) {
        let layoutPosition = this.getNewLayoutPosition(logPosition, this.endRowConflictFlags, this.middleRowConflictFlags);
        if (!layoutPosition)
            layoutPosition = this.getNewLayoutPosition(logPosition, this.endRowConflictFlags.setDefault(true), this.middleRowConflictFlags);
        const modelPos = layoutPosition.getLogPosition();
        if (layoutPosition.equals(prevPosition) || boundFunc(modelPos)) {
            this.position = prevPosition;
            return false;
        }
        this.position = layoutPosition;
        this.lastModelPosition = modelPos;
        return true;
    }
    advancePosition() {
        if (this.position.boxIndex + 1 < this.position.row.boxes.length) {
            this.position.boxIndex++;
            this.position.box = this.position.row.boxes[this.position.boxIndex];
            this.position.charOffset = 0;
            return true;
        }
        if (this.position.advanceToNextRow(this.layout)) {
            this.position.boxIndex = 0;
            this.position.box = this.position.row.boxes[0];
            this.position.charOffset = 0;
            return true;
        }
        return false;
    }
    advancePositionBack() {
        if (this.position.charOffset != 0) {
            this.position.charOffset = 0;
            return true;
        }
        if (this.position.boxIndex > 0) {
            this.position.boxIndex--;
            this.position.box = this.position.row.boxes[this.position.boxIndex];
            this.position.charOffset = 0;
            return true;
        }
        if (this.position.advanceToPrevRow(this.layout)) {
            this.position.boxIndex = this.position.row.boxes.length - 1;
            this.position.box = this.position.row.boxes[this.position.boxIndex];
            this.position.charOffset = 0;
            return true;
        }
        return false;
    }
}
