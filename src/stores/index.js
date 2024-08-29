import { createStore } from 'vuex'

const store = createStore({
  state: {
    organisationId: null,
  },
  mutations: {
    setOrganisationId(state, id) {
      state.organisationId = id
    }
  },
  actions: {
    setOrganisationId({ commit }, id) {
      commit('setOrganisationId', id)
    }
  },
  getters: {
    organisationId: (state) => state.organisationId
  }
})

export default store
