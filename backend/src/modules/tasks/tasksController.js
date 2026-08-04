import Task from "./tasksModel.js";
//Function to add a task

export const addTask = async (req, res) => {
  try {
    //Destructure req
    const userid = req.userID;

    const {
      uTaskName,
      uTaskDesc,
      uTaskStart,
      uTaskEnd,
      uTaskCat,
      uTaskRemind,
    } = req.body;
    if (!uTaskName) {
      return res.status(400).json({ message: "Missing task name" });
    } else if (!uTaskStart) {
      return res.status(400).json({ message: "Missing task start time" });
    } else if (!uTaskEnd) {
      return res.status(400).json({ message: "Missing task end time" });
    } else {
      // uTaskRemind is "minutes before start". Absent -> no reminder.
      const remindTime = uTaskRemind
        ? new Date(new Date(uTaskStart).getTime() - Number(uTaskRemind) * 60000)
        : null;

      const NewTask = new Task({
        userID: userid,
        taskName: uTaskName,
        taskDescription: uTaskDesc || "",
        timeStart: uTaskStart,
        timeEnd: uTaskEnd,
        taskCategory: uTaskCat || "",
        remindTime,
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
    const {
      uTaskName,
      uTaskDesc,
      uTaskStart,
      uTaskEnd,
      uTaskCat,
      uTaskRemind,
    } = req.body;
    //Backend verification checks
    if (
      !uTaskName &&
      !uTaskDesc &&
      !uTaskStart &&
      !uTaskEnd &&
      !uTaskCat &&
      uTaskRemind === undefined
    ) {
      return res.status(400).json({ message: "Nothing to change" });
    }
    // Scoped to the owner so you can't edit someone else's task
    const currTask = await Task.findOne({ _id: id, userID: req.userID });
    if (!currTask) return res.status(404).json({ message: "Task not found" });

    const newStart = uTaskStart || currTask.timeStart;
    // Recompute remindTime if either the offset or the start time moved,
    // and clear notfiedAt so the rescheduled reminder can fire again.
    // undefined -> field wasn't sent, keep it. "" -> user unticked, clear it.
    let remindTime;
    if (uTaskRemind === undefined) {
      remindTime = currTask.remindTime;
    } else if (uTaskRemind) {
      remindTime = new Date(
        new Date(newStart).getTime() - Number(uTaskRemind) * 60000,
      );
    } else {
      remindTime = null;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        taskName: uTaskName || currTask.taskName,
        taskDescription: uTaskDesc || currTask.taskDescription,
        timeStart: newStart,
        timeEnd: uTaskEnd || currTask.timeEnd,
        taskCategory: uTaskCat || currTask.taskCategory,
        remindTime,
        notfiedAt: uTaskRemind || uTaskStart ? null : currTask.notfiedAt,
      },
      { new: true },
    );
    return res
      .status(200)
      .json({ message: "Goal successfully updated", task: updatedTask });
  } catch (error) {
    return res.status(401).json({ message: "Error " + error });
  }
};
//Function to delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Task.findOneAndDelete({ _id: id, userID: req.userID });
    if (!deleted) return res.status(404).json({ message: "Task not found" });
    return res.status(200).json({ message: "Task successfully deleted" });
  } catch (error) {
    return res.status(400).json({ message: "Error deleting task" });
  }
};
//Function to view all tasks

export const viewAllTasks = async (req, res) => {
  try {
    const userid = req.userID;
    const { date } = req.query;
    const testDate = new Date(date);
    console.log(testDate);
    testDate.setHours(0, 0, 0);

    let testDate1 = new Date(date);
    testDate1.setDate(testDate.getDate() + 1);
    testDate1.setHours(23, 59, 59, 999);
    console.log(testDate1);

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
