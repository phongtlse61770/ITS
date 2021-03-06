<template>
  <v-content>
    <v-container class="text-xs-center" v-if="pageLoading">
      <v-progress-circular indeterminate size="40" color="primary"></v-progress-circular>
    </v-container>
    <v-container pa-0 fluid v-else>
      <v-toolbar color="light-blue" dark fixed>
        <v-toolbar-title>
          {{title}}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn flat
                 :style="{opacity: toggle.restaurant ? 1 : 0.5}"
                 @click="toggle.restaurant = !toggle.restaurant">
            <v-icon>
              fas fa-utensils
            </v-icon>
          </v-btn>
          <v-btn flat :style="{opacity: toggle.hotel ? 1 : 0.5}"
                 @click="toggle.hotel = !toggle.hotel">
            <v-icon>
              fas fa-hotel
            </v-icon>
          </v-btn>
          <v-btn flat :style="{opacity: toggle.activity ? 1 : 0.5}"
                 @click="toggle.activity = !toggle.activity">
            <v-icon>
              fas fa-university
            </v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <GmapMap
        ref="mapRef"
        :center="{lat:current.lat, lng:current.lng}"
        :zoom="18"
        :options="{mapTypeControl: false,styles: mapStyles}"
        map-type-id="terrain"
        style="width: 100%; height: 95vh"
      >
        <GMarker v-for="(marker, index) in toggledMarkers" :key="index"
                 v-bind="marker"
                 @click="toggleInfoWindow(marker)"
                 iconWidth="40"
                 iconHeight="40"
        ></GMarker>
        <GMarker :key="current.id"
                 v-bind="current"
                 @click="toggleInfoWindow(current)"
                 iconWidth="40"
                 iconHeight="40"
        ></GMarker>
        <GmapInfoWindow
          :options="infoWindow.options"
          :position="infoWindow.pos"
          :opened="infoWindow.open"
          @closeclick="infoWindow.open = false"
        >
          <v-layout column>
            <LocationCard v-bind="infoWindow.location"/>
            <v-btn flat @click="getDirection(current, infoWindow.pos)" block>
              <v-icon>
                navigation
              </v-icon>
            </v-btn>
          </v-layout>

        </GmapInfoWindow>
      </GmapMap>
    </v-container>
  </v-content>

</template>

<script>
  import {gmapApi} from 'vue2-google-maps'
  import GMarker from "./GMarker";
  import DirectionsRenderer from './DirectionsRenderer.js'
  import LocationCard from "../../common/card/LocationCard";
  import {mapState} from "vuex"
  import _ from "lodash";


  export default {
    name: "LocationOnMapView",
    components: {
      GMarker,
      DirectionsRenderer,
      LocationCard
    },
    data() {
      return {
        locationId: undefined,
        title: undefined,
        current: {id: -1, lat: undefined, lng: undefined, type: 'current', location: {}},
        toggle: {
          activity: true,
          restaurant: true,
          hotel: true,
          service: true
        },
        infoWindow: {
          pos: undefined,
          open: false,
          markerId: undefined,
          location: undefined,
          options: {
            pixelOffset: {
              width: 0,
              height: -35
            }
          }
        },
        renderer: undefined,
        mapStyles: [
          {
            featureType: 'poi.business',
            stylers: [{visibility: 'off'}]
          },
          {
            featureType: 'poi.attraction',
            stylers: [{visibility: 'off'}]

          }
        ]
      }
    },
    computed: {
      google: gmapApi,
      mapRef() {
        return this.$refs.mapRef.$mapPromise;
      },
      toggledMarkers() {
        let toggledMarkers = [];
        if (this.toggle.restaurant) {
          toggledMarkers.push(
            ...this.markers.filter(value => value.type === 'Ăn uống')
          )
        }
        if (this.toggle.activity) {
          toggledMarkers.push(
            ...this.markers.filter(value => value.type === 'Giải trí' || value.type == "Địa điểm thăm quan")
          )
        }
        if (this.toggle.hotel) {
          toggledMarkers.push(
            ...this.markers.filter(value => value.type === 'Nơi ở')
          )
        }
        if (this.toggle.service) {
          toggledMarkers.push(
            ...this.markers.filter(value => {
              return value.type === 'Dịch vụ' || 'Tiền tệ' || 'Trụ sở ban ngành' || "Trạm xăng"

            })
          )
        }
        return toggledMarkers;
      },
      ...mapState('location', {
        pageLoading: state => state.loading.nearbyLocations,
        nearbyLocations: state => state.nearbyLocations
      }),
      markers() {
        // id: 2,
        // lat: 10.8298360,
        // lng: 106.6733590,
        // type: 'restaurant',
        // location: {name: 'restaurant abc', rating: 3.2, id: 1}
        return _(this.nearbyLocations)
          .filter(location => {
            return location.id != this.locationId
          })
          .map(location => {
            return {
              id: location.id,
              lat: location.lat,
              lng: location.long,
              type: location.categories,
              location: location
            }
          })
          .value();
      }
    },
    created() {
      const {
        long,
        lat,
        locationId,
        title,
      } = this.$route.query;

      this.current.lng = Number(long);
      this.current.lat = Number(lat);
      this.locationId = locationId;
      this.title = title;
    },
    mounted() {
      this.$store.dispatch('location/fetchNearbyLocations', {
        long: this.current.lng,
        lat: this.current.lat,
        radius: 10000
      });
      this.renderer = new this.google.maps.DirectionsRenderer();
    },
    methods: {
      moveMapTo(long, lat) {
        this.mapRef.then(map => {
          map.panTo({lat: lat, lng: long})
        })
      },
      setMapToMyLocation() {
        navigator.geolocation.getCurrentPosition((pos) => {
          this.moveMapTo(pos.coords.longitude, pos.coords.latitude)
        }, error => {
          let errMessage = 'Có lỗi xẩy ra';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errMessage = "User denied the request for Geolocation.";
              break;
            case error.POSITION_UNAVAILABLE:
              errMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errMessage = "The request to get user location timed out.";
              break;
          }
        })
      },
      getDirection(from, to) {
        const req = {
          origin: {lat: from.lat, lng: from.lng},
          destination: {lat: to.lat, lng: to.lng},
          travelMode: 'DRIVING'
        };
        const service = new this.google.maps.DirectionsService();
        service.route(req, (result, status) => {
          this.mapRef.then(map => {
            this.renderer.setDirections(result);
            this.renderer.setMap(map);
          });
        })
      },
      toggleInfoWindow(marker) {
        if (!!marker.location && marker.location.id) {
          this.infoWindow.pos = {
            lat: marker.lat,
            lng: marker.lng
          };
          this.infoWindow.location = marker.location;

          if (this.infoWindow.markerId === marker.id) {
            this.infoWindow.open = !this.infoWindow.open;
          }
          else {
            this.infoWindow.open = true;
            this.infoWindow.markerId = marker.id;
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
