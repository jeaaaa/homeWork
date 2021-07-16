
/**
 * 十进制数转换成其他进制
 * 整数--"除二取余，逆序排列"
 * 小数--"乘二取整，顺序排列"
 * 双精度浮点数计算精度缺失，计算机最多只能存52位，在转换成二进制过程中会被截断就导致精度缺失
 */

// Math.trunc 取整
// 9.67 % 1  取小数

/**
 * @description: 
 * @param {*}
 * @return {*}
 */
class Conversion {
    constructor(char) {
        this.char = char
        this.STEP = char.length
        this.map = new Map()
        for (let i = 0; i < this.STEP; i++) {
            let c = char[i]
            this.map.set(c, i)
        }
    }
    checkNum(num) {
        if (isNaN(num)) throw new Error('请传入number~')
        if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
            throw new Error('超出安全数范围~')
        }
    }
    /**
     * @description: 
     * @param {*} num
     * @return {*}
     */
    encode(num) {
        this.checkNum(num)

        let neg = false
        // 记录符号
        if (num < 0) {
            neg = true
            num = -1 * num
        }

        let numArr = num.toString().split('.')  // 拆分整数和小数，避免精度误差

        let int = this.encodeInt(numArr[0])
        let float = numArr[1] ? this.encodeFloat(numArr[1]) : ''
        let floatStr = float ? `.${float}` : ''

        return neg ? `-${int}${floatStr}` : `${int}${floatStr}`

    }
    incode(num) {
        let neg = false
        // 记录符号
        if (num < 0) {
            neg = true
            num = -1 * num
        }
        let numArr = num.toString().split('.')
        let int = this.incodeInt(numArr[0])
        let float = numArr[1] ? this.incodeFloat(`0.${numArr[1]}`) : ''

        return int + float
    }
    /**
     * @description: 转换整数
     * @param {*} int
     * @return {*}  对应的整数进制部分
     */
    encodeInt(int) {
        // 除相应进制取余，到0结束，逆序排列
        let a = +int   //把字符串变成数字
        let intArr = []
        if (a === 0) {
            intArr.push('0')
        }
        const STEP = this.STEP
        while (a > 0) {
            let tmp = a % STEP
            let c = this.char[tmp]
            intArr.unshift(c)
            a = parseInt(a / STEP)
        }
        return intArr.join('')
    }
    /**
     * @description: 转换小数
     * @param {*} float
     * @return {*}  对应的小数进制部分
     */
    encodeFloat(float) {
        // 乘相应进制取整，到1结束，顺序排列
        let b = +`0.${float}`
        let floatArr = []

        const STEP = this.STEP
        while (b < 1 && floatArr.length < 53) { // 最多只能存52位
            let tmp = Math.trunc(b * STEP)
            let c = this.char[tmp]
            floatArr.push(c)
            b = +`0.${(b * STEP).toString().split('.')[1]}`
        }
        console.log(floatArr)
        return floatArr.join('')
    }
    incodeInt(str) {
        str = str + '';
        str = str.trim();

        let num = 0;
        let len = str.length;
        for (let i = 0; i < len; i++) {
            let a = this.map.get(str[i]);
            num += a * Math.pow(this.STEP, len - i - 1)
        }
        return num
    }
    incodeFloat(str) {
        str = str.replace('.', '');
        let num = 0;
        for (let i = 0; i < str.length; i++) {
            let a = this.map.get(str[i])
            num += a * Math.pow(this.STEP, -i);
        }
        return num
    }
}

module.exports = Conversion;