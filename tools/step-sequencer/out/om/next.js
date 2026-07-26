// Compiled by ClojureScript 1.9.89 {:static-fns true, :optimize-constants true}
goog.provide('om.next');
goog.require('cljs.core');
goog.require('goog.log');
goog.require('goog.string');
goog.require('om.next.cache');
goog.require('clojure.zip');
goog.require('om.next.protocols');
goog.require('om.next.impl.parser');
goog.require('goog.object');
goog.require('om.util');
goog.require('om.tempid');
goog.require('om.transit');
goog.require('goog.debug.Console');
if(typeof om.next._STAR_logger_STAR_ !== 'undefined'){
} else {
om.next._STAR_logger_STAR_ = ((goog.DEBUG)?(function (){
(new goog.debug.Console()).setCapturing(true);

return goog.log.getLogger("om.next");
})()
:null);
}
om.next.roots = (function (){var G__15225 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__15225) : cljs.core.atom.call(null,G__15225));
})();
om.next._STAR_raf_STAR_ = null;
om.next._STAR_reconciler_STAR_ = null;
om.next._STAR_parent_STAR_ = null;
om.next._STAR_shared_STAR_ = null;
om.next._STAR_instrument_STAR_ = null;
om.next._STAR_depth_STAR_ = (0);
om.next.nil_or_map_QMARK_ = (function om$next$nil_or_map_QMARK_(x){
return ((x == null)) || (cljs.core.map_QMARK_(x));
});
/**
 * Given a query expression return its key.
 */
om.next.expr__GT_key = (function om$next$expr__GT_key(expr){
if((expr instanceof cljs.core.Keyword)){
return expr;
} else {
if(cljs.core.map_QMARK_(expr)){
return cljs.core.ffirst(expr);
} else {
if(cljs.core.seq_QMARK_(expr)){
var expr_SINGLEQUOTE_ = cljs.core.first(expr);
if(cljs.core.map_QMARK_(expr_SINGLEQUOTE_)){
return cljs.core.ffirst(expr_SINGLEQUOTE_);
} else {
return null;
}
} else {
if(om.util.ident_QMARK_(expr)){
var G__15227 = expr;
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$sym$_,cljs.core.second(expr))){
return cljs.core.first(G__15227);
} else {
return G__15227;
}
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2([cljs.core.str("Invalid query expr "),cljs.core.str(expr)].join(''),new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$type,cljs.core.cst$kw$error_SLASH_invalid_DASH_expression], null));

}
}
}
}
});
/**
 * Return a zipper on a query expression.
 */
om.next.query_zip = (function om$next$query_zip(root){
return clojure.zip.zipper((function (p1__15228_SHARP_){
return (cljs.core.vector_QMARK_(p1__15228_SHARP_)) || (cljs.core.map_QMARK_(p1__15228_SHARP_)) || (cljs.core.seq_QMARK_(p1__15228_SHARP_));
}),cljs.core.seq,(function (node,children){
var ret = ((cljs.core.vector_QMARK_(node))?cljs.core.vec(children):((cljs.core.map_QMARK_(node))?cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,children):((cljs.core.seq_QMARK_(node))?children:null)));
return cljs.core.with_meta(ret,cljs.core.meta(node));
}),root);
});
/**
 * Move from the current zipper location to the specified key. loc must be a
 * hash map node.
 */
om.next.move_to_key = (function om$next$move_to_key(loc,k){
var loc__$1 = clojure.zip.down(loc);
while(true){
var node = clojure.zip.node(loc__$1);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(k,cljs.core.first(node))){
return clojure.zip.right(clojure.zip.down(loc__$1));
} else {
var G__15229 = clojure.zip.right(loc__$1);
loc__$1 = G__15229;
continue;
}
break;
}
});
/**
 * Given a query and a path into a query return a zipper focused at the location
 * specified by the path. This location can be replaced to customize / alter
 * the query.
 */
om.next.query_template = (function om$next$query_template(query,path){
var query_template_STAR_ = (function om$next$query_template_$_query_template_STAR_(loc,path__$1){
while(true){
if(cljs.core.empty_QMARK_(path__$1)){
return loc;
} else {
var node = clojure.zip.node(loc);
if(cljs.core.vector_QMARK_(node)){
var G__15262 = clojure.zip.down(loc);
var G__15263 = path__$1;
loc = G__15262;
path__$1 = G__15263;
continue;
} else {
var vec__15258 = path__$1;
var seq__15259 = cljs.core.seq(vec__15258);
var first__15260 = cljs.core.first(seq__15259);
var seq__15259__$1 = cljs.core.next(seq__15259);
var k = first__15260;
var ks = seq__15259__$1;
var k_SINGLEQUOTE_ = om.next.expr__GT_key(node);
if(cljs.core.keyword_identical_QMARK_(k,k_SINGLEQUOTE_)){
if((cljs.core.map_QMARK_(node)) || ((cljs.core.seq_QMARK_(node)) && (cljs.core.map_QMARK_(cljs.core.first(node))))){
var loc_SINGLEQUOTE_ = om.next.move_to_key((function (){var G__15261 = loc;
if(cljs.core.seq_QMARK_(node)){
return clojure.zip.down(G__15261);
} else {
return G__15261;
}
})(),k);
var node_SINGLEQUOTE_ = clojure.zip.node(loc_SINGLEQUOTE_);
if(cljs.core.map_QMARK_(node_SINGLEQUOTE_)){
if(cljs.core.seq(ks)){
var G__15264 = clojure.zip.replace(loc_SINGLEQUOTE_,clojure.zip.node(om.next.move_to_key(loc_SINGLEQUOTE_,cljs.core.first(ks))));
var G__15265 = cljs.core.next(ks);
loc = G__15264;
path__$1 = G__15265;
continue;
} else {
return loc_SINGLEQUOTE_;
}
} else {
var G__15266 = loc_SINGLEQUOTE_;
var G__15267 = ks;
loc = G__15266;
path__$1 = G__15267;
continue;
}
} else {
var G__15268 = clojure.zip.right(clojure.zip.down(clojure.zip.down(clojure.zip.down(loc))));
var G__15269 = ks;
loc = G__15268;
path__$1 = G__15269;
continue;
}
} else {
var G__15270 = clojure.zip.right(loc);
var G__15271 = path__$1;
loc = G__15270;
path__$1 = G__15271;
continue;
}
}
}
break;
}
});
return query_template_STAR_(om.next.query_zip(query),path);
});
om.next.replace = (function om$next$replace(template,new_query){
return clojure.zip.root(clojure.zip.replace(template,new_query));
});
om.next.focused_join = (function om$next$focused_join(expr,ks,full_expr,union_expr){
var expr_meta = cljs.core.meta(expr);
var expr_SINGLEQUOTE_ = ((cljs.core.map_QMARK_(expr))?(function (){var join_value = cljs.core.second(cljs.core.first(expr));
var join_value__$1 = (((om.util.recursion_QMARK_(join_value)) && (cljs.core.seq(ks)))?((!((union_expr == null)))?union_expr:full_expr):join_value);
return cljs.core.PersistentArrayMap.fromArray([cljs.core.ffirst(expr),(om.next.focus_query_STAR_.cljs$core$IFn$_invoke$arity$3 ? om.next.focus_query_STAR_.cljs$core$IFn$_invoke$arity$3(join_value__$1,ks,null) : om.next.focus_query_STAR_.call(null,join_value__$1,ks,null))], true, false);
})():((cljs.core.seq_QMARK_(expr))?(function (){var x__7679__auto__ = om$next$focused_join(cljs.core.first(expr),ks,null,null);
return cljs.core._conj((function (){var x__7679__auto____$1 = cljs.core.second(expr);
return cljs.core._conj(cljs.core.List.EMPTY,x__7679__auto____$1);
})(),x__7679__auto__);
})():expr
));
var G__15281 = expr_SINGLEQUOTE_;
if(cljs.core.some_QMARK_(expr_meta)){
return cljs.core.with_meta(G__15281,expr_meta);
} else {
return G__15281;
}
});
om.next.focus_query_STAR_ = (function om$next$focus_query_STAR_(query,path,union_expr){
if(cljs.core.empty_QMARK_(path)){
return query;
} else {
var vec__15288 = path;
var seq__15289 = cljs.core.seq(vec__15288);
var first__15290 = cljs.core.first(seq__15289);
var seq__15289__$1 = cljs.core.next(seq__15289);
var k = first__15290;
var ks = seq__15289__$1;
var match = ((function (vec__15288,seq__15289,first__15290,seq__15289__$1,k,ks){
return (function om$next$focus_query_STAR__$_match(x){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(k,om.util.join_key(x));
});})(vec__15288,seq__15289,first__15290,seq__15289__$1,k,ks))
;
var value = ((function (vec__15288,seq__15289,first__15290,seq__15289__$1,k,ks){
return (function om$next$focus_query_STAR__$_value(x){
return om.next.focused_join(x,ks,query,union_expr);
});})(vec__15288,seq__15289,first__15290,seq__15289__$1,k,ks))
;
if(cljs.core.map_QMARK_(query)){
return cljs.core.PersistentArrayMap.fromArray([k,om$next$focus_query_STAR_(cljs.core.get.cljs$core$IFn$_invoke$arity$2(query,k),ks,query)], true, false);
} else {
return cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentVector.EMPTY,cljs.core.comp.cljs$core$IFn$_invoke$arity$3(cljs.core.filter.cljs$core$IFn$_invoke$arity$1(match),cljs.core.map.cljs$core$IFn$_invoke$arity$1(value),cljs.core.take.cljs$core$IFn$_invoke$arity$1((1))),query);
}
}
});
/**
 * Given a query, focus it along the specified path.
 * 
 *   Examples:
 *  (om.next/focus-query [:foo :bar :baz] [:foo])
 *  => [:foo]
 * 
 *  (om.next/focus-query [{:foo [:bar :baz]} :woz] [:foo :bar])
 *  => [{:foo [:bar]}]
 */
om.next.focus_query = (function om$next$focus_query(query,path){
return om.next.focus_query_STAR_(query,path,null);
});
/**
 * Given a focused query return the path represented by the query.
 * 
 * Examples:
 * 
 *   (om.next/focus->path [{:foo [{:bar {:baz []}]}])
 *   => [:foo :bar :baz]
 */
om.next.focus__GT_path = (function om$next$focus__GT_path(var_args){
var args15291 = [];
var len__7936__auto___15297 = arguments.length;
var i__7937__auto___15298 = (0);
while(true){
if((i__7937__auto___15298 < len__7936__auto___15297)){
args15291.push((arguments[i__7937__auto___15298]));

var G__15299 = (i__7937__auto___15298 + (1));
i__7937__auto___15298 = G__15299;
continue;
} else {
}
break;
}

var G__15293 = args15291.length;
switch (G__15293) {
case 1:
return om.next.focus__GT_path.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return om.next.focus__GT_path.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return om.next.focus__GT_path.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args15291.length)].join('')));

}
});

om.next.focus__GT_path.cljs$core$IFn$_invoke$arity$1 = (function (focus){
return om.next.focus__GT_path.cljs$core$IFn$_invoke$arity$3(focus,cljs.core.cst$sym$_STAR_,cljs.core.PersistentVector.EMPTY);
});

om.next.focus__GT_path.cljs$core$IFn$_invoke$arity$2 = (function (focus,bound){
return om.next.focus__GT_path.cljs$core$IFn$_invoke$arity$3(focus,bound,cljs.core.PersistentVector.EMPTY);
});

om.next.focus__GT_path.cljs$core$IFn$_invoke$arity$3 = (function (focus,bound,path){
while(true){
if(cljs.core.truth_((function (){var and__6741__auto__ = (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(bound,cljs.core.cst$sym$_STAR_)) || ((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(path,bound)) && ((cljs.core.count(path) < cljs.core.count(bound))));
if(and__6741__auto__){
var and__6741__auto____$1 = cljs.core.some(om.util.join_QMARK_,focus);
if(cljs.core.truth_(and__6741__auto____$1)){
return ((1) === cljs.core.count(focus));
} else {
return and__6741__auto____$1;
}
} else {
return and__6741__auto__;
}
})())){
var vec__15294 = om.util.join_entry(cljs.core.first(focus));
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__15294,(0),null);
var focus_SINGLEQUOTE_ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__15294,(1),null);
var focus_SINGLEQUOTE___$1 = ((om.util.recursion_QMARK_(focus_SINGLEQUOTE_))?focus:focus_SINGLEQUOTE_);
var G__15301 = focus_SINGLEQUOTE___$1;
var G__15302 = bound;
var G__15303 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(path,k);
focus = G__15301;
bound = G__15302;
path = G__15303;
continue;
} else {
return path;
}
break;
}
});

om.next.focus__GT_path.cljs$lang$maxFixedArity = 3;


/**
 * @interface
 */
om.next.Ident = function(){};

/**
 * Return the ident for this component
 */
om.next.ident = (function om$next$ident(this$,props){
if((!((this$ == null))) && (!((this$.om$next$Ident$ident$arity$2 == null)))){
return this$.om$next$Ident$ident$arity$2(this$,props);
} else {
var x__7466__auto__ = (((this$ == null))?null:this$);
var m__7467__auto__ = (om.next.ident[goog.typeOf(x__7466__auto__)]);
if(!((m__7467__auto__ == null))){
return (m__7467__auto__.cljs$core$IFn$_invoke$arity$2 ? m__7467__auto__.cljs$core$IFn$_invoke$arity$2(this$,props) : m__7467__auto__.call(null,this$,props));
} else {
var m__7467__auto____$1 = (om.next.ident["_"]);
if(!((m__7467__auto____$1 == null))){
return (m__7467__auto____$1.cljs$core$IFn$_invoke$arity$2 ? m__7467__auto____$1.cljs$core$IFn$_invoke$arity$2(this$,props) : m__7467__auto____$1.call(null,this$,props));
} else {
throw cljs.core.missing_protocol("Ident.ident",this$);
}
}
}
});


/**
 * @interface
 */
om.next.IQueryParams = function(){};

/**
 * Return the query parameters
 */
om.next.params = (function om$next$params(this$){
if((!((this$ == null))) && (!((this$.om$next$IQueryParams$params$arity$1 == null)))){
return this$.om$next$IQueryParams$params$arity$1(this$);
} else {
var x__7466__auto__ = (((this$ == null))?null:this$);
var m__7467__auto__ = (om.next.params[goog.typeOf(x__7466__auto__)]);
if(!((m__7467__auto__ == null))){
return (m__7467__auto__.cljs$core$IFn$_invoke$arity$1 ? m__7467__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__7467__auto__.call(null,this$));
} else {
var m__7467__auto____$1 = (om.next.params["_"]);
if(!((m__7467__auto____$1 == null))){
return (m__7467__auto____$1.cljs$core$IFn$_invoke$arity$1 ? m__7467__auto____$1.cljs$core$IFn$_invoke$arity$1(this$) : m__7467__auto____$1.call(null,this$));
} else {
throw cljs.core.missing_protocol("IQueryParams.params",this$);
}
}
}
});

(om.next.IQueryParams["_"] = true);

(om.next.params["_"] = (function (_){
return null;
}));

/**
 * @interface
 */
om.next.IQuery = function(){};

/**
 * Return the component's unbound query
 */
om.next.query = (function om$next$query(this$){
if((!((this$ == null))) && (!((this$.om$next$IQuery$query$arity$1 == null)))){
return this$.om$next$IQuery$query$arity$1(this$);
} else {
var x__7466__auto__ = (((this$ == null))?null:this$);
var m__7467__auto__ = (om.next.query[goog.typeOf(x__7466__auto__)]);
if(!((m__7467__auto__ == null))){
return (m__7467__auto__.cljs$core$IFn$_invoke$arity$1 ? m__7467__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__7467__auto__.call(null,this$));
} else {
var m__7467__auto____$1 = (om.next.query["_"]);
if(!((m__7467__auto____$1 == null))){
return (m__7467__auto____$1.cljs$core$IFn$_invoke$arity$1 ? m__7467__auto____$1.cljs$core$IFn$_invoke$arity$1(this$) : m__7467__auto____$1.call(null,this$));
} else {
throw cljs.core.missing_protocol("IQuery.query",this$);
}
}
}
});


/**
 * @interface
 */
om.next.ILocalState = function(){};

/**
 * Set the component's local state
 */
om.next._set_state_BANG_ = (function om$next$_set_state_BANG_(this$,new_state){
if((!((this$ == null))) && (!((this$.om$next$ILocalState$_set_state_BANG_$arity$2 == null)))){
return this$.om$next$ILocalState$_set_state_BANG_$arity$2(this$,new_state);
} else {
var x__7466__auto__ = (((this$ == null))?null:this$);
var m__7467__auto__ = (om.next._set_state_BANG_[goog.typeOf(x__7466__auto__)]);
if(!((m__7467__auto__ == null))){
return (m__7467__auto__.cljs$core$IFn$_invoke$arity$2 ? m__7467__auto__.cljs$core$IFn$_invoke$arity$2(this$,new_state) : m__7467__auto__.call(null,this$,new_state));
} else {
var m__7467__auto____$1 = (om.next._set_state_BANG_["_"]);
if(!((m__7467__auto____$1 == null))){
return (m__7467__auto____$1.cljs$core$IFn$_invoke$arity$2 ? m__7467__auto____$1.cljs$core$IFn$_invoke$arity$2(this$,new_state) : m__7467__auto____$1.call(null,this$,new_state));
} else {
throw cljs.core.missing_protocol("ILocalState.-set-state!",this$);
}
}
}
});

/**
 * Get the component's local state
 */
om.next._get_state = (function om$next$_get_state(this$){
if((!((this$ == null))) && (!((this$.om$next$ILocalState$_get_state$arity$1 == null)))){
return this$.om$next$ILocalState$_get_state$arity$1(this$);
} else {
var x__7466__auto__ = (((this$ == null))?null:this$);
var m__7467__auto__ = (om.next._get_state[goog.typeOf(x__7466__auto__)]);
if(!((m__7467__auto__ == null))){
return (m__7467__auto__.cljs$core$IFn$_invoke$arity$1 ? m__7467__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__7467__auto__.call(null,this$));
} else {
var m__7467__auto____$1 = (om.next._get_state["_"]);
if(!((m__7467__auto____$1 == null))){
return (m__7467__auto____$1.cljs$core$IFn$_invoke$arity$1 ? m__7467__auto____$1.cljs$core$IFn$_invoke$arity$1(this$) : m__7467__auto____$1.call(null,this$));
} else {
throw cljs.core.missing_protocol("ILocalState.-get-state",this$);
}
}
}
});

/**
 * Get the component's rendered local state
 */
om.next._get_rendered_state = (function om$next$_get_rendered_state(this$){
if((!((this$ == null))) && (!((this$.om$next$ILocalState$_get_rendered_state$arity$1 == null)))){
return this$.om$next$ILocalState$_get_rendered_state$arity$1(this$);
} else {
var x__7466__auto__ = (((this$ == null))?null:this$);
var m__7467__auto__ = (om.next._get_rendered_state[goog.typeOf(x__7466__auto__)]);
if(!((m__7467__auto__ == null))){
return (m__7467__auto__.cljs$core$IFn$_invoke$arity$1 ? m__7467__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__7467__auto__.call(null,this$));
} else {
var m__7467__auto____$1 = (om.next._get_rendered_state["_"]);
if(!((m__7467__auto____$1 == null))){
return (m__7467__auto____$1.cljs$core$IFn$_invoke$arity$1 ? m__7467__auto____$1.cljs$core$IFn$_invoke$arity$1(this$) : m__7467__auto____$1.call(null,this$));
} else {
throw cljs.core.missing_protocol("ILocalState.-get-rendered-state",this$);
}
}
}
});

/**
 * Get the component's pending local state
 */
om.next._merge_pending_state_BANG_ = (function om$next$_merge_pending_state_BANG_(this$){
if((!((this$ == null))) && (!((this$.om$next$ILocalState$_merge_pending_state_BANG_$arity$1 == null)))){
return this$.om$next$ILocalState$_merge_pending_state_BANG_$arity$1(this$);
} else {
var x__7466__auto__ = (((this$ == null))?null:this$);
var m__7467__auto__ = (om.next._merge_pending_state_BANG_[goog.typeOf(x__7466__auto__)]);
if(!((m__7467__auto__ == null))){
return (m__7467__auto__.cljs$core$IFn$_invoke$arity$1 ? m__7467__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__7467__auto__.call(null,this$));
} else {
var m__7467__auto____$1 = (om.next._merge_pending_state_BANG_["_"]);
if(!((m__7467__auto____$1 == null))){
return (m__7467__auto____$1.cljs$core$IFn$_invoke$arity$1 ? m__7467__auto____$1.cljs$core$IFn$_invoke$arity$1(this$) : m__7467__auto____$1.call(null,this$));
} else {
throw cljs.core.missing_protocol("ILocalState.-merge-pending-state!",this$);
}
}
}
});

om.next.var_QMARK_ = (function om$next$var_QMARK_(x){
var and__6741__auto__ = (x instanceof cljs.core.Symbol);
if(and__6741__auto__){
var G__15310 = [cljs.core.str(x)].join('');
var G__15311 = "?";
return goog.string.startsWith(G__15310,G__15311);
} else {
return and__6741__auto__;
}
});
om.next.var__GT_keyword = (function om$next$var__GT_keyword(x){
return cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([cljs.core.str(x)].join('').substring((1)));
});
om.next.replace_var = (function om$next$replace_var(expr,params){
if(cljs.core.truth_(om.next.var_QMARK_(expr))){
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(params,om.next.var__GT_keyword(expr),expr);
} else {
return expr;
}
});
om.next.bind_query = (function om$next$bind_query(query,params){
var qm = cljs.core.meta(query);
var tr = cljs.core.map.cljs$core$IFn$_invoke$arity$1(((function (qm){
return (function (p1__15312_SHARP_){
return om$next$bind_query(p1__15312_SHARP_,params);
});})(qm))
);
var ret = ((cljs.core.seq_QMARK_(query))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.list,cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentVector.EMPTY,tr,query)):((cljs.core.coll_QMARK_(query))?cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.empty(query),tr,query):om.next.replace_var(query,params)
));
var G__15315 = ret;
if(cljs.core.truth_((function (){var and__6741__auto__ = qm;
if(cljs.core.truth_(and__6741__auto__)){
if(!((ret == null))){
if(((ret.cljs$lang$protocol_mask$partition0$ & (131072))) || (ret.cljs$core$IMeta$)){
return true;
} else {
if((!ret.cljs$lang$protocol_mask$partition0$)){
return cljs.core.native_satisfies_QMARK_(cljs.core.IMeta,ret);
} else {
return false;
}
}
} else {
return cljs.core.native_satisfies_QMARK_(cljs.core.IMeta,ret);
}
} else {
return and__6741__auto__;
}
})())){
return cljs.core.with_meta(G__15315,qm);
} else {
return G__15315;
}
});





om.next.component__GT_query_data = (function om$next$component__GT_query_data(component){
var G__15318 = (om.next.get_reconciler.cljs$core$IFn$_invoke$arity$1 ? om.next.get_reconciler.cljs$core$IFn$_invoke$arity$1(component) : om.next.get_reconciler.call(null,component));
var G__15318__$1 = (((G__15318 == null))?null:cljs.core.cst$kw$config.cljs$core$IFn$_invoke$arity$1(G__15318));
var G__15318__$2 = (((G__15318__$1 == null))?null:cljs.core.cst$kw$state.cljs$core$IFn$_invoke$arity$1(G__15318__$1));
var G__15318__$3 = (((G__15318__$2 == null))?null:(cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(G__15318__$2) : cljs.core.deref.call(null,G__15318__$2)));
var G__15318__$4 = (((G__15318__$3 == null))?null:cljs.core.cst$kw$om$next_SLASH_queries.cljs$core$IFn$_invoke$arity$1(G__15318__$3));
if((G__15318__$4 == null)){
return null;
} else {
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(G__15318__$4,component);
}
});
/**
 * Return the unbound query for a component.
 */
om.next.get_unbound_query = (function om$next$get_unbound_query(component){
return cljs.core.cst$kw$query.cljs$core$IFn$_invoke$arity$2(om.next.component__GT_query_data(component),om.next.query(component));
});
/**
 * Return the query params for a component.
 */
om.next.get_params = (function om$next$get_params(component){
return cljs.core.cst$kw$params.cljs$core$IFn$_invoke$arity$2(om.next.component__GT_query_data(component),om.next.params(component));
});
om.next.get_component_query = (function om$next$get_component_query(var_args){
var args15319 = [];
var len__7936__auto___15322 = arguments.length;
var i__7937__auto___15323 = (0);
while(true){
if((i__7937__auto___15323 < len__7936__auto___15322)){
args15319.push((arguments[i__7937__auto___15323]));

var G__15324 = (i__7937__auto___15323 + (1));
i__7937__auto___15323 = G__15324;
continue;
} else {
}
break;
}

var G__15321 = args15319.length;
switch (G__15321) {
case 1:
return om.next.get_component_query.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return om.next.get_component_query.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args15319.length)].join('')));

}
});

om.next.get_component_query.cljs$core$IFn$_invoke$arity$1 = (function (component){
return om.next.get_component_query.cljs$core$IFn$_invoke$arity$2(component,om.next.component__GT_query_data(component));
});

om.next.get_component_query.cljs$core$IFn$_invoke$arity$2 = (function (component,query_data){
var q = cljs.core.cst$kw$query.cljs$core$IFn$_invoke$arity$2(query_data,om.next.query(component));
var c_SINGLEQUOTE_ = cljs.core.cst$kw$component.cljs$core$IFn$_invoke$arity$1(cljs.core.meta(q));
if((c_SINGLEQUOTE_ == null)){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str([cljs.core.str("Query violation, "),cljs.core.str(component),cljs.core.str(" reuses "),cljs.core.str(c_SINGLEQUOTE_),cljs.core.str(" query")].join('')),cljs.core.str("\n"),cljs.core.str("(nil? c')")].join('')));
}

return cljs.core.with_meta(om.next.bind_query(q,cljs.core.cst$kw$params.cljs$core$IFn$_invoke$arity$2(query_data,om.next.params(component))),new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$component,cljs.core.type(component)], null));
});

om.next.get_component_query.cljs$lang$maxFixedArity = 2;

om.next.iquery_QMARK_ = (function om$next$iquery_QMARK_(x){
if(!((x == null))){
if((false) || (x.om$next$IQuery$)){
return true;
} else {
return false;
}
} else {
return false;
}
});
/**
 * Return a IQuery/IParams local bound query. Works for component classes
 * and component instances. Does not use the indexer.
 */
om.next.get_class_or_instance_query = (function om$next$get_class_or_instance_query(x){
if(cljs.core.truth_((om.next.component_QMARK_.cljs$core$IFn$_invoke$arity$1 ? om.next.component_QMARK_.cljs$core$IFn$_invoke$arity$1(x) : om.next.component_QMARK_.call(null,x)))){
return om.next.get_component_query.cljs$core$IFn$_invoke$arity$1(x);
} else {
var q = om.next.query(x);
var c = cljs.core.cst$kw$component.cljs$core$IFn$_invoke$arity$1(cljs.core.meta(q));
if((c == null)){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str([cljs.core.str("Query violation, "),cljs.core.str(x),cljs.core.str(" reuses "),cljs.core.str(c),cljs.core.str(" query")].join('')),cljs.core.str("\n"),cljs.core.str("(nil? c)")].join('')));
}

return cljs.core.with_meta(om.next.bind_query(q,om.next.params(x)),new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$component,x], null));
}
});
/**
 * Get a component's static query from the indexer. For recursive queries, recurses
 * up the data path. Falls back to `get-class-or-instance-query` if nothing is
 * found in the indexer.
 */
om.next.get_indexed_query = (function om$next$get_indexed_query(component,class_path_query_data,data_path){
while(true){
var qs = cljs.core.filter.cljs$core$IFn$_invoke$arity$2(((function (component,class_path_query_data,data_path){
return (function (p1__15328_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(data_path,om.next.focus__GT_path.cljs$core$IFn$_invoke$arity$2(clojure.zip.root(p1__15328_SHARP_),data_path));
});})(component,class_path_query_data,data_path))
,class_path_query_data);
var qs__$1 = ((cljs.core.empty_QMARK_(qs))?class_path_query_data:qs);
if(!(cljs.core.empty_QMARK_(qs__$1))){
var q = cljs.core.first(qs__$1);
var node = clojure.zip.node(q);
if(!(om.util.recursion_QMARK_(node))){
return node;
} else {
var G__15329 = component;
var G__15330 = class_path_query_data;
var G__15331 = cljs.core.pop(data_path);
component = G__15329;
class_path_query_data = G__15330;
data_path = G__15331;
continue;
}
} else {
return om.next.get_class_or_instance_query(component);
}
break;
}
});
/**
 * Return a IQuery/IParams instance bound query. Works for component classes
 * and component instances. See also om.next/full-query.
 */
om.next.get_query = (function om$next$get_query(x){
if(((!((x == null)))?(((false) || (x.om$next$IQuery$))?true:false):false)){
if(cljs.core.truth_((om.next.component_QMARK_.cljs$core$IFn$_invoke$arity$1 ? om.next.component_QMARK_.cljs$core$IFn$_invoke$arity$1(x) : om.next.component_QMARK_.call(null,x)))){
var temp__6501__auto__ = om.next.component__GT_query_data(x);
if(cljs.core.truth_(temp__6501__auto__)){
var query_data = temp__6501__auto__;
return om.next.get_component_query.cljs$core$IFn$_invoke$arity$2(x,query_data);
} else {
var cp = (om.next.class_path.cljs$core$IFn$_invoke$arity$1 ? om.next.class_path.cljs$core$IFn$_invoke$arity$1(x) : om.next.class_path.call(null,x));
var r = (om.next.get_reconciler.cljs$core$IFn$_invoke$arity$1 ? om.next.get_reconciler.cljs$core$IFn$_invoke$arity$1(x) : om.next.get_reconciler.call(null,x));
var data_path = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentVector.EMPTY,cljs.core.remove.cljs$core$IFn$_invoke$arity$1(cljs.core.number_QMARK_),(om.next.path.cljs$core$IFn$_invoke$arity$1 ? om.next.path.cljs$core$IFn$_invoke$arity$1(x) : om.next.path.call(null,x)));
var class_path_query_data = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$class_DASH_path_DASH__GT_query.cljs$core$IFn$_invoke$arity$1((function (){var G__15335 = (om.next.get_indexer.cljs$core$IFn$_invoke$arity$1 ? om.next.get_indexer.cljs$core$IFn$_invoke$arity$1(r) : om.next.get_indexer.call(null,r));
return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(G__15335) : cljs.core.deref.call(null,G__15335));
})()),cp);
return om.next.get_indexed_query(x,class_path_query_data,data_path);
}
} else {
return om.next.get_class_or_instance_query(x);
}
} else {
return null;
}
});
om.next.tag = (function om$next$tag(x,class$){
return cljs.core.vary_meta.cljs$core$IFn$_invoke$arity$4(x,cljs.core.assoc,cljs.core.cst$kw$component,class$);
});

