exports.secret = 'zwehQ5v4Kc5djIoQrD5B4QX7cYWNNpsXhdM5qfX5g1C9ftdX29oZaWJI0IDzgAzNWcXcU6UQB8LALpyq';

if (process.env.OPENSHIFT_APP_NAME) {
    console.log("OpenShift platform detected.");
    exports.database = 'mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/';
} else {
    exports.database = 'mongodb://127.0.0.1:27017/';
}