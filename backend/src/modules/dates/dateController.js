import MarkedDate from "./dateModel.js";

export const addNewDate = async (req, res) => {
  //
  try {
    const { _id } = req.params;
    const { newDateName, newDateType, newDateDate, newDateRule } = req.body;
    if (!newDateName) {
      return res.status(400).json({ message: "Missing name" });
    }

    if (!newDateDate) {
      return res.status(400).json({ message: "Missing date" });
    }

    const newDate = new MarkedDate({
      userID: _id,
      date: newDateDate,
      name: newDateName,
      type: newDateType,
      rule: newDateRule,
    });
    const savedDate = await newDate.save();
    return res.status(201).json({ message: "Date marked", date: savedDate });
  } catch (error) {
    return res.status(400).json({ message: "Error " + error });
  }
};
export const getDates = (req, res) => {
  try {
    const { _id } = req.params;
    console.log(_id);
    const userDates = Date.find({ userID: _id });
    return res.status(200).json({ message: "Success", dates, userDates });
  } catch (error) {
    return res.status(400).json({ message: "Error" + error });
  }
  //
};
const deletedDate = (req, res) => {
  //
};
const editDate = (req, res) => {
  //
};
