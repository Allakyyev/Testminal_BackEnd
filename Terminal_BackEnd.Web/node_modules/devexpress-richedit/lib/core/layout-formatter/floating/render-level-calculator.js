import { CollisionResult, Polygon } from '@devexpress/utils/lib/geometry/polygon';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { AnchoredObjectLevelType } from '../../layout/main-structures/layout-boxes/layout-anchored-object-box';
import { getLayoutAnchoredObjectBoxInitialComparer } from '../../model/manipulators/floating-objects/comparers';
import { SubDocument } from '../../model/sub-document';
var SubGroupType;
(function (SubGroupType) {
    SubGroupType[SubGroupType["HeaderFooterSubDoc_Behind"] = 0] = "HeaderFooterSubDoc_Behind";
    SubGroupType[SubGroupType["HeaderFooterSubDoc_InText"] = 1] = "HeaderFooterSubDoc_InText";
    SubGroupType[SubGroupType["HeaderFooterSubDoc_InFront"] = 2] = "HeaderFooterSubDoc_InFront";
    SubGroupType[SubGroupType["MainSubDoc_Behind"] = 3] = "MainSubDoc_Behind";
    SubGroupType[SubGroupType["MainSubDoc_InText"] = 4] = "MainSubDoc_InText";
    SubGroupType[SubGroupType["MainSubDoc_InFront"] = 5] = "MainSubDoc_InFront";
})(SubGroupType || (SubGroupType = {}));
export class RenderLevelCalculator {
    constructor() {
        this.maxRenderLevels = Math.max(RenderLevelCalculator.subGroupTypes.length, 9);
        this.realGroupLevelsBounds = [];
        this.renderGroupLevelsBounds = [];
    }
    get mainPageAreaLevel() { return this.realGroupLevelsBounds[SubGroupType.MainSubDoc_InText]; }
    ;
    get headerFooterPageAreasLevel() { return this.realGroupLevelsBounds[SubGroupType.HeaderFooterSubDoc_InText]; }
    ;
    get renderMainPageAreaLevel() { return this.renderGroupLevelsBounds[SubGroupType.MainSubDoc_InText]; }
    ;
    get renderHeaderFooterPageAreasLevel() { return this.renderGroupLevelsBounds[SubGroupType.HeaderFooterSubDoc_InText]; }
    ;
    getRenderLevel(realLevel) {
        const groupLevelInd = ListUtils.indexBy(this.realGroupLevelsBounds, b => realLevel < b, 1) - 1;
        const maxOffset = this.renderGroupLevelsBounds[groupLevelInd + 1] - this.renderGroupLevelsBounds[groupLevelInd] - 1;
        const offsetInGroup = Math.min(realLevel - this.realGroupLevelsBounds[groupLevelInd], maxOffset);
        return this.renderGroupLevelsBounds[groupLevelInd] + offsetInGroup;
    }
    calcLevels(pageAnchoredObjectHolder, anchorObjectsPositionInfo, compatibilityMode) {
        if (NumberMapUtils.isEmpty(pageAnchoredObjectHolder.objects)) {
            this.realGroupLevelsBounds = [0, 1, 2, 3, 4, 5, 6];
            this.renderGroupLevelsBounds = [0, 1, 2, 3, 4, 5, 6];
            return;
        }
        const objects = this.getObjects(pageAnchoredObjectHolder, anchorObjectsPositionInfo);
        const groups = this.getGroups(objects, compatibilityMode);
        for (let group of groups) {
            for (let subGroupType of RenderLevelCalculator.subGroupTypes) {
                const subGroup = group.subGroups[subGroupType];
                if (subGroup && subGroup.objects) {
                    const groupStartLevel = this.realGroupLevelsBounds[subGroupType];
                    ListUtils.forEach(NumberMapUtils.toList(subGroup.objects).sort((a, b) => a.index - b.index), (obj, objInd) => {
                        obj.obj.rendererLevel = groupStartLevel + objInd;
                    });
                }
            }
        }
    }
    equals(other) {
        return ListUtils.equalsByReference(this.realGroupLevelsBounds, other.realGroupLevelsBounds) &&
            ListUtils.equalsByReference(this.renderGroupLevelsBounds, other.renderGroupLevelsBounds);
    }
    getObjects(pageAnchoredObjectHolder, anchorObjectsPositionInfo) {
        const objsForRenderer = NumberMapUtils.toList(pageAnchoredObjectHolder.objects)
            .sort(getLayoutAnchoredObjectBoxInitialComparer(anchorObjectsPositionInfo));
        const objects = ListUtils.map(objsForRenderer, (obj, ind) => new UnfoldedObjectInfo(obj, ind));
        ListUtils.forEach(objects, (obj, ind) => {
            ListUtils.forEach(objects, (subObj) => {
                if (subObj.intersections[obj.index])
                    obj.intersections[subObj.index] = subObj;
            }, 0, ind);
            ListUtils.forEach(objects, (subObj) => {
                if (Polygon.collision(obj.obj.getRotatedPolygon(), subObj.obj.getRotatedPolygon()) != CollisionResult.None)
                    obj.intersections[subObj.index] = subObj;
            }, ind);
        });
        return objects;
    }
    getGroups(objects, compatibilityMode) {
        const groups = [];
        for (let obj of objects) {
            if (!obj.group) {
                obj.group = new Group();
                obj.group.objects[obj.index] = obj;
                groups.push(obj.group);
            }
            NumberMapUtils.forEach(obj.intersections, (intersObj) => {
                obj.group.objects[intersObj.index] = intersObj;
                intersObj.group = obj.group;
            });
        }
        for (let group of groups)
            group.fillSubGroups(compatibilityMode);
        this.fillGroupsBounds(objects, groups);
        return groups;
    }
    fillGroupsBounds(objects, groups) {
        const numObjOnSubGroup = RenderLevelCalculator.subGroupTypes.map(subGroupType => ListUtils.maxExtended(groups, (group) => {
            const subGroup = group.subGroups[subGroupType];
            return subGroup ? subGroup.numObjects : 0;
        }).maxValue);
        const haveHeaderFooter = ListUtils.unsafeAnyOf(objects, obj => obj.obj.belongsToSubDocId != SubDocument.MAIN_SUBDOCUMENT_ID);
        if (haveHeaderFooter)
            numObjOnSubGroup[SubGroupType.HeaderFooterSubDoc_InText]++;
        numObjOnSubGroup[SubGroupType.MainSubDoc_InText]++;
        this.realGroupLevelsBounds = this.translateToBounds(numObjOnSubGroup);
        this.renderGroupLevelsBounds = this.translateToBounds(this.reduceLevels(numObjOnSubGroup));
    }
    translateToBounds(list) {
        const result = [];
        let currLevel = 0;
        for (let numObjs of list) {
            result.push(currLevel);
            currLevel += numObjs;
        }
        result.push(currLevel);
        return result;
    }
    reduceLevels(numObjOnSubGroup) {
        const lvls = ListUtils.shallowCopy(numObjOnSubGroup);
        let sumObjs = ListUtils.accumulateNumber(lvls, v => v);
        const order = RenderLevelCalculator.reduceRenderOrder;
        for (let indInReducer = 0; sumObjs > this.maxRenderLevels; indInReducer++) {
            if (indInReducer >= order.length)
                indInReducer = 0;
            if (lvls[order[indInReducer]] > 1) {
                lvls[order[indInReducer]]--;
                sumObjs--;
            }
        }
        return lvls;
    }
}
RenderLevelCalculator.subGroupTypes = [
    SubGroupType.HeaderFooterSubDoc_Behind,
    SubGroupType.HeaderFooterSubDoc_InText,
    SubGroupType.HeaderFooterSubDoc_InFront,
    SubGroupType.MainSubDoc_Behind,
    SubGroupType.MainSubDoc_InText,
    SubGroupType.MainSubDoc_InFront
];
RenderLevelCalculator.reduceRenderOrder = [
    SubGroupType.HeaderFooterSubDoc_Behind,
    SubGroupType.HeaderFooterSubDoc_InFront,
    SubGroupType.HeaderFooterSubDoc_InText,
    SubGroupType.MainSubDoc_Behind,
    SubGroupType.MainSubDoc_InText,
    SubGroupType.MainSubDoc_InFront
];
class SubGroup {
    constructor() {
        this.objects = {};
        this.numObjects = 0;
    }
    addObject(obj) {
        this.objects[obj.index] = obj;
        this.numObjects++;
    }
}
class Group {
    constructor() {
        this.objects = {};
        this.subGroups = {};
    }
    fillSubGroups(compatibilityMode) {
        NumberMapUtils.forEach(this.objects, (obj) => {
            const subGroupType = this.getObjSubGroupType(obj, compatibilityMode);
            let subGroup = this.subGroups[subGroupType];
            if (!subGroup)
                subGroup = this.subGroups[subGroupType] = new SubGroup();
            subGroup.addObject(obj);
        });
    }
    getObjSubGroupType(obj, compatibilityMode) {
        const offset = obj.obj.belongsToSubDocId == SubDocument.MAIN_SUBDOCUMENT_ID ? 3 : 0;
        switch (obj.obj.anchorInfo.getLevelTypeForRendering(true, compatibilityMode)) {
            case AnchoredObjectLevelType.BehindText: return SubGroupType.HeaderFooterSubDoc_Behind + offset;
            case AnchoredObjectLevelType.InText: return SubGroupType.HeaderFooterSubDoc_InText + offset;
            case AnchoredObjectLevelType.BeforeText: return SubGroupType.HeaderFooterSubDoc_InFront + offset;
        }
    }
}
class UnfoldedObjectInfo {
    constructor(obj, index) {
        this.intersections = {};
        this.obj = obj;
        this.index = index;
    }
}
