const mongoose = require("mongoose");
const model = require("../model/medicine");
const model2 = require("../model/user");
const Medicine = model.Medicine;
const User = model2.User;
const stripe = require("stripe")(
  "sk_test_51OpvC0A1UboyhyVAiOzJKaf270wU4BZ4yqPIGeMw1h6oj62RgsZlKR6VGt7VAUagtuKznWLxRRcqlWxtGSiB9yYo00RZokXx7l"
);

exports.payment = async (req, res) => {
  const token = req.body.userToken;
  console.log(req.body.items);
  const productid = req.body.items.map((el) => el._id);
  const idArray = productid.map(
    (id) => new mongoose.Types.ObjectId(String(id))
  );
  const products = await Medicine.find({ _id: { $in: idArray } });

  function findMatchingProduct(products, item) {
    //objectId.toString();
    //console.log(products[0]._id);
    //console.log(products[0]._id.toString());
    console.log(item._id);
    const matchingProduct = products.find(
      (product) => product._id.toString() === item._id
    );
    if (matchingProduct) {
      return matchingProduct;
      // Perform any operations with matchingProduct here
    } else {
      return "cannot find";
    }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map((item) => {
        const product = findMatchingProduct(products, item);
        return {
          price_data: {
            currency: "bdt",
            product_data: {
              name: "hri",
            },
            unit_amount: 10 * 100,
          },
          quantity: 10,
        };
      }),
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
