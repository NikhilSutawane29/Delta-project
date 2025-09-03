
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            console.error(`Error in route handler: ${req.method} ${req.originalUrl}`);
            console.error(err);
            next(err);
        });
    }
}