/**
* @constructor
*/
om.next.OmProps = (function (props,basis_t){
this.props = props;
this.basis_t = basis_t;
})

om.next.OmProps.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$sym$props,cljs.core.cst$sym$basis_DASH_t], null);
});

om.next.OmProps.cljs$lang$type = true;

om.next.OmProps.cljs$lang$ctorStr = "om.next/OmProps";

om.next.OmProps.cljs$lang$ctorPrWriter = (function (this__7405__auto__,writer__7406__auto__,opt__7407__auto__){
return cljs.core._write(writer__7406__auto__,"om.next/OmProps");
});

om.next.__GT_OmProps = (function om$next$__GT_OmProps(props,basis_t){
return (new om.next.OmProps(props,basis_t));
});

om.next.om_props = (function om$next$om_props(props,basis_t){
return (new om.next.OmProps(props,basis_t));
});
om.next.om_props_basis = (function om$next$om_props_basis(om_props){
return om_props.basis_t;
});
om.next.nil_props = om.next.om_props(null,(-1));
om.next.unwrap = (function om$next$unwrap(om_props){
return om_props.props;
});
om.next.compute_react_key = (function om$next$compute_react_key(cl,props){
var temp__6501__auto__ = cljs.core.cst$kw$react_DASH_key.cljs$core$IFn$_invoke$arity$1(props);
if(cljs.core.truth_(temp__6501__auto__)){
var rk = temp__6501__auto__;
return rk;
} else {
var temp__6501__auto____$1 = cljs.core.cst$kw$om_DASH_path.cljs$core$IFn$_invoke$arity$1(cljs.core.meta(props));
if(cljs.core.truth_(temp__6501__auto____$1)){
var idx = temp__6501__auto____$1;
return [cljs.core.str(cl.name),cljs.core.str("_"),cljs.core.str(idx)].join('');
} else {
return undefined;
}
}
});
/**
 * Create a factory constructor from a component class created with
 * om.next/defui.
 */
om.next.factory = (function om$next$factory(var_args){
var args15336 = [];
var len__7936__auto___15352 = arguments.length;
var i__7937__auto___15353 = (0);
while(true){
if((i__7937__auto___15353 < len__7936__auto___15352)){
args15336.push((arguments[i__7937__auto___15353]));

var G__15354 = (i__7937__auto___15353 + (1));
i__7937__auto___15353 = G__15354;
continue;
} else {
}
break;
}

var G__15338 = args15336.length;
switch (G__15338) {
case 1:
return om.next.factory.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return om.next.factory.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args15336.length)].join('')));

}
});

om.next.factory.cljs$core$IFn$_invoke$arity$1 = (function (class$){
return om.next.factory.cljs$core$IFn$_invoke$arity$2(class$,null);
});

om.next.factory.cljs$core$IFn$_invoke$arity$2 = (function (class$,p__15339){
var map__15340 = p__15339;
var map__15340__$1 = ((((!((map__15340 == null)))?((((map__15340.cljs$lang$protocol_mask$partition0$ & (64))) || (map__15340.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__15340):map__15340);
var opts = map__15340__$1;
var validator = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__15340__$1,cljs.core.cst$kw$validator);
var keyfn = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__15340__$1,cljs.core.cst$kw$keyfn);
var instrument_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__15340__$1,cljs.core.cst$kw$instrument_QMARK_,true);
if(cljs.core.fn_QMARK_(class$)){
} else {
throw (new Error("Assert failed: (fn? class)"));
}

return ((function (map__15340,map__15340__$1,opts,validator,keyfn,instrument_QMARK_){
return (function() { 
var om$next$self__delegate = function (props,children){
if((validator == null)){
} else {
if(cljs.core.truth_((validator.cljs$core$IFn$_invoke$arity$1 ? validator.cljs$core$IFn$_invoke$arity$1(props) : validator.call(null,props)))){
} else {
throw (new Error("Assert failed: (validator props)"));
}
}

if(cljs.core.truth_((function (){var and__6741__auto__ = om.next._STAR_instrument_STAR_;
if(cljs.core.truth_(and__6741__auto__)){
return instrument_QMARK_;
} else {
return and__6741__auto__;
}
})())){
var G__15347 = new cljs.core.PersistentArrayMap(null, 4, [cljs.core.cst$kw$props,props,cljs.core.cst$kw$children,children,cljs.core.cst$kw$class,class$,cljs.core.cst$kw$factory,om.next.factory.cljs$core$IFn$_invoke$arity$2(class$,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(opts,cljs.core.cst$kw$instrument_QMARK_,false))], null);
return (om.next._STAR_instrument_STAR_.cljs$core$IFn$_invoke$arity$1 ? om.next._STAR_instrument_STAR_.cljs$core$IFn$_invoke$arity$1(G__15347) : om.next._STAR_instrument_STAR_.call(null,G__15347));
} else {
var key = ((!((keyfn == null)))?(keyfn.cljs$core$IFn$_invoke$arity$1 ? keyfn.cljs$core$IFn$_invoke$arity$1(props) : keyfn.call(null,props)):om.next.compute_react_key(class$,props));
var ref = cljs.core.cst$kw$ref.cljs$core$IFn$_invoke$arity$1(props);
var ref__$1 = (function (){var G__15348 = ref;
if((ref instanceof cljs.core.Keyword)){
return [cljs.core.str(G__15348)].join('');
} else {
return G__15348;
}
})();
var t = ((!((om.next._STAR_reconciler_STAR_ == null)))?om.next.protocols.basis_t(om.next._STAR_reconciler_STAR_):(0));
var G__15349 = class$;
var G__15350 = {"omcljs$value": om.next.om_props(props,t), "omcljs$instrument": om.next._STAR_instrument_STAR_, "key": key, "omcljs$reactKey": key, "ref": ref__$1, "omcljs$shared": om.next._STAR_shared_STAR_, "omcljs$path": cljs.core.cst$kw$om_DASH_path.cljs$core$IFn$_invoke$arity$1(cljs.core.meta(props)), "omcljs$reconciler": om.next._STAR_reconciler_STAR_, "omcljs$depth": om.next._STAR_depth_STAR_, "omcljs$parent": om.next._STAR_parent_STAR_};
var G__15351 = om.util.force_children(children);
return React.createElement(G__15349,G__15350,G__15351);
}
};
var om$next$self = function (props,var_args){
var children = null;
if (arguments.length > 1) {
var G__15356__i = 0, G__15356__a = new Array(arguments.length -  1);
while (G__15356__i < G__15356__a.length) {G__15356__a[G__15356__i] = arguments[G__15356__i + 1]; ++G__15356__i;}
  children = new cljs.core.IndexedSeq(G__15356__a,0);
} 
return om$next$self__delegate.call(this,props,children);};
om$next$self.cljs$lang$maxFixedArity = 1;
om$next$self.cljs$lang$applyTo = (function (arglist__15357){
var props = cljs.core.first(arglist__15357);
var children = cljs.core.rest(arglist__15357);
return om$next$self__delegate(props,children);
});
om$next$self.cljs$core$IFn$_invoke$arity$variadic = om$next$self__delegate;
return om$next$self;
})()
;
;})(map__15340,map__15340__$1,opts,validator,keyfn,instrument_QMARK_))
});

om.next.factory.cljs$lang$maxFixedArity = 2;

/**
 * Returns true if the argument is an Om component.
 */
om.next.component_QMARK_ = (function om$next$component_QMARK_(x){
if(!((x == null))){
return x.om$isComponent === true;
} else {
return false;
}
});
om.next.state = (function om$next$state(c){
if(om.next.component_QMARK_(c)){
} else {
throw (new Error("Assert failed: (component? c)"));
}

return c.state;
});
/**
 * PRIVATE: Do not use
 */
om.next.get_prop = (function om$next$get_prop(c,k){
var G__15360 = c.props;
var G__15361 = k;
return goog.object.get(G__15360,G__15361);
});
om.next.get_props_STAR_ = (function om$next$get_props_STAR_(x,k){
if((x == null)){
return om.next.nil_props;
} else {
var y = goog.object.get(x,k);
if((y == null)){
return om.next.nil_props;
} else {
return y;
}
}
});
om.next.get_prev_props = (function om$next$get_prev_props(x){
return om.next.get_props_STAR_(x,"omcljs$prev$value");
});
om.next.get_next_props = (function om$next$get_next_props(x){
return om.next.get_props_STAR_(x,"omcljs$next$value");
});
om.next.get_props = (function om$next$get_props(x){
return om.next.get_props_STAR_(x,"omcljs$value");
});
/**
 * PRIVATE: Do not use
 */
om.next.set_prop_BANG_ = (function om$next$set_prop_BANG_(c,k,v){
var G__15365 = c.props;
var G__15366 = k;
var G__15367 = v;
return goog.object.set(G__15365,G__15366,G__15367);
});
om.next.get_reconciler = (function om$next$get_reconciler(c){
if(om.next.component_QMARK_(c)){
} else {
throw (new Error("Assert failed: (component? c)"));
}

return om.next.get_prop(c,"omcljs$reconciler");
});
om.next.props_STAR_ = (function om$next$props_STAR_(var_args){
var args15368 = [];
var len__7936__auto___15371 = arguments.length;
var i__7937__auto___15372 = (0);
while(true){
if((i__7937__auto___15372 < len__7936__auto___15371)){
args15368.push((arguments[i__7937__auto___15372]));

var G__15373 = (i__7937__auto___15372 + (1));
i__7937__auto___15372 = G__15373;
continue;
} else {
}
break;
}

var G__15370 = args15368.length;
switch (G__15370) {
case 2:
return om.next.props_STAR_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return om.next.props_STAR_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args15368.length)].join('')));

}
});

om.next.props_STAR_.cljs$core$IFn$_invoke$arity$2 = (function (x,y){
return cljs.core.max_key.cljs$core$IFn$_invoke$arity$3(om.next.om_props_basis,x,y);
});

om.next.props_STAR_.cljs$core$IFn$_invoke$arity$3 = (function (x,y,z){
return cljs.core.max_key.cljs$core$IFn$_invoke$arity$3(om.next.om_props_basis,x,om.next.props_STAR_.cljs$core$IFn$_invoke$arity$2(y,z));
});

om.next.props_STAR_.cljs$lang$maxFixedArity = 3;

om.next.prev_props_STAR_ = (function om$next$prev_props_STAR_(var_args){
var args15375 = [];
var len__7936__auto___15378 = arguments.length;
var i__7937__auto___15379 = (0);
while(true){
if((i__7937__auto___15379 < len__7936__auto___15378)){
args15375.push((arguments[i__7937__auto___15379]));

var G__15380 = (i__7937__auto___15379 + (1));
i__7937__auto___15379 = G__15380;
continue;
} else {
}
break;
}

var G__15377 = args15375.length;
switch (G__15377) {
case 2:
return om.next.prev_props_STAR_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return om.next.prev_props_STAR_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args15375.length)].join('')));

}
});

om.next.prev_props_STAR_.cljs$core$IFn$_invoke$arity$2 = (function (x,y){
return cljs.core.min_key.cljs$core$IFn$_invoke$arity$3(om.next.om_props_basis,x,y);
});

om.next.prev_props_STAR_.cljs$core$IFn$_invoke$arity$3 = (function (x,y,z){
return cljs.core.min_key.cljs$core$IFn$_invoke$arity$3(om.next.om_props_basis,om.next.props_STAR_.cljs$core$IFn$_invoke$arity$2(x,y),om.next.props_STAR_.cljs$core$IFn$_invoke$arity$2(y,z));
});

om.next.prev_props_STAR_.cljs$lang$maxFixedArity = 3;

om.next._prev_props = (function om$next$_prev_props(prev_props,component){
var cst = component.state;
var props = component.props;
return om.next.unwrap(om.next.prev_props_STAR_.cljs$core$IFn$_invoke$arity$2(om.next.props_STAR_.cljs$core$IFn$_invoke$arity$2(om.next.get_props(prev_props),om.next.get_prev_props(cst)),om.next.props_STAR_.cljs$core$IFn$_invoke$arity$2(om.next.get_props(cst),om.next.get_props(props))));
});
om.next._next_props = (function om$next$_next_props(next_props,component){
return om.next.unwrap(om.next.props_STAR_.cljs$core$IFn$_invoke$arity$3(om.next.get_props(component.props),om.next.get_props(next_props),om.next.get_next_props(component.state)));
});
om.next.merge_pending_props_BANG_ = (function om$next$merge_pending_props_BANG_(c){
if(om.next.component_QMARK_(c)){
} else {
throw (new Error("Assert failed: (component? c)"));
}

var cst = c.state;
var props = c.props;
var pending = goog.object.get(cst,"omcljs$next$value");
var prev = om.next.props_STAR_.cljs$core$IFn$_invoke$arity$2(om.next.get_props(cst),om.next.get_props(props));
goog.object.set(cst,"omcljs$prev$value",prev);

if((pending == null)){
return null;
} else {
goog.object.remove(cst,"omcljs$next$value");

return goog.object.set(cst,"omcljs$value",pending);
}
});
om.next.clear_prev_props_BANG_ = (function om$next$clear_prev_props_BANG_(c){
var G__15384 = c.state;
var G__15385 = "omcljs$prev$value";
return goog.object.remove(G__15384,G__15385);
});
/**
 * Get basis t value for when the component last read its props from
 * the global state.
 */
om.next.t = (function om$next$t(c){
return om.next.om_props_basis(om.next.props_STAR_.cljs$core$IFn$_invoke$arity$2(om.next.get_props(c.props),om.next.get_props(c.state)));
});
/**
 * Returns the parent Om component.
 */
om.next.parent = (function om$next$parent(component){
return om.next.get_prop(component,"omcljs$parent");
});
/**
 * PRIVATE: Returns the render depth (a integer) of the component relative to
 *   the mount root.
 */
om.next.depth = (function om$next$depth(component){
if(om.next.component_QMARK_(component)){
return om.next.get_prop(component,"omcljs$depth");
} else {
return null;
}
});
/**
 * Returns the components React key.
 */
om.next.react_key = (function om$next$react_key(component){
return om.next.get_prop(component,"omcljs$reactKey");
});
/**
 * Returns the component type, regardless of whether the component has been
 * mounted
 */
om.next.react_type = (function om$next$react_type(x){
var or__6753__auto__ = goog.object.get(x,"type");
if(cljs.core.truth_(or__6753__auto__)){
return or__6753__auto__;
} else {
return cljs.core.type(x);
}
});
/**
 * Returns the component's Om data path.
 */
om.next.path = (function om$next$path(c){
return om.next.get_prop(c,"omcljs$path");
});
/**
 * Return the global shared properties of the Om Next root. See :shared and
 * :shared-fn reconciler options.
 */
om.next.shared = (function om$next$shared(var_args){
var args15386 = [];
var len__7936__auto___15393 = arguments.length;
var i__7937__auto___15394 = (0);
while(true){
if((i__7937__auto___15394 < len__7936__auto___15393)){
args15386.push((arguments[i__7937__auto___15394]));

var G__15395 = (i__7937__auto___15394 + (1));
i__7937__auto___15394 = G__15395;
continue;
} else {
}
break;
}

var G__15388 = args15386.length;
switch (G__15388) {
case 1:
return om.next.shared.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return om.next.shared.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args15386.length)].join('')));

}
});

om.next.shared.cljs$core$IFn$_invoke$arity$1 = (function (component){
return om.next.shared.cljs$core$IFn$_invoke$arity$2(component,cljs.core.PersistentVector.EMPTY);
});

om.next.shared.cljs$core$IFn$_invoke$arity$2 = (function (component,k_or_ks){
if(om.next.component_QMARK_(component)){
} else {
throw (new Error("Assert failed: (component? component)"));
}

var shared = (function (){var G__15389 = component.props;
var G__15390 = "omcljs$shared";
return goog.object.get(G__15389,G__15390);
})();
var ks = (function (){var G__15391 = k_or_ks;
if(!(cljs.core.sequential_QMARK_(k_or_ks))){
return (new cljs.core.PersistentVector(null,1,(5),cljs.core.PersistentVector.EMPTY_NODE,[G__15391],null));
} else {
return G__15391;
}
})();
var G__15392 = shared;
if(!(cljs.core.empty_QMARK_(ks))){
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(G__15392,ks);
} else {
return G__15392;
}
});

om.next.shared.cljs$lang$maxFixedArity = 2;

om.next.instrument = (function om$next$instrument(component){
if(om.next.component_QMARK_(component)){
} else {
throw (new Error("Assert failed: (component? component)"));
}

return om.next.get_prop(component,"omcljs$instrument");
});
om.next.update_props_BANG_ = (function om$next$update_props_BANG_(c,next_props){
if(om.next.component_QMARK_(c)){
} else {
throw (new Error("Assert failed: (component? c)"));
}

var G__15401 = c.state;
var G__15402_15405 = G__15401;
var G__15403_15406 = "omcljs$next$value";
var G__15404_15407 = om.next.om_props(next_props,om.next.protocols.basis_t(om.next.get_reconciler(c)));
goog.object.set(G__15402_15405,G__15403_15406,G__15404_15407);

return G__15401;
});
/**
 * Return a components props.
 */
om.next.props = (function om$next$props(component){
if(om.next.component_QMARK_(component)){
} else {
throw (new Error("Assert failed: (component? component)"));
}

return om.next.unwrap(om.next.props_STAR_.cljs$core$IFn$_invoke$arity$2(om.next.get_props(component.props),om.next.get_props(component.state)));
});
/**
 * Add computed properties to props. Note will replace any pre-existing
 * computed properties.
 */
om.next.computed = (function om$next$computed(props,computed_map){
if((props == null)){
return null;
} else {
if(cljs.core.vector_QMARK_(props)){
var G__15410 = props;
if(!(cljs.core.empty_QMARK_(computed_map))){
return cljs.core.vary_meta.cljs$core$IFn$_invoke$arity$4(G__15410,cljs.core.assoc,cljs.core.cst$kw$om$next_SLASH_computed,computed_map);
} else {
return G__15410;
}
} else {
var G__15411 = props;
if(!(cljs.core.empty_QMARK_(computed_map))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__15411,cljs.core.cst$kw$om$next_SLASH_computed,computed_map);
} else {
return G__15411;
}
}
}
});
/**
 * Return the computed properties on a component or its props.
 */
om.next.get_computed = (function om$next$get_computed(var_args){
var args15412 = [];
var len__7936__auto___15417 = arguments.length;
var i__7937__auto___15418 = (0);
while(true){
if((i__7937__auto___15418 < len__7936__auto___15417)){
args15412.push((arguments[i__7937__auto___15418]));

var G__15419 = (i__7937__auto___15418 + (1));
i__7937__auto___15418 = G__15419;
continue;
} else {
}
break;
}

var G__15414 = args15412.length;
switch (G__15414) {
case 1:
return om.next.get_computed.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return om.next.get_computed.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args15412.length)].join('')));

}
});

om.next.get_computed.cljs$core$IFn$_invoke$arity$1 = (function (x){
return om.next.get_computed.cljs$core$IFn$_invoke$arity$2(x,cljs.core.PersistentVector.EMPTY);
});

om.next.get_computed.cljs$core$IFn$_invoke$arity$2 = (function (x,k_or_ks){
if((x == null)){
return null;
} else {
var props = (function (){var G__15415 = x;
if(om.next.component_QMARK_(x)){
return om.next.props(G__15415);
} else {
return G__15415;
}
})();
var ks = cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$om$next_SLASH_computed], null),(function (){var G__15416 = k_or_ks;
if(!(cljs.core.sequential_QMARK_(k_or_ks))){
return (new cljs.core.PersistentVector(null,1,(5),cljs.core.PersistentVector.EMPTY_NODE,[G__15416],null));
} else {
return G__15416;
}
})());
if(cljs.core.vector_QMARK_(props)){
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cljs.core.meta(props),ks);
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(props,ks);
}
}
});

om.next.get_computed.cljs$lang$maxFixedArity = 2;

/**
 * Set the component local state of the component. Analogous to React's
 * setState.
 */
om.next.set_state_BANG_ = (function om$next$set_state_BANG_(component,new_state){
if(om.next.component_QMARK_(component)){
} else {
throw (new Error("Assert failed: (component? component)"));
}

if(((!((component == null)))?(((false) || (component.om$next$ILocalState$))?true:false):false)){
om.next._set_state_BANG_(component,new_state);
} else {
var G__15426_15429 = component.state;
var G__15427_15430 = "omcljs$pendingState";
var G__15428_15431 = new_state;
goog.object.set(G__15426_15429,G__15427_15430,G__15428_15431);
}

var temp__6501__auto__ = om.next.get_reconciler(component);
if(cljs.core.truth_(temp__6501__auto__)){
var r = temp__6501__auto__;
om.next.protocols.queue_BANG_(r,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [component], null));

return (om.next.schedule_render_BANG_.cljs$core$IFn$_invoke$arity$1 ? om.next.schedule_render_BANG_.cljs$core$IFn$_invoke$arity$1(r) : om.next.schedule_render_BANG_.call(null,r));
} else {
return component.forceUpdate();
}
});
/**
 * Get a component's local state. May provide a single key or a sequential
 * collection of keys for indexed access into the component's local state.
 */
om.next.get_state = (function om$next$get_state(var_args){
var args15432 = [];
var len__7936__auto___15436 = arguments.length;
var i__7937__auto___15437 = (0);
while(true){
if((i__7937__auto___15437 < len__7936__auto___15436)){
args15432.push((arguments[i__7937__auto___15437]));

var G__15438 = (i__7937__auto___15437 + (1));
i__7937__auto___15437 = G__15438;
continue;
} else {
}
break;
}

var G__15434 = args15432.length;
switch (G__15434) {
case 1:
return om.next.get_state.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return om.next.get_state.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args15432.length)].join('')));

}
});

om.next.get_state.cljs$core$IFn$_invoke$arity$1 = (function (component){
return om.next.get_state.cljs$core$IFn$_invoke$arity$2(component,cljs.core.PersistentVector.EMPTY);
});

om.next.get_state.cljs$core$IFn$_invoke$arity$2 = (function (component,k_or_ks){
if(om.next.component_QMARK_(component)){
} else {
throw (new Error("Assert failed: (component? component)"));
}

var cst = ((((!((component == null)))?(((false) || (component.om$next$ILocalState$))?true:false):false))?om.next._get_state(component):(function (){var temp__6503__auto__ = component.state;
if(cljs.core.truth_(temp__6503__auto__)){
var state = temp__6503__auto__;
var or__6753__auto__ = goog.object.get(state,"omcljs$pendingState");
if(cljs.core.truth_(or__6753__auto__)){
return or__6753__auto__;
} else {
return goog.object.get(state,"omcljs$state");
}
} else {
return null;
}
})());
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cst,((cljs.core.sequential_QMARK_(k_or_ks))?k_or_ks:new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [k_or_ks], null)));
});

om.next.get_state.cljs$lang$maxFixedArity = 2;

/**
 * Update a component's local state. Similar to Clojure(Script)'s swap!
 */
om.next.update_state_BANG_ = (function om$next$update_state_BANG_(var_args){
var args15440 = [];
var len__7936__auto___15465 = arguments.length;
var i__7937__auto___15466 = (0);
while(true){
if((i__7937__auto___15466 < len__7936__auto___15465)){
args15440.push((arguments[i__7937__auto___15466]));

var G__15467 = (i__7937__auto___15466 + (1));
i__7937__auto___15466 = G__15467;
continue;
} else {
}
break;
}

var G__15449 = args15440.length;
switch (G__15449) {
case 2:
return om.next.update_state_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return om.next.update_state_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return om.next.update_state_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 5:
return om.next.update_state_BANG_.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
case 6:
return om.next.update_state_BANG_.cljs$core$IFn$_invoke$arity$6((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]));

break;
default:
var argseq__7959__auto__ = (new cljs.core.IndexedSeq(args15440.slice((6)),(0),null));
return om.next.update_state_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]),argseq__7959__auto__);

}
});

om.next.update_state_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (component,f){
return om.next.set_state_BANG_(component,(function (){var G__15450 = om.next.get_state.cljs$core$IFn$_invoke$arity$1(component);
return (f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(G__15450) : f.call(null,G__15450));
})());
});

om.next.update_state_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (component,f,arg0){
return om.next.set_state_BANG_(component,(function (){var G__15451 = om.next.get_state.cljs$core$IFn$_invoke$arity$1(component);
var G__15452 = arg0;
return (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(G__15451,G__15452) : f.call(null,G__15451,G__15452));
})());
});

om.next.update_state_BANG_.cljs$core$IFn$_invoke$arity$4 = (function (component,f,arg0,arg1){
return om.next.set_state_BANG_(component,(function (){var G__15453 = om.next.get_state.cljs$core$IFn$_invoke$arity$1(component);
var G__15454 = arg0;
var G__15455 = arg1;
return (f.cljs$core$IFn$_invoke$arity$3 ? f.cljs$core$IFn$_invoke$arity$3(G__15453,G__15454,G__15455) : f.call(null,G__15453,G__15454,G__15455));
})());
});

om.next.update_state_BANG_.cljs$core$IFn$_invoke$arity$5 = (function (component,f,arg0,arg1,arg2){
return om.next.set_state_BANG_(component,(function (){var G__15456 = om.next.get_state.cljs$core$IFn$_invoke$arity$1(component);
var G__15457 = arg0;
var G__15458 = arg1;
var G__15459 = arg2;
return (f.cljs$core$IFn$_invoke$arity$4 ? f.cljs$core$IFn$_invoke$arity$4(G__15456,G__15457,G__15458,G__15459) : f.call(null,G__15456,G__15457,G__15458,G__15459));
})());
});

om.next.update_state_BANG_.cljs$core$IFn$_invoke$arity$6 = (function (component,f,arg0,arg1,arg2,arg3){
return om.next.set_state_BANG_(component,(function (){var G__15460 = om.next.get_state.cljs$core$IFn$_invoke$arity$1(component);
var G__15461 = arg0;
var G__15462 = arg1;
var G__15463 = arg2;
var G__15464 = arg3;
return (f.cljs$core$IFn$_invoke$arity$5 ? f.cljs$core$IFn$_invoke$arity$5(G__15460,G__15461,G__15462,G__15463,G__15464) : f.call(null,G__15460,G__15461,G__15462,G__15463,G__15464));
})());
});

om.next.update_state_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (component,f,arg0,arg1,arg2,arg3,arg_rest){
return om.next.set_state_BANG_(component,cljs.core.apply.cljs$core$IFn$_invoke$arity$variadic(f,om.next.get_state.cljs$core$IFn$_invoke$arity$1(component),arg0,arg1,arg2,cljs.core.array_seq([arg3,arg_rest], 0)));
});

om.next.update_state_BANG_.cljs$lang$applyTo = (function (seq15441){
var G__15442 = cljs.core.first(seq15441);
var seq15441__$1 = cljs.core.next(seq15441);
var G__15443 = cljs.core.first(seq15441__$1);
var seq15441__$2 = cljs.core.next(seq15441__$1);
var G__15444 = cljs.core.first(seq15441__$2);
var seq15441__$3 = cljs.core.next(seq15441__$2);
var G__15445 = cljs.core.first(seq15441__$3);
var seq15441__$4 = cljs.core.next(seq15441__$3);
var G__15446 = cljs.core.first(seq15441__$4);
var seq15441__$5 = cljs.core.next(seq15441__$4);
var G__15447 = cljs.core.first(seq15441__$5);
var seq15441__$6 = cljs.core.next(seq15441__$5);
return om.next.update_state_BANG_.cljs$core$IFn$_invoke$arity$variadic(G__15442,G__15443,G__15444,G__15445,G__15446,G__15447,seq15441__$6);
});

om.next.update_state_BANG_.cljs$lang$maxFixedArity = (6);

/**
 * Get the rendered state of component. om.next/get-state always returns the
 * up-to-date state.
 */
om.next.get_rendered_state = (function om$next$get_rendered_state(var_args){
var args15469 = [];
var len__7936__auto___15474 = arguments.length;
var i__7937__auto___15475 = (0);
while(true){
if((i__7937__auto___15475 < len__7936__auto___15474)){
args15469.push((arguments[i__7937__auto___15475]));

var G__15476 = (i__7937__auto___15475 + (1));
i__7937__auto___15475 = G__15476;
continue;
} else {
}
break;
}

var G__15471 = args15469.length;
switch (G__15471) {
case 1:
return om.next.get_rendered_state.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return om.next.get_rendered_state.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args15469.length)].join('')));

}
});

om.next.get_rendered_state.cljs$core$IFn$_invoke$arity$1 = (function (component){
return om.next.get_rendered_state.cljs$core$IFn$_invoke$arity$2(component,cljs.core.PersistentVector.EMPTY);
});

om.next.get_rendered_state.cljs$core$IFn$_invoke$arity$2 = (function (component,k_or_ks){
if(om.next.component_QMARK_(component)){
} else {
throw (new Error("Assert failed: (component? component)"));
}

var cst = ((((!((component == null)))?(((false) || (component.om$next$ILocalState$))?true:false):false))?om.next._get_rendered_state(component):(function (){var G__15473 = component;
var G__15473__$1 = (((G__15473 == null))?null:G__15473.state);
if((G__15473__$1 == null)){
return null;
} else {
return goog.object.get(G__15473__$1,"omcljs$state");
}
})());
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cst,((cljs.core.sequential_QMARK_(k_or_ks))?k_or_ks:new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [k_or_ks], null)));
});

om.next.get_rendered_state.cljs$lang$maxFixedArity = 2;

