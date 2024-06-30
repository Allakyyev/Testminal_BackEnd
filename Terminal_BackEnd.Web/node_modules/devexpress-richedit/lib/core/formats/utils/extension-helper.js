import { MapCreator } from '../../../base-utils/map-creator';
export class ExtensionHelper {
    static convertExtensionToMimeType(ext) {
        const mimeType = ExtensionHelper.extToMimeType[ext.toLowerCase()];
        return mimeType ? mimeType : 'image/png';
    }
    static convertMimeTypeToExtension(mimeType) {
        const ext = ExtensionHelper.mimeToExt[mimeType.toLowerCase()];
        return ext ? ext : 'png';
    }
    static makeBase64UriPrefix(mimeType) {
        return `data:${mimeType};base64,`;
    }
    static getBase64DataWithoutPrefix(base64uri) {
        const match = base64uri.match(/data\:.*\;base64,/);
        return match ? base64uri.substr(match[0].length) : base64uri;
    }
    static getMimeTypeFromBase64Uri(prefix) {
        const match = prefix.match(/data\:(.*)\;base64,/);
        return match && match[1] ? match[1].toLowerCase() : 'png';
    }
}
ExtensionHelper.extToMimeType = new MapCreator()
    .add('png', 'image/png')
    .add('jpeg', 'image/jpeg')
    .add('jpg', 'image/jpeg')
    .add('svg', 'image/svg+xml')
    .add('gif', 'image/gif')
    .get();
ExtensionHelper.mimeToExt = new MapCreator()
    .add('image/png', 'png')
    .add('image/jpeg', 'jpeg')
    .add('image/svg+xml', 'svg')
    .add('image/gif', 'gif')
    .get();
