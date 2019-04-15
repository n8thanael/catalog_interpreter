function convertCatalogObj2HTML(){
	console.log('converCatalogObj2HTML');
	var outputAll = '';
	var agsTrad = document.querySelector("#ags_trad").innerHTML;
	for(i=0; i < document.catalogObj.courseRef.length; i++){
		var courseId = document.catalogObj.courseRef[i].class;
     	var courseObjRef = document.catalogObj.courseRef[i].ref;

		var courseValue = "";
		var courseTitleFull = "";
		var courseTitleText = "";
		var courseWeeksText = "";
		var courseWeeksValue = "";
		var courseCreditsText = "";
		var courseCreditsValue = "";
		var courseDescPre = "";
		var courseDescPost = "";
		var courseDescPost = "";
		var course_html

		if(courseId.includes("error")){
			var courseErrorValue = typeof document.catalogObj.courseErr[courseId].value == 'string' ?  document.catalogObj.courseErr[courseId].value : "";
			var course_html = `
			<div class="course error" id="course_${courseId}">
				<div class="course_title"><a data-toggle="collapse" href="#course_desc_${courseId}" role="button" aria-expanded="false" aria-controls="#course_desc_${courseId}">ERROR: ${courseId}</a></div>
				<div id="course_desc_${courseId}" class="collapse">${ courseErrorValue}</div>
			</div>`;
		} else {
			var course = document.catalogObj.courses[courseObjRef][courseId];
			var courseTitleText = typeof course.titleText == 'string' ?  course.titleText : "";
			var courseTitleFull = typeof course.titleFull == 'string' ?  course.titleFull : "";
			var courseWeeksText = typeof course.weeksText == 'string' ? course.weeksText : "";
			var courseWeeksValue = typeof course.weeksValue == 'string' ? course.weeksValue : "";
			var courseCreditsText = typeof course.creditsText == 'string' ? course.creditsText : "";
			var courseCreditsValue = typeof course.creditsValue == 'string' ? course.creditsValue : "";
			var courseDescPre = typeof course.descPre == 'string' ? course.descPre : "";
			var courseDescPost = typeof course.descPost == 'string' ? course.descPost : "";
			var courseDescPost = typeof course.descPost == 'string' ? course.descPost : "";
			if(agsTrad == 'AGS'){
				var course_html = `
				<div class="course" id="course_${courseId}">
					<div class="course_title"><a data-toggle="collapse" href="#course_desc_${courseId}" role="button" aria-expanded="false" aria-controls="#course_desc_${courseId}">${courseId}&nbsp;${courseTitleText}&nbsp;${courseCreditsText}&nbsp;${courseWeeksText}</a></div>
					<div id="course_desc_${courseId}" class="collapse">
						<div class="course_preDesc">${courseDescPre}</div>
						<div class="course_postDesc">${courseDescPost}</div>
					</div>
				</div>`;
			} else if(agsTrad == 'TRAD'){
				var course_html = `
				<div class="course" id="course_${courseId}">
					<div class="course_title"><a data-toggle="collapse" href="#course_desc_${courseId}" role="button" aria-expanded="false" aria-controls="#course_desc_${courseId}">${courseId}&nbsp;${courseTitleFull} <span>${course.creditsValue ? course.creditsValue : course.creditsText}</span></a></div>
					<div id="course_desc_${courseId}" class="collapse">
						<div class="course_preDesc">${courseDescPre}</div>
						<div class="course_postDesc">${courseDescPost}</div>
					</div>
				</div>`;
			}
		}

	outputAll += course_html;		
	}
    return outputAll
}



function convertPrograms2HTML(){
	const progObj = document.catalogObj.programs;
	var outputAll = '';
	// didn't need this after all
	// var agsTrad = document.querySelector("#ags_trad").innerHTML

	Object.keys(progObj).forEach(function(major){
		outputAll += majorAndConcentrationOutput(progObj[major]['cleanArray'], major)
		var concObj = progObj[major]['Concentrations'];
		Object.keys(concObj).forEach(function(concentration){
			outputAll += majorAndConcentrationOutput(concObj[concentration]['cleanArray'], concentration)
		});
	}); // end Object.keys().forEach loop

  return outputAll
}

function majorAndConcentrationOutput(array, major){
	output_html = '';
	output_html += `<h2>${major}</h2>`;
	array.forEach(function(index){
		switch(index.type){
			case 'lc_start_A':
				output_html += `<ul>`;
				break;
			case 'lc_start_B':
				output_html += `	<ul>`;
				break;
			case 'lc_end_A':
				output_html += `</ul>`;
				break;
			case 'lc_end_B':
				output_html += `	</ul>`;
				break;
			case 'list1':
				output_html += `	<li>${index.text}</li>`;
				break;
			case 'list2':
				output_html += `		<li>${index.text}</li>`;
				break;
			case 'heading':
				output_html += `<h3>${index.text}</h3>`;
				break;
			case 'subheading':
				output_html += `<h4>${index.text}</h4>`;
				break;
			case 'subheadingtotal':
				output_html += `<h4 class="subheadingtotal">${index.text}</h4>`;
				break;
			case 'paragraph':
				output_html += `<p>${index.text}</p>`;
				break;
			// console.log(index);
		}
	});// end of array.forEach
	return output_html
}

