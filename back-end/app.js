// creat app
const express = require('express');
const app = express();
const port = 5000;
let server;

// middleware
var expressErrorHandler = require('express-error-handler');
const cors = require('cors');
const path = require('path');

// routes
const waitRouter = require('./routes/wait');
const loginRouter = require('./routes/login');
const addUserRouter = require('./routes/addUser');
const mlRouter = require('./routes/ml');

// socket
const gameSocket = require('./routes/game');

// preprocessing
app.use(cors());
app.set('views', './views');
app.set('view engine', 'ejs');

// main -> login
app.get('/', (req, res) => {
    res.redirect('/login');
})

// game -> views/index.html
app.get('/game', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/views/index.html'));
});

// Custom middleware
app.use('/wait', waitRouter);
app.use('/login', loginRouter);
app.use('/addUser', addUserRouter);
app.use('/ml', mlRouter);


// just some bug..........
// var errorHandler = expressErrorHandler(
//     { static: { '404': './public/404.html' } }              //404 에러 코드가 발생하면 해당 페이지를 보여주는 예외 미들웨어
// );
 
// app.use(expressErrorHandler.httpError(404));
// app.use(expressErrorHandler);

// listen
server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

// socket for processing game
gameSocket(server);
