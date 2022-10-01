<template>
  <div id="error-404">
    <div class="center">
      <h1>Whoops!</h1>
      <h3>It looks like that page is totally lost...</h3>
      <router-link id="go-home" to="/">Go Home</router-link>
    </div>
    <img id="fblthp" src="@/assets/fblthp.png">
  </div>
</template>

<style scoped>
#fblthp {
  position: absolute;
  bottom: 0;
  right: 20%;
  opacity: 0.75;
}

.center {
  margin: 100px 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#go-home {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 10px;
  height: 28px;
  font-size: 14px;
  font-weight: 500;
  color: #484848;
  text-decoration: none;
  border: 1px solid rgba(41, 41, 41, 0.5);
  border-radius: 3px;
  background-color: #f8f8f8;
  transition: border-color, background-color 0.3s linear;
}

#go-home:hover {
  background-color: white;
  border-color: rgba(41, 41, 41, 0.75);
}
</style>
