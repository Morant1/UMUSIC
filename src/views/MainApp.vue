<template>
  <main>
    <div
      v-if="this.$route.params.path === 'playlist' && videos"
      class="playlist-header"
    >
      <div class="img-container" style="cursor: pointer">
        <img v-if="img" :src="img" />
      </div>
      <div class="img-edit" :class="isEdit ? 'appear' : 'none'">
        <label for="upload"
          ><i class="upload fas fa-cloud-upload-alt"></i
        ></label>
        <input
          @click="setEditImg"
          id="upload"
          name="img"
          style="display: none"
          value="img"
          type="file"
          @input="setImg($event)"
        />

        <img
          class="loading"
          v-if="closeStatus"
          src="https://media.giphy.com/media/3o7bu3XilJ5BOiSGic/giphy.gif"
        />
      </div>
      <div class="title-container">
        <h4>Your playlist</h4>
        <div class="title">{{ getPlaylistName }}</div>
        <h5 class="data">
          &middot; {{ calcLikedVideos }} Liked videos &middot;
          {{ videos.length }} videos &middot; {{ getDuration }}
        </h5>
      </div>
    </div>
    <div>
      <div class="playlist-header" v-if="this.$route.params.path === 'liked'">
        <div class="img-container">
          <img src="@/assets/img/green.jpg" />
        </div>
        <div class="title-container">
          <h4>Your favorites</h4>
          <div class="title">Liked videos</div>
        </div>
      </div>
    </div>
    <video-filter v-if="!this.$route.params.path" @filtered="setFilter" />
    <video-list
      :videos="videos"
      @play="playVideo"
      @toggle="toggleOption"
      @liked="likedVideo"
    />
    <video-player
      v-if="chosenVideo"
      :video="chosenVideo"
      @clearPlayer="clearPlayer"
    ></video-player>
  </main>
</template>

<script>
import VideoFilter from "@/cmps/VideoFilter.vue";
import VideoList from "@/cmps/VideoList.vue";
import VideoPlayer from "@/cmps/VideoPlayer.vue";
import { videoService } from "@/services/video.service";

export default {
  data() {
    return {
      filterBy: {
        title: "",
      },
      videos: null,
      chosenVideo: null,
      isEdit: false,
      img: null,
      closeStatus: false,
    };
  },
  async created() {
    this.loadVideos();
    this.loadLikes();
    this.loadPlaylist();
    this.loadPlaylistImg();

    this.unwatch = this.$store.watch(
      (state, getters) => getters.videosToShow,
      (newValue, oldValue) => this.routing()
    );
  
  },
  methods: {
    setFilter(filterBy) {
      this.filterBy = filterBy;
      this.loadVideos();
    },
    async loadVideos() {
      await this.$store.dispatch({
        type: "loadVideos",
        filterBy: this.filterBy,
      });
    },
    async loadLikes() {
      await videoService.queryLikes();
    },
    async loadPlaylist() {
      await videoService.queryPlaylist();
    },
    async loadPlaylistImg(imgTarget = "") {
      await this.$store.dispatch({
        type: "playlistImg",
        playlistImg: imgTarget,
      });
      this.getImg();
    },
    playVideo(video) {
      this.chosenVideo = video;
    },
    clearPlayer() {
      this.chosenVideo = null;
    },
    async toggleOption(video) {
      await this.$store.dispatch({ type: "updatePlaylist", video });
    },
    async likedVideo(video) {
      await this.$store.dispatch({ type: "updateLiked", video });
    },
    async routing() {
      if (!this.$route.params.path) this.videos = this.$store.getters.videosToShow;
      if (this.$route.params.path === "playlist") {
       this.videos = await videoService.queryPlaylist();
       this.videos.filter(video => video.isOption);
      }
      if (this.$route.params.path === "liked") {
        this.videos = await videoService.queryLikes();
      this.videos.filter((video) => video.isLiked);
      }
    },
    setEditImg() {
      this.isEdit = !this.isEdit;
    },
    getImg() {
      this.img = this.$store.getters.getImg;
    },
    async setImg(ev) {
      this.closeStatus = true;
      await this.loadPlaylistImg(ev.target);
      this.closeStatus = false;
      this.setEditImg();
    },
  },
  computed: {
    getPlaylistName() {
      return this.$store.getters.getPlaylistName;
    },
    calcLikedVideos() {
      const liked = this.videos.filter((video) => video.isLiked);
      // const playlist = this.videos.filter(video=>video.isOption)
      return liked.length;
    },
    getDuration() {
      const durations = this.videos.map((video) =>
        videoService.calcVideoDuration(video.videoData.contentDetails.duration)
      );
      const formatDuration = durations.reduce((acc, curr) => acc + curr, 0);

      return new Date(Math.floor(formatDuration) * 1000)
        .toISOString()
        .substr(14, 5);
    },
  },
  watch: {
    "$route.params.path"() {
      this.routing();
    },
  },
  components: {
    VideoFilter,
    VideoList,
    VideoPlayer,
  },
};
</script>
