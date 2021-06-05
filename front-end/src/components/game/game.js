import React, {Component} from "react";
import io from "socket.io-client"; //모듈 가져오기

const socket = io.connect("http://localhost:5000/"); //백엔드 서버 포트를5000와 socket연결
let cookies = document
    .cookie
    .split(";");

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "", //id
            msg: "", //메세지 내용
            messageList: [], //메세지 리스트

        };
    }

    sendMsg = (e) => {
        e.preventDefault();
        socket.emit("game", {
            name: cookies[0]
                ?.substring(5),
            msg: this.state.msg
        });
        this.setState({name: "", msg: ""});
    };

    // when rendering start, this function called by once
    componentDidMount() {
        console.log(cookies[0].substring(5));
        socket.emit("login", {
            name: cookies[0].substring(5),
            userid: cookies[1].substring(7)
        })
    }

    // callback func. by something change
    componentWillMount() {
        socket.on("login", (message) => {
            this.setState({
                messageList: [
                    ...this.state.messageList,
                    message
                ]
            });
        });

        socket.on("game", (message) => {

            if (message.res == false) {
                message.msg = message.comment;
            }

            this.setState({
                messageList: [
                    ...this.state.messageList,
                    message
                ]
            });
        });
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    render() {
        return (
            <div>
                <form className="chat_con" onSubmit={this.sendMsg}>
                    <div className="chat_inputs">
                        {/* <input
              type="text"
              onChange={this.onChange}
              value={this.state.name}
              name="name"
              id="id"
              placeholder="아이디"
            /> */
                        }
                        <input
                            type="text"
                            onChange={this.onChange}
                            value={this.state.msg}
                            name="msg"
                            id="msg"
                            placeholder="메세지내용"/>
                    </div>
                    <button className="chat_button" type="submit">
                        보내기
                    </button>
                </form>
                <section className="chat_list">
                    {
                        this
                            .state
                            .messageList
                            .map((item) => (
                                <div className="messagelist">
                                    <span className="username">{item.from.name}
                                        :
                                    </span>
                                    <span className="msg_text">{item.msg}</span>
                                </div>
                            ))
                    }
                </section>
            </div>
        );
    }
}
