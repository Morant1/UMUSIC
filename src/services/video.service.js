'use strict';
import axios from 'axios';
import { DbService } from './db-service.js';
import {Utils} from './utils.service'


const KEY = 'videos';
const KEY_PLAYLIST_NAME = 'playlist_name'
const KEY_LIKES = 'likes'
const KEY_PLAYLIST = 'playlist'
const API_KEY = 'AIzaSyD9Jat7qI6js43F8IRTyphj9MkqZwV-Lo0'
const gAmount = 10;
let gLikedvideos = Utils.loadFromStorage(KEY_LIKES) || [];
let gPlaylist = Utils.loadFromStorage(KEY_PLAYLIST) || [];



export const videoService = {
  query,
  updatePlaylist,
  updateLiked,
  setPlaylistName,
  loadName,
  calcVideoDuration,
  queryLikes,
  queryPlaylist
}



function queryLikes() {
  return Promise.resolve(gLikedvideos);
}

function queryPlaylist() {
  return Promise.resolve(gPlaylist);
}

async function _queryByChannel(id){
  const channelData = await axios.get(`https://www.googleapis.com/youtube/v3/channels?id=${id}&part=topicDetails&part=snippet&part=statistics&key=${API_KEY}`);
  return channelData.data.items[0];
}

async function _queryByVideo(id){
  const channelData = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${id}&part=contentDetails&key=${API_KEY}`);
  return channelData.data.items[0];
}


async function query(searchVal='') {
  // var videos = await DbService.query(KEY);
  // if (!videos || !videos.length) {
    const items = await axios.get(`https://www.googleapis.com/youtube/v3/search?maxResults=${gAmount}&part=snippet&videoEmbeddable=true&type=video&key=${API_KEY}&q=${searchVal}`)
    var videos = await Promise.all(items.data.items.map(async item => {
      const channelData = await _queryByChannel(item.snippet.channelId);
      item.channelData = channelData;

      const videoData = await _queryByVideo(item.id.videoId);
      item.videoData = videoData;

      return item;
    }))

    videos.forEach(video=>{
      gLikedvideos.forEach(like => {
        if (video.id.videoId === like.id.videoId) video.isLiked = true;
      })
      gPlaylist.forEach(playlist => {
        if (video.id.videoId === playlist.id.videoId) video.isOption = true;
      })
    })
    // await DbService.insert(KEY, videos);
  // }
  return videos;
}

async function updatePlaylist(video) {
  const videoCopy = {...video};
  videoCopy.isOption = !videoCopy.isOption;
  if (videoCopy.isOption) {
    gPlaylist.push(videoCopy);
  } else {
    const idx = gPlaylist.findIndex(video => videoCopy.id.videoId === video.id.videoId);
    gPlaylist.splice(idx,1);
  }
  Utils.storeToStorage(KEY_PLAYLIST,gPlaylist);
  return videoCopy;
}

async function updateLiked(video) {
  const videoCopy = {...video};
  videoCopy.isLiked = !videoCopy.isLiked;
  if (videoCopy.isLiked) {
    gLikedvideos.push(videoCopy);
  } else {
    const idx = gLikedvideos.findIndex(video => videoCopy.id.videoId === video.id.videoId);
    gLikedvideos.splice(idx,1);
  }
  Utils.storeToStorage(KEY_LIKES,gLikedvideos);
  return videoCopy;
}

function setPlaylistName(name) {
  Utils.storeToStorage(KEY_PLAYLIST_NAME,name);
}

function loadName(){
  let name = Utils.loadFromStorage(KEY_PLAYLIST_NAME);
  if (!name) name = 'Playlist';
  return name;
}

function calcVideoDuration(duration) {
  var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
  var hours = 0,
    minutes = 0,
    seconds = 0,
    totalseconds;

  if (reptms.test(duration)) {
    var matches = reptms.exec(duration);
    if (matches[1]) hours = Number(matches[1]);
    if (matches[2]) minutes = Number(matches[2]);
    if (matches[3]) seconds = Number(matches[3]);
     totalseconds = hours * 3600  + minutes * 60 + seconds;

    return totalseconds;
  } else {
    return null;
  }
}
