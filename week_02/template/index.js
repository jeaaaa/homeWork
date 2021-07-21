
import Engine from "./engine.js";

class Template {
    constructor() {
        this.root = null;
        this.engine = new Engine();
    }

    render(tmpl, data) {
        let dom = this.engine.render(tmpl, data);

        console.log(dom)
        document.getElementById('root').appendChild(dom);
    }
}

let tmpl =
    `<div class="newslist">
        <div class="img" v-if="info.showImage">
            <img src="{{image}}"/>
        </div>
        <div class="date" v-if="info.showDate">{{info.name}}</div>
        <div class="img">{{info.name}}</div>
    </div>`
// `<div class="newslist">
//     <div class="news-item" for="item in newslist">
//         <div class="img">
//             <img src="{{item.image}}"/>
//         </div>
//         <div class="title">{{item.title}}</div>
//     </div>
// </div>`
// `<div class="newslist">
//     <div class="news-item" for="item in newslist">
//         <div class="img" v-if="item.image">
//             <img src="{{item.image}}"/>
//         </div>
//         <div class="date" v-if="item.passtime">{{item.passtime}}</div>
//         <div class="title">{{item.title}}</div>
//     </div>
// </div>`

const render = new Template()

const getList = () => {
    return fetch("https://api.apiopen.top/getWangYiNews", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            page: 2,
            count: 1,
        }),
    }).then((response) => response.json());
}
const list = await getList()
console.log(list.result)
list.result[3].passtime = ''
list.result[6].image = ''

let data = {
    image: "http://dingyue.ws.126.net/2021/0201/b63f2e50j00qntwfh0020c000hs00npg.jpg?imageView&thumbnail=140y88&quality=85",
    showImage: true,
    passtime: "2021-02-02 10:00:51",
    showDate: false,
    path: "https://www.163.com/dy/article/G1OBC8LO0514BCL4.html",
    title: "被指偷拿半卷卫生纸 63岁女洗碗工服药自杀 酒店回应",
}

render.render(tmpl,
    {
        image: "http://dingyue.ws.126.net/2021/0201/b63f2e50j00qntwfh0020c000hs00npg.jpg?imageView&thumbnail=140y88&quality=85",
        info: { showImage: true, showDate: false, name: "23333333" }
    })