om.next.merge_pending_state_BANG_ = (function om$next$merge_pending_state_BANG_(c){
if(((!((c == null)))?(((false) || (c.om$next$ILocalState$))?true:false):false)){
return om.next._merge_pending_state_BANG_(c);
} else {
var temp__6503__auto__ = (function (){var G__15481 = c;
var G__15481__$1 = (((G__15481 == null))?null:G__15481.state);
if((G__15481__$1 == null)){
return null;
} else {
return goog.object.get(G__15481__$1,"omcljs$pendingState");
}
})();
if(cljs.core.truth_(temp__6503__auto__)){
var pending = temp__6503__auto__;
var state = c.state;
var previous = goog.object.get(state,"omcljs$state");
goog.object.remove(state,"omcljs$pendingState");

goog.object.set(state,"omcljs$previousState",previous);

return goog.object.set(state,"omcljs$state",pending);
} else {
return null;
}
}
});
om.next.react_set_state_BANG_ = (function om$next$react_set_state_BANG_(var_args){
var args15482 = [];
var len__7936__auto___15485 = arguments.length;
var i__7937__auto___15486 = (0);
while(true){
if((i__7937__auto___15486 < len__7936__auto___15485)){
args15482.push((arguments[i__7937__auto___15486]));

var G__15487 = (i__7937__auto___15486 + (1));
i__7937__auto___15486 = G__15487;
continue;
} else {
}
break;
}

var G__15484 = args15482.length;
switch (G__15484) {
case 2:
return om.next.react_set_state_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return om.next.react_set_state_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args15482.length)].join('')));

}
});

om.next.react_set_state_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (component,new_state){
return om.next.react_set_state_BANG_.cljs$core$IFn$_invoke$arity$3(component,new_state,null);
});

om.next.react_set_state_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (component,new_state,cb){
if(om.next.component_QMARK_(component)){
} else {
throw (new Error("Assert failed: (component? component)"));
}

return component.setState({"omcljs$state": new_state},cb);
});

om.next.react_set_state_BANG_.cljs$lang$maxFixedArity = 3;






om.next.gather_sends = (function om$next$gather_sends(p__15490,q,remotes){
var map__15497 = p__15490;
var map__15497__$1 = ((((!((map__15497 == null)))?((((map__15497.cljs$lang$protocol_mask$partition0$ & (64))) || (map__15497.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__15497):map__15497);
var env = map__15497__$1;
var parser = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__15497__$1,cljs.core.cst$kw$parser);
return cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.comp.cljs$core$IFn$_invoke$arity$2(cljs.core.map.cljs$core$IFn$_invoke$arity$1(((function (map__15497,map__15497__$1,env,parser){
return (function (p1__15489_SHARP_){
return (new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[p1__15489_SHARP_,(parser.cljs$core$IFn$_invoke$arity$3 ? parser.cljs$core$IFn$_invoke$arity$3(env,q,p1__15489_SHARP_) : parser.call(null,env,q,p1__15489_SHARP_))],null));
});})(map__15497,map__15497__$1,env,parser))
),cljs.core.filter.cljs$core$IFn$_invoke$arity$1(((function (map__15497,map__15497__$1,env,parser){
return (function (p__15499){
var vec__15500 = p__15499;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__15500,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__15500,(1),null);
return (cljs.core.count(v) > (0));
});})(map__15497,map__15497__$1,env,parser))
)),remotes);
});
/**
 * Given r (a reconciler) and a query expression including a mutation and
 * any simple reads, return the equivalent query expression where the simple
 * reads have been replaced by the full query for each component that cares about
 * the specified read.
 */
om.next.transform_reads = (function om$next$transform_reads(r,tx){
var with_target = (function om$next$transform_reads_$_with_target(target,q){
if(!((target == null))){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(function (){var G__15531 = cljs.core.first(q);
var G__15532 = target;
return (om.next.force.cljs$core$IFn$_invoke$arity$2 ? om.next.force.cljs$core$IFn$_invoke$arity$2(G__15531,G__15532) : om.next.force.call(null,G__15531,G__15532));
})()], null);
} else {
return q;
}
});
var add_focused_query = (function om$next$transform_reads_$_add_focused_query(k,target,tx__$1,c){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(tx__$1,(function (){var G__15535 = c;
var G__15536 = with_target(target,om.next.focus_query(om.next.get_query(c),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [k], null)));
return (om.next.full_query.cljs$core$IFn$_invoke$arity$2 ? om.next.full_query.cljs$core$IFn$_invoke$arity$2(G__15535,G__15536) : om.next.full_query.call(null,G__15535,G__15536));
})());
});
var exprs = cljs.core.seq(tx);
var tx_SINGLEQUOTE_ = cljs.core.PersistentVector.EMPTY;
while(true){
if(!((exprs == null))){
var expr = cljs.core.first(exprs);
var ast = om.next.impl.parser.expr__GT_ast(expr);
var key = cljs.core.cst$kw$key.cljs$core$IFn$_invoke$arity$1(ast);
var tgt = cljs.core.cst$kw$target.cljs$core$IFn$_invoke$arity$1(ast);
if((key instanceof cljs.core.Keyword)){
var G__15537 = cljs.core.next(exprs);
var G__15538 = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(((function (exprs,tx_SINGLEQUOTE_,expr,ast,key,tgt){
return (function (p1__15503_SHARP_,p2__15504_SHARP_){
return add_focused_query(key,tgt,p1__15503_SHARP_,p2__15504_SHARP_);
});})(exprs,tx_SINGLEQUOTE_,expr,ast,key,tgt))
,tx_SINGLEQUOTE_,(om.next.ref__GT_components.cljs$core$IFn$_invoke$arity$2 ? om.next.ref__GT_components.cljs$core$IFn$_invoke$arity$2(r,key) : om.next.ref__GT_components.call(null,r,key)));
exprs = G__15537;
tx_SINGLEQUOTE_ = G__15538;
continue;
} else {
var G__15539 = cljs.core.next(exprs);
var G__15540 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(tx_SINGLEQUOTE_,expr);
exprs = G__15539;
tx_SINGLEQUOTE_ = G__15540;
continue;
}
} else {
return tx_SINGLEQUOTE_;
}
break;
}
});
/**
 * Change the query of a component. Takes a map containing :params and/or
 * :query. :params should be a map of new bindings and :query should be a query
 * expression. Will schedule a re-render as well as remote re-sends if
 * necessary.
 */
om.next.set_query_BANG_ = (function om$next$set_query_BANG_(var_args){
var args15541 = [];
var len__7936__auto___15552 = arguments.length;
var i__7937__auto___15553 = (0);
while(true){
if((i__7937__auto___15553 < len__7936__auto___15552)){
args15541.push((arguments[i__7937__auto___15553]));

var G__15554 = (i__7937__auto___15553 + (1));
i__7937__auto___15553 = G__15554;
continue;
} else {
}
break;
}

var G__15543 = args15541.length;
switch (G__15543) {
case 2:
return om.next.set_query_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return om.next.set_query_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args15541.length)].join('')));

}
});

om.next.set_query_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (x,params_AMPERSAND_query){
return om.next.set_query_BANG_.cljs$core$IFn$_invoke$arity$3(x,params_AMPERSAND_query,null);
});

om.next.set_query_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (x,p__15544,reads){
var map__15545 = p__15544;
var map__15545__$1 = ((((!((map__15545 == null)))?((((map__15545.cljs$lang$protocol_mask$partition0$ & (64))) || (map__15545.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__15545):map__15545);
var params = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__15545__$1,cljs.core.cst$kw$params);
var query = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__15545__$1,cljs.core.cst$kw$query);
if(cljs.core.truth_((function (){var or__6753__auto__ = (om.next.reconciler_QMARK_.cljs$core$IFn$_invoke$arity$1 ? om.next.reconciler_QMARK_.cljs$core$IFn$_invoke$arity$1(x) : om.next.reconciler_QMARK_.call(null,x));
if(cljs.core.truth_(or__6753__auto__)){
return or__6753__auto__;
} else {
return om.next.component_QMARK_(x);
}
})())){
} else {
throw (new Error("Assert failed: (or (reconciler? x) (component? x))"));
}

if((!((params == null))) || (!((query == null)))){
} else {
throw (new Error("Assert failed: (or (not (nil? params)) (not (nil? query)))"));
}

if(((reads == null)) || (cljs.core.vector_QMARK_(reads))){
} else {
throw (new Error("Assert failed: (or (nil? reads) (vector? reads))"));
}

var r = ((om.next.component_QMARK_(x))?om.next.get_reconciler(x):x);
var c = ((om.next.component_QMARK_(x))?x:null);
var root = cljs.core.cst$kw$root.cljs$core$IFn$_invoke$arity$1((function (){var G__15547 = cljs.core.cst$kw$state.cljs$core$IFn$_invoke$arity$1(r);
return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(G__15547) : cljs.core.deref.call(null,G__15547));
})());
var cfg = cljs.core.cst$kw$config.cljs$core$IFn$_invoke$arity$1(r);
var st = cljs.core.cst$kw$state.cljs$core$IFn$_invoke$arity$1(cfg);
var id = cljs.core.random_uuid();
var _ = cljs.core.cst$kw$history.cljs$core$IFn$_invoke$arity$1(cfg).add(id,(cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(st) : cljs.core.deref.call(null,st)));
var temp__6503__auto___15556 = cljs.core.cst$kw$logger.cljs$core$IFn$_invoke$arity$1(cfg);
if(cljs.core.truth_(temp__6503__auto___15556)){
var l_15557 = temp__6503__auto___15556;
var G__15549_15558 = l_15557;
var G__15550_15559 = [cljs.core.str((function (){var temp__6503__auto____$1 = ((((!((c == null)))?(((false) || (c.om$next$Ident$))?true:false):false))?om.next.ident(c,om.next.props(c)):null);
if(cljs.core.truth_(temp__6503__auto____$1)){
var ident = temp__6503__auto____$1;
return [cljs.core.str(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([ident], 0))),cljs.core.str(" ")].join('');
} else {
return null;
}
})()),cljs.core.str((cljs.core.truth_((om.next.reconciler_QMARK_.cljs$core$IFn$_invoke$arity$1 ? om.next.reconciler_QMARK_.cljs$core$IFn$_invoke$arity$1(x) : om.next.reconciler_QMARK_.call(null,x)))?"reconciler ":null)),cljs.core.str((cljs.core.truth_(query)?(function (){


return ", ";
})()
:null)),cljs.core.str((cljs.core.truth_(params)?(function (){


return " ";
})()
:null)),cljs.core.str(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([id], 0)))].join('');
goog.log.info(G__15549_15558,G__15550_15559);
} else {
}

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(st,cljs.core.update_in,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$om$next_SLASH_queries,(function (){var or__6753__auto__ = c;
if(cljs.core.truth_(or__6753__auto__)){
return or__6753__auto__;
} else {
return root;
}
})()], null),cljs.core.merge,cljs.core.array_seq([cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([(cljs.core.truth_(query)?new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$query,query], null):null),(cljs.core.truth_(params)?new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$params,params], null):null)], 0))], 0));

if((!((c == null))) && ((reads == null))){
om.next.protocols.queue_BANG_(r,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [c], null));
} else {
}

if((reads == null)){
} else {
om.next.protocols.queue_BANG_(r,reads);
}

om.next.protocols.reindex_BANG_(r);

var rootq_15560 = ((!((c == null)))?(om.next.full_query.cljs$core$IFn$_invoke$arity$1 ? om.next.full_query.cljs$core$IFn$_invoke$arity$1(c) : om.next.full_query.call(null,c)):(((reads == null))?om.next.get_query(root):null));
var sends_15561 = om.next.gather_sends((om.next.to_env.cljs$core$IFn$_invoke$arity$1 ? om.next.to_env.cljs$core$IFn$_invoke$arity$1(cfg) : om.next.to_env.call(null,cfg)),cljs.core.into.cljs$core$IFn$_invoke$arity$2((function (){var or__6753__auto__ = rootq_15560;
if(cljs.core.truth_(or__6753__auto__)){
return or__6753__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})(),om.next.transform_reads(r,reads)),cljs.core.cst$kw$remotes.cljs$core$IFn$_invoke$arity$1(cfg));
if(cljs.core.empty_QMARK_(sends_15561)){
} else {
om.next.protocols.queue_sends_BANG_(r,sends_15561);

(om.next.schedule_sends_BANG_.cljs$core$IFn$_invoke$arity$1 ? om.next.schedule_sends_BANG_.cljs$core$IFn$_invoke$arity$1(r) : om.next.schedule_sends_BANG_.call(null,r));
}

return null;
});

om.next.set_query_BANG_.cljs$lang$maxFixedArity = 3;

/**
 * Update a component's query and query parameters with a function.
 */
om.next.update_query_BANG_ = (function om$next$update_query_BANG_(var_args){
var args15562 = [];
var len__7936__auto___15582 = arguments.length;
var i__7937__auto___15583 = (0);
while(true){
if((i__7937__auto___15583 < len__7936__auto___15582)){
args15562.push((arguments[i__7937__auto___15583]));

var G__15584 = (i__7937__auto___15583 + (1));
i__7937__auto___15583 = G__15584;
continue;
} else {
}
break;
}

var G__15571 = args15562.length;
switch (G__15571) {
case 2:
return om.next.update_query_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return om.next.update_query_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return om.next.update_query_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 5:
return om.next.update_query_BANG_.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
default:
var argseq__7959__auto__ = (new cljs.core.IndexedSeq(args15562.slice((6)),(0),null));
return om.next.update_query_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]),argseq__7959__auto__);

}
});

om.next.update_query_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (component,f){
return om.next.set_query_BANG_.cljs$core$IFn$_invoke$arity$2(component,(function (){var G__15572 = new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$query,om.next.get_unbound_query(component),cljs.core.cst$kw$params,om.next.get_params(component)], null);
return (f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(G__15572) : f.call(null,G__15572));
})());
});

om.next.update_query_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (component,f,arg0){
return om.next.set_query_BANG_.cljs$core$IFn$_invoke$arity$2(component,(function (){var G__15573 = new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$query,om.next.get_unbound_query(component),cljs.core.cst$kw$params,om.next.get_params(component)], null);
var G__15574 = arg0;
return (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(G__15573,G__15574) : f.call(null,G__15573,G__15574));
})());
});

om.next.update_query_BANG_.cljs$core$IFn$_invoke$arity$4 = (function (component,f,arg0,arg1){
return om.next.set_query_BANG_.cljs$core$IFn$_invoke$arity$2(component,(function (){var G__15575 = new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$query,om.next.get_unbound_query(component),cljs.core.cst$kw$params,om.next.get_params(component)], null);
var G__15576 = arg0;
var G__15577 = arg1;
return (f.cljs$core$IFn$_invoke$arity$3 ? f.cljs$core$IFn$_invoke$arity$3(G__15575,G__15576,G__15577) : f.call(null,G__15575,G__15576,G__15577));
})());
});

om.next.update_query_BANG_.cljs$core$IFn$_invoke$arity$5 = (function (component,f,arg0,arg1,arg2){
return om.next.set_query_BANG_.cljs$core$IFn$_invoke$arity$2(component,(function (){var G__15578 = new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$query,om.next.get_unbound_query(component),cljs.core.cst$kw$params,om.next.get_params(component)], null);
var G__15579 = arg0;
var G__15580 = arg1;
var G__15581 = arg2;
return (f.cljs$core$IFn$_invoke$arity$4 ? f.cljs$core$IFn$_invoke$arity$4(G__15578,G__15579,G__15580,G__15581) : f.call(null,G__15578,G__15579,G__15580,G__15581));
})());
});

om.next.update_query_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (component,f,arg0,arg1,arg2,arg3,arg_rest){
return om.next.set_query_BANG_.cljs$core$IFn$_invoke$arity$2(component,cljs.core.apply.cljs$core$IFn$_invoke$arity$variadic(f,new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$query,om.next.get_unbound_query(component),cljs.core.cst$kw$params,om.next.get_params(component)], null),arg0,arg1,arg2,cljs.core.array_seq([arg3,arg_rest], 0)));
});

om.next.update_query_BANG_.cljs$lang$applyTo = (function (seq15563){
var G__15564 = cljs.core.first(seq15563);
var seq15563__$1 = cljs.core.next(seq15563);
var G__15565 = cljs.core.first(seq15563__$1);
var seq15563__$2 = cljs.core.next(seq15563__$1);
var G__15566 = cljs.core.first(seq15563__$2);
var seq15563__$3 = cljs.core.next(seq15563__$2);
var G__15567 = cljs.core.first(seq15563__$3);
var seq15563__$4 = cljs.core.next(seq15563__$3);
var G__15568 = cljs.core.first(seq15563__$4);
var seq15563__$5 = cljs.core.next(seq15563__$4);
var G__15569 = cljs.core.first(seq15563__$5);
var seq15563__$6 = cljs.core.next(seq15563__$5);
return om.next.update_query_BANG_.cljs$core$IFn$_invoke$arity$variadic(G__15564,G__15565,G__15566,G__15567,G__15568,G__15569,seq15563__$6);
});

om.next.update_query_BANG_.cljs$lang$maxFixedArity = (6);

/**
 * Returns true if the component is mounted.
 */
om.next.mounted_QMARK_ = (function om$next$mounted_QMARK_(x){
return (om.next.component_QMARK_(x)) && (x.isMounted());
});
/**
 * Returns the component associated with a component's React ref.
 */
om.next.react_ref = (function om$next$react_ref(component,name){
var G__15587 = component.refs;
if((G__15587 == null)){
return null;
} else {
return goog.object.get(G__15587,name);
}
});
/**
 * Returns the component's children.
 */
om.next.children = (function om$next$children(component){
return component.props.children;
});
om.next.update_component_BANG_ = (function om$next$update_component_BANG_(c,next_props){
if(om.next.component_QMARK_(c)){
} else {
throw (new Error("Assert failed: (component? c)"));
}

om.next.update_props_BANG_(c,next_props);

return c.forceUpdate();
});
om.next.should_update_QMARK_ = (function om$next$should_update_QMARK_(var_args){
var args15588 = [];
var len__7936__auto___15591 = arguments.length;
var i__7937__auto___15592 = (0);
while(true){
if((i__7937__auto___15592 < len__7936__auto___15591)){
args15588.push((arguments[i__7937__auto___15592]));

var G__15593 = (i__7937__auto___15592 + (1));
i__7937__auto___15592 = G__15593;
continue;
} else {
}
break;
}

var G__15590 = args15588.length;
switch (G__15590) {
case 2:
return om.next.should_update_QMARK_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return om.next.should_update_QMARK_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args15588.length)].join('')));

}
});

om.next.should_update_QMARK_.cljs$core$IFn$_invoke$arity$2 = (function (c,next_props){
return om.next.should_update_QMARK_.cljs$core$IFn$_invoke$arity$3(c,next_props,null);
});

om.next.should_update_QMARK_.cljs$core$IFn$_invoke$arity$3 = (function (c,next_props,next_state){
if(om.next.component_QMARK_(c)){
} else {
throw (new Error("Assert failed: (component? c)"));
}

return c.shouldComponentUpdate({"omcljs$value": next_props},{"omcljs$state": next_state});
});

om.next.should_update_QMARK_.cljs$lang$maxFixedArity = 3;

om.next.raw_class_path = (function om$next$raw_class_path(c){

var c__$1 = c;
var ret = (function (){var x__7679__auto__ = cljs.core.type(c__$1);
return cljs.core._conj(cljs.core.List.EMPTY,x__7679__auto__);
})();
while(true){
var temp__6501__auto__ = om.next.parent(c__$1);
if(cljs.core.truth_(temp__6501__auto__)){
var p = temp__6501__auto__;
if(om.next.iquery_QMARK_(p)){
var G__15595 = p;
var G__15596 = cljs.core.cons(cljs.core.type(p),ret);
c__$1 = G__15595;
ret = G__15596;
continue;
} else {
var G__15597 = p;
var G__15598 = ret;
c__$1 = G__15597;
ret = G__15598;
continue;
}
} else {
return ret;
}
break;
}
});
om.next.class_path = (function om$next$class_path(c){

new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$pre,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [om.next.component_QMARK_(c)], null)], null);

var raw_cp = om.next.raw_class_path(c);
var cp = cljs.core.seq(raw_cp);
var ret = cljs.core.PersistentVector.EMPTY;
var seen = cljs.core.PersistentHashSet.EMPTY;
while(true){
if(cp){
var c__$1 = cljs.core.first(cp);
if(cljs.core.contains_QMARK_(seen,c__$1)){
var G__15599 = cljs.core.next(cp);
var G__15600 = ret;
var G__15601 = seen;
cp = G__15599;
ret = G__15600;
seen = G__15601;
continue;
} else {
var G__15602 = cljs.core.next(cp);
var G__15603 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(ret,c__$1);
var G__15604 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(seen,c__$1);
cp = G__15602;
ret = G__15603;
seen = G__15604;
continue;
}
} else {
return cljs.core.seq(ret);
}
break;
}
});
om.next.recursive_class_path_QMARK_ = (function om$next$recursive_class_path_QMARK_(c){

new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$pre,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [om.next.component_QMARK_(c)], null)], null);

return cljs.core.not(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.distinct_QMARK_,om.next.raw_class_path(c)));
});
/**
 * Given a class or mounted component x and a ref to an instantiated component
 * or class that defines a subquery, pick the most specific subquery. If the
 * component is mounted subquery-ref will be used, subquery-class otherwise.
 */
om.next.subquery = (function om$next$subquery(x,subquery_ref,subquery_class){
if(((subquery_ref instanceof cljs.core.Keyword)) || (typeof subquery_ref === 'string')){
} else {
throw (new Error("Assert failed: (or (keyword? subquery-ref) (string? subquery-ref))"));
}

if(cljs.core.fn_QMARK_(subquery_class)){
} else {
throw (new Error("Assert failed: (fn? subquery-class)"));
}

var ref = (function (){var G__15606 = subquery_ref;
if((subquery_ref instanceof cljs.core.Keyword)){
return [cljs.core.str(G__15606)].join('');
} else {
return G__15606;
}
})();
if((om.next.component_QMARK_(x)) && (om.next.mounted_QMARK_(x))){
return om.next.get_query(om.next.react_ref(x,ref));
} else {
return om.next.get_query(subquery_class);
}
});
om.next.get_ident = (function om$next$get_ident(x){

new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$pre,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [om.next.component_QMARK_(x)], null)], null);

var m = om.next.props(x);
if(!((m == null))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str("get-ident invoked on component with nil props"),cljs.core.str("\n"),cljs.core.str("(not (nil? m))")].join('')));
}

return om.next.ident(x,m);
});
om.next.basis_t = (function om$next$basis_t(reconciler){
return om.next.protocols.basis_t(reconciler);
});
om.next.queue_render_BANG_ = (function om$next$queue_render_BANG_(f){
if(cljs.core.fn_QMARK_(om.next._STAR_raf_STAR_)){
return (om.next._STAR_raf_STAR_.cljs$core$IFn$_invoke$arity$1 ? om.next._STAR_raf_STAR_.cljs$core$IFn$_invoke$arity$1(f) : om.next._STAR_raf_STAR_.call(null,f));
} else {
if(!(typeof requestAnimationFrame !== 'undefined')){
return setTimeout(f,(16));
} else {
return requestAnimationFrame(f);

}
}
});
om.next.schedule_render_BANG_ = (function om$next$schedule_render_BANG_(reconciler){
if(cljs.core.truth_(om.next.protocols.schedule_render_BANG_(reconciler))){
return om.next.queue_render_BANG_((function (){
return om.next.protocols.reconcile_BANG_(reconciler);
}));
} else {
return null;
}
});
om.next.schedule_sends_BANG_ = (function om$next$schedule_sends_BANG_(reconciler){
if(cljs.core.truth_(om.next.protocols.schedule_sends_BANG_(reconciler))){
var G__15609 = (function (){
return om.next.protocols.send_BANG_(reconciler);
});
var G__15610 = (0);
return setTimeout(G__15609,G__15610);
} else {
return null;
}
});
/**
 * Given a root component class and a target root DOM node, instantiate and
 * render the root class using the reconciler's :state property. The reconciler
 * will continue to observe changes to :state and keep the target node in sync.
 * Note a reconciler may have only one root. If invoked on a reconciler with an
 * existing root, the new root will replace the old one.
 */
om.next.add_root_BANG_ = (function om$next$add_root_BANG_(var_args){
var args15611 = [];
var len__7936__auto___15614 = arguments.length;
var i__7937__auto___15615 = (0);
while(true){
if((i__7937__auto___15615 < len__7936__auto___15614)){
args15611.push((arguments[i__7937__auto___15615]));

var G__15616 = (i__7937__auto___15615 + (1));
i__7937__auto___15615 = G__15616;
continue;
} else {
}
break;
}

var G__15613 = args15611.length;
switch (G__15613) {
case 3:
return om.next.add_root_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return om.next.add_root_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args15611.length)].join('')));

}
});

om.next.add_root_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (reconciler,root_class,target){
return om.next.add_root_BANG_.cljs$core$IFn$_invoke$arity$4(reconciler,root_class,target,null);
});

om.next.add_root_BANG_.cljs$core$IFn$_invoke$arity$4 = (function (reconciler,root_class,target,options){
if(cljs.core.truth_((om.next.reconciler_QMARK_.cljs$core$IFn$_invoke$arity$1 ? om.next.reconciler_QMARK_.cljs$core$IFn$_invoke$arity$1(reconciler) : om.next.reconciler_QMARK_.call(null,reconciler)))){
} else {
throw (new Error("Assert failed: (reconciler? reconciler)"));
}

if(cljs.core.fn_QMARK_(root_class)){
} else {
throw (new Error("Assert failed: (fn? root-class)"));
}

var temp__6503__auto___15618 = cljs.core.get.cljs$core$IFn$_invoke$arity$2((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(om.next.roots) : cljs.core.deref.call(null,om.next.roots)),target);
if(cljs.core.truth_(temp__6503__auto___15618)){
var old_reconciler_15619 = temp__6503__auto___15618;
(om.next.remove_root_BANG_.cljs$core$IFn$_invoke$arity$2 ? om.next.remove_root_BANG_.cljs$core$IFn$_invoke$arity$2(old_reconciler_15619,target) : om.next.remove_root_BANG_.call(null,old_reconciler_15619,target));
} else {
}

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(om.next.roots,cljs.core.assoc,target,reconciler);

return om.next.protocols.add_root_BANG_(reconciler,root_class,target,options);
});

om.next.add_root_BANG_.cljs$lang$maxFixedArity = 4;

/**
 * Remove a root target (a DOM element) from a reconciler. The reconciler will
 * no longer attempt to reconcile application state with the specified root.
 */
om.next.remove_root_BANG_ = (function om$next$remove_root_BANG_(reconciler,target){
return om.next.protocols.remove_root_BANG_(reconciler,target);
});

/**
 * @interface
 */
om.next.ITxIntercept = function(){};

/**
 * An optional protocol that component may implement to intercept child
 *   transactions.
 */
om.next.tx_intercept = (function om$next$tx_intercept(c,tx){
if((!((c == null))) && (!((c.om$next$ITxIntercept$tx_intercept$arity$2 == null)))){
return c.om$next$ITxIntercept$tx_intercept$arity$2(c,tx);
} else {
var x__7466__auto__ = (((c == null))?null:c);
var m__7467__auto__ = (om.next.tx_intercept[goog.typeOf(x__7466__auto__)]);
if(!((m__7467__auto__ == null))){
return (m__7467__auto__.cljs$core$IFn$_invoke$arity$2 ? m__7467__auto__.cljs$core$IFn$_invoke$arity$2(c,tx) : m__7467__auto__.call(null,c,tx));
} else {
var m__7467__auto____$1 = (om.next.tx_intercept["_"]);
if(!((m__7467__auto____$1 == null))){
return (m__7467__auto____$1.cljs$core$IFn$_invoke$arity$2 ? m__7467__auto____$1.cljs$core$IFn$_invoke$arity$2(c,tx) : m__7467__auto____$1.call(null,c,tx));
} else {
throw cljs.core.missing_protocol("ITxIntercept.tx-intercept",c);
}
}
}
});

om.next.to_env = (function om$next$to_env(x){
var config = (cljs.core.truth_((om.next.reconciler_QMARK_.cljs$core$IFn$_invoke$arity$1 ? om.next.reconciler_QMARK_.cljs$core$IFn$_invoke$arity$1(x) : om.next.reconciler_QMARK_.call(null,x)))?cljs.core.cst$kw$config.cljs$core$IFn$_invoke$arity$1(x):x);
return cljs.core.select_keys(config,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$state,cljs.core.cst$kw$shared,cljs.core.cst$kw$parser,cljs.core.cst$kw$logger,cljs.core.cst$kw$pathopt], null));
});
om.next.transact_STAR_ = (function om$next$transact_STAR_(r,c,ref,tx){
var cfg = cljs.core.cst$kw$config.cljs$core$IFn$_invoke$arity$1(r);
var ref__$1 = (cljs.core.truth_((function (){var and__6741__auto__ = c;
if(cljs.core.truth_(and__6741__auto__)){
var and__6741__auto____$1 = ((!((c == null)))?(((false) || (c.om$next$Ident$))?true:false):false);
if(and__6741__auto____$1){
return cljs.core.not(ref);
} else {
return and__6741__auto____$1;
}
} else {
return and__6741__auto__;
}
})())?om.next.ident(c,om.next.props(c)):ref);
var env = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([om.next.to_env(cfg),new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$reconciler,r,cljs.core.cst$kw$component,c], null),(cljs.core.truth_(ref__$1)?new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$ref,ref__$1], null):null)], 0));
var id = cljs.core.random_uuid();
var _ = cljs.core.cst$kw$history.cljs$core$IFn$_invoke$arity$1(cfg).add(id,(function (){var G__15628 = cljs.core.cst$kw$state.cljs$core$IFn$_invoke$arity$1(cfg);
return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(G__15628) : cljs.core.deref.call(null,G__15628));
})());
var ___$1 = (function (){var temp__6503__auto__ = cljs.core.cst$kw$logger.cljs$core$IFn$_invoke$arity$1(cfg);
if(cljs.core.truth_(temp__6503__auto__)){
var l = temp__6503__auto__;
var G__15629 = l;
var G__15630 = [cljs.core.str((cljs.core.truth_(ref__$1)?[cljs.core.str(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([ref__$1], 0))),cljs.core.str(" ")].join(''):null)),cljs.core.str("transacted '"),cljs.core.str(tx),cljs.core.str(", "),cljs.core.str(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([id], 0)))].join('');
return goog.log.info(G__15629,G__15630);
} else {
return null;
}
})();
var v = cljs.core.cst$kw$parser.cljs$core$IFn$_invoke$arity$1(cfg).call(null,env,tx);
var snds = om.next.gather_sends(env,tx,cljs.core.cst$kw$remotes.cljs$core$IFn$_invoke$arity$1(cfg));
var q = (function (){var G__15631 = cljs.core.PersistentVector.EMPTY;
var G__15631__$1 = ((!((c == null)))?cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__15631,c):G__15631);
if(!((ref__$1 == null))){
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__15631__$1,ref__$1);
} else {
return G__15631__$1;
}
})();
om.next.protocols.queue_BANG_(r,cljs.core.into.cljs$core$IFn$_invoke$arity$3(q,cljs.core.remove.cljs$core$IFn$_invoke$arity$1(cljs.core.symbol_QMARK_),cljs.core.keys(v)));

