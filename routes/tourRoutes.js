const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();
const {
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,

} = tourController;

// router.param('id', checkID);

// Create a checkBody Middleware func if contains name and price property
// If not, send back 400
// Add it to the post handler stack
router
    .route('/')
    .get(getAllTours)
    .post(createTour);

router
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

module.exports = router;
