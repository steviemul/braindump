window.SHARED_LIB = (function() {

  return {
    getData : function() {
      return localStorage.getItem("data");
    },
    setData : function(data) {
      localStorage.setItem("data", data);
    }
  }
})();