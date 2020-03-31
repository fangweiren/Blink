// components/search/index.js
import {
  KeywordModel
} from '../../models/keyword.js'

import {
  BookModel
} from '../../models/book.js'

import {
  paginationBev
} from '../behaviors/pagination.js'
const keywordModel = new KeywordModel()
const bookModel = new BookModel()

Component({
  /**
   * 组件的属性列表
   */
  behaviors: [paginationBev],
  properties: {
    more: {
      type: String,
      observer: '_load_more'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    historyWords: [],
    hotWords: [],
    searching: false,
    q: "",
    loading: false
  },

  attached() {
    this.setData({
      historyWords: keywordModel.getHistory()
    })

    keywordModel.getHot().then(res => {
      this.setData({
        hotWords: res.hot
      })
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _load_more() {
      console.log(1233444)
      if (!this.data.q) {
        return
      }
      if (this.data.loading) {
        return
      }
      // const length = this.data.dataArray.length
      if (this.hasMore()) {
        this.data.loading = true // 没有绑定wxml中的数据时可以这么写
        bookModel.search(this.getCurrentStart(), this.data.q).then(res => {
          this.setMoreData(res.books)
          this.data.loading = false
        })
      }
    },

    onCancel(event) {
      this.triggerEvent('cancel', {}, {})
    },

    onDelete(event) {
      this.setData({
        searching: false
      })
    },

    onConfirm(event) {
      this.setData({
        searching: true
      })
      this.initialize()
      const q = event.detail.value || event.detail.text
      bookModel.search(0, q).then(res => {
        this.setMoreData(res.books)
        this.setTotal(res.total)
        this.setData({
          q: q
        })
        keywordModel.addToHistory(q)
      })
    }
  }
})