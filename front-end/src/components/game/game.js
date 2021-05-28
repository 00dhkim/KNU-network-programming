
import {connect} from 'react-redux'
import React, {useState} from 'react';
import { withRouter } from 'react-router-dom';
import io from "socket.io-client";

//emit : 데이터 줄때
//on : 데이터 받을 때
//join : 룸을 만든다 .
//src="/socket.io/socket.io.js"
const socket = io("http://localhost:5000/");
const msg = document.cookie;
const cookie = msg.split(";");
const style = {
    paper : {
        // name :cookie[0].substring(5) ,
        // userid :cookie[1].substring(7) 
    },
};
function game(){
    return(
        <div className="mt-2">
          <span>game</span>
        </div>
    )
}
export default withRouter(game)
// export default class game extends React.Component{

//     SendData(){
//         socket.emit("login",{
//             name :cookie[0].substring(5) ,
//             userid :cookie[1].substring(7)
//         });
//     }
//     RecvData(){
//         socket.on("login", function(data) {
//             ("#chatLogs").append("<div><strong>" + data + "</strong> has joined</div>");
//         });
//         socket.on("game", function(data) {
//             ("#chatLogs").append("<div>" + data.msg + " : from <strong>" + data.from.name + "</strong></div>");
//         });
//     }
//     handleSubmitClick = (e) => {
//         ("form").submit(function(e) {
//         e.preventDefault();
//         var msgForm = ("#msgForm");
//         socket.emit("game", { msg: msgForm.val() });
//         msgForm.val("");
//         });
//     }
//     
//     }
    
// }

