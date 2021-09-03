/**
 * Waits for the page to be loaded before running
 * 
 * @param {Function} fn Function to run when page is ready
 */
function ready( fn ) {
    if( document.readyState != 'loading' ) {
        fn();
    } else {
        document.addEventListener( 'DOMContentLoaded', fn );
    }
}

/**
 * A function for calling document.querySelector
 * 
 * @param {string} el Selector for html element. Either class, id, etc.
 * @returns The found element | nothing
 */
function find( el ) {
    return document.querySelector( el );
}

/**
 * A function for calling document.querySelectorAll
 * 
 * @param {string} el Selector for html element. Either class, id, etc.
 * @returns NodeList
 */
function findAll( el ) {
    return document.querySelectorAll( el );
}

/**
 * Checks if f is a Function or not
 * 
 * @param {Function} f Function to check
 * @returns Bool
 */
function is_function( f ) {
    if( f instanceof Function ) {
        return true;
    } else {
        return false;
    }
}

/**
 * Counts the objects keys
 * 
 * @param {Object} obj Object to get the size of
 * @returns Size of object
 */
Object.size = function( obj ) {
    var size = 0,
    key;
    for ( key in obj ) {
        if ( obj.hasOwnProperty( key ) ) size++;
    }
    return size;
};

/**
 * Checks if value are a Int
 * 
 * @param {*} value The value to be validated as a Int
 * @returns True|False
 */
function isInt( value ) {
  return !isNaN( value ) && 
         parseInt( Number( value ) ) == value && 
         !isNaN( parseInt( value, 10 ) );
}

/**
 * Checks if obj are a Object
 * 
 * @param {*} obj The value to be validated as a Object
 * @returns True|False
 */
function isObject( obj ) {
  return obj === Object( obj );
}

/**
 * Checks if the input is allowed
 * 
 * @param {Event} e Event to be checked
 */
function allowInput( e ){
    if( !inputkeys.includes( e.key ) ) {
        log( "Not allowed to use - " + e.key );
        e.preventDefault();
    }
}

/**
 * POST json to ajax.php and sends the result to callback
 * 
 * @param {String} json Data to be processed
 * @param {Function} callback Function to be called
 */
function ajax( json, callback ) {
    var request = new XMLHttpRequest();
    request.open('POST', 'ajax.php', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            var resp = this.response;
			if( resp != "" ) {
				try {
					var data = JSON.parse( resp );
					if( is_function( callback ) ){
						callback( data );
					} else {
						log( 'No callback available.' );
					}
				} catch ( err ) {
					if( this.response.includes("into Magento") ) {
						find( 'body' ).innerHTML = this.response;
					} else {
					    console.warn( err );
					    log( this );
                    }
				}
			} else {
				log( "Empty response from call." );
			}
        } else {
           log( this );
        }
    };

    request.onerror = function() {
        console.error(this);
    };
    request.send(json);
}

/**
 * Search for a parent of the child
 * 
 * @param {HTMLElement} child The html to find the parent of
 * @param {String} parentIdentity The id or class for the parent
 * @returns The found parent element
 */
function findParent( child, parentIdentity ) {
    try {
        let parent = child.parentNode;
        if( parent && parent !== document.body ) {
            if( parent.classList.contains( parentIdentity ) || parent.id == parentIdentity ) {
                return parent;
            } else {
                return findParent( parent, parentIdentity );
            }
        } else {
            log( 'Parent not found.' );
        }
    } catch( err ) {
        console.warn( err );
    }
}

/**
 * Adds a filter to the table onpage
 * 
 * @param {String|Number} filter Filters the table based upon content of the row
 */
function filterTable( filter ) {
    try{
        trs = findAll('tbody tr');
        trs.forEach( tr => tr.style.display = [...tr.children].find( td => td.innerHTML.includes( filter ) ) ? '' : 'none' );
    } catch( error ) {
        console.warn( error );
    }
}

/**
 * Sorts the table based upon column and type
 * 
 * @param {Number} colNum The number of the column 
 * @param {String} type Sort type
 * @param {String} tablebody Table identifier
 * @param {Number} reverse Sort direction
 * @returns Sort direction
 */
function columnSort( colNum, type, tablebody, reverse = 0 ) {
    tbody = find( tablebody );
    let rowsArray = Array.from( tbody.rows );
    let compare;
    
    switch( type ) {
        case 'number':
            compare = function( rowA, rowB ) {
                if( reverse ) {
                    return rowB.cells[colNum].innerText - rowA.cells[colNum].innerText; 
                } else {
                    return rowA.cells[colNum].innerText - rowB.cells[colNum].innerText;
                }
            }
            break;
        case 'text':
            compare = function( rowA, rowB ) {
                if( reverse ) {
                    return rowA.cells[colNum].innerHTML < rowB.cells[colNum].innerHTML;
                } else {
                    return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML;
                }
            }
        break;
    }
    
    rowsArray.sort( compare );
    tbody.append(...rowsArray);
    return reverse;
}

