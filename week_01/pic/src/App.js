// 读取本地图片转换成灰度图保存。
import './App.css';
import React from 'react';
import { Button } from 'antd';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            src: ''
        }
    }
    handleFiles(file) {
        let reader = new FileReader();
        reader.onload = (e) => {
            this.setState({
                src: e.target.result
            });
            setTimeout(() => {
                this.updateCanvas()
            }, 10);

        };
        reader.onerror = (err) => {
            console.log(err);
        };
        reader.readAsDataURL(file.target.files[0]);
    }
    updateCanvas() {
        const ctx = this.refs.canvas.getContext('2d');
        ctx.clearRect(0, 0, 400, 400);

        let img = document.createElement('img'); //创建img元素
        img.src = this.state.src;

        let imgWidth = img.width;   //获取图片的宽度
        let imgHeight = img.height; //获取图片的高度
        let targetWidth = 400;      //指定目标canvas区域的宽度
        let targetHeight = (imgHeight * targetWidth) / imgWidth;    //计算出目标canvas区域的高度

        let x = 0, y = 0;   // 计算绘制偏移量
        if (imgWidth > imgHeight) {   // 图片宽大于高
            y = (400 - targetHeight) / 2
        } else if (imgWidth < imgHeight) {
            x = (400 - targetWidth) / 2
        } else {
            x = (400 - targetWidth) / 2
            y = (400 - targetHeight) / 2
        }


        img.addEventListener(
            'load',
            () => {
                ctx.drawImage(img, x, y, targetWidth, targetHeight);
                let imagedata = ctx.getImageData(0, 0, img.width, img.height);
                let data = imagedata.data;

                let i, len, red, green, blue, average;

                for (i = 0, len = data.length; i < len; i += 4) {
                    red = data[i];
                    green = data[i + 1];
                    blue = data[i + 2];

                    average = Math.floor((red + green + blue) / 3);

                    data[i] = average;
                    data[i + 1] = average;
                    data[i + 2] = average;
                }

                ctx.putImageData(imagedata, 0, 0)
            },
            false,
        )
    }
    download() {
        let dataImg = new Image();
        dataImg.src = this.refs.canvas.toDataURL("image/png");
        document.body.appendChild(dataImg);

        let alink = document.createElement("a");
        alink.href = dataImg.src;
        alink.download = "gray";
        document.body.appendChild(alink);
        alink.click();
    }
    render() {
        let { src } = this.state
        return (
            <div className="App">
                <div className="wrap">
                    {src && <img className="img" src={src} alt="pic"></img>}
                    <Button type="primary">
                        <label htmlFor="upload">
                            <span>选择图片</span>
                            <input type="file" id="upload" accept="image/*" onChange={(e) => this.handleFiles(e)}></input>
                        </label>
                    </Button>
                </div>
                <div className="wrap">
                    {src && <canvas ref="canvas" className="img" width="400" height="400"></canvas>}
                    <Button onClick={this.download.bind(this)} type="primary">保存图片</Button>
                </div>
            </div>
        )
    }
}

export default App;
