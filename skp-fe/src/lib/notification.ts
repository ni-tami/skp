import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function sendExitNotification(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've left the safe zone!",
      body: `You're now outside the safe zone.`,
    },
    trigger: null,
  });
}
