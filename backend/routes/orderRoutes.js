import express from 'express'
const router = express.Router()
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getOrderBySid,
  getOrderByUserId,
  postOrderByUserId
} from '../controllers/orderController.js'
import { protect, admin, protect2} from '../middleware/authMiddleware.js'

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders)
router.route('/myorders').get(protect, getMyOrders)
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered)
router.route('/sid/:sid').get(getOrderBySid);
router.route('/userID/:userID').get(getOrderByUserId).post(protect2, postOrderByUserId)



export default router
