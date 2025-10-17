const fs = require('fs');

exports.readData = () => {
    const data = fs.readFileSync(`${__dirname}/../dev-data/data.json`, 'utf-8');
    const dataObj = JSON.parse(data);
    return dataObj;
};

exports.writeData = (dataObj, callback) => {
    fs.writeFile(`${__dirname}/../dev-data/data.json`,  JSON.stringify(dataObj, null, 2), 'utf8', (err)=>{
        if(err){
            return callback(err);
        }
        callback(null);
    });
}

const data = fs.readFileSync(`${__dirname}/../dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)