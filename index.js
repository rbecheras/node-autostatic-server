// Defining helper functions
function info(message){
  console.log(message.blue);
}
function danger(message){
  console.log(message.red);
}
function warn(message){
  console.log(message.yellow.bold);
}
function success(message){
  console.log(message.green.bold);
}
function log(message){
  console.log(message);
}
function title(message){
  var title='';
  function getStars(messsage){
    var ret = '';
    for(var i=0; i<messsage.length+6; i++){
      ret+='*';
    }
    return ret;
  }
  title += getStars(message) + '\n';
  title += '** ' + message + ' **\n';
  title += getStars(message);
  return title;
}

// Requiring dependencies
require('colors');
var pkg = require('./package.json');
var express = require('express');
var cli = require('commander');
var open = require('open');

// Initializations
var app = express();
var tmp = '', stars = '', url='';
// Default options
var options = {
  port: process.env.PORT || 8080,
  dir: __dirname,
  browser: undefined
}

// Defining and parsing CLI options
cli.version(pkg.version)
.option('-d --dir <directory>','directory to serve (default: .)')
.option('-b --browser <browser name>','browser which open served directory')
.option('-p --port <port>','http port to serve to (default: 8080)')
.option('-r --remote','don\'t automatically lauch browser on  localhost (useful if running on _r_emote host)')
.parse(process.argv);

// Setting options
if (cli.port)       options.port = cli.port;
if (cli.dir)        options.dir = cli.dir;
if (cli.browser)    options.browser = cli.browser;
if (cli.remote)     options.remote = cli.remote;

// Logging CLI user friendly messages
info(title('autostatic-server v' + pkg.version))
info('* serving directory ' + options.dir);
info('* on port ' + options.port);
if(!options.remote) info('* via ' + (options.browser || 'your default') + ' browser');
info('**');

app.use(express.static(options.dir));

var server = app.listen(options.port,function(){
  if (!cli.remote){
    url = 'http://localhost:' + options.port;
    open(url,options.browser);
  } else {
    url = 'http://' + server.address().address + ':' + options.port;
  }

  success('Server running... \nAccess to served static files at '+ url);
});
