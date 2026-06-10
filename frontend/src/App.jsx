import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ReferenceLine, Rectangle, ResponsiveContainer, LabelList,
} from "recharts";
import "./App.css";

// ── Real patient samples from test_samples_real.json ─────────────────────────
// Sample A: CD · P(UC)=0.0015 · confidence 99.9%
const FEATURES_A = [
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0.15080000460147858, 0, 0, 0, 0, 0, 0,
  0, 0, 0.0017300000181421638, 0, 0, 0.014279999770224094, 0.10356000065803528, 0.3210499882698059,
  0.6312699913978577, 0.13409000635147095, 0, 8.147919654846191, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0.015230000019073486, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0.03832000121474266, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0.27327001094818115, 0, 0.002739999908953905, 0, 0, 0, 0,
  0, 0, 0, 0, 0.007619999814778566, 0, 1.5611399412155151, 0,
  0.0008800000068731606, 0.07252000272274017, 0.08664999902248383, 0.2069000005722046, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0.0008999999845400453, 0, 0, 0.3464199900627136, 0, 0.001990000018849969,
  0.02881000004708767, 0, 0, 0, 0.07940000295639038, 0, 0, 0,
  0, 0, 0, 0, 1.35794997215271, 0.030069999396800995, 0, 0,
  0.04416000097990036, 0.9653699994087219, 1.7467900514602661, 0.41749998927116394, 0, 0, 0, 0,
  0.046560000628232956, 0.04659999907016754, 0.012009999714791775, 0.00009000000136438757, 0, 0, 0.11784999817609787, 0.2570500075817108,
  0.5101900100708008, 0, 0.2783600091934204, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0.02142000012099743,
  0, 0, 0, 0, 0, 0, 0.06412000209093094, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0.004480000119656324, 0, 0, 0.006990000139921904, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 12.833330154418945, 0, 0, 0,
  0, 0, 0, 0.0031300000846385956, 0, 0, 0, 0,
  0, 0, 0, 0, 0.014399999752640724, 0, 0.005330000072717667, 0,
  0.009220000356435776, 0, 0, 0, 0, 0, 0, 0.006930000148713589,
  0, 0.11202999949455261, 0, 0.04027000069618225, 0, 0, 0, 0.08367999643087387,
  0.004240000154823065, 0.019209999591112137, 0.028869999572634697, 0.21070000529289246, 0.4746299982070923, 0, 0, 0.6528800129890442,
  0.038679998368024826, 0, 0.0018500000005587935, 0.20194000005722046, 0, 0.05603000149130821, 0, 0,
  0.003289999905973673, 0, 0.6188499927520752, 0, 1.6264899969100952, 0.025369999930262566, 0, 0,
  0.131400004029274, 0, 0, 0.01817999966442585, 0, 0, 0.006819999776780605, 0,
  0.0031500000040978193, 0, 0, 0, 0, 0.07524999976158142, 0, 0.017430000007152557,
  0, 0, 0, 0, 0, 0, 0.0008099999977275729, 0.02401999942958355,
  0, 0, 0, 0, 0.04766999930143356, 0, 0, 0,
  0.006719999946653843, 0, 0, 0, 0, 0, 0, 0,
  0.004430000204592943, 0, 0, 0, 0, 0, 0, 0,
  0, 0.09635999798774719, 0, 0, 0, 0.006440000142902136, 0.029400000348687172, 0,
  0, 0, 0, 0, 0, 0, 2.7202401161193848, 0,
  0.05063999816775322, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0.06786999851465225, 0.001930000027641654, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0.066600002348423, 0, 0, 0, 0,
  0, 0, 0.17242999374866486, 0, 0, 0, 0.010730000212788582, 0,
  0, 0, 0, 0, 0, 0, 0, 0.10599000006914139,
  0.0007300000288523734, 0.007139999885112047, 0.008820000104606152, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0.0009699999936856329, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0.002730000065639615,
  0, 0, 0, 0, 0, 0, 0, 0,
  0.01145000010728836, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0.01413000002503395,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0.06785999983549118, 0,
  0, 0, 0, 0, 0, 0, 0.08968999981880188, 0.08144000172615051,
  0.01600000075995922, 0.5722100138664246, 0, 0, 0, 0, 0.0019399999873712659, 0,
  0.006850000005215406, 0, 0.0026000000070780516, 0, 0, 0.05136999860405922, 0.005330000072717667, 0,
  0.06545999646186829, 0.05485999956727028, 0.05908000096678734, 0, 0.00015999999595806003, 0.32892999053001404, 0.0391400009393692, 0,
  0.0015200000489130616, 0.03635000064969063, 0.013039999641478062, 0, 0, 0, 0, 0.029810000211000443,
  0.2570900022983551, 0.06716000288724899, 0.003010000102221966, 0.019419999793171883, 0.0005499999970197678, 0, 0, 0.18158000707626343,
  0, 0.1465499997138977, 0, 0, 0, 0, 0, 0.013120000250637531,
  0, 0, 0, 0, 1.5044399499893188, 0, 0.4457300007343292, 0,
  0, 0, 0, 0, 0.00494999997317791, 0, 0.035599999129772186, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0.009109999984502792, 0, 0, 0,
  0, 0, 0.006060000043362379, 0, 0.25540998578071594, 0.0005799999926239252, 0, 0,
  0, 0.0850600004196167, 0.04938000068068504, 0, 0, 0, 0, 0.003329999977722764,
  0, 0, 0, 0.0007099999929778278, 0, 0, 0, 0.25148001313209534,
  0, 0.2667500078678131, 0, 1.5538899898529053, 0, 0, 0.0014799999771639705, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0.008609999902546406,
  0, 0.11563000082969666, 0.020759999752044678, 1.0510200262069702, 0, 0, 0, 0,
  0.008569999597966671, 0, 0.7523800134658813, 0.0061900001019239426, 0, 0, 0, 0,
  0, 0.018570000305771828, 0, 0.0011899999808520079, 0, 0.01486000046133995, 0.00007000000186963007, 0.08236999809741974,
  0.01486000046133995, 0, 0, 0, 0, 0.028750000521540642, 0.830049991607666, 0,
  0, 0, 0, 0, 0, 0.0494999997317791,
];

