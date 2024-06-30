import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { EnumUtils } from '@devexpress/utils/lib/utils/enum';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { AnchoredObjectLevelType } from '../../../layout/main-structures/layout-boxes/layout-anchored-object-box';
import { AnchorInfoPropertyHistoryItem } from '../../history/items/floating-objects/anchor-info-property-history-item';
import { ModelIterator } from '../../model-iterator';
import { RunType } from '../../runs/run-type';
import { SubDocumentInterval } from '../../sub-document';
import { BaseManipulator } from '../base-manipulator';
import { posAndAncInfoOneSubDocComparer } from './comparers';
export class PosAndAncInfo {
    constructor(anchorInfo, position) {
        this.anchorInfo = anchorInfo;
        this.position = position;
    }
}
export class ZOrderManipulator extends BaseManipulator {
    getNewZOrder(subDoc) {
        const objects = this.getFloatingObjects(subDoc);
        return objects.length ? ListUtils.last(objects).anchorInfo.zOrder + ZOrderManipulator.STEP : ZOrderManipulator.STEP;
    }
    getFloatingObjects(subDoc) {
        const anchorInfos = [];
        const iterator = new ModelIterator(subDoc, false);
        iterator.setPosition(0);
        do {
            if (EnumUtils.isAnyOf(iterator.run.getType(), RunType.AnchoredPictureRun, RunType.AnchoredTextBoxRun))
                anchorInfos.push(new PosAndAncInfo(iterator.run.anchorInfo, iterator.getAbsolutePosition()));
        } while (iterator.moveToNextRun());
        return anchorInfos.sort(posAndAncInfoOneSubDocComparer);
    }
    setNewZOrder(IModelAccessor, subDocument, position, newZOrder) {
        IModelAccessor.history.addAndRedo(new AnchorInfoPropertyHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocument, new FixedInterval(position, 1)), newZOrder, IModelAccessor.modelManipulator.floatingObject.anchorInfo.zOrder));
    }
    bringToFront(IModelAccessor, parentSubDocument, position) {
        const objects = this.getFloatingObjects(parentSubDocument);
        if (ListUtils.last(objects).position == position)
            return true;
        const newZOrder = ListUtils.last(objects).anchorInfo.zOrder + ZOrderManipulator.STEP;
        this.setNewZOrder(IModelAccessor, parentSubDocument, position, newZOrder);
        return true;
    }
    sendToBack(IModelAccessor, parentSubDocument, position) {
        const objects = this.getFloatingObjects(parentSubDocument);
        const firstObject = objects[0];
        if (firstObject.position == position)
            return true;
        const minZOrder = firstObject.anchorInfo.zOrder;
        if (minZOrder > 0) {
            this.setNewZOrder(IModelAccessor, parentSubDocument, position, Math.floor(minZOrder / 2));
            return true;
        }
        const objInd = ListUtils.indexBy(objects, (elem) => elem.position == position);
        objects.splice(objInd, 1);
        IModelAccessor.history.beginTransaction();
        this.setNewZOrder(IModelAccessor, parentSubDocument, position, 1);
        this.advanceOrder(IModelAccessor, parentSubDocument, objects, 0, 2, false);
        IModelAccessor.history.endTransaction();
        return true;
    }
    bringForward(IModelAccessor, parentSubDocument, position) {
        const objects = this.getFloatingObjects(parentSubDocument);
        if (ListUtils.last(objects).position == position)
            return true;
        const objInd = ListUtils.indexBy(objects, (elem) => elem.position == position);
        const newZValue = objects[objInd + 1].anchorInfo.zOrder + 1;
        IModelAccessor.history.beginTransaction();
        this.setNewZOrder(IModelAccessor, parentSubDocument, position, newZValue);
        this.advanceOrder(IModelAccessor, parentSubDocument, objects, objInd + 2, newZValue + 1, objects[objInd].anchorInfo.levelType == AnchoredObjectLevelType.BehindText);
        IModelAccessor.history.endTransaction();
        return true;
    }
    sendBackward(IModelAccessor, parentSubDocument, position) {
        const objects = this.getFloatingObjects(parentSubDocument);
        if (objects[0].position == position)
            return true;
        const objInd = ListUtils.indexBy(objects, (elem) => elem.position == position);
        const newZValue = objects[objInd - 1].anchorInfo.zOrder + 1;
        const obj = objects.splice(objInd, 1)[0];
        IModelAccessor.history.beginTransaction();
        this.setNewZOrder(IModelAccessor, parentSubDocument, position, newZValue);
        this.advanceOrder(IModelAccessor, parentSubDocument, objects, objInd - 1, newZValue + 1, obj.anchorInfo.levelType == AnchoredObjectLevelType.BehindText);
        IModelAccessor.history.endTransaction();
        return true;
    }
    advanceOrder(IModelAccessor, subDocument, objects, fromIndex, minValue, advanceOnlyBehindText) {
        for (let ind = fromIndex, obj = objects[fromIndex], nextObj; obj; ind++) {
            nextObj = objects[ind];
            if (obj.anchorInfo.zOrder >= minValue || advanceOnlyBehindText && obj.anchorInfo.levelType != AnchoredObjectLevelType.BehindText)
                break;
            const interval = FixedInterval.fromPositions(minValue, nextObj ? nextObj.anchorInfo.zOrder : obj.anchorInfo.zOrder + ZOrderManipulator.STEP * 2).normalizeLength();
            minValue = Math.floor(interval.center);
            this.setNewZOrder(IModelAccessor, subDocument, obj.position, minValue);
            minValue++;
            obj = nextObj;
        }
    }
}
ZOrderManipulator.STEP = 1024;