/**
 * Creates and shows a Confirmation box
 * 
 * @param {String} text Text to be shown
 * @param {String} btnColor Color for the ok_btn in HEX
 * @param {String} ok_btn Text for button
 * @param {String} cancel_btn Text for button
 * @returns {Bool} true|false
 */
const confirm = ( text, btnColor='#5AB9EA', ok_btn='Okay', cancel_btn='Cancel' ) => {
    return new Promise( ( resolve ) => {
        var c_background        = build.element( { type: 'div', class: 'c-background' } );
        var c_box               = build.element( { type: 'div', class: 'c-box', attributes: { style: 'background-color: #fff' } } );
        var c_contentWrapper    = build.element( { type: 'div', class: 'c-contentWrapper' } );
        var c_textnode          = build.element( { type: 'div', class: 'c-textnode', text: text, attributes: { style: 'color: #666666' } } );
        var c_okButton          = build.element( { type: 'button', class: 'c-okButton btn btn-success', id: 'c-okButton', text: ( ok_btn ), attributes: { tabindex: 0, style: 'color: #fff; background-color:'+( btnColor ) } } );
        var c_cancelButton      = build.element( { type: 'button', class: 'c-cancelButton btn btn-secondary', text: ( cancel_btn ), attributes: { tabindex: 1 } } );
        var c_buttonSection     = build.element( { type: 'div', class: 'c-buttonSection' } );
        var style               = build.element( { type: 'style', id: 'c_style_confirm', attributes: { type: 'text/css' }, html: `.c-box{ position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 300px; border: 0px solid; border-radius: 5px; padding: 20px; user-select: none; -ms-user-select: none; -moz-user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; } .c-background{ position: fixed; width: 100%; height: 100%; top: 0; left: 0; background-color: rgba(0, 0, 0, 0.6); font-family: 'Heebo', sans-serif; z-index: 100000; } .c-textnode{ max-height: 500px; overflow-y: auto; font-size: 17px; word-wrap: break-word; line-height: 1.5; padding-right: 20px; } .c-textnode::-webkit-scrollbar{ width: 5px; } .c-textnode::-webkit-scrollbar-thumb{ background-color: #D5D8DC; border-radius: 10px; } .c-textnode{ scrollbar-color: #D5D8DC; scrollbar-width: thin; } .c-okButton{ border: 0px solid; border-radius: 3px; padding: 7px 9px; outline: none; font-size: 14px; cursor: pointer; } .c-cancelButton{ border: 0px solid; border-radius: 3px; padding: 7px 9px; outline: none; font-size: 14px; cursor: pointer; background-color: #fff; color: #666666; margin-right: 5px; } .c-cancelButton:hover, .c-cancelButton:focus, .c-okButton:hover, .c-okButton:focus { outline: 1px dotted #848484;  } .c-buttonSection{ padding-top: 10px; display: flex; justify-content: flex-end; } @media only screen and (max-width: 576px) { .c-box { width: calc(100% - 30%); } .c-okButton{ cursor: default; } .c-cancelButton{ cursor: default; } } .c-box{animation:mymove 800ms;} @keyframes mymove{0% {opacity: 60%} .c-background{animation:fadein 800ms} @keyframes fadein{0% {opacity: 60%}` } );
        
        c_contentWrapper.appendChild( c_textnode );
        c_buttonSection.appendChild( c_cancelButton );
        c_buttonSection.appendChild( c_okButton );
        c_contentWrapper.appendChild( c_buttonSection );
        c_box.appendChild( c_contentWrapper );
        c_background.appendChild( c_box );
        document.body.appendChild( c_background );
        document.head.appendChild( style );

        c_okButton.addEventListener( 'click', () => { cHide( true ); } );
        c_cancelButton.addEventListener( 'click', () => { cHide( false ); } );
        c_okButton.focus();

        function cHide( resolution ) {
            style.remove();
            c_background.remove();
            resolve( resolution );
        }
    } );
};

/**
 * Shows a toast for 2.6 sec
 * 
 * @param {String} text Text to be shown
 * @param {String} bgCls Background color in HEX
 */
function toast( text, bgCls ) {
    var c_toast = build.element( { type: 'div', class: 'c-toast', html: text, attributes: { style: 'background-color:'+( bgCls || '#2C3E50' ) } } );
    var style   = build.element( { type: 'style', attributes: { type: 'text/css' }, html: `.c-toast{ max-width: 200px; text-align: center; padding: 10px; font-size: 16px; font-family: sans-serif; border-radius: 3px; position: fixed; bottom: -25%; left: 50%; color: #fff; transform: translateX(-50%); animation-name: fadeinout; animation-duration: 2500ms; word-wrap: break-word; line-height: 1.4; letter-spacing: .4px; user-select: none; -ms-user-select: none; -moz-user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; z-index: 10000; } @keyframes fadeinout{ 10%{bottom: 15%; opacity: 100%} 20%{bottom: 15%; opacity: 100%} 40%{bottom: 15%; opacity: 100%} 60%{bottom: 15%; opacity: 100%} 80%{bottom: 15%; opacity: 100%} 100%{bottom: -25%; opacity: 100%} }` } );

    setTimeout( ()=>{
        c_toast.remove();
        style.remove();
    }, 2600 );

    document.head.appendChild(style);
    document.body.appendChild(c_toast);
}