// Sample B: UC · P(UC)=0.9992 · confidence 99.9%
const FEATURES_B = [
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 35.57238006591797, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0.10416000336408615,
  0.1267399936914444, 0, 0, 0.06694000214338303, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0.31255999207496643, 0, 0, 0, 0.6442300081253052, 0, 0, 1.9978699684143066,
  0.030249999836087227, 0, 0, 0, 0, 0, 8.704440116882324, 0,
  0, 0, 0, 0, 0, 0.04408000037074089, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 1.6701300144195557, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 1.8443299531936646, 0, 0, 0, 0, 0,
  0, 0, 0.10881999880075455, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 1.8598400354385376, 0, 0, 0,
  0, 0.26629000902175903, 0, 0, 2.4339001178741455, 0, 0, 0,
  0, 0, 0, 10.092309951782227, 0, 0, 0, 0,
  0, 0, 0, 0, 0.40380001068115234, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0.0015899999998509884,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0.01631000079214573, 0.04188999906182289, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0.3535600006580353, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0.12415999919176102, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0.1460600048303604, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 13.524140357971191, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0.28259000182151794, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0,
];

// Sample C: CD · P(UC)=0.4952 · borderline (triggers low-confidence warning)
const FEATURES_C = [
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0.03660000115633011, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 3.835599899291992, 0.9437400102615356, 4.910039901733398,
  0, 1.1937299966812134, 0, 5.701330184936523, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0.010300000198185444,
  0, 0.1193699985742569, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0.024609999731183052, 0, 0.17645999789237976, 0,
  0, 1.1805100440979004, 2.402600049972534, 0.9153500199317932, 0, 0, 0.005270000081509352, 0.05265999957919121,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0.964169979095459, 0, 0.00865000020712614,
  0.2490600049495697, 0, 0, 0, 0.20835000276565552, 0, 0, 0,
  0, 0, 0, 0, 0.33893001079559326, 0.017500000074505806, 0, 0,
  0, 4.166170120239258, 4.451889991760254, 0, 0, 0, 0, 0,
  0.3542200028896332, 0, 0, 0, 0, 0, 0.1286499947309494, 2.1817901134490967,
  5.848859786987305, 0, 8.41981029510498, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0.014449999667704105,
  0, 0, 0, 0, 0, 0, 0.055890001356601715, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0.012790000066161156, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0.1830900013446808, 0, 0,
  0, 0.00547999981790781, 0, 0, 0, 0, 0, 0.5823500156402588,
  0, 0, 0, 0, 0, 0.0012400000123307109, 0, 0,
  1.226770043373108, 0.026830000802874565, 0.33491000533103943, 0, 0, 0, 0, 0.06241000071167946,
  0, 1.2005300521850586, 0, 0.006870000157505274, 0.021630000323057175, 0, 0, 0,
  0, 0, 0.052319999784231186, 0.04611000046133995, 0.4636000096797943, 0, 0, 0,
  0, 0, 0, 3.022469997406006, 0, 0, 0, 0,
  7.648829936981201, 0, 0.028629999607801437, 0, 0, 4.502220153808594, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0.02116999961435795,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0.3553999960422516, 0, 0, 0, 0, 0, 0, 0,
  0, 0.006870000157505274, 0, 0, 0, 0, 0.043880000710487366, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0.124269999563694, 0.00203000009059906, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0.09633000195026398, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0.10705000162124634, 0, 0, 0, 0.03051000088453293,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0.04027999937534332,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 2.1617400646209717, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0.9816100001335144, 0, 0, 0.3377099931240082,
  0.11788000166416168, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0.013919999822974205, 1.7785999774932861, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0.21101999282836914, 0.12165000289678574, 0, 0, 0, 0, 0, 0,
  0, 0.20097999274730682, 0, 0, 0, 0.029529999941587448, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0.014659999869763851, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0.0008299999753944576, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0.04027999937534332, 0, 0,
  0, 0, 0, 0.0181099995970726, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0.018379999324679375, 0, 0, 0, 0, 0, 0,
  0, 0, 1.5839899778366089, 0, 0, 0, 0, 0,
  0, 0.0024999999441206455, 0, 0, 0, 0, 0, 0.051920000463724136,
  0.01597999967634678, 0, 0, 0, 0, 0.06298000365495682, 0, 0,
  0, 0, 0, 0, 0, 0.16495999693870544,
];

