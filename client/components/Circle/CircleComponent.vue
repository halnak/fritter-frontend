<!-- Reusable component representing a single circle and its actions -->

<template>
  <article
    class="circle"
  >
    <header>
      <h3 class="owner">
        @{{ circle.owner }}
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
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p
      v-else
      class="content"
    >
      {{ freet.content }}
    </p>
    <p class="info">
      Posted at {{ freet.dateModified }}
      <i v-if="freet.edited">(edited)</i>
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
      member: null // the member to add or remove, if applicable 
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
  }
};
</script>

<style scoped>
.circle {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
