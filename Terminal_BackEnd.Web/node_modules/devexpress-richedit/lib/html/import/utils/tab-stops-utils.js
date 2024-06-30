import { TabProperties, TabInfo } from '../../../core/model/paragraph/paragraph-style';
import { TabAlign } from '../../../core/model/paragraph/paragraph';
import { TabLeaderType } from '../../../core/layout/main-structures/layout-boxes/layout-tab-space-box';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
export class HtmlImporterTabStops {
    static import(element) {
        var _a, _b;
        const result = new TabProperties();
        const tabStops = (_b = (_a = element.getAttribute('style')) === null || _a === void 0 ? void 0 : _a.split(';').find(e => e.startsWith('tab-stops:'))) === null || _b === void 0 ? void 0 : _b.replace('tab-stops:', '');
        if (tabStops) {
            const tabStopsArr = tabStops.split(' ');
            for (let i = 0; i < tabStopsArr.length; i++) {
                let align = TabAlign.Left;
                let leaderType = TabLeaderType.None;
                let parseResult = parseFloat(tabStopsArr[i]);
                while (isNaN(parseResult)) {
                    switch (tabStopsArr[i]) {
                        case 'right':
                            align = TabAlign.Right;
                            break;
                        case 'center':
                            align = TabAlign.Center;
                            break;
                        case 'decimal':
                            align = TabAlign.Decimal;
                            break;
                        case 'dotted':
                            leaderType = TabLeaderType.Dots;
                            break;
                        case 'dashed':
                            leaderType = TabLeaderType.Hyphens;
                            break;
                        case 'middot':
                            leaderType = TabLeaderType.MiddleDots;
                            break;
                        case 'heavy':
                            leaderType = TabLeaderType.ThickLine;
                            break;
                        case 'lined':
                            leaderType = TabLeaderType.Underline;
                            break;
                    }
                    i++;
                    parseResult = parseFloat(tabStopsArr[i]);
                }
                const unitStr = tabStopsArr[i].substring(tabStopsArr[i].length - 2);
                let value;
                switch (unitStr) {
                    case 'pt':
                        value = UnitConverter.pointsToTwipsF(parseResult);
                        break;
                    case 'cm':
                        value = UnitConverter.centimetersToTwipsF(parseResult);
                        break;
                    case 'in':
                        value = UnitConverter.inchesToTwipsF(parseResult);
                        break;
                    case 'pc':
                        value = UnitConverter.picasToTwips(parseResult);
                        break;
                    default:
                        console.warn(`Unknown unit: ${unitStr}. Tab stop skipped`);
                        continue;
                }
                const tab = new TabInfo(value, align, leaderType, false, false);
                result.add(tab);
            }
        }
        return result;
    }
}
