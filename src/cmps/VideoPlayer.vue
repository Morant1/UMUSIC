<template>
  <div class="player" :class="{ show: video, noshow: close,'shrink-player':shrinkVideo }" ref="player">
    <div class="icons">
      <i @click.prevent="clearPlayer" class="far fa-times-circle"></i>
      <i @click.prevent="shrink" :class="shrinkVideo ? 'fas fa-expand-alt':'fas fa-compress-alt'"></i>
    </div>
    <h4>{{ video.snippet.title }}</h4>
    <iframe width="100%" height="100%" :src="getUrl"> </iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      close: false,
      shrinkVideo:false
    };
  },
  props: ["video"],
  methods: {
    clearPlayer() {
      this.close = true;
      setTimeout(() => {
        this.$emit("clearPlayer");
      }, 200);
    },
    shrink() {
    this.shrinkVideo = !this.shrinkVideo;
    },
  },
  computed: {
    getUrl() {
      return `https://www.youtube.com/embed/${this.video.id.videoId}`;
    },
  },
};
</script>

