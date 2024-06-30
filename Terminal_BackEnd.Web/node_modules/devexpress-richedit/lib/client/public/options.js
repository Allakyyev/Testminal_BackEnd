import { RichEditUnit } from '../../base-utils/unit-converter';
import { SimpleContextMenu } from './context-menu/menu';
import { createRibbon } from './ribbon/creator';
import { RichEdit } from './rich-edit';
export * from './ribbon/index';
export function createOptions() {
    const options = {
        ribbon: createRibbon(),
        events: {},
        pdf: {},
        search: {},
        printing: {
            closePrintDialogWithHtmlPreview: true
        },
        fields: {},
        confirmOnLosingChanges: {},
        mailMerge: {},
        fonts: {
            fonts: [],
            mappings: {
                rules: []
            }
        },
        autoCorrect: {
            replaceInfoCollection: []
        },
        bookmarks: {
            visibility: false
        },
        contextMenu: new SimpleContextMenu(),
        authentication: {},
        rangePermissions: {
            highlightRanges: true,
            showBrackets: true,
        },
        view: {
            simpleViewSettings: {
                paddings: {
                    left: 15,
                    right: 15,
                    top: 15,
                    bottom: 15,
                }
            },
            printLayoutViewSettings: {
                showHorizontalRuler: true
            }
        },
        spellCheck: {
            enabled: false,
        },
        document: {}
    };
    return options;
}
export function create(htmlElement, options) {
    return new RichEdit(htmlElement, options);
}
export { RichEditUnit };
