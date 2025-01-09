const express = require("express");
const { WebSocketServer } = require("ws");
const app = express();

app.use(express.static("public"));

app.listen(8000, () => {
  console.log(`Example app listening on port 8000`);
});

const wss = new WebSocketServer({ port: 8008 });

wss.on("connection", (ws, request) => {
  // 새 클라이언트가 접속했을 때
  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(`새로운 유저가 접속했습니다. 현재 유저 ${wss.clients.size}명`);
    }
  });
  console.log(`새로운 유저 접속: ${request.socket.remoteAddress}`);

  // 클라이언트가 메시지를 보냈을 때
  ws.on("message", data => {
    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(data.toString());
      }
    });
  });

  // 클라이언트가 연결을 종료했을 때
  ws.on("close", () => {
    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(`유저 한 명이 떠났습니다. 현재 유저 ${wss.clients.size}명`);
      }
    });
  });
});
