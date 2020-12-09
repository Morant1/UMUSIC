<template>
  <div class="video-preview" v-if="video">
    <i v-if="video.isOption" class="playlist fab fa-playstation"></i>
    <img
      class="img"
      :src="video.snippet.thumbnails.medium.url"
      alt="img_video"
    />
    <div class="time">
      <i class="far fa-clock"></i>
      {{ getDuration }}
    </div>
    <h1>{{ getTitle }}</h1>
    <i class="drum fas fa-drum"></i>
    <div class="info">
      <div class="sub_info1">
        <h4>{{ video.channelData.snippet.title }}</h4>
        <img :src="video.channelData.snippet.thumbnails.default.url" />
      </div>
      <div class="sub_info2">
        <i class="eye fas fa-eye"></i
        >{{
          new Intl.NumberFormat().format(video.channelData.statistics.viewCount)
        }}
      </div>
    </div>
  </div>
</template>


<script>
import { videoService } from "@/services/video.service";

export default {
  props: ["video"],
  computed: {
    getTitle() {
      const video = this.video.snippet;
      if (video.title.length > 80) return video.title.slice(0, 81) + "...";
      else return video.title;
    },
    getDuration() {
      const duration = this.video.videoData.contentDetails.duration;
      if (duration) {
        const formatDuration = videoService.calcVideoDuration(duration);
        return new Date(formatDuration * 1000).toISOString().substr(14, 5);
      }
    },
  },
};
</script>





