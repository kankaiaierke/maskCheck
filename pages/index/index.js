//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgList: [],
    isValve: false,
    showType: 1,
    visible: false,
  },
  onLoad: function () {

  },
  handleClose() {
    this.setData({
      visible: false
    })
  },
  handleOpen() {
    this.setData({
      visible: true
    })
  },
  handleChangeType(e) {
    this.setData({
      isValve: e.detail.value
    })
  },
  handleUpload() {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        let tempFilePaths = res.tempFilePaths; // 返回选定照片的本地路径列表 
        that.upload(that, tempFilePaths);
      }
    })
  },
  upload(page, path) { // 上传图片
  console.log(path)
    wx.showToast({ icon: "loading", title: "上传图片……" });
    wx.uploadFile({
      url: 'https://recognitionapi.yuanjy.com/v1/index/recognition-img', //后端接口
      filePath: path[0],
      name: 'image',
      formData: {
        image_type: this.data.isValve?'valve':'print'
      },
      header: {
        "Content-Type": "multipart/form-data"
      },
      success(res) {
        if (res.statusCode != 200) {
          wx.showModal({ title: '提示', content: '上传失败，请重新上传', showCancel: false });
          return;
        } else {
          let data=JSON.parse(res.data)
          let resultCode=data.data
          console.log(data)
          wx.navigateTo({
            url: `../result/result?resultCode=${resultCode}&from=image`,
          })
        }
      },
      fail(e) {
        wx.showModal({ title: '提示', content: '上传失败，请重新上传', showCancel: false });
      },
      complete() {
        wx.hideToast(); //隐藏Toast
      }
    })
  },
  showTypeChange(e) {
    this.setData({
      showType: e.currentTarget.dataset.index
    })
  },
})
