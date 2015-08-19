# node-autostatic-server

`autostatic-server` is a node application running on command line interface (CLI).
It provide a handy 'portable' static node server. It is almost usefull to serve any folder wich you want to serve during your daily development works.

## Example

You just discover the beautiful ["Wall Clock Pure CSS3" on github](https://github.com/rassadin/css3-experiments).

So to lauch the demo, you just have to run `autostatic` after having downloaded the files:

    $ git clone https://github.com/rassadin/css3-experiments.git
    $ cd css3-experiments
    $ autostatic

Automatically, your favorite browser opens to `http://localhost:8080/` where the files are served so you enjoy instantly your fresh demo.

## Installation

    $ [sudo] npm -g install autostatic-server

## Usage

    $ autostatic

will serve instantly the current directory in your default browser on port 8080

    $ autostatic --version

will display the autostatic-server version

    $ autostatic --help

will show you the options also listed bellow.

### Options

    Usage: autostatic [options]

    Options:

      -h, --help                   output usage information
      -V, --version                output the version number
      -d --dir <directory>         directory to serve (default: .)
      -b --browser <browser name>  browser which open served directory
      -h --hide-dotted             hide dotted files (default: false)
      -p --port <port>             http port to serve to (default: 8080)
      -r --remote                  don't automatically lauch browser on  localhost (useful if running on remote host)
      -s --stop-on-close           automatically stop the server when user close the browser


Note:

If you don't specify a port with `-p` or `--port` option, autostatic will search your $PORT environement variable to serve on it. Else, the files will be served on the default port: `8080`
