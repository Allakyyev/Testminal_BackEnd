import { EnumUtils } from '@devexpress/utils/lib/utils/enum';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { CharacterPropertyDescriptor } from '../model/character/character-property-descriptor';
import { Field } from '../model/fields/field';
import { ModelIterator } from '../model/model-iterator';
import { ParagraphPropertyDescriptor } from '../model/paragraph/paragraph-properties';
import { RunType } from '../model/runs/run-type';
import { MaskedCharacterPropertiesBundle, MaskedParagraphPropertiesBundle } from '../rich-utils/properties-bundle';
export class InputPositionBase {
    get model() { return this.intervalsInfo.subDocument.documentModel; }
    ;
    resetParagraphMergedProperties() {
        this.mergedParagraphPropertiesRaw = null;
        this.mergedParagraphPropertiesFull = null;
    }
    get charPropsBundle() {
        return new MaskedCharacterPropertiesBundle(this.getMaskedCharacterProperties().clone(), this.getCharacterStyle());
    }
    get parPropsBundle() {
        return new MaskedParagraphPropertiesBundle(this.getMaskedParagraphProperties().clone(), this.getParagraphStyle());
    }
    setIntervals(intervalsInfo) {
        this.intervalsInfo = intervalsInfo.clone();
        this.resetReturnValues();
        return this;
    }
    getCharacterStyle() {
        if (!this.characterStyle)
            this.characterStyle = this.getCharacterStyleInternal();
        return this.characterStyle;
    }
    getParagraphStyle() {
        if (!this.paragraphStyle) {
            this.setSourceRun();
            this.paragraphStyle = this.sourceRun.paragraph.paragraphStyle;
        }
        return this.paragraphStyle;
    }
    setCharacterStyle(characterStyle) {
        this.characterStyle = characterStyle;
    }
    getMaskedCharacterProperties() {
        if (!this.maskedCharacterProperties) {
            this.setSourceRun();
            this.maskedCharacterProperties = this.sourceRun.maskedCharacterProperties.clone();
        }
        return this.maskedCharacterProperties;
    }
    getMaskedParagraphProperties() {
        if (!this.maskedParagraphProperties) {
            this.setSourceRun();
            this.maskedParagraphProperties = this.sourceRun.paragraph.maskedParagraphProperties.clone();
        }
        return this.maskedParagraphProperties;
    }
    getMergedCharacterPropertiesRaw() {
        if (!this.mergedCharacterPropertiesRaw)
            this.setMergedCharacterAndParagraphPropertiesRaw();
        return this.mergedCharacterPropertiesRaw;
    }
    getMergedCharacterPropertiesFull() {
        if (!this.mergedCharacterPropertiesFull)
            this.mergedCharacterPropertiesFull = InputPositionBase.mergePropertiesFull(this.getMergedCharacterPropertiesRaw(), CharacterPropertyDescriptor.ALL_FIELDS);
        return this.mergedCharacterPropertiesFull;
    }
    getMergedParagraphPropertiesRaw() {
        if (!this.mergedParagraphPropertiesRaw)
            this.setMergedCharacterAndParagraphPropertiesRaw();
        return this.mergedParagraphPropertiesRaw;
    }
    getMergedParagraphPropertiesFull() {
        if (!this.mergedParagraphPropertiesFull)
            this.mergedParagraphPropertiesFull = InputPositionBase.mergePropertiesFull(this.getMergedParagraphPropertiesRaw(), ParagraphPropertyDescriptor.ALL_FIELDS);
        return this.mergedParagraphPropertiesFull;
    }
    setMergedCharacterAndParagraphPropertiesRaw() {
        this.setSourceRun();
        this.mergedCharacterPropertiesRaw = this.sourceRun.getCharacterMergedProperties().clone();
        this.mergedParagraphPropertiesRaw = this.sourceRun.paragraph.getParagraphMergedProperties().clone();
        var interval = this.intervalsInfo.interval;
        var intervalStartPosition = interval.start;
        var intervalEndPosition = interval.end;
        var chunks = this.intervalsInfo.subDocument.chunks;
        var chunkIndex = SearchUtils.normedInterpolationIndexOf(chunks, (c) => c.startLogPosition.value, intervalStartPosition);
        var chunk = chunks[chunkIndex];
        var runIndex = SearchUtils.normedInterpolationIndexOf(chunk.textRuns, (r) => chunk.startLogPosition.value + r.startOffset, intervalStartPosition);
        var prevParagraph = this.sourceRun.paragraph;
        exitBothLoops: for (; chunk = chunks[chunkIndex]; chunkIndex++) {
            for (var run; run = chunk.textRuns[runIndex]; runIndex++) {
                if (chunk.startLogPosition.value + run.startOffset >= intervalEndPosition)
                    break exitBothLoops;
                if (run !== this.sourceRun) {
                    if (run.getType() === RunType.TextRun)
                        InputPositionBase.mergePropertiesRaw(this.mergedCharacterPropertiesRaw, run.getCharacterMergedProperties(), CharacterPropertyDescriptor.ALL_FIELDS);
                    if (prevParagraph !== run.paragraph) {
                        InputPositionBase.mergePropertiesRaw(this.mergedParagraphPropertiesRaw, run.paragraph.getParagraphMergedProperties(), ParagraphPropertyDescriptor.ALL_FIELDS);
                        prevParagraph = run.paragraph;
                    }
                }
            }
        }
    }
    static mergePropertiesRaw(sourceProps, otherProps, descriptors) {
        for (var i = 0, desc; desc = descriptors[i]; i++) {
            if (!desc.binaryEquals(desc.getProp(sourceProps), desc.getProp(otherProps)))
                desc.setProp(sourceProps, undefined);
        }
    }
    static mergePropertiesFull(sourceProps, descriptors) {
        var result = sourceProps.clone();
        for (var i = 0, desc; desc = descriptors[i]; i++) {
            if (desc.getProp(result) === undefined)
                desc.setProp(result, desc.defaultValue);
        }
        return result;
    }
    getCharacterStyleInternal() {
        var interval = this.intervalsInfo.interval;
        if (interval.length == 0)
            return this.getCharacterStyleCollapsedIntervalInternal(interval.start);
        var chunks = this.intervalsInfo.subDocument.chunks;
        var intervalStartPosition = interval.start;
        var intervalEndPosition = interval.end;
        var firstRun = this.intervalsInfo.subDocument.getRunAndIndexesByPosition(intervalStartPosition);
        if (intervalStartPosition == firstRun.run.paragraph.startLogPosition.value && firstRun.run.paragraph.length > 1)
            return firstRun.run.characterStyle;
        if (intervalStartPosition > 0) {
            var prevFirstRun = this.intervalsInfo.subDocument.getRunAndIndexesByPosition(intervalStartPosition - 1);
            if (prevFirstRun.run.getType() == RunType.TextRun)
                return prevFirstRun.run.characterStyle;
        }
        for (var chunk, chunkIndex = firstRun.chunkIndex; chunk = chunks[chunkIndex]; chunkIndex++) {
            for (var run, runIndex = firstRun.runIndex; run = chunk.textRuns[runIndex]; runIndex++) {
                if (chunk.startLogPosition.value + run.startOffset >= intervalEndPosition)
                    return firstRun.run.characterStyle;
                if (run.getType() == RunType.TextRun)
                    return run.characterStyle;
            }
        }
        return firstRun.run.characterStyle;
    }
    isHyperlinkField(resultRunPosition) {
        resultRunPosition++;
        const fields = this.intervalsInfo.subDocument.fields;
        return fields[0] && ListUtils.reverseElementBy(fields, (f) => f.getFieldEndPosition() == resultRunPosition, Math.max(0, Field.normedBinaryIndexOf(fields, resultRunPosition))).isHyperlinkField();
    }
    getCharacterStyleCollapsedIntervalInternal(intervalStartPosition) {
        var chunks = this.intervalsInfo.subDocument.chunks;
        if (intervalStartPosition == 0)
            return chunks[0].textRuns[0].characterStyle;
        const iter = new ModelIterator(this.intervalsInfo.subDocument, false);
        iter.setPosition(intervalStartPosition - 1);
        if (!iter.run.isParagraphOrSectionRun() && !(iter.run.getType() == RunType.FieldResultEndRun && this.isHyperlinkField(iter.getAbsolutePosition())))
            return iter.run.characterStyle;
        iter.moveToNextRun();
        return iter.run.characterStyle;
    }
    setSourceRun() {
        if (this.sourceRun)
            return;
        const interval = this.intervalsInfo.interval;
        if (interval.length == 0) {
            if (interval.start == 0) {
                const firstChunk = this.intervalsInfo.subDocument.chunks[0];
                this.sourceRun = firstChunk ? firstChunk.textRuns[0].clone() : null;
            }
            else {
                const iter = new ModelIterator(this.intervalsInfo.subDocument, false);
                iter.setPosition(interval.start - 1);
                if (!EnumUtils.isAnyOf(iter.run.getType(), RunType.TextRun, RunType.FieldResultEndRun))
                    iter.moveToNextRun();
                this.sourceRun = iter.run.clone();
            }
        }
        else {
            const firstRunInInterval = this.intervalsInfo.subDocument.getRunByPosition(interval.start);
            if (firstRunInInterval.getType() == RunType.TextRun) {
                this.sourceRun = firstRunInInterval.clone();
                return;
            }
            const intervalEnd = interval.end;
            let lastRunInInterval = this.intervalsInfo.subDocument.getRunByPosition(intervalEnd - 1);
            const lastSection = this.model.sections[this.model.sections.length - 1];
            if (intervalEnd == lastSection.getEndPosition() && intervalEnd > 2)
                lastRunInInterval = this.intervalsInfo.subDocument.getRunByPosition(intervalEnd - 2);
            if (lastRunInInterval.getType() == RunType.TextRun) {
                this.sourceRun = lastRunInInterval.clone();
                return;
            }
            this.sourceRun = firstRunInInterval.clone();
        }
    }
    resetReturnValues() {
        this.sourceRun = null;
        this.characterStyle = null;
        this.maskedCharacterProperties = null;
        this.mergedCharacterPropertiesRaw = null;
        this.mergedCharacterPropertiesFull = null;
        this.mergedParagraphPropertiesRaw = null;
        this.mergedParagraphPropertiesFull = null;
    }
    getAllCharacterProperties() {
        return new InputPositionCharacterProperties(this.getMaskedCharacterProperties().clone(), this.getMergedCharacterPropertiesRaw().clone(), this.mergedCharacterPropertiesFull ? this.mergedCharacterPropertiesFull.clone() : null);
    }
    applyAllCharacterProperties(props, onlyOnInputPosition = false) {
        this.maskedCharacterProperties = props.maskedCharacterProperties;
        this.mergedCharacterPropertiesRaw = props.mergedCharacterPropertiesRaw;
        this.mergedCharacterPropertiesFull = props.mergedCharacterPropertiesFull;
        if (!onlyOnInputPosition)
            this.applyAllCharacterPropertiesToSourceRun();
    }
    applyAllCharacterPropertiesToSourceRun() {
        this.setSourceRun();
        this.sourceRun.maskedCharacterProperties = this.maskedCharacterProperties;
        this.sourceRun.setCharacterMergedProperies(this.mergedCharacterPropertiesRaw);
    }
    getAllParagraphProperties() {
        return new InputPositionParagraphProperties(this.getMaskedParagraphProperties().clone(), this.getMergedParagraphPropertiesRaw().clone(), this.mergedParagraphPropertiesFull ? this.mergedParagraphPropertiesFull.clone() : null);
    }
    applyAllParagraphProperties(props) {
        this.maskedParagraphProperties = props.maskedParagraphProperties;
        this.mergedParagraphPropertiesRaw = props.mergedParagraphPropertiesRaw;
        this.mergedParagraphPropertiesFull = props.mergedParagraphPropertiesFull;
    }
}
export class InputPositionCharacterProperties {
    constructor(maskedCharacterProperties, mergedCharacterPropertiesRaw, mergedCharacterPropertiesFull) {
        this.maskedCharacterProperties = maskedCharacterProperties;
        this.mergedCharacterPropertiesRaw = mergedCharacterPropertiesRaw;
        this.mergedCharacterPropertiesFull = mergedCharacterPropertiesFull;
    }
}
export class InputPositionParagraphProperties {
    constructor(maskedParagraphProperties, mergedParagraphPropertiesRaw, mergedParagraphPropertiesFull) {
        this.maskedParagraphProperties = maskedParagraphProperties;
        this.mergedParagraphPropertiesRaw = mergedParagraphPropertiesRaw;
        this.mergedParagraphPropertiesFull = mergedParagraphPropertiesFull;
    }
}
