import { isDefined } from '@devexpress/utils/lib/utils/common';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { Position } from './position';
export class PositionManager {
    constructor() {
        this.notLoadedPicturePositions = [];
        this.positions = [];
    }
    registerSpecRunPosition(position) {
        this.specRunPosition = new Position(position);
        return this.specRunPosition;
    }
    unregisterSpecRunPosition() {
        this.specRunPosition = null;
    }
    registerNotLoadedPicturePosition(position) {
        return this.registerPositionCore(position, this.notLoadedPicturePositions);
    }
    registerPosition(position) {
        return this.registerPositionCore(position, this.positions);
    }
    registerPositionCore(position, collection) {
        var index = SearchUtils.binaryIndexOf(collection, (p) => p.value - position);
        if (index >= 0) {
            var findedPosition = collection[index];
            findedPosition.incRefCount();
            return findedPosition;
        }
        var indexWhereInsert = ~index;
        var newPosition = new Position(position);
        newPosition.incRefCount();
        collection.splice(indexWhereInsert, 0, newPosition);
        return newPosition;
    }
    unregisterPosition(position) {
        this.unregisterPositionCore(position, this.positions);
    }
    unregisterNotLoadedPicturePosition(position) {
        this.unregisterPositionCore(position, this.notLoadedPicturePositions);
    }
    unregisterPositionCore(position, collection) {
        var exactIndex = this.findPosition(position, collection);
        if (exactIndex != null) {
            var findedPosition = collection[exactIndex];
            findedPosition.decRefCount();
            if (!findedPosition.hasReference())
                collection.splice(exactIndex, 1);
        }
        else
            throw new Error("PositionManager unregisterPosition: unregister nonexisted Position");
    }
    findPosition(position, collection) {
        var index = SearchUtils.binaryIndexOf(collection, (p) => p.value - position.value);
        if (index >= 0) {
            var exactIndex;
            for (exactIndex = index; exactIndex >= 0 && collection[exactIndex].value == position.value; exactIndex--) {
                if (collection[exactIndex] == position)
                    return exactIndex;
            }
            var positionsLength = collection.length;
            for (exactIndex = index + 1; exactIndex < positionsLength && collection[exactIndex].value == position.value; exactIndex++) {
                if (collection[exactIndex] == position)
                    return exactIndex;
            }
        }
        return null;
    }
    reset() {
        this.positions = [];
        this.notLoadedPicturePositions = [];
    }
    advance(position, delta, correction = 0) {
        if (isDefined(this.specRunPosition) && this.specRunPosition.value >= position)
            this.specRunPosition.value += delta;
        this.advanceCore(position + correction, this.positions, delta);
        this.advanceCore(position, this.notLoadedPicturePositions, delta);
    }
    advanceCore(position, collection, delta) {
        var index = SearchUtils.binaryIndexOf(collection, (p) => p.value - position);
        var advanceIndex = index >= 0 ? index : ~index;
        var positionsLength = collection.length;
        if (advanceIndex >= positionsLength)
            return;
        if (index >= 0)
            advanceIndex = this.correctPositionIndex(position, collection, delta, advanceIndex);
        var i;
        for (i = advanceIndex; i < positionsLength; i++)
            collection[i].value += delta;
        if (delta < 0 && advanceIndex < positionsLength && advanceIndex >= 0) {
            for (i = advanceIndex; i < positionsLength && collection[i].value < position; i++)
                collection[i].value = position;
        }
    }
    correctPositionIndex(position, collection, delta, corrIndex) {
        if (delta < 0) {
            while (corrIndex < collection.length && collection[corrIndex].value == position)
                corrIndex++;
        }
        else {
            while (corrIndex > 0 && collection[corrIndex - 1].value == collection[corrIndex].value)
                corrIndex--;
        }
        return corrIndex;
    }
}
