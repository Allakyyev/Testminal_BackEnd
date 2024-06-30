export class TableAnchoredObjectsHolder {
    constructor() {
        this.holder = new Map();
    }
    addTableCellAnchoredObject(tblPos, anchObjId) {
        for (const pos of this.holder.keys()) {
            if (pos.equals(tblPos)) {
                const anchObjIds = this.holder.get(pos);
                if (anchObjIds.indexOf(anchObjId) < 0)
                    anchObjIds.push(anchObjId);
                return;
            }
        }
        this.holder.set(tblPos.clone(), [anchObjId]);
    }
    getTableCellAnchoredObjects(tblPos, formatter) {
        for (const pos of this.holder.keys()) {
            if (pos.equals(tblPos))
                return this.holder.get(pos).map(id => formatter.layoutPosition.page.anchoredObjectHolder.getObjById(id));
        }
        return [];
    }
    shallowCopy() {
        const obj = new TableAnchoredObjectsHolder();
        this.holder.forEach((v, k) => obj.holder.set(k.clone(), [...v]));
        return obj;
    }
}
