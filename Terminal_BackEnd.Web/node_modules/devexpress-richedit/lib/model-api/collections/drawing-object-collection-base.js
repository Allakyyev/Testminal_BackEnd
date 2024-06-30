import { ApiParametersChecker } from '../../api-utils/api-utils/parameter-checker';
import { ModelIterator } from '../../core/model/model-iterator';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { ModelParametersChecker } from '../api-utils/model-parameter-checker';
import { Collection } from './collection';
export class RunWithPosition {
    constructor(run, position) {
        this.run = run;
        this.position = position;
    }
}
export class DrawingObjectCollectionBase extends Collection {
    constructor(processor, subDocument) {
        super(processor);
        this._subDocument = subDocument;
    }
    foreach(callback = () => { }) {
        let iterator = new ModelIterator(this._subDocument, true);
        iterator.setPosition(0);
        do {
            if (ListUtils.unsafeAnyOf(this._runTypes, (type) => type === iterator.run.getType())) {
                const pos = this._subDocument.positionManager.registerPosition(iterator.getAbsolutePosition());
                callback(this._getItem(new RunWithPosition(iterator.run, iterator.getAbsolutePosition())));
                iterator.setPosition(pos.value);
                this._subDocument.positionManager.unregisterPosition(pos);
            }
        } while (iterator.moveToNextChar());
    }
    find(position) {
        const interval = ApiParametersChecker.check(position, 1, false, [
            ApiParametersChecker.numberDescriptor("position", (n) => new FixedInterval(n, 0), 0, this._subDocument.getDocumentEndPosition() - 1),
            ModelParametersChecker.intervalDescriptor("interval", (interval) => new FixedInterval(interval.start, interval.length), 0, this._subDocument.getDocumentEndPosition())
        ]);
        const result = [];
        let iterator = new ModelIterator(this._subDocument, true);
        iterator.setPosition(interval.start);
        do {
            if (ListUtils.unsafeAnyOf(this._runTypes, (type) => type === iterator.run.getType()))
                result.push(this._getItem(new RunWithPosition(iterator.run, iterator.getAbsolutePosition())));
        } while (iterator.moveToNextRun() && iterator.getAbsolutePosition() < interval.end);
        return result;
    }
    _getCoreItems() {
        const result = [];
        let iterator = new ModelIterator(this._subDocument, true);
        iterator.setPosition(0);
        do {
            if (ListUtils.unsafeAnyOf(this._runTypes, (type) => type === iterator.run.getType()))
                result.push({ run: iterator.run, position: iterator.getAbsolutePosition() });
        } while (iterator.moveToNextChar());
        return result;
    }
}
