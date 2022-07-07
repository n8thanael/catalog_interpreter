Catalog Interpreter ·•» v.1.3

This program is designed to:

1.)  Interpret a word document reguardless of it's style
2.)  Find programs, headings, paragraphs, courses and put them in an object/array: document.catalogObj
3.)  Produce HTML from the array and "link" courses to their programs by merging them together
4.)  Allow HTML to be compied out for whatever use case senario

Catalog Interpreter ·•» v.1.4
5.)  Eventually to create an XML output of sometype 

How to use:
1.)  Transform word document text into plain text by copy/pasting or whatever
2.)  Paste this first into the interpreter: when it is in default ([X] Interpret Courses, [X] AGS )
ACC2020	Accounting I	3
The double-entry system of bookkeeping and the basic accounting cycle, including communicating financial information according to generally accepted accounting principles.
Prerequisite: MAT1250 or higher
ACC2050	Accounting Information Systems	3
Implementation and management of automated accounting systems, with an emphasis on internal controls and information accuracy.
Prerequisite: ACC2020
ACC2300	Individual Income Taxation	3
Federal tax laws and their impact on individuals, estates, and trusts, including tax return preparation.
ACC2460	Accounting Software Applications	3
This hands-on course introduces students to the use of computerized accounting software for a small business. Topics include setting up a new company, creating a chart of accounts, recording banking, customer, and vendor transactions, using inventory, recording payroll, making adjusting entries, and generating financial statements and management reports.  
Prerequisite: ACC2020
ACC2620	Accounting for Managers	3
This course introduces students to the accounting concepts and procedures used by managers to make strategic business and financial decisions in a company. The course has two components: financial accounting and managerial accounting. Throughout the course, an emphasis will be placed on the ethical issues involved in preparing, analyzing, and using accounting information in managerial decision-making and performance evaluation.
3.) You'll see the courses are processed without errors and you can inspect them
4.) Toggle ([ ] Interpret Courses, and [X] Interpret Programs & Merge)
5.)  Paste this in next:
AA in Business
The Associate of Arts in Business equips students with basic skills in essential business areas. The integration of a Christian worldview ensures that the education is morally and ethically grounded.
Objectives:
•	Explain how the four functions of management can be addressed through the Christian worldview.
•	Discuss market segmentation and targeting using the 7 P’s (product, price, place, promotion, packaging, positioning, and people) of marketing.
•	Illustrate data used by decision-makers in today’s business environments.
•	Develop the entrepreneurial decision-making process from research to business plan creation.
MAJOR	27 Hours
ACC2020	Accounting I	3
ACC2050	Accounting Information Systems	3
BUS2070	Macroeconomics	3
ACC2300	Individual Income Taxation	3
ACC2460	Accounting Software Applications	3
ACC2620	Accounting for Managers	3
Electives in ACC, BUS, FIN, LDR, or MKT 	3
Anything else that needs to go  	3
*You can put additional text in various forms as needed in many different ways.
6.)  Press the button: Interpret Programs & Merge
7.)  You'll notice it discovers which courses match and which don't.  It also Separates the data when it sees 'MAJOR\t27 Hours' as well as creates HTML for various headings and bootstrap-capable dropdowns.
8.)  This project could use lots more documentation, but IDK if anyone else will ever use it - I think I'll "bake" it into the most current Python/Django as an application that helps the Database information get processed.


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
	 