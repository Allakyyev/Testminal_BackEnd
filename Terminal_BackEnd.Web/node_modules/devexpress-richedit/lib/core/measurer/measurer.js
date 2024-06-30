import { Size } from '@devexpress/utils/lib/geometry/size';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { CharacterFormattingScript } from '../model/character/enums';
import { MeasureInfoNonText } from './measure-info';
export class Measurer {
    constructor(id) {
        this.resultsIsInvalid = false;
        const measureContainer = document.createElement("div");
        measureContainer.id = id + "_Measure";
        measureContainer.className = "dxreMeasurer";
        document.body.appendChild(measureContainer);
        this.measureContainer = measureContainer;
    }
    dispose() {
        DomUtils.hideNode(this.measureContainer);
    }
    setCharacterPropertiesCache(charPropsCache) {
        this.charPropsCache = charPropsCache;
    }
    clearCache() {
        this.charPropsCache.resetSizes();
    }
    measure(measureInfos) {
        this.htmlParts = [];
        this.nodeIndex = 0;
        this.nonCachedMeasureInfos = [];
        for (let info of measureInfos)
            if (!info.resultSize) {
                if (info.charProp.script !== CharacterFormattingScript.Normal)
                    this.pushInfoToQueue(info.sbInfo = this.createSpaceMeasureInfo(info));
                this.pushInfoToQueue(info);
            }
        this.measureContainer.innerHTML = '';
        this.htmlParts.forEach((el) => this.measureContainer.appendChild(el));
        const nodes = this.measureContainer.childNodes;
        for (let info of this.nonCachedMeasureInfos) {
            const cacheValue = info.charProp.getSize(info.text);
            if (cacheValue)
                info.resultSize = cacheValue;
            else
                this.applyCalculatedSize(info, nodes);
        }
        this.checkResult(measureInfos);
    }
    checkResult(measureInfos) {
        if (measureInfos.length) {
            this.resultsIsInvalid = ListUtils.unsafeAnyOf(measureInfos, info => this.incorrectInfo(info.resultSize));
            if (this.resultsIsInvalid)
                for (let info of measureInfos) {
                    info.resultSize.width = info.resultSize.height = 1;
                    info.charProp.clearSizes();
                    if (info.charProp.fontInfo)
                        info.charProp.fontInfo.reset();
                }
        }
    }
    incorrectInfo(finalSize) {
        return finalSize.height === 0 || isNaN(finalSize.width) || isNaN(finalSize.height);
    }
    pushInfoToQueue(info) {
        this.nonCachedMeasureInfos.push(info);
        if (info.resultSize !== null) {
            this.nonCachedMeasureInfos.push(info);
            info.nodeIndex = this.nodeIndex++;
            var pre = document.createElement("pre");
            pre.style.cssText = info.signCssString;
            pre.innerHTML = info.getEncodedText();
            this.htmlParts.push(pre);
            info.charProp.setSize(info.text, null);
            info.resultSize = null;
        }
    }
    createSpaceMeasureInfo(info) {
        let newCharProp = info.charProp.clone();
        newCharProp.script = CharacterFormattingScript.Normal;
        newCharProp = this.charPropsCache.getItem(newCharProp);
        return new MeasureInfoNonText(" ", newCharProp);
    }
    applyCalculatedSize(info, nodes) {
        const node = nodes[info.nodeIndex];
        const style = document.defaultView.getComputedStyle(node, null);
        info.resultSize = new Size(parseFloat(style.width), info.charProp.script == CharacterFormattingScript.Normal ? this.getNormalHeight(info) : info.sbInfo.resultSize.height);
        info.charProp.setSize(info.text, info.resultSize);
    }
    getNormalHeight(info) {
        return info.charProp.fontInfo.getHeightFactor() * info.charProp.fontSize;
    }
}
