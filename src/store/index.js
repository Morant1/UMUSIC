import Vue from 'vue'
import Vuex from 'vuex'

import { videoService } from '@/services/video.service.js';
import { cloudinary } from "@/services/cloudinary.service";

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    videos: [],
    playlistName: null,
    playlistImg:null
  },
  mutations: {
    setVideos(state, { videos }) {
      state.videos = videos
    },
    setLikes(state, { likes }) {
      state.likes = likes
    },
    setVideo(state, {updatedVideo}) {
      const idx = state.videos.findIndex(currVideo => currVideo.id.videoId === updatedVideo.id.videoId)
      state.videos.splice(idx, 1, updatedVideo)
    },
    setName(state,{playlistName}){
      state.playlistName = playlistName;
    },
    setImg(state,{imgUrl}){
      state.playlistImg = imgUrl;
    }
  },
  getters: {
    videosToShow(state) {
      return state.videos;
    },
    getPlaylistName(state) {
      return state.playlistName.charAt(0).toUpperCase() + state.playlistName.slice(1);
    },
    getImg(state){
      return state.playlistImg;
    }
  },
  actions: {
    async loadVideos({ commit }, { filterBy }) {
      const videos = await videoService.query(filterBy.title)
      commit({ type: 'setVideos', videos })
    },
    async updatePlaylist({ commit }, { video }) {
      const updatedVideo = await videoService.updatePlaylist(video);
      commit({ type: 'setVideo', updatedVideo })
    },
    async updateLiked({commit}, { video }) {
      const updatedVideo = await videoService.updateLiked(video);
      commit({ type: 'setVideo', updatedVideo })
    },
    playlistName({commit},{playlistName}) {
      videoService.setPlaylistName(playlistName);
      commit({ type: 'setName', playlistName })
    },
    async playlistImg({commit},{playlistImg}){
      const imgUrl = await cloudinary.uploadImg(playlistImg);
      commit({ type: 'setImg', imgUrl })
    }

  }
})
