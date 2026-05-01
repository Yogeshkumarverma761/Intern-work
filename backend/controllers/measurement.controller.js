import measurementModel from "../models/measurement.model.js";

const createMeasurement = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      neck,
      chest,
      waist,
      hips,
      sleeve,
      inseam,
      shoulder,
      height,
      weight,
      bust,
      armLength,
      isAIGenerated,
      confidence
    } = req.body;

    // Validation: at least some measurements should be provided
    if (!neck && !chest && !waist && !height) {
      return res.status(400).json({
        message: "At least one measurement field is required."
      });
    }

    const measurementData = {
      userId,
      neck,
      chest,
      waist,
      hips,
      sleeve,
      inseam,
      shoulder,
      height,
      weight,
      bust,
      armLength,
      isAIGenerated: isAIGenerated || false,
      confidence: confidence || null
    };

    const measurement = await measurementModel.create(measurementData);

    return res.status(201).json({
      success: true,
      message: "Measurement saved successfully",
      data: measurement
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getUserMeasurements = async (req, res) => {
  try {
    const userId = req.user._id;

    const measurements = await measurementModel.find({ userId }).sort({
      createdAt: -1
    });

    return res.json({
      success: true,
      data: measurements
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getSingleMeasurement = async (req, res) => {
  try {
    const measurementId = req.params.id;
    const userId = req.user._id;

    const measurement = await measurementModel.findOne({
      _id: measurementId,
      userId
    });

    if (!measurement)
      return res.status(404).json({ message: "Measurement not found" });

    return res.json({
      success: true,
      data: measurement
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateMeasurement = async (req, res) => {
  try {
    const measurementId = req.params.id;
    const userId = req.user._id;

    const measurement = await measurementModel.findOneAndUpdate(
      { _id: measurementId, userId },
      req.body,
      { new: true }
    );

    if (!measurement)
      return res.status(404).json({ message: "Measurement not found" });

    return res.json({
      success: true,
      message: "Measurement updated successfully",
      data: measurement
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export default {
    createMeasurement,
    getUserMeasurements,
    getSingleMeasurement,
    updateMeasurement
}