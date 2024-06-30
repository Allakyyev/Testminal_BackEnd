import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { CharacterPropertyDescriptor } from '../../character/character-property-descriptor';
import { CharacterStyle } from '../../character/character-style';
import { CharacterPropertiesMask } from '../../character/enums';
import { ModelIterator } from '../../model-iterator';
import { SubDocumentInterval } from '../../sub-document';
import { IntervalBasedHistoryItem } from '../base/interval-based-history-item';
import { ApplyCharacterStyleHistoryItem } from './apply-style-history-items';
import { FontUseValueHistoryItem } from './character-properties-history-items';
export class ApplyFieldHyperlinkStyleHistoryItem extends IntervalBasedHistoryItem {
    constructor(modelManipulator, subDocInterval) {
        super(modelManipulator, subDocInterval);
        this.historyItems = [];
    }
    redo() {
        if (ApplyFieldHyperlinkStyleHistoryItem.mask === undefined)
            throw new Error("CharacterPropertiesMask defined later than that class");
        if (this.historyItems.length > 0) {
            for (var i = 0, histItem; histItem = this.historyItems[i]; i++)
                histItem.redo();
            return;
        }
        var charHyperlinkStyle = this.modelManipulator.model.getCharacterStyleByName(CharacterStyle.hyperlinkStyleName);
        var intervalEnd = this.interval.end;
        this.boundSubDocument.splitRun(this.interval.start);
        this.boundSubDocument.splitRun(intervalEnd);
        var modelIterator = new ModelIterator(this.boundSubDocument, false);
        modelIterator.setPosition(this.interval.start);
        var histItem;
        do {
            var run = modelIterator.run;
            var runMergedProperties = run.getCharacterMergedProperties();
            var runInterval = new FixedInterval(modelIterator.chunk.startLogPosition.value + run.startOffset, run.getLength());
            histItem = new ApplyCharacterStyleHistoryItem(this.modelManipulator, this.subDocInterval, charHyperlinkStyle, false);
            histItem.redo();
            this.historyItems.push(histItem);
            for (let desc of CharacterPropertyDescriptor.whatNeedSetWhenCreateHyperlinkField) {
                histItem = new (desc.getHistoryItemConstructor())(this.modelManipulator, new SubDocumentInterval(this.boundSubDocument, runInterval), desc.getProp(runMergedProperties), true);
                histItem.redo();
                this.historyItems.push(histItem);
            }
            histItem = new FontUseValueHistoryItem(this.modelManipulator, new SubDocumentInterval(this.boundSubDocument, runInterval), ApplyFieldHyperlinkStyleHistoryItem.mask);
            histItem.redo();
            this.historyItems.push(histItem);
        } while (runInterval.start < intervalEnd && modelIterator.moveToNextRun());
    }
    undo() {
        for (var i = this.historyItems.length - 1, histItem; histItem = this.historyItems[i]; i--)
            histItem.undo();
        this.boundSubDocument.splitRun(this.interval.start);
        this.boundSubDocument.splitRun(this.interval.end);
        var modelIterator = new ModelIterator(this.boundSubDocument, false);
        modelIterator.setPosition(this.interval.start);
        do {
        } while (modelIterator.chunk.startLogPosition.value + modelIterator.run.startOffset < this.interval.end && modelIterator.moveToNextRun());
    }
}
ApplyFieldHyperlinkStyleHistoryItem.mask = CharacterPropertiesMask.UseAll & ~(CharacterPropertiesMask.UseFontUnderlineType | CharacterPropertiesMask.UseUnderlineWordsOnly | CharacterPropertiesMask.UseForeColorIndex);
