import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  clothId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "clothes",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
  size: {
    type: String,
  },
  selectedFabric: {
    type: String,
  },
  selectedColor: {
    type: String,
  },
  selectedDesign: {
    type: String,
  },
  customMeasurements: {
    neck: Number,
    chest: Number,
    waist: Number,
    hips: Number,
    sleeve: Number,
    inseam: Number,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
      default: () => `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    clothId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clothes",
    },

    measurementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "measurement",
    },

    // For cart-based orders (multiple items)
    items: [orderItemSchema],

    // Order pricing
    subtotal: {
      type: Number,
      default: 0,
    },

    gst: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["upi", "card", "bank", "none"],
      default: "none",
    },

    paidAmount: {
      type: Number,
      default: 0,
    },

    remainingAmount: {
      type: Number,
      default: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "partial", "paid"],
      default: "unpaid",
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "in-progress", "completed", "delivered", "cancelled"],
      default: "pending",
    },

    // GeoJSON user location for matching & tracking
    userLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },

    // Order type
    orderType: {
      type: String,
      enum: ["single", "cart"],
      default: "single",
    },
  },
  { timestamps: true }
);

// Add index for geospatial queries
orderSchema.index({ userLocation: "2dsphere" });

export default mongoose.model("order", orderSchema);
