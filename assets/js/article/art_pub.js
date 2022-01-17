$(function(){
  var layer = layui.layer
  var form = layui.form

  // 定义加载文章分类的方法
  function initCate() {
    $.ajax({
      url: '/my/article/cates',
      method: 'get',
      success: function(res) {
        if(res.status !== 0 ) {
          return layer.msg(res.message)
        }
        // console.log(res.data);
        var htmlStr = template('tpl-cate', res);
        // console.log(htmlStr, $('[name=cate_id]'));
        $('[name=cate_id]').html(htmlStr);
        // 嗲用form.render()方法 重新渲染
        form.render()
      }
    })
  }
  // 调用加载文章分类的方法
  initCate()
  // 初始化富文本编辑器
  initEditor()
  // 初始化图片剪彩器
  var $image = $('#image');
  console.log($image);
  // 裁剪选项
  var options = {
    aspectRatio: 400 / 200,
    preview: '.img-preview'
  }
  // 初始化裁剪区域
  $image.cropper(options)

  // 为选择封面里的按钮，绑定点击事件处理函数
  $("#btnChooseImage").on('click', function() {
    $('#coverFile').click()
  })

  // 监听 coverFile 的 change 事件，获取用户选择的文件列表
  $("#coverFile").on("change", function(e){
    // 获取到文件的列表数据
    var file = e.target.files
    if(file.length === 0) {
      return
    } 
    // 根据文件，创建对应的URL地址
    var newImgURL = URL.createObjectURL(file[0])
    // 为裁剪区重新设置图片
    $image
      .cropper('destroy')     // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options)       // 重新渲染
  })

  // 定义文章的发布状态
  var art_state = '已发布'
  // 为成为草稿按钮绑定点击处理函数
  $('#btnSave2').on('click', function() {
    art_state = '草稿'
  })


  // 为表单绑定 submit 提交事件
  $('#form-pub').on('submit', function(e) {
    // 1、阻止表单的默认提交行为
    e.preventDefault()
    // 基于form表单，快速创建一个 FormData 对象
    var fd = new FormData($(this)[0])
    // 将文章的发布状态存到formdata中
    fd.append('state', art_state)
    // 将封面裁剪后的图片，输出为一个文件对象
    $image.cropper('getCroppedCanvas', {  
      // 创建一个Canvas 画布
      width: 400,
      height: 280
    })
    .toBlob(function(res){
      // 得将画布上的内容，转化为文件对象到文件对象后，进行后续的操作
      fd.append('cover_img', res)
      console.log(res);
      publishArticle(fd);
    })
  })

  // 定义一个发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: 'post',
      url: '/my/article/add',
      data: fd,
      contentType: false,
      processData: false,
      success: function(res) {
        if(res.status !== 0) {
          return layer.msg(res.message)
        }
        console.log(res.data)
        layer.msg('发布文章成功!!!')
        // 发布文章成功后跳转到
        location.href = '/article/art_list.html'
      }
    })
  }
})