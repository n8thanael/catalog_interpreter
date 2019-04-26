Catalog Interpreter ·•» v.1.3

This program is designed to:

1.)  Interpret a word document reguardless of it's style
2.)  Find programs, headings, paragraphs, courses and put them in an object/array: document.catalogObj
3.)  Produce HTML from the array and "link" courses to their programs by merging them together
4.)  Allow HTML to be compied out for whatever use case senario

Catalog Interpreter ·•» v.1.4
5.)  Eventually to create an XML output of sometype 


>>>>>  Processing Processes
Functionality:  -  Begin in scripts.js
-- regex.js holds(*should) all regex constants
• [ Interpret Courses ] Button pulls all the text from the Paste Here Box
• interpretPaste_a()
	> Primary function for both Course Interpretation and Program Interpretation 
	> A long series of regex replacements identify matches and places special
	  characters where a line has been discovered to contain a match.
	> These special characters serve as codes to help interpret formatting etc.
	> The output is a super-long string with special characters intserted where matches
	  were found.
• interpretPaste_b()
	> the super-long string is either turned into:
		+ document.catalogObj.rawCourses
		+ document.catalogObj.rawPrograms
	> At this point is super helpful to watch the interpreter assign characters to each
	> line by pulling up the array in the js console and debugging line by line

From this point the process flow splits into two peices: Programs & Courses
Courses:
• interpretArray_c()
	> This function primarilly loops through each array entry from rawCourses and attempts
	  to separate out the pieces of the course: Title, Id, Weeks, Credits, Text
	> Functions interpretObject_d() and interpretObject_e() are part of the washing machine
	  that pulls these parts out while setting errors along the way: catalogObj.courseErr:
	> Eventually a reference object is loaded: catalogObj.courseRef
	> This referemce object aids in the look up of courses by their names and provides a 
	  value that can look back to the more complex catalogObj.courses
/* there should be anomaly detection, reporting and correcting much like there is with repairAnomalies() for programs */
/* I don't like how the reference object works.. why did I build it like that?  courseRef doesn't seem necessary... */ 

• interpretProgramArray_c()
	> This breaks up programs and subsets of concetrations
	> Each Program and Conentration receives it's own rawArray which is very useful for debugging
	> catalogObj.programs['BUSINESS'].Concentrations["Accounting Concentration"].rawArray
	> Also... collectCourseCodesFromPrograms() builds a list of all course codes that 
	  Are found within program information - this is useful for error reporting.

• interpretProgramTemplateArray_e()
	> This is a very large function that opperates on both the programs and concentrations
	> First a function called repairAnomalies() runs on the entire array
		+ this is helpful for very specific "breaks" that need repaired.  When 
		  5% of the document has some type of error that nees "normified" this function
		  will intercept that anomaly and repair it.  For instance... is there a return
		  Character where there shouldn't be?  Does that mean we need to reorganize the 
		  Line Items and reformat them to fix that error?  This is highly complex and 
		  reports to the console.
/* Maybe helpful at sometime to report anomalies to the array system and the screen */

	> Each line by the special character is broken down
	> and assigned a "type" allong with clean "text" and is sent to the .cleanArray as apposed
	  to the rawArray for each program and concetration
	> This is basically settting a string of commands that will be followed by template.js in the
	  Templating process - it's almost like it's arranging the cleanArray to be an in-order tape
	  that will play from front to back and assemble HTML upon the instructions provided


>>>>>  Templating processes:
Functionality:  -  template.js
• convertCatalogObj2HTML()
	> Basically interates though the stored catalogObj.courseRef array and pulls out the 
	  classes and the reference to see if we have the object ready to render into HTML
• renderCourseDescription() is super-complex... IDK why I did that.  It works for both
	> Rendering courses for course display AND for putting them in the programs.
• renderClasses()
	> This returns HTML per class that is NOT intended to merge with programs
	> Will return different ones based on AGS / TRAD is selected
• renderMergedClasses()
	> This returns HTML per class that IS intended to merge with programs
	> Will return the same info reguardless of AGS/TRAD is selected
• convertPrograms2HTML()
	> This function will operate a lot like convertCatalogObj2HTML() but for programs
	  and their concentrations
• majorAndConcentrationOutput() 
	> this reads the "cleanArray" of each program or concentration from beginning to end
	> The "types" as set from the unique characters back in interpretProgramTemplateArray_e() are
	  now rendered in different ways as HTML like a "head" rolling across a "tape" of instructions
	> Various types will require different instructions for output - some have functions within
	  them like: list1_class - renderCourseDescription() because we need a description to "dropdown"
	  since it's been found by the previous detection methods and now it needs rendered as such.
	> Helpfull debugging can be found by reading the "cleanArray" and determining what it is doing 
	  when this function reads it and putouts what it has been given to do.
	> this function is also the last "step" before the output strings go back to the page for whatever

>>>>> INTERFACE: interface.js
	> simply some junky JS to toggle on / off modes as well as display errors.

/* would be usefull to expand how the debug works ... it doesn't really - maybe it doesn't because everything 
is basically in the catalogObj. system */ 
	 