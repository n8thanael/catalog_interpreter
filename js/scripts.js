/*
 *
 *  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
 *
Running file through the interpreter to find errors... shouldn't be long until I switch
CM426P -- fixed it
CD213 -- Amphersan appears in title: Fixed it
CD313 (unsure of error)
CD211 - error: spaces were found after course number value
CD491 - Description starts with CD491 - solved with Positive look-ahead (?= [A-Z]) var regex_a
CD313 - error: Fixed issue with spaces after course number value
CD495 - Error with course number value needs to be 2 digits
GB201 - Error Course name has an astrics
MU385 - Course credit value can be actually be:  "(0 or 1)" to accomodate
SS205 - Course name contains dates: SS205 United States History I: 1492 – 1877 which have a different type of dash: –
WL425 - Course credit value is 1-6 -- needs to be "(1-6)" in parenthesis to accomodate -- need to imporove on prior system of () recognition to allow for any interals.
 * catch and fix mistakes in formatting where a return character should be found between "# weeks This" -> ([\s\S]*\d weeks)([ ]*)(This[\s\S]*)
HSV4000 - expand this capability to fix formatting tab characters should be found: (3 credits) 5 weeks Students ([\s\S]*\)[ ]{1,2}\d weeks)([ ]*)([A-Z]{1}[a-z]{3}[\s\S]*)
BIB2010 - Having trouble with the "/" in the title  -- Fixed by expanding the capability of nterpretObject_d's regex_d
MINE0000 - oops, swapped weeks & values
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
 *		[A-Z]{2,4}[0-9]{3,4})    			-- the character set: AB123 or ABCD1234 
 *		|									-- or    
 *		[A-Z]{2} \| [A-Z ]{2,20}[\r\n]		-- matches: "CD | CHEMICAL DEPENDENCY" or "CE | CHRISTIAN EDUCATION"   </Group#1>
 *	 
 */
function interpretPaste_a(){
	var string = "▐▐\r\n" + document.getElementById("paste").value + "\r\n▐▐";
	var regex_a = /^[ ]{0,3}([A-Z]{2,4}[0-9]{3,4}-[A-Z]{1,3}(?= [A-Z])|[A-Z]{2,4}[0-9]{3,4}(?= [A-Z])|[A-Z]{2} \| [A-Z ]{2,20}[\r\n])/gm;	
	/* it was found that this regex did not ignore descriptions where the first word was a course code such as: "CD491 and CD492 introduce the student..."
	 *	var regex_a = /^[ ]{0,3}([A-Z]{2,4}[0-9]{3,4}-[A-Z]{1,3}|[A-Z]{2,4}[0-9]{3,4}|[A-Z]{2} \| [A-Z ]{2,20}[\r\n])/gm;
	 */
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
    // console.log(array);
}

/*
 *	Starts buliding the document.className array
 *	^												-- starts at a new line
 *		[ ]{0,3}									-- a "space" from none upto 3 times
 *		([A-Z]{2,4}[0-9]{3,4}[A-Z]{0,1}-[A-Z]{1,3}	-- <Group#1> the character set: ABCD1234-ABC or CM426P
 *		|											-- or                                   
 *		[A-Z]{2,4}[0-9]{3,4}[A-Z]{0,1})    			-- the character set: AB123 or CM426P or ABCD1234 </Group#1>  
 *		(a-zA-Z ’'`.,&\-\/() ]*)					-- <Gropu#2> matches any Letter or Digit or characters: "*’'`'.,&:-/() " a greedy amount of times
 *		([\s])										-- <Gropu#3> any space-character tab or return character such as:  [\r\n\t\f\v ]		
 */
