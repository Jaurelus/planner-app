import Objectives from "../objectives/objectivesModel.js";
import MarkedDate from "./dateModel.js";

//Shared palette -- also what the settings screen offers when editing a colour
export const COLORS = [
  "#3B82F6", // blue
  "#22C55E", // green
  "#EAB308", // yellow
  "#A855F7", // purple
  "#F97316", // orange
  "#14B8A6", // teal
];

export const addNewDate = async (req, res) => {
  const userid = req.userID;

  //Pick a colour this user isn't already using. Only once every colour is
  //taken do we allow a repeat -- new categories should look distinct.
  const getRandomColor = async () => {
    const usedColors = await MarkedDate.distinct("category.color", {
      userID: userid,
    });
    const available = COLORS.filter((c) => !usedColors.includes(c));
    const pool = available.length > 0 ? available : COLORS;
    return pool[Math.floor(Math.random() * pool.length)];
  };
  //
  try {
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
      : await getRandomColor();
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
    const userid = req.userID;
    // optional filter -> query string (?searchColor=...), params only works with a /:placeholder route
    const { searchColor } = req.query;
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
    const deleted = await MarkedDate.findOneAndDelete({
      _id: dateID,
      userID: req.userID,
    });
    if (!deleted) return res.status(404).json({ message: "Date not found" });
    return res.status(200).json({ message: "Date successfully deleted" });
  } catch (error) {
    return res.status(400).json({ message: "Error" + error });
  }
};

//Recolour every marked date in one category.
//No uniqueness check on purpose -- when editing, two categories are allowed to
//share a colour. That restriction only applies when a category is first created.
export const editCategoryColor = async (req, res) => {
  try {
    const userid = req.userID;
    const { categoryType, newColor } = req.body;

    if (!categoryType) {
      return res.status(400).json({ message: "Missing category type" });
    }
    if (!newColor) {
      return res.status(400).json({ message: "Missing colour" });
    }
    if (!COLORS.includes(newColor)) {
      return res.status(400).json({ message: "Colour not in palette" });
    }

    // The colour lives on every date doc in that category, so update them all
    const result = await MarkedDate.updateMany(
      { userID: userid, "category.type": categoryType },
      { $set: { "category.color": newColor } },
    );

    if (result.matchedCount === 0) {
      return res.status(400).json({ message: "No dates in that category" });
    }

    return res.status(200).json({
      message: "Category colour updated",
      updated: result.modifiedCount,
    });
  } catch (error) {
    return res.status(400).json({ message: "Error " + error });
  }
};

//Expose the palette so the frontend doesn't hardcode its own copy
export const getPalette = async (req, res) => {
  return res.status(200).json({ message: "Palette", colors: COLORS });
};

export const editDate = async (req, res) => {
  try {
    const { dateID } = req.params;
    const { dateName, dateRule, dateCategory } = req.body;
    // Scoped to the owner so you can't edit someone else's date
    const date = await MarkedDate.findOne({ _id: dateID, userID: req.userID });
    if (!date) return res.status(404).json({ message: "Date not found" });
    const updatedDate = await MarkedDate.findByIdAndUpdate(
      dateID,
      {
        name: dateName || date.name,
        rule: dateRule || date.rule,
        category: {
          type: dateCategory?.type || date.category.type,
          color: dateCategory?.color || date.category.color,
        },
      },
      { new: true },
    );
    return res
      .status(200)
      .json({ message: "Date sucessfully edited", date: updatedDate });
  } catch (error) {
    return res.status(400).json({ message: "Error editing this date" + error });
  }
  //
};

export const getCategories = async (req, res) => {
  try {
    // frontend sends ?color=... -> that lands in req.query, never req.params

    const { color } = req.query;
    const userid = req.userID;
    let categories;
    if (!color) {
      categories = await MarkedDate.distinct("category", {
        userID: userid,
      });
    } else {
      categories = await MarkedDate.find(
        { userID: userid, "category.color": color },
        { category: 1 },
      );
    }
    return res.status(200).json({
      categories: categories,
      message: "Categories successfully retrieved",
    });
  } catch (error) {
    return res.status(400).json({ message: "Error" + error });
  }
};
