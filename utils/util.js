function ellipsis(str, max) {
  var len = str.length,
    list = str.split(''),
    i, t = 0;
  for (i = 0; i < len; i++) {
    t++;
    if (/[^\x00-\x80]/g.test(list[i])) {
      t++;
    }
    if (t >= max) {
      return str.slice(0, i) + '';
    }
  }
  return str;
}


module.exports = {
  ellipsis: ellipsis,
  
};