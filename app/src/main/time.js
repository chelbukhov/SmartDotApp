function timeConverter(UNIX_timestamp, fullDateTime){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    if (fullDateTime) {
      var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    } else {
      time = date + ' ' + month + ' ' + year ;
    }
    return time;
  }

export default timeConverter;