
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


const robot_serve_url ='https://robotserve.herokuapp.com/'
const socketIO = require('socket.io-client')
const socketIOstream = require('socket.io-stream')

const { StreamCamera, Codec } = require ('pi-camera-connect')
const webcamStream = new StreamCamera( {codac : Codec.H264} )

console.log('RUNNING')

socket = socketIO(robot_serve_url)
socket.emit('PI_log', {txt: 'PI online... awaiting command'} )
const fs = require ("fs");

const runApp = async () => {

    const streamCamera = new StreamCamera({
        codec: Codec.H264
    });

    const videoStream = streamCamera.createStream();

    const writeStream = fs.createWriteStream("video-stream_2.h264");

    // Pipe the video stream to our video file
    videoStream.pipe(writeStream);
    console.log('awaiting cam start')
    await streamCamera.startCapture();
    console.log("cam is started")
    // We can also listen to data events as they arrive
    videoStream.on("data", data => console.log("New data", data));
    videoStream.on("end", data => console.log("Video stream has ended"));

    // Wait for 5 seconds
    await new Promise(resolve => setTimeout(() => resolve(), 5000));

    await streamCamera.stopCapture();
};

runApp();

/*
var outstream = socketIOstream.createStream()
webcamStream.startCapture().then(() => {
    console.log('cam stream started')
    socketIOstream(socket).emit('PI_cam', outstream)
    webcamStream.pipe(outstream)
    webcamStream.on("data", data => console.log("New data", data));
})

//*/
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
