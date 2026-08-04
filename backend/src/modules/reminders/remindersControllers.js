import Reminder from "./remindersSchema.js";

const DAY_MS = 24 * 60 * 60 * 1000;

export const createReminder = async (req, res) => {
  try {
    const userid = req.userID;
    const { reminderDate, reminderDescription, reminderExpiration } = req.body;

    if (!reminderDescription) {
      return res.status(400).json({ message: "Missing reminder description" });
    }
    if (!reminderDate) {
      return res.status(400).json({ message: "Missing reminder date" });
    }

    const date = new Date(reminderDate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: "Invalid reminder date" });
    }

    const reminder = new Reminder({
      userID: userid,
      date,
      description: reminderDescription,
      // Default: clean itself up a day after it fires
      expiresAt: reminderExpiration
        ? new Date(reminderExpiration)
        : new Date(date.getTime() + DAY_MS),
    });
    const newReminder = await reminder.save();
    return res.status(201).json({
      message: "The reminder was successfully created",
      reminder: newReminder,
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};
export const getReminders = async (req, res) => {
  try {
    const userid = req.userID;
    // Soonest first, so the home screen shows what's next at the top
    const reminders = await Reminder.find({ userID: userid }).sort({ date: 1 });
    return res
      .status(200)
      .json({ message: "Success retrieving reminders", reminders: reminders });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};
export const editReminder = async (req, res) => {
  try {
    // ID from the URL path; only the editable fields belong in the body
    const { reminderID } = req.params;
    const { reminderDescription, reminderDate } = req.body;

    if (!reminderDescription && !reminderDate) {
      return res.status(400).json({ message: "Nothing to change" });
    }

    const update = {};
    if (reminderDescription) update.description = reminderDescription;
    if (reminderDate) {
      const date = new Date(reminderDate);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: "Invalid reminder date" });
      }
      update.date = date;
      update.expiresAt = new Date(date.getTime() + DAY_MS);
      // Moved to a new time -> let it notify again
      update.notifiedAt = null;
    }

    // { new: true } returns the updated doc; without it you get the stale one
    // Scoped to the owner so you can't edit someone else's reminder
    const reminder = await Reminder.findOneAndUpdate(
      { _id: reminderID, userID: req.userID },
      update,
      { new: true },
    );
    if (!reminder)
      return res.status(404).json({ message: "Reminder not found" });
    return res
      .status(200)
      .json({ message: "Reminder successfully edited", reminder: reminder });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};
export const deleteReminder = async (req, res) => {
  try {
    // DELETE requests shouldn't carry a body — some proxies strip it; use the path param
    const { reminderID } = req.params;
    const deleted = await Reminder.findOneAndDelete({
      _id: reminderID,
      userID: req.userID,
    });
    if (!deleted) return res.status(404).json({ message: "Reminder not found" });
    return res.status(200).json({ message: "Reminder successfully deleted" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};
