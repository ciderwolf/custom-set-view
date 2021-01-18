<template>
  <div class="added-cards">
    <div class="slide-in from-left show" @click="removeNotification(index)"
      v-for="({ name, sideboard, count }, index) of notifications" :key="index">
      <div class="slide-in-content alert">
        Added {{ count }} '{{ name }}' to your {{ sideboard ? "sideboard" : "deck" }}.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notifications: [],
    };
  },
  methods: {
    push(name, sideboard = false) {
      const preexistingAlert = this.notifications
        .find((notification) => notification.name === name && notification.sideboard === sideboard);
      if (preexistingAlert !== undefined) {
        preexistingAlert.count += 1;
      } else {
        this.notifications.push({ name, sideboard, count: 1 });
      }
      this.$store.addCardToCurrentDeck(name, 1, sideboard);
    },
    removeNotification(index) {
      this.notifications.splice(index, 1);
    },
  },
  name: 'AddedCards',
};
</script>

<style scoped>
.added-cards {
  position: fixed;
  bottom: 0;
}

.alert {
  width: 200px;
  background: white;
  padding: 10px;
  border-radius: 3px;
  border: 1px solid #555;
  margin: 3px 0px;
  cursor: pointer;
  background: #fffe;
}

.slide-in {
  overflow: hidden;
}

.slide-in.from-right {
  right: 0;
}

.slide-in.from-left {
  left: 0;
}

.slide-in.from-right .slide-in-content {
  transform: translateX(100%);
  -webkit-transform: translateX(100%);
}

.slide-in.from-left .slide-in-content {
  transform: translateX(-100%);
  -webkit-transform: translateX(-100%);
}

.slide-in.show .slide-in-content {
  transform: translateX(0%);
  -webkit-transform: translateX(0%);
}
</style>
