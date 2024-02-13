
main = main.createModule(function(){  	
	dump.next('init')		
	/* define app vars obj, array, ecc */
	
	var a1 = ['dummy1','dummy2']
	var a2 = ['dummy3','dummy4']; 
	var arrayOfArrays = new Array(a1,a2);	
	/*
	var objCallback = {
		'alliance': test_app.list_alliance,
		'do_table' : dom.main_table,
		'view_record' : dom.view_record,
		'edit_record' : dom.edit_record,
		'new_record' : dom.new_record,
		'do_select': dom.build_select,
		'select_game' : test_app.select_game,
		'do_init_controls' : test_app.do_init_controls,
		'select_ally' : test_app.select_ally,
		'do_game_tables' : test_app.do_game_tables,
		'get_response' : dom.test_obj,
		'truncate_tables' : dom.truncate_tables
	};
	*/
	//dom.dom_control()

	var _functionTest = function() {
		return true
	}

	var _init_app = function(){
		//main.get_obj_storage();
		dump.next('hello from init app function')		
		test_app.appTest()
		console.log(main)		
	}
	
	
	return {
		init_app: _init_app, 
		functionTest: _functionTest
	}
		
})

	
main.init_app()	
	



