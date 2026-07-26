// Compiled by ClojureScript 1.9.89 {:static-fns true, :optimize-constants true}
goog.provide('ui.core');
goog.require('cljs.core');
goog.require('goog.dom');
goog.require('goog.string');
goog.require('ui.csd_orc');
goog.require('om.dom');
goog.require('ui.util');
goog.require('goog.string.format');
goog.require('om.next');
goog.require('clojure.string');
cljs.core.enable_console_print_BANG_();
ui.core.app_state = (function (){var G__16537 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__16537) : cljs.core.atom.call(null,G__16537));
})();
ui.core.pat__GT_str = (function ui$core$pat__GT_str(v){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core.str,"",v);
});
/**
 * remove elem in coll
 */
ui.core.vec_remove = (function ui$core$vec_remove(coll,pos){
return cljs.core.vec(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(cljs.core.subvec.cljs$core$IFn$_invoke$arity$3(coll,(0),pos),cljs.core.subvec.cljs$core$IFn$_invoke$arity$2(coll,(pos + (1)))));
});
ui.core.pat_msg_parser = (function ui$core$pat_msg_parser(event_data){
var split = clojure.string.split.cljs$core$IFn$_invoke$arity$2(event_data,/:/);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.first(split),(function (){var G__16539 = cljs.core.second(split);
return goog.string.parseInt(G__16539);
})()], null);
});
ui.core.csd_orc = "\n  alwayson \"sequencer\"\n  alwayson \"synth\"\n  alwayson \"bass_drum\"\n\n  opcode PatStringToArray, k[], Sk[]\n  StrIn,kArr[] xin\n  kstrlen strlenk StrIn\n  kpos = 0\n  while kpos < kstrlen do\n  kcomp strcmpk \"1\", strsubk(StrIn, kpos, kpos+1)\n  if kcomp == 0 then\n  kArr[kpos] = 0\n  kpos +=1\n  else\n  kArr[kpos] = 1\n  kpos +=1\n  endif\n  od\n  xout kArr\n  endop\n\n  gi_sine ftgen 0, 0, 65537, 10, 1\n\n  gaclock init 0\n  gkbeat init 0\n  gktempo init 100\n\n  instr sequencer \n  gkbeat = 60 / (gktempo * 4)\n  gaclock = mpulse(1, gkbeat)\n  endin\n\n  gkcnt init 0\n\n  instr synth\n  ;; Spattern init \"\"\n  kpattern[] init 100\n  S_Arr[] init 100\n  kbeat init 0\n  karrlen init 2\n  aclock = gaclock\n  aretrig init 0\n  karrlen chnget \"pat1len\"\n  Spattern chnget \"pat1pat\"\n\n  agate = gatesig(aclock, 0.02)\n  kpattern PatStringToArray Spattern, kpattern\n\n  atrg, kindx seqsig aclock, karrlen, kpattern\n  aenv adsr140 agate * atrg, aretrig, 0.001, 0.25, 0.001, 0.25\n  \n  ;; printks SpatternIn, 1\n\n  printks2 \"pat1:%d\", kindx\n\n  apch init cps2pch(7.02, 12)\n  aout = vco(1, apch , 1, 0.5, gi_sine)\n  aout += vco(0.5, apch * 1.5, 2, 0.5, gi_sine)\n  aout += rand:a(0.05)\n  kcps = (gktempo / 60) / 16\n  kcut = lfo(0.4, kcps , 1) + 0.6 \n  ;; aout moogladder aout, (200 * (1 + (kcut * 2))) * (1 + aenv * 8), 0.8\n  aout zdf_ladder aout, (200 * (1 + (kcut * 1.8))) * (1 + aenv * 8), a(0.6)\n  aout *= aenv\n  al, ar pan2 aout, 0.4\n  outc al, ar\n  endin\n\n  instr bass_drum ;; drums\n  agate = gatesig(gaclock, 0.45 * gkbeat)\n  aretrig init 0\n  iamp = ampdbfs(-18)\n  karrlen chnget \"pat2len\"\n  Spattern chnget \"pat2pat\"\n  kpattern[] init 100\n  kpattern PatStringToArray Spattern, kpattern\n  atrg, kindx seqsig gaclock, karrlen, kpattern\n  printks2 \"pat2:%d\", kindx\n  aenv adsr140 agate * atrg, aretrig, 0.01, 0.25, 0.0001, 0.0001 \n  avcoenv adsr140 agate * atrg, aretrig, 0.001, 0.15, 0.0001, 0.0001 \n\n\n  ;; good enough for sketching...\n  aout = butterlp(\n          resonr(vco(1.0, 70 + avcoenv * 220, 3, 0.5, gi_sine), 400, 200), 1200)\n\n  ;; aout += butterlp(noise(aenv, 0), 200) \n  aout *=  0.2 * iamp * aenv\n\n  outc(aout, aout)\n  endin\n  ";
ui.core.knobs = (function ui$core$knobs(pat_name,this$){
var csound = goog.dom.getElement("csound_module");
var pat_index = cljs.core.get.cljs$core$IFn$_invoke$arity$2(om.next.get_state.cljs$core$IFn$_invoke$arity$1(this$),cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(pat_name));
var pat_pat_k = cljs.core.keyword.cljs$core$IFn$_invoke$arity$1([cljs.core.str(pat_name),cljs.core.str("pat")].join(''));
var pat_pat = cljs.core.get.cljs$core$IFn$_invoke$arity$2(om.next.get_state.cljs$core$IFn$_invoke$arity$1(this$),pat_pat_k);
var pat_pat_cnt = cljs.core.count(pat_pat);
return cljs.core.apply.cljs$core$IFn$_invoke$arity$3(om.dom.li,cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$style,{"height": "60px"}], null)),(function (){var iter__7607__auto__ = ((function (csound,pat_index,pat_pat_k,pat_pat,pat_pat_cnt){
return (function ui$core$knobs_$_iter__16742(s__16743){
return (new cljs.core.LazySeq(null,((function (csound,pat_index,pat_pat_k,pat_pat,pat_pat_cnt){
return (function (){
var s__16743__$1 = s__16743;
while(true){
var temp__6503__auto__ = cljs.core.seq(s__16743__$1);
if(temp__6503__auto__){
var s__16743__$2 = temp__6503__auto__;
if(cljs.core.chunked_seq_QMARK_(s__16743__$2)){
var c__7605__auto__ = cljs.core.chunk_first(s__16743__$2);
var size__7606__auto__ = cljs.core.count(c__7605__auto__);
var b__16745 = cljs.core.chunk_buffer(size__7606__auto__);
if((function (){var i__16744 = (0);
while(true){
if((i__16744 < size__7606__auto__)){
var knob_num = cljs.core._nth.cljs$core$IFn$_invoke$arity$2(c__7605__auto__,i__16744);
cljs.core.chunk_append(b__16745,(function (){var G__16846 = cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$className,"knob-outer",cljs.core.cst$kw$style,{"width": "60px", "height": "60px", "display": "inline-block", "backgroundColor": (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(knob_num,pat_index)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((2),cljs.core.get.cljs$core$IFn$_invoke$arity$2(pat_pat,knob_num))))?"#e2e2e2":"white")}], null));
var G__16847 = om.util.force_children(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(knob_num,pat_pat_cnt))?((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((1),cljs.core.get.cljs$core$IFn$_invoke$arity$2(pat_pat,knob_num)))?(function (){var G__16851 = cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$onClick,((function (i__16744,G__16846,knob_num,c__7605__auto__,size__7606__auto__,b__16745,s__16743__$2,temp__6503__auto__,csound,pat_index,pat_pat_k,pat_pat,pat_pat_cnt){
return (function (){
om.next.update_state_BANG_.cljs$core$IFn$_invoke$arity$4(this$,cljs.core.assoc,pat_pat_k,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(pat_pat,knob_num,(2)));

return csound.postMessage((function (){var G__16852 = "schannel:%spat:%d";
var G__16853 = pat_name;
var G__16854 = ui.core.pat__GT_str(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(pat_pat,knob_num,(2)));
return goog.string.format(G__16852,G__16853,G__16854);
})());
});})(i__16744,G__16846,knob_num,c__7605__auto__,size__7606__auto__,b__16745,s__16743__$2,temp__6503__auto__,csound,pat_index,pat_pat_k,pat_pat,pat_pat_cnt))
,cljs.core.cst$kw$className,"knob-inner-inactive",cljs.core.cst$kw$style,{"height": "40px", "width": "40px", "margin": "10px", "cursor": "pointer", "boxSizing": "border-box", "border": "5px solid gray"}], null));
return React.DOM.div(G__16851);
})():(function (){var G__16858 = cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$onClick,((function (i__16744,G__16846,knob_num,c__7605__auto__,size__7606__auto__,b__16745,s__16743__$2,temp__6503__auto__,csound,pat_index,pat_pat_k,pat_pat,pat_pat_cnt){
return (function (){
om.next.update_state_BANG_.cljs$core$IFn$_invoke$arity$4(this$,cljs.core.assoc,pat_pat_k,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(pat_pat,knob_num,(1)));

return csound.postMessage((function (){var G__16859 = "schannel:%spat:%d";
var G__16860 = pat_name;
var G__16861 = ui.core.pat__GT_str(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(pat_pat,knob_num,(1)));
return goog.string.format(G__16859,G__16860,G__16861);
})());
});})(i__16744,G__16846,knob_num,c__7605__auto__,size__7606__auto__,b__16745,s__16743__$2,temp__6503__auto__,csound,pat_index,pat_pat_k,pat_pat,pat_pat_cnt))
,cljs.core.cst$kw$className,"knob-inner-active",cljs.core.cst$kw$style,{"height": "40px", "width": "40px", "margin": "10px", "cursor": "pointer"}], null));
return React.DOM.div(G__16858);
})()):(function (){var G__16862 = cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$style,{"width": "150px", "height": "30px"}], null));
var G__16863 = om.util.force_children((function (){var G__16872 = cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$onClick,((function (i__16744,G__16862,G__16846,knob_num,c__7605__auto__,size__7606__auto__,b__16745,s__16743__$2,temp__6503__auto__,csound,pat_index,pat_pat_k,pat_pat,pat_pat_cnt){
return (function (){
om.next.update_state_BANG_.cljs$core$IFn$_invoke$arity$4(this$,cljs.core.assoc,pat_pat_k,cljs.core.vec(cljs.core.butlast(pat_pat)));

var G__16873 = csound;
G__16873.postMessage((function (){var G__16874 = "channel:%slen:%d";
var G__16875 = pat_name;
var G__16876 = (pat_pat_cnt - (1));
return goog.string.format(G__16874,G__16875,G__16876);
})());

G__16873.postMessage((function (){var G__16877 = "schannel:%spat:%d";
var G__16878 = pat_name;
var G__16879 = ui.core.pat__GT_str(cljs.core.vec(cljs.core.butlast(pat_pat)));
return goog.string.format(G__16877,G__16878,G__16879);
})());

return G__16873;
});})(i__16744,G__16862,G__16846,knob_num,c__7605__auto__,size__7606__auto__,b__16745,s__16743__$2,temp__6503__auto__,csound,pat_index,pat_pat_k,pat_pat,pat_pat_cnt))
,cljs.core.cst$kw$src,"fonts/minus.png",cljs.core.cst$kw$style,{"cursor": "pointer", "marginBottom": "20px", "marginLeft": "10px", "height": "20px", "width": "20px"}], null));
return React.DOM.img(G__16872);
})());
var G__16864 = om.util.force_children((function (){var G__16887 = cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$onClick,((function (i__16744,G__16862,G__16863,G__16846,knob_num,c__7605__auto__,size__7606__auto__,b__16745,s__16743__$2,temp__6503__auto__,csound,pat_index,pat_pat_k,pat_pat,pat_pat_cnt){
return (function (){
om.next.update_state_BANG_.cljs$core$IFn$_invoke$arity$4(this$,cljs.core.assoc,pat_pat_k,cljs.core.conj.cljs$core$IFn$_invoke$arity$2(pat_pat,(1)));

var G__16888 = csound;
G__16888.postMessage((function (){var G__16889 = "channel:%slen:%d";
var G__16890 = pat_name;
var G__16891 = (pat_pat_cnt + (1));
return goog.string.format(G__16889,G__16890,G__16891);
})());

G__16888.postMessage((function (){var G__16892 = "schannel:%spat:%d";
var G__16893 = pat_name;
var G__16894 = ui.core.pat__GT_str(cljs.core.conj.cljs$core$IFn$_invoke$arity$2(pat_pat,(1)));
return goog.string.format(G__16892,G__16893,G__16894);
})());

return G__16888;
});})(i__16744,G__16862,G__16863,G__16846,knob_num,c__7605__auto__,size__7606__auto__,b__16745,s__16743__$2,temp__6503__auto__,csound,pat_index,pat_pat_k,pat_pat,pat_pat_cnt))
,cljs.core.cst$kw$src,"fonts/plus.png",cljs.core.cst$kw$style,{"cursor": "pointer", "marginBottom": "20px", "marginLeft": "10px", "height": "20px", "width": "20px"}], null));
return React.DOM.img(G__16887);
})());
return React.DOM.div(G__16862,G__16863,G__16864);
})()));
return React.DOM.div(G__16846,G__16847);
})());

