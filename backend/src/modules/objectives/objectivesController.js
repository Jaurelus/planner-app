import Objectives from "./objectivesModel.js";
export const addObjective = async (req, res) => {
  try {
    const userid = req.userID;
    const {
      objectiveTitle,
      objectiveDescription,
      objectiveProgress,
      objectiveGoalNumber,
      objectiveMonth,
    } = req.body;
    const newObjective = Objectives({
      userID: userid,
      title: objectiveTitle,
      description: objectiveDescription || "",
      progress: objectiveProgress || 0,
      goalNumber: objectiveGoalNumber || 0,
      month: objectiveMonth,
    });
    const savedObjective = await newObjective.save();
    return res.status(201).json({
      message: "Objective sucessfully saved",
      objective: savedObjective,
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export const getObjectives = async (req, res) => {
  try {
    const userid = req.userID;
    const { currMonth } = req.query;
    console.log(userid, currMonth);
    const userObj = await Objectives.find({ userID: userid, month: currMonth });
    const mtp = await Objectives.find({ userID: userid });
    console.log("MTP", mtp);

    console.log(userObj);
    return res
      .status(200)
      .json({ message: "Objectives retrieved", objectives: userObj });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export const editObjective = async (req, res) => {
  try {
    const { objectiveID } = req.params;
    const {
      objectiveTitle,
      objectiveDescription,
      objectiveProgress,
      objectiveGoalNumber,
      objectiveMonth,
    } = req.body;
    // Scoped to the owner so you can't edit someone else's objective
    const currObjective = await Objectives.findOne({
      _id: objectiveID,
      userID: req.userID,
    });
    if (!currObjective)
      return res.status(404).json({ message: "Objective not found" });
    const updatedObjective = await Objectives.findByIdAndUpdate(
      objectiveID,
      {
        title: objectiveTitle || currObjective.title,
        description: objectiveDescription || currObjective.description,
        progress: objectiveProgress || currObjective.progress,
        goalNumber: objectiveGoalNumber || currObjective.goalNumber,
        month: objectiveMonth || currObjective.month,
      },
      { new: true },
    );
    return res.status(200).json({
      message: "Objective sucessfully updated",
      Objectives: updatedObjective,
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export const deleteObjective = async (req, res) => {
  try {
    const { objectiveID } = req.params;
    const deleted = await Objectives.findOneAndDelete({
      _id: objectiveID,
      userID: req.userID,
    });
    if (!deleted)
      return res.status(404).json({ message: "Objective not found" });
    return res.status(200).json({ message: "Objective sucessfully deleted" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};
