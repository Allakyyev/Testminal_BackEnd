import { BorderLineStyle } from '../../../../core/model/borders/enums';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { OpenXmlColorImportHelper } from '../../color/open-xml-color-import-helper';
import { LeafSetMaskedPropertyDestination } from '../destination';
export class TableBorderElementDestinationBase extends LeafSetMaskedPropertyDestination {
    get border() { return this.desc.getProp(this.properties); }
    getColor(reader) {
        return this.data.documentModel.cache.colorModelInfoCache.getItem(OpenXmlColorImportHelper.createColorModelInfo(this.data, reader, 'color'));
    }
    setBorderOffset(space) {
        this.border.offset = UnitConverter.pointsToTwips(space);
        this.properties.setValue(this.desc, this.border);
    }
    setBorderWidth(size) {
        this.border.width = Math.round(UnitConverter.pointsToTwipsF(size * 0.125));
        this.properties.setValue(this.desc, this.border);
    }
    setBorderLineStyle(borderLineStyle) {
        this.border.style = borderLineStyle == BorderLineStyle.Nil ? BorderLineStyle.None : borderLineStyle;
        this.properties.setValue(this.desc, this.border);
    }
}
