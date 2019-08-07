/*
 *
 *  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
 *
 *  interpretPaste_a() -- NEEDS HELP WITH SPAN FLEX BOXES ETC.
 *  Need to get "exportation"
 *   -> Setup a txt. mapping file that lists [1000NID][TAB][Unique Title of Major] 
 *
 *  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
 *
 */


/* do I need to check if it's an object? https://stackoverflow.com/questions/4186906/check-if-object-exists-in-javascript  
if (typeof courseCatalog != "undefined") {
   alert("GOT THERE");
}*/

document.catalogObj = {};
document.catalogObj.missingCoursesForMerge = [];
var rawArray = [];

function interpretCourses(){
	var objDump = interpretArray_c(interpretPaste_b(interpretPaste_a()));
	// console.log(objDump);
	document.getElementById("dump").innerHTML = JSON.stringify(objDump, null, 2);
	document.getElementById("catalog_interpreter_output").innerHTML = convertCatalogObj2HTML();
	document.getElementById("status").innerHTML = reportCourses();
}

function interpretPrograms(){
	interpretPaste_b(interpretPaste_a());
	var objDump = interpretProgramArray_c();
	//console.log(dump(objDump,'none'));
	document.getElementById("dump").innerHTML = dump(objDump,'none');
	document.getElementById("status").innerHTML = reportPrograms();
	document.getElementById("catalog_interpreter_output").innerHTML = convertPrograms2HTML();
}

function output(){
	document.getElementById("dump").innerHTML = JSON.stringify(courseCatalog, null, 2);
}

function interpretPaste(){
	document.paste = document.getElementById("paste").value;
	loadClasses(courseCatalog);
	// prettyPrintJson(courseCatalog);
}



// this portion of the code breaks down the text and adds special characters as line-item designations which make it easier to parse out pieces for further development
function interpretPaste_a(){
	var string = "▐▐\r\n" + document.getElementById("paste").value + "\r\n▐▐";

	//mode changes the regex from a1 to a2
	if(document.catalogObj.mode == "courses"){
		var string = string.replace(regex_a1,'▐▐$1');  // adds (ALT+222)
	} else if (document.catalogObj.mode == "programs"){
		string = fixDoubleSpacesBetweenWords(string);
		string = trimSpacesBeforeReturnCharacters(string);
		string = string.replace(regex_a2,'▌▌$1');  // adds (ALT+221) - MAJOR / Program Names
		string = string.replace(regex_a3,'▄▄$1');  // adds (ALT+220) - Concentration
		string = string.replace(regex_a3_specific,'╪╪$2\t$3');  // adds (ALT+216) - Sub Heading with Right Justify)
		string = string.replace(regex_a4,'██$1');  // adds (ALT+219) - Heading
		string = string.replace(regex_a5,'┌┌$2');  // adds (ALT+218) - List Item
		string = string.replace(regex_a6,'┘┘$2');  // adds (ALT+217) = Sub List Item
		string = string.replace(regex_a7,'╪╪$2\t$3');  // adds (ALT+216) - Sub Heading with Right Justify)
		string = string.replace(regex_a7b,'╫╫$2\t$3');  // adds (ALT+215) - Sub Heading Total with Right Justify)
		// string = string.replace(regex_a7c,'╓╓$1'); // adds (ALT+214) - SubHeading - Sub Heading With Left Justify, but no <SPAN> -- 
		string = string.replace(regex_a9,'╒╒$1\n'); // adds (ALT+213) - Sub>SUBHeading - Sub>SUB Heading With Left Justify - almost insignificant 
		string = string.replace(regex_a8,'┌┌$2\t$3');  // adds (ALT+218 - Bullet-point enabled lists with Right Justify)
		string = string.replace(regex_a_,"$1\n");  // wipes out bad artifacts between pages and includes a new line character
	}
	var result = string;

    return result;
}

/*
 *	.split('▐▐') and .split('▌▌') breaks up the content in a raw array depending on the mode selected
 */
function interpretPaste_b(paste){
	var array = [];
    string = paste;		
    
	if(document.catalogObj.mode == "courses"){
		var array = string.split('▐▐');
		document.catalogObj.rawCourses = array;
		if(document.catalogObj.debug){
			document.getElementById("dump").innerHTML = array;
		}
	} else if (document.catalogObj.mode == "programs"){
		var array = string.split('▌▌');
		document.catalogObj.rawPrograms = array;
		if(document.catalogObj.debug){
			document.getElementById("dump").innerHTML = array;
		}
	}
}

