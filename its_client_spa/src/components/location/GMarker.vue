<template>
  <GmapMarker
    :clickable="true"
    @click="onClick"
    :position="position"
    :icon="icon"
    >
  </GmapMarker>
</template>

<script>
  import formatter from "../../common/formatter";

  import {gmapApi} from 'vue2-google-maps'

  export default {
    name: "GMarker",

    props: [
      'id',
      'lat',
      'lng',
      'type',
      'categories',
      'info',
      'iconWidth',
      'iconHeight',
    ],
    computed: {
      google: gmapApi,
      position() {
        return this.google && new this.google.maps.LatLng(this.lat, this.lng);
      },
      icon() {
        let url;
        switch (this.type) {
          case "current":
            url = 'static/icons/baseline_place_black_18dp.png';
            break;
          case "user":
            url = 'static/icons/baseline_person_pin_black_18dp.png';
            break;
          case "Ăn uống":
            url = 'static/icons/baseline_local_dining_black_18dp.png';
            break;
          case "Nơi ở":
            url = 'static/icons/baseline_local_hotel_black_18dp.png';
            break;
          default:
            url = 'static/icons/baseline_local_play_black_18dp.png';
            break;

        }
        return {
          size: this.google && new this.google.maps.Size(this.iconWidth, this.iconHeight),
          url
        }
      },
    },
    methods:{
      onClick(){
        this.$emit('click')
      }
    }
  }
</script>

<style scoped>

</style>
