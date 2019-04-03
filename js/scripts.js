/*
 *
 *  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
 *
 Still working in "E" filling out he arrays that are used to power the website.
 *
 *  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
 *
 */


/* do I need to check if it's an object? https://stackoverflow.com/questions/4186906/check-if-object-exists-in-javascript  
if (typeof courseCatalog != "undefined") {
   alert("GOT THERE");
}*/

function output(){
	document.getElementById("dump").innerHTML = JSON.stringify(courseCatalog, null, 2);
}

function interpretPaste(){
	document.paste = document.getElementById("paste").value;
	loadClasses(courseCatalog);
	// prettyPrintJson(courseCatalog);
}

/*
 *	this step adds all "▐▐" (ALT+222) to anything that matches:
 *	^										-- starts at a new line
 *		[ ]{0,3}							-- a "space" from none upto 3 times
 *		([A-Z]{2,4}[0-9]{3,4}-[A-Z]{1,3}	-- <Group#1> the character set: ABCD1234-ABC 
 *		|									-- or                                   
 *		[A-Z]{2,4}[0-9]{3,4})    			-- the character set: AB123 or ABCD1234 </Group#1>  
 *	 
 */
function interpretPaste_a(){
	var string = "▐▐\r\n" + document.getElementById("paste").value + "\r\n▐▐";
	var regex_a = /^[ ]{0,3}([A-Z]{2,4}[0-9]{3,4}-[A-Z]{1,3}|[A-Z]{2,4}[0-9]{3,4})/gm;
	var result = string.replace(regex_a,'▐▐$1')
    document.getElementById("dump").innerHTML = result;
}

/*
 *  Starts the document.result.raw array
 *	.split('▐▐') looks breaks up the content into an array by using the double bars [ALT+222] as separators
 */
function interpretPaste_b(){
	document.catalogObj = {};
	var array = [];
	var string = document.getElementById("paste").value;
	var array = string.split('▐▐');
	document.catalogObj.rawArray = array;
    document.getElementById("dump").innerHTML = array;
    console.log(array);
}

/*
 *	Starts buliding the document.className array
 *	^										-- starts at a new line
 *		[ ]{0,3}							-- a "space" from none upto 3 times
 *		([A-Z]{2,4}[0-9]{3,4}-[A-Z]{1,3}	-- <Group#1> the character set: ABCD1234-ABC 
 *		|									-- or                                   
 *		[A-Z]{2,4}[0-9]{3,4})    			-- the character set: AB123 or ABCD1234 </Group#1>  
 *		(\w\d.,\-() ]*)						-- <Gropu#2> matches any Word or Digit or characters: "’'`'.,:-/() " a greedy amount of times
 *		([\s])						`		-- <Gropu#3> any space-character tab or return character such as:  [\r\n\t\f\v ]		
 */
