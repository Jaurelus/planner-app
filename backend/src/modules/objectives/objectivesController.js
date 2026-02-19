import Objectives from "./objectivesModel";

export const addObjective = async (req, res) => {
  try {
    const { userid } = req.headers;

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
      description: objectiveDescription,
      progress: objectiveProgress,
      goalNumber: objectiveGoalNumber,
      month: objectiveMonth,
    });
    const savedObjective = newObjective.save();
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
    const { userid } = req.headers;
    const { currMonth } = req.query;
    Objectives.find({ userID: userid, month: currMonth });
    return res.status(200).json({ message: "Objectives retrieved" });
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
    const currObjective = Objectives.findbyId(objectiveID);
    const updatedObjective = await Objectives.findbyIdandUpdate(
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
    Objectives.findbyIdandDelete(objectiveID);
    return res.status(200).json({ message: "Objective sucessfully deleted" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};