// Per-sample taxa preview (5 shared non-zero taxa, normalised to 100)
const PREVIEWS = {
  A: [
    { name: "taxon_562",   pct: 2   },
    { name: "taxon_853",   pct: 100 },
    { name: "taxon_39491", pct: 12  },
    { name: "taxon_820",   pct: 4   },
    { name: "taxon_39485", pct: 17  },
  ],
  B: [
    { name: "taxon_562",   pct: 100 },
    { name: "taxon_853",   pct: 0   },
    { name: "taxon_39491", pct: 1   },
    { name: "taxon_820",   pct: 0   },
    { name: "taxon_39485", pct: 5   },
  ],
  C: [
    { name: "taxon_562",   pct: 1   },
    { name: "taxon_853",   pct: 100 },
    { name: "taxon_39491", pct: 73  },
    { name: "taxon_820",   pct: 86  },
    { name: "taxon_39485", pct: 6   },
  ],
};

const FEATURES = { A: FEATURES_A, B: FEATURES_B, C: FEATURES_C };

function normalizeApiBase(value) {
  const trimmed = value?.trim();
  if (!trimmed) return import.meta.env.DEV ? "http://localhost:8000" : "";
  return trimmed.replace(/\/+$/, "");
}

const API_BASE = normalizeApiBase(import.meta.env.VITE_API_URL);

