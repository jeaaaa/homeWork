import log from './log'
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
    }, 1000)