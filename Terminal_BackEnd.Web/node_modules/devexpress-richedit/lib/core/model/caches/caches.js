import { ControlFontsCache } from './control-fonts';
import { CharacterPropertiesCache } from './hashed-caches/character-properties-cache';
import { ColorModelInfoCache } from './hashed-caches/color-model-info-cache';
import { DrawingColorModelInfoCache } from './hashed-caches/drawing-color-model-info-cache';
import { FontInfoCache } from './hashed-caches/font-info-cache';
import { ListLevelPropertiesCache } from './hashed-caches/list-level-properties-cache';
import { MaskedCharacterPropertiesCache } from './hashed-caches/masked-character-properties-cache';
import { MaskedParagraphPropertiesCache } from './hashed-caches/masked-paragraph-properties-cache';
import { ParagraphPropertiesCache } from './hashed-caches/paragraph-properties-cache';
import { Scene3DPropertiesInfoCache } from './hashed-caches/scene3d-properties-info-cache';
import { Scene3DRotationInfoCache } from './hashed-caches/scene3d-rotation-info-cache';
import { ShadingInfoCache } from './hashed-caches/shading-info-cache';
import { TableCellPropertiesCache } from './hashed-caches/table-cell-properties-cache';
import { TableRowPropertiesCache } from './hashed-caches/table-row-properties-cache';
import { ImageCache } from './images';
export class DocumentCache {
    constructor() {
        this.imageCache = new ImageCache();
        this.controlFontsCache = new ControlFontsCache();
        this.fontInfoCache = new FontInfoCache(null);
        this.mergedCharacterPropertiesCache = new CharacterPropertiesCache();
        this.mergedParagraphPropertiesCache = new ParagraphPropertiesCache();
        this.maskedCharacterPropertiesCache = new MaskedCharacterPropertiesCache();
        this.maskedParagraphPropertiesCache = new MaskedParagraphPropertiesCache();
        this.tableRowPropertiesCache = new TableRowPropertiesCache();
        this.tableCellPropertiesCache = new TableCellPropertiesCache();
        this.listLevelPropertiesCache = new ListLevelPropertiesCache();
        this.shadingInfoCache = new ShadingInfoCache();
        this.colorModelInfoCache = new ColorModelInfoCache();
        this.drawingColorModelInfoCache = new DrawingColorModelInfoCache();
        this.scene3DPropertiesInfoCache = new Scene3DPropertiesInfoCache();
        this.scene3DRotationInfoCache = new Scene3DRotationInfoCache();
    }
    clearTemporaryCaches() {
        this.fontInfoCache.clearTemporaryCache();
        this.mergedCharacterPropertiesCache.clearTemporaryCache();
        this.mergedParagraphPropertiesCache.clearTemporaryCache();
        this.maskedCharacterPropertiesCache.clearTemporaryCache();
        this.maskedParagraphPropertiesCache.clearTemporaryCache();
        this.listLevelPropertiesCache.clearTemporaryCache();
        this.tableRowPropertiesCache.clearTemporaryCache();
        this.tableCellPropertiesCache.clearTemporaryCache();
        this.shadingInfoCache.clearTemporaryCache();
        this.colorModelInfoCache.clearTemporaryCache();
        this.drawingColorModelInfoCache.clearTemporaryCache();
        this.scene3DPropertiesInfoCache.clearTemporaryCache();
        this.scene3DRotationInfoCache.clearTemporaryCache();
    }
    DEBUG_DISTRIBUTION_INFO() {
        const result = [];
        result.push(`maskedCharacterPropertiesCache \t{elems:${this.maskedCharacterPropertiesCache.count}, maxLen:${this.maskedCharacterPropertiesCache.DEBUG_MAX_CELL_LENGTH()}`);
        result.push(`maskedParagraphPropertiesCache \t{elems:${this.maskedParagraphPropertiesCache.count}, maxLen:${this.maskedParagraphPropertiesCache.DEBUG_MAX_CELL_LENGTH()}`);
        result.push(`mergedCharacterPropertiesCache \t{elems:${this.mergedCharacterPropertiesCache.count}, maxLen:${this.mergedCharacterPropertiesCache.DEBUG_MAX_CELL_LENGTH()}`);
        result.push(`mergedParagraphPropertiesCache \t{elems:${this.mergedParagraphPropertiesCache.count}, maxLen:${this.mergedParagraphPropertiesCache.DEBUG_MAX_CELL_LENGTH()}`);
        result.push(`listLevelPropertiesCache \t{elems:${this.listLevelPropertiesCache.count}, maxLen:${this.listLevelPropertiesCache.DEBUG_MAX_CELL_LENGTH()}`);
        result.push(`tableRowPropertiesCache \t{elems:${this.tableRowPropertiesCache.count}, maxLen:${this.tableRowPropertiesCache.DEBUG_MAX_CELL_LENGTH()}`);
        result.push(`tableCellPropertiesCache \t{elems:${this.tableCellPropertiesCache.count}, maxLen:${this.tableCellPropertiesCache.DEBUG_MAX_CELL_LENGTH()}`);
        return result.join("\n");
    }
    clone() {
        const cache = new DocumentCache();
        cache.fontInfoCache = this.fontInfoCache.clone();
        cache.controlFontsCache = this.controlFontsCache.clone();
        cache.mergedCharacterPropertiesCache = this.mergedCharacterPropertiesCache.clone();
        cache.mergedParagraphPropertiesCache = this.mergedParagraphPropertiesCache.clone();
        cache.maskedCharacterPropertiesCache = this.maskedCharacterPropertiesCache.clone();
        cache.maskedParagraphPropertiesCache = this.maskedParagraphPropertiesCache.clone();
        cache.tableRowPropertiesCache = this.tableRowPropertiesCache.clone();
        cache.tableCellPropertiesCache = this.tableCellPropertiesCache.clone();
        cache.listLevelPropertiesCache = this.listLevelPropertiesCache.clone();
        cache.imageCache = this.imageCache.clone();
        cache.shadingInfoCache = this.shadingInfoCache.clone();
        cache.colorModelInfoCache = this.colorModelInfoCache.clone();
        cache.drawingColorModelInfoCache = this.drawingColorModelInfoCache.clone();
        cache.scene3DPropertiesInfoCache = this.scene3DPropertiesInfoCache.clone();
        cache.scene3DRotationInfoCache = this.scene3DRotationInfoCache.clone();
        return cache;
    }
}
