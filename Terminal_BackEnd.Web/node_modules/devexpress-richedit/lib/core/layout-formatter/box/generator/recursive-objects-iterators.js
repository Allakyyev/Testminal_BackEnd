import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { Table, TablePosition } from '../../../model/tables/main-structures/table';
import { BoxWrapFieldInfo } from '../box-wrap';
export class RecursiveObjectsIterator {
    constructor(objects) {
        this.objects = objects;
    }
    getNextObjectPosition() {
        return this.nextObjPosition;
    }
    init(pos) {
        this.indexes = [];
        const index = SearchUtils.normedInterpolationIndexOf(this.objects, (o) => this.getStartPosition(o), pos);
        if (index < 0) {
            this.setNextInfos(0, pos);
            return;
        }
        let obj = this.objects[index];
        while (pos >= this.getEndPosition(obj)) {
            const parent = this.getParent(obj);
            if (!parent) {
                this.setNextInfos(index + 1, pos);
                return;
            }
            obj = parent;
        }
        this.collectIndexes(this.getIndex(obj), pos);
    }
    collectIndexes(index, pos) {
        const insertPos = this.indexes.length;
        let ind = this.correctBounds(index, pos);
        let obj = this.objects[ind];
        const leftBoundIndex = this.indexes.length ? ListUtils.last(this.indexes) : -1;
        while (true) {
            this.indexes.splice(insertPos, 0, ind);
            const parent = this.getParent(obj);
            if (!parent || this.getIndex(parent) == leftBoundIndex)
                break;
            ind = this.getIndex(parent);
            obj = parent;
        }
        this.setNextInfos(ListUtils.last(this.indexes) + 1, pos);
    }
    update(newPosition) {
        if (!this.objects.length)
            return false;
        const indexesDeleted = this.popLastIndexes(newPosition);
        if (newPosition >= this.nextObjPosition) {
            this.nextObjIndex = this.correctBounds(this.nextObjIndex, newPosition);
            this.collectIndexes(this.nextObjIndex, newPosition);
            return true;
        }
        return indexesDeleted;
    }
    setNextInfos(ind, pos) {
        this.nextObjIndex = ind;
        const obj = this.objects[ind];
        if (!obj || this.getStartPosition(obj) >= pos)
            this.nextObjPosition = obj ? this.getStartPosition(obj) : Number.MAX_VALUE;
        else
            this.setNextInfos(ind + 1, pos);
    }
    popLastIndexes(newPosition) {
        if (!this.indexes.length || newPosition < this.getEndPosition(this.objects[ListUtils.last(this.indexes)]))
            return false;
        this.indexes.pop();
        this.popLastIndexes(newPosition);
        return true;
    }
}
export class TableIterator extends RecursiveObjectsIterator {
    getStartPosition(o) {
        return o.getStartPosition();
    }
    getEndPosition(o) {
        return o.getEndPosition();
    }
    getParent(obj) {
        return obj.getParentTable();
    }
    getIndex(obj) {
        return obj.index;
    }
    correctBounds(objIndex, pos) {
        return Table.correctBoundTable(this.objects, objIndex, pos, (i) => ++i).index;
    }
    generateInfo(pos) {
        if (!this.indexes.length)
            return null;
        return ListUtils.map(this.indexes, (ind) => {
            const table = this.objects[ind];
            const rowIndex = SearchUtils.normedInterpolationIndexOf(table.rows, (r) => r.getStartPosition(), pos);
            const cellIndex = SearchUtils.normedInterpolationIndexOf(table.rows[rowIndex].cells, (c) => c.startParagraphPosition.value, pos);
            return new TablePosition(table, rowIndex, cellIndex).init();
        });
    }
}
export class FieldIterator extends RecursiveObjectsIterator {
    getStartPosition(o) {
        return o.getFieldStartPosition();
    }
    getEndPosition(o) {
        return o.getFieldEndPosition();
    }
    getParent(obj) {
        return obj.parent;
    }
    getIndex(obj) {
        return obj.index;
    }
    correctBounds(objIndex, _pos) {
        return objIndex;
    }
    generateInfo(pos) {
        if (!this.indexes.length)
            return null;
        return ListUtils.map(this.indexes, (ind) => BoxWrapFieldInfo.make(this.objects[ind], pos));
    }
}