/**
 * Sends information to pg_toast og console.log
 * 
 * @param {*} data Data to be shown
 */
function log( data ) {
    if( ( data['status'] == 1 && typeof data['toast'] == 'undefined' ) || typeof( data ) == "string" ) {
        console.log( data );
        toast( "Check console for more info." );
    } else if( data['toast'] ) {
        toast( data['toast'] );
    } else {
        toast( "Not possible to do.<br/>Contact system admin." );
    }
}

/**
 * A builder classs
 */
var build = {
    /**
     * Builds a html element
     * 
     * @param {Object} obj Object containing information to build a html element
     * @returns HTML Element
     */
    element: function( obj ) {
        try{
            var el = document.createElement( obj['type'] );
            if( obj['id'] ) {
                el.id = obj['id'];
            }
            if( obj['class'] ) {
                el = this.addClasses( obj['class'], el );
            }
            if( obj['attributes'] ) {
                el = this.addAttributes( obj['attributes'], el );
            }
            if( obj['text'] ) {
                el.innerText = obj['text'];
            }
            if( obj['html'] ) {
                el.innerHTML = obj['html'];
            }
            
            return el;
        } catch( error ) {
            log( error );
        }
    },

    /**
     * Add one or more classes to a HTMLElement
     * 
     * @param {String} cls A string containing one or more classes
     * @param {HTMLElement} el HTMLElement the classes are added on.
     * @returns HTMLElement
     */
    addClasses: function( cls, el ) {
        if( cls != "" && cls != null ) {
            if( cls.indexOf( ' ' ) == -1 ) {
                el.classList.add( cls );
            } else {
                var cs = cls.split( ' ' );
                cs.forEach( c => el.classList.add( c ) );
            }
        }
        return el;
    },

    /**
     * Add attributes to HTMLElement
     * 
     * @param {Object} att A object containing attribute definitions
     * @param {HTMLElement} el HTMLElement the attributes are added on.
     * @returns HTMLElement
     */
    addAttributes: function( att, el ) {
        var keys = Object.keys( att );
        for( var i = 0; i < keys.length; i++ ) {
            el.setAttribute( keys[i], att[keys[i]] );
        }
        return el;
    },

    /**
     * Create a bootstrapModal
     * 
     * @param {Object} data A object containing a bootstrap body definition
     * @returns bootstrapModal HTMLElement 
     */
    bootstrapModal: function( data ) {
        let mbody       = null;
        let id          = "";
        let title       = "";
        let printable 	= "";
        let btn         = false;

        let modalBodyContent    = this.getBootstrapBody( data );
        id                      = modalBodyContent.id;
        title                   = modalBodyContent.title;
        mbody                   = modalBodyContent.body;
        printable               = modalBodyContent.printable ? 'print' : "";
        if( modalBodyContent.btn !== null && modalBodyContent.btn !== false && modalBodyContent.btn !== undefined && modalBodyContent.btn !== 'undefined' ) {
            btn = modalBodyContent.btn;
        } else {
            btn = false;
        }
        
        let modal           = build.element( { type: 'div', class: 'modal fade', id: 'modal_'+id, attributes: { tabindex: '-1' } } );
        let modaldialog     = build.element( { type: 'div', class: 'modal-dialog modal-xl' } );
        let modalcontent    = build.element( { type: 'div', class: 'modal-content' } );
        let modalheader     = build.element( { type: 'div', class: 'modal-header' } );
        let modalbody       = build.element( { type: 'div', class: 'modal-body' } ); 
        let modalfooter     = build.element( { type: 'div', class: 'modal-footer' } );

        modalheader.appendChild( build.element( { type: 'h5', class: 'modal-title', text: title } ) );
        modalheader.appendChild( build.element( { type: 'button', class: 'btn-close', attributes: { 'data-bs-dismiss': 'modal', type: 'button' } } ) );

        if( mbody != null ) {
            let size = Object.size( mbody )
            if( size > 0 ) {
                for( let i = 0; i < size; i++ ) {
                    modalbody.appendChild( mbody[ Object.keys( mbody )[i] ] );
                }
            } else {
                modalbody.appendChild( mbody );
            }
        }

        if( btn !== false ) {
            modalfooter.appendChild( btn );
        }
        
        if( printable != "" ) {
            modalfooter.appendChild( build.element( { type: 'a', class: 'btn btn-outline-success', text: 'Udskriv liste', attributes: { onclick: 'window.print();' } } ) );
        }
        modalfooter.appendChild( build.element( { type: 'button', class: 'btn btn-outline-secondary', attributes: { 'data-bs-dismiss': 'modal', type: 'button' }, text: 'Luk' } ) );

        modalcontent.appendChild( modalheader );
        modalcontent.appendChild( modalbody );
        modalcontent.appendChild( modalfooter );
        modaldialog.appendChild( modalcontent );
        modal.appendChild( modaldialog );
        return modal;
    }
};
