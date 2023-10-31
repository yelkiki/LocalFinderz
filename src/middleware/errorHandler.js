const ErrorHandler = (err, req, res,next) => {
    const errStatus = err.status_code || 500;
    const errMsg = err.message || 'Something went wrong';
    res.status(errStatus).json({
        message: errMsg,
        status_code: errStatus,
        data: err.data
    })
}


export default ErrorHandler