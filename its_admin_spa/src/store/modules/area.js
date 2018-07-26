import _areas from "./mockdata/Areas";
import axiosInstance from "../../axiosInstance";
import formatter from "../../formatter";
import _ from 'lodash'

function mockShell(bodyFunc, noFail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (noFail || Math.random() > 0.1) {
        //Success
        let result = bodyFunc();
        resolve(result);
      } else {
        //error
        reject({
          message: 'Có lỗi xẩy ra !'
        })
      }

    }, 1500 + (Math.random() * 1000))
  })
}

export default {
  namespaced: true,
  actions: {
    getAllNoParam(context) {
      return new Promise((resolve, reject) => {
        axiosInstance.get('api/area', {
          params: {
            pageSize: -1
          }
        })
          .then(value => {
            const response = formatter.getAllResponse(value.data);
            resolve(response);
          }).catch(reject)
      })
    },
    getAll(context, payload) {
      return new Promise((resolve, reject) => {
        axiosInstance.get('api/area', {params: formatter.getAllRequest(payload)})
          .then(value => {
            const response = formatter.getAllResponse(value.data);
            resolve(response);
          }).catch(reject)
      });

    },
    getById(context, payload) {
      return mockShell(() => {
        return _areas.find(item => item.id == payload.id);
      }, true)
    },
    create(context, payload) {
      return mockShell(() => {

      })
    },
    update(context, payload) {
      return mockShell(() => {

      })
    },
    delete(context, payload) {
      return mockShell(() => {
        return payload;
      })
    }

  }
}