var G__16944 = (i__16744 + (1));
i__16744 = G__16944;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__16745),ui$core$knobs_$_iter__16742(cljs.core.chunk_rest(s__16743__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__16745),null);
}
} else {
var knob_num = cljs.core.first(s__16743__$2);
return cljs.core.cons((function (){var G__16895 = cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$className,"knob-outer",cljs.core.cst$kw$style,{"width": "60px", "height": "60px", "display": "inline-block", "backgroundColor": (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(knob_num,pat_index)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((2),cljs.core.get.cljs$core$IFn$_invoke$arity$2(pat_pat,knob_num))))?"#e2e2e2":"white")}], null));
var G__16896 = om.util.force_children(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(knob_num,pat_pat_cnt))?((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((1),cljs.core.get.cljs$core$IFn$_invoke$arity$2(pat_pat,knob_num)))?(function (){var G__16900 = cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$onClick,((function (G__16895,knob_num,s__16743__$2,temp__6503__auto__,csound,pat_index,pat_pat_k,pat_pat,pat_pat_cnt){
return (function (){
om.next.update_state_BANG_.cljs$core$IFn$_invoke$arity$4(this$,cljs.core.assoc,pat_pat_k,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(pat_pat,knob_num,(2)));

return csound.postMessage((function (){var G__16901 = "schannel:%spat:%d";
var G__16902 = pat_name;
var G__16903 = ui.core.pat__GT_str(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(pat_pat,knob_num,(2)));
return goog.string.format(G__16901,G__16902,G__16903);
})());
});})(G__16895,knob_num,s__16743__$2,temp__6503__auto__,csound,pat_index,pat_pat_k,pat_pat,pat_pat_cnt))
,cljs.core.cst$kw$className,"knob-inner-inactive",cljs.core.cst$kw$style,{"height": "40px", "width": "40px", "margin": "10px", "cursor": "pointer", "boxSizing": "border-box", "border": "5px solid gray"}], null));
return React.DOM.div(G__16900);
})():(function (){var G__16907 = cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$onClick,((function (G__16895,knob_num,s__16743__$2,temp__6503__auto__,csound,pat_index,pat_pat_k,pat_pat,pat_pat_cnt){
return (function (){
om.next.update_state_BANG_.cljs$core$IFn$_invoke$arity$4(this$,cljs.core.assoc,pat_pat_k,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(pat_pat,knob_num,(1)));

return csound.postMessage((function (){var G__16908 = "schannel:%spat:%d";
var G__16909 = pat_name;
var G__16910 = ui.core.pat__GT_str(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(pat_pat,knob_num,(1)));
return goog.string.format(G__16908,G__16909,G__16910);
})());
});})(G__16895,knob_num,s__16743__$2,temp__6503__auto__,csound,pat_index,pat_pat_k,pat_pat,pat_pat_cnt))
,cljs.core.cst$kw$className,"knob-inner-active",cljs.core.cst$kw$style,{"height": "40px", "width": "40px", "margin": "10px", "cursor": "pointer"}], null));
return React.DOM.div(G__16907);
})()):(function (){var G__16911 = cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$style,{"width": "150px", "height": "30px"}], null));
var G__16912 = om.util.force_children((function (){var G__16921 = cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$onClick,((function (G__16911,G__16895,knob_num,s__16743__$2,temp__6503__auto__,csound,pat_index,pat_pat_k,pat_pat,pat_pat_cnt){
return (function (){
om.next.update_state_BANG_.cljs$core$IFn$_invoke$arity$4(this$,cljs.core.assoc,pat_pat_k,cljs.core.vec(cljs.core.butlast(pat_pat)));

var G__16922 = csound;
G__16922.postMessage((function (){var G__16923 = "channel:%slen:%d";
var G__16924 = pat_name;
var G__16925 = (pat_pat_cnt - (1));
return goog.string.format(G__16923,G__16924,G__16925);
})());

G__16922.postMessage((function (){var G__16926 = "schannel:%spat:%d";
var G__16927 = pat_name;
var G__16928 = ui.core.pat__GT_str(cljs.core.vec(cljs.core.butlast(pat_pat)));
return goog.string.format(G__16926,G__16927,G__16928);
})());

return G__16922;
});})(G__16911,G__16895,knob_num,s__16743__$2,temp__6503__auto__,csound,pat_index,pat_pat_k,pat_pat,pat_pat_cnt))
,cljs.core.cst$kw$src,"fonts/minus.png",cljs.core.cst$kw$style,{"cursor": "pointer", "marginBottom": "20px", "marginLeft": "10px", "height": "20px", "width": "20px"}], null));
return React.DOM.img(G__16921);
})());
var G__16913 = om.util.force_children((function (){var G__16936 = cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$onClick,((function (G__16911,G__16912,G__16895,knob_num,s__16743__$2,temp__6503__auto__,csound,pat_index,pat_pat_k,pat_pat,pat_pat_cnt){
return (function (){
om.next.update_state_BANG_.cljs$core$IFn$_invoke$arity$4(this$,cljs.core.assoc,pat_pat_k,cljs.core.conj.cljs$core$IFn$_invoke$arity$2(pat_pat,(1)));

var G__16937 = csound;
G__16937.postMessage((function (){var G__16938 = "channel:%slen:%d";
var G__16939 = pat_name;
var G__16940 = (pat_pat_cnt + (1));
return goog.string.format(G__16938,G__16939,G__16940);
})());

G__16937.postMessage((function (){var G__16941 = "schannel:%spat:%d";
var G__16942 = pat_name;
var G__16943 = ui.core.pat__GT_str(cljs.core.conj.cljs$core$IFn$_invoke$arity$2(pat_pat,(1)));
return goog.string.format(G__16941,G__16942,G__16943);
})());

return G__16937;
});})(G__16911,G__16912,G__16895,knob_num,s__16743__$2,temp__6503__auto__,csound,pat_index,pat_pat_k,pat_pat,pat_pat_cnt))
,cljs.core.cst$kw$src,"fonts/plus.png",cljs.core.cst$kw$style,{"cursor": "pointer", "marginBottom": "20px", "marginLeft": "10px", "height": "20px", "width": "20px"}], null));
return React.DOM.img(G__16936);
})());
return React.DOM.div(G__16911,G__16912,G__16913);
})()));
return React.DOM.div(G__16895,G__16896);
})(),ui$core$knobs_$_iter__16742(cljs.core.rest(s__16743__$2)));
}
} else {
return null;
}
break;
}
});})(csound,pat_index,pat_pat_k,pat_pat,pat_pat_cnt))
,null,null));
});})(csound,pat_index,pat_pat_k,pat_pat,pat_pat_cnt))
;
return iter__7607__auto__(cljs.core.range.cljs$core$IFn$_invoke$arity$1((pat_pat_cnt + (1))));
})());
});
/**
 * @constructor
 */
