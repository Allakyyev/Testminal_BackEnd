import { __awaiter } from "tslib";
import { MapCreator } from '../../../../base-utils/map-creator';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { ElementDestination } from '../destination';
import { OfficeThemeElementsDestination } from './office-theme-elements-destination';
export class OfficeThemeDestination extends ElementDestination {
    get elementHandlerTable() {
        return OfficeThemeDestination.handlerTable;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.name = this.data.readerHelper.readAttribute(reader, 'name');
            if (!StringUtils.isNullOrEmpty(this.name))
                this.data.documentModel.colorProvider.officeTheme.name = this.name;
        });
    }
}
OfficeThemeDestination.handlerTable = new MapCreator()
    .add('themeElements', (data) => new OfficeThemeElementsDestination(data))
    .get();
