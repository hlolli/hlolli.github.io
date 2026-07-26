// Compiled by ClojureScript 1.9.89 {:static-fns true, :optimize-constants true}
goog.provide('ui.util');
goog.require('cljs.core');
goog.require('cognitect.transit');
goog.require('om.transit');
goog.require('goog.net.XhrIo');
ui.util.transit_post = (function ui$util$transit_post(url){
return (function (p__14941,cb){
var map__14942 = p__14941;
var map__14942__$1 = ((((!((map__14942 == null)))?((((map__14942.cljs$lang$protocol_mask$partition0$ & (64))) || (map__14942.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__14942):map__14942);
var remote = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__14942__$1,cljs.core.cst$kw$remote);
return goog.net.XhrIo.send(url,((function (map__14942,map__14942__$1,remote){
return (function (e){
var this$ = this;
var G__14944 = cognitect.transit.read(om.transit.reader.cljs$core$IFn$_invoke$arity$0(),this$.getResponseText());
return (cb.cljs$core$IFn$_invoke$arity$1 ? cb.cljs$core$IFn$_invoke$arity$1(G__14944) : cb.call(null,G__14944));
});})(map__14942,map__14942__$1,remote))
,"POST",cognitect.transit.write(om.transit.writer.cljs$core$IFn$_invoke$arity$0(),remote),{"Content-Type": "application/transit+json"});
});
});
