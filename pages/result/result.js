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
  onClick(e) {
    console.log(e)
    const {
      index
    } = e.detail

    index === 0 && wx.showModal({
      title: 'Thank you for your support!',
      showCancel: !1,
    })

    index === 1 && wx.navigateBack()
  },
})