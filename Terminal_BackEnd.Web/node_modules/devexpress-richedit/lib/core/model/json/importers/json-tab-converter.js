import { boolToInt } from '@devexpress/utils/lib/utils/common';
import { TabInfo, TabProperties } from '../../paragraph/paragraph-style';
import { JSONTabInfoProperty } from '../enums/json-sub-document-enums';
export class JSONTabConverter {
    static convertFromJSONToTabProperties(obj) {
        const tabs = new TabProperties();
        for (let jsonTab of obj)
            tabs.tabsInfo.push(JSONTabConverter.convertFromJSON(jsonTab));
        return tabs;
    }
    static convertFromJSON(obj) {
        return new TabInfo(obj[JSONTabInfoProperty.Position], obj[JSONTabInfoProperty.Alignment], obj[JSONTabInfoProperty.LeaderType], !!obj[JSONTabInfoProperty.IsDeleted], !!obj[JSONTabInfoProperty.IsDefault]);
    }
    static convertToJSON(source) {
        var result = {};
        result[JSONTabInfoProperty.Position] = source.position;
        result[JSONTabInfoProperty.Alignment] = source.alignment;
        result[JSONTabInfoProperty.LeaderType] = source.leader;
        result[JSONTabInfoProperty.IsDeleted] = boolToInt(source.deleted);
        result[JSONTabInfoProperty.IsDefault] = boolToInt(source.isDefault);
        return result;
    }
    static convertFromTabPropertiesToJSON(source) {
        var result = [];
        for (let tab of source.tabsInfo)
            result.push(JSONTabConverter.convertToJSON(tab));
        return result;
    }
}
