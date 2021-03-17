const fs = require("fs")

const db = {
  async push(path, data) {
    let r = await db.get(path);
    r.push(data)
    return new Promise((resolve, reject) => {
      fs.writeFile(`db.${path}.txt`, JSON.stringify(r), (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      })
    })
  },
  async get(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(`db.${path}.txt`, (err, data) => {
        if (err) return reject(err);
        try {
          return resolve(JSON.parse(data || '[]'));
        } catch (e) {
          return []
        }
      })
    })
  }
}

module.exports = db;