ui.core.Root = (function ui$core$Root(){
var this__15187__auto__ = this;
React.Component.apply(this__15187__auto__,arguments);

if(!((this__15187__auto__.initLocalState == null))){
this__15187__auto__.state = this__15187__auto__.initLocalState();
} else {
this__15187__auto__.state = {};
}

return this__15187__auto__;
});

ui.core.Root.prototype = goog.object.clone(React.Component.prototype);

var x16949_16988 = ui.core.Root.prototype;
x16949_16988.componentWillUpdate = ((function (x16949_16988){
return (function (next_props__15066__auto__,next_state__15067__auto__){
var this__15065__auto__ = this;
if(((!((this__15065__auto__ == null)))?(((false) || (this__15065__auto__.om$next$Ident$))?true:false):false)){
var ident__15069__auto___16989 = om.next.ident(this__15065__auto__,om.next.props(this__15065__auto__));
var next_ident__15070__auto___16990 = om.next.ident(this__15065__auto__,om.next._next_props(next_props__15066__auto__,this__15065__auto__));
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(ident__15069__auto___16989,next_ident__15070__auto___16990)){
var idxr__15071__auto___16991 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(om.next.get_reconciler(this__15065__auto__),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$config,cljs.core.cst$kw$indexer], null));
if((idxr__15071__auto___16991 == null)){
} else {
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$indexes.cljs$core$IFn$_invoke$arity$1(idxr__15071__auto___16991),((function (idxr__15071__auto___16991,ident__15069__auto___16989,next_ident__15070__auto___16990,this__15065__auto__,x16949_16988){
return (function (indexes__15072__auto__){
return cljs.core.update_in.cljs$core$IFn$_invoke$arity$4(cljs.core.update_in.cljs$core$IFn$_invoke$arity$4(indexes__15072__auto__,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$ref_DASH__GT_components,ident__15069__auto___16989], null),cljs.core.disj,this__15065__auto__),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$ref_DASH__GT_components,next_ident__15070__auto___16990], null),cljs.core.fnil.cljs$core$IFn$_invoke$arity$2(cljs.core.conj,cljs.core.PersistentHashSet.EMPTY),this__15065__auto__);
});})(idxr__15071__auto___16991,ident__15069__auto___16989,next_ident__15070__auto___16990,this__15065__auto__,x16949_16988))
);
}
} else {
}
} else {
}

