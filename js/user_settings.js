(function() {   
	this.cfg = {
		index_file: 'index.php',
		server_url : 'php/response.php',
		instances: ['action', 'sub'],        
		div_aside : '_aside',
		div_main : 'main',
		//default_table: 't_nazioni',
		redirect_on_post: 'y'		
	},	
	this.sections = {
		/* app sections */		
		alliance: {
			async: 'y',
			server_url : 'php/supremacy.php',
			div : 'sub',
			dom: 'n',
			url: [],			
			_function: true			
		}, 
		get_response: {
			async: 'y',
			server_url : 'php/supremacy.php',
			div : 'main',
			url: [],			
			_function: true		
		},
		do_init_controls: {
			async: 'y',
			server_url : 'php/supremacy.php',
			div : null,
			url: [],			
			_function: true		
		},
		truncate_tables: {
			async: 'y',
			server_url : 'php/supremacy.php',
			div : 'main',
			url: [],			
			_function: true		
		},
		select_game: {
			async: 'y',
			server_url : 'php/supremacy.php',
			div : 'sub',
			dom: 'n',
			url: [],			
			_function: true			
		},
		select_ally: {
			async: 'y',
			server_url : 'php/supremacy.php',
			div : 'sub',
			is_form: 'y',
			dom: 'n',
			url: [],
			_function: true
		},
		do_game_tables: {
			async: 'y',
			server_url : 'php/supremacy.php',
			div : 'main',
			is_form: 'n',
			dom: 'n',
			url: [],
			_function: true
		},	
		do_control: {
			async: 'y',
			server_url : 'php/supremacy.php',
			div : 'main',
			url: [],			
			_function: true		
		},
		post_alliance: {
			async: 'y',
			server_url : 'php/supremacy.php',
			div : 'alert',
			post: true,			
			url: [],
			_function: false
		},			
		/* default prod sections */
		new_record : {
			async: 'y',
			div : 'main',
			is_form: 'y',
			//dom: 'n',
			msg: 'Inserisci nuovo record',
			url: [],
			_function: true
		},		
		update_record : {
			async: 'y',
			div : 'alert',
			post: true,
			url: [],			
			_function: false
		},
		insert_new_record : {
			async: 'y',	
			div : 'alert',
			post: true,
			url: [],			
			_function: false
		},
		/* testing sections active and tested */
		test_string : {
			async: 'y',
			div : 'main',
			url: [],
			_function: false
		},
		do_table : {			
			async: 'y',
			div : 'main',
			msg: 'Tabella elenco risultati',
			url: [],			
			_function: true
		},
		do_select : {
			async: 'y',
			div : 'sub',
			url: [],
			_function: true
		},
		
	}		    
}).apply(userObj);

/* inactive sections 
		home: {
			async: 'y',
			div : 'main',
			msg: 'Hello, this is home!',
			sub_msg : 'Home',
			url: [],			
			_function: false
		},		
		edit_record : {
			async: 'y',
			div : 'main',
			msg: 'Modifica o Elimina record',
			url: [],			
			_function: true
		},
		view_record : {
			async: 'y',
			div : 'main',
			msg: 'Visualizza elemento. Clicca a sinistra per le opzioni desiderate',
			url: [],			
			_function: true
		},
		delete_record: {
			async: 'y',		
			post: true,
			url: [],			
			_function: false			
		}
		*/
		


