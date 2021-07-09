/**
 * 十进制和其他进制的相互转换
 */
class MyNumberConvertion {
    constructor(chars) {
        this.chars = chars;
        this.RADIX = chars.length;
        this.map = new Map();
        for (let i = 0; i < this.RADIX; i++) {
            let c = chars[i];
            this.map.set(c, i);
        }
    }

    /**
     * 将十进制数字转换成指定进制
     * @param {Number, String} num 
     */
    transfer(num) {
        let a = +num; //把字符串变成数字
        let arr = [];
        if (a === 0) {
            arr.push('0');
        }
        const RADIX = this.RADIX;
        while (a > 0) {
            let tmp = a % RADIX;
            let c = this.chars[tmp];
            arr.unshift(c);
            a = parseInt(a / RADIX);
        }
        return arr.join('');
    }

    /**
     * 将字符串还原成指定进制
     * @param {String} str 
     */
    revert(str) {
        str = str + '';
        str = str.trim();
        let num = 0;
        let len = str.length;
        let RADIX = this.RADIX;
        for (let i = 0; i < len; i++) {
            let s = str[i];
            let a = this.map.get(str[i]);
            num += a * Math.pow(RADIX, len - i - 1);
        }
        return num;
    }
}

module.exports = MyNumberConvertion;