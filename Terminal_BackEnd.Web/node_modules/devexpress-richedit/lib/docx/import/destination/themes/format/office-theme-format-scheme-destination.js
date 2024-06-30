import { __awaiter } from "tslib";
import { MapCreator } from '../../../../../base-utils/map-creator';
import { ElementDestination } from '../../destination';
export class OfficeThemeFormatSchemeDestination extends ElementDestination {
    get elementHandlerTable() {
        return OfficeThemeFormatSchemeDestination.handlerTable;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.data.documentModel.colorProvider.officeTheme.formatScheme.name = this.data.readerHelper.readAttribute(reader, 'name');
        });
    }
}
OfficeThemeFormatSchemeDestination.handlerTable = new MapCreator()
    .get();
