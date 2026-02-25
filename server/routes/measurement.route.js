import express from "express";
import auth from "../middlewares/auth.middleware.js";
import measurementController from "../controllers/measurement.controller.js";

const router = express.Router();

// USER creates measurement
router.post("/", auth.authUser, measurementController.createMeasurement);

// USER gets all saved measurements
router.get("/", auth.authUser, measurementController.getUserMeasurements);

// USER gets one measurement
router.get("/:id", auth.authUser, measurementController.getSingleMeasurement);

// USER updates a measurement
router.patch("/:id", auth.authUser, measurementController.updateMeasurement);

export default router;
