// import logo from './logo.svg';
import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
// var reader = new FileReader();

const defaultCode =
    `<template>
<div class="container">
    <div class="text-magic" :data-word="time | formaDate">
        {{ time | formaDate }}
        <div class="white" />
    </div>
</div>
</template>

<script>
const padaDate = (value) => {
    return value < 10 ? '0' + value : value
}
export default {
    filters: {
    // 设置一个函数来进行过滤
        formaDate(value) {
            let year = value.getFullYear() // 存储年
            let month = padaDate(value.getMonth() + 1) // 存储月份
            let day = padaDate(value.getDate()) // 存储日期
            let hours = padaDate(value.getHours()) // 存储时
            let minutes = padaDate(value.getMinutes()) // 存储分
            let seconds = padaDate(value.getSeconds()) // 存储秒
            // 返回格式化后的日期
            return year + '年' + month + '月' + day + '日' + hours + '时' + minutes + '分' + seconds + '秒'
        }
    },
    data() {
        return {
            time: new Date()
        }
    },
    mounted() {
        let _this = this
        this.timer = setInterval(() => {
            _this.time = new Date()
        }, 1000)
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer)
        }
    },
    methods: {

    }
}
</script>

<style lang="less" scoped>
.container{
    height: 100vh;
    width: 100%;
    background: black;
    display: flex;
    align-items: center;
    justify-content: center;
}
.text-magic {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(2.4);
    width: 25%;
    font-size: 40px;
    font-family: Raleway, Verdana, Arial;
    color: #fff;
}
.white {
    position: absolute;
    left: -10px;
    width: 100%;
    height: 3px;
    background: #000;
    z-index: 4;
    animation: whiteMove 3s ease-out infinite;
}

.text-magic::before {
    content: attr(data-word);
    position: absolute;
    top: 0;
    left: 0.5px;
    height: 0px;
    color: rgba(255, 255, 255, 0.9);
    overflow: hidden;
    z-index: 2;
    animation: redShadow 1s ease-in infinite;
    filter: contrast(200%);
    text-shadow: 1px 0 0 red;
}

.text-magic::after {
    content: attr(data-word);
    position: absolute;
    top: 0;
    left: -3px;
    height: 36px;
    color: rgba(255, 255, 255, 0.8);
    overflow: hidden;
    z-index: 3;
    background: rgba(0, 0, 0, 0.9);
    animation: redHeight 1.5s ease-out infinite;
    filter: contrast(200%);
    text-shadow: -1px 0 0 cyan;
    mix-blend-mode: darken;
}

@keyframes redShadow {
    20% {
        height: 32px;
    }
    60% {
        height: 6px;
    }
    100% {
        height: 42px;
    }
}

@keyframes redHeight {
    20% {
        height: 42px;
    }
    35% {
        height: 12px;
    }
    50% {
        height: 40px;
    }
    60% {
        height: 20px;
    }
    70% {
        height: 34px;
    }
    80% {
        height: 22px;
    }
    100% {
        height: 0px;
    }
}

@keyframes whiteMove {
    8% {
        top: 38px;
    }
    14% {
        top: 8px;
    }
    20% {
        top: 42px;
    }
    32% {
        top: 2px;
    }
    99% {
        top: 30px;
    }
}
</style>
`;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: defaultCode,
        }
        this.onChangeHandle = this.onChangeHandle.bind(this);
    }
    onChangeHandle(value, e) {
        this.setState({
            code: value
        });
    }
    editorDidMountHandle(editor, monaco) {
        console.log('editorDidMount', editor);
        editor.focus();
    }
    goLive() {
        console.log('233')
    }
    render() {
        const code = this.state.code;
        const options = {
            selectOnLineNumbers: true,
            renderSideBySide: false
        };
        return (
            <div >
                {/* <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                        <h1 className="App-title">Welcome to React</h1>
                    </header>
                </div> */}
                <div className="wrapper">
                    <div className="editor-container" >
                        <MonacoEditor
                            width="800"
                            height="600"
                            language="javascript"
                            theme="vs-dark"
                            value={code}
                            options={options}
                            onChange={this.onChangeHandle}
                            editorDidMount={this.editorDidMountHandle}
                        />
                    </div>
                    <div className="view">
                        {this.state.code}
                    </div>
                    <div className="btn" onClick={(e) => this.goLive(e)}>go live</div>
                </div>
            </div>
        );
    }
}

export default App;
