const mongoose = require("mongoose");
const model = require("../model/property");
const model2 = require("../model/user");
const Property = model.Property;
const User = model2.User;
const stripe = require("stripe")(
  "sk_test_51PCzy206c1fApDVTkGHp0YdPrIrJQ8vFKjpHO7kqNwPl7KgbO3zBqGN96UGSQu11c728MC6vj9cCIH1W90zcYnVb00HWXwce7O" //Secret Key
);

exports.payment = async (req, res) => {
  const token = req.body.userToken;
  const user = await User.findOne({ token: token });
  const productId = new mongoose.Types.ObjectId(req.body.productId);
  const product = await Property.findOne({ _id: productId });
  const proPrice =
    product.price - (product.price / 100) * product.discountPercentage;

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
            },
            unit_amount: proPrice * 100,
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });
    await res.json({ url: session.url, message: "ok" });
    console.log("Successful");
  } catch (error) {
    await res.status(500).json({ error: error.message });
    console.log(error);
    console.log("Un-Successful");
  }
};

exports.updateUser = async (req, res) => {
  console.log("Hello");
  try {
    const { propertyId, userToken } = req.body;
    console.log("Property Id is: ", propertyId);

    // Find the user by token
    const user = await User.findOne({ token: userToken });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const propertyDetails = await Property.find({
      _id: { $in: propertyId.map((med) => med.id) },
    });

    // Prepare the buy history updates
    const buyHistoryUpdates = propertyDetails.map((med) => {
      const medRequest = propertyId.find(
        (m) => m.id.toString() === med._id.toString()
      );
      return {
        medId: med._id.toString(),
        name: med.name,
        isRated: false,
        rating: null,
        commentId: [],
        date: new Date(),
      };
    });

    // Update the user's buy history
    user.buyHistory = [...user.buyHistory, ...buyHistoryUpdates];

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
