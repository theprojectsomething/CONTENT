$(function(){
	var upload = {
        register: {},
    },
    params = {
        subFolder: '',
        loading: 0
    };

    params.init = function(){
        $(window).on("dragenter", function(e){
            e.preventDefault();
        }).on("dragleave drop", function(e){
            e.preventDefault();
            $('html').removeClass('dragover');
        }).on("dragover", function(e){
            e.preventDefault();
            $('html').addClass('dragover');
        });
    }

    upload.progress = function(){
        var progress = {
            files: params.files.length,
            loaded: 0,
            total: 0,
            errors: 0,
            complete: 0
        }
        for(var i=0;i<progress.files;i++){
            progress.loaded += params.files[i].loaded;
            progress.total += params.files[i].total;
            if(params.files[i].percentage==1) ++progress.complete;
            if(params.files[i].error) ++progress.errors;
        }
        progress.percentage = progress.loaded/progress.total;
        return progress;
    }

    upload.register.subFolder = function(folder){
        if(typeof folder === 'string') params.subFolder = folder;
        return params.subFolder;
    }

    upload.register.drop = function(el, _params){
        el = $(el).addClass('drop-point')
        .on("dragleave", function(e){
            e.preventDefault();
            $(this).removeClass('dragover');
        })
        .on("dragover", function(e){
            e.preventDefault();
            $(this).addClass('dragover');
        })
        .on("drop", function(e){
            e.preventDefault();
            $(this).removeClass('dragover');
            upload.process(e.originalEvent.dataTransfer.files, _params);    
        });
    }

    upload.register.click = function(el, _params){
        var input = $('<input type="file" multiple accept="image/*" style="display:none">').on("change", function(e){
            upload.process(this.files, _params);
        }).appendTo('body');
        el = $(el).on("click", function(e){
            e.preventDefault();
            input.click();
        });

        return input;
    }


    upload.process = function(files, _params){
        if(!files.length) return 0;
        for(var i=0,t=files.length;i<t;i++){
            upload.file(files[i], _params);
        }
    }

    upload.file = function(file, _params){
        if(!_params) _params = {};
		var progress, formData = new FormData();
        formData.append('file', file);
        if(params.subFolder) formData.append('subFolder', params.subFolder);
        $.ajax({
            url: 'upload.php',
            type: 'POST',
            data: formData,
            xhr: function(){
                myXhr = $.ajaxSettings.xhr();
                if(myXhr.upload){
                    myXhr.upload.addEventListener('progress', function(e){
                        if(e.lengthComputable){
                            _onProgress(e.loaded);
                        }
                    }, false);
                }
                return myXhr;
            },
            beforeSend: function(e){
                if(params.loading==0) params.files = [];
                ++params.loading;
                progress = {
                    percentage: 0,
                    loaded: 0,
                    total: file.size,
                    index: params.files.length
                }
                params.files.push(progress);
                if(_params.beforeSend) _params.beforeSend(file, progress, e);
            },
            success: function(e){
                if(e.success){
                    e.data.created = Date.now();
                    progress.file = e.data;
                    _onProgress(file.size);
                    if(_params.onSuccess) _params.onSuccess(file, e);
                }else _onError(e);
            },
            error: function(e){
                _onError(e);
            },
            complete: function(e, status){
                --params.loading;
                if(_params.onComplete) _params.onComplete(file, e, status);
            },
            cache: false,
            contentType: false,
            processData: false
        });

        function _onError(e){
            progress.error = true;
            _onProgress(file.size);
            if(_params.onError) _params.onError(file, e);
        }

        function _onProgress(_loaded){
            progress.percentage = _loaded/file.size;
            progress.loaded = _loaded;
            if(_params.onProgress) _params.onProgress(file, progress);
        }
	}

    params.init();
    window.Uploader = upload;
});