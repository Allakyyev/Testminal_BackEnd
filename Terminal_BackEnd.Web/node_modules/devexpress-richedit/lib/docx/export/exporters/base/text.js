import { RichUtils } from '../../../../core/model/rich-utils';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { TranslationTables } from '../../../translation-table/translation-tables';
import { DocxNsType } from '../../../utils/constants';
import { BaseExporter } from '../base';
export class TextExporter extends BaseExporter {
    exportTextRunCore(runText) {
        let from = 0;
        const count = runText.length;
        for (let i = 0; i < count; i++) {
            const character = runText[i];
            const runBreakValue = TranslationTables.runBreaksTable.exportMap[character.charCodeAt(0)];
            if (runBreakValue) {
                this.exportTextCorePartial(runText, from, i - from);
                from = i + 1;
                this.exportBreak(runBreakValue.mlValue.openXmlValue);
            }
            else {
                if (character == RichUtils.specialCharacters.TabMark) {
                    this.exportTextCorePartial(runText, from, i - from);
                    from = i + 1;
                    this.writer.writeWpStartElement('tab');
                    this.writer.endElement();
                }
            }
        }
        this.exportTextCorePartial(runText, from, count - from);
    }
    removeSpecialSymbols(text) {
        if (!this.containsSpecialSymbols(text))
            return text;
        const result = [];
        const count = text.length;
        for (let i = 0; i < count; i++) {
            const ch = text[i];
            const charCode = ch.charCodeAt(0);
            if (charCode > TextExporter.lastLowSpecial && charCode < TextExporter.firstHighSpecial || ch == '\x09' || ch == '\x0A' || ch == '\x0D')
                result.push(ch);
        }
        return result.join('');
    }
    exportTextCorePartial(runText, from, length) {
        if (length > 0)
            this.exportTextCore(from == 0 && length == runText.length ? runText : runText.substr(from, length));
    }
    exportTextCore(runText) {
        if (StringUtils.isNullOrEmpty(runText))
            return;
        runText = this.removeSpecialSymbols(runText);
        if (StringUtils.isNullOrEmpty(runText))
            return;
        this.writer.writeWpStartElement(this.getTextTag());
        if (/ /.test(runText))
            this.writer.attrNS(DocxNsType.Xml, 'space', 'preserve');
        this.writer.writeString(runText);
        this.writer.endElement();
    }
    exportBreak(value) {
        this.writer.elementStartNS(DocxNsType.WordProcessing, 'br');
        this.writer.writeWpStringAttr('type', value);
        this.writer.endElement();
    }
    getTextTag() {
        return this.data.subDocumentExporter.fieldCodeDepth == 0 ? 't' : 'instrText';
    }
    containsSpecialSymbols(text) {
        const count = text.length;
        for (let i = 0; i < count; i++) {
            const ch = text[i];
            const charCode = ch.charCodeAt(0);
            if ((charCode <= TextExporter.lastLowSpecial || charCode >= TextExporter.firstHighSpecial) &&
                ch != '\x09' && ch != '\x0A' && ch != '\x0D')
                return true;
        }
        return false;
    }
}
TextExporter.lastLowSpecial = '\u001f'.charCodeAt(0);
TextExporter.firstHighSpecial = '\uffff'.charCodeAt(0);
