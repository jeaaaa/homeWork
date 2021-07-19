
export default class Vnode {
    constructor(tag, attr, children, parent, childrenTemplateID) {
        this.tag = tag;
        this.attr = attr;
        this.children = children;
        this.parent = parent;
        this.childrenTemplateID = childrenTemplateID;
        this.uuid = this.uuid();
    }

    uuid() {
        // 赋予每个node唯一编号
        return (
            Math.random() * 10000000000 +
            Math.random() * 100000 +
            Date.now()
        ).toString(36);
    }
}
