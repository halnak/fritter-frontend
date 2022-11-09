<!-- Reusable component representing a single circle and its actions -->

<template>
  <article
    class="circle"
  >
    <header>
      <h3 class="owner">
        Owner: @{{ circle.owner }}
      </h3>
      <h3 class="name">
      <textarea
        v-if="editing"
        class="name"
        :value="draft"
        @input="draft = $event.target.value"
      />
      <p
        v-else
        class="name"
      >
        {{ circle.name }}
      </p>
      </h3>
      <div
        v-if="$store.state.username === circle.owner"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deleteCircle">
          🗑️ Delete
        </button>
      </div>
      <textarea
        v-if="editing"
        class="members"
        :value="member"
        @input="member = $event.target.value"
      />
        <button @click="addMember">
          Add Member
        </button>
        <button @click="removeMember">
          Remove Member
        </button>
    </header>
    <p class="members">
      Members:
      <li v-for="member in circle.members">
        {{ member }}
      </li>
    </p>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
export default {
  name: 'CircleComponent',
  props: {
    // Data from the stored circle
    circle: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not the circle membership is being edited
      adding: false, // If editing, whether a member is being added or removed from the circle
      alerts: {}, // Displays success/error messages encountered during circle modification
      member: null, // the member to add or remove, if applicable 
      temp: null, //placeholder for extra use
    };
  },
  methods: {
    addMember() {
      /**
       * Enables edit mode on this circle.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.adding = true; // Keeps track of whether a member is being added or removed while in edit mode
      this.member = member;
    },
    removeMember() {
      /**
       * Enables edit mode on this circle.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.adding = false; // Keeps track of whether a member is being added or removed while in edit mode
      this.member = member;
    },
    stopEditing() {
      /**
       * Disables edit mode on this circle.
       */
      this.editing = false;
      this.adding = false;
    },
    deleteCircle() {
      /**
       * Deletes this circle.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted circle!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates circle to have the new membership. 
       */
      const params = {
        method: 'PUT',
        message: 'Successfully edited circle!',
        body: JSON.stringify({id: $store.state.username, member: this.member}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    getUsername(id) {
      /**
       * Gets the username of a user form their ID
       */
       this.temp = id;
      const params = {
        method: 'GET',
        message: 'Successfully retrieved username!',
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      return this.userRequest(params);
    },
    async request(params) {
      /**
       * Submits a request to the circle's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/circles/${this.circle._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshCircles');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async userRequest(params) {
      /**
       * Submits a request to the user's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/users/${this.temp}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
      this.temp = await res.username;
    }
  }
};
</script>

<style scoped>
.circle {
    position: relative;
    border: 1px solid #fff;
    border-radius: 25px;
    padding: 0.25%;
    background-color: #d8f5a2;
}
</style>
