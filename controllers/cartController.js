import Cart from '../models/cartModel.js';

export const addToCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      const itemIndex = cart.products.findIndex(p => p.productId == productId);

      if (itemIndex > -1) {
        cart.products[itemIndex].quantity += 1;
      } else {
        cart.products.push({ productId, quantity: 1 });
      }

      await cart.save();
      res.status(200).json(cart);
    } else {
      const newCart = new Cart({
        userId,
        products: [{ productId, quantity: 1 }]
      });
      await newCart.save();
      res.status(201).json(newCart);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
