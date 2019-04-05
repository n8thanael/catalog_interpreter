function convertCatalogObj2HTML(){
	console.log('conversion fired');
	var outputAll = '';
	for(i=0; i < document.catalogObj.courseRef.length; i++){
		var courseId = document.catalogObj.courseRef[i].class;
		var courseObjRef = document.catalogObj.courseRef[i].ref;
		var course = document.catalogObj.courses[courseObjRef][courseId];
		console.log(course.id);
	}
}

