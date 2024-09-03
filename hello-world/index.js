const fs = require('fs')
fs.writeFile("sample.txt", "hello all this is my sample file", (err) => {
    if (err) console.log(err);
    console.log("file written")
})


fs.appendFile("sample.txt", " this sentances is added", (err) => {
    if (err) console.log(err);
})
fs.readFile("sample.txt", (err, data) => {
    if (err) console.log(err);
    console.log(data.toString());
})
fs.rename("sample.txt", "test.txt", (err) => {
    if (err) throw err;
    console.log("File name updated!");
});
fs.unlink("test.txt", (err) => {
    if (err) throw err;
    console.log("File test.txt deleted successfully!");
});

fs.mkdir("hii",(err)=>{
    if(err)console.log(err);
})

fs.rmdir("hii",(err)=>{
    if(err)console.log(err);
})