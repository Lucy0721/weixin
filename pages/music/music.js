Page({

  /**
   * 页面的初始数据
   */
  data: {
    //设置歌单
    music_list: [
      {
        name: "There For You",
        length: 221
      },
      {
        name: "不能说的秘密",
        length: 278
      },
      {
        name: "红色高跟鞋",
        length: 206
      },
      {
        name: "第三人称",
        length: 278
      }, {
        name: "恋爱循环",
        length: 253
      },
      {
        name: "倾尽天下",
        length: 265
      },
      {
        name: "传邮万里",
        length: 231
      },
      {
        name: "石楠小札",
        length: 252
      },
      {
        name: "是风动",
        length: 288
      },
      {
        name: "学习使我快乐",
        length: 66
      },
      {
        name: "小半",
        length: 297
      },
      {
        name: "烟火里的尘埃",
        length: 321
      },
      {
        name: "大鱼",
        length: 313
      },
      {
        name: "追光者",
        length: 235
      }
    ],
    play: "http://www.icontuku.com/png/eldorado_player/038.png",
    next: "http://www.icontuku.com/png/eldorado_player/046.png",
    previous: "http://www.icontuku.com/png/eldorado_player/045.png",
    playId: 0,
    //0:pause,1:play
    playButtonStatus: 0,   //标记播放状态
    playPrecent: 0,  //用于调整进度条
    canPlay: false,
    vol: 20  //初始音量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // wx.showToast({
    //   title: 'onShow',
    //   duration:500
    // })
    this.autoPlus()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //调整进度条
  autoPlus: function () {
    if (this.data.playButtonStatus == 1 && this.data.canPlay) {
      if (this.data.playPrecent < this.data.music_list[this.data.playId].length) {
        var interval = 100 / this.data.music_list[this.data.playId].length;
        this.setData({
          playPrecent: this.data.playPrecent + interval
        })
      }
      else {
        this.setData({
          playPrecent: 0
        })
        this.NextMusic()
      }
    }
    setTimeout(this.autoPlus, 1000)
  },
  //向Onenet平台发送数据
  sendRequest: function (obj) {
    wx.request(obj);
  },
  makeObj: function (i, sta, pre, msg) {
    var obj = {
      url: "http://api.heclouds.com/devices/503139172/datapoints?type=3",
      header: {
        "api-key": "ZA0V=3BEajfyhX59diDNA=qHSfs=",
        "Content-Type": "application/json"
      },
      method: "post",
      data: {
        //music id,playing status,playing precent
        "id": i,
        "status": sta,
        "vol": this.data.vol
        //"precent":pre
      },
      success: function (res) {
        if (msg != "") {
          wx.showToast({
            title: msg,
            duration: 1000
          })
          //console.log(i);
        }
      }
    }
    return obj;
  },
  //点击按钮时触发的函数
  chooseMusic: function (event) {
    var temp = 0;
    //Get Choosed Music id
    var musicName = event.currentTarget.dataset.id
    for (var i = 0; i < this.data.music_list.length; i++) {
      if (musicName == this.data.music_list[i].name) {
        temp = i;
        this.sendRequest(this.makeObj(i, 1, 0, "成功播放~"))
      }
    }
    this.setData({
      playPrecent: 0,
      playId: temp,
      canPlay: true,
      playingMusic: this.data.music_list[this.data.playId],
      play: "http://www.icontuku.com/png/eldorado_player/035.png",
      playButtonStatus: 1
    })
    var sta = this.data.playButtonStatus
    this.sendRequest(this.makeObj(this.data.playId, sta, 0, ""))
    // this.ProgressPlus()
  },
  //播放前一首歌
  PreviousMusic: function () {
    var currentId = this.data.playId;
    var finalId = 0;
    if (currentId >= 1) {
      finalId = currentId - 1
      var musicName = this.data.music_list[this.data.playId - 1].name
    }
    else {
      finalId = this.data.music_list.length - 1
      var musicName = this.data.music_list[this.data.music_list.length - 1].name
    }
    this.sendRequest(this.makeObj(finalId, 1, 0, musicName))
    this.setData({
      playId: finalId,
      playPrecent: 0,
      playingMusic: this.data.music_list[this.data.playId]
    })
  },
  //播放后一首歌
  NextMusic: function () {
    var currentId = this.data.playId;
    var finalId = 0;
    //当前歌曲为
    if (currentId < this.data.music_list.length - 1) {
      finalId = currentId + 1;
      var musicName = this.data.music_list[this.data.playId + 1].name
    }
    else {
      finalId = 0;
      var musicName = this.data.music_list[0].name
    }
    this.sendRequest(this.makeObj(finalId, 1, 0, musicName))
    this.setData({
      playId: finalId,
      playPrecent: 0,
      playingMusic: this.data.music_list[this.data.playId]
    })
    //this.ProgressPlus()
    //console.log(this.data.playId);
  },
  PlayOrPause: function () {
    var pre = this.data.playPrecent
    //如果先前暂停 则改为播放
    if (this.data.playButtonStatus == 0) {
      this.data.playButtonStatus = 1;
      if (!this.data.canPlay) {
        this.setData({
          canPlay: true
        })
      }
      this.setData({
        play: "http://www.icontuku.com/png/eldorado_player/038.png"
      })
    }
    //如果先前播放 则改为暂停
    else {
      this.data.playButtonStatus = 0;
      this.setData({
        play: "http://www.icontuku.com/png/eldorado_player/035.png"
      })

    }
    var sta = this.data.playButtonStatus
    //this.ProgressPlus()
    this.sendRequest(this.makeObj(this.data.playId, sta, pre, ""))

  },
  //I discovey that mcookie doesn't support play at pointed time,so ,,,,the mothod is wroten but no where to use
  dragedProgress: function (e) {
    /*
    this.data.playPrecent = e.detail.value
    var sta=this.data.playButtonStatus
    var pre=this.data.playPrecent
    //this.ProgressPlus()
    this.sendRequest(this.makeObj(this.data.playId, sta, pre, ""))
    
    */
  },
  //改变音量
  vol_change: function (e) {
    this.setData({
      vol: e.detail.value
    });
    var sta = this.data.playButtonStatus;
    var pre = this.data.precent;
    this.sendRequest(this.makeObj(this.data.playId, sta, pre, ""));
  }
})