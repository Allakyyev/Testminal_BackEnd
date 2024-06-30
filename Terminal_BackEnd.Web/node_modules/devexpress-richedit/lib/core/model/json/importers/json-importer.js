import { Size } from '@devexpress/utils/lib/geometry/size';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { Section } from '../../section/section';
import { JSONControlOptionsProperty } from '../enums/json-control-enums';
import { DocumentProtectionType, JSONCompatibilitySettingsProperty, JSONDocumentPropertiesProperty, JSONDocumentProtectionPropertiesProperty } from '../enums/json-document-enums';
import { JSONFixedInterval, JSONSize } from '../enums/json-general-enums';
import { JSONSection } from '../enums/json-section-enums';
import { JSONHeaderFooterInfoProperty } from '../enums/json-sub-document-enums';
import { JSONSectionPropertiesConverter } from './section/json-section-properties-converter';
import { JSONTableCellPropertiesConverter } from './table/json-table-cell-properties-converter';
import { JSONTablePropertiesConverter } from './table/json-table-properties-converter';
import { JSONTableRowPropertiesConverter } from './table/json-table-row-properties-converter';
export class JSONImporter {
    static importDocumentProperties(documentModel, content) {
        documentModel.defaultTabWidth = content[JSONDocumentPropertiesProperty.DefaultTabWidth];
        documentModel.differentOddAndEvenPages = !!content[JSONDocumentPropertiesProperty.DifferentOddAndEvenPages];
        documentModel.displayBackgroundShape = !!content[JSONDocumentPropertiesProperty.DisplayBackgroundShape];
        documentModel.pageBackColor = content[JSONDocumentPropertiesProperty.PageBackColor];
        documentModel.setDefaultCharacterProperties(content[JSONDocumentPropertiesProperty.DefaultCharacterProperties]);
        documentModel.setDefaultParagraphProperties(content[JSONDocumentPropertiesProperty.DefaultParagraphProperties]);
        documentModel.defaultTableProperties = JSONTablePropertiesConverter.convertFromJSON(content[JSONDocumentPropertiesProperty.DefaultTableProperties], documentModel.cache.colorModelInfoCache, documentModel.cache.shadingInfoCache);
        documentModel.defaultTableRowProperties = documentModel.cache.tableRowPropertiesCache.getItem(JSONTableRowPropertiesConverter.convertFromJSON(content[JSONDocumentPropertiesProperty.DefaultTableRowProperties]));
        documentModel.defaultTableCellProperties = documentModel.cache.tableCellPropertiesCache.getItem(JSONTableCellPropertiesConverter.convertFromJSON(content[JSONDocumentPropertiesProperty.DefaultTableCellProperties], documentModel.cache.colorModelInfoCache, documentModel.cache.shadingInfoCache));
        const protectionProp = content[JSONDocumentPropertiesProperty.ProtectionProperties];
        const enforceProtection = !!(protectionProp[JSONDocumentProtectionPropertiesProperty.EnforceProtection]);
        const protectionType = protectionProp[JSONDocumentProtectionPropertiesProperty.ProtectionType];
        documentModel.aspxIsDocumentProtectionEnabled = enforceProtection && (protectionType === DocumentProtectionType.ReadOnly || protectionType === DocumentProtectionType.AllowComments);
    }
    static importCompatibilitySettings(documentModel, json) {
        documentModel.compatibilitySettings.dontJustifyLinesEndingInSoftLineBreak = !!json[JSONCompatibilitySettingsProperty.DontJustifyLinesEndingInSoftLineBreak];
        const compatibilityMode = json[JSONCompatibilitySettingsProperty.CompatibilityMode];
        if (compatibilityMode)
            documentModel.compatibilitySettings.compatibilityMode = json[JSONCompatibilitySettingsProperty.CompatibilityMode];
    }
    static importModelHeaderFooter(modelContainer, jsonContent, constr) {
        for (let content of jsonContent) {
            const headerFooter = new constr(content[JSONHeaderFooterInfoProperty.SubDocumentId]);
            headerFooter.headerFooterType = content[JSONHeaderFooterInfoProperty.Type];
            modelContainer.push(headerFooter);
        }
    }
    static importSections(documentModel, jsonSections) {
        for (let jsonSection of jsonSections)
            documentModel.sections.push(new Section(documentModel, documentModel.mainSubDocument.positionManager.registerPosition(jsonSection[JSONSection.StartPos]), jsonSection[JSONSection.Length], JSONSectionPropertiesConverter.convertFromJSON(jsonSection[JSONSection.Properties])));
        for (var i = 0, jsonSection; jsonSection = jsonSections[i]; i++) {
            const section = documentModel.sections[i];
            this.importHeaderFooter(section.headers, jsonSection[JSONSection.Headers]);
            this.importHeaderFooter(section.footers, jsonSection[JSONSection.Footers]);
        }
    }
    static importHeaderFooter(container, jsonSection) {
        NumberMapUtils.forEach(jsonSection, (section, type) => container.setObjectIndex(type, section));
    }
    static importOptions(controlOptions, json) {
        if (!json)
            return;
        if (json[JSONControlOptionsProperty.Copy] !== undefined)
            controlOptions.copy = json[JSONControlOptionsProperty.Copy];
        if (json[JSONControlOptionsProperty.CreateNew] !== undefined)
            controlOptions.createNew = json[JSONControlOptionsProperty.CreateNew];
        if (json[JSONControlOptionsProperty.Cut] !== undefined)
            controlOptions.cut = json[JSONControlOptionsProperty.Cut];
        if (json[JSONControlOptionsProperty.Drag] !== undefined)
            controlOptions.drag = json[JSONControlOptionsProperty.Drag];
        if (json[JSONControlOptionsProperty.Drop] !== undefined)
            controlOptions.drop = json[JSONControlOptionsProperty.Drop];
        if (json[JSONControlOptionsProperty.Open] !== undefined)
            controlOptions.open = json[JSONControlOptionsProperty.Open];
        if (json[JSONControlOptionsProperty.Paste] !== undefined)
            controlOptions.paste = json[JSONControlOptionsProperty.Paste];
        if (json[JSONControlOptionsProperty.Printing] !== undefined)
            controlOptions.printing = json[JSONControlOptionsProperty.Printing];
        if (json[JSONControlOptionsProperty.Save] !== undefined)
            controlOptions.save = json[JSONControlOptionsProperty.Save];
        if (json[JSONControlOptionsProperty.SaveAs] !== undefined)
            controlOptions.saveAs = json[JSONControlOptionsProperty.SaveAs];
        if (json[JSONControlOptionsProperty.FullScreen] !== undefined)
            controlOptions.fullScreen = json[JSONControlOptionsProperty.FullScreen];
        if (json[JSONControlOptionsProperty.Bookmarks] !== undefined)
            controlOptions.bookmarks = json[JSONControlOptionsProperty.Bookmarks];
        if (json[JSONControlOptionsProperty.CharacterFormatting] !== undefined)
            controlOptions.characterFormatting = json[JSONControlOptionsProperty.CharacterFormatting];
        if (json[JSONControlOptionsProperty.CharacterStyle] !== undefined)
            controlOptions.characterStyle = json[JSONControlOptionsProperty.CharacterStyle];
        if (json[JSONControlOptionsProperty.Fields] !== undefined)
            controlOptions.fields = json[JSONControlOptionsProperty.Fields];
        if (json[JSONControlOptionsProperty.Hyperlinks] !== undefined)
            controlOptions.hyperlinks = json[JSONControlOptionsProperty.Hyperlinks];
        if (json[JSONControlOptionsProperty.InlinePictures] !== undefined)
            controlOptions.inlinePictures = json[JSONControlOptionsProperty.InlinePictures];
        if (json[JSONControlOptionsProperty.ParagraphFormatting] !== undefined)
            controlOptions.paragraphFormatting = json[JSONControlOptionsProperty.ParagraphFormatting];
        if (json[JSONControlOptionsProperty.Paragraphs] !== undefined)
            controlOptions.paragraphs = json[JSONControlOptionsProperty.Paragraphs];
        if (json[JSONControlOptionsProperty.ParagraphStyle] !== undefined)
            controlOptions.paragraphStyle = json[JSONControlOptionsProperty.ParagraphStyle];
        if (json[JSONControlOptionsProperty.ParagraphTabs] !== undefined)
            controlOptions.paragraphTabs = json[JSONControlOptionsProperty.ParagraphTabs];
        if (json[JSONControlOptionsProperty.Sections] !== undefined)
            controlOptions.sections = json[JSONControlOptionsProperty.Sections];
        if (json[JSONControlOptionsProperty.TabSymbol] !== undefined)
            controlOptions.tabSymbol = json[JSONControlOptionsProperty.TabSymbol];
        if (json[JSONControlOptionsProperty.Undo] !== undefined)
            controlOptions.undo = json[JSONControlOptionsProperty.Undo];
        if (json[JSONControlOptionsProperty.NumberingBulleted] !== undefined)
            controlOptions.numberingBulleted = json[JSONControlOptionsProperty.NumberingBulleted];
        if (json[JSONControlOptionsProperty.NumberingMultiLevel] !== undefined)
            controlOptions.numberingMultiLevel = json[JSONControlOptionsProperty.NumberingMultiLevel];
        if (json[JSONControlOptionsProperty.NumberingSimple] !== undefined)
            controlOptions.numberingSimple = json[JSONControlOptionsProperty.NumberingSimple];
        if (json[JSONControlOptionsProperty.HeadersFooters] !== undefined)
            controlOptions.headersFooters = json[JSONControlOptionsProperty.HeadersFooters];
        if (json[JSONControlOptionsProperty.Tables] !== undefined)
            controlOptions.tables = json[JSONControlOptionsProperty.Tables];
        if (json[JSONControlOptionsProperty.TableStyle] !== undefined)
            controlOptions.tableStyle = json[JSONControlOptionsProperty.TableStyle];
        if (json[JSONControlOptionsProperty.TabMarker] !== undefined)
            controlOptions.tabMarker = json[JSONControlOptionsProperty.TabMarker];
        if (json[JSONControlOptionsProperty.PageBreakInsertMode] !== undefined)
            controlOptions.pageBreakInsertMode = json[JSONControlOptionsProperty.PageBreakInsertMode];
        if (json[JSONControlOptionsProperty.AcceptsTab] !== undefined)
            controlOptions.acceptsTab = !!json[JSONControlOptionsProperty.AcceptsTab];
        if (json[JSONControlOptionsProperty.Download] !== undefined)
            controlOptions.download = json[JSONControlOptionsProperty.Download];
        controlOptions.raiseClientEventsOnModificationsViaAPI = !!json[JSONControlOptionsProperty.RaiseClientEventsOnModificationsViaAPI];
    }
}
export class JSONFixedIntervalConverter {
    static convertFromJSON(obj) {
        return new FixedInterval(obj[JSONFixedInterval.Start], obj[JSONFixedInterval.Length]);
    }
    static convertToJSON(source) {
        const result = {};
        result[JSONFixedInterval.Start] = source.start;
        result[JSONFixedInterval.Length] = source.length;
        return result;
    }
    static convertListToJSON(intervals) {
        return ListUtils.accumulate(intervals, [], (result, interval) => {
            result.push(JSONFixedIntervalConverter.convertToJSON(interval));
            return result;
        });
    }
    static convertListFromJSON(jsonIntervals) {
        return ListUtils.accumulate(jsonIntervals, [], (result, jsonInterval) => {
            result.push(JSONFixedIntervalConverter.convertFromJSON(jsonInterval));
            return result;
        });
    }
}
export class SizeExporter {
    static convertFromJSON(obj) {
        return new Size(obj[JSONSize.Width], obj[JSONSize.Height]);
    }
    static convertToJSON(obj) {
        const jsonSize = {};
        jsonSize[JSONSize.Width] = obj.width;
        jsonSize[JSONSize.Height] = obj.height;
        return jsonSize;
    }
    static convertToJSONSeparately(width, height) {
        const jsonSize = {};
        jsonSize[JSONSize.Width] = width;
        jsonSize[JSONSize.Height] = height;
        return jsonSize;
    }
}