if(cljs.core.empty_QMARK_(snds)){
} else {
om.next.protocols.queue_sends_BANG_(r,snds);

om.next.schedule_sends_BANG_(r);
}

return v;
});
/**
 * Given a query expression annotate all mutations by adding a :mutator -> ident
 * entry to the metadata of each mutation expression in the query.
 */
om.next.annotate_mutations = (function om$next$annotate_mutations(tx,ident){
var annotate = (function om$next$annotate_mutations_$_annotate(expr,ident__$1){
var G__15640 = expr;
if(om.util.mutation_QMARK_(expr)){
return cljs.core.vary_meta.cljs$core$IFn$_invoke$arity$4(G__15640,cljs.core.assoc,cljs.core.cst$kw$mutator,ident__$1);
} else {
return G__15640;
}
});
return cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentVector.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1((function (p1__15632_SHARP_){
return annotate(p1__15632_SHARP_,ident);
})),tx);
});
/**
 * Given a reconciler or component run a transaction. tx is a parse expression
 * that should include mutations followed by any necessary read. The reads will
 * be used to trigger component re-rendering.
 * 
 * Example:
 * 
 *   (om/transact! widget
 *     '[(do/this!) (do/that!)
 *       :read/this :read/that])
 */
om.next.transact_BANG_ = (function om$next$transact_BANG_(var_args){
var args15641 = [];
var len__7936__auto___15651 = arguments.length;
var i__7937__auto___15652 = (0);
while(true){
if((i__7937__auto___15652 < len__7936__auto___15651)){
args15641.push((arguments[i__7937__auto___15652]));

var G__15653 = (i__7937__auto___15652 + (1));
i__7937__auto___15652 = G__15653;
continue;
} else {
}
break;
}

var G__15643 = args15641.length;
switch (G__15643) {
case 2:
return om.next.transact_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return om.next.transact_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args15641.length)].join('')));

}
});

om.next.transact_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (x,tx){
if(cljs.core.truth_((function (){var or__6753__auto__ = om.next.component_QMARK_(x);
if(or__6753__auto__){
return or__6753__auto__;
} else {
return (om.next.reconciler_QMARK_.cljs$core$IFn$_invoke$arity$1 ? om.next.reconciler_QMARK_.cljs$core$IFn$_invoke$arity$1(x) : om.next.reconciler_QMARK_.call(null,x));
}
})())){
} else {
throw (new Error("Assert failed: (or (component? x) (reconciler? x))"));
}

if(cljs.core.vector_QMARK_(tx)){
} else {
throw (new Error("Assert failed: (vector? tx)"));
}

var tx__$1 = (function (){var G__15644 = tx;
if((function (){var and__6741__auto__ = om.next.component_QMARK_(x);
if(and__6741__auto__){
if(!((x == null))){
if((false) || (x.om$next$Ident$)){
return true;
} else {
if((!x.cljs$lang$protocol_mask$partition$)){
return cljs.core.native_satisfies_QMARK_(om.next.Ident,x);
} else {
return false;
}
}
} else {
return cljs.core.native_satisfies_QMARK_(om.next.Ident,x);
}
} else {
return and__6741__auto__;
}
})()){
return om.next.annotate_mutations(G__15644,om.next.get_ident(x));
} else {
return G__15644;
}
})();
if(cljs.core.truth_((om.next.reconciler_QMARK_.cljs$core$IFn$_invoke$arity$1 ? om.next.reconciler_QMARK_.cljs$core$IFn$_invoke$arity$1(x) : om.next.reconciler_QMARK_.call(null,x)))){
return om.next.transact_STAR_(x,null,null,tx__$1);
} else {
if(om.next.iquery_QMARK_(x)){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str([cljs.core.str("transact! invoked by component "),cljs.core.str(x),cljs.core.str(" that does not implement IQuery")].join('')),cljs.core.str("\n"),cljs.core.str("(iquery? x)")].join('')));
}

var p = om.next.parent(x);
var x__$1 = x;
var tx__$2 = tx__$1;
while(true){
if((p == null)){
var r = om.next.get_reconciler(x__$1);
return om.next.transact_STAR_(r,x__$1,null,om.next.transform_reads(r,tx__$2));
} else {
var vec__15647 = ((((!((p == null)))?(((false) || (p.om$next$ITxIntercept$))?true:false):false))?new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [p,om.next.tx_intercept(p,tx__$2)], null):new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [x__$1,tx__$2], null));
var x_SINGLEQUOTE_ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__15647,(0),null);
var tx__$3 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__15647,(1),null);
var G__15655 = om.next.parent(p);
var G__15656 = x_SINGLEQUOTE_;
var G__15657 = tx__$3;
p = G__15655;
x__$1 = G__15656;
tx__$2 = G__15657;
continue;
}
break;
}
}
});

om.next.transact_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (r,ref,tx){
return om.next.transact_STAR_(r,null,ref,tx);
});

om.next.transact_BANG_.cljs$lang$maxFixedArity = 3;

/**
 * Create a parser. The argument is a map of two keys, :read and :mutate. Both
 * functions should have the signature (Env -> Key -> Params -> ParseResult).
 */
om.next.parser = (function om$next$parser(p__15658){
var map__15661 = p__15658;
var map__15661__$1 = ((((!((map__15661 == null)))?((((map__15661.cljs$lang$protocol_mask$partition0$ & (64))) || (map__15661.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__15661):map__15661);
var opts = map__15661__$1;
var read = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__15661__$1,cljs.core.cst$kw$read);
var mutate = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__15661__$1,cljs.core.cst$kw$mutate);
if(cljs.core.map_QMARK_(opts)){
} else {
throw (new Error("Assert failed: (map? opts)"));
}

return om.next.impl.parser.parser(opts);
});
/**
 * Helper function for implementing :read and :mutate as multimethods. Use this
 * as the dispatch-fn.
 */
om.next.dispatch = (function om$next$dispatch(_,key,___$1){
return key;
});
/**
 * Given a query expression convert it into an AST.
 */
om.next.query__GT_ast = (function om$next$query__GT_ast(query_expr){
return om.next.impl.parser.query__GT_ast(query_expr);
});
om.next.ast__GT_query = (function om$next$ast__GT_query(query_ast){

return om.next.impl.parser.ast__GT_expr.cljs$core$IFn$_invoke$arity$2(query_ast,true);
});
/**
 * Cascades a query up the classpath. class-path->query is a map of classpaths
 * to their queries. classpath is the classpath where we start cascading (typically
 * the direct parent's classpath of the component changing query). data-path is
 * the data path in the classpath's query to the new query. new-query is the
 * query to be applied to the classpaths. union-keys are any keys into union
 * queries found during index building; they are used to access union queries
 * when cascading the classpath, and to generate the classpaths' rendered-paths,
 * which skip these keys.
 */
om.next.cascade_query = (function om$next$cascade_query(class_path__GT_query,classpath,data_path,new_query,union_keys){
var cp = classpath;
var data_path__$1 = data_path;
var new_query__$1 = new_query;
var ret = cljs.core.PersistentArrayMap.EMPTY;
while(true){
if(!(cljs.core.empty_QMARK_(cp))){
var rendered_data_path = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentVector.EMPTY,cljs.core.remove.cljs$core$IFn$_invoke$arity$1(cljs.core.set(union_keys)),data_path__$1);
var filter_data_path = (function (){var G__15665 = rendered_data_path;
if(!(cljs.core.empty_QMARK_(rendered_data_path))){
return cljs.core.pop(G__15665);
} else {
return G__15665;
}
})();
var qs = cljs.core.filter.cljs$core$IFn$_invoke$arity$2(((function (cp,data_path__$1,new_query__$1,ret,rendered_data_path,filter_data_path){
return (function (p1__15663_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(filter_data_path,om.next.focus__GT_path.cljs$core$IFn$_invoke$arity$2(clojure.zip.root(p1__15663_SHARP_),filter_data_path));
});})(cp,data_path__$1,new_query__$1,ret,rendered_data_path,filter_data_path))
,cljs.core.get.cljs$core$IFn$_invoke$arity$2(class_path__GT_query,cp));
var qs_SINGLEQUOTE_ = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentHashSet.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1(((function (cp,data_path__$1,new_query__$1,ret,rendered_data_path,filter_data_path,qs){
return (function (q){
var new_query__$2 = (cljs.core.truth_((function (){var or__6753__auto__ = cljs.core.map_QMARK_(clojure.zip.node(q));
if(or__6753__auto__){
return or__6753__auto__;
} else {
return cljs.core.some(cljs.core.PersistentHashSet.fromArray([cljs.core.peek(data_path__$1)], true),union_keys);
}
})())?(function (){var union_key = cljs.core.peek(data_path__$1);
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(clojure.zip.node(om.next.query_template(clojure.zip.root(q),rendered_data_path)),union_key,new_query__$1);
})():new_query__$1);
return om.next.query_template(om.next.focus_query(om.next.replace(om.next.query_template(clojure.zip.root(q),rendered_data_path),new_query__$2),filter_data_path),filter_data_path);
});})(cp,data_path__$1,new_query__$1,ret,rendered_data_path,filter_data_path,qs))
),qs);
var G__15666 = cljs.core.pop(cp);
var G__15667 = cljs.core.pop(data_path__$1);
var G__15668 = clojure.zip.node(cljs.core.first(qs_SINGLEQUOTE_));
var G__15669 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(ret,cp,qs_SINGLEQUOTE_);
cp = G__15666;
data_path__$1 = G__15667;
new_query__$1 = G__15668;
ret = G__15669;
continue;
} else {
return ret;
}
break;
}
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {om.next.protocols.IIndexer}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IDeref}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
om.next.Indexer = (function (indexes,extfs,__meta,__extmap,__hash){
this.indexes = indexes;
this.extfs = extfs;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2229700362;
this.cljs$lang$protocol_mask$partition1$ = 8192;
})

om.next.Indexer.prototype.om$next$protocols$IIndexer$ = true;

om.next.Indexer.prototype.om$next$protocols$IIndexer$index_root$arity$2 = (function (_,x){
var self__ = this;
var ___$1 = this;
var prop__GT_classes = (function (){var G__15677 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__15677) : cljs.core.atom.call(null,G__15677));
})();
var class_path__GT_query = (function (){var G__15678 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__15678) : cljs.core.atom.call(null,G__15678));
})();
var rootq = om.next.get_query(x);
var class$ = (function (){var G__15679 = x;
if(om.next.component_QMARK_(x)){
return cljs.core.type(G__15679);
} else {
return G__15679;
}
})();
var get_dispatch_key = ((function (prop__GT_classes,class_path__GT_query,rootq,class$,___$1){
return (function om$next$get_dispatch_key(prop){
var G__15767 = prop;
if((!(om.util.ident_QMARK_(prop))) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.second(prop),cljs.core.cst$sym$_))){
return cljs.core.comp.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$dispatch_DASH_key,om.next.impl.parser.expr__GT_ast).call(null,G__15767);
} else {
return G__15767;
}
});})(prop__GT_classes,class_path__GT_query,rootq,class$,___$1))
;
var build_index_STAR_ = ((function (prop__GT_classes,class_path__GT_query,rootq,class$,___$1){
return (function om$next$build_index_STAR_(class$__$1,query,path,classpath,union_expr,union_keys){
var l__15215__auto___15862 = om.next._STAR_logger_STAR_;
if((!(om.next.iquery_QMARK_(class$__$1))) || ((om.next.iquery_QMARK_(class$__$1)) && (!(cljs.core.empty_QMARK_(query))))){
} else {
var G__15822_15863 = l__15215__auto___15862;
var G__15823_15864 = [cljs.core.str("Invariant Violation"),cljs.core.str(((("build-index*" == null))?null:[cljs.core.str(" (in function: `"),cljs.core.str("build-index*"),cljs.core.str("`)")].join(''))),cljs.core.str(": "),cljs.core.str([cljs.core.str("`IQuery` implementation must return a non-empty query."),cljs.core.str(" Check the `IQuery` implementation of component `"),cljs.core.str(((om.next.component_QMARK_(class$__$1))?class$__$1.constructor.displayName:class$__$1.prototype.constructor.displayName)),cljs.core.str("`.")].join(''))].join('');
goog.log.error(G__15822_15863,G__15823_15864);
}

var recursive_QMARK_ = cljs.core.some(cljs.core.PersistentHashSet.fromArray([class$__$1], true),classpath);
var classpath__$1 = (function (){var G__15824 = classpath;
if((!((class$__$1 == null))) && (cljs.core.not(recursive_QMARK_))){
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__15824,class$__$1);
} else {
return G__15824;
}
})();
var dp__GT_cs = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(self__.indexes) : cljs.core.deref.call(null,self__.indexes)),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$data_DASH_path_DASH__GT_components], null));
if(cljs.core.truth_(class$__$1)){
var focused_query_15865 = om.next.query_template(om.next.focus_query(rootq,path),path);
var cp_query_15866 = (function (){var G__15825 = focused_query_15865;
if((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(clojure.zip.node(focused_query_15865),query)) && (cljs.core.not(recursive_QMARK_))){
return clojure.zip.replace(G__15825,query);
} else {
return G__15825;
}
})();
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(class_path__GT_query,cljs.core.update_in,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [classpath__$1], null),cljs.core.fnil.cljs$core$IFn$_invoke$arity$2(cljs.core.conj,cljs.core.PersistentHashSet.EMPTY),cljs.core.array_seq([cp_query_15866], 0));
} else {
}

var recursive_join_QMARK_ = (function (){var and__6741__auto__ = recursive_QMARK_;
if(cljs.core.truth_(and__6741__auto__)){
var and__6741__auto____$1 = cljs.core.some(((function (and__6741__auto__,recursive_QMARK_,classpath__$1,dp__GT_cs,prop__GT_classes,class_path__GT_query,rootq,class$,___$1){
return (function (e){
var and__6741__auto____$1 = om.util.join_QMARK_(e);
if(cljs.core.truth_(and__6741__auto____$1)){
return !(om.util.recursion_QMARK_(om.util.join_value(e)));
} else {
return and__6741__auto____$1;
}
});})(and__6741__auto__,recursive_QMARK_,classpath__$1,dp__GT_cs,prop__GT_classes,class_path__GT_query,rootq,class$,___$1))
,query);
if(cljs.core.truth_(and__6741__auto____$1)){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(path),path);
} else {
return and__6741__auto____$1;
}
} else {
return and__6741__auto__;
}
})();
var recursive_union_QMARK_ = (function (){var and__6741__auto__ = recursive_QMARK_;
if(cljs.core.truth_(and__6741__auto__)){
var and__6741__auto____$1 = union_expr;
if(cljs.core.truth_(and__6741__auto____$1)){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(path),path);
} else {
return and__6741__auto____$1;
}
} else {
return and__6741__auto__;
}
})();
if(cljs.core.truth_((function (){var or__6753__auto__ = cljs.core.not(recursive_QMARK_);
if(or__6753__auto__){
return or__6753__auto__;
} else {
var or__6753__auto____$1 = recursive_join_QMARK_;
if(cljs.core.truth_(or__6753__auto____$1)){
return or__6753__auto____$1;
} else {
return recursive_union_QMARK_;
}
}
})())){
if(cljs.core.vector_QMARK_(query)){
var map__15826 = cljs.core.group_by(om.util.join_QMARK_,query);
var map__15826__$1 = ((((!((map__15826 == null)))?((((map__15826.cljs$lang$protocol_mask$partition0$ & (64))) || (map__15826.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__15826):map__15826);
var props = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__15826__$1,false);
var joins = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__15826__$1,true);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(prop__GT_classes,((function (map__15826,map__15826__$1,props,joins,recursive_join_QMARK_,recursive_union_QMARK_,recursive_QMARK_,classpath__$1,dp__GT_cs,prop__GT_classes,class_path__GT_query,rootq,class$,___$1){
return (function (p1__15670_SHARP_){
return cljs.core.merge_with.cljs$core$IFn$_invoke$arity$variadic(cljs.core.into,cljs.core.array_seq([p1__15670_SHARP_,cljs.core.zipmap(cljs.core.map.cljs$core$IFn$_invoke$arity$2(get_dispatch_key,props),cljs.core.repeat.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentHashSet.fromArray([class$__$1], true)))], 0));
});})(map__15826,map__15826__$1,props,joins,recursive_join_QMARK_,recursive_union_QMARK_,recursive_QMARK_,classpath__$1,dp__GT_cs,prop__GT_classes,class_path__GT_query,rootq,class$,___$1))
);

var seq__15828 = cljs.core.seq(joins);
var chunk__15829 = null;
var count__15830 = (0);
var i__15831 = (0);
while(true){
if((i__15831 < count__15830)){
var join = chunk__15829.cljs$core$IIndexed$_nth$arity$2(null,i__15831);
var vec__15832_15867 = om.util.join_entry(join);
var prop_15868 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__15832_15867,(0),null);
var query_SINGLEQUOTE__15869 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__15832_15867,(1),null);
var prop_dispatch_key_15870 = get_dispatch_key(prop_15868);
var recursion_QMARK__15871 = om.util.recursion_QMARK_(query_SINGLEQUOTE__15869);
var union_recursion_QMARK__15872 = (function (){var and__6741__auto__ = recursion_QMARK__15871;
if(and__6741__auto__){
return union_expr;
} else {
return and__6741__auto__;
}
})();
var query_SINGLEQUOTE__15873__$1 = ((recursion_QMARK__15871)?((!((union_expr == null)))?union_expr:query):query_SINGLEQUOTE__15869);
var path_SINGLEQUOTE__15874 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(path,prop_15868);
var rendered_path_SINGLEQUOTE__15875 = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.set(union_keys),path_SINGLEQUOTE__15874));
var cs_15876 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(dp__GT_cs,rendered_path_SINGLEQUOTE__15875);
var cascade_query_QMARK__15877 = (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.count(cs_15876),(1))) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$component.cljs$core$IFn$_invoke$arity$1(cljs.core.meta(query_SINGLEQUOTE__15873__$1)),cljs.core.type(cljs.core.first(cs_15876)))) && (!(cljs.core.map_QMARK_(query_SINGLEQUOTE__15873__$1)));
var query_SINGLEQUOTE__SINGLEQUOTE__15878 = ((cascade_query_QMARK__15877)?om.next.get_query(cljs.core.first(cs_15876)):query_SINGLEQUOTE__15873__$1);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(prop__GT_classes,((function (seq__15828,chunk__15829,count__15830,i__15831,vec__15832_15867,prop_15868,query_SINGLEQUOTE__15869,prop_dispatch_key_15870,recursion_QMARK__15871,union_recursion_QMARK__15872,query_SINGLEQUOTE__15873__$1,path_SINGLEQUOTE__15874,rendered_path_SINGLEQUOTE__15875,cs_15876,cascade_query_QMARK__15877,query_SINGLEQUOTE__SINGLEQUOTE__15878,join,map__15826,map__15826__$1,props,joins,recursive_join_QMARK_,recursive_union_QMARK_,recursive_QMARK_,classpath__$1,dp__GT_cs,prop__GT_classes,class_path__GT_query,rootq,class$,___$1){
return (function (p1__15671_SHARP_){
return cljs.core.merge_with.cljs$core$IFn$_invoke$arity$variadic(cljs.core.into,cljs.core.array_seq([p1__15671_SHARP_,cljs.core.PersistentArrayMap.fromArray([prop_dispatch_key_15870,cljs.core.PersistentHashSet.fromArray([class$__$1], true)], true, false)], 0));
});})(seq__15828,chunk__15829,count__15830,i__15831,vec__15832_15867,prop_15868,query_SINGLEQUOTE__15869,prop_dispatch_key_15870,recursion_QMARK__15871,union_recursion_QMARK__15872,query_SINGLEQUOTE__15873__$1,path_SINGLEQUOTE__15874,rendered_path_SINGLEQUOTE__15875,cs_15876,cascade_query_QMARK__15877,query_SINGLEQUOTE__SINGLEQUOTE__15878,join,map__15826,map__15826__$1,props,joins,recursive_join_QMARK_,recursive_union_QMARK_,recursive_QMARK_,classpath__$1,dp__GT_cs,prop__GT_classes,class_path__GT_query,rootq,class$,___$1))
);

if((cascade_query_QMARK__15877) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(query_SINGLEQUOTE__15873__$1,query_SINGLEQUOTE__SINGLEQUOTE__15878))){
var cp__GT_q_SINGLEQUOTE__15879 = om.next.cascade_query((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(class_path__GT_query) : cljs.core.deref.call(null,class_path__GT_query)),classpath__$1,path_SINGLEQUOTE__15874,query_SINGLEQUOTE__SINGLEQUOTE__15878,union_keys);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(class_path__GT_query,cljs.core.merge,cp__GT_q_SINGLEQUOTE__15879);
} else {
}

var class_SINGLEQUOTE__15880 = cljs.core.cst$kw$component.cljs$core$IFn$_invoke$arity$1(cljs.core.meta(query_SINGLEQUOTE__SINGLEQUOTE__15878));
if((recursion_QMARK__15871) && ((class_SINGLEQUOTE__15880 == null))){
} else {
om$next$build_index_STAR_(class_SINGLEQUOTE__15880,query_SINGLEQUOTE__SINGLEQUOTE__15878,path_SINGLEQUOTE__15874,classpath__$1,((recursion_QMARK__15871)?union_expr:null),union_keys);
}

var G__15881 = seq__15828;
var G__15882 = chunk__15829;
var G__15883 = count__15830;
var G__15884 = (i__15831 + (1));
seq__15828 = G__15881;
chunk__15829 = G__15882;
count__15830 = G__15883;
i__15831 = G__15884;
continue;
} else {
var temp__6503__auto__ = cljs.core.seq(seq__15828);
if(temp__6503__auto__){
var seq__15828__$1 = temp__6503__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__15828__$1)){
var c__7656__auto__ = cljs.core.chunk_first(seq__15828__$1);
var G__15885 = cljs.core.chunk_rest(seq__15828__$1);
var G__15886 = c__7656__auto__;
var G__15887 = cljs.core.count(c__7656__auto__);
var G__15888 = (0);
seq__15828 = G__15885;
chunk__15829 = G__15886;
count__15830 = G__15887;
i__15831 = G__15888;
continue;
} else {
var join = cljs.core.first(seq__15828__$1);
var vec__15835_15889 = om.util.join_entry(join);
var prop_15890 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__15835_15889,(0),null);
var query_SINGLEQUOTE__15891 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__15835_15889,(1),null);
var prop_dispatch_key_15892 = get_dispatch_key(prop_15890);
var recursion_QMARK__15893 = om.util.recursion_QMARK_(query_SINGLEQUOTE__15891);
var union_recursion_QMARK__15894 = (function (){var and__6741__auto__ = recursion_QMARK__15893;
if(and__6741__auto__){
return union_expr;
} else {
return and__6741__auto__;
}
})();
var query_SINGLEQUOTE__15895__$1 = ((recursion_QMARK__15893)?((!((union_expr == null)))?union_expr:query):query_SINGLEQUOTE__15891);
var path_SINGLEQUOTE__15896 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(path,prop_15890);
var rendered_path_SINGLEQUOTE__15897 = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.set(union_keys),path_SINGLEQUOTE__15896));
var cs_15898 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(dp__GT_cs,rendered_path_SINGLEQUOTE__15897);
var cascade_query_QMARK__15899 = (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.count(cs_15898),(1))) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$component.cljs$core$IFn$_invoke$arity$1(cljs.core.meta(query_SINGLEQUOTE__15895__$1)),cljs.core.type(cljs.core.first(cs_15898)))) && (!(cljs.core.map_QMARK_(query_SINGLEQUOTE__15895__$1)));
var query_SINGLEQUOTE__SINGLEQUOTE__15900 = ((cascade_query_QMARK__15899)?om.next.get_query(cljs.core.first(cs_15898)):query_SINGLEQUOTE__15895__$1);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(prop__GT_classes,((function (seq__15828,chunk__15829,count__15830,i__15831,vec__15835_15889,prop_15890,query_SINGLEQUOTE__15891,prop_dispatch_key_15892,recursion_QMARK__15893,union_recursion_QMARK__15894,query_SINGLEQUOTE__15895__$1,path_SINGLEQUOTE__15896,rendered_path_SINGLEQUOTE__15897,cs_15898,cascade_query_QMARK__15899,query_SINGLEQUOTE__SINGLEQUOTE__15900,join,seq__15828__$1,temp__6503__auto__,map__15826,map__15826__$1,props,joins,recursive_join_QMARK_,recursive_union_QMARK_,recursive_QMARK_,classpath__$1,dp__GT_cs,prop__GT_classes,class_path__GT_query,rootq,class$,___$1){
return (function (p1__15671_SHARP_){
return cljs.core.merge_with.cljs$core$IFn$_invoke$arity$variadic(cljs.core.into,cljs.core.array_seq([p1__15671_SHARP_,cljs.core.PersistentArrayMap.fromArray([prop_dispatch_key_15892,cljs.core.PersistentHashSet.fromArray([class$__$1], true)], true, false)], 0));
});})(seq__15828,chunk__15829,count__15830,i__15831,vec__15835_15889,prop_15890,query_SINGLEQUOTE__15891,prop_dispatch_key_15892,recursion_QMARK__15893,union_recursion_QMARK__15894,query_SINGLEQUOTE__15895__$1,path_SINGLEQUOTE__15896,rendered_path_SINGLEQUOTE__15897,cs_15898,cascade_query_QMARK__15899,query_SINGLEQUOTE__SINGLEQUOTE__15900,join,seq__15828__$1,temp__6503__auto__,map__15826,map__15826__$1,props,joins,recursive_join_QMARK_,recursive_union_QMARK_,recursive_QMARK_,classpath__$1,dp__GT_cs,prop__GT_classes,class_path__GT_query,rootq,class$,___$1))
);

if((cascade_query_QMARK__15899) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(query_SINGLEQUOTE__15895__$1,query_SINGLEQUOTE__SINGLEQUOTE__15900))){
var cp__GT_q_SINGLEQUOTE__15901 = om.next.cascade_query((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(class_path__GT_query) : cljs.core.deref.call(null,class_path__GT_query)),classpath__$1,path_SINGLEQUOTE__15896,query_SINGLEQUOTE__SINGLEQUOTE__15900,union_keys);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(class_path__GT_query,cljs.core.merge,cp__GT_q_SINGLEQUOTE__15901);
} else {
}

var class_SINGLEQUOTE__15902 = cljs.core.cst$kw$component.cljs$core$IFn$_invoke$arity$1(cljs.core.meta(query_SINGLEQUOTE__SINGLEQUOTE__15900));
if((recursion_QMARK__15893) && ((class_SINGLEQUOTE__15902 == null))){
} else {
om$next$build_index_STAR_(class_SINGLEQUOTE__15902,query_SINGLEQUOTE__SINGLEQUOTE__15900,path_SINGLEQUOTE__15896,classpath__$1,((recursion_QMARK__15893)?union_expr:null),union_keys);
}

var G__15903 = cljs.core.next(seq__15828__$1);
var G__15904 = null;
var G__15905 = (0);
var G__15906 = (0);
seq__15828 = G__15903;
chunk__15829 = G__15904;
count__15830 = G__15905;
i__15831 = G__15906;
continue;
}
} else {
return null;
}
}
break;
}
} else {
if(cljs.core.map_QMARK_(query)){
var seq__15838 = cljs.core.seq(query);
var chunk__15839 = null;
var count__15840 = (0);
var i__15841 = (0);
while(true){
if((i__15841 < count__15840)){
var vec__15842 = chunk__15839.cljs$core$IIndexed$_nth$arity$2(null,i__15841);
var prop = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__15842,(0),null);
var query_SINGLEQUOTE_ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__15842,(1),null);
var path_SINGLEQUOTE__15907 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(path,prop);
var class_SINGLEQUOTE__15908 = cljs.core.cst$kw$component.cljs$core$IFn$_invoke$arity$1(cljs.core.meta(query_SINGLEQUOTE_));
var cs_15909 = cljs.core.filter.cljs$core$IFn$_invoke$arity$2(((function (seq__15838,chunk__15839,count__15840,i__15841,path_SINGLEQUOTE__15907,class_SINGLEQUOTE__15908,vec__15842,prop,query_SINGLEQUOTE_,recursive_join_QMARK_,recursive_union_QMARK_,recursive_QMARK_,classpath__$1,dp__GT_cs,prop__GT_classes,class_path__GT_query,rootq,class$,___$1){
return (function (p1__15672_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(class_SINGLEQUOTE__15908,cljs.core.type(p1__15672_SHARP_));
});})(seq__15838,chunk__15839,count__15840,i__15841,path_SINGLEQUOTE__15907,class_SINGLEQUOTE__15908,vec__15842,prop,query_SINGLEQUOTE_,recursive_join_QMARK_,recursive_union_QMARK_,recursive_QMARK_,classpath__$1,dp__GT_cs,prop__GT_classes,class_path__GT_query,rootq,class$,___$1))
,cljs.core.get.cljs$core$IFn$_invoke$arity$2(dp__GT_cs,path));
var cascade_query_QMARK__15910 = (function (){var and__6741__auto__ = class_SINGLEQUOTE__15908;
if(cljs.core.truth_(and__6741__auto__)){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.count(cs_15909),(1));
} else {
return and__6741__auto__;
}
})();
var query_SINGLEQUOTE__SINGLEQUOTE__15911 = (cljs.core.truth_(cascade_query_QMARK__15910)?om.next.get_query(cljs.core.first(cs_15909)):query_SINGLEQUOTE_);
if(cljs.core.truth_((function (){var and__6741__auto__ = cascade_query_QMARK__15910;
if(cljs.core.truth_(and__6741__auto__)){
return cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(query_SINGLEQUOTE_,query_SINGLEQUOTE__SINGLEQUOTE__15911);
} else {
return and__6741__auto__;
}
})())){
var qs_15912 = cljs.core.get.cljs$core$IFn$_invoke$arity$2((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(class_path__GT_query) : cljs.core.deref.call(null,class_path__GT_query)),classpath__$1);
var q_15913 = cljs.core.first(qs_15912);
var qnode_15914 = clojure.zip.node((function (){var G__15845 = q_15913;
if((class$__$1 == null)){
return om.next.query_template(G__15845,path);
} else {
return G__15845;
}
})());
var new_query_15915 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(qnode_15914,prop,query_SINGLEQUOTE__SINGLEQUOTE__15911);
var q_SINGLEQUOTE__15916 = (function (){var G__15846 = clojure.zip.replace(om.next.query_template(clojure.zip.root(q_15913),path),new_query_15915);
if((class$__$1 == null)){
return om.next.query_template(om.next.focus_query(clojure.zip.root(G__15846),cljs.core.pop(path)),cljs.core.pop(path));
} else {
return G__15846;
}
})();
var qs_SINGLEQUOTE__15917 = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentHashSet.fromArray([q_SINGLEQUOTE__15916], true),cljs.core.remove.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentHashSet.fromArray([q_15913], true)),qs_15912);
var cp__GT_q_SINGLEQUOTE__15918 = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.PersistentArrayMap.fromArray([classpath__$1,qs_SINGLEQUOTE__15917], true, false),om.next.cascade_query((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(class_path__GT_query) : cljs.core.deref.call(null,class_path__GT_query)),cljs.core.pop(classpath__$1),path,clojure.zip.node(q_SINGLEQUOTE__15916),union_keys)], 0));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(class_path__GT_query,cljs.core.merge,cp__GT_q_SINGLEQUOTE__15918);
} else {
}