om.next.merge_pending_props_BANG_(this__15065__auto__);

return om.next.merge_pending_state_BANG_(this__15065__auto__);
});})(x16949_16988))
;

x16949_16988.shouldComponentUpdate = ((function (x16949_16988){
return (function (next_props__15066__auto__,next_state__15067__auto__){
var this__15065__auto__ = this;
var next_children__15068__auto__ = next_props__15066__auto__.children;
var next_props__15066__auto____$1 = goog.object.get(next_props__15066__auto__,"omcljs$value");
var next_props__15066__auto____$2 = (function (){var G__16951 = next_props__15066__auto____$1;
if((next_props__15066__auto____$1 instanceof om.next.OmProps)){
return om.next.unwrap(G__16951);
} else {
return G__16951;
}
})();
var or__6753__auto__ = cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(om.next.props(this__15065__auto__),next_props__15066__auto____$2);
if(or__6753__auto__){
return or__6753__auto__;
} else {
var or__6753__auto____$1 = (function (){var and__6741__auto__ = this__15065__auto__.state;
if(cljs.core.truth_(and__6741__auto__)){
return cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2((function (){var G__16956 = this__15065__auto__.state;
var G__16957 = "omcljs$state";
return goog.object.get(G__16956,G__16957);
})(),goog.object.get(next_state__15067__auto__,"omcljs$state"));
} else {
return and__6741__auto__;
}
})();
if(cljs.core.truth_(or__6753__auto____$1)){
return or__6753__auto____$1;
} else {
return cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(this__15065__auto__.props.children,next_children__15068__auto__);
}
}
});})(x16949_16988))
;

