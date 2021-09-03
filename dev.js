function dragAndDrop() {
		var origin = document.querySelector( '.origin' );
		var dropzones = document.querySelectorAll( '.dropzone' );
		if( origin ) {
			var draggable_div_1		= build.element( { type: 'div', id: 'first' ,class: 'draggable', attributes: { draggable: true }, text: 'DIV 1' } );
			var draggable_div_2		= build.element( { type: 'div', id: 'seconnd' , class: 'draggable', attributes: { draggable: true }, text: 'DIV 2' } );
			var draggable_div_3		= build.element( { type: 'div', id: 'third' ,class: 'draggable', attributes: { draggable: true, only:2 }, text: 'DIV 3 ( Only to div 2 )' } );
			var draggable_div_4		= build.element( { type: 'div', id: 'fourth' , class: 'draggable', attributes: { draggable: true, only:2 }, text: 'DIV 4 ( Only to div 2 )' } );

			draggable_div_1.addEventListener( 'dragstart', onDragStart );
			draggable_div_2.addEventListener( 'dragstart', onDragStart );
			draggable_div_3.addEventListener( 'dragstart', onDragStart );
			draggable_div_4.addEventListener( 'dragstart', onDragStart );


			origin.appendChild( draggable_div_1 );
			origin.appendChild( draggable_div_2 );
			origin.appendChild( draggable_div_3 );
			origin.appendChild( draggable_div_4 );
		}
		dropzones.forEach( ( el ) => {
			el.addEventListener( 'dragover', onDragOver );
			el.addEventListener( 'drop', onDrop );
		});

		function onDragStart( e ) {
			e.dataTransfer.clearData();
			e.dataTransfer.setData( 'text/plain', e.target.id );
			console.log( e.dataTransfer );
		}

		function onDragOver( e ) {
			e.preventDefault();
		}

		function onDrop( e ) {
			e.preventDefault();
			const id = e.dataTransfer.getData('text');
			const draggableElement = document.getElementById( id );
			const dropzone = e.target;
			
			draggableElement.style = "";
			dropzone.appendChild( draggableElement );
			
		}
	}

	const inputSwitch			= { type: 'input', class: 'form-check-input', attributes: { type: 'checkbox ' } };
	const inputText				= { type: 'input', class: 'form-control', attributes: { type: 'text ' } };
	
	function searchFilters() {
		let ca						= card( 'Søge filter' );
		let caBody					= ca.querySelector( 'card-body' );
		
		inputSwitch.id 				= 'earning_active';
		let searchSwitchActive		= build.element( inputSwitch );
		let searchGrpActive			= inputGrp( searchSwitchActive, inputSwitch.id, 'Aktiver filter', { div: 'form-check form-switch mb-1' } );
		
		inputSwitch.id 				= 'in_stock';
		let searchSwitchStorage		= build.element( inputSwitch );
		let searchGrpStorage		= inputGrp( searchSwitchStorage, inputSwitch.id, 'Er på lager', { div: 'form-check form-switch mb-1' } );
		
		inputSwitch.id 				= 'uploaded';
		let searchSwitchUploaded	= build.element( inputSwitch );
		let searchGrpUploaded		= inputGrp( searchSwitchUploaded, inputSwitch.id, 'Er på CDON', { div: 'form-check form-switch mb-1' } );

		inputText.id 				= 'f_price';
		let inputPrice				= build.element( inputText );
		let searchGrpPrice			= inputGrp( inputPrice, inputText.id, getCurrency(), { div: 'input-group mb-1', label: 'input-group-text w-35' } );

		inputText.id 				= 'f_percent';
		let inputPercent			= build.element( inputText );
		let searchGrpPercent		= inputGrp( inputPrice, inputText.id, getCurrency(), { div: 'input-group mb-1', label: 'input-group-text w-35' } );
	}

	function brandFilter() {

		inputText.id  				= '';
		let inputBrand				= build.element( inputText );
		let labelBrand				= build.element();

		let dropdownBrand			= build.element();

		let inputGrpFilter			= build.element();
		let inputFilter				= build.element();
		let labelFilter				= build.element();
	}

	function filters() {
	}

	function card( title, classes ) {
		if( classes == undefined ) { classes = {}; }
		if( isObject( classes ) ){
			classes.card = classes.card != undefined ? ' '+classes.card : ''; 
			classes.body = classes.body != undefined ? ' '+classes.body : ''; 
			classes.title = classes.title != undefined ? ' '+classes.title : ''; 
		}
		let card			= build.element( { type: 'div', class: 'card' + classes.card } );
		let cardBody		= build.element( { type: 'div', class: 'card-body' + classes.body } );
		let cardTitle		= build.element( { type: 'h5', class: 'card-title' + classes.title, text: title } );

		cardBody.appendChild( cardTitle );
		card.appendChild( cardBody );

		return card;
	}

	function inputGrp( input, id, title, classes ) {
		if( classes == undefined ) { classes = {}; }
		if( isObject( classes ) ){
			classes.label = classes.card != undefined ? ' '+classes.label : ''; 
			classes.div = classes.body != undefined ? ' '+classes.div : ''; 
		}

		let label 	= build.element( { type: 'label', class: classes.label, attributes: { for: id }, text: title } );
		let div 	= build.element( { type: 'div', class: classes.div } );

		div.appendChild( input );
		div.appendChild( label );

		return div;
	}
