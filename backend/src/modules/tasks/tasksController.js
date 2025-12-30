import Task from "./tasksModel.js";
//Function to add a task

export const addTask = async (req, res) => {
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

      const savedTask = await NewTask.save();
      return res
        .status(201)
        .json({ savedTask, message: "Task successfully added" });
    }
  } catch (error) {
    return res.status(400).json({ message: "Error : ", error });
  }
};

//Function to edit a task
export const editTask = async (req, res) => {};
//Function to delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    Task.findByIdAndDelete(id);
    return res.status(200).json({ message: "Task successfully deleted" });
  } catch (error) {
    return res.status(400).json({ message: "Error deleting task" });
  }
};
//Function to view all tasks

export const viewAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    return res
      .status(200)
      .json({ message: "Tasks sucessfully retrieved", tasks });
  } catch (error) {
    res.status(400).json({ message: "Error retreiving tasks: ", error });
  }
};
