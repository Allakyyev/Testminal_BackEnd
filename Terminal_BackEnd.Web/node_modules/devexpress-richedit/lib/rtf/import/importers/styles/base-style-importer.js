import { Stack } from '@devexpress/utils/lib/class/stack';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RtfBaseImporter } from '../importer-base';
import { RtfStyleImporterState } from './rtf-style-importer-state';
export class RtfBaseStyleImporter extends RtfBaseImporter {
    constructor(data, resetStates) {
        super(data);
        this.mapRtfIndexToModelIndex = {};
        this.states = new Stack();
        this.states.push(new RtfStyleImporterState(0, 0));
        this.resetStates = resetStates;
        this.mapRtfIndexToModelIndex[0] = 0;
    }
    get rtfStyleIndex() { return this.states.last.rtfStyleIndex; }
    set rtfStyleIndex(value) { this.states.last.rtfStyleIndex = value; }
    get rtfParentStyleIndex() { return this.states.last.rtfParentStyleIndex; }
    set rtfParentStyleIndex(value) { this.states.last.rtfParentStyleIndex = value; }
    get styleExists() {
        return this.mapRtfIndexToModelIndex[this.rtfStyleIndex] != undefined;
    }
    get style() {
        return this.styleCollection[this.getModelIndex(this.rtfStyleIndex)];
    }
    get parentStyleExists() {
        return this.mapRtfIndexToModelIndex[this.rtfParentStyleIndex] != undefined;
    }
    get parentStyle() {
        return this.styleCollection[this.getModelIndex(this.rtfParentStyleIndex)];
    }
    getModelIndex(rtfIndex) {
        const modelIndex = this.mapRtfIndexToModelIndex[rtfIndex];
        return modelIndex !== undefined ? modelIndex : 0;
    }
    getOrCreateStyleByName(styleName) {
        const styleIndex = ListUtils.indexBy(this.styleCollection, (currentStyle) => currentStyle.styleName == styleName);
        if (styleIndex >= 0) {
            this.mapRtfIndexToModelIndex[this.rtfStyleIndex] = styleIndex;
            return this.styleCollection[styleIndex];
        }
        const instance = this.createEmpty();
        instance.styleName = styleName;
        instance.parent = this.parentStyleExists ? this.parentStyle : null;
        const result = this.addStyle(instance);
        this.mapRtfIndexToModelIndex[this.rtfStyleIndex] = ListUtils.indexBy(this.styleCollection, (style) => style.styleName == styleName);
        return result;
    }
    pushState() {
        this.states.push(new RtfStyleImporterState(this.rtfStyleIndex, this.rtfParentStyleIndex));
    }
    popState() {
        if (this.states.count <= 1)
            return;
        const state = this.states.pop();
        if (!this.resetStates)
            this.applyState(this.states, state);
    }
    startImportSubDocument() {
    }
    finalizeSubDocument() {
    }
}