function interpretArray_c(){
	document.catalogObj.courses = [];
	var regex_c = /^[ ]{0,3}([A-Z]{2,4}[0-9]{3,4}[A-Z]{0,1}-[A-Z]{1,3}|[A-Z]{2,4}[0-9]{3,4}[A-Z]{0,1})([a-zA-Z\d *’'`.,&:\-\–\/() ]*)([\s])/;
	for(var i = 0; i < document.catalogObj.rawArray.length; i++){ 
		var thisCourse = {};
		let title = "", className = "", matchGroups = [];
		var value = repairMissingCharacters(document.catalogObj.rawArray[i]);
		//console.log(value);
		matchGroups = value.match(regex_c);
		if(matchGroups && matchGroups.length > 0){
			className = matchGroups[1] ? matchGroups[1] : undefined;
			title = matchGroups[2] ? matchGroups[2] : undefined;
			// console.log(className);
			thisCourse[className] = {};
			thisCourse[className].value = value.trim();
			// it's possible there is a missing course number
			// if this is the case, there may likely be a "double" return character
			// this would signify that that should be the true end of the description... 
			if(thisCourse[className].value.search(/[\v\r\n]{2}/gm) != -1){
				var position = thisCourse[className].value.search(/[\v\r\n]{2}/gm);
				var firstPart = thisCourse[className].value.substr(0,position);
				var lastPart = thisCourse[className].value.substr(position);
				thisCourse[className].value = firstPart;
				thisCourse[className + "_error_1"] = {};
				// console.log('FP:' + firstPart + "|LP" + lastPart);
				thisCourse[className + "_error_1"].value = lastPart;
			}
			thisCourse[className].id = className.trim();
			thisCourse[className].titleFull = title.trim();
			thisCourse[className] = interpretObject_e(interpretObject_d(thisCourse[className]));
		} else if(value) {
			classname = '_error_' + i; 
			thisCourse['error_' + i] = value;
		}
		document.catalogObj.courses.push(thisCourse);
	}
}


/*
 * Processes the obj.title to extract title, credits and/or weeks values
 * it then splits and adds more properties to the object before returning it
 *  var regex_d = /^([a-zA-Z\d *’'`.,&:\-\–\/() ]*)(\([\w\d ]*\))([\d ]* weeks| week)$/;
 *	^									-- starts at a new line
 *  ([a-zA-Z\d *’'`.,&:\-\–\/() ]*)		-- <Group#1> matches any Word or Digit or characters: "a-zA-Z# *’'`.,&:-–/() " a greedy amount of times
 *  (\([\w\d ]*\))						-- <Group#2> matches "(" and any word or digit or space a greedy amount of times ending in ")"
 *  ([\d ]* weeks| week)				-- <Group#3> matches any number or space a greedy amount of times looking for "weeks" or "week" following 
 *	$									-- End of line reached
 */ 
function interpretObject_d(obj){
	var regex_d = /^([a-zA-Z\d *’'`.,&:\-\–\/() ]*)(\([\w\d ]*\))([\d ]* weeks| week)$/;
	var matchGroups = [];
	var pos;
	obj.titleText = "";
	obj.weeksText = "";
	obj.weeksValue = "";
	obj.creditsText = "";
	obj.creditsValue = "";
	//console.log(obj);
	matchGroups = obj.titleFull.match(regex_d);
	if(matchGroups && matchGroups.length > 0){
		obj.titleText = matchGroups[1] ? matchGroups[1].trim() : undefined;
		obj.weeksText = matchGroups[3] ? matchGroups[3].trim() : undefined;
		pos = obj.weeksText.search(/\d/);
		obj.weeksValue = obj.weeksText.charAt(pos);
		obj.creditsText = matchGroups[2] ? matchGroups[2].trim() : undefined;
		pos = obj.creditsText.search(/\d/);
		obj.creditsValue = obj.creditsText.charAt(pos);
	}
	return obj;
}

/*
 * Processes the obj.value to extract:
 * - Designed to separate from the description from the title especially pulling out credit values and weeks etc.
 *  regex_e1:/^[\d]{1,2}[ ]{0,3}[\r\n]{1}/;

 *
 *  Special for TRAD -- if the creditsValue is blank...we need to account for that and get it from TRAD Courses 
 *  regex_e3: /^[a-zA-Z\d *’'`.,&:\-\–\\/() ]{3,60})([ \t]*)([\d]{1,2}|\([\d] or [\d]\)|\([\d]{1,2}[\-\–][\d]{1,2}\))([ ]{0,3}[\r\n])([\s\S]*)/
 *  This regex is designed to research the description for a missing title-part that may exist becasue a return character has separated the title in TRAD Books
 *  ^([a-zA-Z *’'`.,\-\/() ]{3,60})		-- at the start of the line the <Group#1> matches any letters or characters from 3-60 times
 *  ([ \t]*)							-- <Group#2> contains an unlimited amount of spaces or tabs which will not be recorded
 *  ([\d]{1,2}							-- <Group#3> matches up to "2" the credits-digits 
 		|\([\d] or [\d]\)				-- OR it matches: (# or #)
 		|\([\d]{1,2}[\-\–][\d]{1,2}\))	-- OR it matches: (#-#)			
 *  ([\r\n])							-- <Group#4> matches the return character after this digit - which will not be recorded
 *  ([\s\S]*)							-- <Group#5> matches any remaining charcter of anytype an unlimited amount of times
 */
function interpretObject_e(obj){
	var regex_e1 = /^[\d]{1,2}[ ]{0,3}[\r\n]{1}/; // TRAD catches 1-2 credit digits
	var regex_e3 = /^([a-zA-Z\d *’'`.,&:\-\–\/() ]{3,60})([ \t]*)([\d]{1,2}|\([\d] or [\d]\)|\([\d]{1,2}[\-\–][\d]{1,2}\))([ ]{0,3}[\r\n])([\s\S]*)/;
	var regex_e4 = /^[ ]*(\([\d] or [\d]\)|\([\d]{1,2}[\-\–][\d]{1,2}\))([ ]*[\r\n])([\s\S]*)/;  // TRAD catches (0 or 1)
	var matchGroups = [];
	obj.description = "";

	obj.description = obj.value.replace(obj.id,'');
	obj.description = obj.description.replace(obj.titleFull,'').trim();
	//obj.position = obj.description.search(regex_e);

    // is it a TRAD Course - than creditsValue is blank?
    // The credit value is most likely at the start of the description
	if(obj.creditsValue === ""){
		obj.creditsValue = obj.description.match(regex_e1);
		if(obj.creditsValue !== null){
			// found the credits value - the rest is the description
			obj.creditsValue = obj.creditsValue[0].replace(/\v|\r|\n/gm,' ').trim();
		} else {
			// didn't find the credits value...maybe there was a return character in the title
			// or maybe the credits value is actually: (0 or 1) and not a set of digits
			// if so...must rebuild both Title & Description and finally set the credits value
			// console.log(obj.description + "--" + obj.id);
			matchGroups = obj.description.match(regex_e3);
			if(matchGroups && matchGroups.length > 0){
				// add the missing title text back to the title
				obj.titleText = matchGroups[1] ? obj.titleFull + " " + matchGroups[1].trim() : obj.titleText;
				// set the newly discovered creditsValue
				obj.creditsValue = matchGroups[3] ? matchGroups[3].trim() : "";
				// set the remaining descripion that doesn't contain the missing title portion or creditsValue
				obj.description = matchGroups[5] ? matchGroups[5].trim() : obj.description ;
			} else if(Array.isArray(obj.description.match(regex_e4))) {
				matchGroups = obj.description.match(regex_e4);
				// the system detected that there was a (0 or 1) instead of a well formed set of digits
				obj.creditsValue = matchGroups[1] ? matchGroups[1].trim() : "";
				obj.description = obj.description.replace(matchGroups[1],'').trim();
			} else {
				// IDK ... there is a problem
				var error = {}
				error[obj.id + "_error_2"] = obj.description;
				document.catalogObj.courses.push(error);
			}
		}
	}

	// Split up the description into proper pieces
	obj = setDescriptionPieces(obj);
	return obj;
}

/*
 * receives catalog obj
 * -> obj.description should be well-formed relative to the progress of this program with the title not present
 * creates and array of words and attempts to detect matches of keywords that let us know if the description has ended
 * breaks out those keywords and their pieces and returns as a new object
 * \v|\r|\n|\t|[a-z] :|[ ]{2,}/gm,' '  --> Replaces any:  return, | letter(space): | (space)x2 or more with a single space
 */
function setDescriptionPieces(obj){
	// elminated all return characters and other problematic spacing
	regex_code = /[A-Z]{2,4}[0-9]{3,4}-[A-Z]{1,3}[A-Z]{0,1}|[A-Z]{2,4}[0-9]{3,4}[A-Z]{0,1}/;
	var desc = obj.description.replace(/\v|\r|\n|\t|[a-z] :|[ ]{2,}/gm,' ');
	// create an array of all single words separated by (space)
	descArray = desc.split(" ");
	// toggle is capable of later applying a case/system that watched for key words and acted differently based on those... see notes below
	var toggle = "";
	var result = null;
	var match = "";
	obj.descPre = "";
	obj.descPost = "";
	obj.preCodes = [];
	obj.coCodes = [];
	obj.errCodes = [];

	descArray.forEach(function(value){
		var valueClean = value.replace(/[:;,\/ ]/,"");
		if((typeof valueClean) === "string"){
			valueClean = valueClean.toLowerCase();
		}


		// singular cases of certain words must be forced to plural
		switch(valueClean){
			case "prerequisite":
				valueClean = "prerequisites";
				break;
			case "corequisite":
				valueClean = "corequisites";
				break;
		}

		if(toggle == ""){
			if(checkAgainstArray(value)){
				// TRUE - it's in the list of possible course-properties that end the description
				// since the toggle is placed to the "clean value" - it would be possible to make a more complex system
				toggle = valueClean;
				obj.descPost += '\r\n' + value + " ";
			} else {
				// no results match push to pre description
				obj.descPre += value + " ";
			}
		// toggle has a value
		} else {
			// if we've run into another word to toggle recording actions, change toggle to setup data output on the next run
			if(checkAgainstArray(value)){
				toggle = valueClean;
				obj.descPost += '\r\n' + value + " ";
			} else {
				// It would be possible here at a later time to create a complex toggle/based assignment system
				// This would to push unique values to separate fields for re-construction in to the array system
				// As an example the folloing based on 'toggle' with push the course code to the appropriate output object array

				// are we dealing with a course code?
				if((typeof valueClean) === "string"){
					valueClean = valueClean.toUpperCase();
					match = valueClean.match(regex_code);
					if(match){
						result = valueClean.match(regex_code)[0];
						if(result !== null){
							switch(toggle){
								case "prerequisites" :
									obj.preCodes.push(result);
									break;
								case "corequisites" :
									obj.coCodes.push(result);
									break;
								default:
									obj.errCodes.push(result);
							}
						}
					}
				}
			obj.descPost += value + " ";
			}
		}
	});

	obj.descPre = obj.descPre.trim();
	obj.descPost = obj.descPost.trim();
	return obj;
}


/*
 * Checks the value against a list of possible course-properties that end the description
 * returns: true|false
 */  
function checkAgainstArray(value){
	value = value.toLowerCase();
	var array = ['prerequisite:','prerequisites:','corequisites:','corequisite:','offered:','fee:','pass/fail','repeatable'];
	var result = false;
	for(var i = 0; i < array.length; i++ ){
		result = (value == array[i]) ? true : false;
		if(result){
			return result;
		}
	}
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
	let output = "";
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

/*
 * catch and repair mistakes in formatting where a return character should be found between "# weeks This" -> ([\s\S]*\d weeks)([ ]*)(This[\s\S]*)
 * recieves a string, checks for error and returns either a newly formatted outputString, or the original string 
 */
function repairMissingCharacters(string){
	outputString = '';
	// regex_z1 = /([\s\S]*\d weeks)([ ]*)(This[\s\S]*)/;
	regex_z2 = /([\s\S]*\)[ ]{1,2}\d weeks)([ ]*)([A-Z]{1}[a-z]{3}[\s\S]*|A [a-z]{3}[\s\S]*)/;
	if(string.length > 0){
		var matchGroups = string.match(regex_z2);
		if(Array.isArray(matchGroups)){
			// console.log(matchGroups);
			outputString = matchGroups[1] ? matchGroups[1].trim() + "\t" : "";
			outputString += matchGroups[3] ? matchGroups[3].trim() : "";
			return outputString;
		}
	}
	return string;
}


/*

Incompatibilities:
TRAD CATALOG:
1.)	Junior Recital MU385 & MU485 to have a [TAB] instead of spaces
	Also if they don't end in a number, I need it in perenthasis: (0 or 1) please

2.) WL425 Worship Leader Internship	1-6
	Needs to be: (1-6)

*/
