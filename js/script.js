$(function(){

	Uploader.register.click('#context-menu .upload', {onProgress: dropProgress, beforeSend: fileInit});
	Uploader.register.drop('.library', {onProgress: dropProgress, beforeSend: fileInit});

	function fileInit(file, e){
		if(!$('.library li.tmp' + e.index).length) $('.library .images').prepend('<li class="loading tmp' + e.index + '"><span style="height:0%"></span></li>');
	}

	function dropProgress(file, e){
		var span = $('.library li.tmp' + e.index + ' span');
		var p = ((e.percentage*100)|0);
		span.css({"height": p + '%', top: (100 - p) + '%'});
		if(e.percentage==1){
			if(e.error) $('.library li').remove(span.parent());
			else if(e.file){
				var id = json.images.index = Number(json.images.index) + 1;
				span.css({'background-image': 'url(\'phpThumb/phpThumb.php?src=../../' + e.file.url + '&w=110\')'}).attr('class', '').parent().removeClass('loading').data('id', id);
				delete e.file.absolute;
				json.images[id] = e.file;
			}
		}
		var progress = Uploader.progress();
		$('progress').attr('max', progress.total).attr('value', progress.loaded);
		if(progress.percentage==1){
			updateJSON();
		}
	}

	function updateJSON(onSuccess, onError){
		$.ajax({
      url: 'update.php',
      type: 'POST',
      data: {json: json},
      dataType: 'json',
      success: function(e){
      	if(onSuccess) onSuccess();
      },
      error: function(e){
      	if(onError) onError();
      }
		});
	}

	var json;
	$.getJSON("../data.json", function(e){
		json = e;
		showImages();
	});

	function showImages(searchString){
		$('.library .images').empty();
		for(var i in json.images){
			if(i=='index') continue;
			if(searchString){

			}
			$('.library .images').prepend(listImage(i, json.images[i]));
		}
	}

	function listImage(id, item){
		return '<li data-id="' + id + '"><span style="background-image:url(\'phpThumb/phpThumb.php?src=../../' + item.url + '&amp;w=110\');" /></span></li>';
	}

	var editor = {
		textarea: $('.editor textarea'),
		pre: $('.text-edit-fill pre'),

	};
	editor.lineHeight = parseInt(editor.textarea.css('line-height'));
	$('.editor').on("click", function(){
		editor.textarea.focus();	
	});
	editor.textarea.on("keydown change cut paste drop", function(e){
		editor.keyCode = e.keyCode;
		editor.prevChar = editor.textarea.val().substring(editor.textarea[0].selectionStart, editor.textarea[0].selectionStart - 1);
		editor.atEnd = editor.textarea[0].selectionStart==editor.textarea.val().length;
		if(e.keyCode==9){
			e.preventDefault();
			editor.insertText('    ');
		}
		setTimeout(function(){
			editor.update();
		}, 0);
	}).keydown();

	editor.insertText = function(insertText){
    var field = editor.textarea[0], f = {x: field.selectionStart, y: field.selectionEnd, v: field.value};
    field.value = f.v.substring(0, f.x) + insertText + f.v.substring(f.y, f.v.length);
		field.selectionStart = field.selectionEnd = f.x + insertText.length;
	}

	editor.update = function(){
		editor.pre.html(editor.textarea.val().replace(/[pre <>&]/g, '#').replace(/\n/g, '\n&zwnj;'));
		editor.height = Math.max(editor.pre.height(), editor.lineHeight);
		editor.textarea.height(editor.height);

		var n = Math.round(editor.height/editor.lineHeight);
		if(n!==editor.lines){
			editor.lines = n;
			var s = [];
			for(var i=1;i<=n;i++) s.push(i);
			$('.editor .lines').html(s.join('<br/>'));
		}
	}

	$('#right-area').resizable({
		handles: 'w',
		//minWidth: parseInt($('#right-area').css('min-width')),
		stop: function(){
			$.cookie('right-area-resize', $(this).attr('style'));
			if($('#right-area').hasClass('inactive')){
				menu.show(menu.last);
			}
		},
		start: function(){
			if($('#right-area').hasClass('inactive')){
				//menu.show('library');
				//$('#right-area').removeClass('inactive');
			}
		},
		create: function(){
			var s = $.cookie('right-area-resize');
			if(s) $(this).attr('style', s);
		},
		resize: editor.update
	});

	$('#right-area .area-buttons li').on("click", function(e){
		e.preventDefault();
		menu.show($(this).data('type'), true);
	});

	var menu = {};
	menu.show = function(area, allowHide){
		$('#right-area .area-buttons li.active').removeClass('active');
		if(area!=menu.current || !allowHide){
			menu.current = menu.last = area;
			$('#right-area').removeClass('inactive');
			$('#right-area .area-buttons .nav-' + area).addClass('active');
			$('#right-area section.' + area).fadeIn(200);
		}else{
			menu.current = 0;
			$('#right-area').addClass('inactive');
		}
		$('#right-area section.area').not('.' + menu.current).fadeOut(200);
	}
	menu.show('library');

	
	var context = {};
	$("#context-menu").on("click", ".delete", function(e){
		e.preventDefault();
		var b = confirm("Image will be deleted permanently.");
		if(b){
			delete json.images[window.contextItem.data("id")];
			updateJSON(function(){
				window.context.item.remove();
			});
		}
	}).on("contextmenu", function(e){
		e.preventDefault();
		context.remain = true;
	});

	$('body').on("contextmenu", function(e){
		if(!context.active && !context.remain) context.show();
		else context.remain = false;
	}).on("contextmenu", ".library", function(e){
		e.preventDefault();
		context.show('.upload', e);
	}).on("contextmenu", ".library li", function(e){
		e.preventDefault();
		context.item = $(this);
		if(window.currentList) context.show('.add', e);
		if($(this).hasClass('loading')) context.show('.loading', e);
		else context.show('.delete', e);
	}).on("click", function(){
		context.show();
	});

	context.show = function(item, e){
		if(item){
			if(context.active){
				context.active.push(item);
				return;
			}else context.active = [item];
			context.timer = setTimeout(function(){
				$('#context-menu').css({
			      top: e.pageY + 'px',
			      left: e.pageX + 'px'
			  }).show().find('li').show().not(context.active.join(', ')).hide();
			  context.active = null;
			}, 100);
		}else{
			clearInterval(context.timer);
			$('#context-menu').hide();	
		}
	}
});