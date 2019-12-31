var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var fetch = require('node-fetch');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require('./routes/getComics');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

async function getComic(id){
  let res = await fetch(`https://xkcd.com/${id}/info.0.json`);
  let resjson = await res.json();
  console.log(resjson);
  return resjson;
}
async function getRhymes(word){
  let res = await fetch(`http://api.datamuse.com/words?rel_rhy=${word}&max=3`);
  let resjson = await res.json();
  console.log(resjson);
  return resjson;
}

app.use('/comic/:comicId', async function(req, res){
  let response = await getComic(req.params.comicId);
  res.send(response);
});
app.use('/rhyme/:word', async function(req, res){
  console.log(req.params.word);
  let response = await getRhymes(req.params.word).then(res => res).catch(err => console.log(`Error is ${err}`));
  res.send(response);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
