// import logo from './logo.svg';
import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import axios from 'axios'
import './App.css';

const defaultCode =
    `import log from './log'
    import './index.css'
    const formaDate=(value)=> {
        let year = value.getFullYear()
        let month = padaDate(value.getMonth() + 1)
        let day = padaDate(value.getDate())
        let hours = padaDate(value.getHours())
        let minutes = padaDate(value.getMinutes())
        let seconds = padaDate(value.getSeconds())
        return year + '年' + month + '月' + day + '日' + hours + '时' + minutes + '分' + seconds + '秒'
    }
    const padaDate = (value)=>{
        return value < 10 ? '0' + value : value
    }
    let body = document.querySelector('body')
    body.className = 'container'
    let childNode = document.createElement('div');
    childNode.className = 'text-magic'
    body.appendChild(childNode)

    setInterval(() => {
        let num = formaDate(new Date())
        childNode.innerHTML = num+'<div class="white"></div>'
        childNode.setAttribute('data-word', num)
    }, 1000)`;

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
        editor.focus();
    }
    goLive() {
        let { code } = this.state
        axios.post('http://localhost:8999/getFile', { code: code }).then((res) => {
            console.log(res)

            let iframeEl = document.getElementById('frame')
            setTimeout(() => {
                iframeEl.src = res.data.url
            }, 10000);


        })
    }
    render() {
        const code = this.state.code;
        const options = {
            selectOnLineNumbers: true,
            renderSideBySide: false
        };
        return (
            <div className="app">
                <div className="wrapper">
                    <div className="editor-container" >
                        <MonacoEditor
                            width="790"
                            height="600"
                            language="javascript"
                            theme="vs-dark"
                            value={code}
                            options={options}
                            onChange={this.onChangeHandle}
                            editorDidMount={this.editorDidMountHandle}
                        />
                    </div>

                    <button className="btn" onClick={(e) => this.goLive(e)}>go live</button>
                </div>
                <iframe id="frame" src="" title="view"></iframe>
            </div>
        );
    }
}

export default App;
