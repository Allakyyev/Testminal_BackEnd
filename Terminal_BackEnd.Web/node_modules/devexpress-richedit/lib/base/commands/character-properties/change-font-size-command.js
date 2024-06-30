import { CharacterPropertyDescriptor } from '../../../core/model/character/character-property-descriptor';
import { ModelIterator } from '../../../core/model/model-iterator';
import { RichUtils } from '../../../core/model/rich-utils';
import { SubDocumentInterval } from '../../../core/model/sub-document';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { SparseIntervalsMapCollector } from '@devexpress/utils/lib/intervals/sparse/map-collector';
import { isNumber } from '@devexpress/utils/lib/utils/common';
import { Comparers } from '@devexpress/utils/lib/utils/comparers';
import { RichEditClientCommand } from '../client-command';
import { ChangeCharacterPropertiesCommandBase } from './change-character-properties-command-base';
export class ChangeFontSizeCommand extends ChangeCharacterPropertiesCommandBase {
    getDescriptor() {
        return CharacterPropertyDescriptor.size;
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        const res = typeof parameter == "string" ? parseFloat(parameter) : parameter;
        return this.isFontSizeValueCorrect(res) ? res : this.getCurrentValue();
    }
    isFontSizeValueCorrect(size) {
        if (isNumber(size) && !isNaN(size) && size >= RichUtils.minFontSize && size <= RichUtils.maxFontSize) {
            const decimal = size % 1;
            if (decimal === 0 || decimal === 0.5)
                return true;
        }
        return false;
    }
}
export class StepFontSizeCommand extends ChangeFontSizeCommand {
    executeCore(_state, options) {
        const desc = this.getDescriptor();
        const modelIter = new ModelIterator(options.subDocument, false);
        const collector = new SparseIntervalsMapCollector(Comparers.number, new FixedInterval(0, 0));
        for (let interval of this.getApplyToIntervals(options)) {
            const endPos = interval.end;
            modelIter.setPosition(interval.start);
            do {
                const currPos = modelIter.getAbsolutePosition();
                if (currPos >= endPos)
                    break;
                collector.add(currPos, modelIter.run.getCharacterMergedProperties().fontSize);
            } while (modelIter.moveToNextChar());
        }
        if (options.intervalsInfo.isCollapsed) {
            let newValue = this.getCurrentValue();
            if (newValue === undefined) {
                modelIter.setPosition(options.intervalsInfo.interval.start);
                newValue = modelIter.run.getCharacterMergedProperties().fontSize;
            }
            this.applyToInputPosition(desc, this.step(newValue));
        }
        else {
            this.inputPosition.reset();
        }
        const history = this.history;
        history.beginTransaction();
        const intervalIter = collector.getIterator();
        while (intervalIter.moveToNextInterval()) {
            if (intervalIter.interval.length > 0)
                history.addAndRedo(new (desc.getHistoryItemConstructor())(this.modelManipulator, new SubDocumentInterval(options.subDocument, intervalIter.interval), this.step(intervalIter.object), true));
        }
        history.endTransaction();
        this.control.barHolder.forceUpdate({ [RichEditClientCommand.ChangeFontSize]: true });
        return true;
    }
}
export class DecreaseFontSizeCommand extends StepFontSizeCommand {
    step(currValue) {
        return RichUtils.getPreviousPredefinedFontSize(currValue);
    }
}
export class IncreaseFontSizeCommand extends StepFontSizeCommand {
    step(currValue) {
        return RichUtils.getNextPredefinedFontSize(currValue);
    }
}
