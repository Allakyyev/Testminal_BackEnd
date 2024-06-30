import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { CreateStyleLinkModelChange } from '../changes/model/create-style-link';
import { DeleteStyleLinkModelChange } from '../changes/model/delete-style-link';
import { CharacterStyleAppliedSubDocumentChange } from '../changes/sub-document/style/character-style-applied';
import { ParagraphStyleAppliedSubDocumentChange } from '../changes/sub-document/style/paragraph-style-applied';
import { CharacterStyle } from '../character/character-style';
import { FieldContextMenuHelper } from '../fields/field-context-menu-helper';
import { ApplyCharacterStyleHistoryItem, ApplyParagraphStyleHistoryItem } from '../history/items/apply-style-history-items';
import { FontUseValueHistoryItem } from '../history/items/character-properties-history-items';
import { CreateStyleLinkHistoryItem } from '../history/items/create-style-link-history-item';
import { ParagraphUseValueHistoryItem } from '../history/items/paragraph-properties-history-items';
import { HistoryItemIntervalState } from '../history/states/history-item-state';
import { HistoryItemIntervalStyleStateObject } from '../history/states/history-item-state-object';
import { ControlOptions } from '../options/control';
import { StylesManager } from '../styles-manager';
import { SubDocumentInterval } from '../sub-document';
import { BaseManipulator } from './base-manipulator';
export class StylesManipulator extends BaseManipulator {
    setLinkStyle(characterStyle, paragraphStyle) {
        this.modelManipulator.model.stylesManager.addCharacterStyle(characterStyle);
        this.modelManipulator.model.stylesManager.registerLink(characterStyle, paragraphStyle);
        this.modelManipulator.notifyModelChanged(new CreateStyleLinkModelChange(paragraphStyle.styleName));
    }
    restoreLinkStyle(characterStyle, paragraphStyle) {
        this.modelManipulator.model.stylesManager.removeLastStyle();
        this.modelManipulator.model.stylesManager.unregisterLink(characterStyle, paragraphStyle);
        this.modelManipulator.notifyModelChanged(new DeleteStyleLinkModelChange(paragraphStyle.styleName));
    }
    setCharacterStyle(subDocument, interval, style, restoreHyperlinks) {
        var oldState = new HistoryItemIntervalState();
        if (!ControlOptions.isEnabled(subDocument.documentModel.options.characterStyle))
            return oldState;
        var newState = new HistoryItemIntervalState();
        var iterator = subDocument.getRunIterator(interval);
        while (iterator.moveNext()) {
            let applyingStyle = style;
            var currentInterval = iterator.currentInterval();
            if (restoreHyperlinks) {
                var field = FieldContextMenuHelper.getHyperlinkField(subDocument.fields, currentInterval);
                if (field && field.isHyperlinkField()) {
                    if (iterator.currentRun.characterStyle.styleName === CharacterStyle.hyperlinkStyleName)
                        continue;
                    else
                        applyingStyle = subDocument.documentModel.getCharacterStyleByName(CharacterStyle.hyperlinkStyleName);
                }
            }
            oldState.register(new HistoryItemIntervalStyleStateObject(currentInterval, iterator.currentRun.characterStyle));
            newState.register(new HistoryItemIntervalStyleStateObject(currentInterval, applyingStyle));
            iterator.currentRun.characterStyle = applyingStyle;
            iterator.currentRun.onCharacterPropertiesChanged();
        }
        if (!newState.isEmpty())
            this.modelManipulator.notifyModelChanged(new CharacterStyleAppliedSubDocumentChange(subDocument.id, newState));
        return oldState;
    }
    restoreCharacterStyle(subDocument, state) {
        if (!ControlOptions.isEnabled(subDocument.documentModel.options.characterStyle))
            return;
        if (state.isEmpty())
            return;
        for (var stateValue, i = 0; stateValue = state.objects[i]; i++) {
            var iterator = subDocument.getRunIterator(stateValue.interval);
            while (iterator.moveNext()) {
                iterator.currentRun.characterStyle = stateValue.value;
                iterator.currentRun.onCharacterPropertiesChanged();
            }
        }
        this.modelManipulator.notifyModelChanged(new CharacterStyleAppliedSubDocumentChange(subDocument.id, state));
    }
    setParagraphStyle(subDocument, interval, style) {
        var oldState = new HistoryItemIntervalState();
        if (!ControlOptions.isEnabled(subDocument.documentModel.options.paragraphStyle))
            return oldState;
        var newState = new HistoryItemIntervalState();
        var paragraphs = subDocument.getParagraphsByInterval(interval);
        for (var paragraph, i = 0; paragraph = paragraphs[i]; i++) {
            var paragraphInterval = new FixedInterval(paragraph.startLogPosition.value, paragraph.length);
            oldState.register(new HistoryItemIntervalStyleStateObject(paragraphInterval, paragraph.paragraphStyle));
            newState.register(new HistoryItemIntervalStyleStateObject(paragraphInterval, style));
            paragraph.paragraphStyle = style;
            paragraph.onParagraphPropertiesChanged();
            this.resetMergedCharacterProperties(subDocument, paragraphInterval);
        }
        this.modelManipulator.notifyModelChanged(new ParagraphStyleAppliedSubDocumentChange(subDocument.id, newState));
        return oldState;
    }
    restoreParagraphStyle(subDocument, state) {
        if (!ControlOptions.isEnabled(subDocument.documentModel.options.paragraphStyle))
            return;
        for (var stateValue, i = 0; stateValue = state.objects[i]; i++) {
            var paragraphs = subDocument.getParagraphsByInterval(stateValue.interval);
            for (var j = 0, paragraph; paragraph = paragraphs[j]; j++) {
                paragraph.paragraphStyle = stateValue.value;
                paragraph.onParagraphPropertiesChanged();
                this.resetMergedCharacterProperties(subDocument, new FixedInterval(paragraph.startLogPosition.value, paragraph.length));
            }
        }
        this.modelManipulator.notifyModelChanged(new ParagraphStyleAppliedSubDocumentChange(subDocument.id, state));
    }
    resetMergedCharacterProperties(subDocument, interval) {
        var runs = subDocument.getRunsByInterval(interval);
        for (var i = 0, run; run = runs[i]; i++)
            run.onCharacterPropertiesChanged();
    }
    applyCharacterStyle(subDocInterval, style, restoreHyperlinks) {
        if (!ControlOptions.isEnabled(this.modelManipulator.modelManager.richOptions.control.characterStyle) || !style)
            return false;
        this.history.beginTransaction();
        this.history.addAndRedo(new FontUseValueHistoryItem(this.modelManipulator, subDocInterval, 0));
        this.history.addAndRedo(new ApplyCharacterStyleHistoryItem(this.modelManipulator, subDocInterval, style, restoreHyperlinks));
        this.history.endTransaction();
        return true;
    }
    applyCharacterStyleByName(subDocInterval, styleName) {
        let characterStyle = this.model.getCharacterStyleByName(styleName);
        if (!characterStyle)
            characterStyle = this.model.stylesManager.addCharacterStyle(StylesManager.getPresetCharacterStyleByName(styleName).clone());
        return this.applyCharacterStyle(subDocInterval, characterStyle, false);
    }
    applyParagraphStyleByName(subDocInterval, styleName) {
        let paragraphStyle = this.model.getParagraphStyleByName(styleName);
        if (!paragraphStyle)
            paragraphStyle = this.model.stylesManager.addParagraphStyle(StylesManager.getPresetParagraphStyleByName(styleName).clone());
        return this.applyParagraphStyle(subDocInterval, paragraphStyle);
    }
    applyParagraphStyle(subDocInterval, style) {
        if (!ControlOptions.isEnabled(this.modelManipulator.modelManager.richOptions.control.paragraphStyle) || !style)
            return false;
        const count = this.calculateAffectedParagraphCount(subDocInterval);
        if (count > 0 && ControlOptions.isEnabled(this.modelManipulator.modelManager.richOptions.control.paragraphStyle)) {
            const paragraphIndex = SearchUtils.normedInterpolationIndexOf(subDocInterval.subDocument.paragraphs, p => p.startLogPosition.value, subDocInterval.interval.start);
            this.history.beginTransaction();
            for (var i = 0; i < count; i++) {
                var paragraph = subDocInterval.subDocument.paragraphs[paragraphIndex + i];
                var paragraphInterval = new FixedInterval(paragraph.startLogPosition.value, paragraph.length);
                this.history.addAndRedo(new ApplyParagraphStyleHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocInterval.subDocument, paragraphInterval), style));
                this.history.addAndRedo(new ParagraphUseValueHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocInterval.subDocument, paragraphInterval), 0));
                this.history.addAndRedo(new FontUseValueHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocInterval.subDocument, paragraphInterval), 0));
            }
            this.history.endTransaction();
        }
        else {
            if (!ControlOptions.isEnabled(this.modelManipulator.modelManager.richOptions.control.characterStyle))
                return false;
            if (!style.linkedStyle)
                this.createCharacterStyle(style);
            return this.applyCharacterStyle(subDocInterval, style.linkedStyle, false);
        }
        return true;
    }
    calculateAffectedParagraphCount(subDocInterval) {
        const paragraphs = subDocInterval.subDocument.getParagraphsByInterval(subDocInterval.interval);
        if (paragraphs.length > 1)
            return paragraphs.length;
        const paragraph = paragraphs[0];
        const lastParagraphCharSelected = subDocInterval.interval.length >= paragraph.length - 1;
        if (subDocInterval.interval.start === paragraph.startLogPosition.value && lastParagraphCharSelected || subDocInterval.interval.length === 0)
            return 1;
        return 0;
    }
    createCharacterStyle(paragraphStyle) {
        const charStyle = new CharacterStyle(paragraphStyle.styleName + " Char", paragraphStyle.localizedName + " Char", false, false, false, false, paragraphStyle.maskedCharacterProperties);
        this.history.addAndRedo(new CreateStyleLinkHistoryItem(this.modelManipulator, charStyle, paragraphStyle));
    }
}
