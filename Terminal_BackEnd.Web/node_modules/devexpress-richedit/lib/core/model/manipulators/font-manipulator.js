import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
import { LoadFontInfoModelChange } from '../changes/model/load-font';
import { ParagraphAndCharacterMergedPropertiesResetSubDocumentChange } from '../changes/sub-document/properties/merged-props-reset';
import { ResetFormattingCacheType } from '../document-model';
import { JSONFontInfoProperty, JSONLoadFontInfoCommand } from '../json/enums/json-character-enums';
import { JSONFontInfoConverter } from '../json/importers/json-font-info-converter';
import { LinkedInterval } from '../position/linked-interval';
import { BaseManipulator } from './base-manipulator';
export class FontManipulator extends BaseManipulator {
    constructor() {
        super(...arguments);
        this.loadingFontInfosHashtable = {};
    }
    loadFontInfo(fontInfo, subDocument, applyNewFontOnIntervalsAfterLoad, measurer) {
        if (this.modelManipulator.modelManager.richOptions.fonts.limitedFonts)
            return;
        const existingInfo = StringMapUtils.elementBy(this.loadingFontInfosHashtable, (info) => info.fontInfo.name == fontInfo.name);
        if (existingInfo) {
            existingInfo.addRequest(subDocument, applyNewFontOnIntervalsAfterLoad);
            return;
        }
        const fontCache = this.modelManipulator.model.cache.fontInfoCache;
        const fontIndex = fontCache.count;
        this.loadingFontInfosHashtable[fontInfo.name] = new OnLoadingFontInfoItem(subDocument, applyNewFontOnIntervalsAfterLoad, fontInfo);
        this.modelManipulator.notifyModelChanged(new LoadFontInfoModelChange(fontInfo));
        fontInfo.isLoad = false;
        fontCache.getItem(fontInfo);
        const modelManager = this.modelManipulator.modelManager;
        if (modelManager.clientMode) {
            const jsonItem = JSONFontInfoConverter.convertToJSON(fontInfo);
            fontCache.merge({ [fontIndex]: jsonItem }, JSONFontInfoConverter.convertFromJSON);
            const newFontInfo = modelManager.modelManipulator.font.applyFontInfoLoadedOnPaste(measurer, { [JSONLoadFontInfoCommand.FontInfoIndex]: fontIndex }, { [fontIndex]: jsonItem });
            this.modelManipulator.raiseFontAdded(newFontInfo);
        }
    }
    applyFontInfoLoadedOnPaste(measurer, jsonServerParams, jsonFontInfoCache) {
        const jsonFontInfo = jsonFontInfoCache[jsonServerParams[JSONLoadFontInfoCommand.FontInfoIndex]];
        const name = jsonFontInfo[JSONFontInfoProperty.Name];
        const existingNewFontInfo = this.model.cache.fontInfoCache.getItemByName(name);
        if (existingNewFontInfo.isLoad)
            return existingNewFontInfo;
        const onLoadingFontInfoItem = this.loadingFontInfosHashtable[existingNewFontInfo.name];
        if (!onLoadingFontInfoItem)
            return existingNewFontInfo;
        const modelManipulator = this.modelManipulator;
        delete this.loadingFontInfosHashtable[existingNewFontInfo.name];
        measurer.clearCache();
        JSONFontInfoConverter.convertFromJSON(jsonFontInfo, existingNewFontInfo);
        onLoadingFontInfoItem.applyFont(modelManipulator);
        return existingNewFontInfo;
    }
    addFontByName(name, cssName) {
        const newFont = this.model.cache.fontInfoCache.addFont(name, cssName);
        this.modelManipulator.raiseFontAdded(newFont);
        return newFont;
    }
    removeFont(font) {
        this.model.cache.fontInfoCache.deleteFont(font);
        this.modelManipulator.raiseFontRemoved(font);
    }
}
class OnLoadingFontInfoItem {
    constructor(subDocument, applyNewFontOnIntervalsAfterLoad, fontInfo) {
        this.fontInfo = fontInfo;
        this.subDocuments = [subDocument];
        this.applyNewFontOnIntervalsAfterLoad = [this.getLinkedIntervals(subDocument, applyNewFontOnIntervalsAfterLoad)];
    }
    addRequest(subDocument, applyNewFontOnIntervalsAfterLoad) {
        const intervals = this.getLinkedIntervals(subDocument, applyNewFontOnIntervalsAfterLoad);
        const index = this.subDocuments.indexOf(subDocument);
        if (index < 0) {
            this.subDocuments.push(subDocument);
            this.applyNewFontOnIntervalsAfterLoad.push(intervals);
        }
        else
            ListUtils.addListOnTail(this.applyNewFontOnIntervalsAfterLoad[index], intervals);
    }
    applyFont(modelManipulator) {
        ListUtils.forEach(this.subDocuments, (subDocument, index) => {
            let resetInterval = null;
            const mergedFixedIntervals = IntervalAlgorithms.getMergedIntervals(ListUtils.map(this.applyNewFontOnIntervalsAfterLoad[index], (interval) => interval.getFixedInterval()), true);
            for (let interval of mergedFixedIntervals) {
                if (interval.length > 0) {
                    modelManipulator.characterProperties.fontName.setValue(subDocument, interval, this.fontInfo, true);
                    const changed = subDocument.resetMergedFormattingCache(ResetFormattingCacheType.All, interval);
                    resetInterval = resetInterval ? resetInterval.expand(changed) : changed;
                }
            }
            if (resetInterval)
                modelManipulator.notifyModelChanged(new ParagraphAndCharacterMergedPropertiesResetSubDocumentChange(subDocument.id, resetInterval));
        });
        this.destructor();
    }
    getLinkedIntervals(subDocument, intervals) {
        return ListUtils.map(intervals, (fixedInterval) => new LinkedInterval(subDocument.positionManager, fixedInterval));
    }
    destructor() {
        ListUtils.forEach(this.subDocuments, (subDoc, index) => {
            for (let int of this.applyNewFontOnIntervalsAfterLoad[index])
                int.destructor(subDoc.positionManager);
        });
    }
}
