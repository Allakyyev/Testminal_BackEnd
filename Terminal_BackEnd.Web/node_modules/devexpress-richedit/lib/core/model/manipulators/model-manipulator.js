import { EventDispatcher } from '../../../base-utils/event-dispatcher';
import { BookmarksManipulator } from './bookmarks-manipulator';
import { CharacterPropertiesManipulator } from './character-properties-manipulator';
import { DocumentMerger } from './doc-merger/merger';
import { DocumentPropertiesManipulator } from './document-properties-manipulator';
import { DocumentProtectionPropertiesManipulator } from './document-protection-properties-manipulator';
import { FieldsManipulator } from './fields-manipulator';
import { FloatingObjectsManipulator } from './floating-objects/floating-objects-manipulator';
import { FontManipulator } from './font-manipulator';
import { FooterManipulator, HeaderManipulator } from './header-footer-manipulator';
import { InlineObjectManipulator } from './inline-object-manipulator';
import { NumberingListManipulator } from './numbering-lists/numbering-list-manipulator';
import { ParagraphManipulator } from './paragraph-manipulator/paragraph-manipulator';
import { ParagraphPropertiesManipulator } from './paragraph-properties-manipulator';
import { PictureManipulator } from './picture-manipulator/picture-manipulator';
import { RangePermissionManipulator } from './range-permission-manipulator';
import { RangeManipulator } from './range/range-manipulator';
import { SectionManipulator } from './section-manipulator';
import { SectionPropertiesManipulator } from './section-properties-manipulator';
import { StylesManipulator } from './styles-manipulator';
import { SubDocumentManipulator } from './sub-document-manipulator';
import { TablesManipulator } from './tables/tables-manipulator';
import { TabsManipulator } from './tabs-manipulator';
import { TextBoxManipulator } from './text-box-manipulator';
import { TextCaseManipulator } from './text-case-manipulator';
import { TextManipulator } from './text-manipulator/text-manipulator';
export class ModelManipulator {
    constructor(modelManager, batchUpdatableObject) {
        this.modelListeners = [];
        this.onFontsChanged = new EventDispatcher();
        this.batchUpdatableObject = batchUpdatableObject;
        this.modelManager = modelManager;
        this.floatingObject = new FloatingObjectsManipulator(this);
        this.numberingList = new NumberingListManipulator(this);
        this.range = new RangeManipulator(this);
        this.table = new TablesManipulator(this);
        this.bookmark = new BookmarksManipulator(this);
        this.rangePermission = new RangePermissionManipulator(this);
        this.characterProperties = new CharacterPropertiesManipulator(this);
        this.documentProperties = new DocumentPropertiesManipulator(this);
        this.documentProtectionProperties = new DocumentProtectionPropertiesManipulator(this);
        this.field = new FieldsManipulator(this);
        this.font = new FontManipulator(this);
        this.header = new HeaderManipulator(this);
        this.footer = new FooterManipulator(this);
        this.inlineObject = new InlineObjectManipulator(this);
        this.paragraphProperties = new ParagraphPropertiesManipulator(this);
        this.sectionProperties = new SectionPropertiesManipulator(this);
        this.style = new StylesManipulator(this);
        this.subDocument = new SubDocumentManipulator(this);
        this.tab = new TabsManipulator(this);
        this.textCase = new TextCaseManipulator(this);
        this.text = new TextManipulator(this);
        this.paragraph = new ParagraphManipulator(this);
        this.picture = new PictureManipulator(this);
        this.textBox = new TextBoxManipulator(this);
        this.section = new SectionManipulator(this);
        this.documentMerger = new DocumentMerger(this);
    }
    get model() { return this.modelManager.model; }
    notifyModelChanged(change) {
        this.modelListeners.forEach(listener => listener.modelChanged(change));
    }
    removeModelListener(listener) {
        const index = this.modelListeners.indexOf(listener);
        if (index >= 0)
            this.modelListeners.splice(index, 1);
    }
    raiseFontAdded(newFontInfo) {
        if (newFontInfo)
            this.onFontsChanged.listeners.forEach(listener => listener.NotifyFontAdded(newFontInfo));
    }
    raiseFontRemoved(font) {
        if (font)
            this.onFontsChanged.listeners.forEach(listener => listener.NotifyFontRemoved(font));
    }
    raiseFontListChanged(fontCache) {
        this.onFontsChanged.listeners.forEach(listener => listener.NotifyFontListChanged(fontCache));
    }
    clearListeners() {
        this.onFontsChanged.clear();
        this.modelListeners = [];
    }
}
