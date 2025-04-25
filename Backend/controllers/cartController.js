import userModel from "../models/userModel.js";


// Add products to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body;

        const userData =  await userModel.findById(userId)
        const cartData = await userData.cartData;

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        await userModel.findByIdAndUpdate(userId,  { cartData });

        res.json({ success: true, message: "Added to cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update user cart
const updateCart = async (req, res) => {
    try {
      const { userId, itemId, size, quantity } = req.body;
  
      const userData = await userModel.findById(userId);
      const cartData = userData.cartData || {};
  
      // Update or remove the size entry
      if (!cartData[itemId]) {
        cartData[itemId] = {};
      }
  
      if (quantity > 0) {
        cartData[itemId][size] = quantity;
      } else {
        delete cartData[itemId][size];
      }
  
      // Remove itemId completely if no sizes remain
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
  
      // Save cleaned cart
      await userModel.findByIdAndUpdate(userId, { cartData });
  
      res.json({ success: true, message: "Cart updated" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };

// Get user cart data
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;

        const userData =  await userModel.findById(userId)
        const cartData = await userData.cartData;

        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export {
    addToCart,
    updateCart,
    getUserCart
}