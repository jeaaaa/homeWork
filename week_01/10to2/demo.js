const Conversion = require('./incrementalConversion');

//初始化的字符串，字符串长度就是进制，从左到右，0对应数值0
// const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+-';
const chars = '01';

// //初始化转换器
const convertion64 = new Conversion(chars);
let num = 22.8125
let str = 10110.1101
let num2 = convertion64.encode(num); //将数字转换成相应进制
let str2 = convertion64.incode(str); //将相应进制还原成原始数据

console.log(`转换后：${num2}`)
console.log(`还原后：${str2}`);

