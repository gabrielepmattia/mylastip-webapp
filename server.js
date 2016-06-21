/**
 * MyLastIPd server
 */
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var dserver = require('net').createServer(function (socket) {
    debug_daemon("Client connected at address " + socket.remoteAddress);
    socket.on('data', function (data) {
        console.log(data.toString());
    });
});

dserver.address = ipaddress;
dserver.port = port;
dserver.listen(port, ipaddress);

dserver.on('listening', function (listening) {
    var address = dserver.address();
    debug_daemon("Daemon server started, listening on " + address.localAddress + ":" + address.port);
});

