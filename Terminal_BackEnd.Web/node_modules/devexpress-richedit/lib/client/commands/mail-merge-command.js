import { CommandBase } from '../../base/commands/command-base';
import { SimpleCommandState } from '../../base/commands/command-states';
import { MergeMode } from '../../base/commands/dialogs/dialog-finish-and-merge-command';
import { ClientModelManager } from '../../core/model-manager';
import { FieldCodeParserMailMerge } from '../../core/model/fields/parsers/field-code-parser-merge-field';
import { FieldsWaitingForUpdate } from '../../core/model/fields/tree-creator';
import { InsertParagraphManipulatorParams } from '../../core/model/manipulators/paragraph-manipulator/insert-paragraph-manipulator-params';
import { RangeCopy } from '../../core/model/manipulators/range/create-range-copy-operation';
import { InsertTextManipulatorParams } from '../../core/model/manipulators/text-manipulator/insert-text-manipulator-params';
import { ControlOptions, DocumentCapability } from '../../core/model/options/control';
import { RichUtils } from '../../core/model/rich-utils';
import { RunType } from '../../core/model/runs/run-type';
import { SectionStartType } from '../../core/model/section/enums';
import { SubDocumentIntervals, SubDocumentPosition } from '../../core/model/sub-document';
import { MaskedCharacterPropertiesBundle } from '../../core/rich-utils/properties-bundle';
import { EmptyBatchUpdatableObject } from '@devexpress/utils/lib/class/batch-updatable';
import { Errors } from '@devexpress/utils/lib/errors';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { DocxExportOptions } from '../../docx/export/docx-export-options';
import { DocxExporter } from '../../docx/export/exporter';
import { Importer } from '../../docx/import/importer';
import { ImporterOptions } from '../../docx/import/importer-options';
import { exportModelToBlob } from '../../model-api/formats/exporter';
export class MailMergeCommand extends CommandBase {
    getState() {
        var state = new SimpleCommandState(this.isEnabled());
        state.visible = this.control.modelManager.richOptions.control.fields !== DocumentCapability.Hidden;
        return state;
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.fields) &&
            this.control.modelManager.model.mainSubDocument.getDocumentEndPosition() > 1 && !!this.getDataSource();
    }
    canModify() {
        return true;
    }
    executeCore(_state, options) {
        const docxExporter = new DocxExporter(this.control.modelManager.modelManipulator, new DocxExportOptions());
        docxExporter.exportToBlob((blob) => {
            const docxImporter = new Importer(new ImporterOptions());
            docxImporter.importFromFile(blob, this.control.modelManager.richOptions, (documentModel, formatImagesImporter) => {
                const modelManager = this.createModelManager(documentModel);
                this.control.commandManager.formatImagesImporters.push(formatImagesImporter);
                formatImagesImporter.whenAllPicturesLoaded((successLoadedAllPictures) => {
                    const index = this.control.commandManager.formatImagesImporters.indexOf(formatImagesImporter);
                    if (index >= 0)
                        this.control.commandManager.formatImagesImporters.splice(index, 1);
                    if (!successLoadedAllPictures)
                        throw new Error(Errors.InternalException);
                    const param = options.param;
                    this.prepareMergedDocument(modelManager, param);
                    exportModelToBlob(modelManager.modelManipulator, param.documentFormat, blob => param.callback(blob));
                }, 3000);
                formatImagesImporter.import(modelManager.modelManipulator);
            }, () => { });
        });
        return true;
    }
    prepareMergedDocument(modelManager, param) {
        const subDoc = modelManager.model.mainSubDocument;
        const subDocumentIntervals = new SubDocumentIntervals(subDoc, [new FixedInterval(0, subDoc.getDocumentEndPosition() - 1)]);
        const rangeCopy = RangeCopy.create(subDocumentIntervals);
        const dataSource = this.getDataSource();
        const exportToIndex = Math.min(param.exportFrom + param.exportRecordsCount, dataSource.totalCount()) - 1;
        if (param.exportFrom > exportToIndex)
            modelManager.modelManipulator.range.removeIntervalWithoutHistory(subDoc, subDocumentIntervals.intervals[0], false);
        let lastProcessedPositionInMainSubDocument = 0;
        const processedSubDocIds = [];
        for (let index = param.exportFrom; index <= exportToIndex; index++) {
            if (index > param.exportFrom)
                rangeCopy.insertTo(modelManager.modelManipulator, new SubDocumentPosition(subDoc, subDoc.getDocumentEndPosition() - 1));
            const record = dataSource.items()[index];
            this.replaceMergeFieldsInModel(modelManager, record, lastProcessedPositionInMainSubDocument, processedSubDocIds);
            if (index < exportToIndex)
                this.insertSeparator(modelManager, param.mergeMode);
            lastProcessedPositionInMainSubDocument = subDoc.getDocumentEndPosition() - 1;
        }
    }
    getDataSource() {
        return this.control.owner.dataSource;
    }
    replaceMergeFieldsInModel(modelManager, record, lastProcessedPositionInMainSubDocument, processedSubDocIds) {
        NumberMapUtils.forEach(modelManager.model.subDocuments, (subDoc) => {
            if (!ListUtils.anyOf(processedSubDocIds, id => id === subDoc.id)) {
                this.replaceMergeFieldsInSubDocument(modelManager, record, lastProcessedPositionInMainSubDocument, subDoc);
                if (!subDoc.isMain())
                    processedSubDocIds.push(subDoc.id);
            }
        });
    }
    replaceMergeFieldsInSubDocument(modelManager, record, lastProcessedPositionInMainSubDocument, subDoc) {
        for (let i = subDoc.fields.length - 1; i >= 0; i--) {
            const field = subDoc.fields[i];
            if (subDoc.isMain() && field.getFieldStartPosition() < lastProcessedPositionInMainSubDocument)
                return;
            const parser = FieldsWaitingForUpdate.getParser(modelManager, null, null, subDoc, field);
            if (parser) {
                if (parser instanceof FieldCodeParserMailMerge) {
                    const fieldName = parser.getMergeFieldName();
                    const pos = field.getFieldStartPosition();
                    const text = RichUtils.replaceParagraphEndCharsWithLineBreak(this.getResultByFieldName(record, fieldName));
                    if (!StringUtils.isNullOrEmpty(text)) {
                        const insertParams = new InsertTextManipulatorParams(new SubDocumentPosition(subDoc, pos), subDoc.getRunByPosition(pos).getCharPropsBundle(modelManager.model), RunType.TextRun, text);
                        modelManager.modelManipulator.text.insertTextInner(insertParams);
                    }
                    modelManager.modelManipulator.range.removeIntervalWithoutHistory(subDoc, field.getAllFieldInterval(), false);
                }
                parser.destructor();
            }
        }
    }
    getResultByFieldName(record, fieldName) {
        const keys = Object.keys(record);
        for (let i = 0, key; key = keys[i]; i++)
            if (key.toLowerCase() == fieldName.toLowerCase())
                return record[key] + '';
        return '';
    }
    insertSeparator(modelManager, mergeMode) {
        const subDoc = modelManager.model.mainSubDocument;
        const position = subDoc.getDocumentEndPosition() - 1;
        const firstRun = subDoc.getRunByPosition(0);
        const characterStyle = firstRun.characterStyle;
        const maskedCharacterProperties = firstRun.maskedCharacterProperties.clone();
        const maskedCharacterPropertiesBundle = new MaskedCharacterPropertiesBundle(maskedCharacterProperties, characterStyle);
        switch (mergeMode) {
            case MergeMode.NewParagraph:
                modelManager.modelManipulator.paragraph.insertParagraphViaHistory(new InsertParagraphManipulatorParams(new SubDocumentPosition(subDoc, position), maskedCharacterPropertiesBundle));
                break;
            case MergeMode.NewSection:
                modelManager.modelManipulator.section.insertSectionAndSetStartType(position, SectionStartType.NextPage, maskedCharacterPropertiesBundle);
                break;
        }
    }
    createModelManager(model) {
        return new ClientModelManager(model, this.control.modelManager.richOptions, new EmptyBatchUpdatableObject());
    }
}
export class MailMergeCommandParameters {
    constructor(callback, mergeMode, documentFormat, exportFrom, exportRecordsCount) {
        this.callback = callback;
        this.mergeMode = mergeMode;
        this.documentFormat = documentFormat;
        this.exportFrom = exportFrom ? exportFrom : 0;
        this.exportRecordsCount = exportRecordsCount ? exportRecordsCount : Infinity;
    }
}