function interpretArray_c(){
	document.catalogObj.courses = [];
	var regex_c = /^[ ]{0,3}([A-Z]{2,4}[0-9]{3,4}-[A-Z]{1,3}|[A-Z]{2,4}[0-9]{3,4})([\w\d’'`.,:\-\/() ]*)([\s])/;
	for(var i = 0; i < document.catalogObj.rawArray.length; i++){ 
		var thisCourse = {};
		let title = '', className = '', matchGroups = [];
		var value = document.catalogObj.rawArray[i];
		matchGroups = value.match(regex_c);
		//console.log(matchGroups);
		if(matchGroups && matchGroups.length > 0){
			className = matchGroups[1] ? matchGroups[1] : undefined;
			title = matchGroups[2] ? matchGroups[2] : undefined;
			// console.log(className);
			thisCourse[className] = {};
			thisCourse[className].value = value.trim();
			// it's possible the is a missing course number
			// if this is the case, there may likely be a "double" return character
			// this would signify that that should be the true end of the description... 
			if(thisCourse[className].value.search(/[\v\r\n]{2}/gm) != -1){
				var position = thisCourse[className].value.search(/[\v\r\n]{2}/gm);
				var firstPart = thisCourse[className].value.substr(0,position);
				var lastPart = thisCourse[className].value.substr(position);
				thisCourse[className].value = firstPart;
				thisCourse[className + "_error"] = {};
				thisCourse[className + "_error"].value = lastPart;
				console.log(thisCourse[className + "_error"]);
			}
			thisCourse[className].id = className.trim();
			thisCourse[className].titleFull = title.trim();
			thisCourse[className] = interpretObject_e(interpretObject_d(thisCourse[className]));
		} else if(value) {
			// console.log(value);
			classname = 'error_' + i; 
			thisCourse['error_' + i] = value;
		}
		document.catalogObj.courses.push(thisCourse);
	}
}


/*
 * Processes the obj.title to extract title, credits and/or weeks values
 * it then splits and adds more properties to the object before returning it
 *  ^([\w\d.,:\- ]*)(\([\w\d ]*\))([\d ]* weeks| week)$
 *	^						-- starts at a new line
 *  ([\w\d.,:\- ]*)		    -- <Group#1> matches any Word or Digit or characters: ".,:-() " a greedy amount of times
 *  (\([\w\d ]*\))			-- <Group#2> matches "(" and any word or digit or space a greedy amount of times ending in ")"
 *  ([\d ]* weeks| week)	-- <Group#3> matches any number or space a greedy amount of times looking for "weeks" or "week" following 
 *	$						-- End of line reached
 */ 
function interpretObject_d(obj){
	var regex_d = /^([\w\d.,:\- ]*)(\([\w\d ]*\))([\d ]* weeks| week)$/;
	var matchGroups = [];
	var pos;
	obj.titleText = '';
	obj.weeksText = '';
	obj.weeksValue = '';
	obj.creditsText = '';
	obj.creditsValue = '';
	//console.log(obj);
	matchGroups = obj.titleFull.match(regex_d);
	if(matchGroups && matchGroups.length > 0){
		obj.titleText = matchGroups[1] ? matchGroups[1].trim() : undefined;
		obj.weeksText = matchGroups[2] ? matchGroups[2].trim() : undefined;
		pos = obj.weeksText.search(/\d/);
		obj.weeksValue = obj.weeksText.charAt(pos);
		obj.creditsText = matchGroups[3] ? matchGroups[3].trim() : undefined;
		pos = obj.creditsText.search(/\d/);
		obj.creditsValue = obj.creditsText.charAt(pos);
	}
	return obj;
}

/*
 * Processes the obj.value to extract:
 * - Format Description apart from:
 * - Notes/Prerequisite(s)/Recommendation(s) - in a raw format as to prepare for their own extraction
 * - Eliminate any return Characters from these if they appear
 * - Designed to separate from the description any "word or pattern" that separates the post-description
 *   ^Prerequisites: |Prerequisite: |Prerequisites:|Prerequisite:|Recommendations: |Recommendations: |Recommendation: |Recommendations:|Recommendation:
 *   ^\d\v -- looks for a digit at the beginning of the description (TRAD formatted descriptions)
 *   Basically runs through every [OR] possibilty of Prerequistes: or Recommendations: to find the first real "break" in the description
 *
 *  Special for TRAD -- if the creditsValue is blank...we need to account for that and get it from TRAD Courses 
 *  regex_e3: /^([a-zA-Z ’'`.,\-\/() ]{3,60})([ \t]*)(\d)([\r\n])([\s\S]*)/
 *  This regex is designed to research the description for a missing title-part that may exist becasue a return character has separated the title in TRAD Books
 *  ^([a-zA-Z ’'`.,\-\/() ]{3,60})		-- at the start of the line the <Group#1> matches any letters or characters from 3-60 times
 *  ([ \t]*)							-- <Group#2> contains an unlimited amount of spaces or tabs which will not be recorded
 *  (\d)								-- <Group#3> matches the credits-digit which we will keep
 *  ([\r\n])							-- <Group#4> matches the return character after this digit - which will not be recorded
 *  ([\s\S]*)							-- <Group#5> matches any remaining charcter of anytype an unlimited amount of times
 */
function interpretObject_e(obj){
	var regex_e = /^Prerequisites: |Prerequisite: |Prerequisites:|Prerequisite:|Recommendations: |Recommendations:|Recommendation: |Recommendation:/gm;
	var regex_e2 = /^\d[\r\n]{1}/;
	var regex_e3 = /^([a-zA-Z ’'`.,\-\/() ]{3,60})([ \t]*)(\d)([\r\n])([\s\S]*)/;
	var matchGroups = [];
	obj.description = '';
	obj.post_description = '';

	obj.description = obj.value.replace(obj.id,'');
	obj.description = obj.description.replace(obj.titleFull,'').trim();
	obj.position = obj.description.search(regex_e);

    // is it a TRAD Course - than creditsValue is blank?
    // The credit value is most likely at the start of the description
	if(obj.creditsValue === ""){
		obj.creditsValue = obj.description.match(regex_e2);
		if(obj.creditsValue !== null){
			// found the credits value - the rest is the description
			obj.creditsValue = obj.creditsValue[0].replace(/\v|\r|\n/gm,' ').trim();
		} else {
			// didn't find the credits value...maybe there was a return character in the title
			// if so...must rebuild both Title & Description and finally set the credits value
			matchGroups = obj.description.match(regex_e3);
			if(matchGroups && matchGroups.length > 0){
				// console.log(matchGroups);
				// add the missing title text back to the title
				obj.titleText = matchGroups[1] ? obj.titleFull + " " + matchGroups[1].trim() : obj.titleText;
				// set the newly discovered creditsValue
				obj.creditsValue = matchGroups[3] ? matchGroups[3].trim() : "";
				// set the remaining descripion that doesn't contain the missing title portion or creditsValue
				obj.description = matchGroups[5] ? matchGroups[5].trim() : obj.description ;
			} else {
				// IDK ... there is a problem
				var error = {}
				error[obj.id + "_error"] = obj.description;
				document.catalogObj.courses.push(error);
			}
		}
	}
    
	// Designed to catch the position of the first instance of Prerequisite or Recommendations -- need to change for trad to match more "split-words" between the description and the details
	if(obj.position > 0){
		obj.post_description = obj.description.substring(obj.position,obj.description.length);
		obj.description = obj.description.substring(0,obj.position);
	} else {
		obj.description = obj.description.replace(/\v|\r|\n/gm,' ')
	}

	return obj;
}



/*
 * loads the Catalog's classes into document.CLASSNAME such as
 * document.POL3100 and provides ease-of-access to show it.  This
 * structure must alreay exist from a properly formed json file
 * that is structured thus:
 *   miscCatalog = {
 *	    "courses": [ 
 *		  {"CLASS1000" : {	
 */ 
function loadClasses(obj){
	Object.getOwnPropertyNames(obj).forEach(key => {
		let value = obj[key];
		if(key == "courses"){
			Object.values(obj[key]).forEach(subvalue => {
				Object.getOwnPropertyNames(subvalue).forEach(key2 => {
					let value2 = subvalue[key2];
					document[key2] = value2;
				});				
			});
		}
	});
}

/*
 * pretty-prints the JSON to the screen at #dump 
 */ 
function prettyPrintJson(obj){
	let output = '';
	Object.getOwnPropertyNames(obj).forEach(key => {
		let value = obj[key];
		if(key == "courses"){
			output = output + "<br>" + key + ": ";
			Object.values(obj[key]).forEach(subvalue => {
				Object.getOwnPropertyNames(subvalue).forEach(key2 => {
					let value2 = subvalue[key2];
					output = output + "<br>&#09;" + key2 + ": ";
					Object.getOwnPropertyNames(value2).forEach(key3 => {
						let value3 = value2[key3];
						output = output + "<br>&#09;&#09;" + key3 + ": " + value3;
					});	
				});				
			});
		} else {
		output = output + "<br>" + key + ": " + value;
		}
	});

	document.getElementById("dump").innerHTML = course + ": <br>" + output;
}

/* discover 

/*
sofar:
^(|\s)([A-Z]{3,4}[0-9]{3,4}|[A-Z]{3,4}[0-9]{3,4}-[A-Z]{1,3})\s{0,1}([a-zA-z\d\s\(\)]{1,}([^\n]*))

Works...
^(|\s)([A-Z]{3,4}[0-9]{3,4}-[A-Z]{1,3}|[A-Z]{3,4}[0-9]{3,4})\s{0,1}([a-zA-z\d (\)]{1,50}[\r\n]{0,1})

Sofar.... trying to limit
^(|\s)([A-Z]{3,4}[0-9]{3,4}-[A-Z]{1,3}|[A-Z]{3,4}[0-9]{3,4})\s{0,1}([a-zA-z\d() ]{1,50})([\s]{1,50})([\w\W\D\s]*)(?=( [A-Z]{3,4}[0-9]{3,4}-[A-Z]{1,3}| [A-Z]{3,4}[0-9]{3,4}))


Kinda works ... forward look-ahead does eliminate the next tone... but also doesn't catch it :-( 
^(|\s)([A-Z]{3,4}[0-9]{3,4}-[A-Z]{0,3}|[A-Z]{3,4}[0-9]{3,4})\s{0,1}([a-zA-z\d() ]{0,50})([\s]{1,50})(.*)(?=(|\s)([A-Z]{3,4}[0-9]{3,4}-[A-Z]{0,3}|[A-Z]{3,4}[0-9]{3,4}))

Close but doesn't capture return spaces that shouldn't be there...
^(|\s)([A-Z]{3,4}[0-9]{3,4}-[A-Z]{0,3}|[A-Z]{3,4}[0-9]{3,4})\s{0,1}([a-zA-z\d() ]{0,50})([\s]{1,50})(.*)(?=( |\s))

Left off with this one
\s([A-Z]{3,4}[0-9]{3,4}-[A-Z]{0,3}|[A-Z]{3,4}[0-9]{3,4})\s{0,1}([a-zA-z\d() ]{0,99})([\s]{1,50})
Basically I need to find the end of the block with something and capture everything else until the next "Hit"

My Lastest:

^(?<code>(|\s)[A-Z]{3,4}[0-9]{3,4}|[A-Z]{3,4}[0-9]{3,4}-[A-Z]{1,3})([\s\S]*?)(?=\k<code>)

Names this group: <code>
(|\s)[A-Z]{3,4}[0-9]{3,4}|[A-Z]{3,4}[0-9]{3,4}-[A-Z]{1,3})
Any thing Group
([\s\S]*?)
Look ahead for the code group again and do not match
(?=\k<code>)


----> Got it, first I have to replace any code-instance found on the first line with a "~~""
^(?<code>(|[ ]{0,3})[A-Z]{3,4}[0-9]{3,4}|[A-Z]{3,4}[0-9]{3,4}-[A-Z]{1,3})([\s\S]*?)(?=~~)

----> First replace anthing this matches with "~~" prior to that group
^((|[ ]{0,3}[A-Z]{3,4}[0-9]{3,4}|[A-Z]{3,4}[0-9]{3,4}-[A-Z]{1,3})


(Prerequisites: |Prerequisite: |Prerequisites:|Prerequisite:)
*/

