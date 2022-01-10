// 每次调用 $.get() 或 $.post() 或 $.ajax() 的时候
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  // console.log(options.url);
  // 在发起真正的ajax 请求之前，统一拼接
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url
  
  // 统一为有权限的接口，设置 headers 请求头
  if(options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }
  
  // console.log(options.url)

  // 全局统一挂载 complete 回调函数
  options.complete = function(res) {
    if(res.responseJSON.status === 1) {
      // 1、强制清空 token
      localStorage.removeItem('token')
      // 2、强制跳转到登录页面
      location.href = '/login.html';
    }
  }
})