export class CommentListInfo {
}
export class CommentListInfoCollection {
    constructor() {
        this.mapParaId = {};
        this.mapId = {};
    }
    add(info) {
        this.mapParaId[info.paraId] = info;
        this.mapId[info.id] = info;
    }
}
export class CommentExListInfo {
}
export class CommentExListInfoCollection {
    constructor() {
        this.mapParaId = {};
    }
    add(info) {
        this.mapParaId[info.paraId] = info;
    }
}
