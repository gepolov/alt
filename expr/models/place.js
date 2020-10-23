const path = require('path')
const { v4: uuidv4 } = require('uuid');
const fs = require('fs')

const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'places.json'
)



class Place {
    static async add(place) {
        const places = await Place.fetch()

        let idx = places.features.findIndex(p => p.geometry.coordinates[0] === place.longitude && p.geometry.coordinates[1] === place.latitude)

        if (++idx) {

        } else {
            // нужно добавить место
            const place_add = {
                "type": "Feature",
                "id": uuidv4(),
                "geometry": {"type": "Point", "coordinates": [place.longitude, place.latitude]},
                "properties": {
                    "iconContent": place.place_name
                },
                "options": {"preset": "islands#blueStretchyIcon"}
            }
            places.features.push(place_add)
        }

        //логика сохранения
        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(places), err => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    static async update(place) {
        const places = await Place.fetch()

        const idx = places.features.findIndex(c => c.id === place.id)
        places.features[idx].properties.iconContent = place.name
        places.features[idx].geometry.coordinates[0] = place.longitude
        places.features[idx].geometry.coordinates[1] = place.latitude

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'places.json'),
                JSON.stringify(places),
                (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                }
            )
        })
    }

    static async delete(idx) {
        const places = await Place.fetch()
        places.features.splice(idx,1)

        //логика сохранения
        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(places), err => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(p, 'utf-8', (err, content) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(JSON.parse(content))
                }
            })
        })
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'places.json'),
                'utf-8',
                (err, content) => {
                    if (err) {
                        reject(err)
                    } else {
                        // resolve(JSON.parse(content))
                        resolve(content)
                    }
                }
            )
        })
    }

    static async getById(id) {
        const places = await Place.fetch()
        return places.features.find(p => p.id === id)
    }

    static async getByIdx(idx) {
        const places = await Place.fetch()
        return places.features[idx]
    }
}

module.exports = Place