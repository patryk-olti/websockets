const http = require('http');

const server = http.createServer();
const port = 8000;

server.listen(port, () => {
    console.log('listening on port ' + port	)
})