/*
 OverlappingMarkerSpiderfier
https://github.com/jawj/OverlappingMarkerSpiderfier
Copyright (c) 2011 - 2017 George MacKerron
Released under the MIT licence: http://opensource.org/licenses/mit-license
Note: The Google Maps API v3 must be included *before* this code
*/
(function(){var m,t,w,y,u,z={}.hasOwnProperty,A=[].slice;this.OverlappingMarkerSpiderfier=function(){function r(a,d){var b,f,e;this.map=a;null==d&&(d={});null==this.constructor.N&&(this.constructor.N=!0,h=google.maps,l=h.event,p=h.MapTypeId,c.keepSpiderfied=!1,c.ignoreMapClick=!1,c.markersWontHide=!1,c.markersWontMove=!1,c.basicFormatEvents=!1,c.nearbyDistance=20,c.circleSpiralSwitchover=9,c.circleFootSeparation=23,c.circleStartAngle=x/12,c.spiralFootSeparation=26,c.spiralLengthStart=11,c.spiralLengthFactor=
    4,c.spiderfiedZIndex=h.Marker.MAX_ZINDEX+2E4,c.highlightedLegZIndex=h.Marker.MAX_ZINDEX+1E4,c.usualLegZIndex=h.Marker.MAX_ZINDEX+1,c.legWeight=1.5,c.legColors={usual:{},highlighted:{}},e=c.legColors.usual,f=c.legColors.highlighted,e[p.HYBRID]=e[p.SATELLITE]="#fff",f[p.HYBRID]=f[p.SATELLITE]="#f00",e[p.TERRAIN]=e[p.ROADMAP]="#444",f[p.TERRAIN]=f[p.ROADMAP]="#f00",this.constructor.j=function(a){return this.setMap(a)},this.constructor.j.prototype=new h.OverlayView,this.constructor.j.prototype.draw=function(){});
    for(b in d)z.call(d,b)&&(f=d[b],this[b]=f);this.g=new this.constructor.j(this.map);this.C();this.c={};this.B=this.l=null;this.addListener("click",function(a,b){return l.trigger(a,"spider_click",b)});this.addListener("format",function(a,b){return l.trigger(a,"spider_format",b)});this.ignoreMapClick||l.addListener(this.map,"click",function(a){return function(){return a.unspiderfy()}}(this));l.addListener(this.map,"maptypeid_changed",function(a){return function(){return a.unspiderfy()}}(this));l.addListener(this.map,
    "zoom_changed",function(a){return function(){a.unspiderfy();if(!a.basicFormatEvents)return a.h()}}(this))}var l,h,m,v,p,c,t,x,u;c=r.prototype;t=[r,c];m=0;for(v=t.length;m<v;m++)u=t[m],u.VERSION="1.0.3";x=2*Math.PI;h=l=p=null;r.markerStatus={SPIDERFIED:"SPIDERFIED",SPIDERFIABLE:"SPIDERFIABLE",UNSPIDERFIABLE:"UNSPIDERFIABLE",UNSPIDERFIED:"UNSPIDERFIED"};c.C=function(){this.a=[];this.s=[]};c.addMarker=function(a,d){a.setMap(this.map);return this.trackMarker(a,d)};c.trackMarker=function(a,d){var b;if(null!=
    a._oms)return this;a._oms=!0;b=[l.addListener(a,"click",function(b){return function(d){return b.V(a,d)}}(this))];this.markersWontHide||b.push(l.addListener(a,"visible_changed",function(b){return function(){return b.D(a,!1)}}(this)));this.markersWontMove||b.push(l.addListener(a,"position_changed",function(b){return function(){return b.D(a,!0)}}(this)));null!=d&&b.push(l.addListener(a,"spider_click",d));this.s.push(b);this.a.push(a);this.basicFormatEvents?this.trigger("format",a,this.constructor.markerStatus.UNSPIDERFIED):
    (this.trigger("format",a,this.constructor.markerStatus.UNSPIDERFIABLE),this.h());return this};c.D=function(a,d){if(!this.J&&!this.K)return null==a._omsData||!d&&a.getVisible()||this.unspiderfy(d?a:null),this.h()};c.getMarkers=function(){return this.a.slice(0)};c.removeMarker=function(a){this.forgetMarker(a);return a.setMap(null)};c.forgetMarker=function(a){var d,b,f,e,g;null!=a._omsData&&this.unspiderfy();d=this.A(this.a,a);if(0>d)return this;g=this.s.splice(d,1)[0];b=0;for(f=g.length;b<f;b++)e=g[b],
    l.removeListener(e);delete a._oms;this.a.splice(d,1);this.h();return this};c.removeAllMarkers=c.clearMarkers=function(){var a,d,b,f;f=this.getMarkers();this.forgetAllMarkers();a=0;for(d=f.length;a<d;a++)b=f[a],b.setMap(null);return this};c.forgetAllMarkers=function(){var a,d,b,f,e,g,c,q;this.unspiderfy();q=this.a;a=d=0;for(b=q.length;d<b;a=++d){g=q[a];e=this.s[a];c=0;for(a=e.length;c<a;c++)f=e[c],l.removeListener(f);delete g._oms}this.C();return this};c.addListener=function(a,d){var b;(null!=(b=this.c)[a]?
    b[a]:b[a]=[]).push(d);return this};c.removeListener=function(a,d){var b;b=this.A(this.c[a],d);0>b||this.c[a].splice(b,1);return this};c.clearListeners=function(a){this.c[a]=[];return this};c.trigger=function(){var a,d,b,f,e,g;d=arguments[0];a=2<=arguments.length?A.call(arguments,1):[];d=null!=(b=this.c[d])?b:[];g=[];f=0;for(e=d.length;f<e;f++)b=d[f],g.push(b.apply(null,a));return g};c.L=function(a,d){var b,f,e,g,c;g=this.circleFootSeparation*(2+a)/x;f=x/a;c=[];for(b=e=0;0<=a?e<a:e>a;b=0<=a?++e:--e)b=
    this.circleStartAngle+b*f,c.push(new h.Point(d.x+g*Math.cos(b),d.y+g*Math.sin(b)));return c};c.M=function(a,d){var b,f,e,c,k;c=this.spiralLengthStart;b=0;k=[];for(f=e=0;0<=a?e<a:e>a;f=0<=a?++e:--e)b+=this.spiralFootSeparation/c+5E-4*f,f=new h.Point(d.x+c*Math.cos(b),d.y+c*Math.sin(b)),c+=x*this.spiralLengthFactor/b,k.push(f);return k};c.V=function(a,d){var b,f,e,c,k,q,n,l,h;(q=null!=a._omsData)&&this.keepSpiderfied||this.unspiderfy();if(q||this.map.getStreetView().getVisible()||"GoogleEarthAPI"===
    this.map.getMapTypeId())return this.trigger("click",a,d);q=[];n=[];b=this.nearbyDistance;l=b*b;k=this.f(a.position);h=this.a;b=0;for(f=h.length;b<f;b++)e=h[b],null!=e.map&&e.getVisible()&&(c=this.f(e.position),this.i(c,k)<l?q.push({R:e,G:c}):n.push(e));return 1===q.length?this.trigger("click",a,d):this.W(q,n)};c.markersNearMarker=function(a,d){var b,f,e,c,k,q,n,l,h,m;null==d&&(d=!1);if(null==this.g.getProjection())throw"Must wait for 'idle' event on map before calling markersNearMarker";b=this.nearbyDistance;
    n=b*b;k=this.f(a.position);q=[];l=this.a;b=0;for(f=l.length;b<f&&!(e=l[b],e!==a&&null!=e.map&&e.getVisible()&&(c=this.f(null!=(h=null!=(m=e._omsData)?m.v:void 0)?h:e.position),this.i(c,k)<n&&(q.push(e),d)));b++);return q};c.F=function(){var a,d,b,f,e,c,k,l,n,h,m;if(null==this.g.getProjection())throw"Must wait for 'idle' event on map before calling markersNearAnyOtherMarker";n=this.nearbyDistance;n*=n;var p;e=this.a;p=[];h=0;for(d=e.length;h<d;h++)f=e[h],p.push({H:this.f(null!=(a=null!=(b=f._omsData)?
    b.v:void 0)?a:f.position),b:!1});h=this.a;a=b=0;for(f=h.length;b<f;a=++b)if(d=h[a],null!=d.getMap()&&d.getVisible()&&(c=p[a],!c.b))for(m=this.a,d=l=0,e=m.length;l<e;d=++l)if(k=m[d],d!==a&&null!=k.getMap()&&k.getVisible()&&(k=p[d],(!(d<a)||k.b)&&this.i(c.H,k.H)<n)){c.b=k.b=!0;break}return p};c.markersNearAnyOtherMarker=function(){var a,d,b,c,e,g,k;e=this.F();g=this.a;k=[];a=d=0;for(b=g.length;d<b;a=++d)c=g[a],e[a].b&&k.push(c);return k};c.setImmediate=function(a){return window.setTimeout(a,0)};c.h=
    function(){if(!this.basicFormatEvents&&null==this.l)return this.l=this.setImmediate(function(a){return function(){a.l=null;return null!=a.g.getProjection()?a.w():null!=a.B?void 0:a.B=l.addListenerOnce(a.map,"idle",function(){return a.w()})}}(this))};c.w=function(){var a,d,b,c,e,g,k;if(this.basicFormatEvents){e=[];d=0;for(b=markers.length;d<b;d++)c=markers[d],a=null!=c._omsData?"SPIDERFIED":"UNSPIDERFIED",e.push(this.trigger("format",c,this.constructor.markerStatus[a]));return e}e=this.F();g=this.a;
    k=[];a=b=0;for(d=g.length;b<d;a=++b)c=g[a],a=null!=c._omsData?"SPIDERFIED":e[a].b?"SPIDERFIABLE":"UNSPIDERFIABLE",k.push(this.trigger("format",c,this.constructor.markerStatus[a]));return k};c.P=function(a){return{m:function(d){return function(){return a._omsData.o.setOptions({strokeColor:d.legColors.highlighted[d.map.mapTypeId],zIndex:d.highlightedLegZIndex})}}(this),u:function(d){return function(){return a._omsData.o.setOptions({strokeColor:d.legColors.usual[d.map.mapTypeId],zIndex:d.usualLegZIndex})}}(this)}};
    c.W=function(a,d){var b,c,e,g,k,q,n,m,p,r;this.J=!0;r=a.length;b=this.T(function(){var b,d,c;c=[];b=0;for(d=a.length;b<d;b++)m=a[b],c.push(m.G);return c}());g=r>=this.circleSpiralSwitchover?this.M(r,b).reverse():this.L(r,b);b=function(){var b,d,f;f=[];b=0;for(d=g.length;b<d;b++)e=g[b],c=this.U(e),p=this.S(a,function(a){return function(b){return a.i(b.G,e)}}(this)),n=p.R,q=new h.Polyline({map:this.map,path:[n.position,c],strokeColor:this.legColors.usual[this.map.mapTypeId],strokeWeight:this.legWeight,
    zIndex:this.usualLegZIndex}),n._omsData={v:n.getPosition(),X:n.getZIndex(),o:q},this.legColors.highlighted[this.map.mapTypeId]!==this.legColors.usual[this.map.mapTypeId]&&(k=this.P(n),n._omsData.O={m:l.addListener(n,"mouseover",k.m),u:l.addListener(n,"mouseout",k.u)}),this.trigger("format",n,this.constructor.markerStatus.SPIDERFIED),n.setPosition(c),n.setZIndex(Math.round(this.spiderfiedZIndex+e.y)),f.push(n);return f}.call(this);delete this.J;this.I=!0;return this.trigger("spiderfy",b,d)};c.unspiderfy=
    function(a){var d,b,c,e,g,k,h;null==a&&(a=null);if(null==this.I)return this;this.K=!0;h=[];g=[];k=this.a;d=0;for(b=k.length;d<b;d++)e=k[d],null!=e._omsData?(e._omsData.o.setMap(null),e!==a&&e.setPosition(e._omsData.v),e.setZIndex(e._omsData.X),c=e._omsData.O,null!=c&&(l.removeListener(c.m),l.removeListener(c.u)),delete e._omsData,e!==a&&(c=this.basicFormatEvents?"UNSPIDERFIED":"SPIDERFIABLE",this.trigger("format",e,this.constructor.markerStatus[c])),h.push(e)):g.push(e);delete this.K;delete this.I;
    this.trigger("unspiderfy",h,g);return this};c.i=function(a,d){var b,c;b=a.x-d.x;c=a.y-d.y;return b*b+c*c};c.T=function(a){var c,b,f,e,g;c=e=g=0;for(b=a.length;c<b;c++)f=a[c],e+=f.x,g+=f.y;a=a.length;return new h.Point(e/a,g/a)};c.f=function(a){return this.g.getProjection().fromLatLngToDivPixel(a)};c.U=function(a){return this.g.getProjection().fromDivPixelToLatLng(a)};c.S=function(a,c){var b,d,e,g,k,h;e=k=0;for(h=a.length;k<h;e=++k)if(g=a[e],g=c(g),"undefined"===typeof b||null===b||g<d)d=g,b=e;return a.splice(b,
    1)[0]};c.A=function(a,c){var b,d,e,g;if(null!=a.indexOf)return a.indexOf(c);b=d=0;for(e=a.length;d<e;b=++d)if(g=a[b],g===c)return b;return-1};return r}();t=/(\?.*(&|&amp;)|\?)spiderfier_callback=(\w+)/;m=document.currentScript;null==m&&(m=function(){var m,l,h,w,v;h=document.getElementsByTagName("script");v=[];m=0;for(l=h.length;m<l;m++)u=h[m],null!=(w=u.getAttribute("src"))&&w.match(t)&&v.push(u);return v}()[0]);if(null!=m&&(m=null!=(w=m.getAttribute("src"))?null!=(y=w.match(t))?y[3]:void 0:void 0)&&
    "function"===typeof window[m])window[m]();"function"===typeof window.spiderfier_callback&&window.spiderfier_callback()}).call(this);
    /* Thu 11 May 2017 08:40:57 BST */