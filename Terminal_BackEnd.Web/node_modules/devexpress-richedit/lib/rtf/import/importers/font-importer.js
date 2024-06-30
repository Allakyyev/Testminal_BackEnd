import { StringHelper } from '../../../core/formats/utils/string-helper';
import { DXEncoding } from '../encoding/dx-encoding';
import { RtfFontInfoCollection } from '../model/character/font-info-collection';
import { RtfBaseImporter } from './importer-base';
export class RtfFontImporter extends RtfBaseImporter {
    constructor(data) {
        super(data);
        this.defaultFontNumber = 0;
        this.fonts = new RtfFontInfoCollection();
    }
    addRtfFontInfo(fontInfo) {
        fontInfo.name = StringHelper.removeSpecialSymbols(fontInfo.name);
        if (fontInfo.name.length == 0)
            fontInfo.name = this.data.documentModel.defaultCharacterProperties.fontInfo.name;
        this.fonts.collection.push(fontInfo);
    }
    setFont(fontInfo) {
        this.data.importers.character.characterFormatting.setFont(fontInfo, fontInfo.getCoreObjectByName(this.documentModel));
        const codePage = this.codePageFromCharset(fontInfo.charset);
        this.data.setCodePage(codePage);
    }
    codePageFromCharset(charset) {
        if (charset >= 0)
            return DXEncoding.codePageFromCharset(charset);
        else
            return this.data.documentProperties.defaultCodePage;
    }
    pushState() {
    }
    popState() {
    }
    startImportSubDocument() {
    }
    finalizeSubDocument() {
    }
}
