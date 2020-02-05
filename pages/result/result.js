Page({
  data: {
    title:"",
    isSure:true,
    from:'image'
  },
  onLoad: function (options) {
    console.log(options);
    this.setData({
      isSure: options.resultCode === '1' ? true:false,
      from:options.from
    })
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