// sets up all the concentration arrays and raw text within
function interpretProgramArray_c(){
	document.catalogObj.programs = [];
	for(var i = 0; i < document.catalogObj.rawPrograms.length; i++){
		let rawProgram = document.catalogObj.rawPrograms[i];
		let matchGroups = rawProgram.match(regex_pa_c1);
		let major = '';
		// console.log(matchGroups);
		if(matchGroups && matchGroups.length > 0){
			// else ignore the line
			var thisMajor = {};
			thisMajor['Concentrations'] = [];
			thisMajor['conRef'] = [];
			thisMajor.courses = [];
			major = matchGroups[1] ? matchGroups[1].trim() : undefined;
			major = major.replace(/\r\n/,"");  // need to remove any return characters that exist in some Trad Course Majors
 			thisMajor.rawText = matchGroups[3] ? matchGroups[3].trim() : undefined;
			// split out the concentration if they exist
			var conPosition = thisMajor.rawText.search(/▄▄/gm);// start of a concentration
			if(conPosition !== -1){
				thisMajor.majorText = thisMajor.rawText.substr(0,conPosition);
				var conText = thisMajor.rawText.substr(conPosition);
				var conArray = conText.split('▄▄');
				for(var j=0; j < conArray.length; j++){
					var matchConGroups = conArray[j].match(regex_pa_c3);
					if(matchConGroups && matchConGroups.length > 0){
						var thisCon = {};
						thisCon.courses = [];
						thisCon.title = matchConGroups[1] ? matchConGroups[1].trim() : undefined;
						thisCon.title = thisCon.title.replace("  "," ");
						thisMajor['conRef'].push(thisCon.title);
						thisCon.rawText = matchConGroups[3] ? matchConGroups[3].trim() : undefined;
						thisCon.rawArray = createProgramRawArray_d(thisCon.rawText);
						thisCon.cleanArray = interpretProgramTemplateArray_e(thisCon.rawArray);
						thisCon.courses = collectCourseCodesFromPrograms(thisCon.rawText);
						thisMajor['Concentrations'][thisCon.title] = thisCon;
					}
				}
			} else {
				thisMajor.majorText = thisMajor.rawText;
			}

		}

		if(major){
			thisMajor.courses = collectCourseCodesFromPrograms(thisMajor.majorText);
			thisMajor.rawArray = createProgramRawArray_d(thisMajor.majorText);
			thisMajor.cleanArray = interpretProgramTemplateArray_e(thisMajor.rawArray);
			document.catalogObj.programs[major] = thisMajor;
		}
	}

	return document.catalogObj.programs;
}

// simply creates a rawArray of Lines and eliminates 100% junk strings
function createProgramRawArray_d(string){
	rawArray = string.split(/\n/gm);
	return rawArray
}

