$(function() {
  getUserInfo()

  // 点击按钮，实现退出功能
  $('#btnLogout').on('click', function() {
    // 提示用户是否确认退出
    layer.confirm('确定退出登录', {icon: 3, title:'提示'}, function(index){
      //do something
      // 1、清空本地存储的token
      localStorage.removeItem('token')
      // 2、重新跳转回到登录页面
      location.href = './login.html';

      // 关闭confirm询问框
      layer.close(index);
    });
  })
})

// 获取用户的基本信息
function getUserInfo() {
  $.ajax({
    url: '/my/userinfo',
    type: 'GET',
    // headers 就是请求头配置对象
    headers: {
      Authorization: localStorage.getItem('token') || ''
    },
    success: function(res) {
      if(res.status !== 0) {
        return layui.layer.msg("获取用户信息失败!!")
      }
      // console.log(res);

      // 调用 renderAvatar 渲染用户的头像
      renderAvatar(res.data);
    },

    // 不论成功还是失败，最终都会调用 complete 回调函数
    complete: function(res) {
      console.log("执行了 complete 回调", res);

      // 在complete回调函数总，可以使用 res.responseJSON拿到服务器响应的数据
      if(res.responseJSON.status === 1) {
        // 1、强制清空 token
        localStorage.removeItem('token')
        // 2、强制跳转到登录页面
        location.href = '/login.html'
      }
    } 
  })
}

// 渲染用户头像
function renderAvatar(res) {
  // 1、获取用户名称
  var name = res.nickname || res.username;
  $('#welcome').html("欢迎" + name);

  // 按需渲染用户的头像
  if(res.user_pic !== null) {
    // 渲染图片头像
    $('.layui-nav-img').attr('src', res.user_pic).show();
    $('.text-avatar').hide()
  } else {
    // 渲染文字图像
    $('.layui-nav-img').hide();
    $('.text-avatar').html(name[0].toUpperCase()).show();
  }
}
