import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { MaskedCharacterProperties } from '../character/character-properties';
export class ModelCacheFiller {
    constructor(model, fontsSettings) {
        this.model = model;
        this.fontsSettings = fontsSettings;
    }
    fillCache() {
        this.makeFontMap();
        this.replaceCharProperties(this.model, "defaultCharacterProperties");
        this.model.characterStyles.forEach(style => this.replaceCharProperties(style, "maskedCharacterProperties"));
        this.model.paragraphStyles.forEach(style => this.replaceCharProperties(style, "maskedCharacterProperties"));
        this.model.tableStyles.forEach(style => {
            this.replaceCharProperties(style.baseConditionalStyle, 'maskedCharacterProperties');
            NumberMapUtils.forEach(style.conditionalStyles, style => this.replaceCharProperties(style, 'maskedCharacterProperties'));
        });
        NumberMapUtils.forEach(this.model.subDocuments, sd => this.replaceInModelSubDocument(sd));
    }
    makeFontMap() {
        const fontInfoCache = this.model.cache.fontInfoCache;
        const fontsSettings = this.fontsSettings;
        this.fontMap = Object.create(null);
        fontInfoCache.getAllFonts().forEach(font => this.fontMap[font.name] = fontsSettings.getPermittedFont(fontInfoCache, font));
    }
    replaceCharProperties(object, propKey) {
        const props = object[propKey];
        props.fontInfo = props.fontInfo ? this.fontMap[props.fontInfo.name] : this.model.defaultCharacterProperties.fontInfo;
        if (props instanceof MaskedCharacterProperties)
            object[propKey] = this.model.cache.maskedCharacterPropertiesCache.getItem(props);
        else
            object[propKey] = this.model.cache.mergedCharacterPropertiesCache.getItem(props);
    }
    replaceInModelSubDocument(sd) {
        sd.paragraphs.forEach(p => p.resetParagraphMergedProperties());
        sd.chunks.forEach(chunk => {
            chunk.textRuns.forEach(run => {
                this.replaceCharProperties(run, 'maskedCharacterProperties');
                run.resetCharacterMergedProperties();
            });
        });
    }
}
