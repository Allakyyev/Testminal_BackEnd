import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { TablePositionIndexes } from '../../model/tables/main-structures/table';
import { Log } from '../../rich-utils/debug/logger/base-logger/log';
import { BoxWrapsHolder, IteratorFlags } from './box-wraps-holder';
export class BoxIterator {
    constructor(manager, subDocumentId) {
        this.boxWrapsHolder = new BoxWrapsHolder(manager, subDocumentId);
    }
    get subDocument() {
        return this.boxWrapsHolder.subDocument;
    }
    setNextValidWrapPosition(pos, nestedLevel) {
        this.boxWrapsHolder.setNextValidWrapPosition(pos, nestedLevel);
    }
    allBoxesGiven() {
        return this.boxWrapsHolder.flags.get(IteratorFlags.DocumentEnd);
    }
    getPosition() {
        return this.boxWrapsHolder.position;
    }
    setPosition(position, forceResetBoxInfos, checkStartTable) {
        if (!forceResetBoxInfos && position == this.boxWrapsHolder.position) {
        }
        else {
            this.boxWrapsHolder.setPosition(position, forceResetBoxInfos);
        }
        if (checkStartTable && Log.isEnabled) {
            const w = this.boxWrapsHolder.getWrap();
            if (w && w.info.tablePosition && !new TablePositionIndexes(0, 0).equals(w.info.tablePosition[0])) {
            }
        }
    }
    documentStart() {
        this.boxWrapsHolder.reset(0);
    }
    getWrap(getNextWrap) {
        if (this.boxWrapsHolder.getWrap() && getNextWrap)
            this.boxWrapsHolder.toNextWrap();
        return this.boxWrapsHolder.getWrap();
    }
    getBracketInfo(rowStartPos, rowLength) {
        const rowInterval = new FixedInterval(rowStartPos, rowLength);
        const end = rowStartPos + rowLength;
        let ind = Math.max(0, SearchUtils.normedInterpolationIndexOf(this.boxWrapsHolder.bracketsInfo, (bInfo) => bInfo.absPos, rowStartPos));
        const result = [];
        for (let bInfo; bInfo = this.boxWrapsHolder.bracketsInfo[ind]; ind++) {
            if (bInfo.absPos > end)
                break;
            if (rowInterval.containsWithIntervalEnd(bInfo.absPos))
                result.push(bInfo);
        }
        return result;
    }
    getParagraphBounds(parIndex) {
        return this.boxWrapsHolder.paragraphBoundsInfo[parIndex];
    }
}
export class BracketInfo {
    constructor(absPos, flags, color, length) {
        this.absPos = absPos;
        this.flags = flags;
        this.color = color;
        this.length = length;
    }
    addFlagValue(type) {
        this.flags.set(type, true);
    }
}
