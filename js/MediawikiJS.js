!function(){"use strict";function a(b,c,d){return this instanceof a?("string"==typeof b?this.baseURL=b:(this.apiPath=b.apiPath,this.baseURL=b.baseURL),this.apiPath||(this.apiPath="/w/api.php"),void(c&&this.send(c,d))):new a(b,c,d)}var b=function(a){var b=0,c="MediaWikiJS",d="__JSONP__",e=a.document,f=e.documentElement;return function(g,h){var i=d+b++,j=e.createElement("script"),k=function(){try{delete a[c][i]}catch(b){a[c][i]=null}f.removeChild(j),h.apply(this,arguments)};a[c][i]=k,f.insertBefore(j,f.lastChild).src=g+(g.indexOf("?")>-1?"&":"?")+"callback="+c+"."+i}}(window);a.prototype.send=function(a,c){c=c||function(){};var d,e,f="";for(e in a)a.hasOwnProperty(e)&&(f+="&"+e+"="+encodeURIComponent(a[e]));d=this.baseURL+this.apiPath+"?format=json"+f,b(d,c)},window.MediaWikiJS=a}();