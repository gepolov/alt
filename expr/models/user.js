const {Schema, model} = require('mongoose')
const path = require('path')
const fs = require('fs')

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: String,
  password: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1
        },
        courseId: {
          type: Schema.Types.ObjectID,
          ref: 'Course',
          required: true
        }
      }
    ]
  },
  places: {
    items: [
      {
        name: {
          type: String,
          required: true
        },
        longitude: {
          type: String,
          required: true
        },
        latitude: {
          type: String,
          required: true
        },
      }
    ]
  }
})

userSchema.methods.addToCart = function (course) {
  const itemsCopied = [...this.cart.items]
  const courseId = course._id.toString()

  const check = function (course) {
    return course.courseId.toString() === courseId;
  }

  const idx = itemsCopied.findIndex(check)

  if (idx >= 0) {
    itemsCopied[idx].count = itemsCopied[idx].count + 1
  } else {
    itemsCopied.push({
      courseId: course._id,
      count: 1
    })
  }

  this.cart = {items: itemsCopied}
  this.save()
}

userSchema.methods.removeFromCart = function (id) {
  let items = [...this.cart.items]
  console.log(items)
  const idx = items.findIndex(c => c.courseId.toString() === id.toString())

  if (items[idx].count === 1) {
    items = items.filter(c => c.courseId.toString() !== id.toString())
  } else {
    items[idx].count--
  }

  this.cart = {items}
  return this.save()
}

userSchema.methods.clearCart = function () {
  this.cart = {items: []}
  return this.save()

}

userSchema.methods.addPlace = async function (name, longitude, latitude) {
  const itemsCopied = [...this.places.items]

  const check = function (el) {
    return (el.longitude === longitude && el.latitude === latitude);
  }

  const idx = itemsCopied.findIndex(check)

  if (idx >= 0) {
    //если точка нашлась - ничего не делаем
  } else {
    itemsCopied.push({
      name, longitude, latitude
    })
  }

  this.places = {items: itemsCopied}
  this.save()
}

userSchema.methods.writeFileJson = async function (places) {
  const placeObj = {
    "type": "FeatureCollection",
    "features": []
  }

  places.forEach(pl => {
    const place_add = {
      "type": "Feature",
      "id": pl._id,
      "geometry": {"type": "Point", "coordinates": [pl.longitude, pl.latitude]},
      "properties": {
        "iconContent": pl.name
      },
      "options": {"preset": "islands#blueStretchyIcon"}
    }
    placeObj["features"].push(place_add)
  })
  // const place_add = {
  //   "type": "Feature",
  //   "id": uuidv4(),
  //   "geometry": {"type": "Point", "coordinates": [place.longitude, place.latitude]},
  //   "properties": {
  //     "iconContent": place.place_name
  //   },
  //   "options": {"preset": "islands#blueStretchyIcon"}
  // }
  // places.features.push(place_add)

  const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'places.json'
  )

  return new Promise((resolve, reject) => {
    fs.writeFile(p, JSON.stringify(placeObj), err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })

}




module.exports = model('User', userSchema)



