x16949_16988.componentWillUnmount = ((function (x16949_16988){
return (function (){
var this__15065__auto__ = this;
var r__15076__auto__ = om.next.get_reconciler(this__15065__auto__);
var cfg__15077__auto__ = cljs.core.cst$kw$config.cljs$core$IFn$_invoke$arity$1(r__15076__auto__);
var st__15078__auto__ = cljs.core.cst$kw$state.cljs$core$IFn$_invoke$arity$1(cfg__15077__auto__);
var indexer__15075__auto__ = cljs.core.cst$kw$indexer.cljs$core$IFn$_invoke$arity$1(cfg__15077__auto__);
if(cljs.core.truth_((function (){var and__6741__auto__ = !((st__15078__auto__ == null));
if(and__6741__auto__){
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(st__15078__auto__) : cljs.core.deref.call(null,st__15078__auto__)),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$om$next_SLASH_queries,this__15065__auto__], null));
} else {
return and__6741__auto__;
}
})())){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(st__15078__auto__,cljs.core.update_in,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$om$next_SLASH_queries], null),cljs.core.dissoc,cljs.core.array_seq([this__15065__auto__], 0));
} else {
}

if((indexer__15075__auto__ == null)){
return null;
} else {
return om.next.protocols.drop_component_BANG_(indexer__15075__auto__,this__15065__auto__);
}
});})(x16949_16988))
;

