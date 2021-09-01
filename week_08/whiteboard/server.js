const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
    cors: true,
    transports: ["websocket"],
});
const port = process.env.PORT || 7900;

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
    socket.on("draw", (data) => {
        console.log("draw", data);
        socket.broadcast.emit("draw", data);
    });
});
http.listen(port, () => console.log("listening at http://localhost:" + port));
