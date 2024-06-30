import { AutoCorrectSettings } from './auto-correct';
import { BookmarksSettings } from './bookmarks';
import { ControlOptions } from './control';
import { FieldsSettings } from './fields';
import { FontsSettings } from './fonts';
import { MailMergeOptions } from './mail-merge';
import { PdfSettings } from './pdf';
import { PrintingSettings } from './printing';
import { DocumentProtectionSettings } from './protection';
import { SearchSettings } from './search';
import { SpellCheckerSettings } from './spell-checker';
export class RichOptions {
    constructor(cultureOpts) {
        this.control = new ControlOptions();
        this.mailMerge = new MailMergeOptions();
        this.fields = new FieldsSettings();
        this.documentProtection = new DocumentProtectionSettings();
        this.printing = new PrintingSettings();
        this.bookmarks = new BookmarksSettings();
        this.spellChecker = new SpellCheckerSettings();
        this.autoCorrect = new AutoCorrectSettings();
        this.pdf = new PdfSettings();
        this.search = new SearchSettings();
        this.fonts = new FontsSettings();
        this.cultureOpts = cultureOpts;
    }
    get maxSpellRequestLength() {
        return this.spellChecker.maxRequestLength;
    }
    clone() {
        const result = new RichOptions(this.cultureOpts);
        result.control = this.control.clone();
        result.mailMerge = this.mailMerge.clone();
        result.fields = this.fields.clone();
        result.documentProtection = this.documentProtection.clone();
        result.printing = this.printing.clone();
        result.bookmarks = this.bookmarks.clone();
        result.spellChecker = this.spellChecker.clone();
        result.autoCorrect = this.autoCorrect.clone();
        result.cultureOpts = this.cultureOpts.clone();
        result.pdf = this.pdf.clone();
        result.search = this.search.clone();
        result.fonts = this.fonts.clone();
        result.nonce = this.nonce;
        return result;
    }
}
