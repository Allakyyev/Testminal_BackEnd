import { LayoutChangeType } from '../../../../core/layout-formatter/changes/changes/layout-change-base';
import { LayoutPageFlags } from '../../../../core/layout/main-structures/layout-page';
import { Log } from '../../../../core/rich-utils/debug/logger/base-logger/log';
import { LogListHelper } from '../../../../core/rich-utils/debug/logger/base-logger/log-list-helper';
import { LogSource } from '../../../../core/rich-utils/debug/logger/base-logger/log-source';
import { Errors } from '@devexpress/utils/lib/errors';
import { Comparers } from '@devexpress/utils/lib/utils/comparers';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { ViewType } from '../../../../core/view-settings/views-settings';
import { DebugVisualizerType } from '../../../rich-utils/debug/logger/layout-logger/visualizers/debug-visualizer-type';
import { PageVisibleInfoHelper } from '../../../rich-utils/debug/logger/layout-logger/visualizers/page-visible-info-helper';
import { CanvasListener } from './canvas-listener';
export class PrintLayoutViewCanvasListener extends CanvasListener {
    constructor(viewManager, renderer) {
        super(viewManager, renderer);
        this.handledPageIndexes = [];
    }
    onPagesReady(pageChanges) {
        const updatedTypePageChanges = [];
        const otherTypePageChanges = [];
        for (let pageChange of pageChanges)
            if (pageChange.changeType == LayoutChangeType.Updated)
                updatedTypePageChanges.push(pageChange);
            else
                otherTypePageChanges.push(pageChange);
        Log.print(LogSource.CanvasManager, "onPagesReady - handled pages", LogListHelper.level_1((index) => `${index}`, this.handledPageIndexes, "\t", "\t"));
        Log.print(LogSource.CanvasManager, "onPagesReady - pageFlags\n", LogListHelper.level_1((page) => `${Log.mask(LayoutPageFlags, page.flags.getValue())}`, this.viewManager.layout.pages, "\t", "\n"));
        if (otherTypePageChanges.length > 0) {
            for (let pageChange of otherTypePageChanges) {
                const pageIndex = pageChange.index;
                const layoutPage = this.viewManager.layout.pages[pageIndex];
                switch (pageChange.changeType) {
                    case LayoutChangeType.Inserted:
                        this.viewManager.renderer.renderPage(layoutPage, pageIndex, false);
                        layoutPage.flags.set(LayoutPageFlags.ContentRendered, false);
                        this.viewManager.adjust(false);
                        break;
                    case LayoutChangeType.Deleted:
                        this.renderer.removePage(pageIndex);
                        break;
                    case LayoutChangeType.Replaced:
                        if (layoutPage.flags.get(LayoutPageFlags.ContentRendered))
                            layoutPage.flags.set(LayoutPageFlags.NeedDeleteContent, true);
                        this.renderer.renderPage(layoutPage, pageIndex, false);
                        layoutPage.flags.set(LayoutPageFlags.ContentRendered, false);
                        break;
                    default: throw new Error(Errors.NotImplemented);
                }
            }
            this.updateVisiblePages();
            this.viewManager.canvasScrollManager.updateScrollVisibility();
        }
        for (let pageChange of updatedTypePageChanges) {
            const layoutPage = this.layout.pages[pageChange.index];
            if (!layoutPage.flags.get(LayoutPageFlags.ContentRendered))
                continue;
            CanvasListener.mergeInnerPageChanges(pageChange);
            this.renderer.applyPageChange(layoutPage, pageChange);
            this.viewManager.changeActiveSubDocumentRenderer.updatePage(this.viewManager.selection.layoutSelection, layoutPage.index);
        }
        this.handleDeferredPagesOperations();
        this.viewManager.lastUsedRendererType = ViewType.PrintLayout;
        Log.print(LogSource.DiplayPageInfo, "", () => ListUtils.map(pageChanges, (p) => { if (p.changeType == LayoutChangeType.Deleted)
            PageVisibleInfoHelper.hidePageVisibleInfoElement(p.index);
        else
            PageVisibleInfoHelper.showPageVisibleInfoElement(this.viewManager.cache, () => `pageIndex=${p.index}`, p.index); }));
        Log.print(LogSource.DiplayTableBoundsInfo, "", () => ListUtils.map(pageChanges, (p) => { if (p.changeType == LayoutChangeType.Deleted)
            Log.paramsHolder.visualizerManager.hide(DebugVisualizerType.TableBounds, p.index);
        else
            Log.paramsHolder.visualizerManager.show(DebugVisualizerType.TableBounds, this.layout, p.index); }));
        Log.print(LogSource.DiplayLayoutBoundsInfo, "", () => ListUtils.map(pageChanges, (p) => { if (p.changeType == LayoutChangeType.Deleted)
            Log.paramsHolder.visualizerManager.hide(DebugVisualizerType.LayoutBounds, p.index);
        else
            Log.paramsHolder.visualizerManager.show(DebugVisualizerType.LayoutBounds, this.layout, p.index); }));
    }
    updateVisiblePages() {
        const pages = this.layout.pages;
        this.viewManager.scroll.updatePageIndexesInfo(pages);
        const renderInterval = this.viewManager.scroll.renderPageIndexInterval();
        for (let pageIndex of this.handledPageIndexes)
            if (!renderInterval.contains(pageIndex)) {
                const page = pages[pageIndex];
                if (page) {
                    page.flags.set(LayoutPageFlags.NeedDeleteContent, true);
                    page.flags.set(LayoutPageFlags.MustBeRendered, false);
                }
            }
        const endPageIndex = Math.min(renderInterval.end - 1, this.layout.pages.length - 1);
        for (let pageIndex = renderInterval.start; pageIndex <= endPageIndex; pageIndex++) {
            const page = pages[pageIndex];
            if (!page.flags.get(LayoutPageFlags.ContentRendered)) {
                page.flags.set(LayoutPageFlags.NeedRenderContent, true);
                page.flags.set(LayoutPageFlags.MustBeRendered, true);
                this.handledPageIndexes.push(pageIndex);
            }
        }
    }
    handleDeferredPagesOperations() {
        const pages = this.layout.pages;
        const visiblePages = [];
        this.handledPageIndexes.sort(Comparers.number);
        let prevPageIndex = -1;
        for (let pageIndex of this.handledPageIndexes) {
            if (pageIndex == prevPageIndex)
                continue;
            const page = pages[pageIndex];
            if (!page)
                continue;
            this.handlePageFlags(page);
            if (page.flags.get(LayoutPageFlags.MustBeRendered))
                visiblePages.push(pageIndex);
            prevPageIndex = pageIndex;
        }
        this.handledPageIndexes = visiblePages;
    }
    handlePageFlags(page) {
        const isNeedDeleteContent = page.flags.get(LayoutPageFlags.NeedDeleteContent);
        if (page.index >= this.layout.validPageCount) {
            if (isNeedDeleteContent) {
                Log.print(LogSource.CanvasManager, "handleDeferredPagesOperations", `pageIndex: ${page.index} content deleted`);
                this.renderer.renderPage(page, page.index, false);
                page.flags.set(LayoutPageFlags.ContentRendered, false);
                page.flags.set(LayoutPageFlags.NeedDeleteContent, false);
                page.flags.set(LayoutPageFlags.IsSelectionRendered, false);
                page.flags.set(LayoutPageFlags.IsMisspelledSelectionRendered, false);
            }
            return;
        }
        const isContentRendered = page.flags.get(LayoutPageFlags.ContentRendered);
        const isNeedRenderContent = page.flags.get(LayoutPageFlags.NeedRenderContent);
        const callRender = isNeedDeleteContent || isNeedRenderContent;
        if (callRender) {
            Log.print(LogSource.CanvasManager, "handlePageFlags", `pageIndex: ${page.index} content ${isNeedRenderContent ? "rendered" : "deleted"}`);
            this.renderer.renderPage(page, page.index, isNeedRenderContent);
            this.viewManager.changeActiveSubDocumentRenderer.updatePage(this.viewManager.selection.layoutSelection, page.index);
        }
        page.flags.set(LayoutPageFlags.ContentRendered, isNeedRenderContent || !callRender && isContentRendered);
        page.flags.set(LayoutPageFlags.NeedDeleteContent, false);
        page.flags.set(LayoutPageFlags.NeedRenderContent, false);
        if (callRender) {
            page.flags.set(LayoutPageFlags.IsSelectionRendered, false);
            page.flags.set(LayoutPageFlags.IsMisspelledSelectionRendered, false);
        }
    }
    updateVisibleParts() {
        this.updateVisiblePages();
        this.handleDeferredPagesOperations();
    }
    onCanvasScroll() {
        this.updateVisibleParts();
        for (let visiblePageIndex of this.handledPageIndexes) {
            this.viewManager.selection.renderAllPageSelection(this.layout, visiblePageIndex, false);
            this.viewManager.searchSelection.renderAllPageSelection(this.layout, visiblePageIndex, false);
            this.viewManager.misspelledSelection.renderAllPageSelection(this.layout, visiblePageIndex, false);
            this.viewManager.rangePermission.renderAllPageSelection(this.layout, visiblePageIndex, false);
        }
    }
}
