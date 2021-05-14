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

// get
router.route('/').get(
    (req, res) =>
    {
        res.render('addUser2');
    }
)

// post
router.route('/').post(
    function (req, res)
    {
        console.log('process/addUser 호출됨');
        var paramID = req.body.id || req.query.id;
        var paramPW = req.body.passwords || req.query.passwords;
        var paramName = req.body.name || req.query.name;
        console.log('id: ' + paramID + ', paramPW: ' + paramPW + ', paramName: ' + paramName);
 
        addUser(paramID, paramName, paramPW,
            function (err, result) {
                if (err) {
                    console.log('Error!!!');
                    console.log(err);
                    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
                    res.write('<h1>에러발생 - 이미 존재하는  아이디일수 있음</h1>');
                    res.write('<br><a href="/login"> re login </a>');
                    res.end();
                    return;
                }
 
                if (result)
                {
                    console.dir(result);
                    json.result = true;
                    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
                    res.write('<h1>Add Success</h1>');
                    res.write('<br><a href="/login"> re login </a>');
                    res.end();
                }
                else
                {
                    json.result = false;
                    console.log('데이터베이스에 추가 에러');
                    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
                    res.write('<h1> Failed : add user</h1>');
                    res.write('<a href="/login"> re login</a>');
                    res.end();
                }
                res.json(json);
            }
        );
    }
);
 

var addUser = function(id,name,passwords,callback)
{
    console.log('addUser 호출');
 
    //pool로 DB접근 함수 호출(mysql 접근)
    //conn 연결된 객체
    pool.getConnection(
        function (err, poolConn)
        {
            if (err)
            {
                if (poolConn) {
                    poolConn.release();        // 사용한후 해제(반납)한다
                }
                callback(err, null);
                return;
            }
            console.log('데이터베이스 연결 스레드 아이디' + poolConn.threadId);
            var data = { id: id, name: name, password: passwords };
 
            //users 테이블에 데이터 추가
            var exec = poolConn.query('insert into users set ?', data,
                function (err, result)
                {
                    poolConn.release();
                    console.log('실행된 SQL : ' + exec.sql);
 
                    if (err) {
                        console.log('sql 실행 시 에러 발생');
                        callback(err, null);
                        return;
                    }
 
                    callback(null, result);
                }
            );
        }
    );
}



// export
module.exports = router;


 
 