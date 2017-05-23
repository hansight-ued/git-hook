const io = require('socket.io-client');
const socket = io(`http://${process.env['HOST'] || '127.0.0.1'}:${process.env['PORT'] || 3001}?token=${process.env['SECRET_TOKEN'] || 'hansight-12qwaszx'}`);

socket.on('connect', () => {

});

socket.on('webhook', data => {
  console.log(data);
});

socket.on('error', _exit);
socket.on('close', _exit);

function _exit(err) {
  if (err) {
    console.error(err);
  }
  process.exit(err ? -1 : 0);
}