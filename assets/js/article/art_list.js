$(function() {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;
  // 临时数据
  var data = {
    "status": 0,
    "message": "获取文章列表成功！",
    "data": [
      {
        "Id": 1,
        "title": "abab",
        "pub_date": "2020-01-03 12:19:57.690",
        "state": "已发布",
        "cate_name": "最新"
      },
      {
        "Id": 2,
        "title": "666",
        "pub_date": "2020-01-03 12:20:19.817",
        "state": "已发布",
        "cate_name": "股市"
      }
    ],
    "total": 5
  }

  // 定义一个查询参数对象，将来请求数据的时候
  // 需要将请求参数都西昂提交到服务器
  var q = {
    pagenum: 1,   // 页码值，默认请求第一页的数据
    pagesize: 2,  // 每页显示几条数据，默认煤业显示2条
    cate_id: '',  //文章分类的ID
    state: ''     //文章的发布状态
  }

  template.defaults.imports.dataFormat = function(date) {
    const dt = new Date(date)

    var y = dt.getFullYear(),
        m = dt.getMonth() + 1;
        d = dt.getDate(),
        hh = dt.getHours(),
        mm = dt.getMinutes(),
        ss = dt.getSeconds();

    return `${y}-${padZero(m)}-${padZero(d)} ${padZero(hh)}:${padZero(mm)}:${padZero(ss)}`
  }

  // 补零函数
  function padZero(val) {
    return val > 9 ? val : '0' + val;
  }


  // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: 'get',
      url: '/my/article/list',
      data: q,
      success: function(res) {
        if(res.status !== 0) {
          return layer.msg(res.message)
        }
        // console.log(res);
        var htmlStr = template('tpl-table', res);
        // console.log(htmlStr, data.data)
        $("tbody").html(htmlStr);
        
        // 调用渲染分页的部分
        renderPage(res.total);
      }
    })
  }
  initTable()

  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'get',
      url: '/my/article/cates',
      success: function(res) {
        if(res.status !== 0) {
          return layer.msg(res.message)
        }
        var htmlStr = template('tpl-cate', res);
        // console.log(htmlStr)
        $('[name=cate_id]').html(htmlStr);
        // 通过 layui 重新渲染表单区域的UI结构
        form.render();
      }
    })
  }
  initCate()


  // 为赛选表单绑定 submit 事件
  $('#form-search').on('submit', function(e) {
    e.preventDefault()
    // 获取表单中的选项的值
    var cate_id = $("[name=cate_id]").val()
    var state = $("[name=state]").val()
    // 为查询参数对象 q 中对应的数据赋值
    q.cate_id = cate_id;
    q.state = state;
    initTable()
  })

  // 渲染分页的方法
  function renderPage(total) {
    laypage.render({
      elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
      count: 10,    //数据总数，从服务端得到 total总数
      limit: q.pagesize,  // 每页可显示的数据条数
      curr: q.pagenum,     // 设置默认选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2,3,5,10],
      // 分页发生切换的时候，触发 jump 回调
      jump: function(obj, first) {
        // console.log(obj.curr);
        // console.log(first);
        // 把最新的页码值，赋值到 q这个查询参数
        q.pagenum = obj.curr;
        // 显示多少条
        q.pagesize = obj.limit;
        // 根据q获取最新的数据列表
        if(!first) {
          initTable()
        }
        
      }
    });
  }

  // 通过代理的形式，为还是拿出按钮绑定点击事件处理函数
  $('body').on('click', '.btn-delete', function() {
    var len = $('.btn-delete').length
    // 获取到文章的 id
    var id = $(this).attr('data-id')
    // 询问用户是否要删除数据
    layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
      $.ajax({
        mehtod: 'get',
        url: '/my/article/delete/' + id,
        success: function(res) {
          if(res.status !== 0) {
            return layer.msg(res.message)
          }
          layer.msg('删除文章成功!');
          // 当数据删除完成后，需要判断当前这个一页中，是否还有剩余的数据
          if(len === 1) {
            // 无数据后的处理
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          
          initTable()
        }
      })

      layer.close(index);
    });
  })

  var indexEdit;
  // 通过事件代理为编辑绑定点击事件
  $('tbody').on('click','.btn-edit', function() {
    
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '编辑文章列表',
      content: $('#dialog-edit').html()
    });

    var id = $(this).attr('data-id')
    // 发起ajax请求
    $.ajax({
      method: 'get',
      url: '/my/article/' + id,
      success: function(res) {
        if(res.status !== 0) {
          return layer.msg(res.message);
        }
        form.val('form-edit', res.data);
      }
    })
  })
  // 为确定修改
  $('body').on('submit', '#form-edit', function(e) {
    // 阻止默认事件
    e.preventDefault();
    var fd = new FormData($(this)[0]);
    fd.forEach((v, k) => {
      console.log(k, v);
    })
    publishArticle(fd);
    initTable();
  })
  function publishArticle(fd) {
    $.ajax({
      method: 'post',
      url: '/my/article/edit',
      data: fd,
      contentType: false,
      processData: false,
      success: function(res) {
        if(res.status !== 0) {
          return layer.msg(res.message)
        }
        console.log(res.data)
        
        // 发布文章成功后跳转到
      }
    })
  }
})




