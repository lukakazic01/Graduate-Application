require("dotenv").config({path: '../.env'});
const express = require('express')
const { createPool } = require('mysql-await');
const app = express();
const port = 3000;
const jwt = require('jsonwebtoken');
const sharp = require('sharp')
const path = require('path');
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static("../public"));
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
    pool.query('select * from patike',
        (err,result) => {
            allSneakers = result;
            res.send({result});
        })
})

app.post('/register', (req, res) => {
    const {username, password} = req.body
    pool.query('select email from korisnik where email = ?',[username], (err, result) => {
      if (err) {
          res.status(500).send('Failed registering user')
      } else {
          if(result.length > 0) {
              res.status(409).send('User already exists')
          } else {
              pool.query('insert into korisnik values (0, null, null, null, ?, null, null, "ordinary" , ?)', [username, password], (err, result) => {
                res.send('successfully registered')
              })
          }
      }
    })
})

app.post('/login', (req, res) => {
    const {username, password} = req.body
    pool.query('select * from korisnik where email = ? and sifra = ?', [username, password], (err, result) => {
        if(result.length === 0) {
            res.status(404).send('Wrong username or password')
        } else {
            try {
                const token = jwt.sign({
                    username,
                    role: result[0].ROLA,
                    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION
                }, `${process.env.TOKEN_SECRET}`)
                res.setHeader('Set-Cookie', `token=${token}; Max-Age=600`)
                res.send({username, role: result[0].ROLA});
            } catch(err) {
                console.log(err)
            }
        }
    })
})

