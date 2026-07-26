(ns ui.core
  (:require [om.next :as om :refer-macros [defui]]
            [om.dom :as dom]
            [ui.csd-orc :refer [patter-sequencer]]
            [ui.util :refer [transit-post]]
            [goog.dom :as gdom]
            [goog.string :as gstring]
            [goog.string.format]
            [clojure.string :as str]))


(enable-console-print!)

(def app-state (atom {}))

(defn pat->str [v]
  (reduce str "" v))

(defn vec-remove
  "remove elem in coll"
  [coll pos]
  (vec (concat (subvec coll 0 pos) (subvec coll (inc pos)))))


(defn pat-msg-parser [event-data]
  (let [split (str/split event-data #":")]
    [(first split)
     (gstring/parseInt
      (second split))]))

(def csd-orc
  "
  alwayson \"sequencer\"
  alwayson \"synth\"
  alwayson \"bass_drum\"

  opcode PatStringToArray, k[], Sk[]
  StrIn,kArr[] xin
  kstrlen strlenk StrIn
  kpos = 0
  while kpos < kstrlen do
  kcomp strcmpk \"1\", strsubk(StrIn, kpos, kpos+1)
  if kcomp == 0 then
  kArr[kpos] = 0
  kpos +=1
  else
  kArr[kpos] = 1
  kpos +=1
  endif
  od
  xout kArr
  endop

  gi_sine ftgen 0, 0, 65537, 10, 1

  gaclock init 0
  gkbeat init 0
  gktempo init 100

  instr sequencer 
  gkbeat = 60 / (gktempo * 4)
  gaclock = mpulse(1, gkbeat)
  endin

  gkcnt init 0

  instr synth
  ;; Spattern init \"\"
  kpattern[] init 100
  S_Arr[] init 100
  kbeat init 0
  karrlen init 2
  aclock = gaclock
  aretrig init 0
  karrlen chnget \"pat1len\"
  Spattern chnget \"pat1pat\"

  agate = gatesig(aclock, 0.02)
  kpattern PatStringToArray Spattern, kpattern

  atrg, kindx seqsig aclock, karrlen, kpattern
  aenv adsr140 agate * atrg, aretrig, 0.001, 0.25, 0.001, 0.25
  
  ;; printks SpatternIn, 1

  printks2 \"pat1:%d\", kindx

  apch init cps2pch(7.02, 12)
  aout = vco(1, apch , 1, 0.5, gi_sine)
  aout += vco(0.5, apch * 1.5, 2, 0.5, gi_sine)
  aout += rand:a(0.05)
  kcps = (gktempo / 60) / 16
  kcut = lfo(0.4, kcps , 1) + 0.6 
  ;; aout moogladder aout, (200 * (1 + (kcut * 2))) * (1 + aenv * 8), 0.8
  aout zdf_ladder aout, (200 * (1 + (kcut * 1.8))) * (1 + aenv * 8), a(0.6)
  aout *= aenv
  al, ar pan2 aout, 0.4
  outc al, ar
  endin

  instr bass_drum ;; drums
  agate = gatesig(gaclock, 0.45 * gkbeat)
  aretrig init 0
  iamp = ampdbfs(-18)
  karrlen chnget \"pat2len\"
  Spattern chnget \"pat2pat\"
  kpattern[] init 100
  kpattern PatStringToArray Spattern, kpattern
  atrg, kindx seqsig gaclock, karrlen, kpattern
  printks2 \"pat2:%d\", kindx
  aenv adsr140 agate * atrg, aretrig, 0.01, 0.25, 0.0001, 0.0001 
  avcoenv adsr140 agate * atrg, aretrig, 0.001, 0.15, 0.0001, 0.0001 


  ;; good enough for sketching...
  aout = butterlp(
          resonr(vco(1.0, 70 + avcoenv * 220, 3, 0.5, gi_sine), 400, 200), 1200)

  ;; aout += butterlp(noise(aenv, 0), 200) 
  aout *=  0.2 * iamp * aenv

  outc(aout, aout)
  endin
  ")


(defn knobs [pat-name this]
  (let [csound (gdom/getElement "csound_module")
        pat-index (get (om/get-state this)
                       (keyword pat-name))
        pat-pat-k (keyword (str pat-name "pat"))
        pat-pat   (get (om/get-state this)
                       pat-pat-k)
        pat-pat-cnt (count pat-pat)]
    (apply dom/li (clj->js {:style #js {:height "60px"}})           
           (for [knob-num (range (inc pat-pat-cnt))]
             (dom/div (clj->js {:className "knob-outer"
                                :style #js {:width "60px"
                                            :height "60px"
                                            :display "inline-block"
                                            :backgroundColor
                                            (if (and (= knob-num pat-index)
                                                     (= 2 (get pat-pat knob-num)))
                                              "#e2e2e2" "white")}})
                      (if (not= knob-num pat-pat-cnt)
                        (if (= 1 (get pat-pat knob-num))
                          (dom/div (clj->js {:onClick (fn []
                                                        (om/update-state!
                                                         this assoc
                                                         pat-pat-k
                                                         (assoc pat-pat knob-num 2))
                                                        (.postMessage csound
                                                                      (gstring/format
                                                                       "schannel:%spat:%d"
                                                                       pat-name
                                                                       (pat->str
                                                                        (assoc pat-pat knob-num 2)))))
                                             :className "knob-inner-inactive"
                                             :style #js
                                             {:height "40px"
                                              :width "40px"
                                              :margin "10px"
                                              :cursor "pointer"
                                              :boxSizing "border-box"
                                              :border "5px solid gray"}}))
                          (dom/div (clj->js {:onClick (fn []
                                                        (om/update-state!
                                                         this assoc
                                                         pat-pat-k
                                                         (assoc pat-pat knob-num 1))
                                                        (.postMessage csound
                                                                      (gstring/format
                                                                       "schannel:%spat:%d"
                                                                       pat-name
                                                                       (pat->str
                                                                        (assoc pat-pat knob-num 1)))))
                                             :className "knob-inner-active"
                                             :style #js
                                             {:height "40px"
                                              :width "40px"
                                              :margin "10px"
                                              :cursor "pointer"
                                              ;; :backgroundColor "#aed581"
                                              #_(if (= knob-num pat-index)
                                                  "green" "red")}})))
                        (dom/div (clj->js {:style #js {:width "150px"
                                                       :height "30px"}})
                                 (dom/img (clj->js {:onClick
                                                    (fn []
                                                      (om/update-state! this assoc
                                                                        pat-pat-k
                                                                        (vec (butlast pat-pat)))
                                                      (doto csound
                                                        (.postMessage (gstring/format
                                                                       "channel:%slen:%d"
                                                                       pat-name
                                                                       (dec pat-pat-cnt)))
                                                        (.postMessage (gstring/format
                                                                       "schannel:%spat:%d"
                                                                       pat-name
                                                                       (pat->str
                                                                        (vec (butlast pat-pat)))))))
                                                    :src "fonts/minus.png"
                                                    :style #js {:cursor "pointer"
                                                                :marginBottom "20px"
                                                                :marginLeft "10px"
                                                                :height "20px"
                                                                :width "20px"}}))
                                 (dom/img (clj->js {:onClick
                                                    (fn []
                                                      (om/update-state! this assoc
                                                                        pat-pat-k
                                                                        (conj pat-pat 1))
                                                      (doto csound
                                                        (.postMessage (gstring/format
                                                                       "channel:%slen:%d"
                                                                       pat-name
                                                                       (inc pat-pat-cnt)))
                                                        (.postMessage (gstring/format
                                                                       "schannel:%spat:%d"
                                                                       pat-name
                                                                       (pat->str
                                                                        (conj pat-pat 1))))))
                                                    :src "fonts/plus.png"
                                                    :style #js {:cursor "pointer"
                                                                :marginBottom "20px"
                                                                :marginLeft "10px"
                                                                :height "20px"
                                                                :width "20px"}})))))))))

