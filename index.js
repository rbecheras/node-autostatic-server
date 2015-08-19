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
var fs = require('fs');
var jade = require('jade');

// Initializations
var app = express();
var tmp = '', stars = '', url='';
// Default options
var options = {
  port: process.env.PORT || 8080,
  dir: process.cwd(),
  browser: undefined
}

// Defining and parsing CLI options
cli.version(pkg.version)
.option('-d --dir <directory>','directory to serve (default: .)')
.option('-b --browser <browser name>','browser which open served directory')
.option('-p --port <port>','http port to serve to (default: 8080)')
.option('-r --remote','don\'t automatically lauch browser on  localhost (useful if running on _r_emote host)')
.option('-s --stop-on-close','automatically stop the server when user close the browser')
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
info('* run $ autostatic --help to get command line option informations');
info('**');

app.use(function(req,res,next){
  if (req.path==='/favicon.ico') log(req.path);
  else info(req.path);
  return next();
});
app.use(express.static(options.dir));

app.use(function(req,res,next){
  var filePath = options.dir + req.path;
  require('fs').exists(filePath, function(exists){
    if(!exists)  return res.status(404).send();

    fs.stat(filePath, function(err,stats){
      if (err) return next(err);
      if (stats.isDirectory()) {
        fs.readdir(filePath,function(err,files){
          if (err) return next('Unable to read directory '+filePath);

          var linkedFiles = [];
          for(i in files){
            var relPath = filePath.split(options.dir).join('');
            var href = (relPath.length>1) ? relPath + '/' + files[i] : files[i];

            linkedFiles.push({
              name: files[i],
              href: href
            });
          }

          var relPath = filePath.split(options.dir).join('');
          var html = jade.renderFile(__dirname + '/index.jade',{
            parentHref: '../',
            dirname: relPath,
            files: linkedFiles
          });

          res.status(200).send(html);
        });
      }
    });
  });
});

app.use(function(err,req,res,next){
  info(res.status());
  danger('Server Error');
  console.error(err.message);
  console.log(err);
  console.error(err.stack);
  return res.status(500).jsonp(err);
});

var server = app.listen(options.port,function(){
  if (!cli.remote){
    url = 'http://localhost:' + options.port;
    open(url,options.browser)
    .on('error',function(err){
      danger('Error');
      console.log(err);
    })
    .on('close',function(){
      warn('browser closed by client.');
      if(cli.stopOnClose){
        info('stopping server.');
        process.exit();
      }
    })
  } else {
    url = 'http://' + server.address().address + ':' + options.port;
  }
  success('Server running... \nAccess to served static files at '+ url);
});
