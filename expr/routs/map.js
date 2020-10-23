const {Router} = require('express')
const Place = require('../models/place')
const auth = require('../middleware/auth')
const User = require('../models/user')
const path = require('path')
const fs = require('fs')
const router = Router()

router.post('/add', auth, async (req, res) => {
  if (req.body.longitude && req.body.latitude) {
    await req.user.addPlace(req.body.place_name, req.body.longitude, req.body.latitude)
    res.redirect('/map')
  }
})

router.post('/delete', auth, async (req, res) => {
  try {
    User.findOne({'places.items._id': req.body.place}, function (err, result) {
      result.places.items.id(req.body.place).remove();
      result.save();
    });
  } catch (e) {
    console.log(e)
  }
  res.redirect('/map')
})

router.post('/edit', auth, async (req, res) => {
  const place = await Place.getById(req.body.place)
  const longitude = place.geometry.coordinates[0]
  const latitude = place.geometry.coordinates[1]

  res.render('place-edit', {
    title: `Редактировать ${place.properties.iconContent}`,
    place,
    longitude,
    latitude
  })
})


router.get('/', auth, async (req, res) => {
  const user = await req.user
    .populate('cart.items.courseId')
    .execPopulate()

  const places = user.places.items

  req.user.writeFileJson(places)

  res.render('map', {
    title: 'Карта',
    isMap: true,
    places
  })
})


router.get('/points', auth, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'data', 'places.json'))
})

module.exports = router

