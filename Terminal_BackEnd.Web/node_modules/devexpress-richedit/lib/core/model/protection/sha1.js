export class SHA1 {
    computeHashCore(words) {
        const hash = this._hash;
        const offset = 0;
        let temp = [];
        let a = hash[0];
        let b = hash[1];
        let c = hash[2];
        let d = hash[3];
        let e = hash[4];
        for (let i = 0; i < 80; i++) {
            if (i < 16) {
                temp[i] = words[offset + i] | 0;
            }
            else {
                const n = temp[i - 3] ^ temp[i - 8] ^ temp[i - 14] ^ temp[i - 16];
                temp[i] = (n << 1) | (n >>> 31);
            }
            let t = ((a << 5) | (a >>> 27)) + e + temp[i];
            if (i < 20) {
                t += ((b & c) | (~b & d)) + 0x5a827999;
            }
            else if (i < 40) {
                t += (b ^ c ^ d) + 0x6ed9eba1;
            }
            else if (i < 60) {
                t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
            }
            else {
                t += (b ^ c ^ d) - 0x359d3e2a;
            }
            e = d;
            d = c;
            c = (b << 30) | (b >>> 2);
            b = a;
            a = t;
        }
        hash[0] = (hash[0] + a) | 0;
        hash[1] = (hash[1] + b) | 0;
        hash[2] = (hash[2] + c) | 0;
        hash[3] = (hash[3] + d) | 0;
        hash[4] = (hash[4] + e) | 0;
    }
    resetCache() {
        this._hash = [
            0x67452301, 0xefcdab89,
            0x98badcfe, 0x10325476,
            0xc3d2e1f0
        ];
    }
    computeHash(source) {
        this.resetCache();
        const dataWords = source;
        const nBitsTotal = source.length * 4 * 8;
        const nBitsLeft = source.length * 4 * 8;
        dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
        dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
        dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
        this.computeHashCore(dataWords);
        return this._hash;
    }
}
