import { RichEditClientCommand } from '../../base/commands/client-command';
import { Comparers } from '@devexpress/utils/lib/utils/comparers';
export class ClientFontChangesListener {
    constructor(controlOwner) {
        this.controlOwner = controlOwner;
    }
    NotifyFontAdded(font) {
        this.changeRibbonFontList((oldDataSource) => {
            oldDataSource.push({ text: font.name, value: font.name });
            oldDataSource.sort((a, b) => Comparers.string(a.text, b.text));
            return oldDataSource;
        });
    }
    NotifyFontRemoved(font) {
        this.changeRibbonFontList((oldDataSource) => {
            const fNames = oldDataSource.filter(fontName => fontName.text != font.name);
            return fNames.sort();
        });
    }
    NotifyFontListChanged(fontCache) {
        const fonts = fontCache.getFontNames(true).map(name => {
            return { text: name, value: name };
        });
        this.changeRibbonFontList((_oldDataSource) => {
            return fonts;
        });
    }
    changeRibbonFontList(change) {
        const ribbonBar = this.controlOwner.barHolder.ribbon;
        if (ribbonBar) {
            const fontNameToolBarItems = ribbonBar.ribbon.getItems(RichEditClientCommand.ChangeFontName);
            if (fontNameToolBarItems) {
                const fontNameSelectBoxWidget = fontNameToolBarItems[0].widget;
                const dataSource = fontNameSelectBoxWidget.option('dataSource');
                const newDataSource = change(dataSource);
                fontNameSelectBoxWidget.option('dataSource', newDataSource);
            }
        }
    }
}
