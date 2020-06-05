import express from 'express'
import { celebrate, Joi } from 'celebrate'

import multer from 'multer'
import multerConfig from './config/multer'

import PointsController from './controllers/points';
import ItemsController from './controllers/items';

const routes = express.Router()
const upload = multer(multerConfig)

const pointsController = new PointsController()
const itemsController = new ItemsController()

routes.get("/", (req, res) => {
  return res.json({
      app: "#1 NLW - Next Level Week",
      author: 'Brunno Sena (brunnosena)',
      mail: "brunnow@hotmail.com",
  });
})

routes.get('/items', itemsController.index)

routes.get('/points', pointsController.index)
routes.get('/points/:id', pointsController.show)

routes.post(
          '/points',           
          celebrate({
            body: Joi.object().keys({
              name: Joi.string().required(),
              email: Joi.string().required().email(),
              whatsapp: Joi.number().required(),
              latitude: Joi.number().required(),
              longitude: Joi.number().required(),
              city: Joi.string().required(),
              uf: Joi.string().required().max(2),
              items: Joi.string().required(),
            })
          }, {
            abortEarly: false
          }),
          upload.single('image'),
          pointsController.create)

export default routes;