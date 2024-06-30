import { CharacterProperties } from '../../../core/model/character/character-properties';
import { CharacterPropertiesApplier } from '../../../core/model/character/character-properties-helper';
import { ColorHelper } from '../../../core/model/color/color';
import { ColorModelInfo } from '../../../core/model/color/color-model-info';
import { ControlOptions } from '../../../core/model/options/control';
import { ShadingInfo } from '../../../core/model/shadings/shading-info';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RichEditClientCommand } from '../client-command';
import { CommandSimpleOptions } from '../command-base';
import { IntervalCommandStateEx } from '../command-states';
import { DialogParametersBase, ShowDialogCommandBase } from './show-dialog-command-base';
export class DialogFontCommandBase extends ShowDialogCommandBase {
    getDialogName() {
        return "EditFont";
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.characterFormatting);
    }
}
export class DialogFontCommand extends DialogFontCommandBase {
    getState() {
        let state = new IntervalCommandStateEx(this.isEnabled(), this.getActualIntervals());
        state.visible = ControlOptions.isVisible(this.control.modelManager.richOptions.control.characterFormatting);
        return state;
    }
    isEnabled() {
        return super.isEnabled() && (!this.selection.specialRunInfo.isPictureSelected() || !this.selection.specialRunInfo.isSelectedAnchorObject);
    }
    getActualIntervals() {
        if (this.selection.isCollapsed())
            return [this.selection.activeSubDocument.getWholeWordInterval(this.selection.intervals[0].start)];
        return ListUtils.deepCopy(this.selection.intervalsInfo.intervals);
    }
    createParameters(_options) {
        var parameters = new FontDialogParameters();
        parameters.init(this.colorProvider, this.inputPosition.getMergedCharacterPropertiesRaw());
        return parameters;
    }
    applyParameters(_state, newParams, initParams) {
        const newProps = new CharacterProperties();
        newProps.allCaps = newParams.allCaps !== initParams.allCaps ? newParams.allCaps : undefined;
        newProps.smallCaps = newParams.smallCaps !== initParams.smallCaps ? newParams.smallCaps : undefined;
        newProps.fontInfo = newParams.fontName !== null && newParams.fontName !== initParams.fontName ?
            (this.control.modelManager.model.cache.fontInfoCache.getItemByName(newParams.fontName) || undefined) : undefined;
        newProps.fontSize = newParams.fontSize !== null && newParams.fontSize !== initParams.fontSize ?
            newParams.fontSize : undefined;
        newProps.fontStrikeoutType = newParams.fontStrikeoutType !== null && newParams.fontStrikeoutType !== initParams.fontStrikeoutType ?
            newParams.fontStrikeoutType : undefined;
        newProps.fontBold = newParams.fontStyle !== null && newParams.fontStyle !== initParams.fontStyle && (newParams.fontStyle & 1) !== (initParams.fontStyle & 1) ?
            !!(newParams.fontStyle & 1) : undefined;
        newProps.fontItalic = newParams.fontStyle !== null && newParams.fontStyle !== initParams.fontStyle && (newParams.fontStyle & 2) !== (initParams.fontStyle & 2) ?
            !!(newParams.fontStyle & 2) : undefined;
        newProps.fontUnderlineType = newParams.fontUnderlineType !== null && newParams.fontUnderlineType !== initParams.fontUnderlineType ?
            newParams.fontUnderlineType : undefined;
        newProps.hidden = newParams.hidden !== initParams.hidden ? newParams.hidden : undefined;
        newProps.script = newParams.script !== null && newParams.script !== initParams.script ? newParams.script : undefined;
        newProps.underlineWordsOnly = newParams.underlineWordsOnly !== initParams.underlineWordsOnly ? newParams.underlineWordsOnly : undefined;
        newProps.textColor = newParams.fontColor !== null && newParams.fontColor !== initParams.fontColor ?
            ColorModelInfo.makeByColor(newParams.fontColor == "Auto" ? ColorHelper.AUTOMATIC_COLOR : ColorUtils.fromString(newParams.fontColor)) : undefined;
        newProps.underlineColor = newParams.fontUnderlineColor !== null && newParams.fontUnderlineColor !== initParams.fontUnderlineColor ?
            ColorModelInfo.makeByColor(newParams.fontUnderlineColor == "Auto" ? ColorHelper.AUTOMATIC_COLOR : ColorUtils.fromString(newParams.fontUnderlineColor))
            : undefined;
        const isResetBackColor = newParams.backColor !== initParams.backColor;
        newProps.shadingInfo = isResetBackColor ?
            ShadingInfo.createByColor(ColorModelInfo.makeByColor(newParams.backColor === null ? ColorHelper.NO_COLOR : ColorUtils.fromString(newParams.backColor)))
            : undefined;
        newProps.highlightColor = isResetBackColor ? ColorModelInfo.noColor : undefined;
        newProps.strikeoutWordsOnly = undefined;
        newProps.noProof = undefined;
        newProps.strikeoutColor = undefined;
        newProps.langInfo = undefined;
        newProps.compositeFontInfo = undefined;
        return new CharacterPropertiesApplier(this.control.modelManager, this.inputPosition, newProps, this.control.selection.activeSubDocument, this.control.selection.intervals).apply();
    }
}
export class DialogServiceFontCommand extends DialogFontCommandBase {
    createParameters(options) {
        this.dialogCustomNumberingListParameters = options.param;
        var level = this.dialogCustomNumberingListParameters.levels[this.dialogCustomNumberingListParameters.currentLevel];
        var parameters = new FontDialogParameters();
        parameters.initServicePart(level);
        return parameters;
    }
    applyParameters(_state, params) {
        var level = this.dialogCustomNumberingListParameters.levels[this.dialogCustomNumberingListParameters.currentLevel];
        level.fontColor = params.fontColor;
        level.fontName = params.fontName;
        level.fontSize = params.fontSize;
        level.fontStyle = params.fontStyle;
        return false;
    }
    afterClosing() {
        var clientCommand = RichEditClientCommand.ShowCustomNumberingListForm;
        this.control.commandManager.getCommand(clientCommand).execute(this.control.commandManager.isPublicApiCall, new CommandSimpleOptions(this.control, this.dialogCustomNumberingListParameters));
    }
}
export class FontDialogParameters extends DialogParametersBase {
    constructor() {
        super(...arguments);
        this.fontName = null;
        this.fontStyle = null;
        this.fontSize = null;
        this.fontColor = null;
        this.backColor = null;
        this.fontUnderlineType = null;
        this.fontUnderlineColor = null;
        this.fontStrikeoutType = null;
        this.underlineWordsOnly = null;
        this.script = null;
        this.allCaps = null;
        this.smallCaps = null;
        this.hidden = null;
    }
    init(colorProvider, rawCharProps) {
        this.allCaps = rawCharProps.allCaps;
        this.smallCaps = rawCharProps.smallCaps;
        this.fontColor = rawCharProps.textColor ? FontDialogParameters.getColor(rawCharProps.textColor.toRgb(colorProvider)) : undefined;
        this.backColor = rawCharProps.shadingInfo && rawCharProps.highlightColor ?
            FontDialogParameters.getColor(CharacterProperties.getActualBackgroundColor(rawCharProps, colorProvider)) : undefined;
        this.fontName = rawCharProps.fontInfo ? rawCharProps.fontInfo.name : null;
        this.fontSize = rawCharProps.fontSize;
        this.fontStrikeoutType = rawCharProps.fontStrikeoutType;
        this.fontStyle = (rawCharProps.fontBold ? 1 : 0) | (rawCharProps.fontItalic ? 2 : 0);
        this.fontUnderlineColor = rawCharProps.underlineColor ? FontDialogParameters.getColor(rawCharProps.underlineColor.toRgb(colorProvider)) : undefined;
        this.fontUnderlineType = rawCharProps.fontUnderlineType;
        this.hidden = rawCharProps.hidden;
        this.script = rawCharProps.script;
        this.underlineWordsOnly = rawCharProps.underlineWordsOnly;
    }
    static getColor(color) {
        if (color === ColorHelper.AUTOMATIC_COLOR)
            return "Auto";
        if (color === ColorHelper.NO_COLOR)
            return null;
        return color !== undefined ? ColorUtils.colorToHash(color).toUpperCase() : undefined;
    }
    initServicePart(level) {
        this.fontColor = level.fontColor;
        this.fontName = level.fontName;
        this.fontSize = level.fontSize;
        this.fontStyle = level.fontStyle;
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.allCaps = obj.allCaps;
        this.smallCaps = obj.smallCaps;
        this.fontColor = obj.fontColor;
        this.fontName = obj.fontName;
        this.fontSize = obj.fontSize;
        this.fontStrikeoutType = obj.fontStrikeoutType;
        this.fontStyle = obj.fontStyle;
        this.fontUnderlineColor = obj.fontUnderlineColor;
        this.fontUnderlineType = obj.fontUnderlineType;
        this.hidden = obj.hidden;
        this.script = obj.script;
        this.underlineWordsOnly = obj.underlineWordsOnly;
        this.backColor = obj.backColor;
    }
    clone() {
        const newInstance = new FontDialogParameters();
        newInstance.copyFrom(this);
        return newInstance;
    }
    applyConverter(_converter) {
        return this;
    }
}
