import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    orderId: {
        type: String,
        required: [true, "Please provide an order id"],
        unique: true,
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
    },
    product_details: {
        name: String,
        image: Array,
    },
    paymentId: {
        type: String,
        default: "",
    },
    payment_status: {
        type: String,
        default: "",
    },
    delivary_address: {
        type: mongoose.Schema.ObjectId,
        ref: "address",
    },
    subTotal: {
        type: Number,
        default: 0,
    },
    totalAmount: {
        type: Number,
        default: 0,
    },
    invoice_receipt: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
})

const OrderModel = mongoose.model("order", orderSchema);

export default OrderModel;