(defui Root
  Object
  (initLocalState [this]
                  {:pat1pat [1 1 1 2 2 2 1 2 1]
                   :pat2pat [2 1 2 1 1 1 1 1 2]})
  (componentDidMount [this]
                     (let [{:keys [pat1pat pat2pat]} (om/get-state this)
                           csound (gdom/getElement "csound_module")]
                       (om/update-state! this assoc :csound csound)
                       (.addEventListener csound
                                          "message"
                                          (fn [e]
                                            (if-not (= "pat" (subs (.-data e) 0 3)) 
                                              (js/console.log (str (.-data e)))
                                              (let [[pat-name pat-value]
                                                    (pat-msg-parser (.-data e))]
                                                (om/update-state! this assoc (keyword pat-name) pat-value)))))
                       (.postMessage csound "playCsound")
                       (doto csound
                         (.postMessage (str "channel:pat1len:"
                                            (count pat1pat)))
                         (.postMessage (str "schannel:pat1pat:"
                                            (pat->str pat1pat)))
                         (.postMessage (str "channel:pat2len:"
                                            (count pat2pat)))
                         (.postMessage (str "schannel:pat2pat:"
                                            (pat->str pat2pat))))
                       (.postMessage csound (str "orchestra:"
                                                 patter-sequencer
                                                 csd-orc))))
  (render [this]
          (let [{:keys [csound]} (om/get-state this)]
            (dom/div nil
                     ;; (dom/h4 nil (str "pat1: " (om/get-state this)))
                     (dom/h4 nil (str "Sequencer"))
                     (dom/ul #js {:style #js {:display "block"
                                              :listStyleType "none"
                                              :width "1500px"}}
                             (knobs "pat1" this)
                             (knobs "pat2" this))
                     (dom/embed
                      (clj->js {:name "csound_module"
                                :id "csound_module"
                                :src "js/pnacl/Release/csound.nmf"
                                :type "application/x-pnacl"
                                :style #js {:position "absolute"
                                            :zIndex "-99999"}}))))))

(defmulti read om/dispatch)

(defmulti mutate om/dispatch)

(def reconciler 
  (om/reconciler {:state app-state
                  :parser (om/parser {:read read
                                      :mutate mutate})}))


(defn ^:export init []
  (om/add-root! reconciler Root (gdom/getElement "app")))


(init)
