const errorHandler = (error, req, res, next) => {
    console.log(error.message)
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).send({
            message: error.message
        })
    } else {
        return res.status(400).send({
            message: error.message,
        })
    }
}

module.exports = errorHandler