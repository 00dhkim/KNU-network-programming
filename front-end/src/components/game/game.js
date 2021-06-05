import { withRouter } from 'react-router-dom';

//emit : 데이터 줄때
//on : 데이터 받을 때
//join : 룸을 만든다 .
//src="/socket.io/socket.io.js"
// import React, { useState, useEffect } from "react";
// import socketIOClient from "socket.io-client";
// import { render } from 'react-dom';
// import TextField from '@material-ui/core/TextField'
// const ENDPOINT = "http://127.0.0.1:5000";

// const socket = socketIOClient(ENDPOINT);
// const msg = document.cookie;
// const cookie = msg.split(";");

// let payload = {
//     userid : "",
//     name : ""
// }
// payload.name = cookie[0]?.substring(5);
// payload.userid = cookie[1]?.substring(8);

// socket.emit("login",{ //유저 이름과 아이디를 보냄
//     name : payload.name,
//     userid :payload.userid
// });

// function App() {
//     const[user,setUser] = useState("");
//     const[word,setWord]= useState("");
//     const[name,setName]= useState("");
//     const[input, setInput]=useState("");
//     const[message,setMessage]= useState(""); // 새로 추가된 메시지
//     const[chatMonitor,setChatMonitor] = useState([]); //지금까지 모든 메시지
//     const [state, setState] = useState({message:'', name:''})
//     var num =0;
//     //console.log(msg);

//     socket.on("login",function(data){ //유저이름을 받음.
//         setUser(data);
//     });
    
//    useEffect(()=>{
//     socket.on("game", function(data) {//서버에서 보낸 메시지를 받음
//         console.log("data received");
//         console.dir(data); // good
//         if(data.res != false){
//             let msgdata = data.msg;
//             let namedata = data.from.name;
//             // setMessage(data.msg);
//             // setName(data.from.name);
//             console.dir(data.from.name);
//             setChatMonitor([...chatMonitor, {namedata, msgdata} ]);
//         }
        
//     })
//    })
    

//     const onChange=(e) => {
//         setInput(e.target.value);
//         setState({...state,[e.target.name]: e.target.value ,'name' :payload.name  })
//     }

//     const onClick= (e)=>{ //내가 메시지를 서버로 보낼 떄
//         e.preventDefault()
//         console.log("onClick invoked")
        
//         const{name,message}=state
//         socket.emit("game",{msg:input})
//        // setChatMonitor( [...chatMonitor, {name, message}] );
//         console.dir(name);
//         console.dir(message);

//         // console.dir(msg);
//         setInput("")
//         setState({message:'',name:''})

//     }
//     // useEffect(() => {
//     //     console.log('chatMoniter 변경됨');
//     //     console.dir(chatMonitor);
//     //   }, [chatMonitor]);

//     const renderChat=()=> {
//         console.log("render")
//        // console.dir(chatMonitor)
//        return chatMonitor.map(({name, message},index)=>(
//            <div key={index}>
//            <h3>{name}:<span>{message}</span></h3>
//            </div>
//        ))
//    }
   
//   return(
//         <div>
//             <form onSubmit={onClick}>
//             <h1>Message</h1>
//             <div>
//                 <TextField 
//                 name = "message"
//                 onChange={e=>onChange(e)}
//                 value={state.message}
//                 id="outlined-multiline-static"
//                 variant = "outlined"
//                 label="Message"/>
//             </div>
//             <button>Send Message</button>
//             </form>
//             <div className = "render-chat">
//                 <h1>Chat log</h1>
//                 {renderChat()}
//             </div>
//         </div>
//         /* <div className="container">
//         <h3>Ending Game</h3>
//         { <form className="form-inline"> }
//         <div className="form-group">
//         <label for="msgForm">Message: </label>
//         <input 
//         type="text" 
//         className="form-control" 
//         onChange={(onChange)} 
//         value={input} ></input>
//         </div>
//         <button 
//         type="sumit" 
//         className="btn btn-primary" 
//         onClick = {onClick} 
//         >Send</button>
//         <div>
//       <strong>{user} </strong>has joined
      
//       </div>
//         <div className = "messagelist">
//           <p className = "username">{payload.name}</p>
//           <p className = "msg_text">{input}</p>
//       </div>
//         </div> */
//   );
// }

import React, { Component } from "react";
import io from "socket.io-client"; //모듈 가져오기

const socket = io.connect("http://localhost:5000/");  //백엔드 서버 포트를5000와 socket연결 

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",          //id
      msg: "",			 //메세지 내용
      messageList: [],	 //메세지 리스트
    };
  }
  sendMsg = (e) => {
    e.preventDefault();
    socket.emit("chat", {	
      name: this.state.name,
      msg: this.state.msg,
    });
    this.setState({
      name: "",
      msg: "",
    });
  };
  componentWillMount() {
    socket.on("chat", (message) => {   //"receive message"라는 이벤트 받음(2)
      this.setState({
        messageList: [...this.state.messageList, message],
      });
    });
  }
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  render() {
    return (
      <div>
        <form className="chat_con" onSubmit={this.sendMsg}>
          <div className="chat_inputs">
            <input
              type="text"
              onChange={this.onChange}
              value={this.state.name}
              name="name"
              id="id"
              placeholder="아이디"
            />
            <input
              type="text"
              onChange={this.onChange}
              value={this.state.msg}
              name="msg"
              id="msg"
              placeholder="메세지내용"
            />
          </div>
          <button className="chat_button" type="submit">
            보내기
          </button>
        </form>
        <section className="chat_list">
          {this.state.messageList.map((item) => (
            <div className="messagelist">
              <p className="username">{item.from.name}</p>
              <p className="msg_text">{item.msg}</p>
            </div>
          ))}
        </section>
      </div>
    );
  }
}
