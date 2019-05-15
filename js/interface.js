var toggle_course_program = document.querySelector("input[name=toggle_course_program]");
var courseButton = document.querySelector("#interpret_courses");
var programButton = document.querySelector("#interpret_programs");
var debug_toggle = document.querySelector("input[name=toggle_debug]");
var debug_content = document.querySelector("#debug_content");
var merge_toggle = document.querySelector("input[name=toggle_merge]");
var merge_toggle_switch = document.querySelector("label.switch.toggle_merge");
document.catalogObj.merge = false;

// default settings:
document.catalogObj.mode = 'courses';
console.log('mode:' + document.catalogObj.mode);
toggle_course_program.addEventListener( 'change', function() {
    if(this.checked) {
    	document.catalogObj.mode = 'programs';
    	courseButton.classList.add("disabled");
    	programButton.classList.remove("disabled");
    	merge_toggle_switch.classList.remove("disabled");
    	toggle_ags_trad_switch.classList.add("disabled");
    	ags_trad_button.classList.add("disabled");
    	toggle_ags_trad.classList.add("disabled");
    } else {
     	document.catalogObj.mode = 'courses';
    	courseButton.classList.remove("disabled");
    	programButton.classList.add("disabled");
    	merge_toggle_switch.classList.add("disabled");
    	toggle_ags_trad_switch.classList.remove("disabled");
    	ags_trad_button.classList.remove("disabled");
    	toggle_ags_trad.classList.remove("disabled");
    }
   	console.log('mode:' + document.catalogObj.mode);
});

var toggle_ags_trad_switch = document.querySelector(".switch.toggle_ags_trad");
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


merge_toggle.addEventListener( 'change', function() {
    if(this.checked) {
    	document.catalogObj.merge = true;
    	programButton.classList.add("and_merge");
	   	programButton.innerHTML = "Interpret Programs & Merge";
    } else {
	   	document.catalogObj.merge = false;
	   	programButton.classList.remove("and_merge");
	   	programButton.innerHTML = "Interpret Programs";
    }
   	console.log('merge:' + document.catalogObj.merge);
});

function htmlToClipboard(){
	let updateStatus = document.getElementById("status").textContent; 
	let outputHTML = document.getElementById("catalog_interpreter_output").outerHTML;
	let temp = document.createElement("input");
	document.body.appendChild(temp);
	temp.style.opacity = 0;
	temp.setAttribute('value',outputHTML);
	temp.select();
	console.log(outputHTML);
	document.execCommand("copy");
	updateStatus = "HTML has been Copied.<br>" + updateStatus;
	document.getElementById("status").innerHTML = updateStatus;
}