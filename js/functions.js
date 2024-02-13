main = main.extend(function() {

	/* functionals functions */
		var _functionMap = function(a, f) {
		var b = Array();
		for (var j = 0; j < a.length; j++) {
			b[j] = f(a[j]);
		}
		return b[j];
	}

	var _functionInArray = function(e, g) {
		for (var i = 0; i < g.length; i++) {
			if (e == g[i]) return e;
		}
	}

	var _functionEmptyArray = function(a) {
		if (a.length === 0) return false;
		else return a;
	}	
	
	return {			
				
		functionEmptyArray: _functionEmptyArray,
		functionInArray: _functionInArray,	
		functionMap: _functionMap
		
	}
});

