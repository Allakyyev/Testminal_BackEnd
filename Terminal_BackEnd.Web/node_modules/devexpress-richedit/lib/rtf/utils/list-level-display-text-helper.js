export class ListLevelDisplayTextHelper {
    static createDisplayFormatStringCore(placeholderIndices, text) {
        var sb = [];
        let textRange = ListLevelDisplayTextHelper.getTextRange(placeholderIndices, 0, text);
        if (textRange)
            sb.push(textRange);
        for (let i = 1; i < placeholderIndices.length - 1; i++) {
            const placeholderIndex = placeholderIndices[i];
            if (text.length <= placeholderIndex)
                break;
            sb.push('{');
            sb.push(text.charCodeAt(placeholderIndex).toString());
            sb.push('}');
            sb.push(ListLevelDisplayTextHelper.getTextRange(placeholderIndices, i, text));
        }
        return sb.join("");
    }
    static getTextRange(placeholderIndices, startPlaceHolderIndex, text) {
        var index = placeholderIndices[startPlaceHolderIndex] + 1;
        var result = text.substr(index, placeholderIndices[startPlaceHolderIndex + 1] - index);
        result = result.replace("{", "{{");
        result = result.replace("}", "}}");
        return result;
    }
}
