//index.js
//获取应用实例
const app = getApp()

//弹窗
import { $wuxToast } from '../../dist/index'

Page({
  data: {
    imgList:[],
    isValve:true,
    showType:1,
    answer:{},
    visible: false,
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
    
    var that = this;
    // 加载请求数据
    wx.request({
      url: 'https://recognitionapi.yuanjy.com/v1/index/question-info', //问题
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var data = res.data.data;
        
        var answer = {};
        for (var i = 1; i <= data.length;i++){
          answer[i] = 'A';
        }
        that.setData({
          answer: answer,
          askData: data,
        })
      }
    })
    //测试数据
    
  },
  handleOpen() {
    this.setData({
      visible: true
    })
  },
  handleClose(){
    this.setData({
      visible: false,
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
  onChange(e) {
    const { form, changedValues, allValues } = e.detail
    console.log('onChange \n', changedValues, allValues)
    //表单改变的时候修改数据
    this.setData({
      answer: allValues
    })
  },
  //提交
  onSubmit(){
    console.log(this.data.answer);
    var answer = this.data.answer;
    wx.showToast({ icon: "loading", title: "提交问卷……" });
    wx.request({
      url: 'https://recognitionapi.yuanjy.com/v1/index/recognition-question', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        answer: answer,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode != 200) {
          wx.showModal({ title: '提示', content: '提交出错，请重新提交！', showCancel: false });
          return;
        } else {
          console.log(res.data)
          var resultCode = res.data.code;
          if (resultCode == -1){
            wx.showModal({ title: '提示', content: '提交出错，请重新提交！', showCancel: false });
            return;
          }
          var real_rate = res.data.data.real_rate;
          var message = res.data.data.remark.join(',');
          wx.navigateTo({
            url: `../result/result?resultCode=${resultCode}&from=question&real_rate=${real_rate}&message=${message}`,
          })
        }
      },
      complete() {
        console.log('complete')
        wx.hideToast(); //隐藏Toast
      }
    })
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
  //暂未开放
  showToastCancel() {
    $wuxToast().show({
      type: 'forbidden',
      duration: 1500,
      color: '#fff',
      text: '暂未开放',
      success: () => {

      },
    })
  },
})
