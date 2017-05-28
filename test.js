var obj = {
  'a': 'a',
  'b': function() {
    console.log(this.a);
  }
}

obj.b();
