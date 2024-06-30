import { __awaiter } from "tslib";
import { MapCreator } from '../../../../base-utils/map-creator';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { CustomXmlDestination, EmptyDestination } from '../destination';
import { DeletedRunContentDestination } from '../runs/deleted-run-content-destination';
import { InsertedRunContentDestination } from '../runs/inserted-run-content-destination';
import { RunDestination } from '../runs/run-destination';
import { StructuredDocumentDestination } from '../structured-document-destination';
import { FieldDestinationBase } from './field-destination-base';
import { HyperlinkDestination } from './hyperlink-destination';
export class FieldSimpleDestination extends FieldDestinationBase {
    get elementHandlerTable() {
        return FieldSimpleDestination.handlerTable;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.fieldCode = reader.getAttributeNS('instr', this.data.constants.wordProcessingNamespaceConst);
            if (StringUtils.isNullOrEmpty(this.fieldCode))
                return;
            const fldLockAttr = reader.getAttributeNS('fldLock', this.data.constants.wordProcessingNamespaceConst);
            const locked = !StringUtils.isNullOrEmpty(fldLockAttr) ? this.data.readerHelper.isBoolStrict(fldLockAttr) : false;
            this.processFieldBegin(false, locked, false);
            this.data.subDocumentInfo.characterImporter.insertText(this.fieldCode);
            this.processFieldSeparator();
        });
    }
    processElementClose(_reader) {
        if (!StringUtils.isNullOrEmpty(this.fieldCode))
            this.processFieldEnd();
    }
}
FieldSimpleDestination.handlerTable = new MapCreator()
    .add('r', (data) => new RunDestination(data))
    .add('del', (data) => data.options.ignoreDeletedText ? new EmptyDestination(data) : new DeletedRunContentDestination(data))
    .add('ins', (data) => data.options.ignoreInsertedText ? new EmptyDestination(data) : new InsertedRunContentDestination(data))
    .add('fldSimple', (data) => new FieldSimpleDestination(data))
    .add('hyperlink', (data) => new HyperlinkDestination(data))
    .add('sdt', (data) => new StructuredDocumentDestination(data))
    .add('customXml', (data) => new CustomXmlDestination(data))
    .add('ffData', (_data) => {
    return null;
})
    .get();
