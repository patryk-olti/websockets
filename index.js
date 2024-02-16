const http = require('http');
const { WebSocketServer } = require('ws');

const url = require('url');
const uuidv4 = require('uuid').v4;

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;

const connections = {};
const users = {};

const broadcastUsers = () => {
    Object.keys(connections).forEach( uuid => {
        const connection = connections[uuid]
        const message = JSON.stringify(users)
        connection.send(message)
    })
}

const handleMessage = (bytes, uuid) => {
    const message = JSON.parse(bytes.toString())
    const user = users[uuid]
    user.state = message

    broadcastUsers()

    console.log(`${user.username} updated their state: ${JSON.stringify(user.state)}`)
}

const handleClose = uuid => {

    console.log(`${users[uuid]} disconnected`)
    delete connections[uuid]
    delete users[uuid]

    broadcastUsers()
}

wsServer.on("connection", (connection, request) => {
    // ws://localhost:8000?username=Alex

    const { username } = url.parse(request.url, true).query
    const uuid = uuidv4();

    console.log(username)
    console.log(uuid)

    //broadcast
    connections[uuid] = connection;

    users[uuid] = {
        username,
        state: { }
    }

    connection.on("message", message => handleMessage(message, uuid))
    connection.on("close", () => handleClose(uuid))

})

server.listen(port, () => {
    console.log('listening on port: ' + port	)
})