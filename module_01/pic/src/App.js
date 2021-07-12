// 读取本地图片转换成灰度图保存。
import './App.css';
import React from 'react';
import { Button } from 'antd';


function App() {

    return (
        <div className="App">
            <input type="file" accept="" style="display: none;"></input>
            <Button type="primary">Button</Button>
        </div>
    );
}

export default App;
