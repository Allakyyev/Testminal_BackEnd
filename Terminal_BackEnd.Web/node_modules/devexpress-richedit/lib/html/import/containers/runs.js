import { MeasureInfoNonText } from '../../../core/measurer/measure-info';
import { CharacterPropertiesMerger } from '../../../core/model/properties-merger/character-properties-merger';
import { RichUtils } from '../../../core/model/rich-utils';
import { RunType } from '../../../core/model/runs/run-type';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
export class RunInfo {
    constructor(runType, runLength, charPropsBundle) {
        this.runType = runType;
        this.runLength = runLength;
        this.charPropsBundle = charPropsBundle;
    }
}
export class ImportedTextRunInfo extends RunInfo {
    constructor(model, measurer, text, charPropsBundle) {
        super(RunType.TextRun, text.length, charPropsBundle);
        this.text = this.replaceTabs(text, model, measurer, charPropsBundle.props);
        this.runLength = this.text.length;
    }
    replaceTabs(text, model, measurer, maskedCharacterProperties) {
        return text.replace(ImportedTextRunInfo.tabRegex, (str, _offset) => {
            const len = str.length;
            return len < 3 ?
                StringUtils.repeat(RichUtils.specialCharacters.Space, len) :
                StringUtils.repeat(RichUtils.specialCharacters.TabMark, this.numTabs(len, this.mergeCharProps(maskedCharacterProperties, model), measurer, model.defaultTabWidth));
        });
    }
    mergeCharProps(masked, model) {
        const merger = new CharacterPropertiesMerger();
        merger.mergeCharacterProperties(masked);
        merger.mergeCharacterProperties(model.defaultCharacterProperties);
        return merger.getMergedProperties();
    }
    numTabs(numSpaces, charProps, measurer, defaultTabInfo) {
        const spaces = StringUtils.repeat("&nbsp;", numSpaces);
        const info = new MeasureInfoNonText(spaces, charProps);
        measurer.measure([info]);
        return Math.max(1, Math.round(info.resultSize.width / UnitConverter.twipsToPixelsF(defaultTabInfo)));
    }
}
ImportedTextRunInfo.tabRegex = new RegExp(RichUtils.specialCharacters.NonBreakingSpace + "{1,}", "gi");
export class ImportedParagraphListInfo {
    constructor(listIndex, listLevel, listFormat, listType, displayFormatString, maskedCharacterProperties) {
        this.listIndex = listIndex;
        this.listLevel = listLevel;
        this.listFormat = listFormat;
        this.listType = listType;
        this.displayFormatString = displayFormatString;
        this.maskedCharacterProperties = maskedCharacterProperties;
    }
}
export class ImportedParagraphRunInfo extends RunInfo {
    constructor(listInfo, charPropsBundle, maskedParagraphProperties, tabs) {
        super(RunType.ParagraphRun, RichUtils.specialCharacters.ParagraphMark.length, charPropsBundle);
        this.listInfo = listInfo;
        this.maskedParagraphProperties = maskedParagraphProperties;
        this.tabs = tabs;
    }
}
export class ImportedInlinePictureRunInfo extends RunInfo {
    constructor(charPropsBundle, picInfo, actualSize) {
        super(RunType.InlinePictureRun, 1, charPropsBundle);
        this.picInfo = picInfo;
        this.actualSize = actualSize;
    }
}
export class ImportedFieldCodeStartRunInfo extends RunInfo {
    constructor(charPropsBundle, hyperlinkInfo, id) {
        super(RunType.FieldCodeStartRun, RichUtils.specialCharacters.FieldCodeStartRun.length, charPropsBundle);
        this.hyperlinkInfo = hyperlinkInfo;
        this.id = id;
    }
}
export class ImportedFieldCodeEndRunInfo extends RunInfo {
    constructor(charPropsBundle, id) {
        super(RunType.FieldCodeEndRun, RichUtils.specialCharacters.FieldCodeEndRun.length, charPropsBundle);
        this.id = id;
    }
}
export class ImportedFieldResultEndRunInfo extends RunInfo {
    constructor(charPropsBundle, id) {
        super(RunType.FieldResultEndRun, RichUtils.specialCharacters.FieldResultEndRun.length, charPropsBundle);
        this.id = id;
    }
}
