export class DxtUtils {
    static correctIconName(icon) {
        return icon.indexOf('dx') == 0 ? ` ${icon}` : icon;
    }
    static correctItemsIcons(items) {
        if (!items)
            return;
        items.forEach(i => {
            i.icon = i.icon ? DxtUtils.correctIconName(i.icon) : undefined;
            DxtUtils.correctItemsIcons(i.items);
        });
    }
}
