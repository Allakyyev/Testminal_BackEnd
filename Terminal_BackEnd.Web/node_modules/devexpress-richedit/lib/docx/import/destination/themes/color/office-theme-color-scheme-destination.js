import { __awaiter } from "tslib";
import { MapCreator } from '../../../../../base-utils/map-creator';
import { ThemeColorIndexConstants } from '../../../../../core/model/color/enums';
import { ElementDestination } from '../../destination';
import { OfficeThemeColorDestination } from './office-theme-color-destination';
export class OfficeThemeColorSchemeDestination extends ElementDestination {
    get elementHandlerTable() {
        return OfficeThemeColorSchemeDestination.handlerTable;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.data.documentModel.colorProvider.officeTheme.colors.name = this.data.readerHelper.readAttribute(reader, 'name');
        });
    }
}
OfficeThemeColorSchemeDestination.handlerTable = new MapCreator()
    .add('dk1', (data) => new OfficeThemeColorDestination(data, ThemeColorIndexConstants.Dark1))
    .add('lt1', (data) => new OfficeThemeColorDestination(data, ThemeColorIndexConstants.Light1))
    .add('dk2', (data) => new OfficeThemeColorDestination(data, ThemeColorIndexConstants.Dark2))
    .add('lt2', (data) => new OfficeThemeColorDestination(data, ThemeColorIndexConstants.Light2))
    .add('accent1', (data) => new OfficeThemeColorDestination(data, ThemeColorIndexConstants.Accent1))
    .add('accent2', (data) => new OfficeThemeColorDestination(data, ThemeColorIndexConstants.Accent2))
    .add('accent3', (data) => new OfficeThemeColorDestination(data, ThemeColorIndexConstants.Accent3))
    .add('accent4', (data) => new OfficeThemeColorDestination(data, ThemeColorIndexConstants.Accent4))
    .add('accent5', (data) => new OfficeThemeColorDestination(data, ThemeColorIndexConstants.Accent5))
    .add('accent6', (data) => new OfficeThemeColorDestination(data, ThemeColorIndexConstants.Accent6))
    .add('hlink', (data) => new OfficeThemeColorDestination(data, ThemeColorIndexConstants.Hyperlink))
    .add('folHlink', (data) => new OfficeThemeColorDestination(data, ThemeColorIndexConstants.FollowedHyperlink))
    .get();
