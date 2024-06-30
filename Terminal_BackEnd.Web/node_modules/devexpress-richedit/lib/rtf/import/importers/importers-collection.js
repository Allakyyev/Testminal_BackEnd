import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RtfBookmarkImporter } from './bookmark-importer';
import { RtfCharacterImporter } from './character-importer';
import { RtfCommentsImporter } from './comments-importer';
import { RtfFieldImporter } from './field-importer';
import { RtfFontImporter } from './font-importer';
import { RtfImageImporter } from './image-importer';
import { NumberingListsImporter } from './numbering-lists-importer';
import { RtfParagraphImporter } from './paragraph-importer';
import { RtfRangePermissionImporter } from './range-permission-importer';
import { RtfSectionImporter } from './section-importer';
import { RtfShapeImporter } from './shape-importer';
import { RtfStylesImporter } from './styles-importer';
import { RtfTableImporter } from './table-importer';
export class ImportersCollection {
    constructor(data) {
        this.importers = [];
        this.style = new RtfStylesImporter(data);
        this.paragraph = new RtfParagraphImporter(data);
        this.section = new RtfSectionImporter(data);
        this.numbering = new NumberingListsImporter(data);
        this.character = new RtfCharacterImporter(data);
        this.image = new RtfImageImporter(data);
        this.field = new RtfFieldImporter(data);
        this.bookmark = new RtfBookmarkImporter(data);
        this.rangePermission = new RtfRangePermissionImporter(data);
        this.comment = new RtfCommentsImporter(data);
        this.font = new RtfFontImporter(data);
        this.table = new RtfTableImporter(data);
        this.shape = new RtfShapeImporter(data);
        this.importers = [
            this.style,
            this.paragraph,
            this.section,
            this.numbering,
            this.character,
            this.image,
            this.field,
            this.bookmark,
            this.rangePermission,
            this.comment,
            this.font,
            this.table,
            this.shape,
        ];
    }
    pushState() {
        for (let imp of this.importers)
            imp.pushState();
    }
    popState() {
        ListUtils.reverseForEach(this.importers, imp => imp.popState());
    }
    startImportSubDocument() {
        for (let imp of this.importers)
            imp.startImportSubDocument();
    }
    finalizeSubDocument() {
        for (let imp of this.importers)
            imp.finalizeSubDocument();
    }
}
