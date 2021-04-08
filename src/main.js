// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from '~/layouts/Default.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from '~/store/index.js'
import util from './utils/util'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import 'mavon-editor/dist/markdown/github-markdown.min.css'

export default function (Vue, { router, head, isClient, appOptions }) {
  Vue.use(mavonEditor)

  appOptions.store = store

  Vue.use(ElementUI)

  Vue.prototype.$markdown = function (value) {
    return mavonEditor.markdownIt.render(value)
  }

  Vue.prototype.$setTitle = function (title) {
    if (title) {
      document.title = store.state.configuration.htmlTitle + " - " + title
    } else {
      document.title = store.state.configuration.htmlTitle
    }
  }

  Vue.prototype.$util = util

  Vue.component('Layout', DefaultLayout)
}
