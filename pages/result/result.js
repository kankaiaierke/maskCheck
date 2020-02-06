Page({
  data: {
    title:"",
    isSure:true,
    from:'image',
    message:'',
    real_rate:100,
  },
  onLoad: function (options) {
    console.log(options);
    this.setData({
      isSure: options.resultCode === '1' ? true:false,
      from:options.from
    })
    if (options.from == 'question'){
      this.setData({
        real_rate: options.real_rate,
        message: options.message
      })
    }
  },
  toWrite(){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      showType:2
    })
    wx.navigateBack({
      url: '../index/index',
      delta:1
    })
  }
})