om$next$build_index_STAR_(class_SINGLEQUOTE__15908,query_SINGLEQUOTE__SINGLEQUOTE__15911,path_SINGLEQUOTE__15907,classpath__$1,query,cljs.core.conj.cljs$core$IFn$_invoke$arity$2(union_keys,prop));

var G__15919 = seq__15838;
var G__15920 = chunk__15839;
var G__15921 = count__15840;
var G__15922 = (i__15841 + (1));
seq__15838 = G__15919;
chunk__15839 = G__15920;
count__15840 = G__15921;
i__15841 = G__15922;
continue;
} else {
var temp__6503__auto__ = cljs.core.seq(seq__15838);
if(temp__6503__auto__){
var seq__15838__$1 = temp__6503__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__15838__$1)){
var c__7656__auto__ = cljs.core.chunk_first(seq__15838__$1);
var G__15923 = cljs.core.chunk_rest(seq__15838__$1);
var G__15924 = c__7656__auto__;
var G__15925 = cljs.core.count(c__7656__auto__);
var G__15926 = (0);
seq__15838 = G__15923;
chunk__15839 = G__15924;
count__15840 = G__15925;
i__15841 = G__15926;
continue;
} else {
var vec__15847 = cljs.core.first(seq__15838__$1);
var prop = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__15847,(0),null);
var query_SINGLEQUOTE_ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__15847,(1),null);
var path_SINGLEQUOTE__15927 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(path,prop);
var class_SINGLEQUOTE__15928 = cljs.core.cst$kw$component.cljs$core$IFn$_invoke$arity$1(cljs.core.meta(query_SINGLEQUOTE_));
var cs_15929 = cljs.core.filter.cljs$core$IFn$_invoke$arity$2(((function (seq__15838,chunk__15839,count__15840,i__15841,path_SINGLEQUOTE__15927,class_SINGLEQUOTE__15928,vec__15847,prop,query_SINGLEQUOTE_,seq__15838__$1,temp__6503__auto__,recursive_join_QMARK_,recursive_union_QMARK_,recursive_QMARK_,classpath__$1,dp__GT_cs,prop__GT_classes,class_path__GT_query,rootq,class$,___$1){
return (function (p1__15672_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(class_SINGLEQUOTE__15928,cljs.core.type(p1__15672_SHARP_));
});})(seq__15838,chunk__15839,count__15840,i__15841,path_SINGLEQUOTE__15927,class_SINGLEQUOTE__15928,vec__15847,prop,query_SINGLEQUOTE_,seq__15838__$1,temp__6503__auto__,recursive_join_QMARK_,recursive_union_QMARK_,recursive_QMARK_,classpath__$1,dp__GT_cs,prop__GT_classes,class_path__GT_query,rootq,class$,___$1))
,cljs.core.get.cljs$core$IFn$_invoke$arity$2(dp__GT_cs,path));
var cascade_query_QMARK__15930 = (function (){var and__6741__auto__ = class_SINGLEQUOTE__15928;
if(cljs.core.truth_(and__6741__auto__)){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.count(cs_15929),(1));
} else {
return and__6741__auto__;
}
})();
var query_SINGLEQUOTE__SINGLEQUOTE__15931 = (cljs.core.truth_(cascade_query_QMARK__15930)?om.next.get_query(cljs.core.first(cs_15929)):query_SINGLEQUOTE_);
if(cljs.core.truth_((function (){var and__6741__auto__ = cascade_query_QMARK__15930;
if(cljs.core.truth_(and__6741__auto__)){
return cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(query_SINGLEQUOTE_,query_SINGLEQUOTE__SINGLEQUOTE__15931);
} else {
return and__6741__auto__;
}
})())){
var qs_15932 = cljs.core.get.cljs$core$IFn$_invoke$arity$2((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(class_path__GT_query) : cljs.core.deref.call(null,class_path__GT_query)),classpath__$1);
var q_15933 = cljs.core.first(qs_15932);
var qnode_15934 = clojure.zip.node((function (){var G__15850 = q_15933;
if((class$__$1 == null)){
return om.next.query_template(G__15850,path);
} else {
return G__15850;
}
})());
var new_query_15935 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(qnode_15934,prop,query_SINGLEQUOTE__SINGLEQUOTE__15931);
var q_SINGLEQUOTE__15936 = (function (){var G__15851 = clojure.zip.replace(om.next.query_template(clojure.zip.root(q_15933),path),new_query_15935);
if((class$__$1 == null)){
return om.next.query_template(om.next.focus_query(clojure.zip.root(G__15851),cljs.core.pop(path)),cljs.core.pop(path));
} else {
return G__15851;
}
})();
var qs_SINGLEQUOTE__15937 = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentHashSet.fromArray([q_SINGLEQUOTE__15936], true),cljs.core.remove.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentHashSet.fromArray([q_15933], true)),qs_15932);
var cp__GT_q_SINGLEQUOTE__15938 = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.PersistentArrayMap.fromArray([classpath__$1,qs_SINGLEQUOTE__15937], true, false),om.next.cascade_query((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(class_path__GT_query) : cljs.core.deref.call(null,class_path__GT_query)),cljs.core.pop(classpath__$1),path,clojure.zip.node(q_SINGLEQUOTE__15936),union_keys)], 0));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(class_path__GT_query,cljs.core.merge,cp__GT_q_SINGLEQUOTE__15938);
} else {
}

om$next$build_index_STAR_(class_SINGLEQUOTE__15928,query_SINGLEQUOTE__SINGLEQUOTE__15931,path_SINGLEQUOTE__15927,classpath__$1,query,cljs.core.conj.cljs$core$IFn$_invoke$arity$2(union_keys,prop));

var G__15939 = cljs.core.next(seq__15838__$1);
var G__15940 = null;
var G__15941 = (0);
var G__15942 = (0);
seq__15838 = G__15939;
chunk__15839 = G__15940;
count__15840 = G__15941;
i__15841 = G__15942;
continue;
}
} else {
return null;
}
}
break;
}
} else {
return null;
}
}
} else {
return null;
}
});})(prop__GT_classes,class_path__GT_query,rootq,class$,___$1))
;
build_index_STAR_(class$,rootq,cljs.core.PersistentVector.EMPTY,cljs.core.PersistentVector.EMPTY,null,cljs.core.PersistentVector.EMPTY);

return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(self__.indexes,cljs.core.merge,new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$prop_DASH__GT_classes,(cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(prop__GT_classes) : cljs.core.deref.call(null,prop__GT_classes)),cljs.core.cst$kw$class_DASH_path_DASH__GT_query,(cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(class_path__GT_query) : cljs.core.deref.call(null,class_path__GT_query))], null));
});

om.next.Indexer.prototype.om$next$protocols$IIndexer$index_component_BANG_$arity$2 = (function (_,c){
var self__ = this;
var ___$1 = this;
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(self__.indexes,((function (___$1){
return (function (indexes__$1){
var indexes__$2 = cljs.core.update_in.cljs$core$IFn$_invoke$arity$4(cljs.core.cst$kw$index_DASH_component.cljs$core$IFn$_invoke$arity$1(self__.extfs).call(null,indexes__$1,c),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$class_DASH__GT_components,cljs.core.type(c)], null),cljs.core.fnil.cljs$core$IFn$_invoke$arity$2(cljs.core.conj,cljs.core.PersistentHashSet.EMPTY),c);
var data_path = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentVector.EMPTY,cljs.core.remove.cljs$core$IFn$_invoke$arity$1(cljs.core.number_QMARK_),om.next.path(c));
var indexes__$3 = cljs.core.update_in.cljs$core$IFn$_invoke$arity$4(cljs.core.cst$kw$index_DASH_component.cljs$core$IFn$_invoke$arity$1(self__.extfs).call(null,indexes__$2,c),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$data_DASH_path_DASH__GT_components,data_path], null),cljs.core.fnil.cljs$core$IFn$_invoke$arity$2(cljs.core.conj,cljs.core.PersistentHashSet.EMPTY),c);
var ident = ((((!((c == null)))?(((false) || (c.om$next$Ident$))?true:false):false))?(function (){var ident = om.next.ident(c,om.next.props(c));
var l__15215__auto___15943 = om.next._STAR_logger_STAR_;
if(om.util.ident_QMARK_(ident)){
} else {
var G__15853_15944 = l__15215__auto___15943;
var G__15854_15945 = [cljs.core.str("Invariant Violation"),cljs.core.str((((null == null))?null:[cljs.core.str(" (in function: `"),cljs.core.str(null),cljs.core.str("`)")].join(''))),cljs.core.str(": "),cljs.core.str([cljs.core.str("malformed Ident. An ident must be a vector of "),cljs.core.str("two elements (a keyword and an EDN value). Check "),cljs.core.str("the Ident implementation of component `"),cljs.core.str(c.constructor.displayName),cljs.core.str("`.")].join(''))].join('');
goog.log.error(G__15853_15944,G__15854_15945);
}

return ident;
})():null);
if(!((ident == null))){
var G__15855 = indexes__$3;
if(cljs.core.truth_(ident)){
return cljs.core.update_in.cljs$core$IFn$_invoke$arity$4(G__15855,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$ref_DASH__GT_components,ident], null),cljs.core.fnil.cljs$core$IFn$_invoke$arity$2(cljs.core.conj,cljs.core.PersistentHashSet.EMPTY),c);
} else {
return G__15855;
}
} else {
return indexes__$3;
}
});})(___$1))
);
});

om.next.Indexer.prototype.om$next$protocols$IIndexer$drop_component_BANG_$arity$2 = (function (_,c){
var self__ = this;
var ___$1 = this;
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(self__.indexes,((function (___$1){
return (function (indexes__$1){
var indexes__$2 = cljs.core.update_in.cljs$core$IFn$_invoke$arity$4(cljs.core.cst$kw$drop_DASH_component.cljs$core$IFn$_invoke$arity$1(self__.extfs).call(null,indexes__$1,c),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$class_DASH__GT_components,cljs.core.type(c)], null),cljs.core.disj,c);
var data_path = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentVector.EMPTY,cljs.core.remove.cljs$core$IFn$_invoke$arity$1(cljs.core.number_QMARK_),om.next.path(c));
var indexes__$3 = cljs.core.update_in.cljs$core$IFn$_invoke$arity$4(cljs.core.cst$kw$drop_DASH_component.cljs$core$IFn$_invoke$arity$1(self__.extfs).call(null,indexes__$2,c),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$data_DASH_path_DASH__GT_components,data_path], null),cljs.core.disj,c);
var ident = ((((!((c == null)))?(((false) || (c.om$next$Ident$))?true:false):false))?om.next.ident(c,om.next.props(c)):null);
if(!((ident == null))){
var G__15857 = indexes__$3;
if(cljs.core.truth_(ident)){
return cljs.core.update_in.cljs$core$IFn$_invoke$arity$4(G__15857,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$ref_DASH__GT_components,ident], null),cljs.core.disj,c);
} else {
return G__15857;
}
} else {
return indexes__$3;
}
});})(___$1))
);
});

om.next.Indexer.prototype.om$next$protocols$IIndexer$key__GT_components$arity$2 = (function (_,k){
var self__ = this;
var ___$1 = this;
var indexes__$1 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(self__.indexes) : cljs.core.deref.call(null,self__.indexes));
if(om.next.component_QMARK_(k)){
return cljs.core.PersistentHashSet.fromArray([k], true);
} else {
var temp__6501__auto__ = cljs.core.cst$kw$ref_DASH__GT_components.cljs$core$IFn$_invoke$arity$1(self__.extfs).call(null,indexes__$1,k);
if(cljs.core.truth_(temp__6501__auto__)){
var cs = temp__6501__auto__;
return cs;
} else {
var cs = cljs.core.get_in.cljs$core$IFn$_invoke$arity$3(indexes__$1,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$ref_DASH__GT_components,k], null),cljs.core.cst$kw$om$next_SLASH_not_DASH_found);
if(!(cljs.core.keyword_identical_QMARK_(cljs.core.cst$kw$om$next_SLASH_not_DASH_found,cs))){
return cs;
} else {
if((k instanceof cljs.core.Keyword)){
var cs__$1 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(indexes__$1,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$prop_DASH__GT_classes,k], null));
return cljs.core.transduce.cljs$core$IFn$_invoke$arity$4(cljs.core.map.cljs$core$IFn$_invoke$arity$1(((function (cs__$1,cs,temp__6501__auto__,indexes__$1,___$1){
return (function (p1__15673_SHARP_){
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(indexes__$1,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$class_DASH__GT_components,p1__15673_SHARP_], null));
});})(cs__$1,cs,temp__6501__auto__,indexes__$1,___$1))
),cljs.core.completing.cljs$core$IFn$_invoke$arity$1(cljs.core.into),cljs.core.PersistentHashSet.EMPTY,cs__$1);
} else {
return cljs.core.PersistentHashSet.EMPTY;
}
}
}
}
});

om.next.Indexer.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__7423__auto__,k__7424__auto__){
var self__ = this;
var this__7423__auto____$1 = this;
return cljs.core._lookup.cljs$core$IFn$_invoke$arity$3(this__7423__auto____$1,k__7424__auto__,null);
});

om.next.Indexer.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__7425__auto__,k15675,else__7426__auto__){
var self__ = this;
var this__7425__auto____$1 = this;
var G__15858 = (((k15675 instanceof cljs.core.Keyword))?k15675.fqn:null);
switch (G__15858) {
case "indexes":
return self__.indexes;

break;
case "extfs":
return self__.extfs;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k15675,else__7426__auto__);

}
});

om.next.Indexer.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__7437__auto__,writer__7438__auto__,opts__7439__auto__){
var self__ = this;
var this__7437__auto____$1 = this;
var pr_pair__7440__auto__ = ((function (this__7437__auto____$1){
return (function (keyval__7441__auto__){
return cljs.core.pr_sequential_writer(writer__7438__auto__,cljs.core.pr_writer,""," ","",opts__7439__auto__,keyval__7441__auto__);
});})(this__7437__auto____$1))
;
return cljs.core.pr_sequential_writer(writer__7438__auto__,pr_pair__7440__auto__,"#om.next.Indexer{",", ","}",opts__7439__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[cljs.core.cst$kw$indexes,self__.indexes],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[cljs.core.cst$kw$extfs,self__.extfs],null))], null),self__.__extmap));
});


om.next.Indexer.prototype.cljs$core$IIterable$ = true;

om.next.Indexer.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__15674){
var self__ = this;
var G__15674__$1 = this;
return (new cljs.core.RecordIter((0),G__15674__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$indexes,cljs.core.cst$kw$extfs], null),cljs.core._iterator(self__.__extmap)));
});

om.next.Indexer.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__7421__auto__){
var self__ = this;
var this__7421__auto____$1 = this;
return self__.__meta;
});

om.next.Indexer.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__7417__auto__){
var self__ = this;
var this__7417__auto____$1 = this;
return (new om.next.Indexer(self__.indexes,self__.extfs,self__.__meta,self__.__extmap,self__.__hash));
});

om.next.Indexer.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__7427__auto__){
var self__ = this;
var this__7427__auto____$1 = this;
return (2 + cljs.core.count(self__.__extmap));
});

om.next.Indexer.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__7418__auto__){
var self__ = this;
var this__7418__auto____$1 = this;
var h__7190__auto__ = self__.__hash;
if(!((h__7190__auto__ == null))){
return h__7190__auto__;
} else {
var h__7190__auto____$1 = cljs.core.hash_imap(this__7418__auto____$1);
self__.__hash = h__7190__auto____$1;

return h__7190__auto____$1;
}
});

om.next.Indexer.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this__7419__auto__,other__7420__auto__){
var self__ = this;
var this__7419__auto____$1 = this;
if(cljs.core.truth_((function (){var and__6741__auto__ = other__7420__auto__;
if(cljs.core.truth_(and__6741__auto__)){
var and__6741__auto____$1 = (this__7419__auto____$1.constructor === other__7420__auto__.constructor);
if(and__6741__auto____$1){
return cljs.core.equiv_map(this__7419__auto____$1,other__7420__auto__);
} else {
return and__6741__auto____$1;
}
} else {
return and__6741__auto__;
}
})())){
return true;
} else {
return false;
}
});

om.next.Indexer.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__7432__auto__,k__7433__auto__){
var self__ = this;
var this__7432__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$extfs,null,cljs.core.cst$kw$indexes,null], null), null),k__7433__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core.with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__7432__auto____$1),self__.__meta),k__7433__auto__);
} else {
return (new om.next.Indexer(self__.indexes,self__.extfs,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__7433__auto__)),null));
}
});

om.next.Indexer.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__7430__auto__,k__7431__auto__,G__15674){
var self__ = this;
var this__7430__auto____$1 = this;
var pred__15859 = cljs.core.keyword_identical_QMARK_;
var expr__15860 = k__7431__auto__;
if(cljs.core.truth_((pred__15859.cljs$core$IFn$_invoke$arity$2 ? pred__15859.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$indexes,expr__15860) : pred__15859.call(null,cljs.core.cst$kw$indexes,expr__15860)))){
return (new om.next.Indexer(G__15674,self__.extfs,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__15859.cljs$core$IFn$_invoke$arity$2 ? pred__15859.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$extfs,expr__15860) : pred__15859.call(null,cljs.core.cst$kw$extfs,expr__15860)))){
return (new om.next.Indexer(self__.indexes,G__15674,self__.__meta,self__.__extmap,null));
} else {
return (new om.next.Indexer(self__.indexes,self__.extfs,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__7431__auto__,G__15674),null));
}
}
});

om.next.Indexer.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__7435__auto__){
var self__ = this;
var this__7435__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[cljs.core.cst$kw$indexes,self__.indexes],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[cljs.core.cst$kw$extfs,self__.extfs],null))], null),self__.__extmap));
});

om.next.Indexer.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__7422__auto__,G__15674){
var self__ = this;
var this__7422__auto____$1 = this;
return (new om.next.Indexer(self__.indexes,self__.extfs,G__15674,self__.__extmap,self__.__hash));
});

om.next.Indexer.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__7428__auto__,entry__7429__auto__){
var self__ = this;
var this__7428__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__7429__auto__)){
return cljs.core._assoc(this__7428__auto____$1,cljs.core._nth.cljs$core$IFn$_invoke$arity$2(entry__7429__auto__,(0)),cljs.core._nth.cljs$core$IFn$_invoke$arity$2(entry__7429__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__7428__auto____$1,entry__7429__auto__);
}
});

om.next.Indexer.prototype.cljs$core$IDeref$_deref$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(self__.indexes) : cljs.core.deref.call(null,self__.indexes));
});

om.next.Indexer.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$sym$indexes,cljs.core.cst$sym$extfs], null);
});

om.next.Indexer.cljs$lang$type = true;

om.next.Indexer.cljs$lang$ctorPrSeq = (function (this__7459__auto__){
return cljs.core._conj(cljs.core.List.EMPTY,"om.next/Indexer");
});

om.next.Indexer.cljs$lang$ctorPrWriter = (function (this__7459__auto__,writer__7460__auto__){
return cljs.core._write(writer__7460__auto__,"om.next/Indexer");
});

om.next.__GT_Indexer = (function om$next$__GT_Indexer(indexes,extfs){
return (new om.next.Indexer(indexes,extfs,null,null,null));
});

om.next.map__GT_Indexer = (function om$next$map__GT_Indexer(G__15676){
return (new om.next.Indexer(cljs.core.cst$kw$indexes.cljs$core$IFn$_invoke$arity$1(G__15676),cljs.core.cst$kw$extfs.cljs$core$IFn$_invoke$arity$1(G__15676),null,cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__15676,cljs.core.cst$kw$indexes,cljs.core.array_seq([cljs.core.cst$kw$extfs], 0)),null));
});

/**
 * Given a function (Component -> Ref), return an indexer.
 */
om.next.indexer = (function om$next$indexer(var_args){
var args15947 = [];
var len__7936__auto___15951 = arguments.length;
var i__7937__auto___15952 = (0);
while(true){
if((i__7937__auto___15952 < len__7936__auto___15951)){
args15947.push((arguments[i__7937__auto___15952]));

var G__15953 = (i__7937__auto___15952 + (1));
i__7937__auto___15952 = G__15953;
continue;
} else {
}
break;
}

var G__15949 = args15947.length;
switch (G__15949) {
case 0:
return om.next.indexer.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return om.next.indexer.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args15947.length)].join('')));

}
});

om.next.indexer.cljs$core$IFn$_invoke$arity$0 = (function (){
return om.next.indexer.cljs$core$IFn$_invoke$arity$1(new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$index_DASH_component,(function (indexes,component){
return indexes;
}),cljs.core.cst$kw$drop_DASH_component,(function (indexes,component){
return indexes;
}),cljs.core.cst$kw$ref_DASH__GT_components,(function (indexes,ref){
return null;
})], null));
});

om.next.indexer.cljs$core$IFn$_invoke$arity$1 = (function (extfs){
return (new om.next.Indexer((function (){var G__15950 = new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$class_DASH__GT_components,cljs.core.PersistentArrayMap.EMPTY,cljs.core.cst$kw$data_DASH_path_DASH__GT_components,cljs.core.PersistentArrayMap.EMPTY,cljs.core.cst$kw$ref_DASH__GT_components,cljs.core.PersistentArrayMap.EMPTY], null);
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__15950) : cljs.core.atom.call(null,G__15950));
})(),extfs,null,null,null));
});

om.next.indexer.cljs$lang$maxFixedArity = 1;

/**
 * PRIVATE: Get the indexer associated with the reconciler.
 */
om.next.get_indexer = (function om$next$get_indexer(reconciler){
if(cljs.core.truth_((om.next.reconciler_QMARK_.cljs$core$IFn$_invoke$arity$1 ? om.next.reconciler_QMARK_.cljs$core$IFn$_invoke$arity$1(reconciler) : om.next.reconciler_QMARK_.call(null,reconciler)))){
} else {
throw (new Error("Assert failed: (reconciler? reconciler)"));
}

return cljs.core.cst$kw$indexer.cljs$core$IFn$_invoke$arity$1(cljs.core.cst$kw$config.cljs$core$IFn$_invoke$arity$1(reconciler));
});
/**
 * Return all components for a given ref.
 */
om.next.ref__GT_components = (function om$next$ref__GT_components(x,ref){
if((ref == null)){
return null;
} else {
var indexer = (cljs.core.truth_((om.next.reconciler_QMARK_.cljs$core$IFn$_invoke$arity$1 ? om.next.reconciler_QMARK_.cljs$core$IFn$_invoke$arity$1(x) : om.next.reconciler_QMARK_.call(null,x)))?om.next.get_indexer(x):x);
return om.next.protocols.key__GT_components(indexer,ref);
}
});
/**
 * Get any component from the indexer that matches the ref.
 */
om.next.ref__GT_any = (function om$next$ref__GT_any(x,ref){
var indexer = (cljs.core.truth_((om.next.reconciler_QMARK_.cljs$core$IFn$_invoke$arity$1 ? om.next.reconciler_QMARK_.cljs$core$IFn$_invoke$arity$1(x) : om.next.reconciler_QMARK_.call(null,x)))?om.next.get_indexer(x):x);
return cljs.core.first(om.next.protocols.key__GT_components(indexer,ref));
});
/**
 * Get any component from the indexer that matches the component class.
 */
om.next.class__GT_any = (function om$next$class__GT_any(x,class$){
var indexer = (cljs.core.truth_((om.next.reconciler_QMARK_.cljs$core$IFn$_invoke$arity$1 ? om.next.reconciler_QMARK_.cljs$core$IFn$_invoke$arity$1(x) : om.next.reconciler_QMARK_.call(null,x)))?om.next.get_indexer(x):x);
return cljs.core.first(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(indexer) : cljs.core.deref.call(null,indexer)),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$class_DASH__GT_components,class$], null)));
});
/**
 * Given x (a reconciler or indexer) and y (a component or component class
 * path), return the queries for that path.
 */
om.next.class_path__GT_queries = (function om$next$class_path__GT_queries(x,y){
var indexer = (cljs.core.truth_((om.next.reconciler_QMARK_.cljs$core$IFn$_invoke$arity$1 ? om.next.reconciler_QMARK_.cljs$core$IFn$_invoke$arity$1(x) : om.next.reconciler_QMARK_.call(null,x)))?om.next.get_indexer(x):x);
var cp = ((om.next.component_QMARK_(y))?om.next.class_path(y):y);
return cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentHashSet.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1(clojure.zip.root),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(indexer) : cljs.core.deref.call(null,indexer)),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$class_DASH_path_DASH__GT_query,cp], null)));
});
/**
 * Returns the absolute query for a given component, not relative like
 * om.next/get-query.
 */
om.next.full_query = (function om$next$full_query(var_args){
var args15956 = [];
var len__7936__auto___15962 = arguments.length;
var i__7937__auto___15963 = (0);
while(true){
if((i__7937__auto___15963 < len__7936__auto___15962)){
args15956.push((arguments[i__7937__auto___15963]));

var G__15964 = (i__7937__auto___15963 + (1));
i__7937__auto___15963 = G__15964;
continue;
} else {
}
break;
}

var G__15958 = args15956.length;
switch (G__15958) {
case 1:
return om.next.full_query.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return om.next.full_query.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args15956.length)].join('')));

}
});

om.next.full_query.cljs$core$IFn$_invoke$arity$1 = (function (component){
if(om.next.iquery_QMARK_(component)){
if((om.next.path(component) == null)){
return om.next.replace(cljs.core.first(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2((function (){var G__15959 = om.next.get_indexer(om.next.get_reconciler(component));
return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(G__15959) : cljs.core.deref.call(null,G__15959));
})(),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$class_DASH_path_DASH__GT_query,om.next.class_path(component)], null))),om.next.get_query(component));
} else {
return om.next.full_query.cljs$core$IFn$_invoke$arity$2(component,om.next.get_query(component));
}
} else {
return null;
}
});

om.next.full_query.cljs$core$IFn$_invoke$arity$2 = (function (component,query){
if(om.next.iquery_QMARK_(component)){
var xf = (function (){var G__15960 = cljs.core.remove.cljs$core$IFn$_invoke$arity$1(cljs.core.number_QMARK_);
if(om.next.recursive_class_path_QMARK_(component)){
return cljs.core.comp.cljs$core$IFn$_invoke$arity$2(cljs.core.distinct.cljs$core$IFn$_invoke$arity$0(),G__15960);
} else {
return G__15960;
}
})();
var path_SINGLEQUOTE_ = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentVector.EMPTY,xf,om.next.path(component));
var cp = om.next.class_path(component);
var qs = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2((function (){var G__15961 = om.next.get_indexer(om.next.get_reconciler(component));
return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(G__15961) : cljs.core.deref.call(null,G__15961));
})(),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$class_DASH_path_DASH__GT_query,cp], null));
if(!(cljs.core.empty_QMARK_(qs))){
var q = cljs.core.first(cljs.core.filter.cljs$core$IFn$_invoke$arity$2(((function (xf,path_SINGLEQUOTE_,cp,qs){
return (function (p1__15955_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(path_SINGLEQUOTE_,om.next.focus__GT_path.cljs$core$IFn$_invoke$arity$2(clojure.zip.root(p1__15955_SHARP_),path_SINGLEQUOTE_));
});})(xf,path_SINGLEQUOTE_,cp,qs))
,qs));
if(!((q == null))){
return om.next.replace(q,query);
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2([cljs.core.str("No queries exist for component path "),cljs.core.str(cp),cljs.core.str(" or data path "),cljs.core.str(path_SINGLEQUOTE_)].join(''),new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$type,cljs.core.cst$kw$om$next_SLASH_no_DASH_queries], null));
}
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2([cljs.core.str("No queries exist for component path "),cljs.core.str(cp)].join(''),new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$type,cljs.core.cst$kw$om$next_SLASH_no_DASH_queries], null));
}
} else {
return null;
}
});

om.next.full_query.cljs$lang$maxFixedArity = 2;

