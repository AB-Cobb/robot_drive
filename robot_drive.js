const GIPIO = require('onoff').Gpio
const out_4 = new GIPIO(4, 'out')

const robot_serve_url ='https://react-hack-chat.herokuapp.com/'
const socketIO = require('socket.io-client')

console.log('RUNNING')

function power_4(){
    if (out_4.readSync() == 0){
        console.log("GIPIO 4 is hi")
        out_4.writeSync(1)
    }
}
function unpower_4(){
    console.log("GIPIO 4 is low")
    out_4.writeSync(0)
    out_4.unexport()
}
socket = socketIO(robot_serve_url)
socket.emit('change_username', {username:'Raspberry PI'})
mgs_greetings = {message : 'Hello from Respberry PI', username : "Raspberry PI"}
socket.emit('new_message', mgs_greetings)
socket.on('new_message', msg => {
    if (msg.username != "Raspberry PI"){
        socket.emit('new_message' ,{message :'PING ' + msg.message, username : "Raspberry PI"})
    }
    
    console.log('message', msg.message)
})
