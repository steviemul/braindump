
var one = function(pValue) {
  return pValue + ' one';
}

var two = function(pValue) {
  return pValue + ' two';
};

var three = function(pValue) {
  return pValue + ' three';
};

function compose() {

  var fns = [];

  for (var i=0;i<arguments.length;i++) {
    fns[i] = arguments[i];
  }

  return function(pValue) {
    return fns.reduceRight(function(value, fn) {
      return fn(value);
    }, pValue);
  };
}

function pipe() {

  var fns = [];

  for (var i=0;i<arguments.length;i++) {
    fns[i] = arguments[i];
  }

  return function(pValue) {
    return fns.reduce(function(value, fn) {
      return fn(value);
    }, pValue);
  };
}

function process(pValue) {

  var processor = compose(
    three,
    two,
    one
  );

  var result = processor(pValue);

  console.log(result);

  processor = pipe(
    three,
    two,
    one
  );

  result = processor('bob');

  console.log(result);
}

process('steve');