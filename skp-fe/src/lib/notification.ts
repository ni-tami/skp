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

export async function sendApproachingEdgeNotification(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Getting close to the edge",
      body: "You're nearing the edge of the safe zone.",
    },
    trigger: null,
  });
}

export async function sendEnterNotification(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You're back in the safe zone",
      body: "You're now inside the safe zone.",
    },
    trigger: null,
  });
}
