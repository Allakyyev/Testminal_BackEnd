import { SectionMarginLeftHistoryItem, SectionMarginRightHistoryItem } from '../../../core/model/history/items/section-properties-history-items';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { CommandBase } from '../command-base';
import { IntervalCommandState } from '../command-states';
import { SectionPropertiesCommandBase } from '../section-properties/section-properties-command-base';
export class RulerSectionMarginCommandBase extends CommandBase {
    DEPRECATEDCorrectlMainCommandOptions(options) {
        options.intervalsInfo.interval = this.selection.lastSelectedInterval;
    }
    getLayoutTextBox() {
        const subDocId = this.selection.specialRunInfo.getParentSubDocument().id;
        const pos = this.selection.specialRunInfo.getPosition();
        const page = this.control.layout.pages[this.selection.pageIndex];
        return page ? page.anchoredObjectHolder.getObjectByModelPosition(this.control.layout, pos, subDocId) : null;
    }
    isEnabled(_options) {
        return super.isEnabled() && !this.selection.activeSubDocument.isTextBox() &&
            (!this.control.modelManager.model.isDocumentProtectionEnabled ||
                SectionPropertiesCommandBase.rangePermissionIncludeFullSection(this.control, this.selection.activeSubDocument, this.selection.intervals));
    }
}
export class RulerSectionMarginLeftCommand extends RulerSectionMarginCommandBase {
    getState(options = this.convertToCommandOptions(undefined)) {
        let value = 0;
        if (options.subDocument.isTextBox()) {
            const layoutTextBox = this.getLayoutTextBox();
            if (layoutTextBox)
                value = layoutTextBox.x + layoutTextBox.textBoxProperties.leftMargin;
        }
        else
            value = UnitConverter.twipsToPixelsF(this.inputPosition.getMergedSectionPropertiesRaw().marginLeft);
        return new IntervalCommandState(this.isEnabled(options), options.intervalsInfo.interval, value);
    }
    executeCore(_state, options) {
        var interval = options.intervalsInfo.interval;
        var value = UnitConverter.pixelsToTwips(options.param);
        this.history.addAndRedo(new SectionMarginLeftHistoryItem(this.modelManipulator, interval, value));
        return true;
    }
}
export class RulerSectionMarginRightCommand extends RulerSectionMarginCommandBase {
    getState(options = this.convertToCommandOptions(undefined)) {
        let value = 0;
        if (options.subDocument.isTextBox()) {
            const layoutTextBox = this.getLayoutTextBox();
            if (layoutTextBox) {
                const pageWidth = UnitConverter.twipsToPixelsF(this.inputPosition.getMergedSectionPropertiesRaw().pageWidth);
                value = pageWidth - layoutTextBox.x - layoutTextBox.width + layoutTextBox.textBoxProperties.rightMargin;
            }
        }
        else
            value = UnitConverter.twipsToPixelsF(this.inputPosition.getMergedSectionPropertiesRaw().marginRight);
        return new IntervalCommandState(this.isEnabled(options), options.intervalsInfo.interval, value);
    }
    executeCore(state, options) {
        var interval = state.interval;
        var value = UnitConverter.pixelsToTwips(options.param);
        this.history.addAndRedo(new SectionMarginRightHistoryItem(this.modelManipulator, interval, value));
        return true;
    }
}
