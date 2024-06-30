import { MapCreator } from '../../../base-utils/map-creator';
import { RtfDrawingKeywords } from '../../translation-table/rtf-drawing-keywords';
import { DestinationBase } from '../destination/base/destination';
import { StringValueDestinationBase } from '../destination/base/string-value-destination-base';
import { UnicodeDestination } from '../destination/base/unicode-destination';
import { CustomPropertiesDestination } from '../destination/custom-properties-destination';
import { FieldDestination } from '../destination/fields/field-destination';
import { FieldMapDataDestination } from '../destination/fields/field-map-data-destination';
import { FormFieldDestination } from '../destination/fields/form-field-destination';
import { MailMergeDestination } from '../destination/fields/mail-merge-destination';
import { InfoDestination } from '../destination/info/info-destination';
import { ListLevelDestination } from '../destination/numbering-list/list-level-destination';
import { ListLevelTextDestination } from '../destination/numbering-list/list-level-text-destination';
import { ListOverrideLevelDestination } from '../destination/numbering-list/list-override-level-destination';
import { ListOverrideTableDestination } from '../destination/numbering-list/list-override-table-destination';
import { ListTableDestination } from '../destination/numbering-list/list-table-destination';
import { PictureDestination } from '../destination/picture/picture-destination';
import { HyperlinkLocationValueDestination } from '../destination/shape/hyperlink-location-value-destination';
import { HyperlinkSourceValueDestination } from '../destination/shape/hyperlink-source-value-destination';
import { ShapePictureDestination } from '../destination/shape/pic/shape-picture-destination';
import { ShapeDestinationBase } from '../destination/shape/shape-destination-base';
import { ShapeInstanceDestination } from '../destination/shape/shape-instance-destination';
import { ShapePropertyHsvValueDestination } from '../destination/shape/shape-property-hsv-value-destination';
import { ShapePropertyHyperlinkDestination } from '../destination/shape/shape-property-hyperlink-destination';
import { ShapePropertyNameDestination } from '../destination/shape/shape-property-name-destination';
import { ShapePropertyValueDestination } from '../destination/shape/shape-property-value-destination';
import { CharacterStyleDestination } from '../destination/styles/character-style-destination';
import { StyleSheetDestination } from '../destination/styles/style-sheet-destination';
import { TableStyleDestination } from '../destination/styles/table-style-destination';
import { SkipNestedTableDestination } from '../destination/table/skip-nested-table-destination';
import { DestinationType } from '../destination/utils/destination-type';
import { characterPropertiesKeywords } from './character-properties';
import { keywordHtDefault } from './default-keywords';
import { documentPropertiesKeywords } from './document-properties';
import { paragraphNumberingDescKeywords } from './paragraph-numbering-desc-keywords';
import { addParagraphPropertiesKeywords } from './paragraph-properties';
import { shapePropertiesDestinationBaseKeywords } from './shape-properties-destination-base-keywords';
import { defaultDestinationKeywordHT } from './sub-document/default-destination-keywords';
import { addCommonCharacterKeywords, addCommonNumberingListsKeywords, addCommonParagraphKeywords, addCommonSymbolsAndObjectsKeywords, addCommonTabKeywords, subDocumentKeyword } from './sub-document/sub-document-keywords';
import { appendTableKeywords, appendTablePropertiesKeywords } from './sub-document/table-keywords';
export class KeywordTableHolder {
    constructor() {
        this.stringValueDestinationKeywordHT = new MapCreator()
            .add("u", StringValueDestinationBase.onUnicodeKeyword)
            .get();
        this.mapByDestinations = new MapCreator()
            .add(DestinationType.DestinationSubDocument, subDocumentKeyword)
            .add(DestinationType.SectionHeaderFooterDestinationBase, subDocumentKeyword)
            .add(DestinationType.SectionPageHeaderDestination, subDocumentKeyword)
            .add(DestinationType.SectionPageFooterDestination, subDocumentKeyword)
            .add(DestinationType.DefaultDestination, defaultDestinationKeywordHT)
            .add(DestinationType.FieldSubDestination, defaultDestinationKeywordHT)
            .add(DestinationType.CodeFieldDestination, defaultDestinationKeywordHT)
            .add(DestinationType.ResultFieldDestination, defaultDestinationKeywordHT)
            .add(DestinationType.TableContentFieldDestination, defaultDestinationKeywordHT)
            .add(DestinationType.FormFieldDestination, new MapCreator()
            .add("fftype", FormFieldDestination.onFormFieldTypeKeyword)
            .add("ffres", FormFieldDestination.onFormFieldListFieldResultKeyword)
            .add("ffprot", FormFieldDestination.onFormFieldProtectedKeyword)
            .add("ffsize", FormFieldDestination.onFormFieldCheckBoxFieldSizeTypeKeyword)
            .add("ffrecalc", FormFieldDestination.onFormFieldCalculatedOnExitKeyword)
            .add("ffhps", FormFieldDestination.onFormFieldCheckBoxFieldSizeKeyword)
            .add("ffname", FormFieldDestination.onFormFieldNameKeyword)
            .add("ffdefres", FormFieldDestination.onFormFieldListFieldDefaultKeyword)
            .add("ffownhelp", FormFieldDestination.onFormFieldHelpTextCustomKeyword)
            .add("ffhelptext", FormFieldDestination.onFormFieldHelpTextKeyword)
            .add("ffownstat", FormFieldDestination.onFormFieldStatusBarTextCustomKeyword)
            .add("ffstattext", FormFieldDestination.onFormFieldStatusBarTextKeyword)
            .add("ffentrymcr", FormFieldDestination.onFormFieldEntryMacroKeyword)
            .add("ffexitmcr", FormFieldDestination.onFormFieldExitMacroKeyword)
            .get())
            .add(DestinationType.FieldDestination, new MapCreator()
            .add("fldinst", FieldDestination.onFieldInstructionStartKeyword)
            .add("fldrslt", FieldDestination.onFieldResultStartKeyword)
            .add("fldlock", FieldDestination.onFieldLockKeyword)
            .add("fldedit", FieldDestination.onFieldEditKeyword)
            .add("flddirty", FieldDestination.onFieldDirtyKeyword)
            .add("fldpriv", FieldDestination.onFieldPrivateKeyword)
            .add("dxfldcodeview", FieldDestination.onFieldCodeViewKeyword)
            .get())
            .add(DestinationType.SkipNestedTableDestination, new MapCreator()
            .add("par", SkipNestedTableDestination.onParKeyword)
            .get())
            .add(DestinationType.PictureDestination, new MapCreator()
            .add("emfblip", PictureDestination.onEmfFileKeyword)
            .add("pngblip", PictureDestination.onPngFileKeyword)
            .add("jpegblip", PictureDestination.onJpegFileKeyword)
            .add("macpict", PictureDestination.onMacFileKeyword)
            .add("wmetafile", PictureDestination.onWindowsMetafileKeyword)
            .add("dibitmap", PictureDestination.onDeviceIndependentBitmapFileKeyword)
            .add("wbitmap", PictureDestination.onDeviceDependentBitmapFileKeyword)
            .add("wbmbitspixel", PictureDestination.onBitmapBitsPerPixelKeyword)
            .add("wbmplanes", PictureDestination.onBitmapPlanesKeyword)
            .add("wbmwidthbytes", PictureDestination.onBitmapBytesInLineKeyword)
            .add("picw", PictureDestination.onPictureWidthKeyword)
            .add("pich", PictureDestination.onPictureHeightKeyword)
            .add("picwgoal", PictureDestination.onPictureGoalWidthKeyword)
            .add("pichgoal", PictureDestination.onPictureGoalHeightKeyword)
            .add("picscalex", PictureDestination.onHorizontalScalingKeyword)
            .add("picscaley", PictureDestination.onVerticalScalingKeyword)
            .add("picscaled", PictureDestination.onPicScaledKeyword)
            .add("piccropt", PictureDestination.onTopCropKeyword)
            .add("piccropb", PictureDestination.onBottomCropKeyword)
            .add("piccropr", PictureDestination.onRightCropKeyword)
            .add("piccropl", PictureDestination.onLeftCropKeyword)
            .add("picbmp", PictureDestination.onBitmapMetafileKeyword)
            .add("picbpp", PictureDestination.onBitsPerPixelBitmapMetafileKeyword)
            .add("dximageuri", PictureDestination.onDxImageUri)
            .add("picprop", PictureDestination.onShapePropertiesKeyword)
            .add("bliptag", PictureDestination.onBlipTag)
            .add("sp", PictureDestination.onShapePropertyKeyword)
            .get())
            .add(DestinationType.PageBackgroundDestination, new MapCreator()
            .add("shp", (data) => data.destination = new ShapeInstanceDestination(data))
            .get())
            .add(DestinationType.CustomPropertiesDestination, new MapCreator()
            .add("propname", CustomPropertiesDestination.onPropname)
            .add("proptype", CustomPropertiesDestination.onProptType)
            .add("linkval", CustomPropertiesDestination.onLinkval)
            .add("staticval", CustomPropertiesDestination.onStaticval)
            .get())
            .add(DestinationType.StyleSheetDestination, new MapCreator()
            .add("s", StyleSheetDestination.onParagraphStyle)
            .add("sqformat", StyleSheetDestination.onStyleQFormatKeyword)
            .add("sbasedon", StyleSheetDestination.onParentStyleIndex)
            .add("cs", StyleSheetDestination.onCharacterStyle)
            .add("ts", StyleSheetDestination.onTableStyle)
            .add("slink", StyleSheetDestination.onStyleLinkKeyword)
            .add("snext", StyleSheetDestination.onNextStyleIndex)
            .add("ls", StyleSheetDestination.onStyleListOverride)
            .add("ilvl", StyleSheetDestination.onStyleListLevel)
            .append(addParagraphPropertiesKeywords)
            .append(characterPropertiesKeywords)
            .append(addCommonTabKeywords)
            .get())
            .add(DestinationType.CharacterStyleDestination, new MapCreator()
            .add("sbasedon", CharacterStyleDestination.onParentStyleIndex)
            .add("slink", CharacterStyleDestination.onStyleLinkKeyword)
            .add("sqformat", CharacterStyleDestination.onStyleQFormatKeyword)
            .append(characterPropertiesKeywords)
            .get())
            .add(DestinationType.TableStyleDestination, new MapCreator()
            .add("sbasedon", TableStyleDestination.onParentStyleIndex)
            .add("sqformat", TableStyleDestination.onStyleQFormatKeyword)
            .add("tscfirstrow", TableStyleDestination.onConditionalStyleFirstRow)
            .add("tsclastrow", TableStyleDestination.onConditionalStyleLastRow)
            .add("tscfirstcol", TableStyleDestination.onConditionalStyleFirstColumn)
            .add("tsclastcol", TableStyleDestination.onConditionalStyleLastColumn)
            .add("tscbandhorzodd", TableStyleDestination.onConditionalStyleOddRowBanding)
            .add("tscbandhorzeven", TableStyleDestination.onConditionalStyleEvenRowBanding)
            .add("tscbandvertodd", TableStyleDestination.onConditionalStyleOddColumnBanding)
            .add("tscbandverteven", TableStyleDestination.onConditionalStyleEvenColumnBanding)
            .add("tscnwcell", TableStyleDestination.onConditionalStyleTopLeftCell)
            .add("tscnecell", TableStyleDestination.onConditionalStyleTopRightCell)
            .add("tscswcell", TableStyleDestination.onConditionalStyleBottomLeftCell)
            .add("tscsecell", TableStyleDestination.onConditionalStyleBottomRightCell)
            .append(characterPropertiesKeywords)
            .append(addParagraphPropertiesKeywords)
            .append(appendTablePropertiesKeywords)
            .get())
            .add(DestinationType.DefaultParagraphPropertiesDestination, addParagraphPropertiesKeywords)
            .add(DestinationType.DefaultCharacterPropertiesDestination, characterPropertiesKeywords)
            .add(DestinationType.ShapePropertyValueDestination, new MapCreator()
            .add("pict", (data) => data.destination = new PictureDestination(data))
            .add("hl", (data) => data.destination = new ShapePropertyHyperlinkDestination(data))
            .get())
            .add(DestinationType.ShapeTextDestination, new MapCreator()
            .append(addCommonCharacterKeywords)
            .append(addCommonParagraphKeywords)
            .append(addCommonSymbolsAndObjectsKeywords)
            .append(addCommonTabKeywords)
            .append(addCommonNumberingListsKeywords)
            .append(appendTableKeywords)
            .add("stylesheet", (data) => data.destination = new StyleSheetDestination(data))
            .get())
            .add(DestinationType.ShapePropertyHyperlinkDestination, new MapCreator()
            .add("hlloc", (data) => data.destination = new HyperlinkLocationValueDestination(data))
            .add("hlsrc", (data) => data.destination = new HyperlinkSourceValueDestination(data))
            .get())
            .add(DestinationType.ShapePropertyHsvValueDestination, new MapCreator()
            .add(RtfDrawingKeywords.Accent1, ShapePropertyHsvValueDestination.onAccentOneKeyword)
            .add(RtfDrawingKeywords.Accent2, ShapePropertyHsvValueDestination.onAccentTwoKeyword)
            .add(RtfDrawingKeywords.Accent3, ShapePropertyHsvValueDestination.onAccentThreeKeyword)
            .add(RtfDrawingKeywords.Accent4, ShapePropertyHsvValueDestination.onAccentFourKeyword)
            .add(RtfDrawingKeywords.Accent5, ShapePropertyHsvValueDestination.onAccentFiveKeyword)
            .add(RtfDrawingKeywords.Accent6, ShapePropertyHsvValueDestination.onAccentSixKeyword)
            .add(RtfDrawingKeywords.Tint, ShapePropertyHsvValueDestination.onTintKeyword)
            .add(RtfDrawingKeywords.Shade, ShapePropertyHsvValueDestination.onShadeKeyword)
            .get())
            .add(DestinationType.ShapePropertyDestination, new MapCreator()
            .add("bin", DestinationBase.onBinKeyword)
            .add("sn", (data) => data.destination = new ShapePropertyNameDestination(data))
            .add("sv", (data) => data.destination = new ShapePropertyValueDestination(data))
            .add("hsv", (data) => data.destination = new ShapePropertyHsvValueDestination(data))
            .get())
            .add(DestinationType.ShapePropertiesDestinationBase, shapePropertiesDestinationBaseKeywords)
            .add(DestinationType.ShapeInstanceDestination, shapePropertiesDestinationBaseKeywords)
            .add(DestinationType.ShapeDestination, new MapCreator()
            .append(shapePropertiesDestinationBaseKeywords)
            .add(RtfDrawingKeywords.ShapeInstance, ShapeDestinationBase.onShapeInstanceKeyword)
            .get())
            .add(DestinationType.ListTableDestination, new MapCreator()
            .add('list', ListTableDestination.onListKeyword)
            .add('listid', ListTableDestination.onListIdKeyword)
            .add('listtemplateid', ListTableDestination.onListTemplateIdKeyword)
            .add('liststyleid', ListTableDestination.onListStyleIdKeyword)
            .add('liststylename', ListTableDestination.onListStyleNameKeyword)
            .add('listname', ListTableDestination.onListNameKeyword)
            .add('listhybrid', ListTableDestination.onListHybridKeyword)
            .add('listrestarthdn', ListTableDestination.onListRestartAtEachSectionKeyword)
            .add('listsimple', ListTableDestination.onListSimpleKeyword)
            .add('listlevel', ListTableDestination.onListLevelKeyword)
            .get())
            .add(DestinationType.ListOverrideTableDestination, new MapCreator()
            .add("listoverride", ListOverrideTableDestination.onListOverrideKeyword)
            .add("listid", ListOverrideTableDestination.onListOverrideListIdKeyword)
            .add("listoverridecount", ListOverrideTableDestination.onListOverrideCountKeyword)
            .add("ls", ListOverrideTableDestination.onListOverrideIdKeyword)
            .add("lfolevel", ListOverrideTableDestination.onListOverrideLevelKeyword)
            .get())
            .add(DestinationType.ListOverrideLevelDestination, new MapCreator()
            .add("listoverrideformat", ListOverrideLevelDestination.onListOverrideFormatKeyword)
            .add("listoverridestartat", ListOverrideLevelDestination.onListOverrideStartAtKeyword)
            .add("levelstartat", ListOverrideLevelDestination.onListOverrideStartAtValueKeyword)
            .add("listlevel", ListOverrideLevelDestination.onListOverrideListLevelKeyword)
            .get())
            .add(DestinationType.ListLevelDestination, new MapCreator()
            .add("levelstartat", ListLevelDestination.onListLevelStartAtKeyword)
            .add("lvltentative", ListLevelDestination.onListLevelTentativeKeyword)
            .add("levelnfc", ListLevelDestination.onListLevelNumberingFormatKeyword)
            .add("leveljc", ListLevelDestination.onListLevelAlignmentKeyword)
            .add("levelnfcn", ListLevelDestination.onListLevelNumberingFormatKeyword)
            .add("leveljcn", ListLevelDestination.onListLevelAlignmentKeyword)
            .add("levelold", ListLevelDestination.onListLevelOldKeyword)
            .add("levelprev", ListLevelDestination.onListLevelPrevKeyword)
            .add("levelprevspace", ListLevelDestination.onListLevelPrevspaceKeyword)
            .add("levelindent", ListLevelDestination.onListLevelIndentKeyword)
            .add("levelspace", ListLevelDestination.onListLevelSpaceKeyword)
            .add("leveltext", ListLevelDestination.onListLevelTextKeyword)
            .add("levelnumbers", ListLevelDestination.onListLevelNumbersKeyword)
            .add("levelfollow", ListLevelDestination.onListLevelFollowKeyword)
            .add("levellegal", ListLevelDestination.onListLevelLegalKeyword)
            .add("levelnorestart", ListLevelDestination.onListLevelNoRestartKeyword)
            .add("levelpicture", ListLevelDestination.onListLevelPictureKeyword)
            .add("levelpicturenosize", ListLevelDestination.onListLevelPictureNoSizeKeyword)
            .add("s", ListLevelDestination.onParagraphStyleKeyword)
            .append(addParagraphPropertiesKeywords)
            .append(characterPropertiesKeywords)
            .get())
            .add(DestinationType.DestinationOldSectionNumberingLevel, paragraphNumberingDescKeywords)
            .add(DestinationType.InfoDestination, new MapCreator()
            .add("password", InfoDestination.onLegacyPasswordHash)
            .add("passwordhash", InfoDestination.onPasswordHash)
            .append(documentPropertiesKeywords)
            .get())
            .add(DestinationType.MailMergeDestination, {
            "mmconnectstr": MailMergeDestination.onConnectionStringKeyword,
            "mmquery": MailMergeDestination.onQueryKeyword,
            "mmdatasource": MailMergeDestination.onDataSourceKeyword,
            "mmodsofldmpdata": MailMergeDestination.onFieldMapDataKeyword,
        })
            .add(DestinationType.FieldMapDataDestination, {
            "mmfttypenull": FieldMapDataDestination.onNullFieldTypeKeyword,
            "mmfttypedbcolumn": FieldMapDataDestination.onColumnFieldTypeKeyword,
            "mmfttypeaddress": FieldMapDataDestination.onAddressFieldTypeKeyword,
            "mmfttypesalutation": FieldMapDataDestination.onSalutationFieldTypeKeyword,
            "mmfttypemapped": FieldMapDataDestination.onMappedFieldTypeKeyword,
            "mmfttypebarcode": FieldMapDataDestination.onBarcodeFieldTypeKeyword,
            "mmodsoname": FieldMapDataDestination.onColumnNameKeyword,
            "mmodsomappedname": FieldMapDataDestination.onMappedNameKeyword,
            "mmodsofmcolumn": FieldMapDataDestination.onColumnIndexKeyword,
            "mmodsodynaddr": FieldMapDataDestination.onDynamicAddressKeyword,
            "mmodsolid": FieldMapDataDestination.onLanguageIdKeyword,
        })
            .add(DestinationType.SkipDestination, {
            "bin": DestinationBase.onBinKeyword
        })
            .add(DestinationType.StringValueDestination, this.stringValueDestinationKeywordHT)
            .add(DestinationType.UnicodeDestination, {
            "ud": UnicodeDestination.onUdKeyword
        })
            .add(DestinationType.ListLevelTextDestination, new MapCreator()
            .append(this.stringValueDestinationKeywordHT)
            .add("leveltemplateid", ListLevelTextDestination.onListLevelTemplateIdKeyword)
            .get())
            .add(DestinationType.ShapePictureDestination, {
            "pict": ShapePictureDestination.onPictKeyword
        })
            .get();
        this.defaultKeywords = keywordHtDefault;
    }
    getHt(destType) {
        return this.mapByDestinations[destType];
    }
}
