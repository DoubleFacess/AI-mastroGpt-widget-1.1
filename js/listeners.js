
listeners = listeners.createModule(function(){
	
	/* Listener calbacks */
	var addHistory = function(){		
		window.history.back();
		return false;
	}
	
	/* active listeners */
	
	var _buttonInsert = function(){
		var x = document.getElementById('my_form');
		x.setAttribute('method', 'post');
		x.setAttribute('enctype', "multipart/form-data");
		x.setAttribute('action', userObj.cfg.index_file + '?action=insert_new_record&t=' + sessionStorage.getItem('active-table'));
		
	}	
	
	
	/* function listener */
	var _myListener = function(id, event, callback){		
		var x = document.getElementById(id);			
		x.addEventListener(event, callback);
	}	
	
	return {		
		myListener: _myListener,
		buttonInsert: _buttonInsert		
	}	
})

