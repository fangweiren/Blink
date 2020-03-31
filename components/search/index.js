// components/search/index.js
import {
  KeywordModel
} from '../../models/keyword.js'
import {
  BookModel
} from '../../models/book.js'
const keywordModel = new KeywordModel()
const bookModel = new BookModel()

Component({
  /**
   * 组件的属性列表
   */
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
    dataArray: [],
    searching: false,
    q: ""
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
      const length = this.data.dataArray.length
      bookModel.search(length, this.data.q).then(res => {
        const tempArray = this.data.dataArray.concat(res.books)
        this.setData({
          dataArray: tempArray
        })
      })
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
      const q = event.detail.value || event.detail.text
      bookModel.search(0, q).then(res => {
        this.setData({
          dataArray: res.books,
          q: q
        })
        keywordModel.addToHistory(q)
      })
    }
  }
})