import Objectives from "../objectives/objectivesModel.js";
import MarkedDate from "./dateModel.js";

export const addNewDate = async (req, res) => {
  //Code for controlling auto assigning color
  const COLORS = [
    "#3B82F6", // blue
    "#22C55E", // green
    "#EAB308", // yellow
    "#A855F7", // purple
    "#F97316", // orange
    "#14B8A6", // teal
  ];
  const getRandomColor = async () => {
    //Guard this function by not returning colors already used
    let dotColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const usedColors = await MarkedDate.distinct("category.color");
    if (usedColors.includes(dotColor) && usedColors.length == COLORS.length)
      return await getRandomColor();
    return dotColor;
  };
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
    const typeColor = await MarkedDate.findOne({
      userID: userid,
      "category.type": newDateType,
    });
    let existingTypeColor = typeColor
      ? typeColor.category.color
      : getRandomColor();
    const currDate = new MarkedDate({
      userID: userid,
      date: newDateDate,
      name: newDateName,
      rule: newDateRule,
      category: { type: newDateType.toLowerCase(), color: existingTypeColor },
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
        "category.color": searchColor,
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

export const deleteDate = async (req, res) => {
  //
  try {
    const { dateID } = req.params;
    await Objectives.findbyIdAndDelete(dateID);
    return res.status(200).json({ message: "Objective successfully added" });
  } catch (error) {
    return res.status(400).json({ message: "Error" + error });
  }
};

const editDate = async (req, res) => {
  try {
    const { dateID } = req.params;

    const updatedObjective = Objectives.findbyIdAndUpdate(dateID, {});
  } catch (error) {
    return res.status(400).json({ message: "Error editing this date" });
  }
  //
};
