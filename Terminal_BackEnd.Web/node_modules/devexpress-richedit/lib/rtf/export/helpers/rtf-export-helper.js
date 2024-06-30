import { FontInfoCache } from '../../../core/model/caches/hashed-caches/font-info-cache';
import { ColorModelInfo } from '../../../core/model/color/color-model-info';
import { DXColor } from '../../../core/model/color/dx-color';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { RtfContentExporter } from '../exporters/rtf-content-exporter';
export class RtfExportHelper {
    constructor() {
        this.colorCollection = [];
        this.colorCollection.push(ColorModelInfo.empty);
        this.fontNamesCollection = [];
        this.numberingListCollection = {};
        this.listOverrideCollectionIndex = {};
        this.listOverrideCollection = [];
        this.defaultFontIndex = this.getFontNameIndex(FontInfoCache.defaultFontName);
        this.paragraphStylesCollectionIndex = {};
        this.characterStylesCollectionIndex = {};
        this.tableStylesCollectionIndex = {};
        this.fontCharsetTable = {};
        this.stylesCollection = [];
        this.userCollection = [];
    }
    getFontNameIndex(fontName) {
        let fontIndex = this.fontNamesCollection.indexOf(fontName);
        if (fontIndex >= 0)
            return fontIndex;
        this.fontNamesCollection.push(fontName);
        return this.fontNamesCollection.length - 1;
    }
    getColorIndex(color) {
        let colorIndex = ListUtils.indexBy(this.colorCollection, (c) => c.equals(color));
        if (colorIndex < 0) {
            colorIndex = this.colorCollection.length;
            this.colorCollection.push(color);
        }
        return colorIndex;
    }
    blendColor(color) {
        return DXColor.blend(color, DXColor.white);
    }
    getUserIndex(rangePermission) {
        let index = this.userCollection.indexOf(rangePermission.userName);
        if (index >= 0)
            return index + 1;
        const predefinedUserGroups = RtfContentExporter.predefinedUserGroups;
        const id = NumberMapUtils.keyBy(predefinedUserGroups, (g) => g == rangePermission.group);
        return id != null ? id : 0;
    }
}
