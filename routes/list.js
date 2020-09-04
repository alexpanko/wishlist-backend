
const express = require('express');
const router  = express.Router();
const ensureLogin = require("connect-ensure-login");
const List = require('../models/List')

//Create new list
router.post('/newlist', ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  const newList = List.create({
    listName: req.body.listName,
    listDescription: req.body.listDescription,
    listImage: req.body.listImage,
    owner: req.user._id
  })
  .then(list => {
    return res.status(201).json(list) 
  })
  .catch(err=> next(err))
})

//Show all user lists by user id
router.get('/mylists', ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  const user = req.user
  List.find({
    owner: req.user._id
  })
  .then(lists => res.status(200).json(lists))
  .catch(e => res.status(500).json(e))
});

//Show list by id
router.get('/:id', ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  const user = req.user
  List.findById(req.params.id)
  .then(list => res.status(200).json(list))
  .catch(e => res.status(500).json(e))
})

//Edit list by id
router.put('/:id', ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  const {listName, listDescription, listImage} = req.body;
  List.update({_id: req.params.id}, {listName, listDescription, listImage})
  .then(list => res.status(200).json(list))
  .catch(e => next(e))
})

//Delete list by id
router.delete('/:id', ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  List.deleteOne({_id:req.params.id})
  .then(list => res.status(200).json(list))
  .catch(e => next(e))
})

module.exports = router;