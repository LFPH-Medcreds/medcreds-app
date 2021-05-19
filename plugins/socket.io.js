import Vue from 'vue'
import io from 'socket.io-client'
import VueSocketIOExt from 'vue-socket.io-extended'

var token = localStorage.getItem('jwt')
var socket = io.connect(`http://localhost:5000`, {
  query: `token=${token}`
})

console.log('socket.io plugin', socket)
socket.on('connected', function (socket) {
  socket
    .on('authenticated', () => {
      console.log('authenticated socket connection with server')
      //do other things
    })
    .emit('authenticate', { token })
})

export default ({ store }) => {
  Vue.use(VueSocketIOExt, socket, { store })
}
