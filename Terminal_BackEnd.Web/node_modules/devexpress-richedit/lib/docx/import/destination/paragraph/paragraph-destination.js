import { __awaiter } from "tslib";
import { MapCreator } from '../../../../base-utils/map-creator';
import { NumberingListIndexConstants } from '../../../../core/formats/utils/numbering-list-index-constants';
import { NumberingList } from '../../../../core/model/numbering-lists/numbering-list';
import { MaskedParagraphProperties, ParagraphFirstLineIndent, ParagraphPropertiesMask } from '../../../../core/model/paragraph/paragraph-properties';
import { Constants } from '@devexpress/utils/lib/constants';
import { DocxNsType } from '../../../utils/constants';
import { BookmarkEndElementDestination } from '../bookmark/bookmark-end-element-destination';
import { BookmarkStartElementDestination } from '../bookmark/bookmark-start-element-destination';
import { CommentEndElementDestination } from '../comments/comment-end-element-destination';
import { CommentStartElementDestination } from '../comments/comment-start-element-destination';
import { CustomXmlDestination, ElementDestination, EmptyDestination } from '../destination';
import { AltChunkDestination } from '../document/alt-chunk-destination';
import { SmartTagDestination } from '../document/smart-tag-destination';
import { DrawingDestination } from '../drawing/drawing-destination';
import { FieldCharDestination } from '../field/field-char-destination';
import { FieldSimpleDestination } from '../field/field-simple-destination';
import { HyperlinkDestination } from '../field/hyperlink-destination';
import { ParagraphPropertiesDestination } from '../paragraph-properties/paragraph-properties-destination';
import { RangePermissionEndElementDestination } from '../range-permission/range-permission-end-element-destination';
import { RangePermissionStartElementDestination } from '../range-permission/range-permission-start-element-destination';
import { DeletedRunContentDestination } from '../runs/deleted-run-content-destination';
import { InlinePictureDestination } from '../runs/inline-picture-destination';
import { InsertedRunContentDestination } from '../runs/inserted-run-content-destination';
import { RunDestination } from '../runs/run-destination';
import { TextDestination } from '../runs/text-destination';
import { StructuredDocumentDestination } from '../structured-document-destination';
export class ParagraphDestination extends ElementDestination {
    constructor(data) {
        super(data);
        this.listLevelIndex = Constants.MIN_SAFE_INTEGER;
        this.numberingId = Constants.MIN_SAFE_INTEGER;
        this.data.subDocumentInfo.paragraphImporter
            .resetProperties()
            .resetStyle()
            .resetTabs()
            .resetParMarkCharProperties()
            .resetParMarkCharacterStyle();
        this.data.subDocumentInfo.characterImporter.resetProperties();
        if (this.data.subDocument.isMain())
            this.data.sectionImporter.shouldInsertSection = false;
    }
    get elementHandlerTable() {
        return ParagraphDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    isChoiceNamespaceSupported(requeriesNamespaceUri) {
        return requeriesNamespaceUri.toLowerCase() == this.data.constants.namespaces[DocxNsType.Wps].namespace.toLowerCase() ||
            super.isChoiceNamespaceSupported(requeriesNamespaceUri);
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const val = reader.getAttributeNS('paraId', this.data.constants.w14NamespaceConst);
            this.data.subDocumentInfo.paragraphImporter.paraId = this.data.readerHelper.getIntegerValueCore(val, Constants.MIN_SAFE_INTEGER, 16);
        });
    }
    processElementClose(_reader) {
        this.data.subDocumentInfo.characterImporter.properties = this.data.subDocumentInfo.paragraphImporter.parMarkCharProperties.clone();
        this.data.subDocumentInfo.characterImporter.style = this.data.subDocumentInfo.paragraphImporter.parMarkCharacterStyle;
        if (this.data.sectionImporter.shouldInsertSection && this.data.subDocument.isMain())
            this.data.sectionImporter.insertSection();
        else
            this.addNumbering(this.data.subDocumentInfo.paragraphImporter.insertParagraph());
        this.data.subDocumentInfo.characterImporter.style = this.data.documentModel.characterStyles[0];
    }
    createParagraphPropertiesDestination() {
        return new ParagraphPropertiesDestination(this.data, this, this.data.subDocumentInfo.paragraphImporter.properties, this.data.subDocumentInfo.paragraphImporter.tabs);
    }
    addNumbering(paragraph) {
        this.listLevelIndex = Math.max(0, this.listLevelIndex);
        if (this.numberingId != Constants.MIN_SAFE_INTEGER) {
            const listInfo = this.data.stylesImporter.findNumberingListInfoById(this.numberingId);
            if (listInfo) {
                paragraph.listLevelIndex = this.listLevelIndex;
                paragraph.numberingListIndex = listInfo.listIndex;
            }
            else if (this.numberingId == NumberingList.NoNumberingListIndex &&
                paragraph.paragraphStyle.getNumberingListIndex() >= NumberingListIndexConstants.minValue) {
                paragraph.listLevelIndex = this.listLevelIndex;
                paragraph.numberingListIndex = NumberingList.NoNumberingListIndex;
                if (!paragraph.maskedParagraphProperties.getUseValue(ParagraphPropertiesMask.UseFirstLineIndent)) {
                    paragraph.maskedParagraphProperties.firstLineIndentType = ParagraphFirstLineIndent.None;
                    paragraph.maskedParagraphProperties.firstLineIndent = 0;
                }
                if (!paragraph.maskedParagraphProperties.getUseValue(ParagraphPropertiesMask.UseLeftIndent))
                    paragraph.maskedParagraphProperties.leftIndent = 0;
            }
        }
    }
}
ParagraphDestination.handlerTable = new MapCreator()
    .add('pPr', (data) => {
    data.subDocumentInfo.paragraphImporter.properties = MaskedParagraphProperties.createDefault(data.documentModel);
    return ParagraphDestination.getThis(data).createParagraphPropertiesDestination();
})
    .add('r', (data) => new RunDestination(data))
    .add('del', (data) => data.options.ignoreDeletedText ? new EmptyDestination(data) : new DeletedRunContentDestination(data))
    .add('ins', (data) => data.options.ignoreInsertedText ? new EmptyDestination(data) : new InsertedRunContentDestination(data))
    .add('pict', (data) => new InlinePictureDestination(data))
    .add('fldSimple', (data) => new FieldSimpleDestination(data))
    .add('hyperlink', (data) => new HyperlinkDestination(data))
    .add('fldChar', (data) => new FieldCharDestination(data))
    .add('instrText', (data) => new TextDestination(data))
    .add('bookmarkStart', (data) => new BookmarkStartElementDestination(data))
    .add('bookmarkEnd', (data) => new BookmarkEndElementDestination(data))
    .add('permStart', (data) => new RangePermissionStartElementDestination(data))
    .add('permEnd', (data) => new RangePermissionEndElementDestination(data))
    .add('commentRangeStart', (data) => new CommentStartElementDestination(data))
    .add('commentRangeEnd', (data) => new CommentEndElementDestination(data))
    .add('smartTag', (data) => new SmartTagDestination(data))
    .add('sdt', (data) => new StructuredDocumentDestination(data))
    .add('customXml', (data) => new CustomXmlDestination(data))
    .add('drawing', (data) => new DrawingDestination(data))
    .add('altChunk', (data) => new AltChunkDestination(data))
    .get();