x16949_16988.componentDidUpdate = ((function (x16949_16988){
return (function (prev_props__15073__auto__,prev_state__15074__auto__){
var this__15065__auto__ = this;
return om.next.clear_prev_props_BANG_(this__15065__auto__);
});})(x16949_16988))
;

x16949_16988.isMounted = ((function (x16949_16988){
return (function (){
var this__15065__auto__ = this;
return cljs.core.boolean$(goog.object.getValueByKeys(this__15065__auto__,"_reactInternalInstance","_renderedComponent"));
});})(x16949_16988))
;

x16949_16988.componentWillMount = ((function (x16949_16988){
return (function (){
var this__15065__auto__ = this;
var indexer__15075__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(om.next.get_reconciler(this__15065__auto__),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$config,cljs.core.cst$kw$indexer], null));
if((indexer__15075__auto__ == null)){
return null;
} else {
return om.next.protocols.index_component_BANG_(indexer__15075__auto__,this__15065__auto__);
}
});})(x16949_16988))
;

x16949_16988.initLocalState = ((function (x16949_16988){
return (function (){
var this$ = this;
var ret__15043__auto__ = new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$pat1pat,new cljs.core.PersistentVector(null, 9, 5, cljs.core.PersistentVector.EMPTY_NODE, [(1),(1),(1),(2),(2),(2),(1),(2),(1)], null),cljs.core.cst$kw$pat2pat,new cljs.core.PersistentVector(null, 9, 5, cljs.core.PersistentVector.EMPTY_NODE, [(2),(1),(2),(1),(1),(1),(1),(1),(2)], null)], null);
var obj16959 = {"omcljs$state":ret__15043__auto__};
return obj16959;
});})(x16949_16988))
;

