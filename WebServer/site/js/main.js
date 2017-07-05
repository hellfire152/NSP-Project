// function download(){

// 	var ep=new ExcelPlus();
// // We're going to do several tasks in one line of code:
// // 1) create an Excel with one sheet called "Book1"
// // 2) write some data from an array to the new-created sheet
// // 3) create a new sheet called "Book2"
// // 4) write "A1" in cell "A1" of the new-created sheet
// // 5) write the today date in D1 of the "Book1" sheet
// // 6) save it on the user computer (this last step only works with IE10+ and modern browsers)

// ep.createFile("Book1")
// 	.write({ "content":[ ["Questions"] ] })
//   .createSheet("Book2")
//   .write({ "cell":"A1", "content":"A1" })
//   .write({ "sheet":"Book1", "cell":"D1", "content":new Date() })
//   .write({"cell": "A2", "content": "Blah Blah", "style": 

//   })
//   .saveAs("demo.xlsx");
// }
/* bookType can be any supported output type */

var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };
var workbook = new Workbook();
var wbout = XLSX.write(workbook,wopts);

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

/* the saveAs call downloads a file on the local machine */
saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "test.xlsx");
