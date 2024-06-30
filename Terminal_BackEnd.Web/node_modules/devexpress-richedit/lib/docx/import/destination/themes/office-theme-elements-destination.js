import { MapCreator } from '../../../../base-utils/map-creator';
import { ElementDestination } from '../destination';
import { OfficeThemeColorSchemeDestination } from './color/office-theme-color-scheme-destination';
import { OfficeThemeFontSchemeDestination } from './font/office-theme-font-scheme-destination';
import { OfficeThemeFormatSchemeDestination } from './format/office-theme-format-scheme-destination';
export class OfficeThemeElementsDestination extends ElementDestination {
    get elementHandlerTable() {
        return OfficeThemeElementsDestination.handlerTable;
    }
}
OfficeThemeElementsDestination.handlerTable = new MapCreator()
    .add('clrScheme', (data) => new OfficeThemeColorSchemeDestination(data))
    .add('fontScheme', (data) => new OfficeThemeFontSchemeDestination(data))
    .add('fmtScheme', (data) => new OfficeThemeFormatSchemeDestination(data))
    .get();
