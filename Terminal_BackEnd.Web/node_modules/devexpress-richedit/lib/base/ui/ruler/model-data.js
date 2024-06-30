import { ReadOnlyMode } from '../../interfaces/i-rich-edit-core';
import { RulerStyleInfo } from './settings';
export class RulerModelData {
    constructor(core, settings) {
        this.core = core;
        this.settings = this.fixSettings(settings);
    }
    get inputPosition() { return this.core.inputPosition; }
    ;
    get commandManager() { return this.core.commandManager; }
    get isClosed() { return this.core.isClosed(); }
    get innerClientProperties() { return this.core.innerClientProperties; }
    get isReadOnly() { return this.core.readOnly != ReadOnlyMode.None; }
    get unitType() { return this.core.uiUnitConverter.getUnits(); }
    get selection() { return this.core.selection; }
    fixSettings(settings) {
        if (!settings.styles.firstLineIndent)
            settings.styles.firstLineIndent = this.getDefaultStyle('dxreFirstLineIndentDragHandle');
        if (!settings.styles.leftIndent)
            settings.styles.leftIndent = this.getDefaultStyle('dxreLeftIndentDragHandle');
        if (!settings.styles.tab)
            settings.styles.tab = this.getDefaultStyle('dxreTabDragHandle');
        if (!settings.styles.line)
            settings.styles.line = this.getDefaultStyle('dxreRulerLine');
        if (!settings.styles.control)
            settings.styles.control = this.getDefaultStyle('dxreRuler');
        if (!settings.styles.wrapper)
            settings.styles.wrapper = this.getDefaultStyle('dxreRulerWrapper');
        return settings;
    }
    getDefaultStyle(className) {
        const style = new RulerStyleInfo();
        style.className = className;
        style.style = '';
        return style;
    }
}
