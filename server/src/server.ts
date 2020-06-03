require("dotenv").config();
import express from 'express'
import cors from 'cors'
import path from 'path'
import routes from './routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)

app.use('/uploads', express.static(
    path.resolve(__dirname, '..', 'uploads')
)
)

app.listen(process.env.PORT_APP || 3333, () => {
    console.log(
        "Servidor backend inicializado com sucesso na porta " +
            process.env.PORT_APP || 3333
    );
});