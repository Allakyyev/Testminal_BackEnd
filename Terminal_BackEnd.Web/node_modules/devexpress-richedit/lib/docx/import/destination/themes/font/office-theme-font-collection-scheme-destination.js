import { MapCreator } from '../../../../../base-utils/map-creator';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { ElementDestination } from '../../destination';
import { DrawingTextFontDestination } from './drawing-text-font-destination';
import { OfficeThemeSupplementalFontSchemeDestination } from './office-theme-supplemental-font-scheme-destination';
export class OfficeThemeFontCollectionSchemeDestination extends ElementDestination {
    constructor(data, fontPart) {
        super(data);
        this.hasLatin = false;
        this.hasEastAsian = false;
        this.hasComplexScript = false;
        this.fontPart = fontPart;
    }
    get elementHandlerTable() {
        return OfficeThemeFontCollectionSchemeDestination.handlerTable;
    }
    get latin() {
        return this.fontPart.latin;
    }
    get eastAsian() {
        return this.fontPart.eastAsian;
    }
    get complexScript() {
        return this.fontPart.complexScript;
    }
    get fonts() {
        return this.fontPart.supplementalFonts;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    processElementClose(_reader) {
        this.fontPart.isValid = this.hasLatin && this.hasEastAsian && this.hasComplexScript &&
            !StringUtils.isNullOrEmpty(this.latin.typeface) && this.eastAsian.typeface != null && this.complexScript.typeface != null;
    }
}
OfficeThemeFontCollectionSchemeDestination.handlerTable = new MapCreator()
    .add('latin', (data) => {
    const destination = OfficeThemeFontCollectionSchemeDestination.getThis(data);
    destination.hasLatin = true;
    return new DrawingTextFontDestination(data, destination.latin);
})
    .add('ea', (data) => {
    const destination = OfficeThemeFontCollectionSchemeDestination.getThis(data);
    destination.hasEastAsian = true;
    return new DrawingTextFontDestination(data, destination.eastAsian);
})
    .add('cs', (data) => {
    const destination = OfficeThemeFontCollectionSchemeDestination.getThis(data);
    destination.hasComplexScript = true;
    return new DrawingTextFontDestination(data, destination.complexScript);
})
    .add('font', (data) => new OfficeThemeSupplementalFontSchemeDestination(data, OfficeThemeFontCollectionSchemeDestination.getThis(data).fontPart))
    .get();
