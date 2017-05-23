const app = require('express')();
const url = require('url');
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const io = require('socket.io')(server);
const SECRET_TOKEN = process.env['SECRET_TOKEN'] || 'hansight-12qwaszx';
const clients = [];

server.listen(process.env['PORT'] || 3001);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/', function (req, res) {
  if (req.query.token !== SECRET_TOKEN) {
    return res.status(403).end();
  }
  clients.forEach(s => {
    try {
      s.emit('webhook', req.body);
    } catch(ex) {
      console.error(ex);
    }
  });
  res.status(200).end();
});

io.on('connection', function (socket) {
  if (!socket.request.url) {
    return socket.disconnect(true);
  }
  let _q = url.parse(socket.request.url, true).query;
  if (!_q.token || _q.token !== SECRET_TOKEN) {
    return socket.disconnect(true);
  }
  clients.push(socket);
  socket.on('disconnect', on_close);
  socket.on('error', on_close);

  function on_close() {
    try {
      socket.disconnect(true);
    } catch(ex) {
      console.error(ex);
      // ignore
    }
    let idx = clients.indexOf(socket);
    if (idx >= 0) {
      clients.splice(idx, 1);
    }
  }

});