x16949_16988.componentDidMount = ((function (x16949_16988){
return (function (){
var this$ = this;
var map__16960 = om.next.get_state.cljs$core$IFn$_invoke$arity$1(this$);
var map__16960__$1 = ((((!((map__16960 == null)))?((((map__16960.cljs$lang$protocol_mask$partition0$ & (64))) || (map__16960.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__16960):map__16960);
var pat1pat = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16960__$1,cljs.core.cst$kw$pat1pat);
var pat2pat = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16960__$1,cljs.core.cst$kw$pat2pat);
var csound = goog.dom.getElement("csound_module");
om.next.update_state_BANG_.cljs$core$IFn$_invoke$arity$4(this$,cljs.core.assoc,cljs.core.cst$kw$csound,csound);

csound.addEventListener("message",((function (map__16960,map__16960__$1,pat1pat,pat2pat,csound,this$,x16949_16988){
return (function (e){
if(!(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("pat",cljs.core.subs.cljs$core$IFn$_invoke$arity$3(e.data,(0),(3))))){
var G__16962 = [cljs.core.str(e.data)].join('');
return console.log(G__16962);
} else {
var vec__16963 = ui.core.pat_msg_parser(e.data);
var pat_name = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16963,(0),null);
var pat_value = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__16963,(1),null);
return om.next.update_state_BANG_.cljs$core$IFn$_invoke$arity$4(this$,cljs.core.assoc,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(pat_name),pat_value);
}
});})(map__16960,map__16960__$1,pat1pat,pat2pat,csound,this$,x16949_16988))
);

csound.postMessage("playCsound");

var G__16966_16992 = csound;
G__16966_16992.postMessage([cljs.core.str("channel:pat1len:"),cljs.core.str(cljs.core.count(pat1pat))].join(''));

G__16966_16992.postMessage([cljs.core.str("schannel:pat1pat:"),cljs.core.str(ui.core.pat__GT_str(pat1pat))].join(''));

G__16966_16992.postMessage([cljs.core.str("channel:pat2len:"),cljs.core.str(cljs.core.count(pat2pat))].join(''));

G__16966_16992.postMessage([cljs.core.str("schannel:pat2pat:"),cljs.core.str(ui.core.pat__GT_str(pat2pat))].join(''));


return csound.postMessage([cljs.core.str("orchestra:"),cljs.core.str(ui.csd_orc.patter_sequencer),cljs.core.str(ui.core.csd_orc)].join(''));
});})(x16949_16988))
;

