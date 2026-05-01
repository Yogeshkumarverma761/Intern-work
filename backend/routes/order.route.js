import express from "express";
import auth from "../middlewares/auth.middleware.js";
import orderController from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", auth.authUser, orderController.createOrder);

// Cart-based order
router.post("/create-cart-order", auth.authUser, orderController.createCartOrder);

// USER gets all their orders
router.get("/user", auth.authUser, orderController.getUserOrders);

// ADMIN gets all orders
router.get("/all", orderController.getAllOrders);

// USER gets order details
router.get("/details/:id", auth.authUser, orderController.getOrderDetails);

// USER deletes order
router.delete("/:id", auth.authUser, orderController.deleteOrder);

export default router;