app.get('/search', (req, res) => {
    const searchedValue = req.query
    pool.query('select * from patike where brend like ? or model like ? or _cena like ?',
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
    const {id, novaKolicina} = req.query
    pool.query('select kolicina from patike where ID_PATIKA = ?', [id], (err, result) => {
        if(result[0].kolicina == novaKolicina) {
            pool.query('delete from patike where ID_PATIKA = ?', [id], (err, result) =>{
                if(err) {
                    res.status(500).send('Not deleted')
                } else {
                    pool.query('select * from patike', (err, result) => {
                        res.send(result)
                    })
                }
            })
        } else {
            pool.query('update patike set kolicina = kolicina - ?  where ID_PATIKA = ?',[novaKolicina, id], (err, result) => {
                if(err) {
                    res.status(500).send(err.message)
                } else {
                    pool.query('select * from patike', (err, result) => {
                        res.send(result)
                    })
                }
            })
        }
    })
})

app.get('/sneaker', (req,res) => {
    const {id} = req.query
    pool.query('select * from patike where ID_PATIKA = ?', [id], (err, result) => {
        res.send(result)
    })
})

app.post('/addSneakers', async (req, res) => {
    const { cena, model, brend, brojPatika, nameOfImage, buffer, kolicina } = req.body;
    const sneaker = await pool.awaitQuery('select * from patike where MODEL = ? and BROJ_PATIKA = ? and BREND = ?', [model, brojPatika, brend]);
    console.log(sneaker)
    if (sneaker.length) return res.status(406).send("We already have those snekaers");
    const withoutBase64 = buffer.split(';base64,').pop()
    const outputPath = path.join(__dirname, '../public', 'resized_' + nameOfImage);
    const imageBuffer = Buffer.from(withoutBase64, "base64")
    sharp(imageBuffer)
        .resize(500, 281, {
            withoutEnlargement: true
        })
        .toFile(outputPath, (err, info) => {
            if (err) {
                return res.status(406).send(err.message);
            } else {
                const modifiedFilename = `http://localhost:3000/images/resized_${nameOfImage}`;
                pool.query('insert into patike values(default, ?, ?, ?, ?, ?, ?)', [brojPatika, model, brend, cena, modifiedFilename, kolicina], (err, result) => {
                    if (err) {
                        res.status(406).send(err.message);
                    } else {
                        pool.query('select * from patike', (err, result) => {
                            res.send(result);
                        });
                    }
                });
            }
        });
});

app.get('/filters', async (req, res) => {
    const filters = req.query.filters;
    if (!filters) return res.send(allSneakers);
    const brands = filters.filter(filter => filter.brands);
    const price = filters.filter(filter => filter.cena);
    let finalResult = []
    if (brands.length !== 0) {
        for (let key of brands[0].brands) {
            const result = await pool.awaitQuery('select * from patike where brend =  ?', [key])
            finalResult = [...finalResult, ...result]
        }
    }

    if (price.length !== 0) {
        const [min, max] = price[0].cena.split('-');
        if (finalResult.length === 0) {
            const result = await pool.awaitQuery('select * from patike where _cena between ? and ?', [min, max]);
            finalResult = [...finalResult, ...result]
        } else {
            finalResult = finalResult.filter(brand => brand._CENA >= min && brand._CENA <= max);
        }
    }
    res.send(finalResult)
})

app.post('/q&a', async (req, res) => {
    const {username, question} = req.body;
    const user = await pool.awaitQuery('select ID_KORISNIK from korisnik where email = ?', [username]);
    pool.query('insert into Q_A values(?, default, ?, ?, null)', [user[0].ID_KORISNIK,username, question], (err, result) => {
        pool.query('select * from q_a', (err, result) => {
            res.send(result)
        })
    })
})

app.get('/questions', (req, res) => {
    pool.query('select * from q_a', (err, result) => {
        res.send(result)
    })
})

app.post('/answer', async (req, res) => {
    const {answer, id} = req.body;
    const question = await pool.awaitQuery('select ID_PITANJA from q_a where ID_PITANJA = ?', [id]);
    pool.query('update Q_A set ODGOVOR = ? where ID_PITANJA = ?', [answer, question[0].ID_PITANJA], (err, result) => {
        pool.query('select * from q_a', (err, result) => {
            res.send(result)
        })
    })
})

app.post('/updateAmount', (req, res) => {
    const { id, kolicinaZaDodati } = req.body;
    pool.query('update patike set kolicina = kolicina + ?  where ID_PATIKA = ?',[kolicinaZaDodati, id], (err, result) => {
        if(err) {
            res.status(500).send(err.message)
        } else {
            pool.query('select * from patike', (err, result) => {
                res.send(result)
            })
        }
    })
})

app.post('/buy', async (req, res) => {
    const { items, username, date } = req.body
    const grouped = []
    const user = await pool.awaitQuery('select ID_KORISNIK from korisnik where email = ?', [username]);
    items.forEach((item) => {
        const matchingItem = grouped.find((sneaker) => sneaker.id === item.ID_PATIKA);
        if (matchingItem) {
            matchingItem.foundedAmount += 1;
        } else {
            grouped.push(
                {
                    id: item.ID_PATIKA,
                    foundedAmount: 1,
                    originalAmount: item.kolicina,
                    brojPatika: item.BROJ_PATIKA,
                    model: item.MODEL,
                    brend: item.BREND,
                    cena: item._CENA,
                    slika: item.slika
                }
            )
        }
    })
    for (let item of grouped) {
        if (item.foundedAmount === item.originalAmount) {
            pool.query('delete from patike where ID_PATIKA = ?', [item.id], (err, result) => {
                if (err) {
                    return res.status(500).send('Not deleted')
                }
            })
        } else {
            await pool.awaitQuery('update patike set kolicina = kolicina - ? where ID_PATIKA = ?', [item.foundedAmount, item.id], (err, result) => {
                if (err) {
                    return res.status(406, err.message);
                }
            })
        }

        //inserting into bought sneakers table
        const sneaker = await pool.awaitQuery('select * from kupljene_patike where model = ? and id_korisnik = ? and broj_patika = ? and datum = ?', [item.model, user[0].ID_KORISNIK, item.brojPatika, date])
        if (sneaker.length > 0 && item.brojPatika === sneaker[0]?.broj_patika) {
            pool.query('update kupljene_patike set kolicina = kolicina + ? where id_korisnik = ? and model = ? and broj_patika = ?', [item.foundedAmount, user[0].ID_KORISNIK, item.model, item.brojPatika], (err) => {
                if (err) {
                    return res.status(406).send(err.message);
                }
            })
        } else {
            pool.query('insert into kupljene_patike values(default, ?, ?, ?, ?, ?, ?, ?, ?)', [user[0].ID_KORISNIK, item.brojPatika, item.model, item.brend, item.cena, item.slika, item.foundedAmount, date],
                (err, result) => {
                    if (err) {
                        return res.status(406).send(err.message);
                    }
                })
        }
    }
    pool.query('select * from patike', (err, result) => {
        res.send(result)
    })
})

app.get('/boughtSneakers', (req, res) => {
    pool.query('select model, brend, sum(cena * kolicina) as ukupnoZaradjeno, slika, sum(kolicina) as ukupnoProdato from kupljene_patike group by model', (err, result) => {
        res.send(result)
    })
})

app.get('/boughtSneakersByUserAndDate', (req, res) => {
    const { dateRange } = req.query;
    if(!dateRange) {
        pool.query('select * from ukupnoProdatihPoKorisniku', (err, result) => {
            res.send(result)
        })
    } else {
        const [fromDate, toDate] = dateRange.split('-');
        pool.query('select kupljene_patike.*, korisnik.email from kupljene_patike JOIN korisnik ON korisnik.id_korisnik = kupljene_patike.id_korisnik where datum <= ? and datum >= ? order by datum', [toDate, fromDate], (err, result) => {
            if(err) res.status(406).send(err.message);
            else res.send(result)
        })
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app