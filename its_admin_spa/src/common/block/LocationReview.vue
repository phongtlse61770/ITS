<template>
  <v-layout row pt-3 elevation-1 class="white">
    <v-flex xs3>
      <v-layout column>
        <v-flex d-flex justify-center>
          <v-avatar size="60">
            <img :src="avatar"/>
          </v-avatar>
        </v-flex>
        <v-flex d-flex class="text-xs-center">
          <span>{{creatorName}}</span>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex :class="{xs9: !editMode, xs8: editMode}">
      <v-layout column>
        <v-flex mb-1>
          <v-layout style="align-items: baseline; justify-content: space-between">
            <StarRating :star-size="25"
                        v-model="rating"
                        read-only
                        :show-rating="false"
            />
            <v-btn icon flat color="error"
                   v-if="!editMode"
                   @click="onReport">
              <v-icon>flag</v-icon>
            </v-btn>
          </v-layout>
        </v-flex>
        <v-divider/>
        <v-flex my-1>
            <span class="title font-weight-medium">
              {{title}}
            </span>
        </v-flex>
        <v-flex pa-1>
          <p class="body-1">
            {{description}}
          </p>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex v-if="editMode" class="xs2" style="text-align: center">
      <v-btn icon v-on:click="onDelete">
        <v-icon color="red">
          delete
        </v-icon>
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
  import StarRating from "vue-star-rating";

  export default {
    name: "LocationReview",
    components: {
      StarRating
    },
    props: [
      'id',
      'rating',
      'title',
      'description',
      'creatorName',
      'avatar',
      'editMode'
    ],
    methods: {
      onReport() {
        this.$emit('report', this.id);
      },
      onDelete() {
        this.$emit('delete', this.id);
      }
    }
  }
</script>

<style scoped>

</style>
