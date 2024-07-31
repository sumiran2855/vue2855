// src/store/index.js
import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    token: localStorage.getItem('access_token') || '',
    user: null
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      localStorage.setItem('access_token', token)
    },
    setUser(state, user) {
      state.user = user
    },
    clearAuthData(state) {
      state.token = ''
      state.user = null
      localStorage.removeItem('access_token')
    }
  },
  actions: {
    async login({ commit }, authData) {
      try {
        const response = await axios.post('http://localhost:3000/auth/login', authData)
        commit('setToken', response.data.token)
        const userResponse = await axios.get('http://localhost:3000/user/profile', {
          headers: { Authorization: `Bearer ${response.data.token}` }
        })
        commit('setUser', userResponse.data)
      } catch (error) {
        console.error('Error logging in:', error.response?.data?.message || error.message)
      }
    },
    async logout({ commit }) {
      commit('clearAuthData')
    },
    async fetchUser({ commit }) {
      try {
        const token = localStorage.getItem('access_token')
        if (!token) return
        const response = await axios.get('http://localhost:3000/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        commit('setUser', response.data)
      } catch (error) {
        console.error('Error fetching user:', error.response?.data?.message || error.message)
        commit('clearAuthData')
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    userRole: state => (state.user ? state.user.role : null)
  }
})
