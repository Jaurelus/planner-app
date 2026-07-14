import Reminder from "./remindersSchema.js";

export const createReminder = async (req, res) => {
  try {
    const { userid } = req.headers;
    const { reminderDate, reminderDescription, reminderExpiration } = req.body;
    const reminder = new Reminder({
      userID: userid,
      date: reminderDate,
      description: reminderDescription,
      expiresAt: reminderExpiration,
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
    const { userid } = req.headers;
    const reminders = await Reminder.find({ userID: userid });
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
    const { reminderDescription } = req.body;
    const reminder = await Reminder.findByIdAndUpdate(reminderID, {
      description: reminderDescription,
    });
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
    await Reminder.findByIdAndDelete(reminderID);
    return res.status(200).json({ message: "Reminder successfully deleted" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};
