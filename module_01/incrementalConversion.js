
/**
 * 十进制数转换成其他进制
 * 整数--"除二取余，逆序排列"
 * 小数--"乘二取整，顺序排列"
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
    /**
     * @description: 
     * @param {*} num
     * @return {*}
     */
    encode(num) {
        if (isNaN(num)) throw new Error('请传入number~')
        if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
            throw new Error('超出安全数范围~')
        }

        let neg = false
        // 记录符号
        if (num < 0) {
            neg = true
            num = -1 * num
        }

        let numArr = num.toString().split('.')  // 拆分整数和小数，避免精度误差
        console.log(numArr)
        let int = this.encodeInt(numArr[0])
        let float = numArr[1] ? this.encodeFloat(numArr[1]) : ''
        let floatStr = float ? `.${float}` : ''

        return neg ? `-${int}${floatStr}` : `${int}${floatStr}`

    }
    incode(str) {

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
        console.log(b)
        let floatArr = []
        if (b === 1) {
            floatArr.push('1')
        }
        const STEP = this.STEP
        while (b < 1) {
            let tmp = Math.trunc(b * STEP)
            let c = this.char[tmp]
            floatArr.push(c)
            b = (b * STEP).toString().split('.')[1]
        }
        return floatArr.join('')
    }
    incodeInt() {

    }
    incodeFloat() {

    }
}

module.exports = Conversion;