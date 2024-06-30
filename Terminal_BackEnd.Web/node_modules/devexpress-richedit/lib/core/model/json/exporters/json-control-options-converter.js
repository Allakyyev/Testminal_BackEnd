import { boolToInt } from '@devexpress/utils/lib/utils/common';
import { ControlOptions } from '../../options/control';
import { JSONControlOptionsProperty } from '../enums/json-control-enums';
export class JSONControlOptionsConverter {
    static convertFromJSON(obj) {
        if (!obj)
            return;
        const result = new ControlOptions();
        if (obj[JSONControlOptionsProperty.Copy] !== undefined)
            result.copy = obj[JSONControlOptionsProperty.Copy];
        if (obj[JSONControlOptionsProperty.CreateNew] !== undefined)
            result.createNew = obj[JSONControlOptionsProperty.CreateNew];
        if (obj[JSONControlOptionsProperty.Cut] !== undefined)
            result.cut = obj[JSONControlOptionsProperty.Cut];
        if (obj[JSONControlOptionsProperty.Drag] !== undefined)
            result.drag = obj[JSONControlOptionsProperty.Drag];
        if (obj[JSONControlOptionsProperty.Drop] !== undefined)
            result.drop = obj[JSONControlOptionsProperty.Drop];
        if (obj[JSONControlOptionsProperty.Open] !== undefined)
            result.open = obj[JSONControlOptionsProperty.Open];
        if (obj[JSONControlOptionsProperty.Paste] !== undefined)
            result.paste = obj[JSONControlOptionsProperty.Paste];
        if (obj[JSONControlOptionsProperty.Printing] !== undefined)
            result.printing = obj[JSONControlOptionsProperty.Printing];
        if (obj[JSONControlOptionsProperty.Save] !== undefined)
            result.save = obj[JSONControlOptionsProperty.Save];
        if (obj[JSONControlOptionsProperty.SaveAs] !== undefined)
            result.saveAs = obj[JSONControlOptionsProperty.SaveAs];
        if (obj[JSONControlOptionsProperty.FullScreen] !== undefined)
            result.fullScreen = obj[JSONControlOptionsProperty.FullScreen];
        if (obj[JSONControlOptionsProperty.Bookmarks] !== undefined)
            result.bookmarks = obj[JSONControlOptionsProperty.Bookmarks];
        if (obj[JSONControlOptionsProperty.CharacterFormatting] !== undefined)
            result.characterFormatting = obj[JSONControlOptionsProperty.CharacterFormatting];
        if (obj[JSONControlOptionsProperty.CharacterStyle] !== undefined)
            result.characterStyle = obj[JSONControlOptionsProperty.CharacterStyle];
        if (obj[JSONControlOptionsProperty.Fields] !== undefined)
            result.fields = obj[JSONControlOptionsProperty.Fields];
        if (obj[JSONControlOptionsProperty.Hyperlinks] !== undefined)
            result.hyperlinks = obj[JSONControlOptionsProperty.Hyperlinks];
        if (obj[JSONControlOptionsProperty.InlinePictures] !== undefined)
            result.inlinePictures = obj[JSONControlOptionsProperty.InlinePictures];
        if (obj[JSONControlOptionsProperty.ParagraphFormatting] !== undefined)
            result.paragraphFormatting = obj[JSONControlOptionsProperty.ParagraphFormatting];
        if (obj[JSONControlOptionsProperty.Paragraphs] !== undefined)
            result.paragraphs = obj[JSONControlOptionsProperty.Paragraphs];
        if (obj[JSONControlOptionsProperty.ParagraphStyle] !== undefined)
            result.paragraphStyle = obj[JSONControlOptionsProperty.ParagraphStyle];
        if (obj[JSONControlOptionsProperty.ParagraphTabs] !== undefined)
            result.paragraphTabs = obj[JSONControlOptionsProperty.ParagraphTabs];
        if (obj[JSONControlOptionsProperty.Sections] !== undefined)
            result.sections = obj[JSONControlOptionsProperty.Sections];
        if (obj[JSONControlOptionsProperty.TabSymbol] !== undefined)
            result.tabSymbol = obj[JSONControlOptionsProperty.TabSymbol];
        if (obj[JSONControlOptionsProperty.Undo] !== undefined)
            result.undo = obj[JSONControlOptionsProperty.Undo];
        if (obj[JSONControlOptionsProperty.NumberingBulleted] !== undefined)
            result.numberingBulleted = obj[JSONControlOptionsProperty.NumberingBulleted];
        if (obj[JSONControlOptionsProperty.NumberingMultiLevel] !== undefined)
            result.numberingMultiLevel = obj[JSONControlOptionsProperty.NumberingMultiLevel];
        if (obj[JSONControlOptionsProperty.NumberingSimple] !== undefined)
            result.numberingSimple = obj[JSONControlOptionsProperty.NumberingSimple];
        if (obj[JSONControlOptionsProperty.HeadersFooters] !== undefined)
            result.headersFooters = obj[JSONControlOptionsProperty.HeadersFooters];
        if (obj[JSONControlOptionsProperty.Tables] !== undefined)
            result.tables = obj[JSONControlOptionsProperty.Tables];
        if (obj[JSONControlOptionsProperty.TableStyle] !== undefined)
            result.tableStyle = obj[JSONControlOptionsProperty.TableStyle];
        if (obj[JSONControlOptionsProperty.TabMarker] !== undefined)
            result.tabMarker = obj[JSONControlOptionsProperty.TabMarker];
        if (obj[JSONControlOptionsProperty.PageBreakInsertMode] !== undefined)
            result.pageBreakInsertMode = obj[JSONControlOptionsProperty.PageBreakInsertMode];
        if (obj[JSONControlOptionsProperty.AcceptsTab] !== undefined)
            result.acceptsTab = obj[JSONControlOptionsProperty.AcceptsTab];
        if (obj[JSONControlOptionsProperty.Download] !== undefined)
            result.download = obj[JSONControlOptionsProperty.Download];
        result.raiseClientEventsOnModificationsViaAPI = !!obj[JSONControlOptionsProperty.RaiseClientEventsOnModificationsViaAPI];
        return result;
    }
    static convertToJSON(source) {
        const result = {};
        result[JSONControlOptionsProperty.Copy] = source.copy;
        result[JSONControlOptionsProperty.CreateNew] = source.createNew;
        result[JSONControlOptionsProperty.Cut] = source.cut;
        result[JSONControlOptionsProperty.Drag] = source.drag;
        result[JSONControlOptionsProperty.Drop] = source.drop;
        result[JSONControlOptionsProperty.Open] = source.open;
        result[JSONControlOptionsProperty.Paste] = source.paste;
        result[JSONControlOptionsProperty.Printing] = source.printing;
        result[JSONControlOptionsProperty.Save] = source.save;
        result[JSONControlOptionsProperty.SaveAs] = source.saveAs;
        result[JSONControlOptionsProperty.FullScreen] = source.fullScreen;
        result[JSONControlOptionsProperty.Bookmarks] = source.bookmarks;
        result[JSONControlOptionsProperty.CharacterFormatting] = source.characterFormatting;
        result[JSONControlOptionsProperty.CharacterStyle] = source.characterStyle;
        result[JSONControlOptionsProperty.Fields] = source.fields;
        result[JSONControlOptionsProperty.Hyperlinks] = source.hyperlinks;
        result[JSONControlOptionsProperty.InlinePictures] = source.inlinePictures;
        result[JSONControlOptionsProperty.ParagraphFormatting] = source.paragraphFormatting;
        result[JSONControlOptionsProperty.Paragraphs] = source.paragraphs;
        result[JSONControlOptionsProperty.ParagraphStyle] = source.paragraphStyle;
        result[JSONControlOptionsProperty.ParagraphTabs] = source.paragraphTabs;
        result[JSONControlOptionsProperty.Sections] = source.sections;
        result[JSONControlOptionsProperty.TabSymbol] = source.tabSymbol;
        result[JSONControlOptionsProperty.Undo] = source.undo;
        result[JSONControlOptionsProperty.NumberingBulleted] = source.numberingBulleted;
        result[JSONControlOptionsProperty.NumberingMultiLevel] = source.numberingMultiLevel;
        result[JSONControlOptionsProperty.NumberingSimple] = source.numberingSimple;
        result[JSONControlOptionsProperty.HeadersFooters] = source.headersFooters;
        result[JSONControlOptionsProperty.Tables] = source.tables;
        result[JSONControlOptionsProperty.TableStyle] = source.tableStyle;
        result[JSONControlOptionsProperty.TabMarker] = source.tabMarker;
        result[JSONControlOptionsProperty.PageBreakInsertMode] = source.pageBreakInsertMode;
        result[JSONControlOptionsProperty.AcceptsTab] = boolToInt(source.acceptsTab);
        result[JSONControlOptionsProperty.Download] = source.download;
        result[JSONControlOptionsProperty.RaiseClientEventsOnModificationsViaAPI] = source.raiseClientEventsOnModificationsViaAPI;
        return result;
    }
}
