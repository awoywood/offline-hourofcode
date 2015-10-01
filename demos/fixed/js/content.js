var completeStorage = 'hoc-stage';
var incompleteStorage = 'hoc-istage';
var linesStorage = 'hoc-lns';
var htmlLevelPrefix = 'level';
function initLevels(i){
  var clean = localStorage[completeStorage];
  if(!clean){
    localStorage[completeStorage] = 0;
    localStorage[incompleteStorage] = 0;
    
    for(var i = 1; i <= 20; i++){
      localStorage[linesStorage+i] = 0;
    }
  }
}

function isLevelCompleted(i){
  var data = localStorage[completeStorage];
  var idata = localStorage[incompleteStorage];
  while(i>1){
    idata = idata>>1;
    data = data>>1;
    i--;
  }
  
  return (data&1)*2+(idata&1);
}

var hoc_completed = false;
function setLevelAsCompleted(i){
  if(hoc_completed){
    return;
  }
  hoc_completed = true;
  var mask = 1;
  var level = i;
  while(i > 1){
    mask = mask << 1;
    i--;
  }
  localStorage[completeStorage] = mask | localStorage[completeStorage];
  localStorage[incompleteStorage] = ~mask & localStorage[incompleteStorage];
  localStorage[linesStorage+level] = bloques_usados()-1;
}

function setLevelAsIncompleted(i){
  var mask = 1;
  var level = i;
  while(i > 1){
    mask = mask << 1;
    i--;
  }
  localStorage[incompleteStorage] = mask | localStorage[incompleteStorage];
  localStorage[completeStorage] = ~mask & localStorage[completeStorage];
  localStorage[linesStorage+level] = bloques_usados()-1;
}

function getAllBlocks(){
  var sum = 0;
  for(var i = 1; i <= 20; i++){
    sum += parseInt(localStorage[linesStorage+i]);
  }
  sum -= parseInt(localStorage[linesStorage+parseInt($('#i-level').val())]);
  return sum+bloques_usados()-1;
}

function applyColor(level,  i){
  level.addClass("lcolor"+isLevelCompleted(i));
}

function stagesCompleted(){
  var s = localStorage[completeStorage];
  var c = 0;
  while(s != 0){
    c += s & 1;
    s = s >> 1;
  }
  return c;
}


initLevels();
$('.levels li').each(function (i){
  applyColor($(this), i+1);
  $(this).click(function(){
    window.location.href = htmlLevelPrefix+(i+1)+'.html';
  });	
});


$("#game-info-desc").html(HOC_LEVEL.descripcion);
$(".welcome-image img").attr('src', 'media/welcome/'+HOC_LEVEL.imagen_inicial);

if("tutorial" in HOC_LEVEL) {
  $("#video-tutorial").attr("src", HOC_LEVEL.tutorial + "?rel=0");
  $('#video').removeClass('invisible');
}

$("#welcome-message").html(HOC_LEVEL.mensaje_inicial);
$(".help-title").html(HOC_LEVEL.titulo_ayuda);
$(".help-message").html(HOC_LEVEL.comentario_ayuda);
$("#reset-level-btn").click(function(){location.reload();});
if(parseInt($('#i-maxlevel').val()) <= parseInt($('#i-level').val())){
  $('.completed-next-btn').html('He terminado');
}
function lastLevelMessage(){
  if(parseInt($('#i-maxlevel').val()) <= parseInt($('#i-level').val())){
    $('.completed-next-btn').html('He terminado');
    $('.cd-btn2').html('He terminado');
  }
}


$("#game-tutorial span").click(function(){
  $(document).modalVideoDisplay(HOC_LEVEL.tutorial);
});

function linkReference(){
  var max = parseInt($('#i-maxlevel').val());
  var lv = parseInt($('#i-level').val());
  return lv<max?htmlLevelPrefix+(lv+1)+'.html':'felicitaciones.html';
}


function showHelp(){
  $('#helpModal').modal();
}

function completedStage(){
  $("#completedModal").modal();
  $(".completedExtra").hide();
  var lv = parseInt($('#i-level').val());
  setLevelAsCompleted(lv);

  $('.completed-next-btn').removeClass('invisible');
  
  $(".completed-repeat-btn").click(function(){
    resetear_nivel();
    $('#completedModal').modal('hide');
  });
  
  $(".completed-next-btn").click(function(){
    window.location.href = linkReference();
  });
  
  $('.completed-code-btn').click(function(){
    $('#completedModal').modal('hide');
    mostrar_javascript();
    $("button.cd-btn2").show();
  });
}

function semiCompletedStage(n){
  $("#completedModal").modal();
  $(".blockNumber").html(n);
  $(".completedExtra").show();
  var lv = parseInt($('#i-level').val());
  setLevelAsIncompleted(lv);
  $(".completed-repeat-btn").click(function(){
    resetear_nivel();
    $('#completedModal').modal('hide');
  });
  
  $(".completed-next-btn").click(function(){
    window.location.href = linkReference();
  });
  $('.completed-code-btn').click(function(){
    $('#completedModal').modal('hide');
    mostrar_javascript();
    $("button.cd-btn2").show();
  });
}

function incompletedStage(n){
  $("#incompletedModal").modal();
  $(".completed-repeat-btn").click(function(){
    resetear_nivel();
    $('#incompletedModal').modal('hide');
  });
  $(".completed-help-btn").click(function(){
    $('#incompletedModal').modal('hide');
    showHelp();
  });
}

function failedStage(block){
  $("#failedModal").modal();
  $(".completed-repeat-btn").click(function(){
    resetear_nivel();
    $('#failedModal').hide();
  });
  
  $(".completed-help-btn").click(function(){
    $('#failedModal').modal('hide');
    showHelp();
  });
  
  $('.incompleted-block').html(block);

}

function wallCrash(){
  $('#murallaModal').modal();
  $(".completed-repeat-btn").click(function(){
    resetear_nivel();
    $('#murallaModal').modal('hide');
  });
  
  $(".completed-help-btn").click(function(){
    $('#murallaModal').modal('hide');
    showHelp();
  });
  
  execbtn.html('Reiniciar');
  execbtn.toggleClass("btn-danger btn-success");
}

function forModal(){
  $("#emptyForErrorModal").modal();
  
  $(".completed-repeat-btn").click(function(){
    resetear_nivel();
    $("#emptyForErrorModal").modal('hide');
  });
  
  $(".completed-help-btn").click(function(){
    $("#emptyForErrorModal").modal('hide');
    showHelp();
  });
}

function welcomeWindow(){
  /*if("tutorial" in HOC_LEVEL) {
    $("#videoModal").modal();
  }*/

  $('#welcomeModal').modal();
}

function unconnectedBlocks(){
	$("#errorModal").modal();
}

welcomeWindow();


