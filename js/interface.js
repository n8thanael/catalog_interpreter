var toggle_course_program = document.querySelector("input[name=toggle_course_program]");
var courseButton = document.querySelector("#interpret_courses");
var programButton = document.querySelector("#interpret_programs");
var debug_toggle = document.querySelector("input[name=toggle_debug]");
var debug_content = document.querySelector("#debug_content");
var merge_toggle = document.querySelector("input[name=toggle_merge]");
var merge_toggle_switch = document.querySelector("label.switch.toggle_merge");
var title_output_toggle = document.querySelector("input[name=title_output_toggle]");
var html_output_toggle = document.querySelector("input[name=html_output_toggle]");
var unknown_output_toggle = document.querySelector("input[name=unknown_output_toggle]");
var all_html_controls = document.getElementById("all_html_controls");
var separate_html_controls = document.getElementById("separate_html_controls");
document.catalogObj.merge = false;
document.catalogObj.title_output_toggle = true;
document.catalogObj.html_output_toggle = true;
document.catalogObj.unknown_output_toggle = true;


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
        simulateClick(html_output_toggle);
    } else {
     	document.catalogObj.mode = 'courses';
    	courseButton.classList.remove("disabled");
    	programButton.classList.add("disabled");
    	merge_toggle_switch.classList.add("disabled");
    	toggle_ags_trad_switch.classList.remove("disabled");
    	ags_trad_button.classList.remove("disabled");
    	toggle_ags_trad.classList.remove("disabled");
        simulateClick(html_output_toggle);
    }
   	console.log('mode:' + document.catalogObj.mode);
});

// sending an element will also generate a click event on it 
function simulateClick(element) {
  let event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  element.dispatchEvent(event);
}

var toggle_ags_trad_switch = document.querySelector(".switch.toggle_ags_trad");
var toggle_ags_trad = document.querySelector("input[name=toggle_ags_trad]");
var ags_trad_button = document.querySelector("#ags_trad");
var title_output_toggle_label = document.querySelector("#title_output_toggle_label");
var html_output_toggle_label = document.querySelector("#html_output_toggle_label");
var unknown_output_toggle_label = document.querySelector("#unknown_output_toggle_label");

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

title_output_toggle.addEventListener( 'change', function() {
    if(this.checked) {
        document.catalogObj.title_output_toggle = true;
        title_output_toggle_label.classList.add("off");
        programButton.classList.add("and_merge");
        console.log('title_output_toggle on');
    } else {
        document.catalogObj.title_output_toggle = false;
        title_output_toggle_label.classList.remove("off");
        console.log('title_output_toggle off');
    }
});

unknown_output_toggle.addEventListener( 'change', function() {
    if(this.checked) {
        document.catalogObj.unknown_output_toggle = true;
        unknown_output_toggle_label.classList.add("off");
        programButton.classList.add("and_merge");
        console.log('unknown_output_toggle on');
    } else {
        document.catalogObj.unknown_output_toggle = false;
        unknown_output_toggle_label.classList.remove("off");
        console.log('unknown_output_toggle off');
    }
});

html_output_toggle.addEventListener( 'change', function() {
    if(this.checked) {
        all_html_controls.classList.add('hide');
        all_html_controls.classList.remove('show');
        separate_html_controls.classList.add('show');
        separate_html_controls.classList.remove('hide');
        document.catalogObj.html_output_toggle = true;
        html_output_toggle_label.classList.add("off");
        console.log('html_output_toggle on');
    } else {
        all_html_controls.classList.add('show');
        all_html_controls.classList.remove('hide');
        separate_html_controls.classList.add('hide');
        separate_html_controls.classList.remove('show');
        document.catalogObj.html_output_toggle = false;
        html_output_toggle_label.classList.remove("off");
        console.log('html_output_toggle off');
    }
});


function htmlToClipboard(targetId = ''){
    let updateStatus = document.getElementById("status").textContent; 
    document.addEventListener('copy', function(e){
      var text = html_beautify(document.getElementById(targetId).outerHTML.toString());
      e.clipboardData.setData('text/plain', text);
      e.preventDefault();
    });
    document.execCommand("copy");
    updateStatus = "HTML has been Copied.<br>" + updateStatus;
    document.getElementById("status").innerHTML = updateStatus;
}