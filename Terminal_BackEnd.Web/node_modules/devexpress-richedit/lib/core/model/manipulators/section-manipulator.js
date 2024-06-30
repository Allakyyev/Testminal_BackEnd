import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { MaskedParagraphPropertiesBundleFull } from '../../rich-utils/properties-bundle';
import { SectionInsertedSubDocumentChange } from '../changes/sub-document/text/section-inserted';
import { InsertSectionHistoryItem } from '../history/items/insert-section-history-item';
import { Paragraph } from '../paragraph/paragraph';
import { RichUtils } from '../rich-utils';
import { RunType } from '../runs/run-type';
import { SectionFooters, SectionHeaders } from '../section/header-footer';
import { Section } from '../section/section';
import { SubDocumentPosition } from '../sub-document';
import { RunsBaseManipulator } from './runs-base-manipulator';
export class SectionManipulator extends RunsBaseManipulator {
    insertSectionAndSetStartType(position, startType, charPropsBundle) {
        const subDocument = this.model.mainSubDocument;
        const documentEndPosition = subDocument.getDocumentEndPosition();
        if (position >= documentEndPosition)
            throw "ModelManipulator.insertSectionAndSetStartType position >= documentEndPosition";
        const sectionProperties = subDocument.getSectionByPosition(position).sectionProperties.clone();
        sectionProperties.startType = startType;
        this.history.beginTransaction();
        this.history.addAndRedo(new InsertSectionHistoryItem(this.modelManipulator, new SubDocumentPosition(subDocument, position), charPropsBundle, new MaskedParagraphPropertiesBundleFull(null, null, undefined, undefined), sectionProperties, false, true));
        this.history.endTransaction();
    }
    insertSection(subDocPos, charPropsBundle, sectionProperties, isInsertPropertiesToCurrentSection, parPropsBundle, isInsertPropertiesAndStyleIndexToCurrentParagraph) {
        const subDocument = subDocPos.subDocument;
        const insertPositionAtStartDocument = subDocPos.position;
        if (!subDocument.isMain())
            throw new Error("Section cannot be inserted in a non-main subDocument");
        var oldSectionIndex = SearchUtils.normedInterpolationIndexOf(subDocument.documentModel.sections, (s) => s.startLogPosition.value, insertPositionAtStartDocument);
        var oldSection = subDocument.documentModel.sections[oldSectionIndex];
        var lengthNewSection = insertPositionAtStartDocument - oldSection.startLogPosition.value + 1;
        var insertedRun = this.insertRunInternal(subDocPos, charPropsBundle, RunType.SectionRun, RichUtils.specialCharacters.SectionMark);
        var oldParagraphIndex = SearchUtils.normedInterpolationIndexOf(subDocument.paragraphs, (p) => p.startLogPosition.value, insertPositionAtStartDocument);
        var oldParagraph = subDocument.paragraphs[oldParagraphIndex];
        var newLengthOldParagraph = insertPositionAtStartDocument - oldParagraph.startLogPosition.value + 1;
        var newLengthNewParagraph = oldParagraph.length - newLengthOldParagraph + 1;
        var newParagraphStartPosition = subDocument.positionManager.registerPosition(insertPositionAtStartDocument + 1);
        var newParagraph = new Paragraph(subDocument, newParagraphStartPosition, newLengthNewParagraph, null, null);
        oldParagraph.length = newLengthOldParagraph;
        subDocument.paragraphs.splice(oldParagraphIndex + 1, 0, newParagraph);
        this.modelManipulator.paragraph.applyParagraphProperties(newParagraph, oldParagraph, isInsertPropertiesAndStyleIndexToCurrentParagraph, parPropsBundle);
        var indexRun = insertedRun.runIndex + 1;
        completeExecuteAllCycles: for (var indexChunk = insertedRun.chunkIndex, chunk; chunk = subDocument.chunks[indexChunk]; indexChunk++) {
            for (var run; run = chunk.textRuns[indexRun]; indexRun++) {
                run.paragraph = newParagraph;
                run.onCharacterPropertiesChanged();
                if (run.isParagraphOrSectionRun())
                    break completeExecuteAllCycles;
            }
            indexRun = 0;
        }
        indexRun = insertedRun.runIndex - 1;
        completeExecuteAllCycles: for (var indexChunk = insertedRun.chunkIndex, chunk; chunk = subDocument.chunks[indexChunk]; indexChunk--) {
            for (var run; run = chunk.textRuns[indexRun]; indexRun--) {
                if (run.isParagraphOrSectionRun())
                    break completeExecuteAllCycles;
                run.onCharacterPropertiesChanged();
            }
            if (indexChunk > 0)
                indexRun = subDocument.chunks[indexChunk - 1].textRuns.length - 1;
        }
        subDocument.positionManager.unregisterPosition(oldSection.startLogPosition);
        var newSectionProperties;
        if (sectionProperties) {
            if (isInsertPropertiesToCurrentSection)
                newSectionProperties = sectionProperties;
            else {
                newSectionProperties = oldSection.sectionProperties;
                oldSection.sectionProperties = sectionProperties;
            }
        }
        else
            newSectionProperties = oldSection.sectionProperties;
        var newSection = new Section(subDocument.documentModel, subDocument.positionManager.registerPosition(oldSection.startLogPosition.value), lengthNewSection, newSectionProperties);
        newSection.headers = oldSection.headers;
        newSection.headers.section = newSection;
        newSection.footers = oldSection.footers;
        newSection.footers.section = newSection;
        oldSection.headers = new SectionHeaders(oldSection);
        oldSection.footers = new SectionFooters(oldSection);
        oldSection.startLogPosition = subDocument.positionManager.registerPosition(insertPositionAtStartDocument + 1);
        oldSection.setLength(subDocument, oldSection.getLength() - lengthNewSection - 1 + 1);
        subDocument.documentModel.sections.splice(oldSectionIndex, 0, newSection);
        this.modelManipulator.notifyModelChanged(new SectionInsertedSubDocumentChange(subDocument.id, insertPositionAtStartDocument, newSection, oldSectionIndex));
    }
}
