import Goal from "./goalsModel.js";

//Create a goal (Put)
export const createGoal = async (req, res) => {
  try {
    const { goalTitle, goalDescription } = req.body;

    if (!goalTitle) {
      return res.status(400).json({ message: "Missing the goal title" });
    }

    const newGoal = new Goal({
      title: goalTitle,
      description: goalDescription || "",
    });

    const savedGoal = await newGoal.save();
    return res
      .status(201)
      .json({ message: "New goal added!", goal: savedGoal });
  } catch (error) {
    return res.status(400).json({ message: `Error saving goal: ${error}` });
  }
};

// Edit a goal (Post)

//Delete a goal

//Get all goals
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find();
    return res.status(200).json({ message: "Gaols retrieved", goals });
  } catch {
    return res.status(400).json({ message: "Error retrieving goals." });
  }
};
