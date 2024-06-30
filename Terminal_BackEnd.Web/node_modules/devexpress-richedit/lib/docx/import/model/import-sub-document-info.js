import { Table } from '../../../core/model/tables/main-structures/table';
import { Stack } from '@devexpress/utils/lib/class/stack';
import { BookmarkImporter } from '../importers/bookmark-importer';
import { CharacterImporter } from '../importers/character-importer';
import { CommentsImporter } from '../importers/comments-importer';
import { FieldImporter } from '../importers/field-importer';
import { ParagraphImporter } from '../importers/paragraph-importer';
import { PositionImporter } from '../importers/position-importer';
import { RangePermissionImporter } from '../importers/range-permission-importer';
import { TableImporter } from '../importers/table-importer';
export class ImportSubDocumentInfo {
    constructor(data, subDocument, comments = {}, activeComment = null) {
        this.data = data;
        this.subDocument = subDocument;
        this.comments = comments;
        this.activeComment = activeComment;
        this.tableStack = new Stack();
        this.fieldInfoStack = new Stack();
        this.positionImporter = new PositionImporter(this.data);
        this.characterImporter = new CharacterImporter(this.data);
        this.paragraphImporter = new ParagraphImporter(this.data);
        this.bookmarkImporter = new BookmarkImporter(this.data);
        this.commentsImporter = new CommentsImporter(this.data);
        this.fieldImporter = new FieldImporter(this.data);
        this.rangePermissionImporter = new RangePermissionImporter(this.data);
        this.tableImporter = new TableImporter(this.data);
    }
    endImport() {
        this.rangePermissionImporter.insertRangePermissions();
        this.fieldImporter.deleteInvalidFieldsInfo();
        Table.sort(this.subDocument.tables);
        Table.fillTableByLevels(this.subDocument);
        this.bookmarkImporter.insertBookmarks();
        if (!this.subDocument.paragraphs.length)
            this.data.subDocumentInfo.paragraphImporter.insertParagraph();
    }
}
