$(function(){
  function getDate(task_date) {
      let date = new Date (task_date);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      let h = date.getHours();
      let i = date.getMinutes();

      if (m < 10) {
        m = '0' + m;
      }
      if (d < 10) {
        d = '0' + d;
      } 
      if (h < 10) {
        h = '0' + h;
      }
      if (i < 10) {
        i = '0' + i;
      }
      return y+'/'+m+'/'+d+' '+h+':'+i;
  }

  function render_task_list(task_list) {
    let tasks = task_list;
    let list_tag = '';
    for(let i = 0; i < tasks.length; i++) {
      list_tag += 
        '<li class="list-group-item">'+getDate(tasks[i].create_date)+'<br />'+tasks[i].content+
          '<button type="button" class="close close_task_list"  data-id="'+tasks[i]._id+'">'+
              '<span>&times;</span>'+
          '</button>'+
        '</li> ';
    }
    $("#task_list").html(list_tag); 
  }


  if(!_.isEmpty(localStorage.getItem('task_input_user'))) {
    $('#user_name').val(localStorage.getItem('task_input_user'));
    $('#user_name').prop('disabled', true);

     $.ajax({
      type: 'POST',
      url:'/selecttask',
      dataType: "json",
      data: {user_name:$('#user_name').val()}
    }).done(function(data, textStatus, jqXHR){
      if(data.task_list.length != 0){
        render_task_list(data.task_list); 
      } else {
        $("#task_list").html('<li class="list-group-item">'+$('#user_name').val()+'さんのタスクはありません。'+'</li>'); 
      }
    }).fail(function(jqXHR, textStatus, errorThrown){
    });
  }

  // 閉じるボタン押下時
  $(document).on('click', '.close', function () {
    $(this).parent().slideUp();
  });

  // ユーザー名変更 一覧取得
  $("#user_name").change(function(){
    let current_user = $(this).val();
    $.ajax({
      type: 'POST',
      url:'/selecttask',
      dataType: "json",
      data: {user_name:current_user}
    }).done(function(data, textStatus, jqXHR){
      if(data.task_list.length != 0){
        render_task_list(data.task_list); 
      } else {
        $("#task_list").html('<li class="list-group-item">'+current_user+'さんのタスクはありません。'+'</li>'); 
      }
    }).fail(function(jqXHR, textStatus, errorThrown){
    });

  });

  // 一覧削除ボタン押下
  $(document).on('click', '.close_task_list', function () {
    $.ajax({
      type: 'POST',
      url:'/deletetask',
      dataType: "json",
      data: {id:$(this).attr('data-id')}
    }).done(function(data, textStatus, jqXHR){
      $('#info_delete_success').slideDown();
    }).fail(function(jqXHR, textStatus, errorThrown){
      $('#error_delete_faild').slideDown();
    });
  });


  // タスク追加ボタン押下
  $("#btn_add").click(function(){
    // バリデーション
    if(_.isEmpty($('#user_name').val())) {
      $('#alert_empty_user').slideDown();
      return false;
    }

    if(_.isEmpty($('#contents').val())) {
      $('#alert_empty_task').slideDown();
      return false;
    }

    // タスク追加
    $.ajax({
      type: 'POST',
      url:'/addtask',
      dataType: "json",
      data: {user_name:$('#user_name').val(), content:$('#contents').val()}
    }).done(function(data, textStatus, jqXHR){
      $('#info_add_success').slideDown();
      if(data.task_list.length != 0){
        $('#user_name').prop('disabled', true);
        localStorage.setItem('task_input_user', $('#user_name').val());
        render_task_list(data.task_list); 
      }
    }).fail(function(jqXHR, textStatus, errorThrown){
      $('#error_add_faild').slideDown();
    });
  });

});
