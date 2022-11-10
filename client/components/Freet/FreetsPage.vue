<!-- Default page that also displays freets -->

<template>
  <main>
    <div class="container-fluid h-100">
    <div class="sidenav">
      <router-link
        to="/"
      >
        Home
      </router-link>
    </div>
    </div>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreateFreetForm />
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in
          </router-link>
          to create, edit, and delete freets.
        </h3>
      </article>
    </section>
    <aside>
      <section>
      <header>
        <div class="left">
          <h2>
            Viewing all circles
            <span v-if="$store.state.circleFilter">
              by @{{ $store.state.circleFilter }}
            </span>
          </h2>
        </div>
        <div class="right">
          <GetCirclesForm
            ref="getCirclesForm"
            value="member"
            button="🔄 Get Circles"
          />
        </div>
      </header> 
      <CreateCircleForm /> 
      <article
        v-if="$store.state.circles.length"
      >
        <CircleComponent
          v-for="circle in $store.state.circles"
          :key="circle.id"
          :circle="circle"
        />
      </article>
      <article
        v-else
      >
      <h3>No Circles found.</h3>
      </article>
      </section>
    </aside>
    <section>
      <header>
      <div class="left">
        <h2>
          Viewing all freets
          <span v-if="$store.state.filter">
            by @{{ $store.state.filter }}
          </span>
        </h2>
      </div>
        <div class="right">
          <GetFreetsForm
            ref="getFreetsForm"
            value="author"
            placeholder="🔍 Filter by author (optional)"
            button="🔄 Get freets"
          />
        </div>
      </header>
      <article
        v-if="$store.state.freets.length"
      >
        <FreetComponent
          v-for="freet in $store.state.freets"
          :key="freet.id"
          :freet="freet"
        />
      </article>
      <article
        v-else
      >
        <h3>No freets found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';
import CircleComponent from '@/components/Circle/CircleComponent.vue';
import CreateCircleForm from '@/components/Circle/CreateCircleForm.vue';
import GetCirclesForm from '@/components/Circle/GetCirclesForm.vue';

export default {
  name: 'FreetPage',
  components: {FreetComponent, GetFreetsForm, CreateFreetForm, CircleComponent, CreateCircleForm, GetCirclesForm},
  mounted() {
    this.$refs.getFreetsForm.submit();
    this.$refs.getCirclesForm.submit();
  }
};
</script>

<style scoped>
.sidenav {
  height: 100%;
  width: 160px; 
  position: fixed; 
  z-index: 0; 
  top: 0; 
  left: 0;
  float: left;
  background-color: #fff;
  overflow-x: hidden; 
  background-color: #f4fce3;
  font-family: Avantgarde, TeX Gyre Adventor, URW Gothic L, sans-serif;
  padding-top: 50px;
}

.sidenav a {
  padding: 6px 8px 6px 16px;
  text-decoration: none;
  font-size: 25px;
  color: #818181;
  display: block;
  margin: 25px;
}

.sidenav a:hover {
  color: #000;
}

section {
  display: flex;
  flex-direction: column;
  border: 0px solid #fff;
  border-radius: 25px;
  padding: 20px;
  font-family: Avantgarde, TeX Gyre Adventor, URW Gothic L, sans-serif;
  margin: 10px;
  background-color: #f4fce3;
  margin-left: 90px;
  margin-right: 10px;
}

article {
  display: flex;
  flex-direction: column;
  border: 0px solid #fff;
  border-radius: 25px;
  padding: 20px;
  font-family: Avantgarde, TeX Gyre Adventor, URW Gothic L, sans-serif;
  margin: 5px;
}

aside { 
  float:right; 
  font-family: Avantgarde, TeX Gyre Adventor, URW Gothic L, sans-serif;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
  background-color: lightblue;
}
</style>
