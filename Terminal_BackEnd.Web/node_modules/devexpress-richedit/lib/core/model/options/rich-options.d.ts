import { IFormattersOptions } from '@devexpress/utils/lib/formatters/options';
import { IModelOptions } from '../document-model';
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
export declare class RichOptions implements IModelOptions {
    control: ControlOptions;
    mailMerge: MailMergeOptions;
    fields: FieldsSettings;
    documentProtection: DocumentProtectionSettings;
    printing: PrintingSettings;
    bookmarks: BookmarksSettings;
    spellChecker: SpellCheckerSettings;
    autoCorrect: AutoCorrectSettings;
    cultureOpts: IFormattersOptions;
    pdf: PdfSettings;
    search: SearchSettings;
    fonts: FontsSettings;
    nonce: string;
    get maxSpellRequestLength(): number;
    constructor(cultureOpts: IFormattersOptions);
    clone(): RichOptions;
}
//# sourceMappingURL=rich-options.d.ts.map