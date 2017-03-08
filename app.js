var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/logintutorial')
var db = mongoose.connection;
var http = require('http')/*.Server(app)*/;
//var io = require('socket.io')(http);
var routes = require('./routes/index');
var users = require('./routes/users');
//fileReader
var fs = require('fs');

var url = require('url');
//Initialise the application
var app = express();

//Setup viewengine
app.set('views', path.join( __dirname, 'views')); //Telling system views folder will handle views
app.engine('handlebars', exphbs({defaultLayout: 'layout'})); //Handlebars - layout file will be called
app.set('view engine', 'handlebars');

//BodyParser Middleware -- configurations
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//set Public folder -stylesheets, images, jQuery
app.use(express.static(path.join(__dirname, 'public')));

//Express session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

//Passport Initialise
app.use(passport.initialize());
app.use(passport.session());

//Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.'),
      root          = namespace.shift(),
      formParam     = root;
    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//connect Flash Middleware
app.use(flash());

//Global Variables for flash
app.use(function (req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//Routes Middleware
app.use('/', routes);
app.use('/users', users);

//Set Port
//app.set('port', (process.env.PORT || 3000));
//app.listen(3000);
/*
app.listen(app.get('port'), function(){
  console.log('Server listening on ' +app.get('port'));
});*/

console.log('outside');
var server = http.createServer(function(request, response){
    var path = url.parse(request.url).pathname;
    console.log("inside");

    switch(path){
        case '/':
          /*  response.writeHead(200, {'Content-Type': 'text/html'});
            response.write('hello world');
            response.end();
            break;
            */
            fs.readFile('./views/index.handlebars', function(error, data){
                if (error){
                    response.writeHead(404);
                    response.write("opps this doesn't exist - 404");
                    response.end();
                }
                else{
                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.write(data, "utf8");
                    response.end();
                }
            });
            break;
        case '/views/buzz.handlebars':
        fs.readFile(__dirname + path, function(error, data){
            if (error){
                response.writeHead(404);
                response.write("opps this doesn't exist - 404");
                response.end();
            }
            else{
                response.writeHead(200, {"Content-Type": "text/html"});
                response.write(data, "utf8");
                response.end();
            }
        });/*
            case '/views':
            fs.readFile(__dirname + path, function(error, data){
                if (error){
                    response.writeHead(404);
                    response.write("opps this doesn't exist - 404");
                    response.end();
                }
                else{
                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.write(data, "utf8");
                    response.end();
                }
            });*/
            break;
        default:
            response.writeHead(404);
            response.write("opps this doesn't exist - 404");
            response.end();
            break;
    }
});
/*var server1 = http.createServer();
console.log('after server');
/*function (request, response) {
  console.log('before fs');
  fs.readFile("./views/index.handlebars", 'utf-8', function (error, data) {

    console.log('here');
  /*if(error)
    {
            console.log('error');
    }
    else
    {
        console.log('error free');
    }
  });
 });*/


 var io = require('socket.io').listen(server);
 var iol = io.listen(server);

//net=require('net');
//Sockets for realtime connection
var clients = [];

io.on('connection', function (socket) {
  console.log('ji');
  /*
  clients.push(socket.id);
  console.log(clients.length);

  socket.on('disconnect', function() {
       console.log('Got disconnect!');
        var index = clients.indexOf(socket);
        clients.pop(clients.id);
        console.log(clients.length);
        if (index != -1) {
            clients.splice(index, 1);
            console.info('Client gone (id=' + socket.id + ').');
            console.log(clients.length);
        }

    });
    */
});
server.listen(3000);

io.listen(server);
