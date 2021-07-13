// 读取本地图片转换成灰度图保存。
import './App.css';
import React from 'react';
import { Button } from 'antd';


function App() {

    return (
        <div className="App">
            <div className="">
                <Button type="primary">
                    <label htmlFor="upload">
                        <span>选择图片</span>
                        <input type="file" id="upload" accept=""></input>
                    </label>
                </Button>
            </div>
            <div>
                <Button type="primary">保存图片</Button>
            </div>
        </div>
    );
}

export default App;
