import Notification from "../models/notification.model.js";

export const getNotifications = async function (req, res) {
  const userId = req.user._id;

  try {
    const notifications = await Notification.find({ to: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "from",
        select: "-password",
      });

    if (notifications.length === 0)
      return res
        .status(200)
        .json({ message: "No notifications for this user", data: [] });

    await Notification.updateMany({ to: userId }, { read: true });

    res.status(200).json({
      message: "Notifications fetched successfully",
      data: notifications,
    });
  } catch (error) {
    console.error(`Error occured in getting notifications: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};

export const deleteNotifications = async function (req, res) {
  const userId = req.user._id;

  try {
    const deletedNotifications = await Notification.deleteMany({ to: userId });

    if (deletedNotifications.length === 0)
      return res.status(200).json({ message: "No notifications to delete" });

    return res.status(200).json({ message: "Notifications deleted" });
  } catch (error) {
    console.error(`Error occured in deleting notifications: ${erorr.message}`);
    return res.status(500).json({ error: error.message });
  }
};

export const deleteNotification = async function (req, res) {
  const userId = req.user._id;
  const { id } = req.params;

  const notification = await Notification.findById(id);
  try {
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    if (notification.to.toString() !== userId.toString())
      return res
        .status(403)
        .json({ error: "You are not autharized to delete this notification" });

    const deletedNotification = await Notification.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error(
      `Error occured while deleting notification with id: ${id} with error message: ${error.message}`
    );
    return res.status(500).json({ message: error.message });
  }
};
