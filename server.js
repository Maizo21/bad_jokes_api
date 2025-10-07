const express = require('express');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
const chistesRouter = require('./routes/chistes');


app.use('/', chistesRouter)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
