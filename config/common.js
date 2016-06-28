if (process.env.OPENSHIFT_APP_NAME) {
    console.log("OpenShift platform detected.");
    console.log("OPENSHIFT_MONGODB_DB_HOST " + process.env.OPENSHIFT_MONGODB_DB_HOST);
    console.log("OPENSHIFT_MONGODB_DB_PORT " + process.env.OPENSHIFT_MONGODB_DB_PORT);
    console.log("OPENSHIFT_MONGODB_DB_USERNAME " + process.env.OPENSHIFT_MONGODB_DB_USERNAME);
    console.log("OPENSHIFT_MONGODB_DB_PASSWORD " + process.env.OPENSHIFT_MONGODB_DB_PASSWORD);
    console.log("OPENSHIFT_MONGODB_DB_URL " + process.env.OPENSHIFT_MONGODB_DB_URL);
    console.log("OPENSHIFT_MONGODB_DB_LOG_DIR " + process.env.OPENSHIFT_MONGODB_DB_LOG_DIR);
    exports.database = 'mongodb://' + process.env.OPENSHIFT_MONGODB_DB_URL;
} else {
    exports.database = 'mongodb://127.0.0.1:27017/';
}