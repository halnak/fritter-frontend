<!-- Form for getting freets (all, from user) (inline style) -->

<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
  name: 'GetCirclesForm',
  mixins: [InlineForm],
  data() {
    return {value: this.$store.state.circleFilter};
  },
  methods: {
    async submit() {
      const url = this.value ? `/api/circles?member=${this.value}` : '/api/circles';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit('updateCircleFilter', this.value);
        this.$store.commit('updateCircles', res);
      } catch (e) {
        if (this.value === this.$store.state.circleFilter) {
          // This section triggers if you filter to a user but they
          // change their username when you refresh
          this.$store.commit('updateCircleFilter', null);
          this.value = ''; // Clear filter to show all circles
          this.$store.commit('refreshCircles');
        } else {
          // Otherwise reset to previous fitler
          this.value = this.$store.state.circleFilter;
        }

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
