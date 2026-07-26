(ns ui.csd-orc)

(def patter-sequencer
  "UDO by Steven Yi,
  https://github.com/kunstmusik/libsyi"
  "
/* uses global 128 x 8 x 16 k-array
   128 patterns, each pattern made up of 8x16 sequences
   atrigger signal drives each pattern
   kpattern_indx denotes which index to play

   pattern array is global for efficiency as otherwise
   arrays would be copied every k-pass
   */
  
gkpattern_sequencer_all[] init 128 * 8 * 16

opcode patternseq_seqsig, a, aak
  agate, astartIndx, klen xin

  aout init 0
  kpatindx init 15 

  kindx = 0
  while (kindx < ksmps) do
    if(agate[kindx] == 1) then 
      kpatindx = (kpatindx + 1) % klen 
    endif
    kstartIndx = astartIndx[kindx]
    aout[kindx] = gkpattern_sequencer_all[kstartIndx + kpatindx]
    kindx += 1
  od

  xout aout

endop

opcode pattern_sequencer, aaaaaaaa, aa
  atrigger, apattern_indx xin

  apatstart = apattern_indx * 128

  a1 patternseq_seqsig atrigger, apatstart, 16 
  a2 patternseq_seqsig atrigger, apatstart + 16, 16 
  a3 patternseq_seqsig atrigger, apatstart + 32, 16
  a4 patternseq_seqsig atrigger, apatstart + 48, 16
  a5 patternseq_seqsig atrigger, apatstart + 64, 16
  a6 patternseq_seqsig atrigger, apatstart + 80, 16
  a7 patternseq_seqsig atrigger, apatstart + 96, 16
  a8 patternseq_seqsig atrigger, apatstart + 112, 16

  xout a1, a2, a3, a4, a5, a6, a7, a8
endop

instr set_pat_seq_instr
  ipatNum = p4
  iseqnum = p5

  indx = p4 * 128 + iseqnum * 16 
  prints \"Setting pattern %d sequence %d\\n\", p4, p5 
  gkpattern_sequencer_all[indx] = p6
  gkpattern_sequencer_all[indx + 1] = p7
  gkpattern_sequencer_all[indx + 2] = p8
  gkpattern_sequencer_all[indx + 3] = p9
  gkpattern_sequencer_all[indx + 4] = p10
  gkpattern_sequencer_all[indx + 5] = p11
  gkpattern_sequencer_all[indx + 6] = p12
  gkpattern_sequencer_all[indx + 7] = p13
  gkpattern_sequencer_all[indx + 8] = p14
  gkpattern_sequencer_all[indx + 9] = p15
  gkpattern_sequencer_all[indx + 10] = p16
  gkpattern_sequencer_all[indx + 11] = p17
  gkpattern_sequencer_all[indx + 12] = p18
  gkpattern_sequencer_all[indx + 13] = p19
  gkpattern_sequencer_all[indx + 14] = p20
  gkpattern_sequencer_all[indx + 15] = p21

  turnoff
endin


opcode set_pattern_seq, 0,iiiiiiiiiiiiiiiiii
 ipat, iseq, i0, i1, i2, i3, i4, i5 ,i6, i7, \\
 i8, i9, i10, i11, i12, i13, i14, i15 xin
  event_i \"i\", \"set_pat_seq_instr\", 0, 1, \\
   ipat, iseq, i0, i1, i2, i3, i4, i5 ,i6, i7, \\
   i8, i9, i10, i11, i12, i13, i14, i15
endop

instr copy_pat_seq_instr

  isrcpat_num = p4
  isrcseq_num = p5
  idestpat_num = p6
  idestseq_num = p7

  indx0 = isrcpat_num * 128 + isrcseq_num * 16 
  indx1 = idestpat_num * 128 + idestseq_num * 16 

  prints \"Copying pattern %d sequence %d\\n to pattern %d sequence %d\\n\", p4, p5, p6, p7
  gkpattern_sequencer_all[indx1]      = gkpattern_sequencer_all[indx0]     
  gkpattern_sequencer_all[indx1 + 1]  = gkpattern_sequencer_all[indx0 + 1] 
  gkpattern_sequencer_all[indx1 + 2]  = gkpattern_sequencer_all[indx0 + 2] 
  gkpattern_sequencer_all[indx1 + 3]  = gkpattern_sequencer_all[indx0 + 3] 
  gkpattern_sequencer_all[indx1 + 4]  = gkpattern_sequencer_all[indx0 + 4] 
  gkpattern_sequencer_all[indx1 + 5]  = gkpattern_sequencer_all[indx0 + 5] 
  gkpattern_sequencer_all[indx1 + 6]  = gkpattern_sequencer_all[indx0 + 6] 
  gkpattern_sequencer_all[indx1 + 7]  = gkpattern_sequencer_all[indx0 + 7] 
  gkpattern_sequencer_all[indx1 + 8]  = gkpattern_sequencer_all[indx0 + 8] 
  gkpattern_sequencer_all[indx1 + 9]  = gkpattern_sequencer_all[indx0 + 9] 
  gkpattern_sequencer_all[indx1 + 10] = gkpattern_sequencer_all[indx0 + 10]
  gkpattern_sequencer_all[indx1 + 11] = gkpattern_sequencer_all[indx0 + 11]
  gkpattern_sequencer_all[indx1 + 12] = gkpattern_sequencer_all[indx0 + 12]
  gkpattern_sequencer_all[indx1 + 13] = gkpattern_sequencer_all[indx0 + 13]
  gkpattern_sequencer_all[indx1 + 14] = gkpattern_sequencer_all[indx1 + 14]
  gkpattern_sequencer_all[indx1 + 15] = gkpattern_sequencer_all[indx0 + 15]

  turnoff
endin

/* copies sequence from one pattern to another 
   Arguments: isrcpat, isrcseq, idestpat, idestseq
   */
opcode copy_pattern_seq, 0, iiii
  ip0, is0, ip1, is1 xin
  event_i \"i\", \"copy_pat_seq_instr\", 0, 1, ip0, is0, ip1, is1
endop

opcode clock_div, a, ak
  atrig, kdiv xin
  kcount init 1000 
  asig init 0
  kndx = 0
  while (kndx < ksmps) do
    if(atrig[kndx] == 1) then
      kcount += 1
      if(kcount >= kdiv) then
        asig[kndx] = 1
        kcount = 0
      else
        asig[kndx] = 0
      endif
    else
      asig[kndx] = 0
    endif
    kndx += 1
  od
  xout asig
endop

opcode adsr140_calc_coef, k, kk
  
  knum_samps, kratio xin
  xout exp( -log((1.0 + kratio) / kratio) / knum_samps)
    
endop

/* Gated, Re-triggerable ADSR modeled after the Doepfer A-140 */
opcode adsr140, a, aakkkk

agate, aretrig, kattack, kdecay, ksustain, krelease xin

kstate init 0  ; 0 = attack, 1 = decay, 2 = sustain
klasttrig init -1
kval init 0.0
asig init 0
kindx = 0

kattack_base init 0
kdecay_base init 0
krelease_base init 0

kattack_samps init 0
kdecay_samps init 0
krelease_samps init 0

kattack_coef init 0
kdecay_coef init 0
ksustain_coef init 0

klast_attack init -1
klast_decay init -1
klast_release init -1

if (klast_attack != kattack) then
  klast_attack = kattack
  kattack_samps = kattack * sr
  kattack_coef = adsr140_calc_coef(kattack_samps, 0.3)
  kattack_base = (1.0 + 0.3) * (1 - kattack_coef)
endif

if (klast_decay != kdecay) then
  klast_decay = kdecay
  kdecay_samps = kdecay * sr
  kdecay_coef = adsr140_calc_coef(kdecay_samps, 0.0001)
  kdecay_base = (ksustain - 0.0001) * (1.0 - kdecay_coef)
endif

if (klast_release != krelease) then
  klast_release = krelease
  krelease_samps = krelease * sr
  krelease_coef = adsr140_calc_coef(krelease_samps, 0.0001)
  krelease_base =  -0.0001 * (1.0 - krelease_coef)
endif


while (kindx < ksmps) do
  if (agate[kindx] > 0) then
    kretrig = aretrig[kindx]
    if (kretrig > 0 && klasttrig <= 0) then
      kstate = 0
    endif
    klasttrig = kretrig

    if (kstate == 0) then
      kval = kattack_base + (kval * kattack_coef)
      if(kval >= 1.0) then
        kval = 1.0
        kstate = 1
      endif
      asig[kindx] = kval

    elseif (kstate == 1) then
      kval = kdecay_base + (kval * kdecay_coef)
      if(kval <= ksustain) then
        kval = ksustain
        kstate = 2
      endif
      asig[kindx] = kval 

    else
      asig[kindx] = ksustain
    endif

  else ; in a release state
    kstate = 0
    if (kval == 0.0) then
      asig[kindx] = 0
    else 
    ; releasing
      kval = krelease_base + (kval * krelease_coef)
    if(kval <= 0.0) then
      kval = 0.0
    endif
    asig[kindx] = kval  
    endif

  endif

  kindx += 1
od
xout asig
endop

opcode gatesig, a, ak
  atrig, khold xin
  kcount init 0
  asig init 0
  kndx = 0
  kholdsamps = khold * sr
  while (kndx < ksmps) do
    if(atrig[kndx] == 1) then
      kcount = 0
    endif
    asig[kndx] = (kcount < kholdsamps) ? 1 : 0 
    kndx += 1
    kcount += 1
  od
  xout asig
endop

opcode seqsig, ak, akk[]
  agate, karrlen, kpattern[] xin
  aout init 0
  ;; karrlen = lenarray:k(kpattern)
  kpatindx init (lenarray:i(kpattern) - 1)
  kindx = 0
  while (kindx < ksmps) do
    if(agate[kindx] == 1) then 
      kpatindx = (kpatindx + 1) % karrlen
    endif
    aout[kindx] = kpattern[kpatindx]
    kpatindxout = kpatindx
    kindx += 1
  od
  xout aout, kpatindxout
endop


opcode seqsig, k, ak[]
  agate, kpattern[] xin
  kout init 0
  karrlen = lenarray:k(kpattern)
  kpatindx init (lenarray:i(kpattern) - 1)
  kindx = 0
  while (kindx < ksmps) do
    if(agate[kindx] == 1) then 
      kpatindx = (kpatindx + 1) % karrlen
      kout = kpattern[kpatindx]
    endif
    kindx += 1
  od
  xout kout
endop

opcode StrToArr, S[], SSS[]

 S_in, S_sep, S_Arr[] xin 

 ;count the number of substrings
 kLenSep strlenk S_sep
 kPos = 0
 kPosShift = 0
 kCnt = 0

 while kPos != -1 do
 
  kCnt += 1
  S_sub strsubk S_in, kPosShift, -1
  kPos strindexk S_sub, S_sep
  kPosShift += kPos+kLenSep
  
 od
 
 ;create a string array and put the substrings in it
 ;; S_Arr[] = kCnt
 kPos = 0
 kPosShift = 0
 kArrIndx = -1
 while kPos != -1 do
 
  kArrIndx += 1
  S_sub strsubk S_in, kPosShift, -1
  kPos strindexk S_sub, S_sep
  kEnd = (kPos == -1 ? -1 : kPosShift+kPos)
  S_ToArr strsubk S_in, kPosShift, kEnd
  kPosShift += kPos+kLenSep
  S_Arr[kArrIndx] = S_ToArr  
 
 od
 
  xout S_Arr

endop

opcode zdf_1pole, aa, ak
  ain, kcf  xin

  ; pre-warp the cutoff- these are bilinear-transform filters
  kwd = 2 * $M_PI * kcf
  iT  = 1/sr 
  kwa = (2/iT) * tan(kwd * iT/2) 
  kg  = kwa * iT/2 

  ; big combined value
  kG  = kg / (1.0 + kg)

  ahp init 0
  alp init 0

  ;; state for integrators
  kz1 init 0

  kindx = 0
  while kindx < ksmps do
    ; do the filter, see VA book p. 46 
    ; form sub-node value v(n) 
    kin = ain[kindx]
    kv = (kin - kz1) * kG 

    ; form output of node + register 
    klp = kv + kz1 
    khp = kin - klp 

    ; z1 register update
    kz1 = klp + kv  

    alp[kindx] = klp
    ahp[kindx] = khp
    kindx += 1
  od

  xout alp, ahp
endop


;; 1-pole (6dB) lowpass/highpass filter
;; takes in a a-rate signal and cutoff value in frequency
opcode zdf_1pole, aa, aa
  ain, acf  xin

  ; pre-warp the cutoff- these are bilinear-transform filters
  iT  = 1/sr 

  ahp init 0
  alp init 0

  ;; state for integrators
  kz1 init 0

  kindx = 0
  while kindx < ksmps do
    ; pre-warp the cutoff- these are bilinear-transform filters
    kwd = 2 * $M_PI * acf[kindx]
    kwa = (2/iT) * tan(kwd * iT/2) 
    kg  = kwa * iT/2 

    ; big combined value
    kG  = kg / (1.0 + kg)

    ; do the filter, see VA book p. 46 
    ; form sub-node value v(n) 
    kin = ain[kindx]
    kv = (kin - kz1) * kG 

    ; form output of node + register 
    klp = kv + kz1 
    khp = kin - klp 

    ; z1 register update
    kz1 = klp + kv  

    alp[kindx] = klp
    ahp[kindx] = khp
    kindx += 1
  od

  xout alp, ahp
endop

;; 1-pole allpass filter
;; takes in an a-rate signal and corner frequency where input
;; phase is shifted -90 degrees
opcode zdf_allpass_1pole, a, ak
  ain, kcf xin
  alp, ahp zdf_1pole ain, kcf
  aout = alp - ahp
  xout aout
endop


;; 1-pole allpass filter
;; takes in an a-rate signal and corner frequency where input
;; phase is shifted -90 degrees
opcode zdf_allpass_1pole, a, aa
  ain, acf xin
  alp, ahp zdf_1pole ain, acf
  aout = alp - ahp
  xout aout
endop


;; 2-pole (12dB) lowpass/highpass/bandpass filter
;; takes in a a-rate signal, cutoff value in frequency, and
;; Q factor for resonance
opcode zdf_2pole,aaa,aKK

  ain, kcf, kQ     xin

  ; pre-warp the cutoff- these are bilinear-transform filters
  kwd = 2 * $M_PI * kcf
  iT  = 1/sr 
  kwa = (2/iT) * tan(kwd * iT/2) 
  kG  = kwa * iT/2 
  kR  = 1 / (2 * kQ)

  ;; output signals
  alp init 0
  ahp init 0
  abp init 0

  ;; state for integrators
  kz1 init 0
  kz2 init 0

  ;;
  kindx = 0
  while kindx < ksmps do
    khp = (ain[kindx] - (2 * kR + kG) * kz1 - kz2) / (1 + (2 * kR * kG) + (kG * kG))
    kbp = kG * khp + kz1
    klp = kG * kbp + kz2

    ; z1 register update
    kz1 = kG * khp + kbp  
    kz2 = kG * kbp + klp  

    alp[kindx] = klp
    ahp[kindx] = khp
    abp[kindx] = kbp
    kindx += 1
  od

  xout alp, abp, ahp

endop


;; 2-pole (12dB) lowpass/highpass/bandpass filter
;; takes in a a-rate signal, cutoff value in frequency, and
;; Q factor for resonance
opcode zdf_2pole,aaa,aaa

  ain, acf, aQ     xin

  iT  = 1/sr 

  ;; output signals
  alp init 0
  ahp init 0
  abp init 0

  ;; state for integrators
  kz1 init 0
  kz2 init 0

  ;;
  kindx = 0
  while kindx < ksmps do

    ; pre-warp the cutoff- these are bilinear-transform filters
    kwd = 2 * $M_PI * acf[kindx]
    kwa = (2/iT) * tan(kwd * iT/2) 
    kG  = kwa * iT/2 

    kR = 1 / (2 * aQ[kindx]) 

    khp = (ain[kindx] - (2 * kR + kG) * kz1 - kz2) / (1 + (2 * kR * kG) + (kG * kG))
    kbp = kG * khp + kz1
    klp = kG * kbp + kz2

    ; z1 register update
    kz1 = kG * khp + kbp  
    kz2 = kG * kbp + klp 

    alp[kindx] = klp
    ahp[kindx] = khp
    abp[kindx] = kbp
    kindx += 1
  od

  xout alp, abp, ahp

endop

;; 2-pole (12dB) lowpass/highpass/bandpass/notch filter
;; takes in a a-rate signal, cutoff value in frequency, and
;; Q factor for resonance
opcode zdf_2pole_notch,aaaa,aKK

  ain, kcf, kQ     xin

  ; pre-warp the cutoff- these are bilinear-transform filters
  kwd = 2 * $M_PI * kcf
  iT  = 1/sr 
  kwa = (2/iT) * tan(kwd * iT/2) 
  kG  = kwa * iT/2 
  kR  = 1 / (2 * kQ)

  ;; output signals
  alp init 0
  ahp init 0
  abp init 0
  anotch init 0

  ;; state for integrators
  kz1 init 0
  kz2 init 0

  ;;
  kindx = 0
  while kindx < ksmps do
    kin = ain[kindx]
    khp = (kin - (2 * kR + kG) * kz1 - kz2) / (1 + (2 * kR * kG) + (kG * kG))
    kbp = kG * khp + kz1
    klp = kG * kbp + kz2
    knotch = kin - (2 * kR * kbp)

    ; z1 register update
    kz1 = kG * khp + kbp  
    kz2 = kG * kbp + klp  

    alp[kindx] = klp
    ahp[kindx] = khp
    abp[kindx] = kbp
    anotch[kindx] = knotch
    kindx += 1
  od

  xout alp, abp, ahp, anotch

endop

;; 2-pole (12dB) lowpass/highpass/bandpass/notch filter
;; takes in a a-rate signal, cutoff value in frequency, and
;; Q factor for resonance
opcode zdf_2pole_notch,aaaa,aaa

  ain, acf, aQ     xin

  iT  = 1/sr 

  ;; output signals
  alp init 0
  ahp init 0
  abp init 0
  anotch init 0

  ;; state for integrators
  kz1 init 0
  kz2 init 0

  ;;
  kindx = 0
  while kindx < ksmps do

    ; pre-warp the cutoff- these are bilinear-transform filters
    kwd = 2 * $M_PI * acf[kindx]
    kwa = (2/iT) * tan(kwd * iT/2) 
    kG  = kwa * iT/2 

    kR = 1 / (2 * aQ[kindx])

    kin = ain[kindx]
    khp = (kin - (2 * kR + kG) * kz1 - kz2) / (1 + (2 * kR * kG) + (kG * kG))
    kbp = kG * khp + kz1
    klp = kG * kbp + kz2
    knotch = kin - (2 * kR * kbp)

    ; z1 register update
    kz1 = kG * khp + kbp  
    kz2 = kG * kbp + klp 

    alp[kindx] = klp
    ahp[kindx] = khp
    abp[kindx] = kbp
    anotch[kindx] = knotch
    kindx += 1
  od

  xout alp, abp, ahp, anotch

endop

;; moog ladder

opcode zdf_ladder, a, akk

  ain, kcf, kres     xin
  aout init 0

  kR = limit(1 - kres, 0.025, 1)

  kQ = 1 / (2 * kR) 

  kwd = 2 * $M_PI * kcf
  iT  = 1/sr 
  kwa = (2/iT) * tan(kwd * iT/2) 
  kg  = kwa * iT/2 

  kk = 4.0*(kQ - 0.707)/(25.0 - 0.707)

  kg_2 = kg * kg
  kg_3 = kg_2 * kg

  ; big combined value
  ; for overall filter
  kG  = kg_2 * kg_2  
  ; for individual 1-poles
  kG_pole = kg/(1.0 + kg)

  ;; state for each 1-pole's integrator 
  kz1 init 0
  kz2 init 0
  kz3 init 0
  kz4 init 0

  kindx = 0
  while kindx < ksmps do
    ;; processing
    kin = ain[kindx]

    kS = kg_3 * kz1 + kg_2 * kz2 + kg * kz3 + kz4
    ku = (kin - kk *  kS) / (1 + kk * kG)

    ;; 1st stage
    kv = (ku - kz1) * kG_pole 
    klp = kv + kz1
    kz1 = klp + kv

    ;; 2nd stage
    kv = (klp - kz2) * kG_pole 
    klp = kv + kz2
    kz2 = klp + kv

    ;; 3rd stage
    kv = (klp - kz3) * kG_pole 
    klp = kv + kz3
    kz3 = klp + kv

    ;; 4th stage
    kv = (klp - kz4) * kG_pole 
    klp = kv + kz4
    kz4 = klp + kv

    aout[kindx] = klp

    kindx += 1
  od

  xout aout
endop


opcode zdf_ladder, a, aaa

  ain, acf, ares     xin
  aout init 0

  iT  = 1/sr 

  ;; state for each 1-pole's integrator 
  kz1 init 0
  kz2 init 0
  kz3 init 0
  kz4 init 0

  kindx = 0
  while kindx < ksmps do

    kR = limit(1 - ares[kindx], 0.025, 1)

    kQ = 1 / (2 * kR) 

    kwd = 2 * $M_PI * acf[kindx]
    kwa = (2/iT) * tan(kwd * iT/2) 
    kg  = kwa * iT/2 

    kk = 4.0*(kQ - 0.707)/(25.0 - 0.707)

    kg_2 = kg * kg
    kg_3 = kg_2 * kg

    ; big combined value
    ; for overall filter
    kG  = kg_2 * kg_2  
    ; for individual 1-poles
    kG_pole = kg/(1.0 + kg)

    ;; processing
    kin = ain[kindx]

    kS = kg_3 * kz1 + kg_2 * kz2 + kg * kz3 + kz4
    ku = (kin - kk *  kS) / (1 + kk * kG)

    ;; 1st stage
    kv = (ku - kz1) * kG_pole 
    klp = kv + kz1
    kz1 = klp + kv

    ;; 2nd stage
    kv = (klp - kz2) * kG_pole 
    klp = kv + kz2
    kz2 = klp + kv

    ;; 3rd stage
    kv = (klp - kz3) * kG_pole 
    klp = kv + kz3
    kz3 = klp + kv

    ;; 4th stage
    kv = (klp - kz4) * kG_pole 
    klp = kv + kz4
    kz4 = klp + kv

    aout[kindx] = klp

    kindx += 1
  od

  xout aout
endop

;; 4-pole

opcode zdf_4pole, aaaaaa, akk
  ain, kcf, kres xin

  alp2, abp2, ahp2 zdf_2pole ain, kcf, kres

  abp4 init 0
  abl4 init 0
  alp4 init 0

  xout alp2, abp2, ahp2, alp4, abl4, abp4
endop

opcode zdf_4pole, aaaaaa, aaa
  ain, acf, ares xin

  alp2, abp2, ahp2 zdf_2pole ain, acf, ares
  abp4 init 0
  abl4 init 0
  alp4 init 0

  xout alp2, abp2, ahp2, alp4, abl4, abp4
endop


opcode zdf_4pole_hp, aaaaaa, akk
  ain, kcf, kres xin

  alp2, abp2, ahp2 zdf_2pole ain, kcf, kres

  ahp4 init 0
  abh4 init 0
  abp4 init 0

  xout alp2, abp2, ahp2, abp4, abh4, ahp4
endop

opcode zdf_4pole_hp, aaaaaa, aaa
  ain, acf, ares xin

  alp2, abp2, ahp2 zdf_2pole ain, acf, ares

  ahp4 init 0
  abh4 init 0
  abp4 init 0

  xout alp2, abp2, ahp2, abp4, abh4, ahp4
endop

;; TODO - implement
opcode zdf_peak_eq, a, akkk
  ain, kcf, kres, kdB xin

  aout init 0

  xout aout
endop

opcode zdf_high_shelf_eq, a, akk
  ain, kcf, kdB xin

  ;; TODO - convert db to K, check if reusing zdf_1pole is sufficient
  kK init 0

  alp, ahp zdf_1pole ain, kcf

  aout = ain + kK * ahp

  xout aout
endop

opcode zdf_low_shelf_eq, a, akk
  ain, kcf, kdB xin

  ;; TODO - convert db to K, check if reusing zdf_1pole is sufficient
  kK init 0

  alp, ahp zdf_1pole ain, kcf

  aout = ain + kK * alp

  xout aout
endop

")
