import { SectionColumnProperties } from '../../../section/section-column-properties';
import { JSONColumnInfoProperty } from '../../enums/json-section-enums';
export class JSONColumnsSectionPropertiesConverter {
    static convertFromJSON(jsonColumns) {
        const result = [];
        for (let jsonColumn of jsonColumns)
            result.push(new SectionColumnProperties(jsonColumn[JSONColumnInfoProperty.Width], jsonColumn[JSONColumnInfoProperty.Space]));
        return result;
    }
    static convertToJSON(columns) {
        const result = [];
        for (let column of columns) {
            const jsonColumn = {};
            jsonColumn[JSONColumnInfoProperty.Width] = column.width;
            jsonColumn[JSONColumnInfoProperty.Space] = column.space;
            result.push(jsonColumn);
        }
        return result;
    }
}