om.next.normalize_STAR_ = (function om$next$normalize_STAR_(query,data,refs,union_seen){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$sym$_STAR_], null),query)){
return data;
} else {
if(cljs.core.map_QMARK_(query)){
var class$ = cljs.core.cst$kw$component.cljs$core$IFn$_invoke$arity$1(cljs.core.meta(query));
var ident = ((((!((class$ == null)))?(((false) || (class$.om$next$Ident$))?true:false):false))?om.next.ident(class$,data):null);
if(!((ident == null))){
return cljs.core.vary_meta.cljs$core$IFn$_invoke$arity$4(om$next$normalize_STAR_(cljs.core.get.cljs$core$IFn$_invoke$arity$2(query,cljs.core.first(ident)),data,refs,union_seen),cljs.core.assoc,cljs.core.cst$kw$om_SLASH_tag,cljs.core.first(ident));
} else {
throw (new Error("Union components must implement Ident"));
}
} else {
if(cljs.core.vector_QMARK_(data)){
return data;
} else {
var q = cljs.core.seq(query);
var ret = data;
while(true){
if(!((q == null))){
var expr = cljs.core.first(q);
if(cljs.core.truth_(om.util.join_QMARK_(expr))){
var vec__15985 = om.util.join_entry(expr);
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__15985,(0),null);
var sel = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__15985,(1),null);
var recursive_QMARK_ = om.util.recursion_QMARK_(sel);
var union_entry = ((om.util.union_QMARK_(expr))?sel:union_seen);
var sel__$1 = ((recursive_QMARK_)?((!((union_seen == null)))?union_seen:query):sel);
var class$ = cljs.core.cst$kw$component.cljs$core$IFn$_invoke$arity$1(cljs.core.meta(sel__$1));
var v = cljs.core.get.cljs$core$IFn$_invoke$arity$2(data,k);
if((recursive_QMARK_) && (om.util.ident_QMARK_(v))){
var G__15996 = cljs.core.next(q);
var G__15997 = ret;
q = G__15996;
ret = G__15997;
continue;
} else {
if(cljs.core.map_QMARK_(v)){
var x = om$next$normalize_STAR_(sel__$1,v,refs,union_entry);
if(!(((class$ == null)) || (!(((!((class$ == null)))?(((false) || (class$.om$next$Ident$))?true:false):false))))){
var i = om.next.ident(class$,v);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(refs,cljs.core.update_in,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.first(i),cljs.core.second(i)], null),cljs.core.merge,cljs.core.array_seq([x], 0));

var G__15998 = cljs.core.next(q);
var G__15999 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(ret,k,i);
q = G__15998;
ret = G__15999;
continue;
} else {
var G__16000 = cljs.core.next(q);
var G__16001 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(ret,k,x);
q = G__16000;
ret = G__16001;
continue;
}
} else {
if(cljs.core.vector_QMARK_(v)){
var xs = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentVector.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1(((function (q,ret,vec__15985,k,sel,recursive_QMARK_,union_entry,sel__$1,class$,v,expr){
return (function (p1__15966_SHARP_){
return om$next$normalize_STAR_(sel__$1,p1__15966_SHARP_,refs,union_entry);
});})(q,ret,vec__15985,k,sel,recursive_QMARK_,union_entry,sel__$1,class$,v,expr))
),v);
if(!(((class$ == null)) || (!(((!((class$ == null)))?(((false) || (class$.om$next$Ident$))?true:false):false))))){
var is = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentVector.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1(((function (q,ret,xs,vec__15985,k,sel,recursive_QMARK_,union_entry,sel__$1,class$,v,expr){
return (function (p1__15967_SHARP_){
return om.next.ident(class$,p1__15967_SHARP_);
});})(q,ret,xs,vec__15985,k,sel,recursive_QMARK_,union_entry,sel__$1,class$,v,expr))
),xs);
if(cljs.core.vector_QMARK_(sel__$1)){
if(cljs.core.empty_QMARK_(is)){
} else {
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(refs,cljs.core.update_in,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.ffirst(is)], null),((function (q,ret,is,xs,vec__15985,k,sel,recursive_QMARK_,union_entry,sel__$1,class$,v,expr){
return (function (ys){
return cljs.core.merge_with.cljs$core$IFn$_invoke$arity$variadic(cljs.core.merge,cljs.core.array_seq([ys,cljs.core.zipmap(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.second,is),xs)], 0));
});})(q,ret,is,xs,vec__15985,k,sel,recursive_QMARK_,union_entry,sel__$1,class$,v,expr))
);
}
} else {
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(refs,((function (q,ret,is,xs,vec__15985,k,sel,recursive_QMARK_,union_entry,sel__$1,class$,v,expr){
return (function (refs_SINGLEQUOTE_){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(((function (q,ret,is,xs,vec__15985,k,sel,recursive_QMARK_,union_entry,sel__$1,class$,v,expr){
return (function (ret__$1,p__15992){
var vec__15993 = p__15992;
var i = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__15993,(0),null);
var x = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__15993,(1),null);
return cljs.core.update_in.cljs$core$IFn$_invoke$arity$4(ret__$1,i,cljs.core.merge,x);
});})(q,ret,is,xs,vec__15985,k,sel,recursive_QMARK_,union_entry,sel__$1,class$,v,expr))
,refs_SINGLEQUOTE_,cljs.core.map.cljs$core$IFn$_invoke$arity$3(cljs.core.vector,is,xs));
});})(q,ret,is,xs,vec__15985,k,sel,recursive_QMARK_,union_entry,sel__$1,class$,v,expr))
);
}

var G__16002 = cljs.core.next(q);
var G__16003 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(ret,k,is);
q = G__16002;
ret = G__16003;
continue;
} else {
var G__16004 = cljs.core.next(q);
var G__16005 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(ret,k,xs);
q = G__16004;
ret = G__16005;
continue;
}
} else {
if((v == null)){
var G__16006 = cljs.core.next(q);
var G__16007 = ret;
q = G__16006;
ret = G__16007;
continue;
} else {
var G__16008 = cljs.core.next(q);
var G__16009 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(ret,k,v);
q = G__16008;
ret = G__16009;
continue;

}
}
}
}
} else {
var k = ((cljs.core.seq_QMARK_(expr))?cljs.core.first(expr):expr);
var v = cljs.core.get.cljs$core$IFn$_invoke$arity$2(data,k);
if((v == null)){
var G__16010 = cljs.core.next(q);
var G__16011 = ret;
q = G__16010;
ret = G__16011;
continue;
} else {
var G__16012 = cljs.core.next(q);
var G__16013 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(ret,k,v);
q = G__16012;
ret = G__16013;
continue;
}
}
} else {
return ret;
}
break;
}

}
}
}
});
/**
 * Given a Om component class or instance and a tree of data, use the component's
 * query to transform the tree into the default database format. All nodes that
 * can be mapped via Ident implementations wil be replaced with ident links. The
 * original node data will be moved into tables indexed by ident. If merge-idents
 * option is true, will return these tables in the result instead of as metadata.
 */
om.next.tree__GT_db = (function om$next$tree__GT_db(var_args){
var args16014 = [];
var len__7936__auto___16018 = arguments.length;
var i__7937__auto___16019 = (0);
while(true){
if((i__7937__auto___16019 < len__7936__auto___16018)){
args16014.push((arguments[i__7937__auto___16019]));

var G__16020 = (i__7937__auto___16019 + (1));
i__7937__auto___16019 = G__16020;
continue;
} else {
}
break;
}

var G__16016 = args16014.length;
switch (G__16016) {
case 2:
return om.next.tree__GT_db.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return om.next.tree__GT_db.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args16014.length)].join('')));

}
});

om.next.tree__GT_db.cljs$core$IFn$_invoke$arity$2 = (function (x,data){
return om.next.tree__GT_db.cljs$core$IFn$_invoke$arity$3(x,data,false);
});

om.next.tree__GT_db.cljs$core$IFn$_invoke$arity$3 = (function (x,data,merge_idents){
var refs = (function (){var G__16017 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__16017) : cljs.core.atom.call(null,G__16017));
})();
var x__$1 = ((cljs.core.vector_QMARK_(x))?x:om.next.get_query(x));
var ret = om.next.normalize_STAR_(x__$1,data,refs,null);
if(merge_idents){
var refs_SINGLEQUOTE_ = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(refs) : cljs.core.deref.call(null,refs));
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([ret,refs_SINGLEQUOTE_], 0)),cljs.core.cst$kw$om$next_SLASH_tables,cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentHashSet.EMPTY,cljs.core.keys(refs_SINGLEQUOTE_)));
} else {
return cljs.core.with_meta(ret,(cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(refs) : cljs.core.deref.call(null,refs)));
}
});

om.next.tree__GT_db.cljs$lang$maxFixedArity = 3;

om.next.sift_idents = (function om$next$sift_idents(res){
var map__16025 = cljs.core.group_by((function (p1__16022_SHARP_){
return cljs.core.vector_QMARK_(cljs.core.first(p1__16022_SHARP_));
}),res);
var map__16025__$1 = ((((!((map__16025 == null)))?((((map__16025.cljs$lang$protocol_mask$partition0$ & (64))) || (map__16025.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__16025):map__16025);
var idents = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16025__$1,true);
var rest = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16025__$1,false);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,idents),cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,rest)], null);
});
/**
 * Changes a join on key k with depth limit from [:a {:k n}] to [:a {:k (dec n)}]
 */
om.next.reduce_query_depth = (function om$next$reduce_query_depth(q,k){
if(!(cljs.core.empty_QMARK_(om.next.focus_query(q,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [k], null))))){
var pos = om.next.query_template(q,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [k], null));
var node = clojure.zip.node(pos);
var node_SINGLEQUOTE_ = (function (){var G__16028 = node;
if(typeof node === 'number'){
return (G__16028 - (1));
} else {
return G__16028;
}
})();
return om.next.replace(pos,node_SINGLEQUOTE_);
} else {
return q;
}
});
/**
 * Given a union expression decrement each of the query roots by one if it
 * is recursive.
 */
om.next.reduce_union_recursion_depth = (function om$next$reduce_union_recursion_depth(union_expr,recursion_key){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p__16033){
var vec__16034 = p__16033;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16034,(0),null);
var q = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16034,(1),null);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,om.next.reduce_query_depth(q,recursion_key)], null);
}),union_expr));
});
om.next.mappable_ident_QMARK_ = (function om$next$mappable_ident_QMARK_(refs,ident){
return (om.util.ident_QMARK_(ident)) && (cljs.core.contains_QMARK_(refs,cljs.core.first(ident)));
});
/**
 * Denormalize a data based on query. refs is a data structure which maps idents
 * to their values. map-ident is a function taking a ident to another ident,
 * used during tempid transition. idents-seen is the set of idents encountered,
 * used to limit recursion. union-expr is the current union expression being
 * evaluated. recurse-key is key representing the current recursive query being
 * evaluted.
 */
om.next.denormalize_STAR_ = (function om$next$denormalize_STAR_(query,data,refs,map_ident,idents_seen,union_expr,recurse_key){
var union_recur_QMARK_ = (function (){var and__6741__auto__ = union_expr;
if(cljs.core.truth_(and__6741__auto__)){
return recurse_key;
} else {
return and__6741__auto__;
}
})();
var recur_ident = (cljs.core.truth_(union_recur_QMARK_)?data:null);
var data__$1 = (function (){var data__$1 = data;
while(true){
if(cljs.core.truth_(om.next.mappable_ident_QMARK_(refs,data__$1))){
var G__16091 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(refs,(map_ident.cljs$core$IFn$_invoke$arity$1 ? map_ident.cljs$core$IFn$_invoke$arity$1(data__$1) : map_ident.call(null,data__$1)));
data__$1 = G__16091;
continue;
} else {
return data__$1;
}
break;
}
})();
if(cljs.core.vector_QMARK_(data__$1)){
var step = ((function (union_recur_QMARK_,recur_ident,data__$1){
return (function (ident){
if(cljs.core.not(om.next.mappable_ident_QMARK_(refs,ident))){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(query,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$sym$_STAR_], null))){
return ident;
} else {
var map__16069 = cljs.core.group_by(om.util.join_QMARK_,query);
var map__16069__$1 = ((((!((map__16069 == null)))?((((map__16069.cljs$lang$protocol_mask$partition0$ & (64))) || (map__16069.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__16069):map__16069);
var props = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16069__$1,false);
var joins = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16069__$1,true);
var props__$1 = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(((function (map__16069,map__16069__$1,props,joins,union_recur_QMARK_,recur_ident,data__$1){
return (function (p1__16037_SHARP_){
var G__16071 = p1__16037_SHARP_;
if(cljs.core.seq_QMARK_(p1__16037_SHARP_)){
return cljs.core.first(G__16071);
} else {
return G__16071;
}
});})(map__16069,map__16069__$1,props,joins,union_recur_QMARK_,recur_ident,data__$1))
,props);
var joins__$1 = cljs.core.seq(joins);
var ret = cljs.core.PersistentArrayMap.EMPTY;
while(true){
if(!((joins__$1 == null))){
var join = cljs.core.first(joins__$1);
var vec__16072 = om.util.join_entry(join);
var key = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16072,(0),null);
var sel = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16072,(1),null);
var v = cljs.core.get.cljs$core$IFn$_invoke$arity$2(ident,key);
var G__16092 = cljs.core.next(joins__$1);
var G__16093 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(ret,key,om$next$denormalize_STAR_(sel,v,refs,map_ident,idents_seen,union_expr,recurse_key));
joins__$1 = G__16092;
ret = G__16093;
continue;
} else {
return cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.select_keys(ident,props__$1),ret], 0));
}
break;
}
}
} else {
var ident_SINGLEQUOTE_ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(refs,(map_ident.cljs$core$IFn$_invoke$arity$1 ? map_ident.cljs$core$IFn$_invoke$arity$1(ident) : map_ident.call(null,ident)));
var query__$1 = (function (){var G__16075 = query;
if(cljs.core.truth_(union_recur_QMARK_)){
return om.next.reduce_union_recursion_depth(G__16075,recurse_key);
} else {
return G__16075;
}
})();
var union_seen_SINGLEQUOTE_ = (function (){var G__16076 = union_expr;
if(cljs.core.truth_(union_recur_QMARK_)){
return om.next.reduce_union_recursion_depth(G__16076,recurse_key);
} else {
return G__16076;
}
})();
var query_SINGLEQUOTE_ = (function (){var G__16077 = query__$1;
if(cljs.core.map_QMARK_(query__$1)){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(G__16077,cljs.core.first(ident));
} else {
return G__16077;
}
})();
return om$next$denormalize_STAR_(query_SINGLEQUOTE_,ident_SINGLEQUOTE_,refs,map_ident,idents_seen,union_seen_SINGLEQUOTE_,null);
}
});})(union_recur_QMARK_,recur_ident,data__$1))
;
return cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentVector.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1(step),data__$1);
} else {
if(cljs.core.truth_((function (){var and__6741__auto__ = cljs.core.map_QMARK_(query);
if(and__6741__auto__){
return union_recur_QMARK_;
} else {
return and__6741__auto__;
}
})())){
return om$next$denormalize_STAR_(cljs.core.get.cljs$core$IFn$_invoke$arity$2(query,cljs.core.first(recur_ident)),data__$1,refs,map_ident,idents_seen,union_expr,recurse_key);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$sym$_STAR_], null),query)){
return data__$1;
} else {
var map__16078 = cljs.core.group_by(((function (union_recur_QMARK_,recur_ident,data__$1){
return (function (p1__16038_SHARP_){
var or__6753__auto__ = om.util.join_QMARK_(p1__16038_SHARP_);
if(cljs.core.truth_(or__6753__auto__)){
return or__6753__auto__;
} else {
return (om.util.ident_QMARK_(p1__16038_SHARP_)) || ((cljs.core.seq_QMARK_(p1__16038_SHARP_)) && (om.util.ident_QMARK_(cljs.core.first(p1__16038_SHARP_))));
}
});})(union_recur_QMARK_,recur_ident,data__$1))
,query);
var map__16078__$1 = ((((!((map__16078 == null)))?((((map__16078.cljs$lang$protocol_mask$partition0$ & (64))) || (map__16078.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__16078):map__16078);
var props = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16078__$1,false);
var joins = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16078__$1,true);
var props__$1 = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(((function (map__16078,map__16078__$1,props,joins,union_recur_QMARK_,recur_ident,data__$1){
return (function (p1__16039_SHARP_){
var G__16080 = p1__16039_SHARP_;
if(cljs.core.seq_QMARK_(p1__16039_SHARP_)){
return cljs.core.first(G__16080);
} else {
return G__16080;
}
});})(map__16078,map__16078__$1,props,joins,union_recur_QMARK_,recur_ident,data__$1))
,props);
var joins__$1 = cljs.core.seq(joins);
var ret = cljs.core.PersistentArrayMap.EMPTY;
while(true){
if(!((joins__$1 == null))){
var join = cljs.core.first(joins__$1);
var join__$1 = (function (){var G__16084 = join;
if(cljs.core.seq_QMARK_(join)){
return cljs.core.first(G__16084);
} else {
return G__16084;
}
})();
var join__$2 = (function (){var G__16085 = join__$1;
if(om.util.ident_QMARK_(join__$1)){
return cljs.core.PersistentHashMap.fromArrays([G__16085],[new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$sym$_STAR_], null)]);
} else {
return G__16085;
}
})();
var vec__16081 = om.util.join_entry(join__$2);
var key = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16081,(0),null);
var sel = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16081,(1),null);
var recurse_QMARK_ = om.util.recursion_QMARK_(sel);
var recurse_key__$1 = ((recurse_QMARK_)?key:null);
var v = ((om.util.ident_QMARK_(key))?((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$sym$_,cljs.core.second(key)))?cljs.core.get.cljs$core$IFn$_invoke$arity$2(refs,cljs.core.first(key)):cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(refs,(map_ident.cljs$core$IFn$_invoke$arity$1 ? map_ident.cljs$core$IFn$_invoke$arity$1(key) : map_ident.call(null,key)))):cljs.core.get.cljs$core$IFn$_invoke$arity$2(data__$1,key));
var key__$1 = (function (){var G__16086 = key;
if(om.util.unique_ident_QMARK_(key)){
return cljs.core.first(G__16086);
} else {
return G__16086;
}
})();
var v__$1 = (cljs.core.truth_(om.next.mappable_ident_QMARK_(refs,v))?(function (){var v__$1 = v;
while(true){
var next = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(refs,(map_ident.cljs$core$IFn$_invoke$arity$1 ? map_ident.cljs$core$IFn$_invoke$arity$1(v__$1) : map_ident.call(null,v__$1)));
if(cljs.core.truth_(om.next.mappable_ident_QMARK_(refs,next))){
var G__16094 = next;
v__$1 = G__16094;
continue;
} else {
return (map_ident.cljs$core$IFn$_invoke$arity$1 ? map_ident.cljs$core$IFn$_invoke$arity$1(v__$1) : map_ident.call(null,v__$1));
}
break;
}
})():v);
var limit = ((typeof sel === 'number')?sel:cljs.core.cst$kw$none);
var union_entry = ((om.util.union_QMARK_(join__$2))?sel:((recurse_QMARK_)?union_expr:null));
var sel__$1 = ((recurse_QMARK_)?((!((union_expr == null)))?union_entry:om.next.reduce_query_depth(query,key__$1)):(cljs.core.truth_((function (){var and__6741__auto__ = om.next.mappable_ident_QMARK_(refs,v__$1);
if(cljs.core.truth_(and__6741__auto__)){
return om.util.union_QMARK_(join__$2);
} else {
return and__6741__auto__;
}
})())?cljs.core.get.cljs$core$IFn$_invoke$arity$2(sel,cljs.core.first(v__$1)):(((om.util.ident_QMARK_(key__$1)) && (om.util.union_QMARK_(join__$2)))?cljs.core.get.cljs$core$IFn$_invoke$arity$2(sel,cljs.core.first(key__$1)):sel
)));
var graph_loop_QMARK_ = (recurse_QMARK_) && (cljs.core.contains_QMARK_(cljs.core.set(cljs.core.get.cljs$core$IFn$_invoke$arity$2(idents_seen,key__$1)),v__$1)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$none,limit));
var idents_seen__$1 = (cljs.core.truth_((function (){var and__6741__auto__ = om.next.mappable_ident_QMARK_(refs,v__$1);
if(cljs.core.truth_(and__6741__auto__)){
return recurse_QMARK_;
} else {
return and__6741__auto__;
}
})())?cljs.core.assoc_in(cljs.core.update_in.cljs$core$IFn$_invoke$arity$4(idents_seen,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [key__$1], null),cljs.core.fnil.cljs$core$IFn$_invoke$arity$2(cljs.core.conj,cljs.core.PersistentHashSet.EMPTY),v__$1),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$last_DASH_ident,key__$1], null),v__$1):idents_seen);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((0),limit)){
var G__16095 = cljs.core.next(joins__$1);
var G__16096 = ret;
joins__$1 = G__16095;
ret = G__16096;
continue;
} else {
if(graph_loop_QMARK_){
var G__16097 = cljs.core.next(joins__$1);
var G__16098 = ret;
joins__$1 = G__16097;
ret = G__16098;
continue;
} else {
if((v__$1 == null)){
var G__16099 = cljs.core.next(joins__$1);
var G__16100 = ret;
joins__$1 = G__16099;
ret = G__16100;
continue;
} else {
var G__16101 = cljs.core.next(joins__$1);
var G__16102 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(ret,key__$1,om$next$denormalize_STAR_(sel__$1,v__$1,refs,map_ident,idents_seen__$1,union_entry,recurse_key__$1));
joins__$1 = G__16101;
ret = G__16102;
continue;

}
}
}
} else {
var temp__6501__auto__ = cljs.core.some(((function (joins__$1,ret,map__16078,map__16078__$1,props,joins,props__$1,union_recur_QMARK_,recur_ident,data__$1){
return (function (p__16087){
var vec__16088 = p__16087;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16088,(0),null);
var identset = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16088,(1),null);
if(cljs.core.contains_QMARK_(identset,cljs.core.get.cljs$core$IFn$_invoke$arity$2(data__$1,k))){
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(idents_seen,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$last_DASH_ident,k], null));
} else {
return null;
}
});})(joins__$1,ret,map__16078,map__16078__$1,props,joins,props__$1,union_recur_QMARK_,recur_ident,data__$1))
,cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(idents_seen,cljs.core.cst$kw$last_DASH_ident));
if(cljs.core.truth_(temp__6501__auto__)){
var looped_key = temp__6501__auto__;
return looped_key;
} else {
return cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.select_keys(data__$1,props__$1),ret], 0));
}
}
break;
}
}

}
}
});
/**
 * Given a query, some data in the default database format, and the entire
 * application state in the default database format, return the tree where all
 * ident links have been replaced with their original node values.
 */
om.next.db__GT_tree = (function om$next$db__GT_tree(var_args){
var args16103 = [];
var len__7936__auto___16106 = arguments.length;
var i__7937__auto___16107 = (0);
while(true){
if((i__7937__auto___16107 < len__7936__auto___16106)){
args16103.push((arguments[i__7937__auto___16107]));

var G__16108 = (i__7937__auto___16107 + (1));
i__7937__auto___16107 = G__16108;
continue;
} else {
}
break;
}

var G__16105 = args16103.length;
switch (G__16105) {
case 3:
return om.next.db__GT_tree.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return om.next.db__GT_tree.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args16103.length)].join('')));

}
});

om.next.db__GT_tree.cljs$core$IFn$_invoke$arity$3 = (function (query,data,refs){
if(cljs.core.map_QMARK_(refs)){
} else {
throw (new Error("Assert failed: (map? refs)"));
}

return om.next.denormalize_STAR_(query,data,refs,cljs.core.identity,cljs.core.PersistentArrayMap.EMPTY,null,null);
});

om.next.db__GT_tree.cljs$core$IFn$_invoke$arity$4 = (function (query,data,refs,map_ident){
if(cljs.core.map_QMARK_(refs)){
} else {
throw (new Error("Assert failed: (map? refs)"));
}

return om.next.denormalize_STAR_(query,data,refs,map_ident,cljs.core.PersistentArrayMap.EMPTY,null,null);
});

om.next.db__GT_tree.cljs$lang$maxFixedArity = 4;

om.next.rewrite = (function om$next$rewrite(rewrite_map,result){
var step = (function om$next$rewrite_$_step(res,p__16133){
var vec__16137 = p__16133;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16137,(0),null);
var orig_paths = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16137,(1),null);
var to_move = cljs.core.get.cljs$core$IFn$_invoke$arity$2(result,k);
var res_SINGLEQUOTE_ = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(((function (to_move,vec__16137,k,orig_paths){
return (function (p1__16110_SHARP_,p2__16111_SHARP_){
return cljs.core.assoc_in(p1__16110_SHARP_,cljs.core.conj.cljs$core$IFn$_invoke$arity$2(p2__16111_SHARP_,k),to_move);
});})(to_move,vec__16137,k,orig_paths))
,res,orig_paths);
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(res_SINGLEQUOTE_,k);
});
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(step,result,rewrite_map);
});
/**
 * When given a join `{:join selector-vector}`, roots found so far, and a `path` prefix:
 *   returns a (possibly empty) sequence of [re-rooted-join prefix] results.
 *   Does NOT support sub-roots. Each re-rooted join will share only
 *   one common parent (their common branching point).
 *   
 */
om.next.move_roots = (function om$next$move_roots(join,result_roots,path){
var query_root_QMARK_ = (function om$next$move_roots_$_query_root_QMARK_(join__$1){
return cljs.core.cst$kw$query_DASH_root.cljs$core$IFn$_invoke$arity$1(cljs.core.meta(join__$1)) === true;
});
if(cljs.core.truth_(om.util.join_QMARK_(join))){
if(cljs.core.truth_(query_root_QMARK_(join))){
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(result_roots,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [join,path], null));
} else {
return cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (p1__16140_SHARP_){
return om$next$move_roots(p1__16140_SHARP_,result_roots,cljs.core.conj.cljs$core$IFn$_invoke$arity$2(path,om.util.join_key(join)));
}),cljs.core.array_seq([om.util.join_value(join)], 0));
}
} else {
return result_roots;
}
});
/**
 * Searches a query for duplicate joins and deep-merges them into a new query.
 */
om.next.merge_joins = (function om$next$merge_joins(query){
var step = (function om$next$merge_joins_$_step(res,expr){
if(cljs.core.contains_QMARK_(cljs.core.cst$kw$elements_DASH_seen.cljs$core$IFn$_invoke$arity$1(res),expr)){
return res;
} else {
return cljs.core.update_in.cljs$core$IFn$_invoke$arity$4((cljs.core.truth_((function (){var and__6741__auto__ = om.util.join_QMARK_(expr);
if(cljs.core.truth_(and__6741__auto__)){
return (!(om.util.union_QMARK_(expr))) && (!(cljs.core.list_QMARK_(expr)));
} else {
return and__6741__auto__;
}
})())?(function (){var jk = om.util.join_key(expr);
var jv = om.util.join_value(expr);
var q = (function (){var or__6753__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$query_DASH_by_DASH_join.cljs$core$IFn$_invoke$arity$1(res),jk);
if(cljs.core.truth_(or__6753__auto__)){
return or__6753__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})();
var nq = ((om.util.recursion_QMARK_(q))?q:((om.util.recursion_QMARK_(jv))?jv:om$next$merge_joins(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(q,jv)))
));
return cljs.core.update_in.cljs$core$IFn$_invoke$arity$5(res,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$query_DASH_by_DASH_join], null),cljs.core.assoc,jk,nq);
})():cljs.core.update_in.cljs$core$IFn$_invoke$arity$4(res,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$not_DASH_mergeable], null),cljs.core.conj,expr)),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$elements_DASH_seen], null),cljs.core.conj,expr);
}
});
var init = new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$query_DASH_by_DASH_join,cljs.core.PersistentArrayMap.EMPTY,cljs.core.cst$kw$elements_DASH_seen,cljs.core.PersistentHashSet.EMPTY,cljs.core.cst$kw$not_DASH_mergeable,cljs.core.PersistentVector.EMPTY], null);
var res = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(step,init,query);
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$not_DASH_mergeable.cljs$core$IFn$_invoke$arity$1(res),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(((function (init,res){
return (function (p__16152){
var vec__16153 = p__16152;
var jkey = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16153,(0),null);
var jsel = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16153,(1),null);
return cljs.core.PersistentArrayMap.fromArray([jkey,jsel], true, false);
});})(init,res))
,cljs.core.cst$kw$query_DASH_by_DASH_join.cljs$core$IFn$_invoke$arity$1(res))));
});
om.next.process_roots = (function om$next$process_roots(query){

var retain = (function om$next$process_roots_$_retain(expr){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [expr,cljs.core.PersistentVector.EMPTY], null)], null);
});
var reroot = (function om$next$process_roots_$_reroot(expr){
var roots = om.next.move_roots(expr,cljs.core.PersistentVector.EMPTY,cljs.core.PersistentVector.EMPTY);
if(cljs.core.empty_QMARK_(roots)){
return retain(expr);
} else {
return roots;
}
});
var rewrite_map_step = (function om$next$process_roots_$_rewrite_map_step(rewrites,p__16177){
var vec__16181 = p__16177;
var expr = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16181,(0),null);
var path = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16181,(1),null);
if(cljs.core.empty_QMARK_(path)){
return rewrites;
} else {
return cljs.core.update_in.cljs$core$IFn$_invoke$arity$4(rewrites,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [om.util.join_key(expr)], null),cljs.core.conj,path);
}
});
var reroots = cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(reroot,cljs.core.array_seq([query], 0));
var query__$1 = om.next.merge_joins(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs.core.first,reroots));
var rewrite_map = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(rewrite_map_step,cljs.core.PersistentArrayMap.EMPTY,reroots);
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$query,query__$1,cljs.core.cst$kw$rewrite,cljs.core.partial.cljs$core$IFn$_invoke$arity$2(om.next.rewrite,rewrite_map)], null);
});
om.next.merge_idents = (function om$next$merge_idents(tree,config,refs,query){
var map__16201 = config;
var map__16201__$1 = ((((!((map__16201 == null)))?((((map__16201.cljs$lang$protocol_mask$partition0$ & (64))) || (map__16201.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__16201):map__16201);
var merge_ident = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16201__$1,cljs.core.cst$kw$merge_DASH_ident);
var indexer = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16201__$1,cljs.core.cst$kw$indexer);
var ident_joins = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.filter.cljs$core$IFn$_invoke$arity$2(((function (map__16201,map__16201__$1,merge_ident,indexer){
return (function (p1__16184_SHARP_){
var and__6741__auto__ = om.util.join_QMARK_(p1__16184_SHARP_);
if(cljs.core.truth_(and__6741__auto__)){
return om.util.ident_QMARK_(om.util.join_key(p1__16184_SHARP_));
} else {
return and__6741__auto__;
}
});})(map__16201,map__16201__$1,merge_ident,indexer))
,query));
var step = ((function (map__16201,map__16201__$1,merge_ident,indexer,ident_joins){
return (function om$next$merge_idents_$_step(tree_SINGLEQUOTE_,p__16210){
var vec__16214 = p__16210;
var ident = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16214,(0),null);
var props = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16214,(1),null);
if(cljs.core.truth_(cljs.core.cst$kw$normalize.cljs$core$IFn$_invoke$arity$1(config))){
var c_or_q = (function (){var or__6753__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(ident_joins,ident);
if(cljs.core.truth_(or__6753__auto__)){
return or__6753__auto__;
} else {
return om.next.ref__GT_any(indexer,ident);
}
})();
var props_SINGLEQUOTE_ = om.next.tree__GT_db.cljs$core$IFn$_invoke$arity$2(c_or_q,props);
var refs__$1 = cljs.core.meta(props_SINGLEQUOTE_);
return cljs.core.cst$kw$merge_DASH_tree.cljs$core$IFn$_invoke$arity$1(config).call(null,(merge_ident.cljs$core$IFn$_invoke$arity$4 ? merge_ident.cljs$core$IFn$_invoke$arity$4(config,tree_SINGLEQUOTE_,ident,props_SINGLEQUOTE_) : merge_ident.call(null,config,tree_SINGLEQUOTE_,ident,props_SINGLEQUOTE_)),refs__$1);
} else {
return (merge_ident.cljs$core$IFn$_invoke$arity$4 ? merge_ident.cljs$core$IFn$_invoke$arity$4(config,tree_SINGLEQUOTE_,ident,props) : merge_ident.call(null,config,tree_SINGLEQUOTE_,ident,props));
}
});})(map__16201,map__16201__$1,merge_ident,indexer,ident_joins))
;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(step,tree,refs);
});
om.next.merge_novelty_BANG_ = (function om$next$merge_novelty_BANG_(reconciler,state,res,query){
var config = cljs.core.cst$kw$config.cljs$core$IFn$_invoke$arity$1(reconciler);
var vec__16221 = om.next.sift_idents(res);
var idts = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16221,(0),null);
var res_SINGLEQUOTE_ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16221,(1),null);
var res_SINGLEQUOTE___$1 = (cljs.core.truth_(cljs.core.cst$kw$normalize.cljs$core$IFn$_invoke$arity$1(config))?om.next.tree__GT_db.cljs$core$IFn$_invoke$arity$3((function (){var or__6753__auto__ = query;
if(cljs.core.truth_(or__6753__auto__)){
return or__6753__auto__;
} else {
return cljs.core.cst$kw$root.cljs$core$IFn$_invoke$arity$1((function (){var G__16224 = cljs.core.cst$kw$state.cljs$core$IFn$_invoke$arity$1(reconciler);
return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(G__16224) : cljs.core.deref.call(null,G__16224));
})());
}
})(),res_SINGLEQUOTE_,true):res_SINGLEQUOTE_);
return cljs.core.cst$kw$merge_DASH_tree.cljs$core$IFn$_invoke$arity$1(config).call(null,om.next.merge_idents(state,config,idts,query),res_SINGLEQUOTE___$1);
});
om.next.default_merge = (function om$next$default_merge(reconciler,state,res,query){
return new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$keys,cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentVector.EMPTY,cljs.core.remove.cljs$core$IFn$_invoke$arity$1(cljs.core.symbol_QMARK_),cljs.core.keys(res)),cljs.core.cst$kw$next,om.next.merge_novelty_BANG_(reconciler,state,res,query),cljs.core.cst$kw$tempids,cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core.merge,cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.comp.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$tempids,cljs.core.second),cljs.core.filter.cljs$core$IFn$_invoke$arity$2(cljs.core.comp.cljs$core$IFn$_invoke$arity$2(cljs.core.symbol_QMARK_,cljs.core.first),res)))], null);
});
/**
 * Merge a state delta into the application state. Affected components managed
 * by the reconciler will re-render.
 */
