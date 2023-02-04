<template>
  <div id="view">
    <router-view />
  </div>
  <div id="disclaimer">
    Innistrad Exhumed is unofficial Fan Content permitted under the Wizards of the Coast Fan Content Policy. Not
    approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. © Wizards of the
    Coast LLC. All card artworks are the property of their respective creators.
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#view {
  min-height: calc(100vh - 25px);
  box-sizing: border-box;
}

#disclaimer {
  background: #aaa;
  color: #333;
  padding: 30px 10%;
  font-size: 10pt;
}
</style>
