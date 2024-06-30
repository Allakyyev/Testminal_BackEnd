export class DocumentProtectionSettings {
    constructor() {
        this.highlightRanges = true;
        this.showBrackets = true;
        this.rangeHighlightColor = 'rgb(150, 200, 150)';
        this.rangeHighlightBracketsColor = 'rgb(127, 127, 127)';
        this.authenticationEMail = '';
        this.authenticationGroup = '';
        this.authenticationUserName = '';
    }
    copyFrom(obj) {
        this.highlightRanges = obj.highlightRanges;
        this.showBrackets = obj.showBrackets;
        this.rangeHighlightColor = obj.rangeHighlightColor;
        this.rangeHighlightBracketsColor = obj.rangeHighlightBracketsColor;
        this.authenticationEMail = obj.authenticationEMail;
        this.authenticationGroup = obj.authenticationGroup;
        this.authenticationUserName = obj.authenticationUserName;
    }
    clone() {
        const result = new DocumentProtectionSettings();
        result.copyFrom(this);
        return result;
    }
}
DocumentProtectionSettings.defaultColors = [
    'rgb(213, 213, 255)',
    'rgb(255, 213, 255)',
    'rgb(255, 230, 213)',
    'rgb(213, 255, 254)',
    'rgb(255, 254, 213)',
    'rgb(233, 233, 233)',
    'rgb(255, 213, 213)',
    'rgb(213, 255, 213)',
];
