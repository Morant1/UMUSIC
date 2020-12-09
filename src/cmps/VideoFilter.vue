<template>
  <div class="filter-container" id="content">
    <input
      id="search-input"
      class="square"
      type="text"
      placeholder="Search for a song..."
      v-model="filterBy.title"
      @input="emitFilter"
    />

    <i class="fas fa-search"></i>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filterBy: {
        title: "",
      },
    };
  },
  methods: {
    emitFilter() {
      this.$emit("filtered", { ...this.filterBy });
    },
  },
};
</script>

