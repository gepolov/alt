const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const homeRouts = require('./routs/home')
const addRouts = require('./routs/add')
const ordersRouts = require('./routs/orders')
const coursesRouts = require('./routs/courses')
const mapRouts = require('./routs/map')
const cardRouts = require('./routs/card')
const placeRouts = require('./routs/places')
const authRoutes = require('./routs/auth')
const User = require('./models/user')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')

const MONGODB_URI = 'mongodb+srv://gepolov:4GwHiMKUInaERwT2@cluster0.zt24r.mongodb.net/shop?retryWrites=true&w=majority'
const app = express()
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})
const store = new MongoStore({
    collection: 'session',
    uri: MONGODB_URI
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static( path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'some secret value,',
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRouts)
app.use('/add', addRouts)
app.use('/courses', coursesRouts)
app.use('/map', mapRouts)
app.use('/card', cardRouts)
app.use('/places', placeRouts)
app.use('/orders', ordersRouts)
app.use('/auth', authRoutes)

mongoose.set('returnOriginal', false)

const PORT = process.env.PORT || 8000

async function start() {

    try {

        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }

}

start()

process.on('warning', (warning) => {
    console.log(warning.stack);
});