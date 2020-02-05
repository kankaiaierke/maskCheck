//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgList:[],
    isValve:false,
    showType:1,
    formData:{},
    //表单数据数组
    askData:[
      {
        id:'1',
        title:'口罩有无异味',
        options:{
          'A': '没有',
          'B': '有一点',
          'C': '比较重的异味',
        },
        example_pic:[

        ],
      },
      {
        id: '2',
        title: '口罩标准是否清晰',
        options: {
          'A': '很清晰',
          'B': '较清晰',
          'C': '有一些模糊',
        },
        example_pic:['https://hd2-health-out.oss-cn-shanghai-finance-1-pub.aliyuncs.com/guohua/2020-02-05/999de7071638381e164283397cc820e3.jpg'],
      },
    ],
  },
  onLoad: function () {
    //测试数据
    this.setData({
      formData: {
        '1': 'A',
        '2': 'A',
      },
      askData: [
        {
          id: '1',
          title: '口罩有无异味',
          options: {
            'A': '没有',
            'B': '有一点',
            'C': '比较重的异味',
          },
          example_pic: [

          ],
        },
        {
          id: '2',
          title: '口罩标准是否清晰',
          options: {
            'A': '很清晰',
            'B': '较清晰',
            'C': '有一些模糊',
          },
          example_pic: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1580892444369&di=9f555b6636ef876c64275359ef12e452&imgtype=0&src=http%3A%2F%2Fimg31.ddimg.cn%2F19%2F3%2F1117056421-1_w.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1580892444368&di=9bf529f2b6345c613c52b11eeef39095&imgtype=0&src=http%3A%2F%2Fpic3.zhimg.com%2F50%2Fv2-b367acd66a4dff8479cf2ff84616acf5_hd.jpg'],
        },
      ],
    })
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
    var showType = e.currentTarget.dataset.index;
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
  //提交
  onSubmit(){
    console.log(this.data.formData);
  },
  //预览
  onPreview(e) {
    console.log(e.detail);
    var list = this.data.askData[e.currentTarget.dataset.index].example_pic;
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: list,
    })
  },
})