// runs through the rawArray from document.catalogObj.programs.[PROGRAM].rawArray
// attempts to discover potential places where a return character has incorrectly separated what was a line-item within a well-formed list
// attempts to find places where a lineDesignationCode has not been assigned but the string ends in ":" - which would designate a subSubHeading should occur
// Launched from interpretPaste_a()
// Consider wrapping all anomaly checking here...
function repairAnomalies(rawArray){
	/*
	 *	"██" = "heading";
	 *	"╪╪" = "subheading";
	 *	"╫╫" = "subheadingtotal";
	 *	"╒╒" = "subSUBheading";
	 */
	outputArray = [];
	let lineDesignationCodes = ['▌▌','▄▄','██','┌┌','┘┘','╪╪','╫╫','╒╒','╘╘'];
	let thisLine = '';
	let previousLine = '';
	let nextLine = '';

	// this loop is designed to inspect each line of the array looking for clues that lines broken with a return character should be fixed
	for(let i = 0; i < rawArray.length; i++){
		 // default in the loop is simply just to push whatever non-"catches" - this flag is "false" when outputArray.push(newLine) is ran within the if detections when a catch is made
		let pushOriginalLine = true;
		let newLine = '';
		// the string simply has to be over a certain size or its is redacted... there is no reason for "blanks" to travel through still 
		if(rawArray[i].length > 3){
			// load the this,previous,next lines for manipulation
			thisLine = rawArray[i] ? rawArray[i].trim() : "";
			previousLine = rawArray[i-1] ? rawArray[i-1].trim() : "";
			nextLine = rawArray[i+1] ? rawArray[i+1].trim() : "";
			// we should simply send long 50+ character strings back into the array if they do not contain one of the lineDesignationCodes because
			// they are probably a well-formatted paragraph.
			if(rawArray[i].length < 50 && !lineDesignationCodes.some(substring=>thisLine.includes(substring))){
				if(thisLine.includes('\t')){
					// contains a tab - it maybe a credit list item
					if(previousLine[1] === '┌'){
						newLine = '┌┌' + thisLine; // continue the list
						pushOriginalLine = false;
					} else if(thisLine.length < 50 && thisLine.includes('\t') && (nextLine.includes('┌') || nextLine.includes('╒'))){
						// this line contains a tab, is short and comes before either a list or a subSubheading... it's probobly a heading of sometype...
						newLine = '╪╪' + thisLine; // Make this a Subheading.
						pushOriginalLine = false;
					}
				} else if(thisLine[thisLine.length -1] === ':'){
					// wait, maybe the prior line actually needs united to this one...
					// is the previous line relatively short?  Does the previous line also NOT have a tab?
					if(previousLine.length < 100 && !previousLine.includes('\t')){
						// make it a subSubheading ... and add this line to the previous one...
						outputArray[outputArray.length -1] = '╒╒' + previousLine + " " + thisLine;
						// nowLine should be "" which means it will simply not record this entry since it was appended to the last one... 
						pushOriginalLine = false;
					} else { 
					// last character is a : -- designates a subheading most likely
						newLine = '╒╒' + thisLine; // code this string for subheading processing
						pushOriginalLine = false;
					}
				} else if((thisLine[thisLine.length -1] === ',' || thisLine.length < 50) && nextLine.includes('\t') && !thisLine.includes('\t') && !nextLine.includes('█')  && !nextLine.includes('╪')){
					// last character is a comma
					// or the line is less than 49
					// AND the next line includes a tab
					// AND this line does NOT include a tab already
					// very good indication it needs fixed
					newLine = thisLine + " " + nextLine;
					newLine = newLine.replace(/[╪╪╫╫┌┌]/gm, '');
					newLine = newLine.replace(regex_a7_single,'╪╪$2\t$3');
					newLine = newLine.replace(regex_a7b_single,'╫╫$2\t$3');
					newLine = newLine.replace(regex_a8_single,'┌┌$2\t$3');
					pushOriginalLine = false;
					i++;
				}
			} else {
				// If this line is here, it must not have a lineDesignationCode yet
				// Also, it potentially may also end in a ":" and it doesn't contain a [TAB] character
				// which builds the case that we need this line to be a subSubHeading
				if(thisLine[thisLine.length -1] === ':' && !thisLine.includes('\t') && !thisLine.includes('╒') && thisLine.length < 100){
					newLine = '╒╒' + thisLine; // code this string for subheading processing
					pushOriginalLine = false;
				// IF ... it DOES contain a [TAB] character does this line have a Course Code? - if not, then let's grant it [TAB] processing as a heading...
				} else if(thisLine[thisLine.length -1] === ':' && thisLine.length < 100 && !thisLine.includes('╒')){
					// if it doesn't contain the course code... set the line as a subSUBheading to process it
					if(!foundCourseId(thisLine)){
						newLine = '╒╒' + thisLine; // code this string for subheading processing with a tab
						pushOriginalLine = false;
					} else {
						// it contains a course code...leave it as a paragraph.
					}
				}
			}
			// enable recognition of lines that contain a page reference to the General Education Requirements like "p. 32" etc...
			let regex_ra1_match = thisLine.match(regex_ra1);
			if(Array.isArray(regex_ra1_match)){
				// console.log(regex_ra1_match);
				if(regex_ra1_match[4] == ""){
					newLine = '┌┌<a href="#link_G.E.R.">Click for General Education Requirements</a>';
				} else {
					newLine = '┌┌<a href="#link_G.E.R.">Click for General Education Requirements</a>' + regex_ra1_match[4];
				}
				pushOriginalLine = false;
			}

			if(newLine !== ''){
				console.log('repairAnomalies() Triggered: ');
				console.log('oldLine: ' + thisLine);
				if(newLine[1] === '╪'){
					newLine = newLine.toUpperCase();  // simply all subheadings should be capitalized - force this...
				}
				outputArray.push(newLine);
				console.log('newLine: ' + newLine);
			}
			// did we make it this far with the flag still being true?  Great - no anomalies so far...push the original line
			if(pushOriginalLine){
				/*
				 *	"██" = "heading";
				 *	"╪╪" = "subheading";
				 *	"╫╫" = "subheadingtotal";
				 *	"╒╒" = "subSUBheading";
				 */
				if(rawArray[i][1] === '╪'){
					outputArray.push(rawArray[i].toUpperCase());  // simply all subheadings should be capitalized
				} else {
					outputArray.push(rawArray[i]);					
				}

			}

		}
	}
	return outputArray;
}

