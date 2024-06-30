import { Errors } from '@devexpress/utils/lib/errors';
import { MaskedCharacterPropertiesBundle } from '../../rich-utils/properties-bundle';
import { CharacterPropertiesMerger } from '../properties-merger/character-properties-merger';
export class RunBase {
    constructor(startOffset, paragraph, charPropsBundle) {
        this.startOffset = startOffset;
        this.paragraph = paragraph;
        this.characterStyle = charPropsBundle.style;
        this.setCharacterProperties(charPropsBundle.props);
        this.mergedCharacterProperties = null;
    }
    isParagraphOrSectionRun() {
        return false;
    }
    setCharacterProperties(properties) {
        this.maskedCharacterProperties = this.paragraph.subDocument.documentModel.cache.maskedCharacterPropertiesCache.getItem(properties);
    }
    onCharacterPropertiesChanged() {
        this.resetCharacterMergedProperties();
    }
    hasCharacterMergedProperies() {
        return !!this.mergedCharacterProperties;
    }
    resetCharacterMergedProperties() {
        this.mergedCharacterProperties = null;
    }
    getCharacterMergedProperties() {
        if (!this.mergedCharacterProperties)
            this.mergedCharacterProperties = this.mergeCharacterProperties();
        return this.mergedCharacterProperties;
    }
    mergeCharacterProperties(options) {
        const merger = new CharacterPropertiesMerger();
        merger.mergeCharacterProperties(this.maskedCharacterProperties);
        if (!options || !options.excludeCharacterStyle)
            merger.mergeCharacterStyle(this.characterStyle);
        merger.mergeParagraphStyle(this.paragraph.paragraphStyle);
        const tableCell = this.paragraph.getTableCell();
        if (tableCell)
            merger.mergeTableStyles(tableCell);
        merger.mergeCharacterProperties(this.paragraph.subDocument.documentModel.defaultCharacterProperties);
        return this.paragraph.subDocument.documentModel.cache.mergedCharacterPropertiesCache.getItem(merger.getMergedProperties());
    }
    setCharacterMergedProperies(properties) {
        this.mergedCharacterProperties = this.paragraph.subDocument.documentModel.cache.mergedCharacterPropertiesCache.getItem(properties);
    }
    copyFrom(obj) {
        this.startOffset = obj.startOffset;
        this.paragraph = obj.paragraph;
        this.characterStyle = obj.characterStyle;
        this.maskedCharacterProperties = obj.maskedCharacterProperties;
        this.mergedCharacterProperties = obj.mergedCharacterProperties;
    }
    createSimularity(startOffset, length, paragraph, characterStyle, maskedCharacterProperties) {
        const simularity = this.clone();
        simularity.startOffset = startOffset;
        simularity.paragraph = paragraph;
        simularity.characterStyle = characterStyle;
        simularity.maskedCharacterProperties = maskedCharacterProperties;
        simularity.setLength(length);
        return simularity;
    }
    getCharPropsBundle(model) {
        return new MaskedCharacterPropertiesBundle(model.cache.maskedCharacterPropertiesCache.getItem(this.maskedCharacterProperties), model.stylesManager.addCharacterStyle(this.characterStyle));
    }
}
RunBase.anchoredObjectIdCounter = 0;
export class OneCharRun extends RunBase {
    getLength() {
        return 1;
    }
    setLength(newLength) {
        if (newLength != 1)
            throw new Error(Errors.InternalException);
    }
    incLength(_additionalLength) {
        throw new Error(Errors.InternalException);
    }
}
export class PictureRun extends OneCharRun {
    constructor(startOffset, paragraph, charPropsBundle, info) {
        super(startOffset, paragraph, charPropsBundle);
        this.info = info;
    }
    get shape() { return this.info.shape; }
    ;
    set shape(val) { this.info.shape = val; }
    ;
    get size() { return this.info.size; }
    ;
    set size(val) { this.info.size = val; }
    ;
    get cacheInfo() { return this.info.cacheInfo; }
    ;
    getActualSize() {
        return this.info.size.actualSize;
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.info = obj.info.clone();
    }
}
export class TextBoxRun extends OneCharRun {
    constructor(startOffset, paragraph, charPropsBundle, shape, subDocId, textBoxProperties, containerProperties) {
        super(startOffset, paragraph, charPropsBundle);
        this.shape = shape;
        this.subDocId = subDocId;
        this.textBoxProperties = textBoxProperties;
        this.containerProperties = containerProperties;
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.shape = obj.shape.clone();
        this.subDocId = obj.subDocId;
    }
}
