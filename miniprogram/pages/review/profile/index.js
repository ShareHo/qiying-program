// pages/review/profile/index.js
import Toast from '@vant/weapp/toast/toast';
const fs = wx.getFileSystemManager();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    nickname: '',
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({ avatarUrl });
  },

  async handleSave(e) {
    const eventChannel = this.getOpenerEventChannel();
    const { avatarUrl } = this.data;
    const nickname = e.detail.value.nickname;
    const params = {
      avatarUrl,
      nickname,
    };
    Toast.loading({
      message: '正在保存...',
      forbidClick: true,
      duration: 0,
    });
    try {
      const { result: res } = await wx.cloud.callFunction({
        name: 'review',
        data: {
          $url: 'setUser',
          ...params,
          avatarUrl: !avatarUrl.startsWith('cloud://')
            ? wx.cloud.CDN(fs.readFileSync(avatarUrl))
            : avatarUrl,
        },
      });
      if (res.code === 0) {
        Toast.success({
          message: '保存成功',
          onClose() {
            wx.navigateBack();
          },
        });
        eventChannel.emit('setUser', { nickname, avatarUrl: res.data });
      } else {
        Toast.fail(res.msg);
      }
    } catch (e) {
      console.log(e);
      Toast.fail('保存失败');
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const eventChannel = this.getOpenerEventChannel();
    // eventChannel.emit('acceptDataFromOpenedPage', { data: 'test' });
    // eventChannel.emit('someEvent', { data: 'test' });
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('setUser', (data) => {
      this.setData(data);
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
