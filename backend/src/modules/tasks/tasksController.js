import Task from "./tasksModel";
//Function to add a task

const addGoal = async (res, req) => {
  try {
    //Destructure req
    const { uTaskName, uTaskDesc, uTaskStart, uTaskEnd, uTaskCat } = req.body;
    if (!uTaskName) {
      return res.status(400).json({ message: "Missing task name" });
    } else if (!uTaskStart) {
      return res.status(400).json({ message: "Missing task start time" });
    } else if (!uTaskEnd) {
      return res.status(400).json({ message: "Missing task end time" });
    } else {
      const NewTask = new Task({
        taskName: uTaskName,
        taskDescription: uTaskDesc || "",
        timeStart: uTaskStart,
        timeEnd: uTaskEnd,
        taskCategory: uTaskCat || "",
      });

      const savedGoal = await NewTask.save();
      return res
        .status(201)
        .json({ savedGoal, message: "Task successfully added" });
    }
  } catch (error) {
    return res.status(400).json({ message: "Error : ", error });
  }
};

//Function to edit a task
const editTask = async (req, res) => {};
//Function to delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    Task.findByIdAndDelete(id);
    return res.status(200).json({ message: "Task successfully deleted" });
  } catch (error) {
    return res.status(400).json({ message: "Error deleting task" });
  }
};
//Function to view all tasks

const viewAllTasks = async (res) => {
  try {
    const tasks = await Task.find();
    return res
      .status(200)
      .json({ message: "Tasks sucessfully retrieved", tasks });
  } catch (error) {
    res.status(400).json({ message: "Error retreiving tasks: ", error });
  }
};
