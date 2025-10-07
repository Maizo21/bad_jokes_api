const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
const chistesRouter = require('./routes/chistes');


app.use('/', chistesRouter)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
