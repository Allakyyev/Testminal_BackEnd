import { MinMaxNumber } from '@devexpress/utils/lib/class/min-max';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
export class SHA512 {
    constructor() {
        this.initialize();
    }
    resetCache() {
        this._hash = this.getDefaultCache();
    }
    initialize() {
        this.resetCache();
        this._k = [
            new MinMaxNumber(3609767458, 1116352408),
            new MinMaxNumber(602891725, 1899447441),
            new MinMaxNumber(3964484399, 3049323471),
            new MinMaxNumber(2173295548, 3921009573),
            new MinMaxNumber(4081628472, 961987163),
            new MinMaxNumber(3053834265, 1508970993),
            new MinMaxNumber(2937671579, 2453635748),
            new MinMaxNumber(3664609560, 2870763221),
            new MinMaxNumber(2734883394, 3624381080),
            new MinMaxNumber(1164996542, 310598401),
            new MinMaxNumber(1323610764, 607225278),
            new MinMaxNumber(3590304994, 1426881987),
            new MinMaxNumber(4068182383, 1925078388),
            new MinMaxNumber(991336113, 2162078206),
            new MinMaxNumber(633803317, 2614888103),
            new MinMaxNumber(3479774868, 3248222580),
            new MinMaxNumber(2666613458, 3835390401),
            new MinMaxNumber(944711139, 4022224774),
            new MinMaxNumber(2341262773, 264347078),
            new MinMaxNumber(2007800933, 604807628),
            new MinMaxNumber(1495990901, 770255983),
            new MinMaxNumber(1856431235, 1249150122),
            new MinMaxNumber(3175218132, 1555081692),
            new MinMaxNumber(2198950837, 1996064986),
            new MinMaxNumber(3999719339, 2554220882),
            new MinMaxNumber(766784016, 2821834349),
            new MinMaxNumber(2566594879, 2952996808),
            new MinMaxNumber(3203337956, 3210313671),
            new MinMaxNumber(1034457026, 3336571891),
            new MinMaxNumber(2466948901, 3584528711),
            new MinMaxNumber(3758326383, 113926993),
            new MinMaxNumber(168717936, 338241895),
            new MinMaxNumber(1188179964, 666307205),
            new MinMaxNumber(1546045734, 773529912),
            new MinMaxNumber(1522805485, 1294757372),
            new MinMaxNumber(2643833823, 1396182291),
            new MinMaxNumber(2343527390, 1695183700),
            new MinMaxNumber(1014477480, 1986661051),
            new MinMaxNumber(1206759142, 2177026350),
            new MinMaxNumber(344077627, 2456956037),
            new MinMaxNumber(1290863460, 2730485921),
            new MinMaxNumber(3158454273, 2820302411),
            new MinMaxNumber(3505952657, 3259730800),
            new MinMaxNumber(106217008, 3345764771),
            new MinMaxNumber(3606008344, 3516065817),
            new MinMaxNumber(1432725776, 3600352804),
            new MinMaxNumber(1467031594, 4094571909),
            new MinMaxNumber(851169720, 275423344),
            new MinMaxNumber(3100823752, 430227734),
            new MinMaxNumber(1363258195, 506948616),
            new MinMaxNumber(3750685593, 659060556),
            new MinMaxNumber(3785050280, 883997877),
            new MinMaxNumber(3318307427, 958139571),
            new MinMaxNumber(3812723403, 1322822218),
            new MinMaxNumber(2003034995, 1537002063),
            new MinMaxNumber(3602036899, 1747873779),
            new MinMaxNumber(1575990012, 1955562222),
            new MinMaxNumber(1125592928, 2024104815),
            new MinMaxNumber(2716904306, 2227730452),
            new MinMaxNumber(442776044, 2361852424),
            new MinMaxNumber(593698344, 2428436474),
            new MinMaxNumber(3733110249, 2756734187),
            new MinMaxNumber(2999351573, 3204031479),
            new MinMaxNumber(3815920427, 3329325298),
            new MinMaxNumber(3928383900, 3391569614),
            new MinMaxNumber(566280711, 3515267271),
            new MinMaxNumber(3454069534, 3940187606),
            new MinMaxNumber(4000239992, 4118630271),
            new MinMaxNumber(1914138554, 116418474),
            new MinMaxNumber(2731055270, 174292421),
            new MinMaxNumber(3203993006, 289380356),
            new MinMaxNumber(320620315, 460393269),
            new MinMaxNumber(587496836, 685471733),
            new MinMaxNumber(1086792851, 852142971),
            new MinMaxNumber(365543100, 1017036298),
            new MinMaxNumber(2618297676, 1126000580),
            new MinMaxNumber(3409855158, 1288033470),
            new MinMaxNumber(4234509866, 1501505948),
            new MinMaxNumber(987167468, 1607167915),
            new MinMaxNumber(1246189591, 1816402316)
        ];
        this._w = ListUtils.initByCallback(80, () => new MinMaxNumber(undefined, undefined));
    }
    computeHashCore(words) {
        const offset = 0;
        const W = this._w;
        const K = this._k;
        const H = this._hash;
        const H0 = H[0];
        const H1 = H[1];
        const H2 = H[2];
        const H3 = H[3];
        const H4 = H[4];
        const H5 = H[5];
        const H6 = H[6];
        const H7 = H[7];
        let H0h = H0.maxElement;
        let H0l = H0.minElement;
        let H1h = H1.maxElement;
        let H1l = H1.minElement;
        let H2h = H2.maxElement;
        let H2l = H2.minElement;
        let H3h = H3.maxElement;
        let H3l = H3.minElement;
        let H4h = H4.maxElement;
        let H4l = H4.minElement;
        let H5h = H5.maxElement;
        let H5l = H5.minElement;
        let H6h = H6.maxElement;
        let H6l = H6.minElement;
        let H7h = H7.maxElement;
        let H7l = H7.minElement;
        let ah = H0h;
        let al = H0l;
        let bh = H1h;
        let bl = H1l;
        let ch = H2h;
        let cl = H2l;
        let dh = H3h;
        let dl = H3l;
        let eh = H4h;
        let el = H4l;
        let fh = H5h;
        let fl = H5l;
        let gh = H6h;
        let gl = H6l;
        let hh = H7h;
        let hl = H7l;
        for (let i = 0; i < 80; i++) {
            let Wil;
            let Wih;
            const Wi = W[i];
            if (i < 16) {
                Wih = Wi.maxElement = words[offset + i * 2] | 0;
                Wil = Wi.minElement = words[offset + i * 2 + 1] | 0;
            }
            else {
                const gamma0x = W[i - 15];
                const gamma0xh = gamma0x.maxElement;
                const gamma0xl = gamma0x.minElement;
                const gamma0h = ((gamma0xh >>> 1) | (gamma0xl << 31)) ^ ((gamma0xh >>> 8) | (gamma0xl << 24)) ^ (gamma0xh >>> 7);
                const gamma0l = ((gamma0xl >>> 1) | (gamma0xh << 31)) ^ ((gamma0xl >>> 8) | (gamma0xh << 24)) ^ ((gamma0xl >>> 7) | (gamma0xh << 25));
                const gamma1x = W[i - 2];
                const gamma1xh = gamma1x.maxElement;
                const gamma1xl = gamma1x.minElement;
                const gamma1h = ((gamma1xh >>> 19) | (gamma1xl << 13)) ^ ((gamma1xh << 3) | (gamma1xl >>> 29)) ^ (gamma1xh >>> 6);
                const gamma1l = ((gamma1xl >>> 19) | (gamma1xh << 13)) ^ ((gamma1xl << 3) | (gamma1xh >>> 29)) ^ ((gamma1xl >>> 6) | (gamma1xh << 26));
                const Wi7 = W[i - 7];
                const Wi7h = Wi7.maxElement;
                const Wi7l = Wi7.minElement;
                const Wi16 = W[i - 16];
                const Wi16h = Wi16.maxElement;
                const Wi16l = Wi16.minElement;
                Wil = gamma0l + Wi7l;
                Wih = gamma0h + Wi7h + ((Wil >>> 0) < (gamma0l >>> 0) ? 1 : 0);
                Wil = Wil + gamma1l;
                Wih = Wih + gamma1h + ((Wil >>> 0) < (gamma1l >>> 0) ? 1 : 0);
                Wil = Wil + Wi16l;
                Wih = Wih + Wi16h + ((Wil >>> 0) < (Wi16l >>> 0) ? 1 : 0);
                Wi.maxElement = Wih;
                Wi.minElement = Wil;
            }
            const chh = (eh & fh) ^ (~eh & gh);
            const chl = (el & fl) ^ (~el & gl);
            const majh = (ah & bh) ^ (ah & ch) ^ (bh & ch);
            const majl = (al & bl) ^ (al & cl) ^ (bl & cl);
            const sigma0h = ((ah >>> 28) | (al << 4)) ^ ((ah << 30) | (al >>> 2)) ^ ((ah << 25) | (al >>> 7));
            const sigma0l = ((al >>> 28) | (ah << 4)) ^ ((al << 30) | (ah >>> 2)) ^ ((al << 25) | (ah >>> 7));
            const sigma1h = ((eh >>> 14) | (el << 18)) ^ ((eh >>> 18) | (el << 14)) ^ ((eh << 23) | (el >>> 9));
            const sigma1l = ((el >>> 14) | (eh << 18)) ^ ((el >>> 18) | (eh << 14)) ^ ((el << 23) | (eh >>> 9));
            const Ki = K[i];
            const Kih = Ki.maxElement;
            const Kil = Ki.minElement;
            let t1l = hl + sigma1l;
            let t1h = hh + sigma1h + ((t1l >>> 0) < (hl >>> 0) ? 1 : 0);
            t1l = t1l + chl;
            t1h = t1h + chh + ((t1l >>> 0) < (chl >>> 0) ? 1 : 0);
            t1l = t1l + Kil;
            t1h = t1h + Kih + ((t1l >>> 0) < (Kil >>> 0) ? 1 : 0);
            t1l = t1l + Wil;
            t1h = t1h + Wih + ((t1l >>> 0) < (Wil >>> 0) ? 1 : 0);
            const t2l = sigma0l + majl;
            const t2h = sigma0h + majh + ((t2l >>> 0) < (sigma0l >>> 0) ? 1 : 0);
            hh = gh;
            hl = gl;
            gh = fh;
            gl = fl;
            fh = eh;
            fl = el;
            el = (dl + t1l) | 0;
            eh = (dh + t1h + ((el >>> 0) < (dl >>> 0) ? 1 : 0)) | 0;
            dh = ch;
            dl = cl;
            ch = bh;
            cl = bl;
            bh = ah;
            bl = al;
            al = (t1l + t2l) | 0;
            ah = (t1h + t2h + ((al >>> 0) < (t1l >>> 0) ? 1 : 0)) | 0;
        }
        H0l = H0.minElement = (H0l + al);
        H0.maxElement = (H0h + ah + ((H0l >>> 0) < (al >>> 0) ? 1 : 0));
        H1l = H1.minElement = (H1l + bl);
        H1.maxElement = (H1h + bh + ((H1l >>> 0) < (bl >>> 0) ? 1 : 0));
        H2l = H2.minElement = (H2l + cl);
        H2.maxElement = (H2h + ch + ((H2l >>> 0) < (cl >>> 0) ? 1 : 0));
        H3l = H3.minElement = (H3l + dl);
        H3.maxElement = (H3h + dh + ((H3l >>> 0) < (dl >>> 0) ? 1 : 0));
        H4l = H4.minElement = (H4l + el);
        H4.maxElement = (H4h + eh + ((H4l >>> 0) < (el >>> 0) ? 1 : 0));
        H5l = H5.minElement = (H5l + fl);
        H5.maxElement = (H5h + fh + ((H5l >>> 0) < (fl >>> 0) ? 1 : 0));
        H6l = H6.minElement = (H6l + gl);
        H6.maxElement = (H6h + gh + ((H6l >>> 0) < (gl >>> 0) ? 1 : 0));
        H7l = H7.minElement = (H7l + hl);
        H7.maxElement = (H7h + hh + ((H7l >>> 0) < (hl >>> 0) ? 1 : 0));
    }
    getDefaultCache() {
        return [
            new MinMaxNumber(4089235720, 1779033703),
            new MinMaxNumber(2227873595, 3144134277),
            new MinMaxNumber(4271175723, 1013904242),
            new MinMaxNumber(1595750129, 2773480762),
            new MinMaxNumber(2917565137, 1359893119),
            new MinMaxNumber(725511199, 2600822924),
            new MinMaxNumber(4215389547, 528734635),
            new MinMaxNumber(327033209, 1541459225),
        ];
    }
    computeHash(source) {
        this.resetCache();
        const dataWords = source;
        const nBitsTotal = source.length * 4 * 8;
        const nBitsLeft = source.length * 4 * 8;
        dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
        dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 30] = Math.floor(nBitsTotal / 0x100000000);
        dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 31] = nBitsTotal;
        this.computeHashCore(dataWords);
        return this.toX32Words(this._hash);
    }
    toX32Words(x64Words) {
        const x64WordsLength = x64Words.length;
        const x32Words = [];
        for (let i = 0; i < x64WordsLength; i++) {
            const x64Word = x64Words[i];
            x32Words.push(x64Word.maxElement);
            x32Words.push(x64Word.minElement);
        }
        return x32Words;
    }
}
