function convertCatalogObj2HTML(button){
	var outputAll = '';
	var agsTrad = document.querySelector("#ags_trad").innerHTML
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
	if(button){
   	  document.getElementById("output").innerHTML = outputAll;
	} else {
	  return outputAll
	}
}
