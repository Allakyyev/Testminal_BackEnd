import { ResetFormattingCacheType } from '../core/model/document-model';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { convertFromCharacterPropertiesApi, convertToCharacterPropertiesApi } from './character-properties';
import { FieldCollection } from './collections/field-collection';
import { FontCollection } from './collections/fonts-collection';
import { HyperlinkCollection } from './collections/hyperlink-collection';
import { ListCollection } from './collections/numbered-list-collection';
import { SectionCollection } from './collections/section-collection';
import { SubDocumentCollection as SubDocumentCollection } from './collections/sub-documents-collection';
export class RichEditDocumentApi {
    constructor(processor) {
        this._processor = processor;
    }
    get fonts() {
        return new FontCollection(this._processor);
    }
    get subDocuments() {
        return new SubDocumentCollection(this._processor);
    }
    get sections() {
        return new SectionCollection(this._processor);
    }
    get bookmarks() {
        return this.subDocuments.main.bookmarks;
    }
    get rangePermissions() {
        return this.subDocuments.main.rangePermissions;
    }
    get paragraphs() {
        return this.subDocuments.main.paragraphs;
    }
    get tables() {
        return this.subDocuments.main.tables;
    }
    get fields() {
        return new FieldCollection(this._processor, this._processor.modelManager.model.mainSubDocument);
    }
    get hyperlinks() {
        return new HyperlinkCollection(this._processor, this._processor.modelManager.model.mainSubDocument);
    }
    get lists() {
        return new ListCollection(this._processor);
    }
    get length() {
        return this.subDocuments.main.length;
    }
    get interval() { return this.subDocuments.main.interval; }
    get isProtected() {
        return this._processor.modelManager.model.isDocumentProtectionEnabled;
    }
    protect(password) {
        this._processor.modelManager.modelManipulator.documentProtectionProperties.enforceDocumentProtection(password);
    }
    unprotect() {
        this._processor.modelManager.modelManipulator.documentProtectionProperties.forceRemoveDocumentProtection();
    }
    checkProtectionPassword(password) {
        return this.isProtected ? this._processor.modelManager.model.checkDocumentProtectionPassword(password) : false;
    }
    insertText(position, text) {
        return this.subDocuments.main.insertText(position, text);
    }
    insertLineBreak(position) {
        return this.subDocuments.main.insertLineBreak(position);
    }
    insertColumnBreak(position) {
        return this.subDocuments.main.insertColumnBreak(position);
    }
    insertPageBreak(position) {
        return this.subDocuments.main.insertPageBreak(position);
    }
    insertSectionBreak(position, type) {
        return this.subDocuments.main.insertSectionBreak(position, type);
    }
    insertPicture(position, base64, size, callback) {
        this.subDocuments.main.insertPicture(position, base64, size, callback);
    }
    insertParagraph(position) {
        return this.subDocuments.main.insertParagraph(position);
    }
    deleteText(interval) {
        return this.subDocuments.main.deleteText(interval);
    }
    getText(interval) {
        return this.subDocuments.main.getText(interval);
    }
    getCharacterProperties(interval) {
        return this.subDocuments.main.getCharacterProperties(interval);
    }
    setCharacterProperties(interval, characterProperties) {
        this.subDocuments.main.setCharacterProperties(interval, characterProperties);
    }
    getParagraphProperties(interval) {
        return this.subDocuments.main.getParagraphProperties(interval);
    }
    setParagraphProperties(interval, paragraphProperties) {
        this.subDocuments.main.setParagraphProperties(interval, paragraphProperties);
    }
    getDefaultCharacterProperties() {
        return convertToCharacterPropertiesApi(this._processor.modelManager.model.defaultCharacterProperties, this._processor.modelManager.model.colorProvider);
    }
    setDefaultCharacterProperties(characterProperties) {
        const propertiesCore = convertFromCharacterPropertiesApi(characterProperties, this._processor.modelManager.model.cache.fontInfoCache, 1, false, this._processor.modelManager.model.defaultCharacterProperties.clone());
        this._processor.beginUpdate();
        this._processor.modelManager.model.defaultCharacterProperties =
            this._processor.modelManager.model.cache.maskedCharacterPropertiesCache.getItem(propertiesCore);
        NumberMapUtils.forEach(this._processor.modelManager.model.subDocuments, (sd) => sd.resetMergedFormattingCache(ResetFormattingCacheType.All));
        this._processor.layoutFormatterManager.restartManager.restartAllLayout();
        this._processor.endUpdate();
    }
}
