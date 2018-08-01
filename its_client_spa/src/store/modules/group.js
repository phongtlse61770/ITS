import {axiosInstance} from "../../common/util";
import _ from "lodash";

export default {
  namespaced: true,
  state: {
    myGroups: [],
    detailedGroup: {},
    loading: {
      myGroup: true,
      detailedGroup: true,
      create: false,
      delete: false
    }
  },
  getters: {
    myGroups(state) {
      return state.myGroups;
    },
    myGroupsLoading(state) {
      return state.loading.myGroups;
    },
    createLoading(state){
      return state.loading.create;
    }
  },
  mutations: {
    setMyGroup(state, payload) {
      state.myGroups = payload.groups;
    },
    setLoading(state, payload) {
      state.loading = _.assign(state.loading, payload.loading);
    }
  },
  actions: {
    fetchMyGroups(context) {
      context.commit('setLoading', {
        loading: {myGroup: true}
      });
      return new Promise((resolve, reject) => {
        axiosInstance.get('api/GetGroups')
          .then(value => {
            context.commit('setMyGroup', {groups: value.data});
            context.commit('setLoading', {
              loading: {myGroup: false}
            });
            resolve(value.data);
          })
          .catch(reason => {
            context.commit('setLoading', {
              loading: {myGroup: false}
            });
            reject(reason.response);
          })
      });
    },
    fetchById(context, payload) {
      const {
        id
      } = payload;

      context.commit('setLoading', {
        loading: {detailedGroup: true}
      });


    },
    create(context, payload) {
      const {
        name
      } = payload;

      context.commit('setLoading', {
        loading: {create: true}
      });

      return new Promise((resolve, reject) => {
        axiosInstance.post('api/group', {
          name
        })
          .then(value => {
            context.commit('setLoading', {
              loading: {create: false}
            });
            resolve(value.data);
          })
          .catch(reason => {
            context.commit('setLoading', {
              loading: {create: false}
            });
            reject(reason.response);
          })
      })
    },
    delete(context, payload) {
      const {
        id
      } = payload;
      context.commit('setLoading', {
        loading: {delete: true}
      });
      return new Promise((resolve, reject) => {
        axiosInstance.delete('api/group', {
          params:{
            id
          }
        })
          .then(value => {
            context.commit('setLoading', {
              loading: {delete: false}
            });
            resolve(value.data);
          })
          .catch(reason => {
            context.commit('setLoading', {
              loading: {delete: false}
            });
            reject(reason.response);
          })
      })
    }
  }
}
