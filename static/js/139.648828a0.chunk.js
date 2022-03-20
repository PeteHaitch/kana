!function(){"use strict";var t={139:function(t,e,n){var r=n(3515),i=n(519),a=(n(9288),n(1305),n(1402),n(3754),n(6301),n(8333),n(9586),n(944),n(4657),n(5026),n(8538),n(1620)),s=(n(8840),n(5671)),o=n(3144),u=function(){function t(e,n){(0,s.Z)(this,t),this.status=e,this.coordinates=n}return(0,o.Z)(t,[{key:"clone",value:function(){return new t(this.status.deepcopy(),this.coordinates.clone())}},{key:"numberOfCells",value:function(){return this.status.num_obs()}},{key:"iterations",value:function(){return this.status.iterations()}},{key:"extractCoordinates",value:function(){return i.ab(this.numberOfCells(),this.coordinates.array())}},{key:"free",value:function(){null!==this.status&&(this.status.delete(),this.status=null),null!==this.coordinates&&(this.coordinates.free(),this.coordinates=null)}}]),t}();function f(t){return r.RE((function(e){return e.perplexity_to_k(t)}))}function c(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=e.maxIterations,i=void 0===n?1e3:n,a=e.runTime,s=void 0===a?null:a;null===s&&(s=-1),r.RE((function(e){return e.run_tsne(t.status,s,i,t.coordinates.offset)}))}n(552),n(5767),n(5325);var l=n(3324),d=n(7762);n(6737);function p(t){void 0!==t&&null!==t&&t.free()}function h(t,e){return JSON.stringify(t)!=JSON.stringify(e)}function v(t,e){if(Array.isArray(t)){var n,r=(0,d.Z)(t);try{for(r.s();!(n=r.n()).done;){v(n.value,e)}}catch(o){r.e(o)}finally{r.f()}}else if(t.constructor==Object)for(var i=0,a=Object.entries(t);i<a.length;i++){var s=(0,l.Z)(a[i],2);s[0];v(s[1],e)}else if(ArrayBuffer.isView(t)){if(!(t.buffer instanceof ArrayBuffer))throw"only ArrayBuffers should be in the message payload";e.push(t.buffer)}}var y,b={},m=!1,g={},x={};function O(t,e){b.init.numberOfCells();var n=function(t){return t?75:1e6}(t),r=b.init.clone();try{for(;r.iterations()<e;)if(c(r,{runTime:n,maxIterations:e}),t){var i=r.extractCoordinates();postMessage({type:"tsne_iter",x:i.x,y:i.y,iteration:r.iterations()},[i.x.buffer,i.y.buffer])}b.final=r.extractCoordinates()}finally{r.free()}}onmessage=function(t){var e=t.data.id;"INIT"==t.data.cmd?(y=r.j2({numberOfThreads:1})).then((function(t){postMessage({id:e,type:"init_worker",data:{status:"SUCCESS"}})})).catch((function(t){postMessage({id:e,type:"error",error:t})})):"RUN"==t.data.cmd?y.then((function(n){var s;"neighbors"in t.data?(p(b.neighbors),b.neighbors=function(t){var e=null,n=null,r=null,s=null;try{var o=t.num_obs,u=t.size;(n=i.Wf(o)).set(t.runs),(r=i.Wf(u)).set(t.indices),(s=i.RJ(u)).set(t.distances),e=a.Tz.unserialize(n,r,s)}finally{null!==n&&n.free(),null!==r&&r.free(),null!==s&&s.free()}return e}(t.data.neighbors),s=!0):s=!1;var o={perplexity:t.data.params.perplexity};s||h(o,g)?(p(b.init),b.init=function(t){var e,n,s,o,c=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},l=c.perplexity,d=void 0===l?30:l,p=c.checkMismatch,h=void 0===p||p;try{var v;if(t instanceof a.DV){var y=f(d);e=(0,a.wf)(t,y),v=e}else{if(h)if(f(d)*t.numberOfCells()!=t.size())throw"number of neighbors in 'x' does not match '3 * perplexity'";v=t}n=r.RE((function(t){return t.initialize_tsne(v.results,d)})),s=i.RJ(2*v.numberOfCells()),r.RE((function(t){return t.randomize_tsne_start(v.numberOfCells(),s.offset,42)})),o=new u(n,s)}catch(b){throw i.gd(n),i.gd(s),b}finally{i.gd(e)}return o}(b.neighbors,{perplexity:o.perplexity}),g=o,m=!0):m=!1;var c={iterations:t.data.params.iterations};(m||h(c,x))&&(O(t.data.params.animate,c.iterations),x=c),postMessage({id:e,type:"tsne_run",data:{status:"SUCCESS"}})})).catch((function(t){postMessage({id:e,type:"error",error:t})})):"RERUN"==t.data.cmd?y.then((function(t){O(!0,x.iterations),postMessage({id:e,type:"tsne_rerun",data:{status:"SUCCESS"}})})).catch((function(t){postMessage({id:e,type:"error",error:t})})):"FETCH"==t.data.cmd&&y.then((function(t){var n={x:b.final.x.slice(),y:b.final.y.slice(),iterations:x.iterations},r=[];v(n,r),postMessage({id:e,type:"tsne_fetch",data:n},r)})).catch((function(t){postMessage({id:e,type:"error",error:t})}))}}},e={};function n(r){var i=e[r];if(void 0!==i)return i.exports;var a=e[r]={exports:{}};return t[r](a,a.exports,n),a.exports}n.m=t,n.x=function(){var t=n.O(void 0,[275,991],(function(){return n(139)}));return t=n.O(t)},function(){var t=[];n.O=function(e,r,i,a){if(!r){var s=1/0;for(c=0;c<t.length;c++){r=t[c][0],i=t[c][1],a=t[c][2];for(var o=!0,u=0;u<r.length;u++)(!1&a||s>=a)&&Object.keys(n.O).every((function(t){return n.O[t](r[u])}))?r.splice(u--,1):(o=!1,a<s&&(s=a));if(o){t.splice(c--,1);var f=i();void 0!==f&&(e=f)}}return e}a=a||0;for(var c=t.length;c>0&&t[c-1][2]>a;c--)t[c]=t[c-1];t[c]=[r,i,a]}}(),n.d=function(t,e){for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},n.f={},n.e=function(t){return Promise.all(Object.keys(n.f).reduce((function(e,r){return n.f[r](t,e),e}),[]))},n.u=function(t){return"static/js/"+t+"."+{275:"a46fbc3b",495:"9608b3d0",991:"278851b9"}[t]+".chunk.js"},n.miniCssF=function(t){},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/kana/",function(){n.b=self.location+"/../../../";var t={139:1};n.f.i=function(e,r){t[e]||importScripts(n.p+n.u(e))};var e=self.webpackChunkkana=self.webpackChunkkana||[],r=e.push.bind(e);e.push=function(e){var i=e[0],a=e[1],s=e[2];for(var o in a)n.o(a,o)&&(n.m[o]=a[o]);for(s&&s(n);i.length;)t[i.pop()]=1;r(e)}}(),function(){var t=n.x;n.x=function(){return Promise.all([n.e(275),n.e(991)]).then(t)}}();n.x()}();
//# sourceMappingURL=139.648828a0.chunk.js.map