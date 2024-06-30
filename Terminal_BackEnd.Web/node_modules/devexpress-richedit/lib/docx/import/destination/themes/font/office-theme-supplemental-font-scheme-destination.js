import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { LeafElementDestination } from '../../destination';
export class OfficeThemeSupplementalFontSchemeDestination extends LeafElementDestination {
    constructor(data, fontPart) {
        super(data);
        this.fontPart = fontPart;
    }
    processElementClose(reader) {
        const script = this.data.readerHelper.readAttribute(reader, 'script');
        const typeface = this.data.readerHelper.readAttribute(reader, 'typeface');
        if (StringUtils.isNullOrEmpty(script) && StringUtils.isNullOrEmpty(typeface))
            this.data.options.throwInvalidFile('Invalid fonts');
        this.fontPart.addSupplementalFont(script, typeface);
    }
}
