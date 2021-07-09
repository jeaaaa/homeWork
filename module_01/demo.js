const MyNumberConvertion = require('./my-number-convertion');

console.log('64进制');
// //初始化的字符串，字符串长度就是进制，从左到右，0对应数值0，最后一个字符~对应数值63
const chars64 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-~';

// //初始化转换器
const convertion64 = new MyNumberConvertion(chars64);
let str64 = '445306828';
let num64 = convertion64.transfer(str64);//将数字转换成64进制
let source64 = convertion64.revert(num64);//将64进制字符还原成原始数据
console.log(`原始数据：${str64}`);
console.log(`转换后：${num64}`)
console.log(`还原后：${source64}`);

// console.log('2进制');
// const convertion2 = new MyNumberConvertion('01');
// let str2 = 15;
// let num2 = convertion2.transfer(str2);
// let source2 = convertion2.revert(num2);
// console.log(`原始数据：${str2}`);
// console.log(`转换后：${num2}`)
// console.log(`还原后：${source2}`);

// console.log('8进制');
// const convertion8 = new MyNumberConvertion('01234567');
// let str8 = 8;
// let num8 = convertion8.transfer(str8);
// let source8 = convertion8.revert(num8);
// console.log(`原始数据：${str8}`);
// console.log(`转换后：${num8}`)
// console.log(`还原后：${source8}`);

