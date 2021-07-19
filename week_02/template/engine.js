
import Vnode from "./vnode.js";

export default class Engine {
    constructor() {
        this.nodes = new Map();
    }

    render(template, data) {
        const re1 = /<(\w+)\s*([^>]*)>([^<]*)<\/\1>/gm; //匹配<div class="a">XXX</div>
        const re2 = /<(\w+)\s*([^(/>)]*)\/>/gm; //匹配<img src="a"/>

        // 根据tmpl解析出node数组
        template = template.replace(/\n/gm, "");
        while (re1.test(template) || re2.test(template)) {
            //<div class="a">XXX</div>类型
            template = template.replace(re1, (s0, s1, s2, s3) => {
                let attr = this.parseAttribute(s2);

                let node = new Vnode(s1, attr, [], null, s3);
                this.nodes.set(node.uuid, node);
                return `(${node.uuid})`;
            });
            //<img src="a"/>类型
            template = template.replace(re2, (s0, s1, s2) => {
                let attr = this.parseAttribute(s2);

                let node = new Vnode(s1, attr, [], null, "");
                this.nodes.set(node.uuid, node);
                return `(${node.uuid})`;
            });
        }
        // console.log(this.nodes);

        //  根据node数组创建AST
        let rootNode = this.parseToNode(template);
        // console.log("第二阶段|构建nodeTree>>>", rootNode);
        console.log(rootNode)
        // 准备渲染，根据AST树生成DOM树
        let dom = this.parseNodeToDom(rootNode, data);
        // console.log("第三阶段|nodeTree To DomTree>>>", dom);

        return dom;
    }
    // 解析出标签属性
    parseAttribute(str) {
        let attr = new Map();
        str = str.trim();
        str.replace(/(\w+)\s*=['"](.*?)['"]/gm, (s0, s1, s2) => {
            attr.set(s1, s2);
            return s0;
        });
        return attr;
    }

    // 根据node数组创建AST
    parseToNode(templateID) {
        let re = /\((.*?)\)/g;
        let stack = [];
        let parent = new Vnode("div", {}, [], null, templateID, null);
        stack.push(parent);

        //转换成node节点
        while (stack.length > 0) {
            let pnode = stack.shift();   // 先入先出，从第一个取

            let nodestr = pnode.childrenTemplateID.trim();
            // re.lastIndex = 0;

            [...nodestr.matchAll(re)].forEach((item) => {
                let n = this.nodes.get(item[1]);
                let newn = new Vnode(
                    n.tag,
                    n.attr,
                    [],
                    pnode,
                    n.childrenTemplateID,
                    null
                );
                pnode.children.push(newn);
                stack.push(newn);
            });

        }
        return parent.children[0];
    }

    // 解析node节点到DOM
    parseNodeToDom(root, data) {
        let fragment = document.createDocumentFragment();

        let stack = [[root, fragment, data]];
        //转成成node节点
        while (stack.length > 0) {
            let [pnode, pdom, scope] = stack.shift();

            if (pnode.attr.get("for")) {
                let [key, prop] = pnode.attr.get("for").split("in");
                key = key.trim();
                prop = prop.trim();

                for (let i = 0; i < scope[prop].length; i++) {
                    let newnode = new Vnode(
                        pnode.tag,
                        pnode.attr,
                        pnode.children,
                        pnode.parent,
                        pnode.childrenTemplateID
                    );
                    let newScope = {};
                    newScope[key] = scope[prop][i];
                    let html = this.scopehtmlParse(newnode, data, newScope);
                    let ele = this.createElement(newnode, html);
                    this.scopeAtrrParse(ele, newnode, data, newScope);

                    pdom.appendChild(ele);
                    newnode.children.forEach((item) => {
                        stack.push([item, ele, newScope]);
                    });
                }
            } else if (pnode.attr.get("if")) {
                let term = pnode.attr.get("if").split('.')

                if (scope[term[0]][term[1]]) {
                    let html = this.scopehtmlParse(pnode, data, scope);
                    let ele = this.createElement(pnode, html);
                    this.scopeAtrrParse(ele, pnode, data, scope);

                    pdom.appendChild(ele);
                    pnode.children.forEach((item) => {
                        stack.push([item, ele, scope]);
                    });
                }
            } else {
                console.log(pnode)
                let html = this.scopehtmlParse(pnode, data, scope);
                let ele = this.createElement(pnode, html);

                this.scopeAtrrParse(ele, pnode, data, scope);

                pdom.appendChild(ele);

                pnode.children.forEach((item) => {
                    stack.push([item, ele, scope]);
                });
            }
        }
        return fragment;
    }

    // 取出标签里的值
    scopehtmlParse(node, globalScope, curentScope) {
        return node.childrenTemplateID.replace(/\{\{(.*?)\}\}/g, (s0, s1) => {
            let props = s1.split(".");
            let val = curentScope[props[0]] || globalScope[props[0]];
            props.slice(1).forEach((item) => {
                val = val[item];
            });
            return val;
        });
    }
    // 填充标签
    scopeAtrrParse(ele, node, globalScope, curentScope) {
        for (let [key, value] of node.attr) {
            let result = /\{\{(.*?)\}\}/.exec(value);
            if (result && result.length > 0) {
                let props = result[1].split(".");
                let val = curentScope[props[0]] || globalScope[props[0]];
                props.slice(1).forEach((item) => {
                    val = val[item];
                });
                ele.setAttribute(key, val);
            }
        }
    }
    // 创建节点
    createElement(node, html) {
        let ignoreAttr = ["for", "click"];
        let dom = document.createElement(node.tag);
        for (let [key, val] of node.attr) {
            if (!ignoreAttr.includes(key) && key !== 'if') {
                dom.setAttribute(key, val);
            }
        }
        if (node.children.length === 0) {
            dom.innerHTML = html;
        }
        return dom;
    }
}
