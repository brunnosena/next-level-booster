import express from 'express'

const app = express()

app.get('/users', (req, res) => {
    return res.json({ message: 'Hello NLW'})
});

app.listen(3333);