import { HistoryRun, HistoryRunFieldCodeEnd, HistoryRunFieldCodeStart, HistoryRunFieldResultEnd, HistoryRunInlinePicture, HistoryRunParagraph } from '../../core/model/character/history-runs';
import { ImageLoadingOptions } from '../../core/model/manipulators/picture-manipulator/loader/image-loading-options';
import { NumberingFormat } from '../../core/model/numbering-lists/list-level-properties';
import { AbstractNumberingList, NumberingList, NumberingType } from '../../core/model/numbering-lists/numbering-list';
import { ControlOptions } from '../../core/model/options/control';
import { RichUtils } from '../../core/model/rich-utils';
import { RunType } from '../../core/model/runs/run-type';
import { SubDocumentInterval } from '../../core/model/sub-document';
import { MaskedCharacterPropertiesBundle, MaskedParagraphPropertiesBundleFull, ParagraphListInfo } from '../../core/rich-utils/properties-bundle';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { PasteHtmlDataHistoryItem } from '../model/history/paste-html-data-history-item';
export class HtmlModelInserter {
    constructor(modelManager, subDocPos, htmlData, charPropsBundle) {
        this.pastedListsIndices = {};
        this.fieldsMap = {};
        this.tableInfo = [];
        this.historyRuns = [];
        this.modelManager = modelManager;
        this.subDocPos = subDocPos;
        this.htmlData = htmlData;
        this.defaultMaskedParProps = this.subDocument.documentModel.defaultParagraphProperties.clone();
        this.defaultMaskedParProps.useValue = 0;
        this.defaultMaskedCharProps = this.subDocument.documentModel.defaultCharacterProperties.clone();
        this.defaultMaskedCharProps.resetAllUse();
        this.charPropsBundle = new MaskedCharacterPropertiesBundle(ControlOptions.isEnabled(this.options.characterFormatting) ?
            charPropsBundle.props :
            this.defaultMaskedCharProps.clone(), charPropsBundle.style);
        this.position = subDocPos.position;
        this.tableInfo = ControlOptions.isEnabled(this.options.tables) ? htmlData.tablesInfo : [];
        if (!HtmlModelInserter.runConverterMap) {
            HtmlModelInserter.runConverterMap = {};
            HtmlModelInserter.runConverterMap[RunType.TextRun] = this.convertTextRun;
            HtmlModelInserter.runConverterMap[RunType.InlinePictureRun] = this.convertInlinePictureRun;
            HtmlModelInserter.runConverterMap[RunType.ParagraphRun] = this.convertParagraphRun;
            HtmlModelInserter.runConverterMap[RunType.FieldCodeStartRun] = this.convertFieldCodeStartRun;
            HtmlModelInserter.runConverterMap[RunType.FieldCodeEndRun] = this.convertFieldCodeEndRun;
            HtmlModelInserter.runConverterMap[RunType.FieldResultEndRun] = this.convertFieldResultEndRun;
        }
    }
    get options() { return this.modelManager.richOptions.control; }
    ;
    get subDocument() { return this.subDocPos.subDocument; }
    ;
    insert() {
        for (let runInfo of this.htmlData.runsInfo)
            this.position += HtmlModelInserter.runConverterMap[runInfo.runType].call(this, runInfo);
        const intervalToPasteIn = FixedInterval.fromPositions(this.subDocPos.position, this.position);
        this.modelManager.history.addTransaction(() => {
            this.modelManager.history.addAndRedo(new PasteHtmlDataHistoryItem(this.modelManager.modelManipulator, new SubDocumentInterval(this.subDocPos.subDocument, intervalToPasteIn), this.historyRuns, this.tableInfo, this.charPropsBundle));
        });
        return FixedInterval.fromPositions(this.subDocPos.position, this.position);
    }
    convertTextRun(run) {
        let text = run.text;
        if (!ControlOptions.isEnabled(this.options.tabSymbol))
            text = text.replace(/\t/gi, " ");
        if (this.options.tabMarker !== RichUtils.specialCharacters.TabMark)
            text = text.replace(/\t/gi, this.options.tabMarker);
        this.historyRuns.push(new HistoryRun(RunType.TextRun, run.charPropsBundle, this.position, text));
        return text.length;
    }
    convertInlinePictureRun(run) {
        if (!ControlOptions.isEnabled(this.options.inlinePictures))
            return 0;
        this.historyRuns.push(new HistoryRunInlinePicture(this.position, run.charPropsBundle, run.picInfo, ImageLoadingOptions.initByActualSize(run.actualSize)));
        return run.runLength;
    }
    convertParagraphRun(run) {
        if (!ControlOptions.isEnabled(this.options.paragraphs))
            return 0;
        const listInfo = this.insertListInfo(run.listInfo);
        const maskedParagraphProperties = ControlOptions.isEnabled(this.options.paragraphFormatting) ?
            run.maskedParagraphProperties :
            this.defaultMaskedParProps.clone();
        this.historyRuns.push(new HistoryRunParagraph(run.runType, run.charPropsBundle, new MaskedParagraphPropertiesBundleFull(maskedParagraphProperties, undefined, listInfo, run.tabs), this.position, RichUtils.specialCharacters.ParagraphMark, true));
        return 1;
    }
    convertFieldCodeStartRun(run) {
        const hyperlinkInfo = run.hyperlinkInfo;
        if (!ControlOptions.isEnabled(this.options.fields) || (hyperlinkInfo && !ControlOptions.isEnabled(this.options.hyperlinks)))
            return 0;
        const historyRun = new HistoryRunFieldCodeStart(run.runType, run.charPropsBundle, this.position, RichUtils.specialCharacters.FieldCodeStartRun, false, this.position, undefined, undefined, hyperlinkInfo);
        this.fieldsMap[run.id] = historyRun;
        this.historyRuns.push(historyRun);
        return 1;
    }
    convertFieldCodeEndRun(run) {
        const histRun = this.fieldsMap[run.id];
        if (!histRun)
            return 0;
        this.historyRuns.push(new HistoryRunFieldCodeEnd(run.runType, run.charPropsBundle, this.position, RichUtils.specialCharacters.FieldCodeEndRun));
        histRun.separatorPosition = this.position;
        return 1;
    }
    convertFieldResultEndRun(run) {
        const histRun = this.fieldsMap[run.id];
        if (!histRun)
            return 0;
        this.historyRuns.push(new HistoryRunFieldResultEnd(run.runType, run.charPropsBundle, this.position, RichUtils.specialCharacters.FieldResultEndRun));
        histRun.endPosition = this.position + 1;
        delete this.fieldsMap[run.id];
        return 1;
    }
    insertListInfo(listInfo) {
        const model = this.subDocument.documentModel;
        const modelManipulator = this.modelManager.modelManipulator;
        if (!listInfo ||
            !ControlOptions.isEnabled(this.options.numberingBulleted) &&
                !ControlOptions.isEnabled(this.options.numberingMultiLevel) &&
                !ControlOptions.isEnabled(this.options.numberingSimple))
            return ParagraphListInfo.default;
        if (!ControlOptions.isEnabled(this.options.numberingBulleted) && listInfo.listType === NumberingType.Bullet) {
            var isNumberingSimpleEnabled = ControlOptions.isEnabled(this.options.numberingSimple);
            listInfo.listType = isNumberingSimpleEnabled ? NumberingType.Simple : NumberingType.MultiLevel;
            listInfo.listFormat = NumberingFormat.Decimal;
            listInfo.displayFormatString = "";
        }
        if (!ControlOptions.isEnabled(this.options.numberingSimple) && listInfo.listType === NumberingType.Simple) {
            listInfo.listType = ControlOptions.isEnabled(this.options.numberingBulleted) ? NumberingType.Bullet : NumberingType.MultiLevel;
            listInfo.displayFormatString = "";
        }
        if (!ControlOptions.isEnabled(this.options.numberingMultiLevel) && listInfo.listType === NumberingType.MultiLevel) {
            listInfo.listType = ControlOptions.isEnabled(this.options.numberingBulleted) ? NumberingType.Bullet : NumberingType.Simple;
            listInfo.displayFormatString = "";
        }
        let targetListIndex = this.pastedListsIndices[listInfo.listIndex];
        if (targetListIndex === undefined) {
            const abstractNumberingList = new AbstractNumberingList(model);
            const template = ListUtils.elementBy(model.abstractNumberingListTemplates, (tmpl) => tmpl.getListType() === listInfo.listType);
            if (template) {
                abstractNumberingList.copyFrom(template);
                const numberingList = new NumberingList(model, modelManipulator.numberingList.addAbstractNumberingList(abstractNumberingList));
                targetListIndex = modelManipulator.numberingList.addNumberingList(numberingList);
                this.pastedListsIndices[listInfo.listIndex] = targetListIndex;
            }
        }
        if (targetListIndex === undefined)
            return ParagraphListInfo.default;
        const numberingListIndex = targetListIndex;
        const listLevelIndex = listInfo.listLevel;
        const listLevel = model.numberingLists[numberingListIndex].levels[listLevelIndex];
        modelManipulator.numberingList.listLevelProperties.format.setValue(model, false, targetListIndex, listLevelIndex, listInfo.listFormat);
        if (listInfo.displayFormatString) {
            modelManipulator.numberingList.listLevelProperties.displayFormatString.setValue(model, false, targetListIndex, listLevelIndex, listInfo.displayFormatString);
        }
        if (listInfo.maskedCharacterProperties) {
            listLevel.setCharacterProperties(listInfo.maskedCharacterProperties);
            listLevel.onCharacterPropertiesChanged();
        }
        return new ParagraphListInfo(numberingListIndex, listLevelIndex);
    }
}
