const GIPIO = require('onoff').Gpio

let motor_left = {
    pin1 : new GIPIO(2, 'out'),
    pin2 : new GIPIO(3,'out'),
    forward : function (params) {
        this.pin1.writeSync(1)
        this.pin2.writeSync(0)
    },
    backward : function (params) {
        this.pin1.writeSync(0)
        this.pin2.writeSync(1)
    },
    stop : function (params) {
        this.pin1.writeSync(0)
        this.pin2.writeSync(0)
    }
}
let motor_right = {
    pin1 : new GIPIO(17, 'out'),
    pin2 : new GIPIO(27,'out'),
    forward : function (params) {
        this.pin1.writeSync(1)
        this.pin2.writeSync(0)
    },
    backward : function (params) {
        this.pin1.writeSync(0)
        this.pin2.writeSync(1)
    },
    stop : function (params) {
        this.pin1.writeSync(0)
        this.pin2.writeSync(0)
    }
}
//*/
const ffmpeg_cmd = "ffmpeg -s 640x480 -f video4linux2 -i /dev/video0 -f mpegts -codec:v mpeg1video -bf 0 -codec:a mp2 -r 30 https://picamserver.herokuapp.com/streamin"
var exec = require('child_process').exec;
exec(ffmpeg_cmd, (err, stdout, stderr) => {
    if (err){console.log("pi cam err : ", err)}
    console.log(
        'stdout' + stdout
    )
})

const robot_serve_url ='https://robotserve.herokuapp.com/'
const socketIO = require('socket.io-client')

console.log('RUNNING')

socket = socketIO(robot_serve_url)
socket.emit('PI_log', {txt: 'PI online... awaiting command'} )

socket.on('cmd', data => {
    //console.log('command : ', data.drive)
    //socket.emit('PI_log', {txt : "Revicived command" + data.drive})
    let drive = data.drive;
    switch (drive){
        case 'fwd':
            console.log('Going Forward')
            socket.emit('PI_log', {txt : "Going Forward"})
            motor_left.forward()
            motor_right.forward()
            break;
        case 'bck':
            console.log('Going Backward')
            socket.emit('PI_log', {txt : "Going Backward"})
            motor_left.backward()
            motor_right.backward()
            break;
        case 'lft':
            console.log('Turning Left')
            socket.emit('PI_log', {txt : "Turning Left"})
            motor_left.backward()
            motor_right.forward()
            break;
        case 'rght':
            console.log('Turning Right')
            socket.emit('PI_log', {txt : "Turning Right"})
            motor_left.forward()
            motor_right.backward()
            break;
        case 'stop':
            console.log('Stoping')
            socket.emit('PI_log', {txt : "Stoping"})
            motor_left.stop()
            motor_right.stop()
            break;

    }
})
