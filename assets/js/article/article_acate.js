$(function() {
  var layer = layui.layer;
  var form = layui.form;

  // 获取文章分类的列表
  function initArtCateList() {  
    $.ajax({
      type: 'get',
      url: '/my/article/cates',
      success: function(res) {
        if(res.status !== 0) {
          return layer.msg("获取文章分类失败!!!");
        }
        // console.log(res);
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  initArtCateList();

  // 为类别按钮绑定点击事件
  var index = null;
  $('#btnAddCate').on('click', function() {
    index = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '添加文章分类'
      ,content: $('#dialog-add').html()
    });     
  })

  // 通过事件代理，为form-add表单绑定 submit 事件
  $('body').on('submit', '#form-add', function(e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function(res) {
        if(res.status !== 0) {
          layer.msg(res.message);
        }
        // initArtCateList()
        layer.msg("添加成功!!!");
        // 关闭弹出层
        layer.close(index);
      }
    })
    layer.msg("功能有误!!!");
    console.log($(this).serialize().split('&'));
  })


  // 通过代理的形式，为btn-edit 按钮绑定点击事件
  var indexEdit;
  $('tbody').on('click', '.btn-edit', function() {
    // 弹出修改文章分类
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '编辑文章分类'
      ,content: $('#dialog-edit').html()
    });

    var id = $(this).attr('data-id');
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/'+ id,
      success: function(res) {
        if(res.status !== 0) {
          layer.msg(res.message);
        }
        form.val('form-edit', res.data)
      }
    })
  })

  // 通过代理的形式，为修改分类的表单绑定 submit 事件
  $('body').on('submit', '#form-edit', function(e) {
    // 阻止默认事件
    e.preventDefault();
    $.ajax({
      method: 'post',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function(res) {
        if(res.status !== 0 ) {
          return layer.msg(res.message);
        }
        layer.msg("更新成功!!!");
        layer.close(indexEdit);
        initArtCateList();
      }
    })
  })

  // 通过代理的形式，为删除按钮 click 事件
  $('tbody').on('click', '.btn-delete', function() {
    // console.log('删除!!');
    var id = $(this).attr('data-id');
    // 提示用户是否要删除
    layer.confirm('确认删除', {icon: 3, title:'提示'}, function(index){
      //do something
      $.ajax({
        method: 'get',
        url: '/my/article/deletecate/'+id,
        success: function(res) {
          if(res.status !== 0) {
            return layer.msg(res.message);
          }
          layer.msg("删除分类成功!!!")
          layer.close(index);
          initArtCateList();
        }
      })
      
    });
  })
})