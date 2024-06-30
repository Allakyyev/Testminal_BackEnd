import { StringUtils } from '@devexpress/utils/lib/utils/string';
export class WordProcessingMLValue {
    constructor(openXmlValue, wordMLValue) {
        this.openXmlValue = openXmlValue;
        this.wordMLValue = wordMLValue !== undefined ? wordMLValue : this.convertToWordML(openXmlValue);
    }
    convertToWordML(openXmlValue) {
        const count = openXmlValue.length;
        const result = [];
        for (let i = 0; i < count; i++) {
            const currentChar = openXmlValue[i];
            if (StringUtils.stringInUpperCase(currentChar)) {
                result.push('-');
                result.push(currentChar.toLowerCase());
            }
            else
                result.push(currentChar);
        }
        return result.join('');
    }
}
