const express = require('express')
const fs = require('fs')

const router = express.Router()


const { getAllUsers, createUser, getUser, updateUser, deleteUser, } = require('../controllers/userController')



router
    .route('/')
    .get(getAllUsers)
    .post(createUser)

router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)


module.exports = router