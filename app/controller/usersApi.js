const dbUserManager = require('../db/dbUsersManager')
const express = require('express')
const router = express.Router()

/*
Get User by Id
path '/users/id'
Failed 500
Not Found 404
success 200
return  user data 
*/
router.get('/:id', dbUserManager.getUsers);
/*
PUT User by Id
path '/users/id'
return  new data of the user 
Failed 500
Not Found 404
success 200
*/
router.put('/:id', dbUserManager.updateUser);
/*
POST  User
path '/users/'
return  NEW user id
Failed 500
Not Found 404
success 200
*/
router.post('/', dbUserManager.addUser);
/*
Get All users
path '/users/'
return  all users 
Failed 500
success 201
*/
router.get('/', dbUserManager.getUsers);


module.exports = router;