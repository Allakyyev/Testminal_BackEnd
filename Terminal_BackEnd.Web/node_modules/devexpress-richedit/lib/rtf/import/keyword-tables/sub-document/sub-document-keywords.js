import { MapCreator } from '../../../../base-utils/map-creator';
import { FormFieldProperties } from '../../../../core/model/fields/form-field-properties';
import { RtfDrawingKeywords } from '../../../translation-table/rtf-drawing-keywords';
import { TextAfterDestination } from '../../destination/base/text-after-destination';
import { TextBeforeDestination } from '../../destination/base/text-before-destination';
import { BookmarkEndDestination } from '../../destination/bookmark/bookmark-end-destination';
import { BookmarkStartDestination } from '../../destination/bookmark/bookmark-start-destination';
import { DocumentVariableDestination } from '../../destination/document-variable-destination';
import { FormFieldDestination } from '../../destination/fields/form-field-destination';
import { MailMergeDestination } from '../../destination/fields/mail-merge-destination';
import { DestinationOldParagraphNumbering } from '../../destination/numbering-list/destination-old-paragraph-numbering';
import { DestinationOldSectionNumberingLevel } from '../../destination/numbering-list/destination-old-section-numbering-level';
import { PictureDestination } from '../../destination/picture/picture-destination';
import { RangePermissionEndDestination } from '../../destination/range-permission/range-permission-end-destination';
import { RangePermissionStartDestination } from '../../destination/range-permission/range-permission-start-destination';
import { DestinationSubDocument } from '../../destination/sub-document/destination-sub-document';
import { characterPropertiesKeywords } from '../character-properties';
import { addParagraphPropertiesKeywords } from '../paragraph-properties';
import { appendTableKeywords } from './table-keywords';
export const addCommonSymbolsAndObjectsKeywords = new MapCreator()
    .add("pict", (data) => data.destination = new PictureDestination(data))
    .add("shp", DestinationSubDocument.onShapeKeyword)
    .add("shppict", DestinationSubDocument.onShapePictureKeyword)
    .add("nonshppict", DestinationSubDocument.onNonShapePictureKeyword)
    .add(RtfDrawingKeywords.ShapeGroup, DestinationSubDocument.onShapeGroupKeyword)
    .add("line", DestinationSubDocument.onLineBreakKeyword)
    .add("u", DestinationSubDocument.onUnicodeKeyword)
    .add("tab", DestinationSubDocument.onTabKeyword)
    .add("emdash", DestinationSubDocument.onEmDashKeyword)
    .add("endash", DestinationSubDocument.onEnDashKeyword)
    .add("lquote", DestinationSubDocument.onLeftSingleQuoteKeyword)
    .add("rquote", DestinationSubDocument.onRightSingleQuoteKeyword)
    .add("ldblquote", DestinationSubDocument.onLeftDoubleQuoteKeyword)
    .add("rdblquote", DestinationSubDocument.onRightDoubleQuoteKeyword)
    .add("bullet", DestinationSubDocument.onBulletKeyword)
    .add("emspace", DestinationSubDocument.onEmSpaceKeyword)
    .add("enspace", DestinationSubDocument.onEnSpaceKeyword)
    .add("qmspace", DestinationSubDocument.onQmSpaceKeyword)
    .add("field", DestinationSubDocument.onFieldStartKeyword)
    .add("formfield", (data) => {
    if (data.importers.field.fields.count > 0) {
        data.importers.field.fields.peek().formFieldProperties = new FormFieldProperties();
        data.destination = new FormFieldDestination(data);
    }
})
    .add("tc", DestinationSubDocument.onTableOfContentsEntryKeyword)
    .add("tcl", DestinationSubDocument.onTableOfContentsEntryLevelNumberKeyword)
    .add("tcf", DestinationSubDocument.onTableOfContentsEntryTypeTableKeyword)
    .add("mailmerge", (data) => data.destination = new MailMergeDestination(data))
    .add("bkmkstart", (data) => data.destination = new BookmarkStartDestination(data))
    .add("bkmkend", (data) => data.destination = new BookmarkEndDestination(data))
    .add("protstart", (data) => data.destination = new RangePermissionStartDestination(data))
    .add("protend", (data) => data.destination = new RangePermissionEndDestination(data))
    .add("docvar", (data) => data.destination = new DocumentVariableDestination(data))
    .add("dxcustomrundata", DestinationSubDocument.onDxCustomRunDataKeyword)
    .add("zwj", DestinationSubDocument.onZeroWidthJoiner)
    .add("zwnj", DestinationSubDocument.onZeroWidthNonJoiner)
    .add("zwbo", DestinationSubDocument.onZeroWidthBreakOpportunity)
    .add("zwnbo", DestinationSubDocument.onZeroWidthNonBreakOpportunity)
    .get();
export const addCommonNumberingListsKeywords = new MapCreator()
    .add("ls", DestinationSubDocument.onListOverride)
    .add("ilvl", DestinationSubDocument.onListLevel)
    .add("listtext", DestinationSubDocument.onListText)
    .add("pntext", DestinationSubDocument.onListText)
    .add("pnseclvl", (data, parameterValue) => data.destination = new DestinationOldSectionNumberingLevel(data, parameterValue))
    .add("pn", (data) => data.destination = new DestinationOldParagraphNumbering(data))
    .add("pntxta", (data) => data.destination = new TextAfterDestination(data))
    .add("pntxtb", (data) => data.destination = new TextBeforeDestination(data))
    .get();
export const addCommonTabKeywords = new MapCreator()
    .add("tqr", DestinationSubDocument.onTabRightKeyword)
    .add("tqc", DestinationSubDocument.onTabCenterKeyword)
    .add("tqdec", DestinationSubDocument.onTabDecimalKeyword)
    .add("tldot", DestinationSubDocument.onTabLeaderDotsKeyword)
    .add("tlmdot", DestinationSubDocument.onTabLeaderMiddleDotsKeyword)
    .add("tlhyph", DestinationSubDocument.onTabLeaderHyphensKeyword)
    .add("tlul", DestinationSubDocument.onTabLeaderUnderlineKeyword)
    .add("tlth", DestinationSubDocument.onTabLeaderThickLineKeyword)
    .add("tleq", DestinationSubDocument.onTabLeaderEqualSignKeyword)
    .add("tx", DestinationSubDocument.onTabPositionKeyword)
    .add("tb", DestinationSubDocument.onBarTabKeyword)
    .get();
export const addCommonCharacterKeywords = new MapCreator()
    .add("plain", DestinationSubDocument.onPlainKeyword)
    .add("cs", DestinationSubDocument.onCharacterStyleIndex)
    .append(characterPropertiesKeywords)
    .get();
export const addCommonParagraphKeywords = new MapCreator()
    .add("par", DestinationSubDocument.onParKeyword)
    .add("pard", DestinationSubDocument.onResetParagraphPropertiesKeyword)
    .add("s", DestinationSubDocument.onParagraphStyleIndex)
    .add("yts", DestinationSubDocument.onTableStyleIndexForRowOrCell)
    .add("ltrpar", DestinationSubDocument.onLeftToRightParagraphKeyword)
    .add("rtlpar", DestinationSubDocument.onRightToLeftParagraphKeyword)
    .append(addParagraphPropertiesKeywords)
    .get();
export const subDocumentKeyword = new MapCreator()
    .append(addCommonCharacterKeywords)
    .append(addCommonParagraphKeywords)
    .append(addCommonSymbolsAndObjectsKeywords)
    .append(addCommonTabKeywords)
    .append(addCommonNumberingListsKeywords)
    .append(appendTableKeywords)
    .get();
