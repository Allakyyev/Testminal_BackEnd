import { CharacterPropertiesMerger } from '../properties-merger/character-properties-merger';
import { ParagraphPropertiesMerger } from '../properties-merger/paragraph-properties-merger';
export class ListLevel {
    constructor(documentModel, maskedCharacterProperties, maskedParagraphProperties, listLevelProperties) {
        this.documentModel = documentModel;
        this.setCharacterProperties(maskedCharacterProperties);
        this.setParagraphProperties(maskedParagraphProperties);
        this.setListLevelProperties(listLevelProperties);
    }
    getListLevelProperties() {
        return this.listLevelProperties;
    }
    setListLevelProperties(properties) {
        this.listLevelProperties = this.documentModel.cache.listLevelPropertiesCache.getItem(properties);
    }
    changeListLevelProperties(change) {
        const currentPropertiesCopy = this.listLevelProperties.clone();
        change(currentPropertiesCopy);
        this.setListLevelProperties(currentPropertiesCopy);
    }
    getCharacterProperties() {
        return this.maskedCharacterProperties;
    }
    getParagraphProperties() {
        return this.maskedParagraphProperties;
    }
    setParagraphProperties(properties) {
        this.maskedParagraphProperties = this.documentModel.cache.maskedParagraphPropertiesCache.getItem(properties);
    }
    onParagraphPropertiesChanged() {
        this.resetParagraphMergedProperties();
    }
    resetParagraphMergedProperties() {
        this.mergedParagraphProperties = null;
    }
    getParagraphMergedProperties() {
        if (!this.hasParagraphMergedProperies()) {
            var merger = new ParagraphPropertiesMerger();
            merger.mergeMaskedParagraphProperties(this.maskedParagraphProperties);
            merger.mergeMaskedParagraphProperties(this.documentModel.defaultParagraphProperties);
            this.mergedParagraphProperties = merger.getMergedProperties();
        }
        return this.mergedParagraphProperties;
    }
    setParagraphMergedProperies(properties) {
        this.mergedParagraphProperties = this.documentModel.cache.mergedParagraphPropertiesCache.getItem(properties);
    }
    hasParagraphMergedProperies() {
        return !!this.mergedParagraphProperties;
    }
    setCharacterProperties(properties) {
        this.maskedCharacterProperties = this.documentModel.cache.maskedCharacterPropertiesCache.getItem(properties);
    }
    onCharacterPropertiesChanged() {
        this.resetCharacterMergedProperties();
    }
    resetCharacterMergedProperties() {
        this.mergedCharacterProperties = null;
    }
    getCharacterMergedProperties() {
        if (!this.hasCharacterMergedProperies()) {
            var merger = new CharacterPropertiesMerger();
            merger.mergeCharacterProperties(this.maskedCharacterProperties);
            merger.mergeCharacterProperties(this.documentModel.defaultCharacterProperties);
            this.mergedCharacterProperties = merger.getMergedProperties();
        }
        return this.mergedCharacterProperties;
    }
    setCharacterMergedProperies(properties) {
        this.mergedCharacterProperties = this.documentModel.cache.mergedCharacterPropertiesCache.getItem(properties);
    }
    hasCharacterMergedProperies() {
        return !!this.mergedCharacterProperties;
    }
    equals(obj) {
        if (obj === this)
            return true;
        if (!obj.getCharacterProperties().equals(this.getCharacterProperties()))
            return false;
        if (!obj.getParagraphProperties().equals(this.getParagraphProperties()))
            return false;
        if (!obj.getListLevelProperties().equals(this.getListLevelProperties()))
            return false;
        return true;
    }
    externallyEquals(obj) {
        if (obj === this)
            return true;
        var result = obj.getListLevelProperties().displayFormatString == this.getListLevelProperties().displayFormatString &&
            obj.getListLevelProperties().format == this.getListLevelProperties().format &&
            obj.getListLevelProperties().start == this.getListLevelProperties().start &&
            obj.getCharacterProperties().fontBold == this.getCharacterProperties().fontBold &&
            obj.getCharacterProperties().fontItalic == this.getCharacterProperties().fontItalic &&
            obj.getCharacterProperties().fontSize == this.getCharacterProperties().fontSize &&
            obj.getCharacterProperties().textColor.equals(this.getCharacterProperties().textColor) &&
            obj.getCharacterProperties().fontInfo.equals(this.getCharacterProperties().fontInfo);
        return result;
    }
    copyFrom(obj) {
        this.setListLevelProperties(obj.getListLevelProperties());
        this.setCharacterProperties(obj.getCharacterProperties());
        this.setParagraphProperties(obj.getParagraphProperties());
        this.onCharacterPropertiesChanged();
        this.onParagraphPropertiesChanged();
    }
}
export class NumberingListReferenceLevel {
    constructor(owner, level) {
        this.overrideStart = false;
        this.newStart = 1;
        this.owner = owner;
        this.level = level;
        this.documentModel = owner.documentModel;
    }
    getListLevelProperties() {
        return this.getOwnerLevel().getListLevelProperties();
    }
    setListLevelProperties(properties) {
        this.getOwnerLevel().setListLevelProperties(properties);
    }
    getCharacterProperties() {
        return this.getOwnerLevel().getCharacterProperties();
    }
    getParagraphProperties() {
        return this.getOwnerLevel().getParagraphProperties();
    }
    setParagraphProperties(properties) {
        this.getOwnerLevel().setParagraphProperties(properties);
    }
    onParagraphPropertiesChanged() {
        this.getOwnerLevel().onParagraphPropertiesChanged();
    }
    getParagraphMergedProperties() {
        return this.getOwnerLevel().getParagraphMergedProperties();
    }
    setParagraphMergedProperies(properties) {
        this.getOwnerLevel().setParagraphMergedProperies(properties);
    }
    hasParagraphMergedProperies() {
        return this.getOwnerLevel().hasParagraphMergedProperies();
    }
    resetParagraphMergedProperties() {
        this.getOwnerLevel().resetParagraphMergedProperties();
    }
    setCharacterProperties(properties) {
        this.getOwnerLevel().setCharacterProperties(properties);
    }
    onCharacterPropertiesChanged() {
        this.getOwnerLevel().onCharacterPropertiesChanged();
    }
    getCharacterMergedProperties() {
        return this.getOwnerLevel().getCharacterMergedProperties();
    }
    setCharacterMergedProperies(properties) {
        this.getOwnerLevel().setCharacterMergedProperies(properties);
    }
    hasCharacterMergedProperies() {
        return this.getOwnerLevel().hasCharacterMergedProperies();
    }
    resetCharacterMergedProperties() {
        this.getOwnerLevel().resetCharacterMergedProperties();
    }
    getNewStart() {
        return this.newStart;
    }
    setNewStart(newStart) {
        this.newStart = newStart;
    }
    getOwnerLevel() {
        return this.owner.getAbstractNumberingList().levels[this.level];
    }
    equals(obj) {
        return this.getOwnerLevel().equals(obj.getOwnerLevel());
    }
    externallyEquals(obj) {
        return this.getOwnerLevel().externallyEquals(obj.getOwnerLevel());
    }
    copyFrom(obj) {
        if (!(obj instanceof NumberingListReferenceLevel))
            throw new Error("Source level should have equal type");
        this.newStart = obj.newStart;
        this.overrideStart = obj.overrideStart;
    }
}
export class OverrideListLevel extends ListLevel {
    constructor() {
        super(...arguments);
        this.overrideStart = false;
    }
    getNewStart() {
        return this.getListLevelProperties().start;
    }
    setNewStart(newStart) {
        var properties = this.getListLevelProperties().clone();
        properties.start = newStart;
        this.setListLevelProperties(properties);
    }
    copyFrom(obj) {
        if (!(obj instanceof OverrideListLevel))
            throw new Error("Source level should have equal type");
        super.copyFrom(obj);
        this.overrideStart = obj.overrideStart;
    }
}
