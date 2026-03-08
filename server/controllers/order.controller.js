import orderModel from "../models/order.model.js";
import clothesModel from "../models/clothes.model.js";

const createOrder = async (req, res) => {
  try {
    const { clothId, measurementId, lat, lng } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!clothId || !measurementId || !lat || !lng) {
      return res.status(400).json({
        message: "Missing required fields: clothId, measurementId, lat, lng are required."
      });
    }

    // Check cloth exists
    const cloth = await clothesModel.findById(clothId);
    if (!cloth)
      return res.status(404).json({ message: "Cloth not found" });

    // Create GeoJSON user location
    const userLocation = {
      type: "Point",
      coordinates: [lng, lat]
    };

    // Create Order
    const newOrder = await orderModel.create({
      userId,
      clothId,
      measurementId,
      status: "pending",
      userLocation,   // ⭐ IMPORTANT
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: newOrder,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await orderModel.find({ userId })
      .populate("clothId")
      .populate("measurementId")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await orderModel.findById(orderId)
      .populate("userId", "name email phoneNo")
      .populate("clothId")
      .populate("measurementId");

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    res.json({ success: true, data: order });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const requesterId = req.user._id;

    const order = await orderModel.findById(orderId);

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    // Only user who created it or admin can delete
    if (order.userId.toString() !== requesterId.toString() &&
        req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await order.deleteOne();

    res.json({
      success: true,
      message: "Order deleted successfully",
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// New: Create cart-based order
  const createCartOrder = async (req, res) => {
  try {
    const { items, lat, lng, subtotal, gst, total, paymentMethod, paidAmount, remainingAmount } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Items array is required and must not be empty"
      });
    }

    if (!lat || !lng) {
      return res.status(400).json({
        message: "Location (lat, lng) is required"
      });
    }

    // Validate all items exist
    for (const item of items) {
      const cloth = await clothesModel.findById(item.clothId);
      if (!cloth) {
        return res.status(404).json({
          message: `Cloth with id ${item.clothId} not found`
        });
      }
    }

    // Create GeoJSON user location
    const userLocation = {
      type: "Point",
      coordinates: [lng, lat]
    };

    const normalizedTotal = Number(total) || 0;
    const computedPaid = Number.isFinite(Number(paidAmount))
      ? Number(paidAmount)
      : Math.round(normalizedTotal * 0.4);
    const computedRemaining = Number.isFinite(Number(remainingAmount))
      ? Number(remainingAmount)
      : Math.max(normalizedTotal - computedPaid, 0);

    const resolvedPaymentMethod = paymentMethod || "none";
    const resolvedPaymentStatus = computedPaid > 0 && computedRemaining > 0
      ? "partial"
      : computedPaid >= normalizedTotal
        ? "paid"
        : "unpaid";

    // Create cart order
    const newOrder = await orderModel.create({
      userId,
      items,
      subtotal,
      gst,
      total: normalizedTotal,
      status: "pending",
      userLocation,
      orderType: "cart",
      paymentMethod: resolvedPaymentMethod,
      paidAmount: computedPaid,
      remainingAmount: computedRemaining,
      paymentStatus: resolvedPaymentStatus,
    });

    // Populate the order with cloth details
    await newOrder.populate("items.clothId");

    res.status(201).json({
      success: true,
      message: "Cart order created successfully",
      data: newOrder,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all orders (for admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find()
      .populate("userId", "name email phoneNo")
      .populate("clothId")
      .populate("items.clothId")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  createOrder,
  getUserOrders,
  getOrderDetails,
  deleteOrder,
  createCartOrder,
  getAllOrders,
};