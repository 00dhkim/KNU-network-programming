import React,{ useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios'
import io from "socket.io-client";

function Game(props){
    var socket = io("http://localhost:5000/");
    // 서버로 자신의 정보를 전송한다.
    
    this.state = {
        name : props.name,
        userid : props.userid
    };
    socket.emit("login", {
        name: this.state.name,
        userid: this.state.userid,
        });
    
    socket.on("login", function Game(data) {
        ("#chatLogs").append("<div><strong>" + data + "</strong> has joined</div>");
      });
        // 서버로부터의 메시지가 수신되면
    socket.on("chat", function Game(data) {
        ("#chatLogs").append("<div>" + data.msg + " : from <strong>" + data.from.name + "</strong></div>");
      });
      // Send 버튼이 클릭되면
    
      const handleSubmitClick = (e) => {
          e.preventDefault();
          ("form").submit(function Game(e) {
            e.preventDefault();
            var msgForm = ("#msgForm");
      
            // 서버로 메시지를 전송한다.
            socket.emit("chat", { msg: msgForm.val() });
            msgForm.val("");
          });
      }
      return(
          <div class = "container">
              <h3>Socket.io Chat Example</h3>
              <form class = "form-inline">
                  <div class = "form-group">
                      <lavel for="msgForm">Message : </lavel>
                      <input type = "text" class ="form-control" id="msgForm">
                          
                      </input>
                  </div>
                  <button 
                  type="submit" 
                  class = "btn btn-primary"
                  onClick ={handleSubmitClick}>Send</button>
              </form>
          <div id = "chatLogs"></div>
          </div>
      )
}
export default withRouter(Game);