// receives an array of a program or concentration's slingle lines and formats it into a renderable array of "flatened" outputs
// this programs a linear array which the templtes will simply "play" like actions that set HTML in order
// kind of a complex switch/if/else headache -- sorry :-(
// the basis for the switch operations is in the function: interpretPaste_a()
// this function separate allows for easier line-by-line checking in the rawArray prior vs. the cleanArray which is contained in the document.catalogObj by Program -> Concentration
function interpretProgramTemplateArray_e(rawArray){
	rawArray = repairAnomalies(rawArray);
	// console.log(rawArray);
	const cleanArray = [];
	// enable complex list-counters
	var lc_layerA = 0;
	var lc_layerB = 0;
	// the Last Good Index variable will 'keep' whatever paragraphs or list items were last entered, so that array.splice() can insert items within this.
	var lastGoodIndex = 0;
	// we need count paragraph in case we've indicated there is one we want to join together with the previous paragraph which isn't interupted by a title or list item
	var count_paragraph = 0;
	// loops across the arrays and sets various "counters" in order to integrate data "forward" into the flat clean-array
	for(let i = 0; i < rawArray.length; i++){
		let text = '';
		let type = '';
		let firstTwoCharacters = rawArray[i].substr(0,2);
		// allows the renderer to issue errors and cautions
		let error = false;
		let caution = false;
		let courseIds = [];

		// fix any hyphen- ated words that occur
		// fix any double  spaces between words
		rawArray[i] = fixHyphenatedWords(rawArray[i]);

		switch(firstTwoCharacters){
			case '██':
				// heading
				text = rawArray[i].substr(2);
				type = "heading";
				// a heading was discovered - this necessitates the end of both prior list layers
				if(lc_layerA + lc_layerB > 0){
					if(lc_layerB > 0){cleanArray.splice(lastGoodIndex,0,{'text':'','type':"lc_end_B"});}
					if(lc_layerA > 0){cleanArray.splice(lastGoodIndex,0,{'text':'','type':"lc_end_A"});}
					  // reset counters
					lc_layerA = 0;
					lc_layerB = 0;
				}
				count_paragraph = 0;
				break;
			case '╪╪':
				// Sub Heading
				text = rawArray[i].substr(2);
				type = "subheading";
				//  - this necessitates the end of both prior list layers
				if(lc_layerA + lc_layerB > 0){
					if(lc_layerB > 0){cleanArray.splice(lastGoodIndex,0,{'text':'','type':"lc_end_B"});}
					if(lc_layerA > 0){cleanArray.splice(lastGoodIndex,0,{'text':'','type':"lc_end_A"});}
					  // reset counters
					lc_layerA = 0;
					lc_layerB = 0;
				}
				count_paragraph = 0;
				break;
			case '╫╫':
				// Sub Heading
				text = rawArray[i].substr(2);
				type = "subheadingtotal";
				//  - this necessitates the end of both prior list layers
				if(lc_layerA + lc_layerB > 0){
					if(lc_layerB > 0){cleanArray.splice(lastGoodIndex,0,{'text':'','type':"lc_end_B"});}
					if(lc_layerA > 0){cleanArray.splice(lastGoodIndex,0,{'text':'','type':"lc_end_A"});}
					  // reset counters
					lc_layerA = 0;
					lc_layerB = 0;
				}
				count_paragraph = 0;
				break;
			case'╒╒':
				// Sub>SUB Heading
				text = rawArray[i].substr(2);
				type = "subSUBheading";
				// console.log("subSUBheading:" + text);
				//  - this necessitates the end of both prior list layers
				if(lc_layerA + lc_layerB > 0){
					if(lc_layerB > 0){cleanArray.splice(lastGoodIndex,0,{'text':'','type':"lc_end_B"});}
					if(lc_layerA > 0){cleanArray.splice(lastGoodIndex,0,{'text':'','type':"lc_end_A"});}
					  // reset counters
					lc_layerA = 0;
					lc_layerB = 0;
				}
				count_paragraph = 0;
				break;			
			case '┌┌':
				// list1
				text = rawArray[i].substr(2);
				// does this line item have course numbers within?  How many?  Return the array
				courseIds = processCourseIdsFromLineItem(text);
				// need the merge button pushed to activate
				if(Array.isArray(courseIds) && document.catalogObj.merge){
					type = "list1_class";
				} else {
					type = "list1";
				}
				if(lc_layerA == 0){cleanArray.splice(lastGoodIndex,0,{'text':'','type':"lc_start_A"});}
				// detect and reset the 2nd layer list since it was nested and another layer 1 line item appeared
				if(lc_layerB > 0){cleanArray.splice(lastGoodIndex,0,{'text':'','type':"lc_end_B"});}
				lc_layerA++;  // increase list counter
				  // reset counters		
				lc_layerB = 0;
				count_paragraph = 0;
				break;
			case '┘┘':
				// list2
				text = rawArray[i].substr(2);
				type = "list2";
				// Issue the start of 2nd layer list it did not previously appear 
				courseIds = processCourseIdsFromLineItem(text);
				// need the merge button pushed to activate
				if(Array.isArray(courseIds) && document.catalogObj.merge){
					type = "list2_class";
				} else {
					type = "lis2";
				}
				if(lc_layerB == 0){cleanArray.splice(lastGoodIndex,0,{'text':'','type':"lc_start_B"});}
				lc_layerB++;  // increase list counter
				count_paragraph = 0;
				break;
			default:
				// Push Junk Array Lines as Errors
				if(rawArray[i].length < 4){
					error = true;
					text = rawArray[i];
					type = 'error';
				} else {
					//simply fix any lines at this point that lead or end with spaces 
					rawArray[i] = rawArray[i].trim();
					// find and strip any odd characters from the text as well as throw an error, but continue processing
					if (rawArray[i].search(/[¡█┌┘]{1,}/) !== -1){
						cleanArray.push({'text':rawArray[i],'type':"error"});
						rawArray[i] = rawArray[i].replace(/[¡█┌┘]{1,}/, '');
						console.log(lastGoodIndex +" | "+ rawArray[i]);
					}
					// identifies a capital letter followed by multiple words seaparted by spaces - indicates sentence-formatted text
					// if found it could indicate that this is part of a multi-break paragraph that needs united.
					// We need to count paragraphs then and ensure the paragraph joins back with prior text.
					if(rawArray[i].search(regex_e2) !== -1){
						// this is the first detected "paragraph" proceed as normal.
						// console.log(i +" | " + count_paragraph + " |: " + rawArray[i]);
						if(count_paragraph == 0){
							text = rawArray[i];			
							type = "paragraph";
							count_paragraph++;
							if(lc_layerA > 0){cleanArray.push({'text':'','type':"lc_end_A"});}
							if(lc_layerB > 0){cleanArray.push({'text':'','type':"lc_end_B"});}
							lc_layerA = 0;  // reset list counter
							lc_layerB = 0;  // reset list counter
						// there are more than 1 detected "paragraphs" in a row... accumulate text to the prior one
						// include a "caution"
						} else {
							caution = true;
							// it's possible that there were junk lines splitting up paragraphs ... include junk counter
							if(cleanArray[lastGoodIndex-1].type == "paragraph"){
								cleanArray[lastGoodIndex-1].text = cleanArray[lastGoodIndex-1].text + " " + rawArray[i];
								count_paragraph++;
								caution = true;
								type = "caution";
								text = rawArray[i];
							} else {
								caution = false;
								error = true;
								type = "error";
								text = rawArray[i];
							}
						}
					} else {
						type = "unknown";
						text = rawArray[i];
						if(lc_layerA > 0){cleanArray.push({'text':'','type':"lc_end_A"});}
						if(lc_layerB > 0){cleanArray.push({'text':'','type':"lc_end_B"});}
						lc_layerA = 0;  // reset list counter
						lc_layerB = 0;  // reset list counter
						count_paragraph = 0;
						caution = true;
					}
					// unknown, blank, error - or continuation of prior line with inserted line break
					// the line contained very little if no word-formed characters "A bat cat denied" - breaks up lists
					//error = true;
					// the line contained word-formed characters, but was short and ended in curious punctuation - reformat lists to include
					// the line contained word-formed characters, was extensive and should be break up lists  - breaks up lists
					//caution = true;
				}
		}

		// looks behind and before to assume list-capabilities ... predictive
		if (error || caution) {
			cleanArray.push({'text': text,'type':type});
		} else {
			if((typeof courseIds) !== "string"){
				cleanArray.push({'text': text,'type':type,'courseIds':courseIds});
			} else {
				cleanArray.push({'text': text,'type':type});
			}

			lastGoodIndex = cleanArray.length;
		}

		if(i+1 == rawArray.length){
			// this iteration is the last one in the loop...check and ensure all lists are closed here
			cleanArray.push();
			if(lc_layerA > 0){cleanArray.splice(lastGoodIndex,0,{'text':'','type':"lc_end_A"});}
			if(lc_layerB > 0){cleanArray.splice(lastGoodIndex,0,{'text':'','type':"lc_end_B"});}
			lc_layerA = 0;  // reset list counter
			lc_layerB = 0;  // reset list counter
		}
	} // end of for loop
	return cleanArray
}

