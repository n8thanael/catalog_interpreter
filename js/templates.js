function convertCatalogObj2HTML(){
	var outputAll = '';
	var course_html = '';
	for(let i = 0; i < document.catalogObj.courseRef.length; i++){
		var courseId = document.catalogObj.courseRef[i].class;
	 	var courseObjRef = document.catalogObj.courseRef[i].ref;

		if(courseId.includes("error")){
			var courseErrorValue = typeof document.catalogObj.courseErr[courseId].value == 'string' ?  document.catalogObj.courseErr[courseId].value : "";
			course_html = `
			<div class="course error" id="course_${courseId}">
				<div class="course_title"><a data-toggle="collapse" href="#course_desc_${courseId}" aria-label="Expand course description" aria-expanded="false" aria-controls="#course_desc_${courseId}">ERROR: ${courseId}</a></div>
				<div id="course_desc_${courseId}" class="collapse">${courseErrorValue}</div>
			</div>`;
		} else {
			course_html = renderCourseDescription(courseId,courseObjRef);
			//course_html = courseId;
		}
		outputAll += course_html;		
	}
    return outputAll
}
/*
 * The Course ID (string) or IDS (array) are sent to this function and an objRef if it exists
 * Either String or Array will modify the function to output differently formatted HTML
 * mergeText is the original line and when there are not objRef matches then the mergeText will be default inserted
 * this allows for content to not "look" messed up in an error, but functionality is lost since the merge
 * request failed
 */
function renderCourseDescription(courseIds, objRef = false, mergeText = ''){
	//console.log(courseId + " | " + objRef + " | " + mergeText); 
	let flagMultipleCourseIds = false;
	let courseId = '';
	let objRefLookupAttemptFailed = false;
	let courseValue = "";
	let course_html = "";

	// an array can be passed into this function as a 'trigger' to make a more complex output. 
	// flagMultipleCourseIds is set to true to enable this functionality
	if(Array.isArray(courseIds)){
		if(courseIds.length > 1){
			flagMultipleCourseIds = true;
			console.log(courseIds);
		} else {
			courseId = courseIds[0];			
		}
	} else {
		courseId = courseIds;
	}

	// this function is used sometimes without the objRef, in which case it needs looked up
	// if the objRef can't be found, the flag: objRefLookupAttemptFailed returns true
	// this is important so we don't try and replace the "no-working" listing with something worse: blank 
	if(courseId !== '' && objRef === false){
		// reterns boolean false if not found - or typeof 'number' if does 
		objRef = getCourseReference(courseId);
     	if (objRef === false){
			objRefLookupAttemptFailed = true;
			// don't record the failure unless there are programs being built
	     	if(document.catalogObj.missingCoursesForMerge.indexOf(courseId) === -1 && document.catalogObj.mode === 'programs') {
		      document.catalogObj.missingCoursesForMerge.push(courseId);
		    }
		    // failure to find the course - push the line item anyway, but not with dynamic drop-down
			course_html += renderMergedFailedClasses(courseId,mergeText);
		}
 	}

	if(flagMultipleCourseIds && document.catalogObj.merge){
		for(let i = 0; i < courseIds.length; i++){
			// check for courseIds if they have a reference...if not record the error - else process...
			let thisObjRef = getCourseReference(courseIds[i]);
			if (!thisObjRef){
				// don't record the failure unless there are programs being built
		     	if(document.catalogObj.missingCoursesForMerge.indexOf(courseId) === -1 && document.catalogObj.mode === 'programs') {
			      document.catalogObj.missingCoursesForMerge.push(courseId);
			    }
			// there is a refernce found one of the courses on this line being rendered
			} else {
				console.log("write a function to process multiples: " + courseIds[i]);
			}
		}
	} else if(!objRefLookupAttemptFailed) {
		if(document.catalogObj.merge){
			course_html += renderMergedClasses(objRef,courseId,mergeText);			
		} else {
			course_html += renderClasses(objRef,courseId);
		}
	}

	return course_html;
}

