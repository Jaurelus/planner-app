import User from "../user/userModel.js";
import Task from "../tasks/tasksModel.js";
import Reminder from "../reminders/remindersSchema.js";
import cron from "node-cron";

//Find all reminders due within the last 5 minutes. The cron ticks every minute,
//so the window overlaps on purpose -- notfiedAt is what stops a resend.

const WINDOW_MS = 5 * 60 * 1000;

export const operateReminderFlow = async () => {
  const now = new Date();
  const min = new Date(now.getTime() - WINDOW_MS); //5 minutes ago
  const dueTasks = await Task.find({
    remindTime: { $lte: now, $gte: min },
    notfiedAt: null,
  }).lean(); // only items that are due but within the last 5 minutes
  console.log(`[reminders] ${dueTasks.length} task(s) due`);

  let completeTask = [];
  for (const task of dueTasks) {
    // findById returns null if the user was deleted -- guard with ?.
    const notiToken = await User.findById(task.userID, { pushToken: 1 }).lean();
    if (!notiToken?.pushToken) continue;

    completeTask.push({ ...task, pushToken: notiToken.pushToken });
  }

  const messages = completeTask.map((task) => prepareNoti(task));
  if (messages.length === 0) return;

  await sendNoti(messages);

  // Stamp only after the send resolves, so a failure retries next tick
  await Task.updateMany(
    { _id: { $in: completeTask.map((t) => t._id) } },
    { $set: { notfiedAt: new Date() } },
  );
};

const prepareNoti = (task) => {
  const diff = Math.round((task.timeStart - task.remindTime) / 60000);
  return {
    to: task.pushToken,
    title: task.taskName,
    body: `${task.taskName} starts in ${diff} minutes. ${task.taskDescription || ""}`,
  };
};

const sendNoti = async (noti) => {
  const res = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noti),
  });
  const data = await res.json();
  console.log("Expo response:", JSON.stringify(data));
};

//Standalone reminders (not attached to a task) due in the same window
export const operateStandaloneReminders = async () => {
  const now = new Date();
  const min = new Date(now.getTime() - WINDOW_MS);
  const due = await Reminder.find({
    date: { $lte: now, $gte: min },
    notifiedAt: null,
  }).lean();
  if (due.length === 0) return;

  const messages = [];
  const sentIDs = [];
  for (const reminder of due) {
    const user = await User.findById(reminder.userID, { pushToken: 1 }).lean();
    if (!user?.pushToken) continue;
    messages.push({
      to: user.pushToken,
      title: "Reminder",
      body: reminder.description,
    });
    sentIDs.push(reminder._id);
  }
  if (messages.length === 0) return;

  await sendNoti(messages);
  await Reminder.updateMany(
    { _id: { $in: sentIDs } },
    { $set: { notifiedAt: new Date() } },
  );
};

// Guard against overlapping runs -- if a tick is still working, skip this one.
let isRunning = false;

//Every minute:
cron.schedule("* * * * *", async () => {
  if (isRunning) return;
  isRunning = true;
  try {
    await operateReminderFlow();
    await operateStandaloneReminders();
  } catch (error) {
    console.log("Reminder flow error:", error);
  } finally {
    isRunning = false;
  }
});
