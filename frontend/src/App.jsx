import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ReferenceLine, Rectangle, ResponsiveContainer, LabelList,
} from "recharts";
import "./App.css";

// ── Real patient samples from test_samples_real.json ─────────────────────────
// Sample A: CD · P(UC)=0.0015 · confidence 99.9%
const FEATURES_A = [
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.15080000460147858, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0017300000181421638, 0.0, 0.0, 0.014279999770224094, 0.10356000065803528, 0.3210499882698059,
  0.6312699913978577, 0.13409000635147095, 0.0, 8.147919654846191, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.015230000019073486, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.03832000121474266, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.27327001094818115, 0.0, 0.002739999908953905, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.007619999814778566, 0.0, 1.5611399412155151, 0.0,
  0.0008800000068731606, 0.07252000272274017, 0.08664999902248383, 0.2069000005722046, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0008999999845400453, 0.0, 0.0, 0.3464199900627136, 0.0, 0.001990000018849969,
  0.02881000004708767, 0.0, 0.0, 0.0, 0.07940000295639038, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 1.35794997215271, 0.030069999396800995, 0.0, 0.0,
  0.04416000097990036, 0.9653699994087219, 1.7467900514602661, 0.41749998927116394, 0.0, 0.0, 0.0, 0.0,
  0.046560000628232956, 0.04659999907016754, 0.012009999714791775, 9.000000136438757e-05, 0.0, 0.0, 0.11784999817609787, 0.2570500075817108,
  0.5101900100708008, 0.0, 0.2783600091934204, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.02142000012099743,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.06412000209093094, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0,

  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0,
];

// Sample B: UC · P(UC)=0.9992 · confidence 99.9%
const FEATURES_B = [
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 35.572399139404297, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.10416000336408615,
  0.0, 0.0, 0.0, 0.06687000393867493, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.26627001166343689, 1.8598400354385376, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0,

  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0,
];

// Sample C: CD · P(UC)=0.4952 · borderline (triggers low-confidence warning)
const FEATURES_C = [
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.03661000005900860, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 4.909999847412109,
  0.0, 0.0, 0.0, 5.701300144195557, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 4.166200160980225, 0.33889001607894897, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0,

  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0,
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
