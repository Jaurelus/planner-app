import Task from "./tasksModel.js";
//Function to add a task

export const addTask = async (req, res) => {
  try {
    //Destructure req
    const { userid } = req.headers;

    const { uTaskName, uTaskDesc, uTaskStart, uTaskEnd, uTaskCat } = req.body;
    if (!uTaskName) {
      return res.status(400).json({ message: "Missing task name" });
    } else if (!uTaskStart) {
      return res.status(400).json({ message: "Missing task start time" });
    } else if (!uTaskEnd) {
      return res.status(400).json({ message: "Missing task end time" });
    } else {
      const NewTask = new Task({
        userID: userid,
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
export const editTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { uTaskName, uTaskDesc, uTaskStart, uTaskEnd, uTaskCat } = req.body;
    //Backend verification checks
    if (!uTaskName && !uTaskDesc && !uTaskStart && !uTaskEnd && !uTaskCat) {
      return res.status(400).json({ message: "Nothing to change" });
    }
    const currTask = await Task.findById(id);
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        taskName: uTaskName || currTask.taskName,
        taskDescription: uTaskDesc || currTask.taskDescription,
        timeStart: uTaskStart || currTask.timeStart,
        timeEnd: uTaskEnd || currTask.timeEnd,
        taskCategory: uTaskCat || currTask.taskCategory,
      },
      { new: true },
    );
    return res
      .status(200)
      .json({ message: "Goal successfully updated", task: updatedTask });
  } catch (error) {
    console.log(error);
  }
};
//Function to delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    return res.status(200).json({ message: "Task successfully deleted" });
  } catch (error) {
    return res.status(400).json({ message: "Error deleting task" });
  }
};
//Function to view all tasks

export const viewAllTasks = async (req, res) => {
  try {
    const { userid } = req.headers;
    const { date } = req.query;
    const testDate = new Date(date);
    testDate.setUTCHours(0, 0, 0);

    let testDate1 = new Date(date);
    testDate1.setUTCHours(23, 59, 59);

    const tasks = await Task.find({
      userID: userid,
      timeStart: { $gte: testDate, $lte: testDate1 },
    });
    //console.log(tasks);
    return res
      .status(200)
      .json({ message: "Tasks sucessfully retrieved", tasks });
  } catch (error) {
    res.status(400).json({ message: "Error retreiving tasks: ", error });
  }
};
