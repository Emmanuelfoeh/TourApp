const express = require('express');
const authController = require('./../controllers/authController');
const route = express.Router();

const {
  getAllTours,
  addTour,
  getTour,
  updateTour,
  deleteTour
} = require('./../controllers/tourController');



route.route('/').get(getAllTours).post(addTour);

route.route('/:id').get(getTour).patch(updateTour).delete(authController.protect,authController.restrictTo('admin','lead-guide') ,deleteTour);

module.exports = route;
