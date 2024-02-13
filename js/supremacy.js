test_app = test_app.createModule(function(){	
	
	var _appTest = function(){
		dump.next('hello from this funcion');
		if(main.functionTest()) {
			console.log('function test is true')
		}
	}	
	
	return {		
		appTest: _appTest
	}
})

