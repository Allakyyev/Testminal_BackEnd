import { __awaiter } from "tslib";
import { MapCreator } from '../../../../base-utils/map-creator';
import { HyperlinkInfo } from '../../../../core/model/fields/field';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { BookmarkEndElementDestination } from '../bookmark/bookmark-end-element-destination';
import { BookmarkStartElementDestination } from '../bookmark/bookmark-start-element-destination';
import { CustomXmlDestination, EmptyDestination } from '../destination';
import { RangePermissionEndElementDestination } from '../range-permission/range-permission-end-element-destination';
import { RangePermissionStartElementDestination } from '../range-permission/range-permission-start-element-destination';
import { DeletedRunContentDestination } from '../runs/deleted-run-content-destination';
import { InsertedRunContentDestination } from '../runs/inserted-run-content-destination';
import { RunDestination } from '../runs/run-destination';
import { StructuredDocumentDestination } from '../structured-document-destination';
import { FieldDestinationBase } from './field-destination-base';
import { FieldSimpleDestination } from './field-simple-destination';
export class HyperlinkDestination extends FieldDestinationBase {
    get elementHandlerTable() {
        return HyperlinkDestination.handlerTable;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const attr = reader.getAttributeNS('fldLock', this.data.constants.wordProcessingNamespaceConst);
            const locked = !StringUtils.isNullOrEmpty(attr) ? this.data.readerHelper.isBoolStrict(attr) : false;
            this.processFieldBegin(false, locked, false);
            const hyperlinkInfo = this.createHyperlinkInfo(reader);
            this.data.subDocumentInfo.fieldImporter.fieldInfoStack.last.hyperlinkInfo = hyperlinkInfo;
            const code = HyperlinkInfo.getNewCodeText(hyperlinkInfo);
            this.data.subDocumentInfo.characterImporter.insertText(code);
            this.processFieldSeparator();
        });
    }
    processElementClose(_reader) {
        this.processFieldEnd();
    }
    createHyperlinkInfo(reader) {
        const hyperlinkInfo = new HyperlinkInfo('', '', '', false);
        for (let ind = 0, attr; attr = reader.attributes[ind]; ind++) {
            const handler = HyperlinkDestination.attributeHandlerTable[attr.localName];
            if (handler !== undefined)
                handler(this.data, hyperlinkInfo, attr.value);
            else if (attr.name.indexOf('xmlns') < 0)
                this.data.options.throwInvalidFile('incorrect hyperlinkInfo');
        }
        return hyperlinkInfo;
    }
}
HyperlinkDestination.handlerTable = new MapCreator()
    .add('r', (data) => new RunDestination(data))
    .add('fldSimple', (data) => new FieldSimpleDestination(data))
    .add('hyperlink', (data) => new HyperlinkDestination(data))
    .add('bookmarkStart', (data) => new BookmarkStartElementDestination(data))
    .add('bookmarkEnd', (data) => new BookmarkEndElementDestination(data))
    .add('permStart', (data) => new RangePermissionStartElementDestination(data))
    .add('permEnd', (data) => new RangePermissionEndElementDestination(data))
    .add('sdt', (data) => new StructuredDocumentDestination(data))
    .add('customXml', (data) => new CustomXmlDestination(data))
    .add('del', (data) => data.options.ignoreDeletedText ? new EmptyDestination(data) : new DeletedRunContentDestination(data))
    .add('ins', (data) => data.options.ignoreInsertedText ? new EmptyDestination(data) : new InsertedRunContentDestination(data))
    .get();
HyperlinkDestination.attributeHandlerTable = new MapCreator()
    .add('id', (data, info, value) => {
    const relation = data.relationsStack.last.lookupRelationById(value);
    if (relation != null) {
        const target = relation.target;
        if (relation.targetMode == 'External')
            info.uri = target;
        else {
            const charIndex = target.indexOf('#');
            info.anchor = target.substring(charIndex);
        }
    }
})
    .add('anchor', (_data, info, value) => info.anchor = value)
    .add('tgtFrame', (_data, _info, _value) => { })
    .add('tooltip', (_data, info, value) => info.tip = value)
    .add('history', (data, info, value) => info.visited = !data.readerHelper.isBoolStrict(value))
    .add('docLocation', (_data, _info, _value) => { })
    .get();