/*
 *  Refactor this so the error-checking is pulled out into other functions instead of being set inside this giant one
 */
function interpretArray_c(){
	document.catalogObj.courses = [];
	document.catalogObj.courseErr = [];
	document.catalogObj.courseRef = [];
	var referenceLoader = 0;
	var regex_c = /^[ ]{0,3}([A-Z]{2,4}[0-9]{3,4}[A-Z]{0,3}-[A-Z]{1,3}|[A-Z]{2,4}[0-9]{3,4}[A-Z]{0,3})([a-zA-Z\d *’'`.,&:\-\–\/() ]*)([\s])/;
	for(var i = 0; i < document.catalogObj.rawCourses.length; i++){ 
		var error = false;
		var thisCourse = {};
		let title = "", className = "", matchGroups = [];
		var value = repairMissingCharacters(document.catalogObj.rawCourses[i]);
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
				error = "C";
			}
			thisCourse[className].id = className.trim();
			thisCourse[className].titleFull = title.trim();
			thisCourse[className] = interpretObject_e(interpretObject_d(thisCourse[className]));
		} else if(value) {
			// Not going to record errors that have no apparent value (may have return characters spamming them.)
			if(value.length > 10){
				document.catalogObj.courseErr["error_c2_" + i] = {}
				document.catalogObj.courseErr["error_c2_" + i].value = value;
				let refobj = {"class":"error_c2_" + i};
				refobj.ref = referenceLoader;
				document.catalogObj.courseRef.push(refobj);
				error = "C2";
			}
		}
		// console.log(error);
		if(className !== "" && error !== "C2"){
			let refobj = {"class":className};
			refobj.ref = referenceLoader;
			document.catalogObj.courseRef.push(refobj);
			document.catalogObj.courses.push(thisCourse);
			if(error == "C" ){
				document.catalogObj.courseErr["error_c_" + i] = {}
				document.catalogObj.courseErr["error_c_" + i].value = lastPart;
				let error_C_obj = {"class":"error_c_" + i};
		     	document.catalogObj.courseRef.push(error_C_obj);
	     	}
			referenceLoader++;
		}
	}
	return document.catalogObj.courses;
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
	var matchGroups = [];
	var pos;
	obj.titleText = "";
	obj.weeksText = "";
	obj.weeksValue = "";
	obj.creditsText = "";
	obj.creditsValue = "";
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
	// console.log(obj);
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
			// Credits Value found needs to be removed from the description
			obj.description = obj.description.substr(obj.creditsValue[0].length);
			// found the credits value - the rest is the description
			obj.creditsValue = obj.creditsValue[0].replace(/\v|\r|\n/gm,' ').trim();
		} else {
			// didn't find the credits value...maybe there was a return character in the title
			// or maybe the credits value is actually: (0 or 1) and not a set of digits
			// if so...must rebuild both Title & Description and finally set the credits value
			// console.log(obj.description + "--" + obj.id);
			matchGroups = obj.description.match(regex_e3);
			// console.log(matchGroups);
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
				console.log("error_e");
				document.catalogObj.courseErr["error_e_" + obj.id] = {}
				document.catalogObj.courseErr["error_e_" + obj.id].value = obj.desription;
				let refobj = {"class":"error_e_" + obj.id};
				refobj.ref = "error_e_" + obj.id;
				document.catalogObj.courseRef.push(refobj);
			}
		}
	}

	// Split up the description into proper pieces
	obj = setDescriptionPieces(obj);
	// console.log(obj);
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
					match = valueClean.match(regex_z1);
					if(match){
						result = valueClean.match(regex_z1)[0];
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
	var array = ['prerequisite:','prerequisites:','corequisites:','corequisite:','offered:','fee:','pass/fail','repeatable','(prerequisite:','(prerequisites:','(corequisites:','(corequisite:','(offered:','(fee:','(pass/fail','(repeatable'];
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
	let outputString = '';
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

// interprets a string and returns an array of program codes and their matching descriptions
function collectCourseCodesFromPrograms(string){
	let array = [];
	let primeMatchArray = string.match(regex_z3);
	if(Array.isArray(primeMatchArray)){
		// iterate through each match to get to the group values  
		for(let i = 0; i < primeMatchArray.length; i++){
			let subMatchArray = [];
			// iterate throught every sub match and extract each group value
			while ((subMatchArray = regex_z3.exec(primeMatchArray[i])) !== null) {
			    // This is necessary to avoid infinite loops with zero-width matches
			    if (subMatchArray.index === regex_z3.lastIndex) {
			        regex_z3.lastIndex++;
			    }
			    // pulls out the Code and Name of each Course into an array - it may actually be "text instructions" instead of an actual course name
			    subMatchArray.forEach(() => {
			    	thisCourseCode = subMatchArray[1] ? subMatchArray[1].trim() : "";
					thisCourseName = subMatchArray[3] ? subMatchArray[3].trim() : "";
					array[thisCourseCode] = thisCourseName;
			    });
			}
		}

	}
	return array;
}


// returns a boolean if the string contains a courseCode.
function foundCourseId(string){
	console.log("Ran foundCourseId(): " + string);
	let match = string.match(regex_z1);
	console.log(match);
	if(Array.isArray(match) && typeof match[0] == 'string' && match[0] !== string) {
		return true;
	} else {
		return false;
	}
}

function trimSpacesBeforeReturnCharacters(string){
	string = string.replace(regex_z4, '\n');
	return string;
}

function fixDoubleSpacesBetweenWords(string){
	matchGroups = string.match(regex_z5);
	//console.log(matchGroups);
	if(Array.isArray(matchGroups)) {
		var fixedWord = matchGroups[2].replace(" ","");
		string = matchGroups[1].trim() + " " + fixedWord + " " + matchGroups[3].trim();
	}
	return string;
}


function fixHyphenatedWords(string){
	matchGroups = string.match(regex_z6);
	//console.log(matchGroups);
	if(Array.isArray(matchGroups)) {
		var fixedWord = matchGroups[2].replace("- ","");
		string = matchGroups[1] + fixedWord + matchGroups[3];
	}
	return string;
}

// returns an array for array.length detection if course codes have been found in the text - but there are no return characters in the text that is being inspected.
function processCourseIdsFromLineItem(string){
	let array = [];
	let match = null;
	match = string.match(regex_z7);
	if(((typeof match) == 'object') && (match !== null)){
	    match.forEach((thisMatch, groupIndex) => {
	        array[groupIndex] = thisMatch;
	    });
		return array;
	} else {
		return string;
	}
}

function reportCourses(){
	let string = '<div class="alert alert-success" role="alert">';
	if(document.catalogObj.courses.length > 0){
		string += document.catalogObj.courses.length + " " + document.querySelector("#ags_trad").innerHTML + " Courses Loaded";
		string += "<br>" + Object.keys(document.catalogObj.courseErr).length + " " + document.querySelector("#ags_trad").innerHTML + " Errors Discovered";
	}
	string += '</div>';
	return string;
}

// should recieve strings that designate boostrap classes: "success", "warning" or "danger"
// https://getbootstrap.com/docs/4.0/components/alerts/
function reportAlert(text,type){
	return `<div class="alert alert-${type}" role="alert">${text}</div>`;
}

function cleanOutAnyLineDesignationCodesRemaining(string){
	let lineDesignationCodes = ['▌▌','▄▄','██','┌┌','┘┘','╪╪','╫╫','╒╒','╘╘'];
	for(let i = 0; lineDesignationCodes.length > i; i++){
		string = string.replace(lineDesignationCodes[i],"");
	}
	return string;
}


// inspects the reports after running 
function reportPrograms(){
	if(typeof document.catalogObj.courseRef !== "object"){
		return reportAlert('NO CLASSES LOADED<br>COMPARISON REPORT FAILED<br><br>• First paste courses for the system to interpret and then push the <i>"Interpret Courses"</i> button.','danger'); 
	} else {
	let report = '';
	let string = '';	
	let programs = document.catalogObj.programs;
	document.catalogObj.missingCourses = [];
	// let courses = document.catalogObj.courses.length;

	// very similar code as found in templates.js --> function convertPrograms2HTML(){
	// refactor?
	Object.keys(programs).forEach(function(major){
		let thisMajor = document.catalogObj.programs[major];
		thisMajor.courseRender = {};
		let found = 0;
		let missing = 0;
		let missingCourseString = '';
		// refactor this at some time...many portions are duplicated in Concentration-level inspection
		Object.keys(typeof thisMajor.courses == "object" && thisMajor.courses).forEach(function(course){
			let confirmed = false;
			// The Interpreted Courses Should already exist - if so check the refernce to search for the specific course
			for(i = 0; i < document.catalogObj.courseRef.length; i++){
				if(document.catalogObj.courseRef[i].class == course ){
					// prepare to output title, descriptions etc.
				    let thisCourse = document.catalogObj.courseRef[i].class;
				    let thisCourseRef = document.catalogObj.courseRef[i].ref;
					let thisCourseObj = document.catalogObj.courses[thisCourseRef][course];
					let courseDescription = thisCourseObj.description;
					let courseTitle = thisCourseObj.titleText;
					thisMajor.courseRender[thisCourse] = courseTitle + '<br>' + courseDescription;
					found++;
					confirmed = true;
					break;
				} else {
					thisMajor.courseRender[course] = '';
				}
			}
			if(!confirmed){
				missing++;
				document.catalogObj.missingCourses.push(course);
				missingCourseString += course + ', ';
			}
		}); // end of: Object.keys(typeof thisMajor.courses == "object" && thisMajor.courses).forEach(function(course){

		string += `<h3>${major}</h3>`;

		if(found > 0){
			string += reportAlert(`<b>${major}</b> <i>Major</i>; found: ${found}/`+ Object.keys(thisMajor.courses).length + ` courses`,'success');					
		}
		if(missing > 0){
			string += reportAlert(`<b>${major}</b> <i>Major</i>; missing: ${missingCourseString}`,'warning');					
		}		
		
		// inspect the concentration level
		if(typeof thisMajor.Concentrations == "object" && Object.keys(thisMajor.Concentrations).length > 0){
			Object.keys(thisMajor.Concentrations).forEach(function(concentration){
				let thisConcentration = thisMajor.Concentrations[concentration];
				thisConcentration.courseRender = {};
				// problematic - much of this is duplicated from the Major Level...
				found = 0;
				missing = 0;
				missingCourseString = '';
				
				// inspect concentrations at the courses level
				Object.keys(thisConcentration.courses).forEach(function(course){
					confirmed = false;
					// The Interpreted Courses Should already exist - if so check the refernce to search for the specific course
					for(i = 0; i < document.catalogObj.courseRef.length; i++){
						if(document.catalogObj.courseRef[i].class == course ){
							// prepare to output title, descriptions etc.
	  					    let thisCourseId = document.catalogObj.courseRef[i].class;
	  					    let thisCourseRef = document.catalogObj.courseRef[i].ref;
	  						let thisCourseObj = document.catalogObj.courses[thisCourseRef][course];
							let courseDescription = thisCourseObj.description;
							let courseTitle = thisCourseObj.titleText;
							thisConcentration.courseRender[thisCourseId] = renderCourseDescription(thisCourseId);
							found++;
							confirmed = true;
							break;
						} else {
							thisConcentration.courseRender[course] = '';
						}
					}
					if(!confirmed){
						missing++;
						document.catalogObj.missingCourses.push(course);
						missingCourseString += course + ', ';
					}
				});

				if(found > 0){
					string += reportAlert(`<b>${concentration}</b>; found: ${found}/`+ Object.keys(thisConcentration.courses).length + ` courses`,'success');					
				}
				if(missing > 0){
					string += reportAlert(`<b>${concentration}</b>; missing: ${missingCourseString}`,'warning');					
				}
			});
		} // end of : if(typeof thisMajor.Concentrations == "object" && Object.keys(thisMajor.Concentrations).length > 0){
	}); // end of: Object.keys(programs).forEach(function(major){

	return string;

	} // end of:  if(typeof document.catalogObj.courseRef !== "object"){
}



/*

Review this for additional required fixes:
https://www.wrike.com/open.htm?id=359675750

ERRORS:
4.)  <h4><span>Title</span><span>Number</span></h4> -- need to flow in flexbox left & right ... not working...
5.)  Errors when classes occure with "or" statements such as:

PH201 Introduction to Philosophy or PH202 Ethics	3

Current fix is to do this:

Choose one of the following:
PH201 Introduction to Philosophy	3
PH202 Ethics	3

6.)  TRAD: Has problems working with this concentration: HEALTHCARE MANAGEMENT CONCENTRATION
7.)  INformation Technology Concentration fails because there is no list beneath it...
8.)  "Program Total 120 Hours" doesn't work on BA in Business Management
     -> there is a space after hours
     -> also doesn't work on BA in Music - it seems if there is a sentence fragment prior to this without an extra return character - it errors out.
     There needs to be an extra return character after "Any credit-bearing course, 100-level or above"
9.)  Currenlty have to manually fix:
		Choose one of the following: 
		PH201 Introduction to Philosophy	3
		PH202 Ethics	3
10.)  Approved 1.29.2019 In BA in Sport Management and Business -- explodes the template
11.)  Had to add the word "something" to BA in Music Something to make it work

13.)  Program options failed to function in BA in Worship Leadership Degree
14.)  GB401 Biblical Hermeneutics -- contains "GOV | GOVERNMENT" at the end
15.)  When more than 1 course is on a page - it won't expand because the course ID is used twice... errors
16.)  When "Choose one of the following:" has a return character separating it and the previous course, the course will get deleted... not sure why
  --- "TH407 Holiness Literature 	2
      
      Choose one of the following:
      NT401 Romans 	3
      NT405 Galatians 	3"
  --- in this example, TH407 Holiness Literature will get deleted
17.)  Can't recognize this major: "BSEd in Early Childhood Education (Pre K-5)" or "BSEd in Middle Childhood Education (Grades 4-9)" or "BSEd in Adolescence to Young Adult Education (Grades 7-12)" or "BSEd in Mild to Moderate Intervention Specialist Education (Grades K-12)"
18.)  Can't recognize this headline : "CONCENTRATIONS	 24-44 HOURS"
19.)  Can't recognize this total: "Program Total *120-130 Hours"
20.)  Can't recognize this: TE499 Clinical Experience 12  (splits 1 & 2)
`

Improvements:
1.)  Need to make a "copy HTML" button to get a single program out
2.)  What do I do about concentrations in Trad? -- they are simplistic - will probobly manually deal with them
3.)  Interface needs an "Expand-All Courses" button
4.)  "Pre-Counseling Concentration" -- need to recognize "hyphen" within word groups for concetrations
5.)  Would be GREAT if there was a copy html button for different portions recognized ...
     --> so like "COPY OBJECTIVES HTML" and "COPY COURSES HTML" because these get split into different sections later on


Incompatibilities:
TRAD CATALOG:
1.)	MU485 & MU385 - Junior Recital MU385 & MU485 to have a [TAB] instead of spaces
	Also if they don't end in a number, I need it in perenthasis: (0 or 1) please

2.) WL425 Worship Leader Internship	1-6
	Needs to be: (1-6)
3.) Course Hours SubHeadings need to have a (TAB)0 Hours so they don't trigger as Majors since they are capitalized
4.) SF100 Course -- need to manually remove the table prior to "insertion"
5.) PS207 Statistics for the Social Sciences - the (ECE213) blow up the interpreter
    --- can list as :PS213 Child Development (ECE213)	3
6.) HS430 Human Services Capstone -- seems messed up
7.) BA in Human Services -- the HS410 Ethics in Human Services 
or HS430 Human Services Capstone 
or PS 495 Psych Practicum (students in Psych minor)	3
 -- is probobly going to explode
8.) LA097/LA099 Basic Writing Lab -- explodes ... two courses in 1 description is going to choke-it ... can't write around this...
	Manually adjust with:

	LA097 Or LA099 Basic Writing Lab 	(1 or 3) 
	Collaboration with a trained writing consultant during the writing process, including prewriting, drafting, revising, and editing. Assists students in producing focused, expository prose and refining fundamental writing skills needed for success at the University level. Credit earned does not count toward graduation. 
	Offered in conjunction with English Composition I and II. 
	<div>•	LA097: Required corequisite for English Composition I students with an English ACT score of 15-16 (or equivalent). Required corequisite for English Composition II unless the student earned a B- or higher in English Composition I.</div>
	<div>•	LA099: Required corequisite for English Composition I students with an English ACT score of 14 or less (or equivalent). Required corequisite for English Composition II unless the student earned a B- or higher in English Composition I.</div>
	Offered: Every semester	Prerequisite: None
	Pass/Fail, Repeatable


9.)  100-level Applied Instrumental Study -- unsure how to do this .... need to experiment
10.)  Individual Sport -- ALSO POP
11.)  I499 Portfolio/Service Learning Capstone ---- 
		- Can't capture single letter course codes ... will have to manually adjust
12.)  Note: MI100 is a prerequisite for all 300- and 400-level MI courses.  -- not is gone...
13.)  Write something to EJECT Headings: "PC | PASTORAL COUNSELING"


++++++ NEW ++++++
COURSES:
TREMENDOUSLY CLEAN!
1.)  COM5000 Communication Theory and Practice (3 credits 6 weeks
  * Needs a closing paranthesis
2.)  HIS3100 Gilded Age America, 1876-1915
  * Needs Credits and Weeks
3.)  After course: "IST3500"
  * Missing Course ID, Title, Credits, Weeks
4.)  LFC1500 Introduction to Life Calling (3 credits)
  * Missing weeks #



*/
