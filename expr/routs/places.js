const {Router} = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const Place = require("../models/place");
const router = Router()

router.post('/edit', auth, async (req, res) => {
    try {
        User.findOne({'places.items._id': req.body.id}, function (err, result) {
            console.log(result)
            result.places.items.id(req.body.id).name = req.body.name;
            result.places.items.id(req.body.id).longitude = req.body.longitude;
            result.places.items.id(req.body.id).latitude = req.body.latitude;
            result.save();
        });
    } catch (e) {
        console.log(e)
    }

    res.redirect('/map')
})

module.exports = router