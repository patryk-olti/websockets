const http = require('http');
const { WebSocketServer } = require('ws');

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;

wsServer.on("connection", (connection, request) => {
    // ws://localhost:8000?username=Alex

    const { username } = url.parse(request.url, true).query
    console.log(username);
    
})

server.listen(port, () => {
    console.log('listening on port ' + port	)
})