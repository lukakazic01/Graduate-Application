require("dotenv").config({path: '../.env'});
const express = require('express')
const { createPool } = require('mysql-await');
const app = express();
const port = 3000;
const jwt = require('jsonwebtoken');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const SESSION_DURATION = 14 * 24 * 60 * 60 // 14 days in seconds

const pool = createPool({
    user: process.env.USER,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', '*');
    next();
});

let allSneakers = null;

app.get('/', (req, res) => {
    pool.query('select * from patika',
        (err,result) => {
            allSneakers = result;
            res.send({result});
        })
})

app.post('/register', (req, res) => {
    const {username, password} = req.body
    pool.query('select email from kupac where email = ?',[username], (err, result) => {
      if (err) {
          res.status(500).send('Failed registering user')
      } else {
          if(result.length > 0) {
              res.status(409).send('User already exists')
          } else {
              pool.query('insert into kupac values (0, null, null, null, ?, null, null, ?)', [username, password], (err, result) => {
                res.send('successfully registered')
              })
          }
      }
    })
})

app.post('/login', (req, res) => {
    const {username, password} = req.body
    pool.query('select * from kupac where email = ? and sifra = ?', [username, password], (err, result) => {
        if(result.length === 0) {
            res.status(404).send('Wrong username or password')
        } else {
            try {
                const token = jwt.sign({
                    username,
                    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION
                }, `${process.env.TOKEN_SECRET}`)
                res.setHeader('Set-Cookie', `token=${token}; Max-Age=600`)
                res.send({username});
            } catch(err) {
                console.log(err)
            }
        }
    })
})

app.get('/search', (req, res) => {
    const searchedValue = req.query
    pool.query('select * from patika where brend like ? or model like ? or _cena like ?',
        ['%' + searchedValue.searched + '%', '%' + searchedValue.searched + '%', '%' + searchedValue.searched + '%'],
        (err, result) => {
        if(err) {
            res.status(500).send('Value doesnt exist')
        } else {
            res.send(result)
        }
    })
})



app.delete('/delete', (req, res) => {
    const {id} = req.query
    pool.query('delete from patika where ID_PATIKA = ?',[id], (err, result) =>{
      if(err) {
          res.status(500).send('Not deleted')
      } else {
          pool.query('select * from patika', (err, result) => {
              res.send(result)
          })
      }
    })

})

app.get('/sneaker', (req,res) => {
    const {id} = req.query
    pool.query('select * from patika where id_patika = ?', [id], (err, result) => {
        res.send(result)
    })
})

app.post('/addSneakers', (req, res) => {
    const {cena, model, brend, brojPatika} = req.body;
    pool.query('insert into patika values(default, ?, ?, ?, ?)', [brojPatika, model, brend, cena] , (err, result) => {
        if (err) {
            res.status(406).send('You must provide valid information')
        } else {
            pool.query('select * from patika', (err, result) => {
                res.send(result);
            })
        }
    })
})

app.get('/filters', async (req, res) => {
    const filters = req.query.filters;
    if (!filters) return res.send(allSneakers);
    const brands = filters.filter(filter => filter.brands);
    const price = filters.filter(filter => filter.cena);
    let finalResult = []
    if (brands.length !== 0) {
        for (let key of brands[0].brands) {
            const result = await pool.awaitQuery('select * from patika where brend =  ?', [key])
            finalResult = [...finalResult, ...result]
        }
    }


    if (price.length !== 0) {
        const [min, max] = price[0].cena.split('-');
        if (finalResult.length === 0) {
            const result = await pool.awaitQuery('select * from patika where _cena between ? and ?', [min, max]);
            finalResult = [...finalResult, ...result]
        } else {
            finalResult = finalResult.filter(brand => brand._CENA >= min && brand._CENA <= max);
        }
    }


    if (finalResult.length === 0) {
        res.send(allSneakers)
    } else {
        res.send(finalResult)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app