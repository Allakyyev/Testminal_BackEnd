import { FontLoadStatus } from '../core/model/fonts/control-font';
import { ControlFontType } from '../core/model/fonts/font-info';
import { LayoutFontsCollector } from '../core/model/fonts/grabber';
import { ControlFontsLoader } from '../core/model/fonts/loader';
import { FileUtils } from '@devexpress/utils/lib/utils/file';
import { afterFontsLoaded, fontWebApiAvailable } from '@devexpress/utils/lib/utils/fonts';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { PdfLayoutPageExporter } from './page-exporter';
export class PdfExporter {
    constructor(docProcessor) {
        this.docProcessor = docProcessor;
    }
    get layoutFormatterManager() {
        return this.docProcessor.layoutFormatterManager;
    }
    get measurer() {
        return this.docProcessor.layoutFormatterManager.measurer;
    }
    get pdfFontCache() {
        return this.docProcessor.modelManager.model.cache.controlFontsCache;
    }
    get pdfSettings() {
        return this.docProcessor.modelManager.richOptions.pdf;
    }
    get fontsSettings() {
        return this.docProcessor.modelManager.richOptions.fonts;
    }
    export(callback, options) {
        const modifyPdfDocument = typeof options == 'function' ? options :
            (!options || !options.modifyPdfDocument ? () => { } : options.modifyPdfDocument);
        const modifyPdfPage = typeof options == 'function' || !options || !options.modifyPdfPage ? () => { } : options.modifyPdfPage;
        if (!this.layoutFormatterManager.isDocumentOpened) {
            setTimeout(() => modifyPdfDocument(null), 0);
            return;
        }
        const afterLibLoaded = () => {
            if (!this.pdfSettings.pdfDocument) {
                console.warn('Pdf kit library is not loaded.');
                setTimeout(() => modifyPdfDocument(null), 0);
                return;
            }
            if (!this.pdfSettings.blobStream) {
                console.warn('Blob stream library is not loaded.');
                setTimeout(() => modifyPdfDocument(null), 0);
                return;
            }
            const layout = this.layoutFormatterManager.layout;
            while (!layout.isFullyFormatted)
                this.layoutFormatterManager.runFormatting(layout.validPageCount);
            const fontsCollector = new LayoutFontsCollector(this.docProcessor.modelManager.model.cache, layout, this.fontsSettings.mappings.defaultFontName);
            const fonts = fontsCollector.collect();
            const loader = new ControlFontsLoader(this.pdfFontCache, this.fontsSettings, true);
            loader.loadFonts(fonts, [FontLoadStatus.Unloaded], () => {
                const anyFont = ListUtils.unsafeAnyOf(fonts, font => this.pdfFontCache.getFont(font));
                if (!anyFont) {
                    modifyPdfDocument(null);
                    return;
                }
                if (fontWebApiAvailable()) {
                    afterFontsLoaded(() => {
                        if (loader.needInvalidateLayout)
                            this.docProcessor.invalidateLayoutAfterFontsLoaded();
                        while (!layout.isFullyFormatted)
                            this.layoutFormatterManager.runFormatting(layout.validPageCount);
                        this.exportDocument(layout, fonts, fontsCollector, callback, modifyPdfDocument, modifyPdfPage);
                    });
                }
                else
                    this.exportDocument(layout, fonts, fontsCollector, callback, modifyPdfDocument, modifyPdfPage);
            });
        };
        const scriptUrl = this.docProcessor.modelManager.richOptions.pdf.pdfKitScriptUrl;
        if (scriptUrl && (!this.pdfSettings.pdfDocument || !this.pdfSettings.blobStream))
            FileUtils.loadJavascriptFile(scriptUrl, afterLibLoaded);
        else {
            afterLibLoaded();
        }
    }
    exportDocument(layout, fonts, fontsCollector, callback, modifyPdfDocument, modifyPdfPage) {
        this.docProcessor.modelManager.modelManipulator.picture.loader.ensureAllPicturesPdfCompatible(3000, this.pdfSettings.convertImageToCompatibleFormat, () => {
            const doc = new this.pdfSettings.pdfDocument({ autoFirstPage: false, font: 'Symbol' });
            const stream = new this.pdfSettings.blobStream();
            stream.on('finish', () => {
                const blob = stream.toBlob('application/pdf');
                callback(blob, stream);
            });
            doc.pipe(stream);
            for (let font of fonts) {
                const cacheElem = this.pdfFontCache.getFont(font);
                if (cacheElem)
                    doc.registerFont(font.cacheKey, cacheElem.data, cacheElem.isFontCollection ? cacheElem.fontFamily : undefined);
            }
            const layoutFontsCollCache = this.replaceUnloadedFonts(fontsCollector);
            const pageExporter = new PdfLayoutPageExporter(doc, layoutFontsCollCache, this.measurer);
            layout.pages.forEach((page) => {
                pageExporter.export(page, layout.anchorObjectsPositionInfo, layout.pageColor);
                modifyPdfPage(doc);
            });
            modifyPdfDocument(doc);
            doc.end();
        });
    }
    replaceUnloadedFonts(fontsCollector) {
        const defaultFontMap = {};
        const defaultFontName = this.docProcessor.modelManager.richOptions.fonts.mappings.defaultFontName;
        const defaultFontInfo = defaultFontName ? this.docProcessor.modelManager.model.cache.fontInfoCache.getItemByName(defaultFontName) : null;
        if (defaultFontInfo)
            for (let fontType of [ControlFontType.Regular, ControlFontType.Bold, ControlFontType.Italic, ControlFontType.BoldItalic])
                defaultFontMap[fontType] = this.getControlFontByType(defaultFontInfo, fontType);
        return fontsCollector.cache.replaceUnloadedFonts(defaultFontMap);
    }
    getControlFontByType(fontInfo, controlFontType) {
        const key = fontInfo.controlFontMap[controlFontType];
        const controlFont = this.docProcessor.modelManager.model.cache.controlFontsCache.getFontByKey(key);
        return controlFont && controlFont.loaded ? controlFont : undefined;
    }
}