function apiUrl(path) {
  if (!API_BASE) {
    throw new Error(
      "Missing VITE_API_URL. Add your Railway backend URL in Vercel, then redeploy the frontend."
    );
  }
  return `${API_BASE}${path}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function ShapTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { taxon, shap_value } = payload[0].payload;
  return (
    <div className="shap-tooltip">
      <div className="shap-tooltip-taxon">{taxon}</div>
      <div className={`shap-tooltip-value ${shap_value >= 0 ? "pos" : "neg"}`}>
        SHAP: {shap_value.toFixed(4)}
      </div>
    </div>
  );
}

function ShapBar(props) {
  const color = (props.value ?? 0) >= 0 ? "#3b82f6" : "#f87171";
  return <Rectangle {...props} fill={color} radius={2} />;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function App() {
  const [showAbout,    setShowAbout]    = useState(false);
  const [activeSample, setActiveSample] = useState(null); // 'A' | 'B' | 'C' | null
  const [loading,      setLoading]      = useState(false);
  const [result,       setResult]       = useState(null);
  const [error,        setError]        = useState(null);
  const [apiStatus,    setApiStatus]    = useState(API_BASE ? "checking" : "unconfigured");

  // CSV upload state
  const [taxaNames,   setTaxaNames]   = useState(null); // string[] loaded from /selected_taxa.json
  const [csvFeatures, setCsvFeatures] = useState(null); // float[] | null
  const [csvError,    setCsvError]    = useState(null); // string | null
  const [csvFileName, setCsvFileName] = useState(null); // string | null

  useEffect(() => {
    fetch("/selected_taxa.json")
      .then((r) => r.json())
      .then(setTaxaNames)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!API_BASE) {
      setApiStatus("unconfigured");
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);

    fetch(apiUrl("/health"), { signal: controller.signal })
      .then((r) => {
        setApiStatus(r.ok ? "online" : "offline");
      })
      .catch(() => {
        setApiStatus("offline");
      })
      .finally(() => {
        window.clearTimeout(timeout);
      });

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  function selectSample(key) {
    setActiveSample(key);
    setCsvFeatures(null);
    setCsvError(null);
    setCsvFileName(null);
    setResult(null);
    setError(null);
  }

  function handleCsvUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ""; // allow re-uploading the same file

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = (ev.target.result ?? "").trim();
      const lines = text.split(/\r?\n/);
      if (lines.length < 2) {
        setCsvError("CSV must have a header row and at least one data row.");
        return;
      }

      const parseCsvRow = (line) =>
        line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));

      const headers   = parseCsvRow(lines[0]);
      const rawValues = parseCsvRow(lines[1]);

      if (!taxaNames) {
        setCsvError("Taxa list not loaded yet — please try again in a moment.");
        return;
      }

      const headerSet = new Set(headers);
      const allMatch  = taxaNames.every((t) => headerSet.has(t));
      if (!allMatch) {
        setCsvError(
          "CSV columns do not match expected taxa. Please check your file format."
        );
        setCsvFeatures(null);
        setCsvFileName(null);
        return;
      }

      const headerIndex = Object.fromEntries(headers.map((h, i) => [h, i]));
      const ordered = taxaNames.map((name) => {
        const v = parseFloat(rawValues[headerIndex[name]] ?? "0");
        return isNaN(v) ? 0 : v;
      });

      setCsvFeatures(ordered);
      setCsvFileName(file.name);
      setCsvError(null);
      setActiveSample(null);
      setResult(null);
      setError(null);
    };
    reader.readAsText(file);
  }

  function downloadTemplate() {
    if (!taxaNames) return;
    const csv = taxaNames.join(",") + "\n" + taxaNames.map(() => "0").join(",");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "taxa_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const activeFeatures  = activeSample ? FEATURES[activeSample] : csvFeatures;
  const loaded          = activeFeatures !== null;
  const csvNonZeroCount = csvFeatures ? csvFeatures.filter((v) => v !== 0).length : 0;
  const csvAllZeros     = csvFeatures !== null && csvNonZeroCount === 0;

  function buildFeaturesVector(raw, allFeatureNames, expectedLen = 662) {
    // 1) Already a full numeric vector
    if (Array.isArray(raw) && raw.length === expectedLen && raw.every((v) => typeof v === "number")) {
      return raw;
    }

    // 2) Single CSV-ish string like "0,0,1,0,..."
    if (
      Array.isArray(raw) &&
      raw.length === 1 &&
      typeof raw[0] === "string" &&
      raw[0].includes(",")
    ) {
      const parts = raw[0].split(",").map((s) => Number(s.trim()));
      return parts;
    }

    // 3) Array of feature names -> binary vector
    if (Array.isArray(raw) && raw.every((v) => typeof v === "string") && Array.isArray(allFeatureNames)) {
      const selected = new Set(raw);
      return allFeatureNames.map((f) => (selected.has(f) ? 1 : 0));
    }

    // 4) Object map { featureName: value }
    if (raw && typeof raw === "object" && !Array.isArray(raw) && Array.isArray(allFeatureNames)) {
      return allFeatureNames.map((f) => Number(raw[f] ?? 0));
    }

    return Array.isArray(raw) ? raw.map((v) => Number(v)) : [];
  }

  async function runPrediction() {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const expectedLen = taxaNames?.length ?? 662;
      const featuresVector = buildFeaturesVector(activeFeatures, taxaNames, expectedLen)
        .map((v) => (Number.isFinite(v) ? v : 0));

      const predictUrl = apiUrl("/predict");

      console.log("API URL:", predictUrl);
      console.log("Vector length:", featuresVector.length);
      console.log("Sample:", featuresVector.slice(0, 20));

      if (featuresVector.length !== expectedLen) {
        throw new Error(`Feature vector must be length ${expectedLen}, got ${featuresVector.length}.`);
      }

      const res = await fetch(predictUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: featuresVector }),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(`API error ${res.status}: ${text}`);
      setResult(JSON.parse(text));
    } catch (err) {
      setError(
        err instanceof TypeError && err.message.toLowerCase().includes("fetch")
          ? `Could not reach the prediction API at ${API_BASE}. Check the Railway URL and CORS settings.`
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  // Preview bars: top-5 non-zero taxa for CSV uploads, static table for built-in samples
  const preview = (() => {
    if (csvFeatures && taxaNames) {
      const top = taxaNames
        .map((name, i) => ({ name, val: csvFeatures[i] }))
        .filter((x) => x.val > 0)
        .sort((a, b) => b.val - a.val)
        .slice(0, 5);
      if (top.length === 0) return [{ name: "(all zeros)", pct: 0 }];
      const max = top[0].val;
      return top.map((x) => ({ name: x.name, pct: Math.round((x.val / max) * 100) }));
    }
    return activeSample ? PREVIEWS[activeSample] : PREVIEWS.A;
  })();

  const sampleId = csvFileName
    ? csvFileName.replace(/\.csv$/i, "")
    : activeSample
    ? `sample_${activeSample.toLowerCase()}`
    : "—";

  const isCD     = result?.prediction === "CD";
  const pct      = result ? (result.probability * 100).toFixed(1) : 0;
  const lowConf  = result && result.probability >= 0.45 && result.probability <= 0.55;
  const shapData = result?.top_features
    ? [...result.top_features].sort((a, b) => a.shap_value - b.shap_value)
    : [];
  const apiBadgeLabel = {
    checking: "API Checking",
    online: "API Online",
    offline: "API Offline",
    unconfigured: "API Not Set",
  }[apiStatus];

  return (
    <div className="app">
      <div className="wrapper">

        {/* ── Header ── */}
        <header className="header">
          <div className="header-left">
            <div className="icon-box">
              <svg viewBox="0 0 24 24">
                <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
              </svg>
            </div>
            <div>
              <div className="header-title">IBD Microbiome Classifier</div>
              <div className="header-subtitle">
                Crohn's Disease vs Ulcerative Colitis · XGBoost · 0.91 ROC-AUC
              </div>
            </div>
          </div>
          <div className="header-right">
            <button
              className={`btn-about${showAbout ? " open" : ""}`}
              onClick={() => setShowAbout((s) => !s)}
            >
              About this model
              <svg viewBox="0 0 24 24" className="chevron">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className={`api-badge ${apiStatus}`}>
              <span className="api-badge-dot" />
              {apiBadgeLabel}
            </div>
          </div>
        </header>

        {/* ── About panel ── */}
        <div className={`about-panel${showAbout ? " open" : ""}`}>
          <div className="about-panel-inner">
            <div className="stat-cards">
              {[
                { label: "Dataset",           value: "7,478 patient samples", sub: "CD vs UC" },
                { label: "ROC-AUC",           value: "0.91" },
                { label: "Precision",         value: "CD 0.89", sub: "UC 0.87" },
                { label: "Feature Selection", value: "LASSO regression", sub: "700 taxa" },
                { label: "Explainability",    value: "SHAP TreeExplainer", sub: "top 10 features per prediction" },
              ].map(({ label, value, sub }) => (
                <div className="stat-card" key={label}>
                  <div className="stat-label">{label}</div>
                  <div className="stat-value">{value}</div>
                  {sub && <div className="stat-sub">{sub}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main card ── */}
        <div className="card">
          <div className="columns">

            {/* ── Left column ── */}
            <div className="column">
              <div className="col-title">Patient Input</div>

              {/* Sample selector */}
              <div className="sample-selector">
                {["A", "B", "C"].map((key) => (
                  <button
                    key={key}
                    className={`btn-sample${activeSample === key ? " active" : ""}`}
                    onClick={() => selectSample(key)}
                  >
                    Sample {key}
                  </button>
                ))}
              </div>

              {/* CSV upload */}
              <div className="or-divider"><span>or upload your own</span></div>

              <div className="csv-upload-section">
                <label className={`csv-drop-zone${csvFileName ? " loaded" : ""}`}>
                  <input
                    type="file"
                    accept=".csv"
                    style={{ display: "none" }}
                    onChange={handleCsvUpload}
                  />
                  <svg viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="csv-drop-label">
                    {csvFileName ?? "Upload CSV file"}
                  </span>
                  {!csvFileName && <span className="csv-hint">Click to browse</span>}
                </label>
                <button
                  className="csv-template-btn"
                  onClick={downloadTemplate}
                  disabled={!taxaNames}
                >
                  Download template CSV
                </button>
                <span className="csv-template-hint">
                  Download, fill in your taxa abundance values in Excel, then upload.
                </span>
              </div>

              {csvError && (
                <div className="error-banner">{csvError}</div>
              )}

              {csvAllZeros && (
                <div className="low-conf-warning">
                  <svg viewBox="0 0 24 24">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  All feature values are zero. Please fill in your taxa abundances before running prediction.
                </div>
              )}

              {/* Sample info card */}
              <div className="sample-card">
                <div className="sample-meta">
                  <div className="sample-id">
                    Sample ID: {sampleId}
                  </div>
                  <div className="sample-features">
                    Features loaded:{" "}
                    {csvFeatures
                      ? `${csvNonZeroCount} non-zero taxa`
                      : loaded
                      ? "662 taxa"
                      : "— taxa"}
                  </div>
                </div>
                <div className="progress-bar-track">
                  <div
                    className="progress-bar-fill"
                    style={{ width: loaded ? "100%" : "0%", transition: "width 0.5s ease" }}
                  />
                </div>
              </div>

              {/* Taxa preview */}
              <div className="taxa-preview">
                {preview.map(({ name, pct: p }) => (
                  <div className="taxa-row" key={name}>
                    <span className="taxa-name">{name}</span>
                    <div className="taxa-bar-track">
                      <div
                        className="taxa-bar-fill"
                        style={{ width: loaded ? `${Math.max(p, 1)}%` : "0%", transition: "width 0.6s ease" }}
                      />
                    </div>
                    <span className="taxa-pct">{loaded ? `${p}%` : "—"}</span>
                  </div>
                ))}
                <div className="taxa-more">+ 657 more…</div>
              </div>

              {/* Run button */}
              <button
                className="btn-run"
                disabled={!loaded || loading || csvAllZeros}
                onClick={runPrediction}
              >
                {loading ? "Analyzing…" : "Run Prediction"}
              </button>

              <div className="btn-note">
                Uses real patient microbiome data · 7,478 samples
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="col-divider" />

            {/* ── Right column ── */}
            <div className="column">
              <div className="col-title">Prediction Results</div>

              {error && (
                <div className="error-banner">
                  <strong>Request failed:</strong> {error}
                </div>
              )}

              {!result && !loading && !error && (
                <div className="results-placeholder">
                  <svg viewBox="0 0 24 24">
                    <path d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" />
                  </svg>
                  Select a sample or upload a CSV, then run prediction
                </div>
              )}

              {loading && (
                <div className="results-placeholder">
                  <svg viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Analyzing…
                </div>
              )}

              {result && (
                <div className="results">
                  <div className={`dx-badge ${isCD ? "cd" : "uc"}`}>
                    <span className="dx-dot" />
                    {isCD ? "Crohn's Disease (CD)" : "Ulcerative Colitis (UC)"}
                  </div>

                  {lowConf && (
                    <div className="low-conf-warning">
                      <svg viewBox="0 0 24 24">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      Low confidence result · possible misclassification
                    </div>
                  )}

                  <div className="conf-block">
                    <div className="conf-label-row">
                      <span className="conf-label">Model Confidence</span>
                      <span className="conf-pct">{pct}%</span>
                    </div>
                    <div className="conf-track">
                      <div className="conf-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  {shapData.length > 0 && (
                    <div className="shap-section">
                      <div className="shap-title">Top 10 Influential Taxa (SHAP)</div>
                      <div className="shap-legend">
                        <span className="shap-legend-item">
                          <span className="shap-legend-dot" style={{ background: "#3b82f6" }} />
                          Pushes toward UC
                        </span>
                        <span className="shap-legend-item">
                          <span className="shap-legend-dot" style={{ background: "#f87171" }} />
                          Pushes toward CD
                        </span>
                      </div>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={shapData}
                          layout="vertical"
                          margin={{ top: 0, right: 52, left: 0, bottom: 0 }}
                        >
                          <XAxis
                            type="number"
                            tick={{ fontSize: 10, fill: "#94a3b8" }}
                            axisLine={{ stroke: "#e2e8f0" }}
                            tickLine={false}
                          />
                          <YAxis
                            dataKey="taxon"
                            type="category"
                            width={108}
                            tick={{ fontSize: 10, fill: "#64748b", fontFamily: "ui-monospace, Consolas, monospace" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip content={<ShapTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                          <ReferenceLine x={0} stroke="#e2e8f0" strokeWidth={1} />
                          <Bar dataKey="shap_value" shape={<ShapBar />} isAnimationActive={false}>
                            <LabelList
                              dataKey="shap_value"
                              position="right"
                              formatter={(v) => v.toFixed(3)}
                              style={{ fontSize: 10, fill: "#94a3b8" }}
                            />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="footer">
          <span className="footer-meta">
            XGBoost · LASSO feature selection · 700 taxa · binary:logistic
          </span>
          <a
            className="footer-link"
            href="https://github.com/Kingsolima/microbiome-disease-predictor"
            target="_blank"
            rel="noreferrer"
          >
            github.com/Kingsolima/microbiome-disease-predictor
          </a>
        </footer>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
