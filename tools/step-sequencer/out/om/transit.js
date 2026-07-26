// Compiled by ClojureScript 1.9.89 {:static-fns true, :optimize-constants true}
goog.provide('om.transit');
goog.require('cljs.core');
goog.require('cognitect.transit');
goog.require('com.cognitect.transit');
goog.require('om.tempid');

/**
* @constructor
 * @implements {om.transit.Object}
*/
om.transit.TempIdHandler = (function (){
})
om.transit.TempIdHandler.prototype.tag = (function (_){
var self__ = this;
var ___$1 = this;
return "om/id";
});

om.transit.TempIdHandler.prototype.rep = (function (r){
var self__ = this;
var _ = this;
return r.id;
});

om.transit.TempIdHandler.prototype.stringRep = (function (_){
var self__ = this;
var ___$1 = this;
return null;
});

om.transit.TempIdHandler.getBasis = (function (){
return cljs.core.PersistentVector.EMPTY;
});

om.transit.TempIdHandler.cljs$lang$type = true;

om.transit.TempIdHandler.cljs$lang$ctorStr = "om.transit/TempIdHandler";

om.transit.TempIdHandler.cljs$lang$ctorPrWriter = (function (this__7405__auto__,writer__7406__auto__,opt__7407__auto__){
return cljs.core._write(writer__7406__auto__,"om.transit/TempIdHandler");
});

om.transit.__GT_TempIdHandler = (function om$transit$__GT_TempIdHandler(){
return (new om.transit.TempIdHandler());
});

om.transit.writer = (function om$transit$writer(var_args){
var args14921 = [];
var len__7936__auto___14924 = arguments.length;
var i__7937__auto___14925 = (0);
while(true){
if((i__7937__auto___14925 < len__7936__auto___14924)){
args14921.push((arguments[i__7937__auto___14925]));

var G__14926 = (i__7937__auto___14925 + (1));
i__7937__auto___14925 = G__14926;
continue;
} else {
}
break;
}

var G__14923 = args14921.length;
switch (G__14923) {
case 0:
return om.transit.writer.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return om.transit.writer.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args14921.length)].join('')));

}
});

om.transit.writer.cljs$core$IFn$_invoke$arity$0 = (function (){
return om.transit.writer.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
});

om.transit.writer.cljs$core$IFn$_invoke$arity$1 = (function (opts){
return cognitect.transit.writer.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$json,cljs.core.assoc_in(opts,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$handlers,om.tempid.TempId], null),(new om.transit.TempIdHandler())));
});

om.transit.writer.cljs$lang$maxFixedArity = 1;

om.transit.reader = (function om$transit$reader(var_args){
var args14928 = [];
var len__7936__auto___14931 = arguments.length;
var i__7937__auto___14932 = (0);
while(true){
if((i__7937__auto___14932 < len__7936__auto___14931)){
args14928.push((arguments[i__7937__auto___14932]));

var G__14933 = (i__7937__auto___14932 + (1));
i__7937__auto___14932 = G__14933;
continue;
} else {
}
break;
}

var G__14930 = args14928.length;
switch (G__14930) {
case 0:
return om.transit.reader.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return om.transit.reader.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args14928.length)].join('')));

}
});

om.transit.reader.cljs$core$IFn$_invoke$arity$0 = (function (){
return om.transit.reader.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
});

om.transit.reader.cljs$core$IFn$_invoke$arity$1 = (function (opts){
return cognitect.transit.reader.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$json,cljs.core.assoc_in(opts,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$handlers,"om/id"], null),(function (id){
return om.tempid.tempid.cljs$core$IFn$_invoke$arity$1(id);
})));
});

om.transit.reader.cljs$lang$maxFixedArity = 1;