om.next.merge_BANG_ = (function om$next$merge_BANG_(var_args){
var args16225 = [];
var len__7936__auto___16248 = arguments.length;
var i__7937__auto___16249 = (0);
while(true){
if((i__7937__auto___16249 < len__7936__auto___16248)){
args16225.push((arguments[i__7937__auto___16249]));

var G__16250 = (i__7937__auto___16249 + (1));
i__7937__auto___16249 = G__16250;
continue;
} else {
}
break;
}

var G__16227 = args16225.length;
switch (G__16227) {
case 2:
return om.next.merge_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return om.next.merge_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args16225.length)].join('')));

}
});

om.next.merge_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (reconciler,delta){
return om.next.merge_BANG_.cljs$core$IFn$_invoke$arity$3(reconciler,delta,null);
});

om.next.merge_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (reconciler,delta,query){
var config = cljs.core.cst$kw$config.cljs$core$IFn$_invoke$arity$1(reconciler);
var state = cljs.core.cst$kw$state.cljs$core$IFn$_invoke$arity$1(config);
var merge_STAR_ = cljs.core.cst$kw$merge.cljs$core$IFn$_invoke$arity$1(config);
var map__16228 = (function (){var G__16229 = reconciler;
var G__16230 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(state) : cljs.core.deref.call(null,state));
var G__16231 = delta;
var G__16232 = query;
return (merge_STAR_.cljs$core$IFn$_invoke$arity$4 ? merge_STAR_.cljs$core$IFn$_invoke$arity$4(G__16229,G__16230,G__16231,G__16232) : merge_STAR_.call(null,G__16229,G__16230,G__16231,G__16232));
})();
var map__16228__$1 = ((((!((map__16228 == null)))?((((map__16228.cljs$lang$protocol_mask$partition0$ & (64))) || (map__16228.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__16228):map__16228);
var keys = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16228__$1,cljs.core.cst$kw$keys);
var next = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16228__$1,cljs.core.cst$kw$next);
var tempids = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16228__$1,cljs.core.cst$kw$tempids);
om.next.protocols.queue_BANG_(reconciler,keys);

var G__16240 = state;
var G__16241 = (function (){var temp__6501__auto__ = cljs.core.cst$kw$migrate.cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(temp__6501__auto__)){
var migrate = temp__6501__auto__;
return cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.select_keys(next,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$om$next_SLASH_queries], null)),(function (){var G__16243 = next;
var G__16244 = (function (){var or__6753__auto__ = query;
if(cljs.core.truth_(or__6753__auto__)){
return or__6753__auto__;
} else {
return om.next.get_query(cljs.core.cst$kw$root.cljs$core$IFn$_invoke$arity$1((function (){var G__16247 = cljs.core.cst$kw$state.cljs$core$IFn$_invoke$arity$1(reconciler);
return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(G__16247) : cljs.core.deref.call(null,G__16247));
})()));
}
})();
var G__16245 = tempids;
var G__16246 = cljs.core.cst$kw$id_DASH_key.cljs$core$IFn$_invoke$arity$1(config);
return (migrate.cljs$core$IFn$_invoke$arity$4 ? migrate.cljs$core$IFn$_invoke$arity$4(G__16243,G__16244,G__16245,G__16246) : migrate.call(null,G__16243,G__16244,G__16245,G__16246));
})()], 0));
} else {
return next;
}
})();
return (cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(G__16240,G__16241) : cljs.core.reset_BANG_.call(null,G__16240,G__16241));
});

om.next.merge_BANG_.cljs$lang$maxFixedArity = 3;


/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {om.next.protocols.IReconciler}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IDeref}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
om.next.Reconciler = (function (config,state,__meta,__extmap,__hash){
this.config = config;
this.state = state;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2229700362;
this.cljs$lang$protocol_mask$partition1$ = 8192;
})
om.next.Reconciler.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__7423__auto__,k__7424__auto__){
var self__ = this;
var this__7423__auto____$1 = this;
return cljs.core._lookup.cljs$core$IFn$_invoke$arity$3(this__7423__auto____$1,k__7424__auto__,null);
});

om.next.Reconciler.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__7425__auto__,k16257,else__7426__auto__){
var self__ = this;
var this__7425__auto____$1 = this;
var G__16259 = (((k16257 instanceof cljs.core.Keyword))?k16257.fqn:null);
switch (G__16259) {
case "config":
return self__.config;

break;
case "state":
return self__.state;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k16257,else__7426__auto__);

}
});


om.next.Reconciler.prototype.om$next$protocols$IReconciler$ = true;

om.next.Reconciler.prototype.om$next$protocols$IReconciler$queue_BANG_$arity$2 = (function (_,ks){
var self__ = this;
var ___$1 = this;
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(self__.state,cljs.core.update_in,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$queue], null),cljs.core.into,cljs.core.array_seq([ks], 0));
});

om.next.Reconciler.prototype.om$next$protocols$IReconciler$queue_sends_BANG_$arity$2 = (function (_,sends){
var self__ = this;
var ___$1 = this;
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(self__.state,cljs.core.update_in,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$queued_DASH_sends], null),cljs.core.cst$kw$merge_DASH_sends.cljs$core$IFn$_invoke$arity$1(self__.config),cljs.core.array_seq([sends], 0));
});

om.next.Reconciler.prototype.om$next$protocols$IReconciler$send_BANG_$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
var sends = cljs.core.cst$kw$queued_DASH_sends.cljs$core$IFn$_invoke$arity$1((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(self__.state) : cljs.core.deref.call(null,self__.state)));
if(cljs.core.empty_QMARK_(sends)){
return null;
} else {
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(self__.state,((function (sends,this$__$1){
return (function (state__$1){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(state__$1,cljs.core.cst$kw$queued_DASH_sends,cljs.core.PersistentArrayMap.EMPTY),cljs.core.cst$kw$sends_DASH_queued,false);
});})(sends,this$__$1))
);

return cljs.core.cst$kw$send.cljs$core$IFn$_invoke$arity$1(self__.config).call(null,sends,((function (sends,this$__$1){
return (function (res,query){
return om.next.merge_BANG_.cljs$core$IFn$_invoke$arity$3(this$__$1,res,query);
});})(sends,this$__$1))
);
}
});

om.next.Reconciler.prototype.om$next$protocols$IReconciler$reconcile_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
var st = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(self__.state) : cljs.core.deref.call(null,self__.state));
var q = cljs.core.cst$kw$queue.cljs$core$IFn$_invoke$arity$1(st);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(self__.state,cljs.core.update_in,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$queued], null),cljs.core.not);

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(self__.state,cljs.core.assoc,cljs.core.cst$kw$queue,cljs.core.PersistentVector.EMPTY);

if(cljs.core.empty_QMARK_(q)){
return cljs.core.cst$kw$render.cljs$core$IFn$_invoke$arity$1(st).call(null);
} else {
var cs = cljs.core.transduce.cljs$core$IFn$_invoke$arity$4(cljs.core.map.cljs$core$IFn$_invoke$arity$1(((function (st,q,___$1){
return (function (p1__16253_SHARP_){
return om.next.protocols.key__GT_components(cljs.core.cst$kw$indexer.cljs$core$IFn$_invoke$arity$1(self__.config),p1__16253_SHARP_);
});})(st,q,___$1))
),((function (st,q,___$1){
return (function (p1__16254_SHARP_,p2__16255_SHARP_){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(p1__16254_SHARP_,p2__16255_SHARP_);
});})(st,q,___$1))
,cljs.core.PersistentHashSet.EMPTY,q);
var map__16260 = self__.config;
var map__16260__$1 = ((((!((map__16260 == null)))?((((map__16260.cljs$lang$protocol_mask$partition0$ & (64))) || (map__16260.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__16260):map__16260);
var ui__GT_props = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16260__$1,cljs.core.cst$kw$ui_DASH__GT_props);
var env = om.next.to_env(self__.config);
var seq__16262 = cljs.core.seq(cljs.core.cst$kw$optimize.cljs$core$IFn$_invoke$arity$1(self__.config).call(null,cs));
var chunk__16263 = null;
var count__16264 = (0);
var i__16265 = (0);
while(true){
if((i__16265 < count__16264)){
var c = chunk__16263.cljs$core$IIndexed$_nth$arity$2(null,i__16265);
if(om.next.mounted_QMARK_(c)){
var computed_16280 = om.next.get_computed.cljs$core$IFn$_invoke$arity$1(om.next.props(c));
var next_props_16281 = om.next.computed((ui__GT_props.cljs$core$IFn$_invoke$arity$2 ? ui__GT_props.cljs$core$IFn$_invoke$arity$2(env,c) : ui__GT_props.call(null,env,c)),computed_16280);
if(cljs.core.truth_(om.next.should_update_QMARK_.cljs$core$IFn$_invoke$arity$3(c,next_props_16281,om.next.get_state.cljs$core$IFn$_invoke$arity$1(c)))){
if(!((next_props_16281 == null))){
om.next.update_component_BANG_(c,next_props_16281);
} else {
c.forceUpdate();
}
} else {
}
} else {
}

var G__16282 = seq__16262;
var G__16283 = chunk__16263;
var G__16284 = count__16264;
var G__16285 = (i__16265 + (1));
seq__16262 = G__16282;
chunk__16263 = G__16283;
count__16264 = G__16284;
i__16265 = G__16285;
continue;
} else {
var temp__6503__auto__ = cljs.core.seq(seq__16262);
if(temp__6503__auto__){
var seq__16262__$1 = temp__6503__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__16262__$1)){
var c__7656__auto__ = cljs.core.chunk_first(seq__16262__$1);
var G__16286 = cljs.core.chunk_rest(seq__16262__$1);
var G__16287 = c__7656__auto__;
var G__16288 = cljs.core.count(c__7656__auto__);
var G__16289 = (0);
seq__16262 = G__16286;
chunk__16263 = G__16287;
count__16264 = G__16288;
i__16265 = G__16289;
continue;
} else {
var c = cljs.core.first(seq__16262__$1);
if(om.next.mounted_QMARK_(c)){
var computed_16290 = om.next.get_computed.cljs$core$IFn$_invoke$arity$1(om.next.props(c));
var next_props_16291 = om.next.computed((ui__GT_props.cljs$core$IFn$_invoke$arity$2 ? ui__GT_props.cljs$core$IFn$_invoke$arity$2(env,c) : ui__GT_props.call(null,env,c)),computed_16290);
if(cljs.core.truth_(om.next.should_update_QMARK_.cljs$core$IFn$_invoke$arity$3(c,next_props_16291,om.next.get_state.cljs$core$IFn$_invoke$arity$1(c)))){
if(!((next_props_16291 == null))){
om.next.update_component_BANG_(c,next_props_16291);
} else {
c.forceUpdate();
}
} else {
}
} else {
}

var G__16292 = cljs.core.next(seq__16262__$1);
var G__16293 = null;
var G__16294 = (0);
var G__16295 = (0);
seq__16262 = G__16292;
chunk__16263 = G__16293;
count__16264 = G__16294;
i__16265 = G__16295;
continue;
}
} else {
return null;
}
}
break;
}
}
});

om.next.Reconciler.prototype.om$next$protocols$IReconciler$schedule_render_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if(cljs.core.not(cljs.core.cst$kw$queued.cljs$core$IFn$_invoke$arity$1((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(self__.state) : cljs.core.deref.call(null,self__.state))))){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(self__.state,cljs.core.assoc,cljs.core.cst$kw$queued,true);

return true;
} else {
return false;
}
});

om.next.Reconciler.prototype.om$next$protocols$IReconciler$schedule_sends_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
if(cljs.core.not(cljs.core.cst$kw$sends_DASH_queued.cljs$core$IFn$_invoke$arity$1((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(self__.state) : cljs.core.deref.call(null,self__.state))))){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(self__.state,cljs.core.assoc,cljs.core.cst$kw$sends_DASH_queued,true);

return true;
} else {
return false;
}
});

om.next.Reconciler.prototype.om$next$protocols$IReconciler$basis_t$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.cst$kw$t.cljs$core$IFn$_invoke$arity$1((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(self__.state) : cljs.core.deref.call(null,self__.state)));
});

om.next.Reconciler.prototype.om$next$protocols$IReconciler$add_root_BANG_$arity$4 = (function (this$,root_class,target,options){
var self__ = this;
var this$__$1 = this;
var ret = (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null) : cljs.core.atom.call(null,null));
var rctor = om.next.factory.cljs$core$IFn$_invoke$arity$1(root_class);
var guid = cljs.core.random_uuid();
if(om.next.iquery_QMARK_(root_class)){
om.next.protocols.index_root(cljs.core.cst$kw$indexer.cljs$core$IFn$_invoke$arity$1(self__.config),root_class);
} else {
}

if(cljs.core.truth_((function (){var and__6741__auto__ = cljs.core.cst$kw$normalize.cljs$core$IFn$_invoke$arity$1(self__.config);
if(cljs.core.truth_(and__6741__auto__)){
return cljs.core.not(cljs.core.cst$kw$normalized.cljs$core$IFn$_invoke$arity$1((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(self__.state) : cljs.core.deref.call(null,self__.state))));
} else {
return and__6741__auto__;
}
})())){
var new_state_16296 = om.next.tree__GT_db.cljs$core$IFn$_invoke$arity$2(root_class,(function (){var G__16266 = cljs.core.cst$kw$state.cljs$core$IFn$_invoke$arity$1(self__.config);
return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(G__16266) : cljs.core.deref.call(null,G__16266));
})());
var refs_16297 = cljs.core.meta(new_state_16296);
var G__16267_16298 = cljs.core.cst$kw$state.cljs$core$IFn$_invoke$arity$1(self__.config);
var G__16268_16299 = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([new_state_16296,refs_16297], 0));
(cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(G__16267_16298,G__16268_16299) : cljs.core.reset_BANG_.call(null,G__16267_16298,G__16268_16299));

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(self__.state,cljs.core.assoc,cljs.core.cst$kw$normalized,true);
} else {
}

var renderf = ((function (ret,rctor,guid,this$__$1){
return (function (data){
var _STAR_reconciler_STAR_16269 = om.next._STAR_reconciler_STAR_;
var _STAR_shared_STAR_16270 = om.next._STAR_shared_STAR_;
var _STAR_instrument_STAR_16271 = om.next._STAR_instrument_STAR_;
om.next._STAR_reconciler_STAR_ = this$__$1;

om.next._STAR_shared_STAR_ = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.cst$kw$shared.cljs$core$IFn$_invoke$arity$1(self__.config),(cljs.core.truth_(cljs.core.cst$kw$shared_DASH_fn.cljs$core$IFn$_invoke$arity$1(self__.config))?cljs.core.cst$kw$shared_DASH_fn.cljs$core$IFn$_invoke$arity$1(self__.config).call(null,data):null)], 0));

om.next._STAR_instrument_STAR_ = cljs.core.cst$kw$instrument.cljs$core$IFn$_invoke$arity$1(self__.config);

try{var c = ((!((target == null)))?cljs.core.cst$kw$root_DASH_render.cljs$core$IFn$_invoke$arity$1(self__.config).call(null,(rctor.cljs$core$IFn$_invoke$arity$1 ? rctor.cljs$core$IFn$_invoke$arity$1(data) : rctor.call(null,data)),target):((((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(ret) : cljs.core.deref.call(null,ret)) == null))?(rctor.cljs$core$IFn$_invoke$arity$1 ? rctor.cljs$core$IFn$_invoke$arity$1(data) : rctor.call(null,data)):(function (){var temp__6503__auto__ = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(ret) : cljs.core.deref.call(null,ret));
if(cljs.core.truth_(temp__6503__auto__)){
var c_SINGLEQUOTE_ = temp__6503__auto__;
if(om.next.mounted_QMARK_(c_SINGLEQUOTE_)){
return c_SINGLEQUOTE_.forceUpdate(data);
} else {
return null;
}
} else {
return null;
}
})()
));
if((((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(ret) : cljs.core.deref.call(null,ret)) == null)) && (!((c == null)))){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(self__.state,cljs.core.assoc,cljs.core.cst$kw$root,c);

return (cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(ret,c) : cljs.core.reset_BANG_.call(null,ret,c));
} else {
return null;
}
}finally {om.next._STAR_instrument_STAR_ = _STAR_instrument_STAR_16271;

om.next._STAR_shared_STAR_ = _STAR_shared_STAR_16270;

om.next._STAR_reconciler_STAR_ = _STAR_reconciler_STAR_16269;
}});})(ret,rctor,guid,this$__$1))
;
var parsef = ((function (renderf,ret,rctor,guid,this$__$1){
return (function (){
var sel = om.next.get_query((function (){var or__6753__auto__ = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(ret) : cljs.core.deref.call(null,ret));
if(cljs.core.truth_(or__6753__auto__)){
return or__6753__auto__;
} else {
return root_class;
}
})());
if(((sel == null)) || (cljs.core.vector_QMARK_(sel))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str("Application root query must be a vector"),cljs.core.str("\n"),cljs.core.str("(or (nil? sel) (vector? sel))")].join('')));
}

if(!((sel == null))){
var env = om.next.to_env(self__.config);
var v = cljs.core.cst$kw$parser.cljs$core$IFn$_invoke$arity$1(self__.config).call(null,env,sel);
if(cljs.core.empty_QMARK_(v)){
return null;
} else {
return renderf(v);
}
} else {
return renderf((function (){var G__16272 = cljs.core.cst$kw$state.cljs$core$IFn$_invoke$arity$1(self__.config);
return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(G__16272) : cljs.core.deref.call(null,G__16272));
})());
}
});})(renderf,ret,rctor,guid,this$__$1))
;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(self__.state,cljs.core.merge,new cljs.core.PersistentArrayMap(null, 4, [cljs.core.cst$kw$target,target,cljs.core.cst$kw$render,parsef,cljs.core.cst$kw$root,root_class,cljs.core.cst$kw$remove,((function (renderf,parsef,ret,rctor,guid,this$__$1){
return (function (){
cljs.core.remove_watch(cljs.core.cst$kw$state.cljs$core$IFn$_invoke$arity$1(self__.config),(function (){var or__6753__auto__ = target;
if(cljs.core.truth_(or__6753__auto__)){
return or__6753__auto__;
} else {
return guid;
}
})());

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(self__.state,((function (renderf,parsef,ret,rctor,guid,this$__$1){
return (function (p1__16252_SHARP_){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(p1__16252_SHARP_,cljs.core.cst$kw$target),cljs.core.cst$kw$render),cljs.core.cst$kw$root),cljs.core.cst$kw$remove);
});})(renderf,parsef,ret,rctor,guid,this$__$1))
);

if((target == null)){
return null;
} else {
return cljs.core.cst$kw$root_DASH_unmount.cljs$core$IFn$_invoke$arity$1(self__.config).call(null,target);
}
});})(renderf,parsef,ret,rctor,guid,this$__$1))
], null));

cljs.core.add_watch(cljs.core.cst$kw$state.cljs$core$IFn$_invoke$arity$1(self__.config),(function (){var or__6753__auto__ = target;
if(cljs.core.truth_(or__6753__auto__)){
return or__6753__auto__;
} else {
return guid;
}
})(),((function (renderf,parsef,ret,rctor,guid,this$__$1){
return (function (_,___$1,___$2,___$3){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(self__.state,cljs.core.update_in,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$t], null),cljs.core.inc);

if(!(om.next.iquery_QMARK_(root_class))){
return om.next.queue_render_BANG_(parsef);
} else {
return om.next.schedule_render_BANG_(this$__$1);
}
});})(renderf,parsef,ret,rctor,guid,this$__$1))
);

parsef();

var temp__6503__auto___16300 = om.next.get_query((function (){var or__6753__auto__ = (function (){var and__6741__auto__ = target;
if(cljs.core.truth_(and__6741__auto__)){
return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(ret) : cljs.core.deref.call(null,ret));
} else {
return and__6741__auto__;
}
})();
if(cljs.core.truth_(or__6753__auto__)){
return or__6753__auto__;
} else {
return root_class;
}
})());
if(cljs.core.truth_(temp__6503__auto___16300)){
var sel_16301 = temp__6503__auto___16300;
var env_16302 = om.next.to_env(self__.config);
var snds_16303 = om.next.gather_sends(env_16302,sel_16301,cljs.core.cst$kw$remotes.cljs$core$IFn$_invoke$arity$1(self__.config));
if(cljs.core.empty_QMARK_(snds_16303)){
} else {
var temp__6503__auto___16304__$1 = cljs.core.cst$kw$send.cljs$core$IFn$_invoke$arity$1(self__.config);
if(cljs.core.truth_(temp__6503__auto___16304__$1)){
var send_16305 = temp__6503__auto___16304__$1;
var G__16273_16306 = snds_16303;
var G__16274_16307 = ((function (G__16273_16306,send_16305,temp__6503__auto___16304__$1,env_16302,snds_16303,sel_16301,temp__6503__auto___16300,renderf,parsef,ret,rctor,guid,this$__$1){
return (function (res,query){
om.next.merge_BANG_.cljs$core$IFn$_invoke$arity$3(this$__$1,res,query);

return renderf(cljs.core.cst$kw$parser.cljs$core$IFn$_invoke$arity$1(self__.config).call(null,env_16302,sel_16301));
});})(G__16273_16306,send_16305,temp__6503__auto___16304__$1,env_16302,snds_16303,sel_16301,temp__6503__auto___16300,renderf,parsef,ret,rctor,guid,this$__$1))
;
(send_16305.cljs$core$IFn$_invoke$arity$2 ? send_16305.cljs$core$IFn$_invoke$arity$2(G__16273_16306,G__16274_16307) : send_16305.call(null,G__16273_16306,G__16274_16307));
} else {
}
}
} else {
}

return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(ret) : cljs.core.deref.call(null,ret));
});

om.next.Reconciler.prototype.om$next$protocols$IReconciler$reindex_BANG_$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
var root = cljs.core.get.cljs$core$IFn$_invoke$arity$2((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(self__.state) : cljs.core.deref.call(null,self__.state)),cljs.core.cst$kw$root);
if(om.next.iquery_QMARK_(root)){
var indexer = cljs.core.cst$kw$indexer.cljs$core$IFn$_invoke$arity$1(self__.config);
var c = cljs.core.first(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(indexer) : cljs.core.deref.call(null,indexer)),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$class_DASH__GT_components,root], null)));
return om.next.protocols.index_root(indexer,(function (){var or__6753__auto__ = c;
if(cljs.core.truth_(or__6753__auto__)){
return or__6753__auto__;
} else {
return root;
}
})());
} else {
return null;
}
});

om.next.Reconciler.prototype.om$next$protocols$IReconciler$remove_root_BANG_$arity$2 = (function (_,target){
var self__ = this;
var ___$1 = this;
var temp__6503__auto__ = cljs.core.cst$kw$remove.cljs$core$IFn$_invoke$arity$1((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(self__.state) : cljs.core.deref.call(null,self__.state)));
if(cljs.core.truth_(temp__6503__auto__)){
var remove = temp__6503__auto__;
return (remove.cljs$core$IFn$_invoke$arity$0 ? remove.cljs$core$IFn$_invoke$arity$0() : remove.call(null));
} else {
return null;
}
});

om.next.Reconciler.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__7437__auto__,writer__7438__auto__,opts__7439__auto__){
var self__ = this;
var this__7437__auto____$1 = this;
var pr_pair__7440__auto__ = ((function (this__7437__auto____$1){
return (function (keyval__7441__auto__){
return cljs.core.pr_sequential_writer(writer__7438__auto__,cljs.core.pr_writer,""," ","",opts__7439__auto__,keyval__7441__auto__);
});})(this__7437__auto____$1))
;
return cljs.core.pr_sequential_writer(writer__7438__auto__,pr_pair__7440__auto__,"#om.next.Reconciler{",", ","}",opts__7439__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[cljs.core.cst$kw$config,self__.config],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[cljs.core.cst$kw$state,self__.state],null))], null),self__.__extmap));
});


om.next.Reconciler.prototype.cljs$core$IIterable$ = true;

om.next.Reconciler.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__16256){
var self__ = this;
var G__16256__$1 = this;
return (new cljs.core.RecordIter((0),G__16256__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$config,cljs.core.cst$kw$state], null),cljs.core._iterator(self__.__extmap)));
});

om.next.Reconciler.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__7421__auto__){
var self__ = this;
var this__7421__auto____$1 = this;
return self__.__meta;
});

om.next.Reconciler.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__7417__auto__){
var self__ = this;
var this__7417__auto____$1 = this;
return (new om.next.Reconciler(self__.config,self__.state,self__.__meta,self__.__extmap,self__.__hash));
});

om.next.Reconciler.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__7427__auto__){
var self__ = this;
var this__7427__auto____$1 = this;
return (2 + cljs.core.count(self__.__extmap));
});

om.next.Reconciler.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__7418__auto__){
var self__ = this;
var this__7418__auto____$1 = this;
var h__7190__auto__ = self__.__hash;
if(!((h__7190__auto__ == null))){
return h__7190__auto__;
} else {
var h__7190__auto____$1 = cljs.core.hash_imap(this__7418__auto____$1);
self__.__hash = h__7190__auto____$1;

return h__7190__auto____$1;
}
});

om.next.Reconciler.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this__7419__auto__,other__7420__auto__){
var self__ = this;
var this__7419__auto____$1 = this;
if(cljs.core.truth_((function (){var and__6741__auto__ = other__7420__auto__;
if(cljs.core.truth_(and__6741__auto__)){
var and__6741__auto____$1 = (this__7419__auto____$1.constructor === other__7420__auto__.constructor);
if(and__6741__auto____$1){
return cljs.core.equiv_map(this__7419__auto____$1,other__7420__auto__);
} else {
return and__6741__auto____$1;
}
} else {
return and__6741__auto__;
}
})())){
return true;
} else {
return false;
}
});

om.next.Reconciler.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__7432__auto__,k__7433__auto__){
var self__ = this;
var this__7432__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$config,null,cljs.core.cst$kw$state,null], null), null),k__7433__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core.with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__7432__auto____$1),self__.__meta),k__7433__auto__);
} else {
return (new om.next.Reconciler(self__.config,self__.state,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__7433__auto__)),null));
}
});

om.next.Reconciler.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__7430__auto__,k__7431__auto__,G__16256){
var self__ = this;
var this__7430__auto____$1 = this;
var pred__16275 = cljs.core.keyword_identical_QMARK_;
var expr__16276 = k__7431__auto__;
if(cljs.core.truth_((pred__16275.cljs$core$IFn$_invoke$arity$2 ? pred__16275.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$config,expr__16276) : pred__16275.call(null,cljs.core.cst$kw$config,expr__16276)))){
return (new om.next.Reconciler(G__16256,self__.state,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__16275.cljs$core$IFn$_invoke$arity$2 ? pred__16275.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$state,expr__16276) : pred__16275.call(null,cljs.core.cst$kw$state,expr__16276)))){
return (new om.next.Reconciler(self__.config,G__16256,self__.__meta,self__.__extmap,null));
} else {
return (new om.next.Reconciler(self__.config,self__.state,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__7431__auto__,G__16256),null));
}
}
});

om.next.Reconciler.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__7435__auto__){
var self__ = this;
var this__7435__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[cljs.core.cst$kw$config,self__.config],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[cljs.core.cst$kw$state,self__.state],null))], null),self__.__extmap));
});

om.next.Reconciler.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__7422__auto__,G__16256){
var self__ = this;
var this__7422__auto____$1 = this;
return (new om.next.Reconciler(self__.config,self__.state,G__16256,self__.__extmap,self__.__hash));
});

om.next.Reconciler.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__7428__auto__,entry__7429__auto__){
var self__ = this;
var this__7428__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__7429__auto__)){
return cljs.core._assoc(this__7428__auto____$1,cljs.core._nth.cljs$core$IFn$_invoke$arity$2(entry__7429__auto__,(0)),cljs.core._nth.cljs$core$IFn$_invoke$arity$2(entry__7429__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__7428__auto____$1,entry__7429__auto__);
}
});

