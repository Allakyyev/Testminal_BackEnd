import { CacheImageInfo, ImageCache } from '../../../caches/images';
import { PictureSize } from '../../../floating-objects/sizes';
import { Position } from '../../../position/position';
import { PictureRunType } from '../../../runs/inline-picture-run';
import { SubDocument, SubDocumentPosition } from '../../../sub-document';
import { ModelManipulator } from '../../model-manipulator';
import { ImageLoadingOptions } from './image-loading-options';
export declare class PicSizeUpdaterData {
    subDocument: SubDocument;
    runPosition: Position;
    run: PictureRunType;
    options: ImageLoadingOptions;
    histItemSize?: PictureSize;
    constructor(subDocument: SubDocument, runPosition: Position, run: PictureRunType, options: ImageLoadingOptions, histItemSize?: PictureSize);
}
interface IPictureLoadedListener {
    notifyPictureLoaded(): void;
}
export declare type AllPicturesLoaded = (isLoaded: boolean) => void;
export interface ISizeUpdater {
    getImageLoadingOptions(run: PictureRunType): ImageLoadingOptions;
}
declare class PicSizeUpdater implements ISizeUpdater {
    private modelManipulator;
    private loadingData;
    private pictureLoadedListener;
    constructor(modelManipulator: ModelManipulator, pictureLoadedListener: IPictureLoadedListener);
    getImageLoadingOptions(run: PictureRunType): ImageLoadingOptions;
    addLoadListener(cacheInfo: CacheImageInfo, callback: () => void): void;
    allPicturesLoaded(): boolean;
    addSizes(subDocPos: SubDocumentPosition, options: ImageLoadingOptions, run: PictureRunType, histItemSize?: PictureSize): void;
    update(cacheInfo: CacheImageInfo, notify: boolean): void;
    private updateInner;
    private getAnchoredTextBoxRun;
}
export declare abstract class PictureLoader implements IPictureLoadedListener {
    protected modelManipulator: ModelManipulator;
    sizeUpdater: PicSizeUpdater;
    private callbacksInfo;
    protected get imageCache(): ImageCache;
    constructor(modelManipulator: ModelManipulator);
    notifyPictureLoaded(): void;
    ensureAllPicturesLoaded(timeout: number, callback: AllPicturesLoaded): void;
    ensureAllPicturesPdfCompatible(timeout: number, convertImageToCompatibleFormat: (base64: string) => Promise<string>, callback: () => void): void;
    load(data: CacheImageInfo): void;
    abstract applyRequest(_jsonObj: any): any;
    protected abstract loadInner(data: CacheImageInfo): any;
    protected finalizeLoading(loadedData: CacheImageInfo, existingInfo?: CacheImageInfo): void;
    protected loadPictureByBase64(data: CacheImageInfo, imageLoaded: (data: CacheImageInfo) => void): void;
    private convertBmpToPng;
    protected loadPictureByUrl(data: CacheImageInfo, imageLoaded: (data: CacheImageInfo) => void): void;
    protected loadPictureByFile(data: CacheImageInfo, imageLoaded: (data: CacheImageInfo) => void): void;
}
export {};
//# sourceMappingURL=picture-loader.d.ts.map