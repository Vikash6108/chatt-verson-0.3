const multer =require("multer");
// Hold uploads in memory as Buffers
const storage=multer.memoryStorage();
const upload=multer({storage:storage})


module.exports =upload




