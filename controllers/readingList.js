const router = require('express').Router()

const { ReadingList } = require('../models/index')

router.post('/', async (req, res) => {
    console.log('readinglist', ReadingList)
    const newList = await ReadingList.create({...req.body, read: false})
    res.json(newList)
})

module.exports = router