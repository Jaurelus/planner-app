import MarkedDate from "./dateModel.js";

export const addNewDate = async (req, res) => {
  //
  try {
    const { userid } = req.headers;
    const { newDateName, newDateType, newDateDate, newDateRule } = req.body;
    if (!newDateName) {
      return res.status(400).json({ message: "Missing name" });
    }

    if (!newDateDate) {
      return res.status(400).json({ message: "Missing date" });
    }

    const currDate = new MarkedDate({
      userID: userid,
      date: newDateDate,
      name: newDateName,
      type: newDateType,
      rule: newDateRule,
    });
    const savedDate = await currDate.save();
    return res.status(201).json({ message: "Date marked", date: savedDate });
  } catch (error) {
    return res.status(400).json({ message: "Error " + error });
  }
};
export const getDates = async (req, res) => {
  try {
    const { userid } = req.headers;
    const { searchColor } = req.params;
    let userDates;
    if (searchColor) {
      userDates = await MarkedDate.find({
        userID: userid,
        color: searchColor,
      });
    } else {
      userDates = await MarkedDate.find({
        userID: userid,
      });
    }

    return res.status(200).json({ message: "Success", userDates });
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
