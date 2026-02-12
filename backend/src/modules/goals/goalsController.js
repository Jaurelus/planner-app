import Goal from "./goalsModel.js";

//Create a goal (Post)
export const createGoal = async (req, res) => {
  try {
    const { userid } = req.headers;

    const { goalTitle, goalDescription, goalDate } = req.body;

    if (!goalTitle) {
      return res.status(400).json({ message: "Missing the goal title" });
    }

    const newGoal = new Goal({
      userID: userid,
      title: goalTitle,
      description: goalDescription || "",
      date: goalDate || new Date(),
    });

    const savedGoal = await newGoal.save();
    console.log(savedGoal.date);
    return res
      .status(201)
      .json({ message: "New goal added!", goal: savedGoal });
  } catch (error) {
    return res.status(400).json({ message: `Error saving goal: ${error}` });
  }
};

// Edit a goal (Put)
export const editGoal = async (req, res) => {
  try {
    //Destructure request
    const { goalTitle, goalDescription, goalCompletion } = req.body;
    const { id } = req.params;

    //Find current goal
    const currGoal = await Goal.findById(id);

    //At least one thing needed for update
    if (!goalTitle && !goalDescription && goalCompletion === undefined) {
      return res.status(400).json({
        message: "Goal Title, Goal Description, and Goal Completion are empty",
      });
    }

    const updatedGoal = await Goal.findByIdAndUpdate(
      id,
      {
        title: goalTitle || currGoal.title,
        description: goalDescription || currGoal.description,
        complete:
          goalCompletion !== undefined ? goalCompletion : currGoal.complete,
      },
      { new: true },
    );
    return res.status(200).json({ message: "Goal updated", goal: updatedGoal });
  } catch (error) {
    return res.status(400).json({ message: "Error updating goal" });
  }
};

//Delete a goal
export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    await Goal.findByIdAndDelete(id);
    return res.status(200).json({ message: "Goal deleted" });
  } catch (error) {
    return res.status(400).json({ message: "Error deleting this goal" });
  }
};

//Get all goals
export const getGoals = async (req, res) => {
  try {
    const { userid } = req.headers;
    const { startDate, endDate } = req.query;
    let jsObjectStart = new Date(startDate);
    jsObjectStart.setUTCHours(0, 0, 0);
    let jsObjectEnd = new Date(endDate);
    jsObjectEnd.setUTCHours(23, 59, 59);
    console.log(jsObjectEnd, jsObjectStart);

    console.log(startDate.split("-")[2]);

    startDate.split("-")[3];

    console.log(endDate);
    //get date num, iterate throuhg date nums, return only goals that match date
    const goals = await Goal.find({
      userID: userid,
      date: { $gte: jsObjectStart, $lte: jsObjectEnd },
    });
    console.log(goals);
    return res.status(200).json({ message: "Goals retrieved", goals });
  } catch {
    return res.status(400).json({ message: "Error retrieving goals." });
  }
};
