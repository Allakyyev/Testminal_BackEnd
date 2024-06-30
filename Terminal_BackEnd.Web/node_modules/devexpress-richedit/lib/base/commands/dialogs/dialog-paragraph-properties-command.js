import { ColorHelper } from '../../../core/model/color/color';
import { ColorModelInfo } from '../../../core/model/color/color-model-info';
import { ControlOptions } from '../../../core/model/options/control';
import { ParagraphFirstLineIndent, ParagraphLineSpacingType, ParagraphProperties } from '../../../core/model/paragraph/paragraph-properties';
import { ParagraphPropertiesApplier } from '../../../core/model/paragraph/paragraph-properties-helper';
import { RichUtils } from '../../../core/model/rich-utils';
import { ShadingInfo } from '../../../core/model/shadings/shading-info';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { IntervalCommandStateEx } from '../command-states';
import { DialogParametersBase, ShowDialogCommandBase } from './show-dialog-command-base';
import { isDefined } from '@devexpress/utils/lib/utils/common';
export class DialogParagraphPropertiesCommand extends ShowDialogCommandBase {
    getState() {
        const state = new IntervalCommandStateEx(this.isEnabled(), ListUtils.deepCopy(this.selection.intervalsInfo.intervals));
        state.visible = ControlOptions.isVisible(this.control.modelManager.richOptions.control.paragraphFormatting);
        return state;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.paragraphFormatting);
    }
    getIntervalsForModifying() {
        return RichUtils.getIntervalsOfSelectedParagraphs(this.selection.intervals, this.selection.activeSubDocument);
    }
    createParameters(_options) {
        var parameters = new ParagraphDialogParameters();
        parameters.init(this.colorProvider, this.inputPosition.getMergedParagraphPropertiesRaw(), this.inputPosition.getMergedSectionPropertiesRaw());
        return parameters;
    }
    applyParameters(_state, newParams, initParams) {
        const newProps = new ParagraphProperties();
        newProps.leftIndent = this.getLeftIndent(newParams, initParams);
        newProps.alignment = newParams.alignment != null && newParams.alignment !== initParams.alignment ? newParams.alignment : undefined;
        newProps.contextualSpacing = newParams.contextualSpacing != null && newParams.contextualSpacing !== initParams.contextualSpacing ?
            newParams.contextualSpacing : undefined;
        newProps.firstLineIndent = newParams.firstLineIndent != null && newParams.firstLineIndent !== initParams.firstLineIndent ?
            newParams.firstLineIndent : undefined;
        newProps.firstLineIndentType = newParams.firstLineIndentType != null && newParams.firstLineIndentType !== initParams.firstLineIndentType ?
            newParams.firstLineIndentType : undefined;
        newProps.keepLinesTogether = newParams.keepLinesTogether !== initParams.keepLinesTogether ?
            newParams.keepLinesTogether : undefined;
        newProps.spacingAfter = newParams.spacingAfter != null && newParams.spacingAfter !== initParams.spacingAfter ?
            newParams.spacingAfter : undefined;
        newProps.spacingBefore = newParams.spacingBefore != null && newParams.spacingBefore !== initParams.spacingBefore ?
            newParams.spacingBefore : undefined;
        newProps.pageBreakBefore = newParams.pageBreakBefore !== initParams.pageBreakBefore ?
            newParams.pageBreakBefore : undefined;
        newProps.rightIndent = newParams.rightIndent != null && newParams.rightIndent !== initParams.rightIndent ?
            newParams.rightIndent : undefined;
        newProps.outlineLevel = newParams.outlineLevel !== initParams.outlineLevel ?
            newParams.outlineLevel : undefined;
        newProps.lineSpacingType = newParams.lineSpacingType != null && newParams.lineSpacingType !== initParams.lineSpacingType ?
            newParams.lineSpacingType : undefined;
        newProps.widowOrphanControl = newParams.widowOrphanControl !== initParams.widowOrphanControl ?
            newParams.widowOrphanControl : undefined;
        newProps.shadingInfo = newParams.backColor !== initParams.backColor ?
            ShadingInfo.createByColor(ColorModelInfo.makeByColor(newParams.backColor == null ? ColorHelper.AUTOMATIC_COLOR : ColorUtils.fromString(newParams.backColor))) : undefined;
        if ((newParams.lineSpacingType === ParagraphLineSpacingType.AtLeast || newParams.lineSpacingType === ParagraphLineSpacingType.Exactly) &&
            (newParams.lineSpacing != null && (newProps.lineSpacingType !== undefined || newParams.lineSpacing !== initParams.lineSpacing)))
            newProps.lineSpacing = newParams.lineSpacing;
        else if (newParams.lineSpacingType === ParagraphLineSpacingType.Multiple && (newParams.lineSpacingMultiple != null &&
            (newProps.lineSpacingType !== undefined || newParams.lineSpacingMultiple !== initParams.lineSpacingMultiple)))
            newProps.lineSpacing = newParams.lineSpacingMultiple;
        else
            newProps.lineSpacing = undefined;
        return new ParagraphPropertiesApplier(this.control.modelManager, this.inputPosition, newProps, this.control.selection.activeSubDocument, this.control.selection.intervals).apply();
    }
    getDialogName() {
        return "EditParagraph";
    }
    getLeftIndent(newParams, initParams) {
        if (newParams.leftIndent == null)
            return undefined;
        const leftIndent = this.getLeftIndentCore(newParams);
        return leftIndent !== initParams.leftIndent || newParams.firstLineIndentType !== initParams.firstLineIndentType ?
            leftIndent : undefined;
    }
    getLeftIndentCore(newParams) {
        if (newParams.firstLineIndentType === ParagraphFirstLineIndent.Hanging &&
            isDefined(newParams.leftIndent) && isDefined(newParams.firstLineIndent))
            return newParams.leftIndent + newParams.firstLineIndent;
        return newParams.leftIndent;
    }
}
export class ParagraphDialogParameters extends DialogParametersBase {
    init(colorProvider, parProps, secProps) {
        this.alignment = parProps.alignment;
        this.outlineLevel = parProps.outlineLevel;
        this.rightIndent = parProps.rightIndent;
        this.spacingAfter = parProps.spacingAfter;
        this.spacingBefore = parProps.spacingBefore;
        this.lineSpacingType = parProps.lineSpacingType;
        this.firstLineIndentType = parProps.firstLineIndentType;
        this.firstLineIndent = parProps.firstLineIndent;
        this.contextualSpacing = parProps.contextualSpacing;
        this.keepLinesTogether = parProps.keepLinesTogether;
        this.pageBreakBefore = parProps.pageBreakBefore;
        this.pageWidth = secProps.pageWidth - secProps.marginLeft - secProps.marginRight;
        this.leftIndent = this.getLeftIndent(parProps);
        this.backColor = isDefined(parProps.shadingInfo) ? this.getColor(parProps.shadingInfo.getActualColor(colorProvider)) : undefined;
        this.widowOrphanControl = parProps.widowOrphanControl;
        switch (parProps.lineSpacingType) {
            case ParagraphLineSpacingType.AtLeast:
            case ParagraphLineSpacingType.Exactly:
                this.lineSpacing = parProps.lineSpacing;
                this.lineSpacingMultiple = 3;
                break;
            case ParagraphLineSpacingType.Multiple:
                this.lineSpacing = 240;
                this.lineSpacingMultiple = parProps.lineSpacing;
                break;
            default:
                this.lineSpacing = 240;
                this.lineSpacingMultiple = 3;
                break;
        }
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.alignment = obj.alignment;
        this.outlineLevel = obj.outlineLevel;
        this.rightIndent = obj.rightIndent;
        this.spacingBefore = obj.spacingBefore;
        this.spacingAfter = obj.spacingAfter;
        this.lineSpacingType = obj.lineSpacingType;
        this.firstLineIndentType = obj.firstLineIndentType;
        this.firstLineIndent = obj.firstLineIndent;
        this.contextualSpacing = obj.contextualSpacing;
        this.keepLinesTogether = obj.keepLinesTogether;
        this.pageBreakBefore = obj.pageBreakBefore;
        this.pageWidth = obj.pageWidth;
        this.leftIndent = obj.leftIndent;
        this.lineSpacing = obj.lineSpacing;
        this.lineSpacingMultiple = obj.lineSpacingMultiple;
        this.backColor = obj.backColor;
        this.widowOrphanControl = obj.widowOrphanControl;
    }
    clone() {
        const newInstance = new ParagraphDialogParameters();
        newInstance.copyFrom(this);
        return newInstance;
    }
    applyConverter(converter) {
        if (this.pageWidth)
            this.pageWidth = converter(this.pageWidth);
        if (this.firstLineIndent)
            this.firstLineIndent = converter(this.firstLineIndent);
        if (this.leftIndent)
            this.leftIndent = converter(this.leftIndent);
        if (this.lineSpacing)
            this.lineSpacing = converter(this.lineSpacing);
        if (this.rightIndent)
            this.rightIndent = converter(this.rightIndent);
        if (this.spacingAfter)
            this.spacingAfter = converter(this.spacingAfter);
        if (this.spacingBefore)
            this.spacingBefore = converter(this.spacingBefore);
        return this;
    }
    getColor(color) {
        if (color === ColorHelper.AUTOMATIC_COLOR)
            return null;
        if (color != undefined)
            return ColorUtils.colorToHash(color).toUpperCase();
        else
            return undefined;
    }
    getLeftIndent(parProps) {
        if (parProps.firstLineIndentType === ParagraphFirstLineIndent.Hanging &&
            isDefined(parProps.leftIndent) && isDefined(parProps.firstLineIndent))
            return parProps.leftIndent - parProps.firstLineIndent;
        return parProps.leftIndent;
    }
}
