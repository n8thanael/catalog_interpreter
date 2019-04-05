var checkbox = document.querySelector("input[name=togglebox]");
var courseButton = document.querySelector("#interpret_courses");
var programButton = document.querySelector("#interpret_programs");

checkbox.addEventListener( 'change', function() {
    if(this.checked) {
    	courseButton.classList.add("disabled");
    	programButton.classList.remove("disabled");
    } else {
    	courseButton.classList.remove("disabled");
    	programButton.classList.add("disabled");
    }
});