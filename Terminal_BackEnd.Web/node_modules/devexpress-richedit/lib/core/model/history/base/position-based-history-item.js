import { HistoryItem } from './history-item';
export class PositionBasedHistoryItem extends HistoryItem {
    constructor(modelManipulator, subDocPos) {
        super(modelManipulator);
        this.subDocPos = subDocPos;
    }
    get boundSubDocument() { return this.subDocPos.subDocument; }
    get position() { return this.subDocPos.position; }
}
