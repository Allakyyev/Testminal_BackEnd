import { BoundaryInterval } from '@devexpress/utils/lib/intervals/boundary';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { Position } from '../position/position';
export class PositionChecker {
    constructor(model) {
        this.model = model;
    }
    check() {
        return NumberMapUtils.allOf(this.model.subDocuments, sd => {
            this.poss = [];
            this.addParagraphs(sd);
            this.addTables(sd);
            this.addFields(sd);
            this.addBookmarks(sd);
            this.addRangePermissions(sd);
            if (sd.isMain())
                this.addSections();
            return this.compare(this.poss, ListUtils.shallowCopy(sd.positionManager.positions));
        });
    }
    compare(poss, registered) {
        this.sort(registered);
        this.sort(poss);
        let regInterval = new BoundaryInterval(0, 0);
        let prevPos = new Position(-1);
        for (let currPos of poss) {
            if (prevPos.value != currPos.value)
                regInterval = this.getNewRegInterval(registered, regInterval);
            if (!this.checkValue(currPos, registered, regInterval))
                return false;
            prevPos = currPos;
        }
        return true;
    }
    getNewRegInterval(registered, regInterval) {
        regInterval = new BoundaryInterval(regInterval.end, regInterval.end + 1);
        let prevRegPos = registered[regInterval.start];
        for (let currRegPos; currRegPos = registered[regInterval.end]; regInterval.end++) {
            if (prevRegPos.value != currRegPos.value)
                break;
            prevRegPos = currRegPos;
        }
        return regInterval;
    }
    checkValue(currPos, registered, regInterval) {
        for (let i = regInterval.start; i < regInterval.end; i++) {
            if (currPos === registered[i])
                return true;
        }
        return false;
    }
    sort(poss) {
        poss.sort((a, b) => a.value - b.value);
    }
    addSections() {
        for (let s of this.model.sections)
            this.poss.push(s.startLogPosition);
    }
    addParagraphs(sd) {
        for (let p of sd.paragraphs)
            this.poss.push(p.startLogPosition);
    }
    addTables(sd) {
        for (let t of sd.tables) {
            for (let row of t.rows) {
                for (let cell of row.cells) {
                    this.poss.push(cell.startParagraphPosition);
                    this.poss.push(cell.endParagrapPosition);
                }
            }
        }
    }
    addFields(sd) {
        for (let f of sd.fields)
            f.getPositions(this.poss);
    }
    addBookmarks(sd) {
        for (let b of sd.bookmarks) {
            this.poss.push(b._interval._start);
            this.poss.push(b._interval._end);
        }
    }
    addRangePermissions(sd) {
        for (let r of sd.rangePermissions) {
            this.poss.push(r._interval._start);
            this.poss.push(r._interval._end);
        }
    }
}
