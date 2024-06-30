import { RendererClassNames } from '../../../../core/canvas/renderer-class-names';
import { LayoutPageFlags } from '../../../../core/layout/main-structures/layout-page';
import { Section } from '../../../../core/model/section/section';
import { isEven } from '@devexpress/utils/lib/utils/common';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { DocumentRenderer } from '../common/document-renderer';
import { BaseRenderer } from './base-renderer';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
export class HeaderFooterLabelsRenderer extends BaseRenderer {
    constructor(renderer, stringResources) {
        super(renderer);
        this.stringResources = stringResources;
        this.elementsMap = {};
    }
    handlePageHide(pageIndex) {
        const elem = this.elementsMap[pageIndex];
        if (elem) {
            elem.hide();
            delete this.elementsMap[pageIndex];
        }
        return true;
    }
    handlePageRender(pageIndex, force) {
        const layoutPage = this.renderer.layout.pages[pageIndex];
        const cacheElement = this.renderer.cache[pageIndex];
        if (!cacheElement || !layoutPage)
            return false;
        const layoutPageAreas = layoutPage.getLayoutOtherPageAreasInfo();
        const documentModel = this.getDocumentModel();
        if (!documentModel)
            return false;
        let oldElems = this.elementsMap[pageIndex];
        let deleteOldElems = true;
        if (this.isHeaderFooterActive(layoutPage)) {
            if (!oldElems || force) {
                const container = DocumentRenderer.getServiceContainerCore(cacheElement.page);
                const sectionIndex = Section.getPageSectionIndex(layoutPage, documentModel.sections);
                const section = documentModel.sections[sectionIndex];
                const infoTexts = this.getInfoTexts(sectionIndex, section, layoutPage, layoutPageAreas, documentModel);
                const elements = this.elementsMap[pageIndex] = new HeaderFooterElements();
                deleteOldElems = false;
                this.updateElementInfo(infoTexts.headerInfo, container, layoutPage.mainSubDocumentPageAreas[0], elements.headerInfoElement, HeaderFooterLabelsRenderer.getHeaderInfoTopPosition);
                this.updateElementInfo(infoTexts.footerInfo, container, ListUtils.last(layoutPage.mainSubDocumentPageAreas), elements.footerInfoElement, HeaderFooterLabelsRenderer.getFooterInfoTopPosition);
            }
            else
                oldElems = null;
        }
        if (oldElems) {
            oldElems.hide();
            if (deleteOldElems)
                delete this.elementsMap[pageIndex];
        }
        return true;
    }
    getDocumentModel() {
        const page = this.renderer.layout.pages[0];
        if (!page)
            return null;
        const pa = page.mainSubDocumentPageAreas[0] || NumberMapUtils.anyOf(page.otherPageAreas, (pa) => pa);
        return pa ? pa.subDocument.documentModel : null;
    }
    getInfoTexts(sectionIndex, section, layoutPage, layoutHeaderFooterPageAreas, documentModel) {
        const result = new HeaderFooterInfoTexts();
        if (section.sectionProperties.differentFirstPage && layoutPage.flags.get(LayoutPageFlags.IsFirstPageOfSection)) {
            result.headerInfo.push(this.stringResources.firstPageHeader);
            result.footerInfo.push(this.stringResources.firstPageFooter);
        }
        else if (!documentModel.differentOddAndEvenPages) {
            result.headerInfo.push(this.stringResources.header);
            result.footerInfo.push(this.stringResources.footer);
        }
        else if (isEven(layoutPage.layoutPageIndex)) {
            result.headerInfo.push(this.stringResources.evenPageHeader);
            result.footerInfo.push(this.stringResources.evenPageFooter);
        }
        else {
            result.headerInfo.push(this.stringResources.oddPageHeader);
            result.footerInfo.push(this.stringResources.oddPageFooter);
        }
        if (documentModel.sections.length > 1) {
            const sectionLabel = ` -Section ${sectionIndex + 1}-`;
            result.headerInfo[0] += sectionLabel;
            result.footerInfo[0] += sectionLabel;
        }
        if (layoutHeaderFooterPageAreas.headerPageArea && section.headers.isLinkedToPrevious(layoutHeaderFooterPageAreas.headerPageArea.subDocument.info.headerFooterType))
            result.headerInfo.push(this.stringResources.sameAsPrevious);
        if (layoutHeaderFooterPageAreas.footerPageArea && section.footers.isLinkedToPrevious(layoutHeaderFooterPageAreas.footerPageArea.subDocument.info.headerFooterType))
            result.footerInfo.push(this.stringResources.sameAsPrevious);
        return result;
    }
    updateElementInfo(infoTexts, container, pageArea, infoElement, getTopPosition) {
        if (!pageArea)
            return;
        const sameAsPrevInfoText = infoTexts[1];
        infoElement.innerHTML = `<b>${infoTexts[0]}</b>${sameAsPrevInfoText ? `<b>${sameAsPrevInfoText}</b>` : ""}`;
        container.appendChild(infoElement);
        infoElement.style.top = getTopPosition(pageArea, infoElement) + "px";
    }
    static getHeaderInfoTopPosition(pageArea, _element) {
        return pageArea.y + 1;
    }
    static getFooterInfoTopPosition(pageArea, element) {
        return pageArea.bottom - element.offsetHeight - 1;
    }
}
class HeaderFooterInfoTexts {
    constructor() {
        this.headerInfo = [];
        this.footerInfo = [];
    }
}
class HeaderFooterElements {
    constructor() {
        this.headerInfoElement = DocumentRenderer.renderContainer(RendererClassNames.HEADER_INFO);
        this.footerInfoElement = DocumentRenderer.renderContainer(RendererClassNames.FOOTER_INFO);
    }
    hide() {
        DomUtils.hideNode(this.headerInfoElement);
        DomUtils.hideNode(this.footerInfoElement);
    }
}
