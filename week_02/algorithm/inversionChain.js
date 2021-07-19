/**
 * 链表反转, 
 */

const reverseList = (head) => {
    // head.reverse(); 反转数组
    // 一边遍历一边改变指针方向
    let [cur, pre] = [head, null]
    while (cur) {
        const next = cur.next;
        cur.next = pre;
        pre = cur;
        cur = next;
    }
    return pre;
};

let head = [1, 2, 3, 4, 5]
reverseList(head)
