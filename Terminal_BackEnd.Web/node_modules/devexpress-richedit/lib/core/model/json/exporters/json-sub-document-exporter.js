import { boolToInt } from '@devexpress/utils/lib/utils/common';
import { JSONFieldProperty } from '../enums/json-field-enums';
import { JSONParagraphProperty } from '../enums/json-paragraph-enums';
import { JSONRunBaseProperty } from '../enums/json-run-enums';
import { JSONBookmarkProperty, JSONChunkProperty, JSONEnumLoadPieceTable, JSONRangePermissionProperty } from '../enums/json-sub-document-enums';
import { JSONTabConverter } from '../importers/json-tab-converter';
import { JSONTableExporter } from './json-table-exporter';
export class JSONSubDocumentExporter {
    static exportSubDocument(subDocument, content) {
        JSONTableExporter.exportTables(subDocument, content[JSONEnumLoadPieceTable.Tables] = []);
        JSONSubDocumentExporter.exportFields(subDocument, content[JSONEnumLoadPieceTable.Fields] = []);
        JSONSubDocumentExporter.exportBookmarks(subDocument, content[JSONEnumLoadPieceTable.Bookmarks] = []);
        JSONSubDocumentExporter.exportParagraphs(subDocument, content[JSONEnumLoadPieceTable.Paragraphs] = []);
        JSONSubDocumentExporter.exportChunks(subDocument, content[JSONEnumLoadPieceTable.Chunks] = []);
        JSONSubDocumentExporter.exportRangePermissions(subDocument, content[JSONEnumLoadPieceTable.RangePermissions] = []);
    }
    static exportFields(subDocument, jsonFields) {
        for (let field of subDocument.fields) {
            let jsonField = {};
            jsonField[JSONFieldProperty.StartPos] = field.getAllFieldInterval().start;
            jsonField[JSONFieldProperty.SeparatorPos] = field.getSeparatorPosition();
            jsonField[JSONFieldProperty.EndPos] = field.getAllFieldInterval().end;
            if (field.getHyperlinkInfo()) {
                jsonField[JSONFieldProperty.Uri] = field.getHyperlinkInfo().uri;
                jsonField[JSONFieldProperty.Anchor] = field.getHyperlinkInfo().anchor;
                jsonField[JSONFieldProperty.Tip] = field.getHyperlinkInfo().tip;
                jsonField[JSONFieldProperty.Visited] = boolToInt(field.getHyperlinkInfo().visited);
            }
            else
                jsonField[JSONFieldProperty.NoInfo] = 1;
            jsonFields.push(jsonField);
        }
    }
    static exportBookmarks(subDocument, jsonBookmarks) {
        for (let bookmark of subDocument.bookmarks) {
            let jsonBookmark = {};
            jsonBookmark[JSONBookmarkProperty.StartPos] = bookmark.start;
            jsonBookmark[JSONBookmarkProperty.Length] = bookmark.interval.length;
            jsonBookmark[JSONBookmarkProperty.Name] = bookmark.name;
            jsonBookmarks.push(jsonBookmark);
        }
    }
    static exportParagraphs(subDocument, jsonParagraphs) {
        const paragraphs = subDocument.paragraphs;
        const parStyles = subDocument.documentModel.paragraphStyles;
        const maskedParagraphPropertiesCache = subDocument.documentModel.cache.maskedParagraphPropertiesCache;
        for (let modelParagraph of paragraphs) {
            const jsonParagraph = {};
            let maskedParagraphPropertiesIndex = maskedParagraphPropertiesCache.indexOf(modelParagraph.maskedParagraphProperties);
            jsonParagraph[JSONParagraphProperty.MaskedParagraphPropertiesIndex] = maskedParagraphPropertiesIndex;
            jsonParagraph[JSONParagraphProperty.ParagraphStyleIndex] = parStyles.indexOf(modelParagraph.paragraphStyle);
            jsonParagraph[JSONParagraphProperty.LogPosition] = modelParagraph.startLogPosition.value;
            jsonParagraph[JSONParagraphProperty.Length] = modelParagraph.length;
            jsonParagraph[JSONParagraphProperty.Tabs] = JSONTabConverter.convertFromTabPropertiesToJSON(modelParagraph.tabs);
            jsonParagraph[JSONParagraphProperty.ListIndex] = modelParagraph.numberingListIndex;
            jsonParagraph[JSONParagraphProperty.ListLevelIndex] = modelParagraph.listLevelIndex;
            jsonParagraphs.push(jsonParagraph);
        }
    }
    static exportChunks(subDocument, jsonChunks) {
        const chunks = subDocument.chunks;
        const characterStyles = subDocument.documentModel.characterStyles;
        const maskedCharacterPropertiesCache = subDocument.documentModel.cache.maskedCharacterPropertiesCache;
        for (let chunk of chunks) {
            const jsonChunk = {};
            jsonChunk[JSONChunkProperty.StartPos] = chunk.startLogPosition.value;
            jsonChunk[JSONChunkProperty.TextBuffer] = chunk.textBuffer;
            jsonChunk[JSONChunkProperty.IsLast] = boolToInt(chunk.isLast);
            const jsonRuns = [];
            for (let run of chunk.textRuns) {
                let jsonRun = {};
                let maskedCharacterPropertiesIndex = maskedCharacterPropertiesCache.indexOf(run.maskedCharacterProperties);
                jsonRun[JSONRunBaseProperty.MaskedCharacterPropertiesCacheIndex] = maskedCharacterPropertiesIndex;
                jsonRun[JSONRunBaseProperty.Type] = run.getType();
                jsonRun[JSONRunBaseProperty.Offset] = run.startOffset;
                jsonRun[JSONRunBaseProperty.Length] = run.getLength();
                jsonRun[JSONRunBaseProperty.CharacterStyleIndex] = characterStyles.indexOf(run.characterStyle);
                jsonRuns.push(jsonRun);
            }
            jsonChunk[JSONChunkProperty.Runs] = jsonRuns;
            jsonChunks.push(jsonChunk);
        }
    }
    static exportRangePermissions(subDocument, jsonRangePermissions) {
        for (let rangePermission of subDocument.availableRangePermissions) {
            let jsonRangePermission = {};
            jsonRangePermission[JSONRangePermissionProperty.Start] = rangePermission.start;
            jsonRangePermission[JSONRangePermissionProperty.Length] = rangePermission.interval.length;
            jsonRangePermission[JSONRangePermissionProperty.UserName] = rangePermission.userName;
            jsonRangePermission[JSONRangePermissionProperty.Group] = rangePermission.group;
            jsonRangePermissions.push(jsonRangePermission);
        }
    }
}
