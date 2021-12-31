$(function() {
  // 点击“注册账号” 的链接
  $("#link_reg").on('click', function() {
    $(".login-box").hide();
    $(".reg-box").show();
  })

  // 点击"登录" 的链接
  $("#link_login").on('click', function() {
    $('.login-box').show();
    $('.reg-box').hide();
  })

  // 重layui 中获取 form 对象
  var form = layui.form;
  // layui 显示层
  var layer = layui.layer;
  form.verify({
    username: function(value, item){ //value：表单的值、item：表单的DOM对象
      if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
        return '用户名不能有特殊字符';
      }
      if(/(^\_)|(\__)|(\_+$)/.test(value)){
        return '用户名首尾不能出现下划线\'_\'';
      }
      if(/^\d+\d+\d$/.test(value)){
        return '用户名不能全为数字';
      }
      
      //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
      if(value === 'xxx'){
        alert('用户名不能为敏感词');
        return true;
      }
    },
    // 自定义了一个叫做 pwd 校验规则
    pwd: [
      /^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ],
    // 校验两次密码是否一致的规则
    repwd: function(value) {
      // 通过形参拿到的式确定密码框中的内容
      // 还需要拿到密码框中的内容
      // 然后进行一次等于的判断
      // 如果判断失败，者retrun一个提示消息即可
      var pwd = $('.reg-box [name=password]').val()
      if(pwd !== value) {
        return '两次密码不一致'
      }
    }
  })
  
  // 监听注册表单的提交事件
  $('#form-res').on('submit', function(e) {
    // afsdf
    e.preventDefault();
    $.ajax({
      url: "/api/reguser",
      type: 'post',
      data: {
        username: $('#form-res [name=username]').val(),
        password: $('#form-res [name=password]').val()
      },
      success: function(res) {
        if(res.status !== 0) {
          return layer.msg(res.message);
        }
        // 触发点击事件
        $('#link_login').click();
        layer.msg("注册成功");
      }
    })
  })
  
  // 监听登录事件
  $("#form_login").on('submit', function(e) {
    // 阻止默认提交行为
    e.preventDefault();
    $.ajax({
      url: '/api/login',
      type: 'post',
      data: $(this).serialize(),
      success: function(res) {
        if(res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg("登录成功!!!");
        // console.log(res.token);

        // 将登录成功得到的 token 字符串,保存到localStorage 中
        localStorage.setItem('token', res.token);

        // 跳转登录后台主页
        location.href = '/index.html'
      } 
    })
  })

})