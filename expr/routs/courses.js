const {Router} = require('express')
const Course = require('../models/course')
const auth = require('../middleware/auth')
const router = Router()

router.get('/', async (req, res) => {
  const courses = await Course.find().lean()
    .populate('userId', 'email name')
    .select('price title img')

  res.render('courses', {
    title: 'Курсы',
    isCourses: true,
    courses
  })
})

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }

  const course = await Course.findById(req.params.id).lean()

  res.render('course-edit', {
    title: `Редактировать ${course.title}`,
    course
  })
})

router.post('/edit', auth,  async (req, res) => {
  await Course.findByIdAndUpdate(
      req.body.id,
       {
          title: req.body.title,
          price: req.body.price,
          img: req.body.img
        },
      {new: true}
      )
  res.redirect('/courses')
})

router.post('/remove', auth,  async (req, res) => {
  try {
    await Course.deleteOne({_id: req.body.id})
    res.redirect('/courses')
  } catch (e) {
    console.log(e)
  }
})

router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id).lean()
  res.render('course', {
    layout: 'empty',
    title: `Курс ${course.title}`,
    course
  })
})



module.exports = router