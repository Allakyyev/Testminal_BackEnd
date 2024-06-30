import { SectionLandscapeHistoryItem, SectionPageHeightHistoryItem, SectionPageWidthHistoryItem, SectionPaperKindHistoryItem } from '../../../core/model/history/items/section-properties-history-items';
import { PaperKind, PaperSizeConverter } from '../../../core/model/section/paper-kind';
import { RichEditClientCommand } from '../client-command';
import { SectionPropertiesCommandBase } from './section-properties-command-base';
export class SetSectionPageSizeCommand extends SectionPropertiesCommandBase {
    executeCore(_state, options) {
        const parameters = options.param;
        var modelManipulator = this.modelManipulator;
        const history = this.history;
        const iter = this.getAffectedSectionsIterator(options.intervalsInfo.intervals);
        const newLandscape = parameters.size.width > parameters.size.height;
        let changed = false;
        history.beginTransaction();
        while (iter.moveNext()) {
            const sectionInterval = iter.obj.interval;
            const secProps = iter.obj.sectionProperties;
            var oldLandscape = secProps.landscape;
            if (parameters.updateOrientation && oldLandscape !== newLandscape) {
                history.addAndRedo(new SectionLandscapeHistoryItem(modelManipulator, sectionInterval, newLandscape));
                changed = true;
            }
            var newWidth = parameters.updateOrientation || !oldLandscape ? parameters.size.width : parameters.size.height;
            if (secProps.pageWidth !== newWidth) {
                history.addAndRedo(new SectionPageWidthHistoryItem(modelManipulator, sectionInterval, newWidth));
                changed = true;
            }
            var newHeigth = parameters.updateOrientation || !oldLandscape ? parameters.size.height : parameters.size.width;
            if (secProps.pageHeight !== newHeigth) {
                history.addAndRedo(new SectionPageHeightHistoryItem(modelManipulator, sectionInterval, newHeigth));
                changed = true;
            }
            const newPaperKind = parameters.paperKind;
            if (secProps.paperKind !== newPaperKind) {
                history.addAndRedo(new SectionPaperKindHistoryItem(modelManipulator, sectionInterval, newPaperKind));
                changed = true;
            }
        }
        history.endTransaction();
        return changed;
    }
    getStateValue(_options) {
        return this.inputPosition.getMergedSectionPropertiesRaw().pageSize;
    }
    static compareSizeByTwoDimensions(a, b) {
        return a.equals(b) || a.width == b.height && a.height == b.width;
    }
}
export class SetSectionPaperKindCommand extends SetSectionPageSizeCommand {
    DEPRECATEDConvertOptionsParameter(_parameter) {
        const paperKind = this.getPaperKind();
        const newSize = PaperSizeConverter.calculatePaperSize(paperKind);
        const currentSize = this.inputPosition.getMergedSectionPropertiesRaw().pageSize;
        const equal = SetSectionPageSizeCommand.compareSizeByTwoDimensions(currentSize, newSize);
        return equal ? { size: currentSize, updateOrientation: false, paperKind: paperKind } : { size: newSize, updateOrientation: false, paperKind: paperKind };
    }
    getStateValue(_options) {
        const newSize = PaperSizeConverter.calculatePaperSize(this.getPaperKind());
        const currentSize = this.inputPosition.getMergedSectionPropertiesRaw().pageSize;
        return SetSectionPageSizeCommand.compareSizeByTwoDimensions(newSize, currentSize) ? currentSize : null;
    }
    getStateCore(enabled, intervals, value) {
        const state = super.getStateCore(enabled, intervals, value);
        state.checked = value !== null;
        return state;
    }
    getRelatedCommands() {
        return {
            [RichEditClientCommand.SetSectionLetterPaperKind]: true,
            [RichEditClientCommand.SetSectionLegalPaperKind]: true,
            [RichEditClientCommand.SetSectionFolioPaperKind]: true,
            [RichEditClientCommand.SetSectionA4PaperKind]: true,
            [RichEditClientCommand.SetSectionA5PaperKind]: true,
            [RichEditClientCommand.SetSectionA6PaperKind]: true,
            [RichEditClientCommand.SetSectionB5PaperKind]: true,
            [RichEditClientCommand.SetSectionExecutivePaperKind]: true,
        };
    }
}
export class SetSectionLetterPaperKindCommand extends SetSectionPaperKindCommand {
    getPaperKind() { return PaperKind.Letter; }
}
export class SetSectionLegalPaperKindCommand extends SetSectionPaperKindCommand {
    getPaperKind() { return PaperKind.Legal; }
}
export class SetSectionFolioPaperKindCommand extends SetSectionPaperKindCommand {
    getPaperKind() { return PaperKind.Folio; }
}
export class SetSectionA4PaperKindCommand extends SetSectionPaperKindCommand {
    getPaperKind() { return PaperKind.A4; }
}
export class SetSectionA5PaperKindCommand extends SetSectionPaperKindCommand {
    getPaperKind() { return PaperKind.A5; }
}
export class SetSectionA6PaperKindCommand extends SetSectionPaperKindCommand {
    getPaperKind() { return PaperKind.A6; }
}
export class SetSectionB5PaperKindCommand extends SetSectionPaperKindCommand {
    getPaperKind() { return PaperKind.B5; }
}
export class SetSectionExecutivePaperKindCommand extends SetSectionPaperKindCommand {
    getPaperKind() { return PaperKind.Executive; }
}
