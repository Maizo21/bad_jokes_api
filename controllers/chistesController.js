const fs = require('fs')
const { v4: uuid } = require('uuid');
const dataObj = require('../model/chistesModel').readData();
const chistesModel = require('../model/chistesModel');



function isNonNegativeIntegerString(s) {
  if (typeof s !== 'string') return false;
  const n = Number(s); 
  if (!Number.isInteger(n)) return false;
  if (n < 0) return false;
  return true;
}

exports.getAllData = ((req, res) => {

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

});



exports.postJoke = ((req, res)=>{

    const chiste = req.body.joke;
    if (typeof chiste !== 'string') return res.status(400).json({ error: 'joke debe ser string' });
    const chisteSize = chiste.trim();
    if (!chisteSize) return res.status(400).json({ error: 'El chiste no puede estar vacio' });
    if (chisteSize.length > 100) return res.status(413).json({ error: 'Máximo 100 caracteres' });
    
    let validateJoke = chiste.trim();


    const joke = {
        id: uuid(),
        chiste: validateJoke
    };

    dataObj.push(joke);


    chistesModel.writeData(dataObj, (err)=>{
        if(err) return res.status(500).json({error: 'No fue posible guardar el chiste'});

        console.log(`Chiste guardado con el id: ${joke.id}`);
        res.set('Location', '/chistes');
        res.status(201).json(joke)
    })
});


exports.deleteJoke = ((req, res)=>{

    const idx = dataObj.findIndex(element => String(element.id) === String(req.params.id));
    
    if (idx === -1) return res.status(404).json({ error: 'Chiste no encontrado' });

    const [deleted] = dataObj.splice(idx, 1);
    console.log(`Borrando chiste con id ${deleted.id}`);

    fs.writeFile(`${__dirname}/../dev-data/data.json`,  JSON.stringify(dataObj, null, 2), 'utf8', (err)=>{
        if(err){
            console.log(err)
            return res.status(500).json({error: 'No fue posible eliminar el chiste'});
        }
        console.log(`Borrado chiste id=${deleted.id} (index=${idx})`);
        res.status(200).json({ deleted, chistes: dataObj });
    });   
})