om.next.Reconciler.prototype.cljs$core$IDeref$_deref$arity$1 = (function (this$){
var self__ = this;
var this$__$1 = this;
var G__16278 = cljs.core.cst$kw$state.cljs$core$IFn$_invoke$arity$1(self__.config);
return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(G__16278) : cljs.core.deref.call(null,G__16278));
});

om.next.Reconciler.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$sym$config,cljs.core.cst$sym$state], null);
});

om.next.Reconciler.cljs$lang$type = true;

om.next.Reconciler.cljs$lang$ctorPrSeq = (function (this__7459__auto__){
return cljs.core._conj(cljs.core.List.EMPTY,"om.next/Reconciler");
});

om.next.Reconciler.cljs$lang$ctorPrWriter = (function (this__7459__auto__,writer__7460__auto__){
return cljs.core._write(writer__7460__auto__,"om.next/Reconciler");
});

om.next.__GT_Reconciler = (function om$next$__GT_Reconciler(config,state){
return (new om.next.Reconciler(config,state,null,null,null));
});

om.next.map__GT_Reconciler = (function om$next$map__GT_Reconciler(G__16258){
return (new om.next.Reconciler(cljs.core.cst$kw$config.cljs$core$IFn$_invoke$arity$1(G__16258),cljs.core.cst$kw$state.cljs$core$IFn$_invoke$arity$1(G__16258),null,cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__16258,cljs.core.cst$kw$config,cljs.core.array_seq([cljs.core.cst$kw$state], 0)),null));
});

om.next.default_ui__GT_props = (function om$next$default_ui__GT_props(p__16308,c){
var map__16318 = p__16308;
var map__16318__$1 = ((((!((map__16318 == null)))?((((map__16318.cljs$lang$protocol_mask$partition0$ & (64))) || (map__16318.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__16318):map__16318);
var env = map__16318__$1;
var parser = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16318__$1,cljs.core.cst$kw$parser);
var pathopt = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16318__$1,cljs.core.cst$kw$pathopt);
var ui__$1 = (((function (){var and__6741__auto__ = pathopt;
if(and__6741__auto__){
var and__6741__auto____$1 = ((!((c == null)))?(((false) || (c.om$next$Ident$))?true:false):false);
if(and__6741__auto____$1){
return om.next.iquery_QMARK_(c);
} else {
return and__6741__auto____$1;
}
} else {
return and__6741__auto__;
}
})())?(function (){var id = om.next.ident(c,om.next.props(c));
return cljs.core.get.cljs$core$IFn$_invoke$arity$2((function (){var G__16323 = env;
var G__16324 = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.PersistentArrayMap.fromArray([id,om.next.get_query(c)], true, false)], null);
return (parser.cljs$core$IFn$_invoke$arity$2 ? parser.cljs$core$IFn$_invoke$arity$2(G__16323,G__16324) : parser.call(null,G__16323,G__16324));
})(),id);
})():null);
if(!((ui__$1 == null))){
return ui__$1;
} else {
var fq = om.next.full_query.cljs$core$IFn$_invoke$arity$1(c);
if((fq == null)){
return null;
} else {
var s = cljs.core.system_time();
var ui__$2 = (parser.cljs$core$IFn$_invoke$arity$2 ? parser.cljs$core$IFn$_invoke$arity$2(env,fq) : parser.call(null,env,fq));
var e = cljs.core.system_time();
var temp__6503__auto___16327 = cljs.core.cst$kw$logger.cljs$core$IFn$_invoke$arity$1(env);
if(cljs.core.truth_(temp__6503__auto___16327)){
var l_16328 = temp__6503__auto___16327;
var dt_16329 = (e - s);
if(((16) < dt_16329)){
var G__16325_16330 = l_16328;
var G__16326_16331 = [cljs.core.str(c),cljs.core.str(" query took "),cljs.core.str(dt_16329),cljs.core.str(" msecs")].join('');
goog.log.warning(G__16325_16330,G__16326_16331);
} else {
}
} else {
}

return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(ui__$2,om.next.path(c));
}
}
});
om.next.default_merge_ident = (function om$next$default_merge_ident(_,tree,ref,props){
return cljs.core.update_in.cljs$core$IFn$_invoke$arity$4(tree,ref,cljs.core.merge,props);
});
om.next.default_merge_tree = (function om$next$default_merge_tree(a,b){
if(cljs.core.map_QMARK_(a)){
return cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([a,b], 0));
} else {
return b;
}
});
/**
 * Given app-state-pure (the application state as an immutable value), a query,
 * tempids (a hash map from tempid to stable id), and an optional id-key
 * keyword, return a new application state value with the tempids replaced by
 * the stable ids.
 */
om.next.default_migrate = (function om$next$default_migrate(var_args){
var args16332 = [];
var len__7936__auto___16379 = arguments.length;
var i__7937__auto___16380 = (0);
while(true){
if((i__7937__auto___16380 < len__7936__auto___16379)){
args16332.push((arguments[i__7937__auto___16380]));

var G__16381 = (i__7937__auto___16380 + (1));
i__7937__auto___16380 = G__16381;
continue;
} else {
}
break;
}

var G__16334 = args16332.length;
switch (G__16334) {
case 3:
return om.next.default_migrate.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return om.next.default_migrate.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args16332.length)].join('')));

}
});

om.next.default_migrate.cljs$core$IFn$_invoke$arity$3 = (function (app_state_pure,query,tempids){
return om.next.default_migrate.cljs$core$IFn$_invoke$arity$4(app_state_pure,query,tempids,null);
});

om.next.default_migrate.cljs$core$IFn$_invoke$arity$4 = (function (app_state_pure,query,tempids,id_key){
var dissoc_in = (function om$next$dissoc_in(pure,p__16357){
var vec__16361 = p__16357;
var table = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16361,(0),null);
var id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16361,(1),null);
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(pure,table,cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core.get.cljs$core$IFn$_invoke$arity$2(pure,table),id));
});
var step = (function om$next$step(pure,p__16364){
var vec__16372 = p__16364;
var old = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16372,(0),null);
var vec__16375 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16372,(1),null);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16375,(0),null);
var id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16375,(1),null);
var new$ = vec__16375;
return cljs.core.assoc_in(dissoc_in(pure,old),new$,(function (){var G__16378 = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(pure,old),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(pure,new$)], 0));
if(!((id_key == null))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__16378,id_key,id);
} else {
return G__16378;
}
})());
});
if(!(cljs.core.empty_QMARK_(tempids))){
var pure_SINGLEQUOTE_ = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(step,app_state_pure,tempids);
return om.next.tree__GT_db.cljs$core$IFn$_invoke$arity$3(query,om.next.db__GT_tree.cljs$core$IFn$_invoke$arity$4(query,pure_SINGLEQUOTE_,pure_SINGLEQUOTE_,((function (pure_SINGLEQUOTE_){
return (function (ident){
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(tempids,ident,ident);
});})(pure_SINGLEQUOTE_))
),true);
} else {
return app_state_pure;
}
});

om.next.default_migrate.cljs$lang$maxFixedArity = 4;

om.next.has_error_QMARK_ = (function om$next$has_error_QMARK_(x){
return (cljs.core.map_QMARK_(x)) && (cljs.core.contains_QMARK_(x,cljs.core.cst$kw$om$next_SLASH_error));
});
om.next.default_extract_errors = (function om$next$default_extract_errors(reconciler,res,query){
var extract_STAR_ = (function om$next$default_extract_errors_$_extract_STAR_(query__$1,res__$1,errs){
var class$ = cljs.core.cst$kw$component.cljs$core$IFn$_invoke$arity$1(cljs.core.meta(query__$1));
var top_error_QMARK_ = (((!((class$ == null))) && (om.next.has_error_QMARK_(res__$1)))?cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(errs,((function (class$){
return (function (p1__16383_SHARP_){
return cljs.core.update_in.cljs$core$IFn$_invoke$arity$4(p1__16383_SHARP_,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [om.next.ident(class$,res__$1)], null),cljs.core.fnil.cljs$core$IFn$_invoke$arity$2(cljs.core.conj,cljs.core.PersistentHashSet.EMPTY),cljs.core.cst$kw$om$next_SLASH_error.cljs$core$IFn$_invoke$arity$1(res__$1));
});})(class$))
):null);
var ret = (((top_error_QMARK_ == null))?cljs.core.PersistentArrayMap.EMPTY:null);
if(cljs.core.vector_QMARK_(query__$1)){
if(cljs.core.vector_QMARK_(res__$1)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentVector.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1(((function (class$,top_error_QMARK_,ret){
return (function (p1__16384_SHARP_){
return om$next$default_extract_errors_$_extract_STAR_(query__$1,p1__16384_SHARP_,errs);
});})(class$,top_error_QMARK_,ret))
),res__$1);
} else {
var exprs = cljs.core.seq(query__$1);
var ret__$1 = ret;
while(true){
if(!((exprs == null))){
var expr = cljs.core.first(exprs);
var k = (function (){var k = om.next.expr__GT_key(expr);
var G__16420 = k;
if(om.util.unique_ident_QMARK_(k)){
return cljs.core.first(G__16420);
} else {
return G__16420;
}
})();
var data = cljs.core.get.cljs$core$IFn$_invoke$arity$2(res__$1,k);
if(om.util.mutation_QMARK_(expr)){
var mk = om.util.mutation_key(expr);
var ret_SINGLEQUOTE_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(res__$1,mk);
if(om.next.has_error_QMARK_(ret_SINGLEQUOTE_)){
var x = cljs.core.cst$kw$mutator.cljs$core$IFn$_invoke$arity$1(cljs.core.meta(expr));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(errs,((function (exprs,ret__$1,x,mk,ret_SINGLEQUOTE_,expr,k,data,class$,top_error_QMARK_,ret){
return (function (p1__16385_SHARP_){
return cljs.core.update_in.cljs$core$IFn$_invoke$arity$4(p1__16385_SHARP_,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [x], null),cljs.core.fnil.cljs$core$IFn$_invoke$arity$2(cljs.core.conj,cljs.core.PersistentHashSet.EMPTY),cljs.core.cst$kw$om$next_SLASH_error.cljs$core$IFn$_invoke$arity$1(ret_SINGLEQUOTE_));
});})(exprs,ret__$1,x,mk,ret_SINGLEQUOTE_,expr,k,data,class$,top_error_QMARK_,ret))
);

var G__16422 = cljs.core.next(exprs);
var G__16423 = ret__$1;
exprs = G__16422;
ret__$1 = G__16423;
continue;
} else {
var G__16424 = cljs.core.next(exprs);
var G__16425 = (((ret__$1 == null))?null:cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(ret__$1,mk,ret_SINGLEQUOTE_));
exprs = G__16424;
ret__$1 = G__16425;
continue;
}
} else {
if(om.util.union_QMARK_(expr)){
var jk = om.util.join_key(expr);
var jv = om.util.join_value(expr);
var class_SINGLEQUOTE_ = cljs.core.cst$kw$component.cljs$core$IFn$_invoke$arity$1(cljs.core.meta(jv));
if(!(cljs.core.vector_QMARK_(data))){
var ret_SINGLEQUOTE_ = om$next$default_extract_errors_$_extract_STAR_(cljs.core.get.cljs$core$IFn$_invoke$arity$2(jv,cljs.core.first(om.next.ident(class_SINGLEQUOTE_,data))),data,errs);
var G__16426 = cljs.core.next(exprs);
var G__16427 = (((ret__$1 == null))?null:cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(ret__$1,jk,ret_SINGLEQUOTE_));
exprs = G__16426;
ret__$1 = G__16427;
continue;
} else {
var ret_SINGLEQUOTE_ = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentVector.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1(((function (exprs,ret__$1,jk,jv,class_SINGLEQUOTE_,expr,k,data,class$,top_error_QMARK_,ret){
return (function (p1__16386_SHARP_){
return om$next$default_extract_errors_$_extract_STAR_(cljs.core.get.cljs$core$IFn$_invoke$arity$2(jv,cljs.core.first(om.next.ident(class_SINGLEQUOTE_,p1__16386_SHARP_))),p1__16386_SHARP_,errs);
});})(exprs,ret__$1,jk,jv,class_SINGLEQUOTE_,expr,k,data,class$,top_error_QMARK_,ret))
),data);
var G__16428 = cljs.core.next(exprs);
var G__16429 = (((ret__$1 == null))?null:cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(ret__$1,jk,ret_SINGLEQUOTE_));
exprs = G__16428;
ret__$1 = G__16429;
continue;
}
} else {
if(cljs.core.truth_(om.util.join_QMARK_(expr))){
var jk = om.util.join_key(expr);
var jv = om.util.join_value(expr);
var ret_SINGLEQUOTE_ = om$next$default_extract_errors_$_extract_STAR_(jv,data,errs);
var G__16430 = cljs.core.next(exprs);
var G__16431 = (((ret__$1 == null))?null:cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(ret__$1,jk,ret_SINGLEQUOTE_));
exprs = G__16430;
ret__$1 = G__16431;
continue;
} else {
if((cljs.core.map_QMARK_(data)) && (om.next.has_error_QMARK_(data))){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(errs,((function (exprs,ret__$1,expr,k,data,class$,top_error_QMARK_,ret){
return (function (p1__16387_SHARP_){
return cljs.core.update_in.cljs$core$IFn$_invoke$arity$4(p1__16387_SHARP_,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(function (){var or__6753__auto__ = (((class$ == null))?null:om.next.ident(class$,res__$1));
if(cljs.core.truth_(or__6753__auto__)){
return or__6753__auto__;
} else {
return k;
}
})()], null),cljs.core.fnil.cljs$core$IFn$_invoke$arity$2(cljs.core.conj,cljs.core.PersistentHashSet.EMPTY),cljs.core.cst$kw$om$next_SLASH_error.cljs$core$IFn$_invoke$arity$1(data));
});})(exprs,ret__$1,expr,k,data,class$,top_error_QMARK_,ret))
);

var G__16432 = cljs.core.next(exprs);
var G__16433 = null;
exprs = G__16432;
ret__$1 = G__16433;
continue;
} else {
var G__16434 = cljs.core.next(exprs);
var G__16435 = (((ret__$1 == null))?null:cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(ret__$1,k,data));
exprs = G__16434;
ret__$1 = G__16435;
continue;

}
}
}
}
} else {
return ret__$1;
}
break;
}
}
} else {
return null;
}
});
var errs = (function (){var G__16421 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__16421) : cljs.core.atom.call(null,G__16421));
})();
var ret = extract_STAR_(query,res,errs);
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$tree,ret,cljs.core.cst$kw$errors,(cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(errs) : cljs.core.deref.call(null,errs))], null);
});
/**
 * Construct a reconciler from a configuration map.
 * 
 * Required parameters:
 *   :state        - the application state. If IAtom value is not supplied the
 *                   data will be normalized into the default database format
 *                   using the root query. This can be disabled by explicitly
 *                   setting the optional :normalize parameter to false.
 *   :parser       - the parser to be used
 * 
 * Optional parameters:
 *   :shared       - a map of global shared properties for the component tree.
 *   :shared-fn    - a function to compute global shared properties from the root props.
 *                   the result is merged with :shared.
 *   :send         - required only if the parser will return a non-empty value when
 *                   run against the supplied :remotes. send is a function of two
 *                   arguments, the map of remote expressions keyed by remote target
 *                   and a callback which should be invoked with the result from each
 *                   remote target. Note this means the callback can be invoked
 *                   multiple times to support parallel fetching and incremental
 *                   loading if desired. The callback should take the response as the
 *                   first argument and the the query that was sent as the second
 *                   argument.
 *   :normalize    - whether the state should be normalized. If true it is assumed
 *                   all novelty introduced into the system will also need
 *                   normalization.
 *   :remotes      - a vector of keywords representing remote services which can
 *                   evaluate query expressions. Defaults to [:remote]
 *   :root-render  - the root render function. Defaults to ReactDOM.render
 *   :root-unmount - the root unmount function. Defaults to
 *                   ReactDOM.unmountComponentAtNode
 *   :logger       - supply a goog.log compatible logger
 */
om.next.reconciler = (function om$next$reconciler(p__16441){
var map__16446 = p__16441;
var map__16446__$1 = ((((!((map__16446 == null)))?((((map__16446.cljs$lang$protocol_mask$partition0$ & (64))) || (map__16446.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__16446):map__16446);
var config = map__16446__$1;
var root_render = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__16446__$1,cljs.core.cst$kw$root_DASH_render,((function (map__16446,map__16446__$1,config){
return (function (p1__16438_SHARP_,p2__16439_SHARP_){
return ReactDOM.render(p1__16438_SHARP_,p2__16439_SHARP_);
});})(map__16446,map__16446__$1,config))
);
var normalize = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16446__$1,cljs.core.cst$kw$normalize);
var prune_tree = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__16446__$1,cljs.core.cst$kw$prune_DASH_tree,om.next.default_extract_errors);
var pathopt = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__16446__$1,cljs.core.cst$kw$pathopt,false);
var instrument = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16446__$1,cljs.core.cst$kw$instrument);
var id_key = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16446__$1,cljs.core.cst$kw$id_DASH_key);
var merge_sends = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__16446__$1,cljs.core.cst$kw$merge_DASH_sends,((function (map__16446,map__16446__$1,config,root_render,normalize,prune_tree,pathopt,instrument,id_key){
return (function (p1__16436_SHARP_,p2__16437_SHARP_){
return cljs.core.merge_with.cljs$core$IFn$_invoke$arity$variadic(cljs.core.into,cljs.core.array_seq([p1__16436_SHARP_,p2__16437_SHARP_], 0));
});})(map__16446,map__16446__$1,config,root_render,normalize,prune_tree,pathopt,instrument,id_key))
);
var merge_ident = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__16446__$1,cljs.core.cst$kw$merge_DASH_ident,om.next.default_merge_ident);
var remotes = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__16446__$1,cljs.core.cst$kw$remotes,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$remote], null));
var migrate = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__16446__$1,cljs.core.cst$kw$migrate,om.next.default_migrate);
var history = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__16446__$1,cljs.core.cst$kw$history,(100));
var state = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16446__$1,cljs.core.cst$kw$state);
var merge = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__16446__$1,cljs.core.cst$kw$merge,om.next.default_merge);
var shared_fn = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16446__$1,cljs.core.cst$kw$shared_DASH_fn);
var ui__GT_props = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__16446__$1,cljs.core.cst$kw$ui_DASH__GT_props,om.next.default_ui__GT_props);
var parser = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16446__$1,cljs.core.cst$kw$parser);
var indexer = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__16446__$1,cljs.core.cst$kw$indexer,om.next.indexer);
var root_unmount = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__16446__$1,cljs.core.cst$kw$root_DASH_unmount,((function (map__16446,map__16446__$1,config,root_render,normalize,prune_tree,pathopt,instrument,id_key,merge_sends,merge_ident,remotes,migrate,history,state,merge,shared_fn,ui__GT_props,parser,indexer){
return (function (p1__16440_SHARP_){
return ReactDOM.unmountComponentAtNode(p1__16440_SHARP_);
});})(map__16446,map__16446__$1,config,root_render,normalize,prune_tree,pathopt,instrument,id_key,merge_sends,merge_ident,remotes,migrate,history,state,merge,shared_fn,ui__GT_props,parser,indexer))
);
var send = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16446__$1,cljs.core.cst$kw$send);
var merge_tree = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__16446__$1,cljs.core.cst$kw$merge_DASH_tree,om.next.default_merge_tree);
var shared = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16446__$1,cljs.core.cst$kw$shared);
var optimize = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__16446__$1,cljs.core.cst$kw$optimize,((function (map__16446,map__16446__$1,config,root_render,normalize,prune_tree,pathopt,instrument,id_key,merge_sends,merge_ident,remotes,migrate,history,state,merge,shared_fn,ui__GT_props,parser,indexer,root_unmount,send,merge_tree,shared){
return (function (cs){
return cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2(om.next.depth,cs);
});})(map__16446,map__16446__$1,config,root_render,normalize,prune_tree,pathopt,instrument,id_key,merge_sends,merge_ident,remotes,migrate,history,state,merge,shared_fn,ui__GT_props,parser,indexer,root_unmount,send,merge_tree,shared))
);
if(cljs.core.map_QMARK_(config)){
} else {
throw (new Error("Assert failed: (map? config)"));
}

var idxr = (indexer.cljs$core$IFn$_invoke$arity$0 ? indexer.cljs$core$IFn$_invoke$arity$0() : indexer.call(null));
var norm_QMARK_ = ((!((state == null)))?((((state.cljs$lang$protocol_mask$partition1$ & (16384))) || (state.cljs$core$IAtom$))?true:(((!state.cljs$lang$protocol_mask$partition1$))?cljs.core.native_satisfies_QMARK_(cljs.core.IAtom,state):false)):cljs.core.native_satisfies_QMARK_(cljs.core.IAtom,state));
var state_SINGLEQUOTE_ = ((norm_QMARK_)?state:(cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(state) : cljs.core.atom.call(null,state)));
var logger = ((cljs.core.contains_QMARK_(config,cljs.core.cst$kw$logger))?cljs.core.cst$kw$logger.cljs$core$IFn$_invoke$arity$1(config):om.next._STAR_logger_STAR_);
var ret = (new om.next.Reconciler(cljs.core.PersistentHashMap.fromArrays([cljs.core.cst$kw$pathopt,cljs.core.cst$kw$id_DASH_key,cljs.core.cst$kw$instrument,cljs.core.cst$kw$merge_DASH_ident,cljs.core.cst$kw$merge_DASH_sends,cljs.core.cst$kw$remotes,cljs.core.cst$kw$migrate,cljs.core.cst$kw$history,cljs.core.cst$kw$state,cljs.core.cst$kw$merge,cljs.core.cst$kw$shared_DASH_fn,cljs.core.cst$kw$parser,cljs.core.cst$kw$ui_DASH__GT_props,cljs.core.cst$kw$logger,cljs.core.cst$kw$indexer,cljs.core.cst$kw$root_DASH_unmount,cljs.core.cst$kw$send,cljs.core.cst$kw$shared,cljs.core.cst$kw$merge_DASH_tree,cljs.core.cst$kw$optimize,cljs.core.cst$kw$root_DASH_render,cljs.core.cst$kw$normalize,cljs.core.cst$kw$prune_DASH_tree],[pathopt,id_key,instrument,merge_ident,merge_sends,remotes,migrate,om.next.cache.cache(history),state_SINGLEQUOTE_,merge,shared_fn,parser,ui__GT_props,logger,idxr,root_unmount,send,shared,merge_tree,optimize,root_render,(function (){var or__6753__auto__ = !(norm_QMARK_);
if(or__6753__auto__){
return or__6753__auto__;
} else {
return normalize;
}
})(),prune_tree]),(function (){var G__16449 = cljs.core.PersistentHashMap.fromArrays([cljs.core.cst$kw$normalized,cljs.core.cst$kw$remove,cljs.core.cst$kw$queue,cljs.core.cst$kw$sends_DASH_queued,cljs.core.cst$kw$queued_DASH_sends,cljs.core.cst$kw$queued,cljs.core.cst$kw$render,cljs.core.cst$kw$root,cljs.core.cst$kw$t,cljs.core.cst$kw$target],[norm_QMARK_,null,cljs.core.PersistentVector.EMPTY,false,cljs.core.PersistentArrayMap.EMPTY,false,null,null,(0),null]);
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__16449) : cljs.core.atom.call(null,G__16449));
})(),null,null,null));
return ret;
});
/**
 * Returns true if x is a reconciler.
 */
om.next.reconciler_QMARK_ = (function om$next$reconciler_QMARK_(x){
return (x instanceof om.next.Reconciler);
});
/**
 * Return the reconciler's application state atom. Useful when the reconciler
 * was initialized via denormalized data.
 */
om.next.app_state = (function om$next$app_state(reconciler){
if(om.next.reconciler_QMARK_(reconciler)){
} else {
throw (new Error("Assert failed: (reconciler? reconciler)"));
}

return cljs.core.cst$kw$state.cljs$core$IFn$_invoke$arity$1(cljs.core.cst$kw$config.cljs$core$IFn$_invoke$arity$1(reconciler));
});
/**
 * Return the application's root component.
 */
om.next.app_root = (function om$next$app_root(reconciler){
if(om.next.reconciler_QMARK_(reconciler)){
} else {
throw (new Error("Assert failed: (reconciler? reconciler)"));
}

return cljs.core.get.cljs$core$IFn$_invoke$arity$2((function (){var G__16451 = cljs.core.cst$kw$state.cljs$core$IFn$_invoke$arity$1(reconciler);
return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(G__16451) : cljs.core.deref.call(null,G__16451));
})(),cljs.core.cst$kw$root);
});
/**
 * Force a re-render of the root. Not recommended for anything except
 * recomputing :shared.
 */
om.next.force_root_render_BANG_ = (function om$next$force_root_render_BANG_(reconciler){
if(om.next.reconciler_QMARK_(reconciler)){
} else {
throw (new Error("Assert failed: (reconciler? reconciler)"));
}

return cljs.core.get.cljs$core$IFn$_invoke$arity$2((function (){var G__16453 = cljs.core.cst$kw$state.cljs$core$IFn$_invoke$arity$1(reconciler);
return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(G__16453) : cljs.core.deref.call(null,G__16453));
})(),cljs.core.cst$kw$render).call(null);
});
/**
 * Given a reconciler and UUID return the application state snapshost
 * from history associated with the UUID. The size of the reconciler history
 * may be configured by the :history option when constructing the reconciler.
 */
om.next.from_history = (function om$next$from_history(reconciler,uuid){
if(om.next.reconciler_QMARK_(reconciler)){
} else {
throw (new Error("Assert failed: (reconciler? reconciler)"));
}

return cljs.core.cst$kw$history.cljs$core$IFn$_invoke$arity$1(cljs.core.cst$kw$config.cljs$core$IFn$_invoke$arity$1(reconciler)).get(uuid);
});
/**
 * Return a temporary id.
 */
om.next.tempid = (function om$next$tempid(var_args){
var args16454 = [];
var len__7936__auto___16457 = arguments.length;
var i__7937__auto___16458 = (0);
while(true){
if((i__7937__auto___16458 < len__7936__auto___16457)){
args16454.push((arguments[i__7937__auto___16458]));

var G__16459 = (i__7937__auto___16458 + (1));
i__7937__auto___16458 = G__16459;
continue;
} else {
}
break;
}

var G__16456 = args16454.length;
switch (G__16456) {
case 0:
return om.next.tempid.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return om.next.tempid.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args16454.length)].join('')));

}
});

om.next.tempid.cljs$core$IFn$_invoke$arity$0 = (function (){
return om.tempid.tempid.cljs$core$IFn$_invoke$arity$0();
});

om.next.tempid.cljs$core$IFn$_invoke$arity$1 = (function (id){
return om.tempid.tempid.cljs$core$IFn$_invoke$arity$1(id);
});

om.next.tempid.cljs$lang$maxFixedArity = 1;

/**
 * Return true if x is a tempid, false otherwise
 */
om.next.tempid_QMARK_ = (function om$next$tempid_QMARK_(x){
return om.tempid.tempid_QMARK_(x);
});
/**
 * Create a Om Next transit reader. This reader can handler the tempid type.
 * Can pass transit reader customization opts map.
 */
om.next.reader = (function om$next$reader(var_args){
var args16461 = [];
var len__7936__auto___16464 = arguments.length;
var i__7937__auto___16465 = (0);
while(true){
if((i__7937__auto___16465 < len__7936__auto___16464)){
args16461.push((arguments[i__7937__auto___16465]));

var G__16466 = (i__7937__auto___16465 + (1));
i__7937__auto___16465 = G__16466;
continue;
} else {
}
break;
}

var G__16463 = args16461.length;
switch (G__16463) {
case 0:
return om.next.reader.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return om.next.reader.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args16461.length)].join('')));

}
});

om.next.reader.cljs$core$IFn$_invoke$arity$0 = (function (){
return om.transit.reader.cljs$core$IFn$_invoke$arity$0();
});

om.next.reader.cljs$core$IFn$_invoke$arity$1 = (function (opts){
return om.transit.reader.cljs$core$IFn$_invoke$arity$1(opts);
});

om.next.reader.cljs$lang$maxFixedArity = 1;

/**
 * Create a Om Next transit writer. This writer can handler the tempid type.
 * Can pass transit writer customization opts map.
 */
om.next.writer = (function om$next$writer(var_args){
var args16468 = [];
var len__7936__auto___16471 = arguments.length;
var i__7937__auto___16472 = (0);
while(true){
if((i__7937__auto___16472 < len__7936__auto___16471)){
args16468.push((arguments[i__7937__auto___16472]));

var G__16473 = (i__7937__auto___16472 + (1));
i__7937__auto___16472 = G__16473;
continue;
} else {
}
break;
}

var G__16470 = args16468.length;
switch (G__16470) {
case 0:
return om.next.writer.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return om.next.writer.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args16468.length)].join('')));

}
});

om.next.writer.cljs$core$IFn$_invoke$arity$0 = (function (){
return om.transit.writer.cljs$core$IFn$_invoke$arity$0();
});

om.next.writer.cljs$core$IFn$_invoke$arity$1 = (function (opts){
return om.transit.writer.cljs$core$IFn$_invoke$arity$1(opts);
});

om.next.writer.cljs$lang$maxFixedArity = 1;

/**
 * Given a query expression return an equivalent query expression that can be
 * spliced into a transaction that will force a read of that key from the
 * specified remote target.
 */
om.next.force = (function om$next$force(var_args){
var args16475 = [];
var len__7936__auto___16478 = arguments.length;
var i__7937__auto___16479 = (0);
while(true){
if((i__7937__auto___16479 < len__7936__auto___16478)){
args16475.push((arguments[i__7937__auto___16479]));

var G__16480 = (i__7937__auto___16479 + (1));
i__7937__auto___16479 = G__16480;
continue;
} else {
}
break;
}

var G__16477 = args16475.length;
switch (G__16477) {
case 1:
return om.next.force.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return om.next.force.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args16475.length)].join('')));

}
});

om.next.force.cljs$core$IFn$_invoke$arity$1 = (function (expr){
return om.next.force.cljs$core$IFn$_invoke$arity$2(expr,cljs.core.cst$kw$remote);
});

om.next.force.cljs$core$IFn$_invoke$arity$2 = (function (expr,target){
return cljs.core.with_meta(cljs.core._conj((function (){var x__7679__auto__ = expr;
return cljs.core._conj(cljs.core.List.EMPTY,x__7679__auto__);
})(),cljs.core.cst$sym$quote),new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$target,target], null));
});

om.next.force.cljs$lang$maxFixedArity = 2;

