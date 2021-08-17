const http = require('http');
const { fork } = require('child_process');
const socketIo = require('socket.io')

process.send({
    message: 'from worker',
    // server
});


const app = http.createServer();
app.listen(8080, '127.0.0.1');
const io = socketIo(app);
io.on('connection', (socket) => {
    console.log('a new request connect success');
});

// worker工作进程接收到master主进程分发的请求
process.on('message', (action, connection) => {
    if (action && action === 'throw error') {
        throw new Error('Kill myself');
    }
    connection.resume();
    app.emit('connection', connection); // 将请求传递到上面的socket.io
})