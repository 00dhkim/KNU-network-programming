// router
var express = require('express');
var router = express.Router();

// middleware
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mySql = require('mysql');
var expressSession = require('express-session');

// create pool
var pool = mySql.createPool({
    connectionLimit: 10,            //접속을 10개 만들고 10개를 재사용
    host: '155.230.52.58',
    user:'root',
    password: 'network123!',   //MySql 설치할때의 비번을 입력하면 됨!!
    database: 'NODE_DB',
    debug: false
});

// create return json
let json =  {
    result : false
};


//post 방식 일경우 begin
//post 의 방식은 url 에 추가하는 방식이 아니고 body 라는 곳에 추가하여 전송하는 방식
router.use(bodyParser.urlencoded({ extended: false }));            // post 방식 세팅
router.use(bodyParser.json());                                     // json 사용 하는 경우의 세팅
//post 방식 일경우 end
 
//쿠키와 세션을 미들웨어로 등록한다
router.use(cookieParser());
 
//세션 환경 세팅
//세션은 서버쪽에 저장하는 것을 말하는데, 파일로 저장 할 수도 있고 레디스라고 하는 메모리DB등 다양한 저장소에 저장 할 수가 있는데
router.use(expressSession({
    secret: 'my key',           //이때의 옵션은 세션에 세이브 정보를 저장할때 할때 파일을 만들꺼냐 , 아니면 미리 만들어 놓을꺼냐 등에 대한 옵션들임
    resave: true,
    saveUninitialized: true
}));


// type : get
router.route('/').get(
    (req, res) =>
    {
        res.render('login2');
    }
);

// type : post
router.route('/').post(
        function (req, res) {
            console.log('/login 호출됨');
            var paramID = req.body.id || req.query.id;
            var paramPW = req.body.passwords || req.query.passwords;
            console.log('paramID : ' + paramID + ', paramPW : ' + paramPW);
     
            authUser( paramID, paramPW,
                function (err, rows)
                {
                    if (err) {
                        console.log('Error!!!');
                        res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
                        res.write('<h1>에러발생</h1>');
                        res.end();
                        return;
                    }
     
                    if (rows) {
                        console.dir(rows);
                        json.result = true;
                        
                        res.writeHead(200, { "Content-Type": "json" });
                        res.write('<h1>Login Success</h1>');
                        res.write('<h1> user </h1>' + rows[0].name);
                        res.write('<br><a href="/login"> re login </a>');
                        res.end();
                        
                    }
                    else {
                        console.log('empty Error!!!');
                        json.result = false;
                        
                        res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
                        res.write('<h1>user data not exist</h1>');
                        res.write('<a href="/login"> re login</a>');
                        res.end();
                        
                    }
                    //res.json(json);
                }
            );
        }
);

var authUser = function (id, password, callback) {
    console.log('input id :' + id + '  :  pw : ' + password);
 
 
    pool.getConnection(function (err, poolConn) {
        if (err) {
            if (poolConn) {
                poolConn.release();     //pool 반환처리
            }
 
            callback(err, null);
            return;
        }
 
        console.log('데이터베이스 연결 스레드 아이디' + poolConn.threadId);
 
        var tablename = 'users';
        var columns = ['id', 'name'];
 
 
        //id 와 pw 가 같은것을 조회한다
        var exec = poolConn.query("select ?? from ?? where id = ? and password=?", [columns, tablename, id, password],
 
            function (err, rows)
            {
                poolConn.release();     //pool 반환처리
                console.log('실행된 ssql : ' + exec.sql);
 
                if (err) {
                    callback(err, null);
                    return;
                }
 
                if (rows.length > 0) {
                    console.log('사용자 찾음');
                    callback(null, rows);
                } else {
                    console.log('사용자 찾지 못함');
                    callback(null, null);
                }
 
            }
        );
 
    }
    );
 
 
};


// export
module.exports = router;


 
 