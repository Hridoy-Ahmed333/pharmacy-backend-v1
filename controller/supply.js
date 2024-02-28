const mongoose = require("mongoose");
const model = require("../model/supply");
const model2 = require("../model/medicine");
const Supply = model.Supply;
const Medicine = model2.Medicine;

exports.createSupply = async (req, res) => {
  const newSupply = new Supply({
    ...req.body,
    supplierId: "", // Add or override properties as needed
    dilevered: false,
    time: Date.now(), // Add or override properties as needed
  });
  console.log(newSupply);
  try {
    const output = await newSupply.save();
    console.log(output);
    res.status(201).json(output);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

// exports.getSuppply = async (req, res) => {
//   try {
//     const supply = await Supply.find();
//     const med = supply.map(async (el) => {
//       const product = await Medicine.findById(el.productId);

//       const response = { el, product: product };
//       return response;
//     });
//     console.log(med);
//     const items = { supply: supply };
//     res.json(med);
//   } catch (error) {
//     console.log(error);
//     res.status(400).send(error);
//   }
// };

exports.getSuppply = async (req, res) => {
  try {
    const supply = await Supply.find();
    const med = await Promise.all(
      supply.map(async (el) => {
        const product = await Medicine.findById(el.productId);

        const response = { el, product: product };
        return response;
      })
    );
    res.json(med);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
