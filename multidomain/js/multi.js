window.onload = function() {
  var contents = document.getElementById('contents');

  window.SHARED_LIB.setData("SOME MORE INFO");
  
  contents.innerHTML = "<p>" + window.SHARED_LIB.getData() + "</p>";
};