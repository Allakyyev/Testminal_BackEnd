import { NumberingListIndexConstants } from '../../../core/formats/utils/numbering-list-index-constants';
import { TabLeaderType } from '../../../core/layout/main-structures/layout-boxes/layout-tab-space-box';
import { BorderLineStyle } from '../../../core/model/borders/enums';
import { NumberingList } from '../../../core/model/numbering-lists/numbering-list';
import { TabAlign } from '../../../core/model/paragraph/paragraph';
import { ParagraphAlignment, ParagraphFirstLineIndent, ParagraphLineSpacingType } from '../../../core/model/paragraph/paragraph-properties';
import { ParagraphStyle } from '../../../core/model/paragraph/paragraph-style';
import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
import { RtfExportSR } from '../../translation-table/rtf-export-sr';
import { RtfShadingInfoExportHelper } from '../helpers/rtf-shading-info-export-helper';
import { RtfPropertiesExporter } from './rtf-properties-exporter';
export class RtfParagraphPropertiesExporter extends RtfPropertiesExporter {
    constructor() {
        super(...arguments);
        this.defaultParagraphFirstLineIndent = 0;
        this.defaultParagraphLeftIndent = 0;
        this.defaultParagraphRightIndent = 0;
        this.defaultSuppressHyphenation = false;
        this.defaultPageBreakBefore = false;
        this.defaultBeforeAutoSpacing = false;
        this.defaultAfterAutoSpacing = false;
        this.defaultKeepWithNext = false;
        this.defaultKeepLinesTogether = false;
        this.defaultWidowOrphanControl = true;
        this.doubleIntervalRtfLineSpacingValue = 480;
        this.sesquialteralIntervalRtfLineSpacingValue = 360;
        this.singleIntervalRtfLineSpacingValue = 240;
        this.atLeastLineSpacingMultiple = 0;
        this.exactlyLineSpacingMultiple = 0;
        this.multipleLineSpacing = 1;
        this.defaultParagraphSpacingBefore = 0;
        this.defaultParagraphSpacingAfter = 0;
    }
    exportParagraphProperties(paragraph, tableNestingLevel) {
        if (paragraph.isInList())
            this.exportParagraphNumberingProperties(paragraph);
        if (paragraph.paragraphStyle && paragraph.paragraphStyle.styleName != ParagraphStyle.normalStyleName)
            this.writeParagraphStyle(paragraph.paragraphStyle);
        const properties = paragraph.getParagraphMergedProperties();
        if (properties.topBorder.style != BorderLineStyle.None)
            this.writeParagraphBorder(properties.topBorder, RtfExportSR.TopParagraphBorder);
        if (properties.leftBorder.style != BorderLineStyle.None)
            this.writeParagraphBorder(properties.leftBorder, RtfExportSR.LeftParagraphBorder);
        if (properties.bottomBorder.style != BorderLineStyle.None)
            this.writeParagraphBorder(properties.bottomBorder, RtfExportSR.BottomParagraphBorder);
        if (properties.rightBorder.style != BorderLineStyle.None)
            this.writeParagraphBorder(properties.rightBorder, RtfExportSR.RightParagraphBorder);
        if (properties.betweenBorder.style != BorderLineStyle.None)
            this.writeParagraphBorder(properties.betweenBorder, RtfExportSR.BetweenParagraphBorder);
        this.writeParagraphAlignment(this.getActualAlignment(properties));
        this.writeParagraphTableProperties(paragraph, tableNestingLevel);
        this.writeParagraphGroupPropertiesId(paragraph);
        this.writeParagraphIndents(paragraph.getParagraphMergedProperties());
        this.writeParagraphSuppressHyphenation(properties.suppressHyphenation);
        this.writeParagraphSuppressLineNumbers(properties.suppressLineNumbers);
        this.writeParagraphContextualSpacing(properties.contextualSpacing);
        this.writeParagraphPageBreakBefore(properties.pageBreakBefore);
        this.writeParagraphBeforeAutoSpacing(properties.beforeAutoSpacing);
        this.writeParagraphAfterAutoSpacing(properties.afterAutoSpacing);
        this.writeParagraphKeepWithNext(properties.keepWithNext);
        this.writeParagraphKeepLinesTogether(properties.keepLinesTogether);
        this.writeParagraphWidowOrphanControl(properties.widowOrphanControl);
        this.writeParagraphOutlineLevel(properties.outlineLevel);
        this.writeParagraphShading(properties.shadingInfo);
        this.writeParagraphLineSpacing(properties.lineSpacingType, properties.lineSpacing);
        this.writeParagraphSpacingBefore(properties.spacingBefore);
        this.writeParagraphSpacingAfter(properties.spacingAfter);
        this.writeTabs(paragraph.tabs);
    }
    exportParagraphPropertiesCore(properties, checkDefaultAlignment = false) {
        if (properties.topBorder.style != BorderLineStyle.None)
            this.writeParagraphBorder(properties.topBorder, RtfExportSR.TopParagraphBorder);
        if (properties.leftBorder.style != BorderLineStyle.None)
            this.writeParagraphBorder(properties.leftBorder, RtfExportSR.LeftParagraphBorder);
        if (properties.bottomBorder.style != BorderLineStyle.None)
            this.writeParagraphBorder(properties.bottomBorder, RtfExportSR.BottomParagraphBorder);
        if (properties.rightBorder.style != BorderLineStyle.None)
            this.writeParagraphBorder(properties.rightBorder, RtfExportSR.RightParagraphBorder);
        if (properties.betweenBorder.style != BorderLineStyle.None)
            this.writeParagraphBorder(properties.betweenBorder, RtfExportSR.BetweenParagraphBorder);
        if (!checkDefaultAlignment || !this.isDefaultAlignment(properties))
            this.writeParagraphAlignment(this.getActualAlignment(properties));
        this.writeParagraphIndents(properties);
        this.writeParagraphSuppressHyphenation(properties.suppressHyphenation);
        this.writeParagraphSuppressLineNumbers(properties.suppressLineNumbers);
        this.writeParagraphContextualSpacing(properties.contextualSpacing);
        this.writeParagraphPageBreakBefore(properties.pageBreakBefore);
        this.writeParagraphBeforeAutoSpacing(properties.beforeAutoSpacing);
        this.writeParagraphAfterAutoSpacing(properties.afterAutoSpacing);
        this.writeParagraphKeepWithNext(properties.keepWithNext);
        this.writeParagraphKeepLinesTogether(properties.keepLinesTogether);
        this.writeParagraphWidowOrphanControl(properties.widowOrphanControl);
        this.writeParagraphOutlineLevel(properties.outlineLevel);
        this.writeParagraphShading(properties.shadingInfo);
        this.writeParagraphLineSpacing(properties.lineSpacingType, properties.lineSpacing);
        this.writeParagraphSpacingBefore(properties.spacingBefore);
        this.writeParagraphSpacingAfter(properties.spacingAfter);
    }
    isDefaultAlignment(properties) {
        if (properties.rightToLeft)
            return properties.alignment == ParagraphAlignment.Right;
        else
            return properties.alignment == ParagraphAlignment.Left;
    }
    getActualAlignment(properties) {
        if (properties.rightToLeft) {
            if (properties.alignment == ParagraphAlignment.Left)
                return ParagraphAlignment.Right;
            if (properties.alignment == ParagraphAlignment.Right)
                return ParagraphAlignment.Left;
        }
        return properties.alignment;
    }
    exportParagraphNumberingProperties(paragraph) {
        if (!this.shouldExportParagraphNumbering(paragraph.numberingListIndex, paragraph.listLevelIndex))
            return;
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.LevelIndex, paragraph.getListLevelIndex());
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.ListIndex, this.documentModel.numberingLists[paragraph.getNumberingListIndex()].getId());
    }
    shouldExportParagraphNumbering(numberingListId, listLevelIndex = 1) {
        return numberingListId == NumberingList.NoNumberingListIndex ||
            numberingListId >= NumberingListIndexConstants.minValue || listLevelIndex > 0;
    }
    writeParagraphStyle(paragraphStyle) {
        const styleName = paragraphStyle.styleName;
        const styleCollection = this.rtfExportHelper.paragraphStylesCollectionIndex;
        if (StringMapUtils.containsBy(styleCollection, (_val, key) => key == styleName))
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ParagraphStyle, styleCollection[styleName]);
    }
    writeParagraphBorder(topBorder, command) {
        const defaultBorder = this.documentModel.defaultTableProperties.borders.topBorder;
        if (!defaultBorder.equals(topBorder)) {
            this.rtfBuilder.writeCommand(command);
            this.writeBorderProperties(topBorder);
        }
    }
    writeParagraphAlignment(alignment) {
        switch (alignment) {
            case ParagraphAlignment.Left:
                this.rtfBuilder.writeCommand(RtfExportSR.LeftAlignment);
                break;
            case ParagraphAlignment.Center:
                this.rtfBuilder.writeCommand(RtfExportSR.CenterAlignment);
                break;
            case ParagraphAlignment.Justify:
                this.rtfBuilder.writeCommand(RtfExportSR.JustifyAlignment);
                break;
            case ParagraphAlignment.Right:
                this.rtfBuilder.writeCommand(RtfExportSR.RightAlignment);
                break;
        }
    }
    writeParagraphTableProperties(_paragraph, nestingLevel) {
        if (nestingLevel > 0)
            this.rtfBuilder.writeCommand(RtfExportSR.InTableParagraph);
        if (nestingLevel > 1)
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ParagraphNestingLevel, nestingLevel);
    }
    writeParagraphGroupPropertiesId(_paragraph) {
        if (this.documentModel.webSettings.isBodyMarginsSet())
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ParagraphGroupPropertiesId, 1);
    }
    writeParagraphIndents(mergedParagraphProperties) {
        const firstLineIndent = this.calcRtfFirstLineIndent(mergedParagraphProperties.firstLineIndentType, mergedParagraphProperties.firstLineIndent);
        if (firstLineIndent != this.defaultParagraphFirstLineIndent)
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.FirstLineIndentInTwips, firstLineIndent);
        const leftIndent = this.calcRtfLeftIndent(mergedParagraphProperties.firstLineIndentType, mergedParagraphProperties.firstLineIndent, mergedParagraphProperties.leftIndent);
        if (leftIndent != this.defaultParagraphLeftIndent) {
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.LeftIndentInTwips, leftIndent);
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.LeftIndentInTwips_Lin, leftIndent);
        }
        const rightIndent = mergedParagraphProperties.rightIndent;
        if (rightIndent != this.defaultParagraphRightIndent) {
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.RightIndentInTwips, rightIndent);
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.RightIndentInTwips_Rin, rightIndent);
        }
    }
    calcRtfFirstLineIndent(firstLineIndentType, firstLineIndent) {
        switch (firstLineIndentType) {
            case ParagraphFirstLineIndent.Indented:
                return firstLineIndent;
            case ParagraphFirstLineIndent.Hanging:
                return -firstLineIndent;
            case ParagraphFirstLineIndent.None:
            default:
                return 0;
        }
    }
    calcRtfLeftIndent(_firstLineIndentType, _firstLineIndent, leftIndent) {
        return leftIndent;
    }
    writeParagraphSuppressHyphenation(paragraphSuppressHyphenation) {
        if (paragraphSuppressHyphenation == this.defaultSuppressHyphenation)
            return;
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.AutomaticParagraphHyphenation, paragraphSuppressHyphenation ? 0 : 1);
    }
    writeParagraphSuppressLineNumbers(paragraphSuppressLineNumbers) {
        if (paragraphSuppressLineNumbers)
            this.rtfBuilder.writeCommand(RtfExportSR.SuppressLineNumbering);
    }
    writeParagraphContextualSpacing(value) {
        if (value)
            this.rtfBuilder.writeCommand(RtfExportSR.ContextualSpacing);
    }
    writeParagraphPageBreakBefore(value) {
        if (value == this.defaultPageBreakBefore)
            return;
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.PageBreakBefore, value ? 1 : 0);
    }
    writeParagraphBeforeAutoSpacing(value) {
        if (value == this.defaultBeforeAutoSpacing)
            return;
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.BeforeAutoSpacing, value ? 1 : 0);
    }
    writeParagraphAfterAutoSpacing(value) {
        if (value == this.defaultAfterAutoSpacing)
            return;
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.AfterAutoSpacing, value ? 1 : 0);
    }
    writeParagraphKeepWithNext(value) {
        if (value == this.defaultKeepWithNext)
            return;
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.KeepWithNext, value ? 1 : 0);
    }
    writeParagraphKeepLinesTogether(value) {
        if (value == this.defaultKeepLinesTogether)
            return;
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.KeepLinesTogether, value ? 1 : 0);
    }
    writeParagraphWidowOrphanControl(value) {
        if (value == this.defaultWidowOrphanControl)
            return;
        if (value)
            this.rtfBuilder.writeCommand(RtfExportSR.WidowOrphanControlOn);
        else
            this.rtfBuilder.writeCommand(RtfExportSR.WidowOrphanControlOff);
    }
    writeParagraphOutlineLevel(outlineLevel) {
        if (outlineLevel < 0 || outlineLevel >= 10)
            return;
        if (outlineLevel > 0)
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.OutlineLevel, outlineLevel - 1);
    }
    writeParagraphLineSpacing(paragraphLineSpacingType, paragraphLineSpacing) {
        switch (paragraphLineSpacingType) {
            case ParagraphLineSpacingType.AtLeast:
                this.writeRtfLineSpacing(paragraphLineSpacing, this.atLeastLineSpacingMultiple);
                break;
            case ParagraphLineSpacingType.Exactly:
                this.writeRtfLineSpacing(-paragraphLineSpacing, this.exactlyLineSpacingMultiple);
                break;
            case ParagraphLineSpacingType.Double:
                this.writeRtfLineSpacing(this.doubleIntervalRtfLineSpacingValue, this.multipleLineSpacing);
                break;
            case ParagraphLineSpacingType.Sesquialteral:
                this.writeRtfLineSpacing(this.sesquialteralIntervalRtfLineSpacingValue, this.multipleLineSpacing);
                break;
            case ParagraphLineSpacingType.Multiple:
                this.writeRtfLineSpacing((paragraphLineSpacing * this.singleIntervalRtfLineSpacingValue), this.multipleLineSpacing);
                break;
        }
    }
    writeRtfLineSpacing(rtfLineSpacingValue, rtfLineSpacingMultiple) {
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.RtfLineSpacingValue, rtfLineSpacingValue);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.RtfLineSpacingMultiple, rtfLineSpacingMultiple);
    }
    writeParagraphSpacingBefore(spacingBefore) {
        if (spacingBefore == this.defaultParagraphSpacingBefore)
            return;
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.SpaceBefore, spacingBefore);
    }
    writeParagraphSpacingAfter(spacingAfter) {
        if (spacingAfter == this.defaultParagraphSpacingAfter)
            return;
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.SpaceAfter, spacingAfter);
    }
    writeTabs(tabFormattingInfo) {
        const count = tabFormattingInfo.tabsInfo.length;
        for (let i = 0; i < count; i++)
            this.writeTabInfo(tabFormattingInfo.tabsInfo[i]);
    }
    writeTabInfo(tabInfo) {
        this.writeTabKind(tabInfo.alignment);
        this.writeTabLeader(tabInfo.leader);
        this.writeTabPosition(tabInfo.position);
    }
    writeTabKind(alignmentType) {
        switch (alignmentType) {
            case TabAlign.Center:
                this.rtfBuilder.writeCommand(RtfExportSR.CenteredTab);
                break;
            case TabAlign.Decimal:
                this.rtfBuilder.writeCommand(RtfExportSR.DecimalTab);
                break;
            case TabAlign.Right:
                this.rtfBuilder.writeCommand(RtfExportSR.FlushRightTab);
                break;
            case TabAlign.Numbering:
                this.rtfBuilder.writeCommand(RtfExportSR.NumberingTab);
                break;
            case TabAlign.Left:
                break;
        }
    }
    writeTabLeader(leaderType) {
        switch (leaderType) {
            case TabLeaderType.Dots:
                this.rtfBuilder.writeCommand(RtfExportSR.TabLeaderDots);
                break;
            case TabLeaderType.EqualSign:
                this.rtfBuilder.writeCommand(RtfExportSR.TabLeaderEqualSign);
                break;
            case TabLeaderType.Hyphens:
                this.rtfBuilder.writeCommand(RtfExportSR.TabLeaderHyphens);
                break;
            case TabLeaderType.MiddleDots:
                this.rtfBuilder.writeCommand(RtfExportSR.TabLeaderMiddleDots);
                break;
            case TabLeaderType.ThickLine:
                this.rtfBuilder.writeCommand(RtfExportSR.TabLeaderThickLine);
                break;
            case TabLeaderType.Underline:
                this.rtfBuilder.writeCommand(RtfExportSR.TabLeaderUnderline);
                break;
            case TabLeaderType.None:
                break;
        }
    }
    writeTabPosition(position) {
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.TabPosition, position);
    }
    writeParagraphShading(shadingInfo) {
        RtfShadingInfoExportHelper.exportShadingPattern(this.rtfBuilder, this.documentModel.colorProvider, shadingInfo, RtfExportSR.ParagraphShading);
        const shadingPatternKeyword = RtfExportSR.RunShadingPatternTable[shadingInfo.shadingPattern];
        if (RtfExportSR.ShadingPatternTable[shadingPatternKeyword])
            this.rtfBuilder.writeCommand(shadingPatternKeyword);
        RtfShadingInfoExportHelper.exportShadingForeColorIndex(this.rtfBuilder, this.rtfExportHelper, this.documentModel.colorProvider, shadingInfo, RtfExportSR.ParagraphFillColor);
        RtfShadingInfoExportHelper.exportShadingBackColorIndex(this.rtfBuilder, this.rtfExportHelper, this.documentModel.colorProvider, shadingInfo, RtfExportSR.ParagraphBackgroundColor);
    }
}
