import { HtmlConverter } from '../../rich-utils/html-converter';
export class FontMeasurer {
    getFontMeasurerInfo(font) {
        this.beginMeasuring(font);
        const baseLine = this.container.firstChild.offsetTop / this.container.lastChild.offsetHeight;
        const heightFactor = this.container.lastChild.offsetHeight / FontMeasurer.testSpanHeigth;
        this.endMeasuring();
        return new FontMeasurerInfo(baseLine, heightFactor);
    }
    beginMeasuring(font) {
        if (!this.container) {
            this.container = document.createElement("div");
            this.container.style.position = "absolute";
            this.container.style.top = "-10000px";
            this.container.style.left = "-10000px";
            this.container.style.opacity = "0";
            this.container.style.fontSize = "0px";
            this.container.style.lineHeight = "normal";
        }
        var fontCssString = HtmlConverter.buildFontFamilyRule(font.cssString);
        this.container.innerHTML = '';
        var span = document.createElement('span');
        span.style.cssText = 'font-size:0; font-family: ' + fontCssString + '; display: inline-block;';
        span.innerHTML = 'A';
        this.container.appendChild(span);
        span = document.createElement('span');
        span.style.cssText = 'font-size:' + FontMeasurer.testSpanHeigth + 'pt; font-family: ' + fontCssString + '; display: inline-block;';
        span.innerHTML = 'A';
        this.container.appendChild(span);
        document.body.appendChild(this.container);
        return this.container;
    }
    endMeasuring() {
        if (this.container && this.container.parentNode)
            this.container.parentNode.removeChild(this.container);
    }
}
FontMeasurer.testSpanHeigth = 288;
export class FontMeasurerInfo {
    constructor(baseLine, heightFactor) {
        this.baseLine = baseLine;
        this.heightFactor = heightFactor;
    }
}
