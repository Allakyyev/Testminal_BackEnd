import { __awaiter } from "tslib";
import { MapCreator } from '../../../../../base-utils/map-creator';
import { ElementDestination } from '../../destination';
import { OfficeThemeFontCollectionSchemeDestination } from './office-theme-font-collection-scheme-destination';
export class OfficeThemeFontSchemeDestination extends ElementDestination {
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    get elementHandlerTable() {
        return OfficeThemeFontSchemeDestination.handlerTable;
    }
    get majorFont() { return this.data.documentModel.colorProvider.officeTheme.fontScheme.majorFont; }
    get minorFont() { return this.data.documentModel.colorProvider.officeTheme.fontScheme.minorFont; }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.data.documentModel.colorProvider.officeTheme.fontScheme.name = this.data.readerHelper.readAttribute(reader, 'name');
        });
    }
}
OfficeThemeFontSchemeDestination.handlerTable = new MapCreator()
    .add('majorFont', (data) => new OfficeThemeFontCollectionSchemeDestination(data, OfficeThemeFontSchemeDestination.getThis(data).majorFont))
    .add('minorFont', (data) => new OfficeThemeFontCollectionSchemeDestination(data, OfficeThemeFontSchemeDestination.getThis(data).minorFont))
    .get();
