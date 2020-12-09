<template>
  <div class="navbar">
      <div class="main-logo">
     <h1>UMUSIC</h1>
     <i class="logo fas fa-drum"></i>
     </div>
    <hr style="width: 100%; margin-bottom: 20px" />
    <ul>
      <li>
        <router-link
          :class="$route.fullPath === '/' ? 'router-link-active' : 'noActive'"
          to="/"
          ><i class="icon fas fa-home"></i> Home</router-link
        >
      </li>
      <li class="input" v-if="isEdit">
        <input
         maxlength="20"
          @input="setName"
          ref="nameInput"
          class="nameInput"
          @blur.stop="setEdit"
          type="text"
          v-model="name"
          value="name"
          placeholder="insert name"
        />
      </li>

      <li v-if="!isEdit" class="playlist">
          <i @click.stop="setEdit" class="edit fas fa-edit"></i>
        <router-link
          to="/playlist"
          :class="
            $route.fullPath === '/playlist' ? 'router-link-active' : 'noActive'
          "
          ><i class="icon fab fa-playstation"></i> {{ getName }}
        </router-link>
      </li>

      <li>
        <router-link
          to="/liked"
          :class="
            $route.fullPath === '/liked' ? 'router-link-active' : 'noActive'
          "
          ><i class="heart fas fa-heart"></i> Liked videos
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { videoService } from "@/services/video.service";
export default {
  data() {
    return {
      isChange: false,
      isEdit: false,
      name: null,
    };
  },
  created() {
    this.name = videoService.loadName();
    this.setName();
  },
  methods: {
    setEdit() {
      this.isEdit = !this.isEdit;
      if (this.isEdit) {
        this.$nextTick(function () {
          this.$refs.nameInput.focus();
        });
        this.setChange();
      }
    },
    setChange() {
      this.isChange = !this.isChange;
    },
    async setName() {
      await this.$store.dispatch({ type: "playlistName", playlistName: this.name });
      this.name = this.$store.getters.getPlaylistName;
    }
  },
  computed: {
    getName() {
      if (this.name.length > 16){
          const name =  this.name.slice(0 , 16) + "...";
          return name;
      }
      else return this.name;
    },
  },
};
</script>

