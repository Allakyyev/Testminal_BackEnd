import { ApiParametersChecker } from '../../api-utils/api-utils/parameter-checker';
import { AddAbstractNumberingListHistoryItem, AddNumberingListHistoryItem } from '../../core/model/history/items/numbering-list-history-items';
import { NumberingHelper } from '../../core/model/numbering-lists/numbering-helper';
import { AbstractNumberingList, NumberingList } from '../../core/model/numbering-lists/numbering-list';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ApiUtils } from '../api-utils/api-utils';
import { ModelParametersChecker } from '../api-utils/model-parameter-checker';
import { ListTypeApi, ListTypeApiConverter } from '../lists/enums';
import { ListApi } from '../lists/lists';
import { Collection } from './collection';
export class ListCollection extends Collection {
    create(type) {
        ApiUtils.assertEnum(type, ListTypeApi, `NumberingType`, 'type');
        const templateIndex = NumberingHelper.getNumberingListTemplateIndex(this._processor.modelManager.model, ListTypeApiConverter.toCoreEnum(type));
        const template = this._processor.modelManager.model.abstractNumberingListTemplates[templateIndex];
        var abstractNumberingList = new AbstractNumberingList(this._processor.modelManager.model);
        abstractNumberingList.copyFrom(template);
        this._processor.beginUpdate();
        this._processor.modelManager.history.beginTransaction();
        this._processor.modelManager.history.addAndRedo(new AddAbstractNumberingListHistoryItem(this._processor.modelManager.modelManipulator, abstractNumberingList));
        var abstractNumberingListIndex = this._processor.modelManager.model.abstractNumberingLists.length - 1;
        var numberingList = new NumberingList(this._processor.modelManager.model, abstractNumberingListIndex);
        this._processor.modelManager.history.addAndRedo(new AddNumberingListHistoryItem(this._processor.modelManager.modelManipulator, numberingList));
        this._processor.modelManager.history.endTransaction();
        this._processor.endUpdate();
        return this._getItem(numberingList);
    }
    deleteNumeration(subDocument, interval) {
        const coreInterval = ApiParametersChecker.check(interval, 2, false, [
            ApiParametersChecker.numberDescriptor("position", (n) => new FixedInterval(n, 0)),
            ModelParametersChecker.intervalDescriptor("interval", (interval) => new FixedInterval(interval.start, interval.length))
        ]);
        const SubDocument = this._processor.modelManager.model.subDocuments[subDocument.id];
        var paragraphIndices = SubDocument.getParagraphIndicesByIntervals([coreInterval]);
        this._processor.beginUpdate();
        this._processor.modelManager.history.beginTransaction();
        NumberingHelper.deleteNumberingList(this._processor.modelManager, this._processor.modelManager.model.subDocuments[subDocument.id], paragraphIndices);
        this._processor.modelManager.history.endTransaction();
        this._processor.endUpdate();
    }
    _getItem(coreItem) {
        return new ListApi(this._processor.modelManager, coreItem);
    }
    _getCoreItems() {
        return this._processor.modelManager.model.numberingLists;
    }
}
