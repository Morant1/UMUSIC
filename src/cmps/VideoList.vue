<template>
  <section class="list" :class="this.$route.params.path? 'margin': ''" v-if="videos && videos.length>0">
    <div class="video" v-for="currVideo in videos" :key="currVideo.id.videoId">
      <i 
        @click="toggleChosenVideo(currVideo)"
        class="info fas fa-ellipsis-h"
      ></i>
      <i v-if="!currVideo.isOption" @click="likedVideo(currVideo)" class="heart fas fa-heart" :class="currVideo.isLiked? 'green':'empty'"></i>
      <div
        v-if="$route.params.path !== 'playlist'"
        :style="isOption(currVideo) !== -1 ? 'display:block;' : 'display:none;'"
        @click="toggle(currVideo)"
        class="add"
      >
        {{ !currVideo.isOption ? "Add to" : "Remove from" }} playlist
      </div>
      <video-preview :video="currVideo" />
      <i @click="playVideo(currVideo)" class="play fas fa-play"></i>
    </div>
  </section>
  <div class="novideos" v-else>No videos yet</div>
</template>

<script>
import VideoPreview from "@/cmps/VideoPreview.vue";
export default {
  props: ["videos"],
  data() {
    return {
      chosenVideos: [],
    };
  },
  methods: {
    playVideo(video) {
      this.$emit("play", video);
    },
    toggleChosenVideo(currVideo) {
      const idx = this.isOption(currVideo);
      idx === -1
        ? this.chosenVideos.push(currVideo)
        : this.chosenVideos.splice(idx, 1);
    },
    toggle(currVideo) {
      this.toggleChosenVideo(currVideo);
      this.$emit("toggle", currVideo);
    },
    isOption(currVideo) {
      const idx = this.chosenVideos.findIndex(
        (video) => video.id.videoId === currVideo.id.videoId
      );
      return idx;
    },
    likedVideo(currVideo){
        this.$emit("liked", currVideo);
    }
  },
  components: {
    VideoPreview,
  },
};
</script>