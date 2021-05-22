//socket
const socketIO = require('socket.io');

//process start
module.exports = (server) => {
    console.log("check");
    const io = socketIO(server);

    // variable
    let packet = {
        from: {
            name: "",
            userid: ""
        },
        msg: "",
        res: true
    };

    let gameInfo = {
        order: 0,
        participants: [],
        startword: 'a',
        res: true,
        res_message: "",

        // check order
        isOrder(username) {
            if (username === this.participants[this.order]) 
                return true;
            else 
                return false;
            }
        ,

        // check first word
        isStartWord(statement) {
            if (statement.charAt(0) === this.startword) 
                return true;
            else 
                return false;
            }
        ,

        // check user & msg
        isCheck(state, username) {
            if (this.isOrder(username) && this.isStartWord(state)) 
                return true;
            else 
                return false;
            }
        
    }

    // socket
    io.on('connection', function (socket) {

        // event : login (== access) (input data : name / userid)
        socket.on('login', function (data) {
            console.log(
                'Client logged-in:\n name:' + data.name + '\n userid: ' + data.userid
            );
            //
            // socket info
            socket.name = data.name;
            socket.userid = data.userid;
            //
            // send
            io.emit('login', data.name);

            //config gameInfo
            gameInfo
                .participants
                .push(data.name);
        });

        // event : chat (input data : name / msg)
        socket.on('chat', function (data) {
            console.log('Message from %s: %s', socket.name, data.msg);

            // config packet
            packet.from.name = socket.name;
            packet.from.userid = socket.userid;
            packet.msg = data.msg;
            packet.res = true;

            // send
            io.emit('chat', packet);

            // 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다  socket.broadcast.emit('chat', msg);
            //
            // 메시지를 전송한 클라이언트에게만 메시지를 전송한다  socket.emit('chat', msg);
            //
            // 접속된 모든 클라이언트에게 메시지를 전송한다  io.emit('chat', msg);
            //
            // 특정 클라이언트에게만 메시지를 전송한다 io.to(id).emit('chat', data);
        });
        //

        // event : game
        socket.on('game', (data) => {

            if (gameInfo.isCheck(data.msg, socket.name)) {
                gameInfo.order = (gameInfo.order + 1) % gameInfo.participants.length;
                gameInfo.startword = data
                    .msg
                    .charAt(data.msg.length - 1);
                gameInfo.res = true;
                gameInfo.res_message = "success";
            } else {
                gameInfo.res = false;
                if (gameInfo.isOrder(socket.name)) {
                    gameInfo.res_message = "startword is wrong!";
                } else {
                    gameInfo.res_message = "you are not in order yet!";
                }
            }

            // config packet
            packet.from.name = socket.name;
            packet.from.userid = socket.userid;
            packet.msg = data.msg;

            // send
            if (gameInfo.res) {
                packet.res = true;
                io.emit('game', packet);
            } else {
                packet.res = false;
                packet.comment = gameInfo.res_message;
                socket.emit('game', packet);
            }

            console.dir(packet);
        });

        // event : disconnected force client disconnect from server
        socket.on('forceDisconnect', function () {

            // config packet
            packet.from.name = socket.name;
            packet.from.userid = socket.userid;
            packet.msg = 'user disconnected: ' + socket.name;

            // send
            io.emit('chat', packet);

            socket.disconnect();
        });
        socket.on('disconnect', function () {

            // config packet
            packet.from.name = socket.name;
            packet.from.userid = socket.userid;
            packet.msg = 'user disconnected: ' + socket.name;

            // send
            io.emit('chat', packet);

            console.log('user disconnected: ' + socket.name);
        });
    });
};

//  export module.exports = router;