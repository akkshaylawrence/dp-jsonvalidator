function checkData() {
   var data = document.getElementById("data").value;
   var result = document.getElementById("result");
   var error = document.getElementById("error");
   var mydiv = document.getElementById("right");
   var schema = {
      type:"object",
      properties: {
         smaller: {
            type: "number"
         },
         larger: {
            type: "number"
         }
      }
   };
   var validData = {};
   try {
      validData = JSON.parse(data);
      valid = validate(validData, schema);
      if (valid) {
         result.className -= " fail";
         result.className += " success";
         result.innerHTML = "JSON is valid!";
         error.innerHTML = "";
      } else {
         result.className -= " success";
         result.className += " fail";
         result.innerHTML = "JSON Invalid";
         for (i in validate.errors) {
            var errorp = document.createElement("p");
            errorp.innerHTML = validate.errors[i].message;
            mydiv.appendChild(errorp);
         }
      }
   } catch (e) {
      result.className -= " success";
      result.className += " fail";
      result.innerHTML = "Error";
      error.innerHTML = e;
   }
}