// renders classes without 'MERGING' them into the program description line items
function renderClasses(objRef,courseId){
	let course_html = '';
	let agsTrad = document.querySelector("#ags_trad").innerHTML;
	let course = document.catalogObj.courses[objRef][courseId];
	let courseTitleText = typeof course.titleText == 'string' ?  course.titleText : "";
	let courseTitleFull = typeof course.titleFull == 'string' ?  course.titleFull : "";
	let courseWeeksText = typeof course.weeksText == 'string' ? course.weeksText : "";
	let courseWeeksValue = typeof course.weeksValue == 'string' ? course.weeksValue : "";
	let courseCreditsText = typeof course.creditsText == 'string' ? course.creditsText : "";
	let courseCreditsValue = typeof course.creditsValue == 'string' ? course.creditsValue : "";
	let courseDescPre = typeof course.descPre == 'string' ? course.descPre : "";
	let courseDescPost = typeof course.descPost == 'string' ? course.descPost : "";

	if (agsTrad == 'AGS'){
		course_html = `
		<div class="course" id="course_${courseId}">
			<div class="course_title"><a data-toggle="collapse" href="#course_desc_${courseId}" aria-label="Expand course description" aria-expanded="false" aria-controls="#course_desc_${courseId}">${courseId}&nbsp;${courseTitleText}&nbsp;${courseCreditsText}&nbsp;${courseWeeksText}</a></div>
			<div id="course_desc_${courseId}" class="collapse">
				<div class="course_preDesc">${courseDescPre}</div>
				<div class="course_postDesc">${courseDescPost}</div>
			</div>
		</div>`;
	} else if(agsTrad == 'TRAD'){
		course_html = `
		<div class="course" id="course_${courseId}">
			<div class="course_title"><a data-toggle="collapse" href="#course_desc_${courseId}" aria-label="Expand course description" aria-expanded="false" aria-controls="#course_desc_${courseId}">${courseId}&nbsp;${courseTitleFull} <span>${course.creditsValue ? course.creditsValue : course.creditsText}</span></a></div>
			<div id="course_desc_${courseId}" class="collapse">
				<div class="course_preDesc">${courseDescPre}</div>
				<div class="course_postDesc">${courseDescPost}</div>
			</div>
		</div>`;
	}

	return course_html;
}

// renders "MERGING" classes when looking up the objRef has failed and there is nothing to merge, but we still need to show a class
function renderMergedFailedClasses(courseId,mergeText){
	mergeText = mergeText.trim();
	return `<li class="course" id="course_${courseId}"><div class="bullet"></div>${mergeText}</li>`;
}

// renders classes by 'MERGING' them into the program description line items
function renderMergedClasses(objRef,courseId,mergeText){
	let course_html = '';
	let agsTrad = document.querySelector("#ags_trad").innerHTML;
	let course = document.catalogObj.courses[objRef][courseId];
	let courseTitleText = typeof course.titleText == 'string' ?  course.titleText : "";
	let courseTitleFull = typeof course.titleFull == 'string' ?  course.titleFull : "";
	let courseWeeksText = typeof course.weeksText == 'string' ? course.weeksText : "";
	let courseWeeksValue = typeof course.weeksValue == 'string' ? course.weeksValue : "";
	let courseCreditsText = typeof course.creditsText == 'string' ? course.creditsText : "";
	let courseCreditsValue = typeof course.creditsValue == 'string' ? course.creditsValue : "";
	let courseDescPre = typeof course.descPre == 'string' ? course.descPre : "";
	let courseDescPost = typeof course.descPost == 'string' ? course.descPost : "";

	// Would be cool to have a plus sign for the expandables...
	//<div class="h"></div><div class="v"></div>
	course_html = `
	<li class="course collapseable" id="course_${courseId}">
		<div class="bullet"></div><a data-toggle="collapse" href="#course_desc_${courseId}" aria-label="Expand course description for ${courseId}" onclick="return false;" aria-expanded="false" aria-controls="#course_desc_${courseId}">${mergeText}</span></a>
		<div id="course_desc_${courseId}" class="collapse">
			<div class="course_preDesc">${courseDescPre}</div>
			<div class="course_postDesc">${courseDescPost}</div>
		</div>
	</li>`;

	return course_html;
}

// returns either a string for success or bolean "false"
function getCourseReference(courseId){
	reference = false;
	for(let i = 0; i < document.catalogObj.courseRef.length; i++){
		// console.log(courseId + "|" + document.catalogObj.courseRef[i].class);
		if(document.catalogObj.courseRef[i].class == courseId){
	     	reference = document.catalogObj.courseRef[i].ref;
	     	break;
		}
 	}
	return reference;
}

function convertPrograms2HTML(string = ''){
	const progObj = document.catalogObj.programs;
	let outputAll = '';
    if(string == 'description'){
   		Object.keys(progObj).forEach(function(major){
			let descriptionPrep = majorAndConcentrationOutput(progObj[major]['cleanArray'], major);
			outputAll +=  descriptionPrep.replace(document.catalogObj.const.regex_t2, '$1');
		}); // end Object.keys().forEach loop
	} else if (string == 'course'){
   		Object.keys(progObj).forEach(function(major){
			let coursePrep = majorAndConcentrationOutput(progObj[major]['cleanArray'], major);
			outputAll += coursePrep.replace(document.catalogObj.const.regex_t2, '$2');
		}); // end Object.keys().forEach loop
    } else {
   		Object.keys(progObj).forEach(function(major){
			outputAll += majorAndConcentrationOutput(progObj[major]['cleanArray'], major)
			let concObj = progObj[major]['Concentrations'];
			Object.keys(concObj).forEach(function(concentration){
				outputAll += majorAndConcentrationOutput(concObj[concentration]['cleanArray'], concentration)
			});
		}); // end Object.keys().forEach loop
    }
    return outputAll;
}



