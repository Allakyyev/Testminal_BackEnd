import { formatMessage } from 'devextreme/localization';
export class ContextMenuItem {
    constructor(id, options) {
        var _a, _b, _c;
        this.id = id;
        this.localizationId = options.localizationId;
        this.text = options.text ? options.text : (this.localizationId ? formatMessage(this.localizationId) : '');
        this.icon = options.icon;
        this.items = options.items;
        this.beginGroup = (_a = options.beginGroup) !== null && _a !== void 0 ? _a : false;
        this.disabled = (_b = options.disabled) !== null && _b !== void 0 ? _b : false;
        this.visible = (_c = options.visible) !== null && _c !== void 0 ? _c : true;
    }
}
export function cloneContextMenuItem(item) {
    return new ContextMenuItem(item.id, {
        text: item.text,
        localizationId: item.localizationId,
        beginGroup: item.beginGroup,
        icon: item.icon,
        items: item.items,
        disabled: item.disabled,
        visible: item.visible,
    });
}
