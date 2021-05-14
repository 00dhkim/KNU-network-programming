// creat app
const express = require('express');
const app = express();
const port = 5000;

// middleware
var expressErrorHandler = require('express-error-handler');


// routes
const gameRouter = require('./routes/game');
const waitRouter = require('./routes/wait');
const loginRouter = require('./routes/login');
const addUserRouter = require('./routes/addUser');

// preprocessing
app.set('views', './views');
app.set('view engine', 'ejs');

// main -> login
app.get('/', (req, res) => {
    res.redirect('/login');
})

app.use('/game', gameRouter);
app.use('/wait', waitRouter);
app.use('/login', loginRouter);
app.use('/addUser', addUserRouter);


var errorHandler = expressErrorHandler(
    { static: { '404': './public/404.html' } }              //404 에러 코드가 발생하면 해당 페이지를 보여주는 예외 미들웨어
);
 
app.use(expressErrorHandler.httpError(404));
app.use(expressErrorHandler);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
