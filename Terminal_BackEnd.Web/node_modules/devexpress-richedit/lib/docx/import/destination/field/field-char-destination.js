import { __awaiter } from "tslib";
import { MapCreator } from '../../../../base-utils/map-creator';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { FieldDestinationBase } from './field-destination-base';
export class FieldCharDestination extends FieldDestinationBase {
    get elementHandlerTable() {
        return FieldCharDestination.handlerTable;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const type = reader.getAttributeNS('fldCharType', this.data.constants.wordProcessingNamespaceConst);
            switch (type) {
                case 'begin':
                    const attr = reader.getAttributeNS('disableUpdate', this.data.constants.wordProcessingNamespaceConst);
                    const hideByParentAttr = reader.getAttributeNS('hideByParent', this.data.constants.wordProcessingNamespaceConst);
                    const lockedAttr = reader.getAttributeNS('fldLock', this.data.constants.wordProcessingNamespaceConst);
                    const disableUpdate = !StringUtils.isNullOrEmpty(attr) ? this.data.readerHelper.isBoolStrict(attr) : false;
                    const hideByParent = !StringUtils.isNullOrEmpty(hideByParentAttr) ?
                        this.data.readerHelper.isBoolStrict(hideByParentAttr) : false;
                    const locked = !StringUtils.isNullOrEmpty(lockedAttr) ? this.data.readerHelper.isBoolStrict(lockedAttr) : false;
                    this.processFieldBegin(disableUpdate, locked, hideByParent);
                    break;
                case 'separate':
                    this.processFieldSeparator();
                    break;
                case 'end':
                    this.processFieldEnd();
                    break;
                default:
                    break;
            }
        });
    }
}
FieldCharDestination.handlerTable = new MapCreator()
    .add('ffData', (_data) => {
    return null;
})
    .add('fldData', (_data) => {
    return null;
})
    .get();
