var toggle_course_program = document.querySelector("input[name=toggle_course_program]");
var courseButton = document.querySelector("#interpret_courses");
var programButton = document.querySelector("#interpret_programs");
var debug_toggle = document.querySelector("input[name=toggle_debug]");
var debug_content = document.querySelector("#debug_content");

toggle_course_program.addEventListener( 'change', function() {
    if(this.checked) {
    	courseButton.classList.add("disabled");
    	programButton.classList.remove("disabled");
    } else {
    	courseButton.classList.remove("disabled");
    	programButton.classList.add("disabled");
    }
});

var toggle_ags_trad = document.querySelector("input[name=toggle_ags_trad]");
var ags_trad_button = document.querySelector("#ags_trad");

toggle_ags_trad.addEventListener( 'change', function() {
    if(this.checked) {
    	ags_trad_button.innerHTML = 'TRAD';
    	ags_trad_button.classList.add("trad");
    } else {
    	ags_trad_button.innerHTML = 'AGS';
    	ags_trad_button.classList.remove("trad");
    }
});


debug_toggle.addEventListener( 'change', function() {
    if(this.checked) {
    	document.catalogObj.debug = true;
    	console.log('debug on');
    	debug_content.classList.remove("d-none");
    } else {
    	document.catalogObj.debug = false;
    	console.log('debug off');
    	debug_content.classList.add("d-none");
    }
});