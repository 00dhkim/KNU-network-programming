import crypto from "crypto";
import React, {Component} from "react";
import io from "socket.io-client"; //모듈 가져오기

const socket = io.connect("http://localhost:5000/"); //백엔드 서버 포트를5000와 socket연결
let cookies = document
    .cookie
    .split(";");

const securekey = "key";
let dres = "";

const cipher = (value, key) => {
    const encrypt = crypto.createCipher('des', key);
    const encryptResult = encrypt.update(value, 'utf8', 'base64') + encrypt.final(
        'base64'
    );
    console.log(encryptResult);
    return encryptResult;
}

const decipher = (value, key) => {
    const decode = crypto.createDecipher('des', key);
    const decodeResult = decode.update(value, 'base64', 'utf8') + decode.final(
        'utf8'
    )
    console.log(decodeResult)
    return decodeResult;
}

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "", //id
            msg: "", //메세지 내용
            messageList: [], //메세지 리스트
            startword: "a",
            order: "",
        };
    }

    sendMsg = (e) => {
        e.preventDefault();
        socket.emit("game", cipher(JSON.stringify({
            name: cookies[0]
                ?.substring(5),
            msg: this.state.msg
        }), securekey));
        this.setState({name: "", msg: ""});
    };

    // when rendering start, this function called by once
    componentDidMount() {
        cookies = document.cookie.split(";");
        console.dir(cookies);
        console.log(cookies[0].substring(5));
        socket.emit("login", {
            name: cookies[0]?.substring(5),
            userid: cookies[1]?.substring(7)
        })
    }

    // callback func. by something change
    componentWillMount() {
        socket.on("login", (message) => {
            this.state.order = message.order;
            this.setState({
                messageList: [
                    ...this.state.messageList,
                    message
                ]
            });
        });

        socket.on("game", (message) => {
            console.log(message);
            dres = decipher(message, securekey);
            message = JSON.parse(dres);

            if (message.res == false) {
                message.msg = message.comment;
            }

            this.setState({
                messageList: [
                    ...this.state.messageList,
                    message
                ]
            });

            this.state.order = message.order;
            let startword = message.startword;
            this.setState({
                ...this.state.startword, 
                startword
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
                <h4>Start Word : {this.state.startword} | Cur Order : {this.state.order}</h4>
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
                        I'm {cookies[0]?.substring(5)} 
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
