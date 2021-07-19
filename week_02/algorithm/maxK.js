/**
 * 快排生成新数组，输出第几个
 */
const findKthLargest = (nums, k) => {
    console.log(quickSort(nums)[k - 1])
    return quickSort(nums)[k - 1]
};

// const quickSort = (arr, left, right) => {
//     let partitionIndex;
//     if (left < right) {
//         partitionIndex = partition(arr, left, right)
//         quickSort(arr, left, partitionIndex - 1)
//         quickSort(arr, partitionIndex + 1, right)
//     }
//     return arr
// }

// const partition = (arr, left, right) => {
//     let base = left, index = base + 1
//     for (let i = index; i < right; i++) {
//         if (arr[i] < arr[base]) {
//             [arr[i], arr[index]] = [arr[index], arr[i]]
//             index++
//         }
//     }
//     [arr[base], arr[index - 1]] = [arr[index - 1], arr[base]]
//     return index - 1
// }

const quickSort = (arr) => {
    if (arr.length <= 1) { return arr; }

    let pivot = arr.splice(Math.floor(arr.length / 2), 1)[0];
    let left = [], right = [];

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    return quickSort(left).concat([pivot], quickSort(right));
}


findKthLargest([3, 2, 1, 5, 6, 4], 5)