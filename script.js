$(function(){
	var json;
	$.getJSON("../data.json", function(e){
		json = e;
		showImages();
	});

	function showImages(searchString){
		$('.library .images').empty();
		for(var i in json.images){
			if(searchString){

			}
			$('.library .images').prepend(listImage(i, json.images[i]));
		}
	}

	function listImage(id, item){
		return '<li data-id="' + id + '"><span style="background-image:url(\'phpThumb/phpThumb.php?src=../../' + item.url + '&amp;w=210\');" title="' + item.title + '" /></span></li>';
	}
});