x16949_16988.render = ((function (x16949_16988){
return (function (){
var this__15064__auto__ = this;
var this$ = this__15064__auto__;
var _STAR_reconciler_STAR_16967 = om.next._STAR_reconciler_STAR_;
var _STAR_depth_STAR_16968 = om.next._STAR_depth_STAR_;
var _STAR_shared_STAR_16969 = om.next._STAR_shared_STAR_;
var _STAR_instrument_STAR_16970 = om.next._STAR_instrument_STAR_;
var _STAR_parent_STAR_16971 = om.next._STAR_parent_STAR_;
om.next._STAR_reconciler_STAR_ = om.next.get_reconciler(this__15064__auto__);

om.next._STAR_depth_STAR_ = (om.next.depth(this__15064__auto__) + (1));

om.next._STAR_shared_STAR_ = om.next.shared.cljs$core$IFn$_invoke$arity$1(this__15064__auto__);

om.next._STAR_instrument_STAR_ = om.next.instrument(this__15064__auto__);

om.next._STAR_parent_STAR_ = this__15064__auto__;

try{var map__16972 = om.next.get_state.cljs$core$IFn$_invoke$arity$1(this$);
var map__16972__$1 = ((((!((map__16972 == null)))?((((map__16972.cljs$lang$protocol_mask$partition0$ & (64))) || (map__16972.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__16972):map__16972);
var csound = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__16972__$1,cljs.core.cst$kw$csound);
var G__16976 = null;
var G__16977 = om.util.force_children((function (){var G__16980 = null;
var G__16981 = om.util.force_children([cljs.core.str("Sequencer")].join(''));
return React.DOM.h4(G__16980,G__16981);
})());
var G__16978 = om.util.force_children((function (){var G__16982 = {"style": {"display": "block", "listStyleType": "none", "width": "1500px"}};
var G__16983 = om.util.force_children(ui.core.knobs("pat1",this$));
var G__16984 = om.util.force_children(ui.core.knobs("pat2",this$));
return React.DOM.ul(G__16982,G__16983,G__16984);
})());
var G__16979 = om.util.force_children((function (){var G__16985 = cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 5, [cljs.core.cst$kw$name,"csound_module",cljs.core.cst$kw$id,"csound_module",cljs.core.cst$kw$src,"js/pnacl/Release/csound.nmf",cljs.core.cst$kw$type,"application/x-pnacl",cljs.core.cst$kw$style,{"position": "absolute", "zIndex": "-99999"}], null));
return React.DOM.embed(G__16985);
})());
return React.DOM.div(G__16976,G__16977,G__16978,G__16979);
}finally {om.next._STAR_parent_STAR_ = _STAR_parent_STAR_16971;

om.next._STAR_instrument_STAR_ = _STAR_instrument_STAR_16970;

om.next._STAR_shared_STAR_ = _STAR_shared_STAR_16969;

om.next._STAR_depth_STAR_ = _STAR_depth_STAR_16968;

om.next._STAR_reconciler_STAR_ = _STAR_reconciler_STAR_16967;
}});})(x16949_16988))
;


ui.core.Root.prototype.constructor = ui.core.Root;

ui.core.Root.prototype.constructor.displayName = "ui.core/Root";

ui.core.Root.prototype.om$isComponent = true;

var x16986_16993 = ui.core.Root;


var x16987_16994 = ui.core.Root.prototype;


ui.core.Root.cljs$lang$type = true;

ui.core.Root.cljs$lang$ctorStr = "ui.core/Root";

ui.core.Root.cljs$lang$ctorPrWriter = (function (this__15190__auto__,writer__15191__auto__,opt__15192__auto__){
return cljs.core._write(writer__15191__auto__,"ui.core/Root");
});
if(typeof ui.core.read !== 'undefined'){
} else {
ui.core.read = (function (){var method_table__7776__auto__ = (function (){var G__16995 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__16995) : cljs.core.atom.call(null,G__16995));
})();
var prefer_table__7777__auto__ = (function (){var G__16996 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__16996) : cljs.core.atom.call(null,G__16996));
})();
var method_cache__7778__auto__ = (function (){var G__16997 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__16997) : cljs.core.atom.call(null,G__16997));
})();
var cached_hierarchy__7779__auto__ = (function (){var G__16998 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__16998) : cljs.core.atom.call(null,G__16998));
})();
var hierarchy__7780__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.cst$kw$hierarchy,cljs.core.get_global_hierarchy());
return (new cljs.core.MultiFn(cljs.core.symbol.cljs$core$IFn$_invoke$arity$2("ui.core","read"),om.next.dispatch,cljs.core.cst$kw$default,hierarchy__7780__auto__,method_table__7776__auto__,prefer_table__7777__auto__,method_cache__7778__auto__,cached_hierarchy__7779__auto__));
})();
}
if(typeof ui.core.mutate !== 'undefined'){
} else {
ui.core.mutate = (function (){var method_table__7776__auto__ = (function (){var G__16999 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__16999) : cljs.core.atom.call(null,G__16999));
})();
var prefer_table__7777__auto__ = (function (){var G__17000 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__17000) : cljs.core.atom.call(null,G__17000));
})();
var method_cache__7778__auto__ = (function (){var G__17001 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__17001) : cljs.core.atom.call(null,G__17001));
})();
var cached_hierarchy__7779__auto__ = (function (){var G__17002 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__17002) : cljs.core.atom.call(null,G__17002));
})();
var hierarchy__7780__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.cst$kw$hierarchy,cljs.core.get_global_hierarchy());
return (new cljs.core.MultiFn(cljs.core.symbol.cljs$core$IFn$_invoke$arity$2("ui.core","mutate"),om.next.dispatch,cljs.core.cst$kw$default,hierarchy__7780__auto__,method_table__7776__auto__,prefer_table__7777__auto__,method_cache__7778__auto__,cached_hierarchy__7779__auto__));
})();
}
ui.core.reconciler = om.next.reconciler(new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$state,ui.core.app_state,cljs.core.cst$kw$parser,om.next.parser(new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$read,ui.core.read,cljs.core.cst$kw$mutate,ui.core.mutate], null))], null));
ui.core.init = (function ui$core$init(){
return om.next.add_root_BANG_.cljs$core$IFn$_invoke$arity$3(ui.core.reconciler,ui.core.Root,goog.dom.getElement("app"));
});
goog.exportSymbol('ui.core.init', ui.core.init);
ui.core.init();
