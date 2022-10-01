import { defineStore } from "pinia";
import { useDecksStore } from "./decks";

interface Notification {
  name: string;
  sideboard: boolean;
  count: number
}


export const useNotificationStore = defineStore({
  id: 'notifications',
  state: () => ({
    notifications: [] as Notification[]
  }),
  actions: {
    push(name: string, sideboard = false) {
      const decks = useDecksStore();

      const preexistingAlert = this.notifications
        .find((notification) => notification.name === name && notification.sideboard === sideboard);
      if (preexistingAlert !== undefined) {
        preexistingAlert.count += 1;
      } else {
        this.notifications.push({ name, sideboard, count: 1 });
      }
      decks.addCardToCurrentDeck(name, 1, sideboard);
    },
    removeNotification(index: number) {
      this.notifications.splice(index, 1);
    },
    clear() {
      this.notifications = [];
    }
  }
});