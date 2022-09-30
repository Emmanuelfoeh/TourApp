const express = require('express');
const route = express.Router();

const {
  getAllTours,
  addTour,
  getTour,
  updateTour,
  deleteTour
} = require('./../controllers/tourController');



route.route('/').get(getAllTours).post(addTour);

route.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = route;