// This function receives all the lists and runs them back through various regex items so it can detect and inject HTML into the line item
// this used to occure "further up" in the process...but HTML inject that early became a confusing process ... it was deemed it would make 
// more sense to simply re-run the regex here to prep for HTML injection to retain the HTML templating function in templates.js
function insertHTMLIntoTabSepartedListsAndHeadings(type,string){
	let replace_1 = '';
	let replace_2 = '';
	let replace_3 = '';
	switch(type){
		// "????";
		case 'subheading_split':
			replace_2 = string.replace(regex_a7d,'$1');
			replace_3 = string.replace(regex_a7d,'$3');
		break;
		// "??????";
		case 'subheading':
			replace_2 = string.replace(regex_a7_single,'$2');
			replace_3 = string.replace(regex_a7_single,'$3');
		// regex_a7b: ??????
		break;
		case 'subheadingtotal':
			replace_2 = string.replace(regex_a7b_single,'$2');
			replace_3 = string.replace(regex_a7b_single,'$3');
		break;
		// regex_a8: ??????
		case 'list1_class':
			replace_2 = string.replace(regex_a8_single,'$2');
			replace_3 = string.replace(regex_a8_single,'$3');
		break;
		// regex_ ?? ????
		case 'course':
			replace_2 = string.replace(regex_a10,'$1 $3');
			replace_3 = string.replace(regex_a10,'$5');
		break;
	}
	if(replace_2 !== '' && replace_3 !== ''){
		string = `<span class="left_just">${replace_2}</span><span class="right_just">${replace_3}</span>`;
	// it is possible after all of these a line may have a tab still that needs properly templated...
	//} else if (string.includes('\t') ){
	} else if (string.includes('\t') && (type == "list1" || type == "list2")){
 		replace_1 = string.replace(regex_t1,'$1');
 		replace_2 = string.replace(regex_t1,'$2');
		string = `<div class="contains_spans"><span class="left_just">${replace_1}</span><span class="right_just">${replace_2}</span></div>`;
	} else if (string.includes('\t')){
	    // console.log(string);		
 		replace_1 = string.replace(regex_t1,'$1');
 		replace_2 = string.replace(regex_t1,'$2');
		string = `<span class="left_just">${replace_1}</span><span class="right_just">${replace_2}</span>`;
	}
	// string is messed up here ... duplicating incorreclty
	// console.log(string);
	return string;
}

// here the flat rendering array is run through and the "type of line" determines how the line will be rendered
// this is pretty much the final step prior to output as it simply is compiling a massive HTML string to send to the DOM
function majorAndConcentrationOutput(array, major){
	output_html = '';
	if(!document.catalogObj.title_output_toggle){
		// restrict majors from output using toggle
		output_html += `<h2>${major}</h2>`;
	}
	// console.log(array);
/*
 *	"??????" = "heading";
 *	"????" = "subheading_split";
 *	"??????" = "subheading";
 *	"??????" = "subheadingtotal";
 *	"??????" = "subSUBheading";
 *	'??????' = "subSUBheading";
 *	"????" = "course";
 */
	array.forEach(function(index){
	let text = insertHTMLIntoTabSepartedListsAndHeadings(index.type,index.text);
	text = cleanOutAnyLineDesignationCodesRemaining(text);

		switch(index.type){
			case 'lc_start_A':
				document.catalogObj.merge ? output_html += `<ul class="courses">` : output_html += `<ul>`;
				break;
			case 'lc_start_B':
				document.catalogObj.merge ? output_html += `	<ul class="courses">` : output_html += `	<ul>`;
				break;
			case 'lc_end_A':
				output_html += `</ul>`;
				break;
			case 'lc_end_B':
				output_html += `	</ul>`;
				break;
			case 'list1':
				document.catalogObj.merge ? output_html += `	<li class="non_collapseable"><div class="bullet"></div>${text}</li>` : output_html += `	<li>${text}</li>`;
				break;
			case 'list2':
				document.catalogObj.merge ? output_html += `		<li class="non_collapseable"><div class="bullet"></div>${text}</li>` : output_html += `		<li>${text}</li>`;
				break;
			case 'course':
				output_html += `	` + renderCourseDescription(index.courseIds,false,text);
				break;
			case 'list1_class':
				console.log(text);
				output_html += `	` + renderCourseDescription(index.courseIds,false,text);
				break;
			case 'list2_class':
			    console.log(text);
				output_html += `		` + renderCourseDescription(index.courseIds,false,text);
				break;
			case 'heading':
				output_html += `<h3>${text}</h3>`;
				break;
			case 'subheading_split':
				output_html += `<i split></i><h4>${text}</h4>`;
				break;
			case 'subheading':
				output_html += `<h4>${text}</h4>`;
				break;
			case 'subheadingtotal':
				output_html += `<h4 class="subheadingtotal">${text}</h4>`;
				break;
			case 'subSUBheading':
				output_html += `<h5 class="subSUBheadingtotal">${text}</h5>`;
				break;				
			case 'paragraph':
				output_html += `<p>${text}</p>`;
				break;
			case 'unknown':
				if(!document.catalogObj.unknown_output_toggle){
					output_html += `<p>${text}</p>`;
				}
				break;

			// console.log(index);
		}
	});// end of array.forEach
	return output_html
}

