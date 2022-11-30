const errorHandler = (err, req, res, next) => {
    console.log(err.message)
    return res.status(400).send('You broke something, developer!')
}

module.exports = errorHandler