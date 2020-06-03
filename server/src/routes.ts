import express from 'express'

import PointsController from './controllers/points';
import ItemsController from './controllers/items';

const routes = express.Router()
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

routes.post('/points', pointsController.create)
routes.get('/points', pointsController.index)
routes.get('/points/:id', pointsController.show)

export default routes;