//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgList:[],
    isValve:false,
    showType:1,
    formData:{
      smell: 'A',
      clear: 'A',
      memo: '',
    },
    //表单数据数组
    askData:[
      {
        id:'1',
        title:'口罩有无异味',
        type: 'radio',
        key:'smell',
        options:[
          {
            value:'A',
            name:'没有'
          },
          {
            value: 'B',
            name: '有一点'
          },
          {
            value: 'C',
            name: '比较重的异味'
          },
        ]
      },
      {
        id: '2',
        title: '口罩标准是否清晰',
        type:'radio',
        key: 'clear',
        options: [
          {
            value: 'A',
            name: '很清晰'
          },
          {
            value: 'B',
            name: '较清晰'
          },
          {
            value: 'C',
            name: '有一些模糊'
          },
        ]
      },
      {
        id: '3',
        title: '备注',
        type: 'textarea',
        key: 'memo',
      },
    ],
    smellShow:true,
    clearShow:true,
  },
  onLoad: function () {
    
  },
  handleChangeType(e){
    this.setData({
      isValve: e.detail.value
    })
  },
  handleUpload(){
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        let tempFilePaths = res.tempFilePaths; // 返回选定照片的本地路径列表 
        that.upload(that, tempFilePaths);
      }
    })
  },
  upload(page, path) { // 上传图片
    wx.showToast({ icon: "loading", title: "上传图片……" });
    wx.uploadFile({
      url: '上传图片接口url', //后端接口
      filePath: path[0],
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      success(res) {
        if (res.statusCode != 200) {
          wx.showModal({ title: '提示', content: '上传失败，请重新上传', showCancel: false });
          return;
        } else {
          this.setData({
            imgList:res
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
  showTypeChange(e){
    this.setData({
      showType: e.currentTarget.dataset.index
    })
  },
  onChange(e) {
    const { form, changedValues, allValues } = e.detail
    console.log('onChange \n', changedValues, allValues)
    //表单改变的时候修改数据
    this.setData({
      formData: allValues
    })
  },
  onSuccess(e) {
    console.log('onSuccess', e)
  },
  onSubmit(){
    console.log(this.data.formData);
  },
  onUpdata(e) {
    console.log('onChange', e)
    const { file, fileList } = e.detail
    if (file.status === 'uploading') {
      this.setData({
        progress: 0,
      })
      wx.showLoading()
    } else if (file.status === 'done') {
      this.setData({
        imageUrl: file.url,
      })
    }

    // Controlled state should set fileList
    this.setData({ fileList })
  },
  onFail(e) {
    console.log('onFail', e)
  },
  onComplete(e) {
    console.log('onComplete', e)
    wx.hideLoading()
  },
  onProgress(e) {
    console.log('onProgress', e)
    this.setData({
      progress: e.detail.file.progress,
    })
  },
  onPreview(e) {
    console.log('onPreview', e)
    const { file, fileList } = e.detail
    wx.previewImage({
      current: file.url,
      urls: fileList.map((n) => n.url),
    })
  },
})
