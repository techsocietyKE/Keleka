
import { mongooseConnect } from "@/lib/mongoose";
import { Meal } from "@/models/Meal";
import { Order } from "@/models/Order";
import { PopularMeal } from "@/models/PopularMeals";
import moment from "moment";

export default async function handle(req, res) {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Only POST requests are allowed' });
      return;
    }

    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();
  
    const { fullname, email, phoneNumber, grandTotal, paid, Mpesa, paymentMethod, cartProducts, userId } = req.body;
  

    await mongooseConnect();

    const uniqueIds = [...new Set(cartProducts.map(item => item._id))];
    const productsInfo = await Meal.find({ _id: uniqueIds });

    let product_items = [];
    let totalAmount = 0;

    for (const product of cartProducts) {
      const productInfo = productsInfo.find(p => p._id.toString() === product._id);
      if (productInfo) {
        const itemPrice = calculateTotal(product);
        totalAmount += itemPrice;
        product_items.push({
          quantity: product.quantity,
          price_data: {
            product_data: { name: productInfo.name },
            unit_amount: itemPrice,
          }
        });
  
        await Meal.updateOne({ _id: product._id }, { $inc: { timesOrdered: 1 } });

        const popularMeal = await PopularMeal.findOne({
          mealId: product._id,
          date: { $gte: startOfDay, $lt: endOfDay },
        });

        if (popularMeal) {
          await PopularMeal.updateOne(
            { _id: popularMeal._id },
            { $inc: { timesOrdered:1} }
          );
        } else {
          await PopularMeal.create({
            mealId: product._id,
            timesOrdered: product.quantity,
            date: new Date(),
          });
        }
      }
    }
  
    const order = await Order.create({
      product_items,
      fullname,
      phoneNumber,
      grandTotal,
      paid,
      Mpesa,
      email,
      paymentMethod,
      userId,
    });
  
    res.status(200).json({ success: true, order });
}

function calculateTotal(product) {
    if (product.selectedPrices && product.selectedPrices.length > 0) {
        return product.selectedPrices.reduce((acc, price) => acc + Number(price), 0);
    }
    return Number(product.basePrice);
}
