import { MaskedCharacterProperties } from '../character/character-properties';
import { MaskedParagraphProperties } from '../paragraph/paragraph-properties';
import { ListLevel, NumberingListReferenceLevel, OverrideListLevel } from './list-level';
import { ListLevelProperties } from './list-level-properties';
export class NumberingListBase {
    constructor(documentModel, levelCount) {
        this.innerId = -1;
        this.levels = [];
        this.deleted = false;
        this.documentModel = documentModel;
        this.initLevels(levelCount);
    }
    getId() {
        if (this.innerId === -1)
            this.innerId = this.generateNewId();
        return this.innerId;
    }
    resetId() {
        this.innerId = -1;
    }
    initLevels(levelCount) {
        for (var i = 0; i < levelCount; i++) {
            var listLevel = this.createLevel(i);
            this.levels.push(listLevel);
        }
    }
    getLevelType(listLevelIndex) {
        if (this.isBulletListLevel(this.levels[listLevelIndex]))
            return NumberingType.Bullet;
        else if (!this.isHybridList())
            return NumberingType.MultiLevel;
        else
            return NumberingType.Simple;
    }
    getListType() {
        if (!this.isHybridList())
            return NumberingType.MultiLevel;
        if (this.isBulletListLevel(this.levels[0]))
            return NumberingType.Bullet;
        else
            return NumberingType.Simple;
    }
    equals(obj) {
        for (var i = 0, level; level = obj.levels[i]; i++) {
            if (!level.equals(this.levels[i]))
                return false;
        }
        return true;
    }
    externallyEquals(obj) {
        if (this.getListType() !== obj.getListType())
            return false;
        var depth = this.getListType() == NumberingType.MultiLevel ? NumberingListBase.depth : 1;
        for (var i = 0; i < depth; i++) {
            if (!this.levels[i].externallyEquals(obj.levels[i]))
                return false;
        }
        return true;
    }
    copyFrom(obj) {
        this.innerId = obj.innerId;
        this.deleted = obj.deleted;
        this.copyLevelsFrom(obj.levels);
    }
    isHybridList() {
        for (var i = 0, listLevel; listLevel = this.levels[i]; i++) {
            if (listLevel.getListLevelProperties().templateCode !== 0)
                return true;
        }
        return false;
    }
    isBulletListLevel(level) {
        return level.getListLevelProperties().displayFormatString.length === 1;
    }
}
NumberingListBase.depth = 3;
NumberingListBase.NoNumberingListIndex = -2;
NumberingListBase.NumberingListNotSettedIndex = -1;
export class AbstractNumberingList extends NumberingListBase {
    constructor(documentModel) {
        super(documentModel, 9);
    }
    generateNewId() {
        return this.documentModel.abstractNumberingListsIdProvider.getNextId();
    }
    createLevel(_index) {
        var characterProperties = MaskedCharacterProperties.createDefault(this.documentModel);
        var paragraphProperties = MaskedParagraphProperties.createDefault(this.documentModel);
        return new ListLevel(this.documentModel, characterProperties, paragraphProperties, new ListLevelProperties());
    }
    copyLevelsFrom(levels) {
        for (var i = 0, level; level = this.levels[i]; i++) {
            level.copyFrom(levels[i]);
        }
    }
    clone(model) {
        const result = new AbstractNumberingList(model);
        result.copyFrom(this);
        return result;
    }
}
export class NumberingList extends NumberingListBase {
    constructor(documentModel, abstractNumberingListIndex) {
        super(documentModel, 9);
        if (abstractNumberingListIndex < 0 || abstractNumberingListIndex >= documentModel.abstractNumberingLists.length)
            throw new Error("abstractNumberingListIndex should be positive and less than length of the abstractNumberingLists array");
        this.abstractNumberingListIndex = abstractNumberingListIndex;
    }
    getAbstractNumberingList() {
        return this.documentModel.abstractNumberingLists[this.abstractNumberingListIndex];
    }
    generateNewId() {
        return this.documentModel.numberingListsIdProvider.getNextId();
    }
    createLevel(index) {
        return new NumberingListReferenceLevel(this, index);
    }
    copyLevelsFrom(levels) {
        for (var i = 0; i < this.levels.length; i++) {
            var sourceLevel = levels[i];
            if (this.levels[i].constructor !== sourceLevel.constructor) {
                if (sourceLevel instanceof OverrideListLevel)
                    this.levels[i] = new OverrideListLevel(this.documentModel, sourceLevel.getCharacterProperties(), sourceLevel.getParagraphProperties(), sourceLevel.getListLevelProperties());
                else
                    this.levels[i] = new NumberingListReferenceLevel(this, i);
            }
            this.levels[i].copyFrom(sourceLevel);
        }
    }
    clone(model) {
        const result = new NumberingList(model, this.abstractNumberingListIndex);
        result.copyFrom(this);
        return result;
    }
}
export var NumberingType;
(function (NumberingType) {
    NumberingType[NumberingType["MultiLevel"] = 0] = "MultiLevel";
    NumberingType[NumberingType["Simple"] = 1] = "Simple";
    NumberingType[NumberingType["Bullet"] = 2] = "Bullet";
})(NumberingType || (NumberingType = {}));
