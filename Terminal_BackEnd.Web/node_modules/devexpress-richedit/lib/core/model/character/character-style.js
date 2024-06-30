import { StyleBase } from '../style-base';
export class CharacterStyle extends StyleBase {
    constructor(styleName, localizedName, deleted, hidden, semihidden, isDefault, maskedCharacterProperties, base64EncodedImage, id) {
        super(styleName, localizedName, deleted, hidden, semihidden, isDefault, base64EncodedImage ? base64EncodedImage : null, id);
        this.maskedCharacterProperties = maskedCharacterProperties;
    }
    clone() {
        const style = new CharacterStyle(this.styleName, this.localizedName, this.deleted, this.hidden, this.semihidden, this.isDefault, this.maskedCharacterProperties, this.base64EncodedImage, this.id);
        style.parent = this.parent;
        style.linkedStyle = this.linkedStyle;
        style.primary = this.primary;
        return style;
    }
}
CharacterStyle.defaultParagraphCharacterStyleName = 'Default Paragraph Font';
CharacterStyle.hyperlinkStyleName = 'Hyperlink';
CharacterStyle.lineNumberingStyleName = 'Line Number';
