/*
 * Massive regex library to detect lines etc... should provide more use case / notes  
 */


// regex_z1 = /([\s\S]*\d weeks)([ ]*)(This[\s\S]*)/;
const regex_d = /^([a-zA-Z\d *’'`.,&:\-\–\/() ]*)(\([\w\d ]*\))([\d ]* weeks| week)$/;
// var regex_pa_c1 = /^([ ]{0,3}[A-Z\t: ]{6,}[\r\n])([\s\S]*)/;  // finds the program name as group 1, extracts everything else as group 2 ----> AGS ONLY
const regex_a1 = /^[ ]{0,3}([A-Z]{2,4}[0-9]{3,4}[A-Z]{0,3}-[A-Z]{1,3}(?=[ \t]{1}[A-Z])|[A-Z]{2,4}[0-9]{3,4}[A-Z]{0,3}(?=[ \t]{1}[A-Z])|[A-Z]{2} \| [A-Z ]{2,20}[\r\n])/gm;	// First-in line Code identification that looks ahead for tab or space
const regex_a2 = /^[ ]{0,3}(([A-Z]{2} in [a-zA-Z&-() ]{6,}[\r\n]{1}(and |[A-Z]{1}[a-z]{2,} )[A-Z]{1}[a-zA-Z&-() ]{6,40}(?=\n)|[A-Z:\-() ]{6,}|[A-Z]{2} in [A-Z]{1}[a-zA-Z&() ]{6,})(?=[\r\n]))/gm; // looking for MAJORS / Program Names for TRAD and AGS
const regex_a3 = /^[ ]{0,3}([A-Z]{1}[a-zA-Z, ]*Concentration[ ]*(?=[\r\n]))/gm; // Looking for Concentrations
// made it possible to add a ">" before a line that has "Words and Words/t#" -- this forces the line into a subheading
//const regex_a3_specific = /^([ ]{0,3})(Concentration Courses|>>[a-zA-Z ]{0,})[\t]{0,2}([ ]{0,}[\d]{1,3}[-\d]{0,2}[ ]{0,2}[CREDITScreditsHOUhou ]*|[ ]{0,}[\d]{1,3}[ ]{0,2}[HOURShours ]*)(?=[\r\n])/gm;  // catches "Concentration Courses[tab]99 CREDITS" - sub heading
const regex_a3_specific = /^([ ]{0,3})(Concentration Courses)[\t]{0,2}([ ]{0,}[\d]{1,3}[-\d]{0,2}[ ]{0,2}[CREDITScreditsHOUhou ]*|[ ]{0,}[\d]{1,3}[ ]{0,2}[HOURShours ]*)(?=[\r\n])/gm;  // catches "Concentration Courses[tab]99 CREDITS" - sub heading
const regex_a3b = /^(>>[a-zA-Z ]{0,})[\t]{0,2}([ ]{0,}[\d]{1,3}[-\d]{0,2}[ ]{0,2})(?=[\r\n])/gm; // lines beginning with ">>" are forced to subheadings that justify a number to the right
const regex_a4 = /^[ ]{0,3}([0-9]{1,3} Semester Credits|Concentration [a-zA-Z ]*|Major [a-zA-Z ]*|Available [a-zA-Z ]*Courses|The [a-zA-Z\d- ]*Policy|General[a-zA-Z ]*Requirements|[a-zA-Z ]*?Objectives[: \t]*|[a-zA-Z ]*?Objective[: \t]*|[ ]*Completion[ ]*|[ ]*Cost[ ]*|[ ]*Admission Requirements[ ]*([\r\n]))/gm; // looking for headings
const regex_a5 = /(•[ \t]*)([\S ]*(?=\n))/gm; // looking for bullet point lists: (•)
const regex_a6 = /(»[ \t]*)([\S ]*(?=\n))/gm; // looking for bullet point lists: (») which indicates a list inside a list...
const regex_a7 = /^([ ]{0,3})([A-Z \d *’'`.,&:\-\–\/()]{6,})[\t]{0,2}([ ]{0,}[\d]{1,3}[-\d]{0,2}[ ]{0,2}[CREDITScreditsHOUhou ]*|[ ]{0,}[\d]{1,3}[ ]{0,2}[HOURShours ]*)(?=[\r\n])/gm;  // catches "GROUP NAME[tab]99 CREDITS" - sub heading
const regex_a7_single = /^([ ]{0,3})([A-Z \d *’'`.,&:\-\–\/()]{6,})[\t]{0,2}([ ]{0,}[\d]{1,3}[-\d]{0,2}[ ]{0,2}[CREDITScreditsHOUhou ]*|[ ]{0,}[\d]{1,3}[ ]{0,2}[HOURShours ]*)[ \t]{0,3}$/;  // Single-line version of above
const regex_a7b = /^([ ]{0,3})([PROGAMrogamTLtl ]{5,})[\t]{0,2}([ ]{0,}[\d]{1,3}[-\d]{0,2}[ ]{0,2}[CREDITScredits ]*|[ ]{0,}[\d]{1,3}[ ]{0,2}[CREDITScreditsHOUhou ]*)(?=[\r\n])/gm;  // catches "PROGRAM TOTAL[tab]999 CREDITS | Total[tab]9Credit Hours" - sub heading
const regex_a7b_single = /^([ ]{0,3})([PROGAMrogamTLtl ]{5,})[\t]{0,2}([ ]{0,}[\d]{1,3}[-\d]{0,2}[ ]{0,2}[CREDITScredits ]*|[ ]{0,}[\d]{1,3}[ ]{0,2}[CREDITScreditsHOUhou ]*)[ \t]{0,3}$/;  // Single-line version of above
const regex_a7d = /^(MAJOR)([\t]{0,2})([ ]{0,}[\d]{1,3}[-\d]{0,2}[ ]{0,2}[CREDITScredits ]*|[ ]{0,}[\d]{1,3}[ ]{0,2}[CREDITScreditsHOUhou ]*)[ \t]{0,3}$/gm;  // Looking specifically for the word : ^MAJOR TAB and then some type of Number and Hours or Credits etc.
const regex_a10 = /([A-Z]{3}[0-9]{4})([\t ]{1,3})([A-Z{1}][a-zA-Z\d *’'`.,&:\-\–\/()]*?)([\t ]*)([\d-\(\)]*)$/gm; // looks for the 2020 course numbers: ABC1234 and then for a [tab] - anytype of title then a [tab] and digit including a hypen if necessary

const regex_a8 = /^([ ]{0,3})([A-Za-z \d *’'`.,&:\-\–\/()]{6,})[\t]{0,2}([ ]{0,}[\d]{1,3}[-\d]{0,2}[ ]{0,2}[Ccredits]*)(?=[\r\n])/gm;  // catches "Group Name[tab]99 Credits" simple line item
const regex_a8_single = /^([ ]{0,3})([A-Za-z \d *’'`.,&:\-\–\/()]{6,})[\t]{0,2}([ ]{0,}[\d]{1,3}[-\d]{0,2}[ ]{0,2}[Ccredits]*)[ \t]{0,3}$/;  // Single-line version of above
const regex_a9 = /^[ ]{0,3}((Required|Remaining)[a-zA-Z\d *’'`.,&:\-\–\/() ]*(Requirements|Courses)[: ]*(?!\t))(?=[\r\n])/gm; // looking for headings
const regex_a_ = /(([ ]{0,}(\r\n|\n)[ ]{0,}(\r\n|\n))[\S ]{1,}([ ]{0,}(\r\n|\n)[ ]{0,}(\r\n|\n)))/gm;  // catches straggling lines that are page artifacts between pages

const regex_pa_c1 = /^([ ]{0,3}[A-Z]{2} in [a-zA-Z&\-() ]{6,}[\r\n]{1}(and |[A-Z]{1}[a-z]{2,} )[A-Z]{1}[a-zA-Z&\-() ]{6,40}(?=\n)|[A-Z\t:\-() ]{6,}|[A-Z]{2} in [A-Z]{1}[a-zA-Z&\-() ]{6,}[\r\n])([\s\S]*)/;  //finds the TRAD and AGS program names Majors as group 1 (including a /r/n), extracts everything else as group 2
const regex_pa_c2 = /^([ ]{0,3}██[\da-zA-Z()-: ]{5,}[\r\n])([\s\S]*)/gm; // separates the major's title from the rest of the raw text
const regex_pa_c3 = /([ ]{0,3}[A-Z]{1}[a-zA-Z, ]*Concentration)([\r\n]*)([\s\S]*)/; // separates the concentration tile from the rest of the raw text 
const regex_e1 = /^[\d]{1,2}[ ]{0,3}[\r\n]{1}/; // TRAD catches 1-2 credit digits
const regex_e2 = /^[\*]{0,1}[a-zA-Z\d]{1,2}[a-zA-Z\d *’'`,&:\-\–\/()]{1,20} [a-zA-Z\d*’'`,&:\-\–\/()]{1,20} [a-zA-Z\d*’'`,&:\-\–\/()]{1,20} [a-zA-Z\d*’'`.,&:\-\–\/() ]*/;
const regex_e3 = /^([a-zA-Z\d *’'`.,&:\-\–\/() ]{3,60})([ \t]*)([\d]{1,2}|\([\d] or [\d]\)|\([\d]{1,2}[\-\–][\d]{1,2}\))([ ]{0,3}[\r\n])([\s\S]*)/;
const regex_e4 = /^[ ]*(\([\d] or [\d]\)|\([\d]{1,2}[\-\–][\d]{1,2}\))([ ]*[\r\n])([\s\S]*)/;  // TRAD catches (0 or 1)
const regex_z1 = /[A-Z]{2,4}[0-9]{3,4}-[A-Z]{1,3}[A-Z]{0,1}|[A-Z]{2,4}[0-9]{3,4}[A-Z]{0,1}/; // looks for a course code
const regex_z2 = /([\s\S]*\)[ ]{1,2}\d weeks)([ ]*)([A-Z]{1}[a-z]{3}[\s\S]*|A [a-z]{3}[\s\S]*)/;	
const regex_z3 = /([A-Z]{2,4}[0-9]{3,4}[A-Z]{0,3}-[A-Z]{1,3}(?=[ \t]{1,4}[A-Z])|[A-Z]{2,4}[0-9]{3,4}[A-Z]{0,3}(?=[ \t]{1,4}[A-Z])|[A-Z]{2} \| [A-Z ]{2,20}[\r\n])([  \t]{1,3})([A-Z{1}][a-zA-Z\d *’'`.,&:\-\–\/() ]{3,120}){0,1}/gm;// this regex finds the code and includes a look-head that will discover a title upto 3 spaces away, and groups results
const regex_c2 = /^([A-Z]{2,4}[0-9]{3,4}[A-Z]{0,3}-[A-Z]{1,3}(?=[ \t]{1,4}[A-Z])|[A-Z]{2,4}[0-9]{3,4}[A-Z]{0,3}(?=[ \t]{1,4}[A-Z])|[A-Z]{2} \| [A-Z ]{2,20}[\r\n])[  \t]{1,3}([A-Z{1}][a-zA-Z\d *’'`.,&:\-\–\/() ]{3,120})(\s){0,1}/; // almost identical to above, but kinda needs differnt groups -- should be refactored at some point -- unsure why "/gm" needs to be removed at the end of the regex code - will need further inspection 

const regex_z4 = /[ \t]*[\r\n]/gm; // find an unlimited amount of tabs or spaces prior to the return or newline characters
const regex_z5 = /([\s\S]*[ ]{0,2})( [a-zA-Z][a-z]{1,}[ ]{0,3}[a-zA-Z][a-z]{1,} )([ ]{0,2}[\s\S]*)/;
const regex_z6 = /([\s\S]*)( [a-zA-Z][a-z]{1,}- [a-z][a-z,]{1,} )([\s\S]*)/;
const regex_z7 = /([A-Z]{2,4}[0-9]{3,4}[A-Z]{0,3}-[A-Z]{1,3}(?=[ \t]{1,4}[A-Z])|[A-Z]{2,4}[0-9]{3,4}[A-Z]{0,3}(?=[ \t]{1,4}[A-Z])|[A-Z]{2,4}[0-9]{3,4}[A-Z]{0,3}(?=[, \t]{1,4}[A-Z]))/gm; // this regex finds the code and includes a look-head that will discover a title upto 3 spaces away, and groups results
const regex_t1 = /([\S ]*)[\t]([\S ]*)/; // discovers anything before and behind a tab (group1)[TAB](group2)
const regex_t2 = /([\S\s]*?)<i split><\/i>([\S\s]*)/gm; // groups everything after the html: <i split></i> segments it into a the before and after group
const regex_ra1 = /^([\S ]*)(p. 32|p.32|p32)([\S])([\t\S ]*)/; // looks for any reference of page 32 in and groups the text as (group1)(pg32)(group3)(group4)end of line...

// need this to cross over scope into an annonymous function.
document.catalogObj.const['regex_t2'] = regex_t2;