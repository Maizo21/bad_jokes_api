const express = require('express');
const fs = require('fs')
const { v4: uuid } = require('uuid');
const router = express.Router()

const data = fs.readFileSync(`${__dirname}/../dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)

router.use(express.urlencoded({ extended: true }));

function isNotEmpty(req, res, next) {
    const s = req.body.joke;
    if (typeof s !== 'string') return res.status(400).json({ error: 'joke debe ser string' });
    const t = s.trim();
    if (!t) return res.status(400).json({ error: 'El chiste no puede estar vacio' });
    if (t.length > 300) return res.status(413).json({ error: 'Máximo 300 caracteres' });
    req.body.joke = t;
    next();
}

function isNonNegativeIntegerString(s) {
  if (typeof s !== 'string') return false;
  const n = Number(s); 
  if (!Number.isInteger(n)) return false;
  if (n < 0) return false;
  return true;
}

router.get('/', (req, res) => {
    return res.status(200).json(dataObj);
})

router.get('/chistes', (req, res) => {
    const { id } = req.query;

    if (!id) return res.status(200).json(dataObj);
    if (isNonNegativeIntegerString(id)) {
        const index = Number(id);
        const outOfRange = index < 0 || index >= dataObj.length;
        if (outOfRange) return res.status(404).json({ error: 'Chiste no encontrado' });
        return res.status(200).json(dataObj[index]);
    }

    const item = dataObj.find(x => String(x.id) === String(id));
    if (!item) return res.status(404).json({ error: 'Chiste no encontrado' });

    return res.status(200).json(item);
})

router.post('/chisteNuevo', isNotEmpty, (req, res)=>{
    const joke = {
        id: uuid(),
        chiste: req.body.joke.trim()
    };

    dataObj.push(joke);
    fs.writeFile(`${__dirname}/../dev-data/data.json`,  JSON.stringify(dataObj, null, 2), 'utf8', (err)=>{
        console.log(joke)
        if(err){
            console.log(err)
            return res.status(500).json({error: 'No fue posible guardar el chiste'});
        }
        console.log(`Chiste guardado con el id: ${joke.id}`);
        res.set('Location', '/chistes');
        res.status(201).json(joke)
    });    
});

router.delete('/chistes/:id', (req, res)=>{
    const idx = dataObj.findIndex(element => String(element.id) === String(req.params.id));
    
    if (idx === -1) return res.status(404).json({ error: 'Chiste no encontrado' });

    const [deleted] = dataObj.splice(idx, 1);
    console.log(`Borrando chiste con id ${idx}`);

    fs.writeFile(`${__dirname}/../dev-data/data.json`,  JSON.stringify(dataObj, null, 2), 'utf8', (err)=>{
        if(err){
            console.log(err)
            return res.status(500).json({error: 'No fue posible eliminar el chiste'});
        }
        console.log(`Borrado chiste id=${deleted.id} (idx=${idx})`);
        res.status(200).json({ deleted, chistes: dataObj });
    });   
})

router.use((req, res)=>{
    res.status(404).json({error: 'Ruta no encontrada'})
});

module.exports = router;