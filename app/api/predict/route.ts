import { NextResponse } from 'next/server';
import weightsData from '@/lib/model_weights.json';

function relu(x: number): number {
  return Math.max(0, x);
}

function softmax(arr: number[]): number[] {
  const maxVal = Math.max(...arr);
  const exps = arr.map((v) => Math.exp(v - maxVal));
  const sumExps = exps.reduce((a, b) => a + b, 0);
  return exps.map((v) => v / sumExps);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rls, exp, ipm, uhh, sanitasi, air, tpt, tpak } = body;

    const log_exp = Math.log1p(exp);
    const indeks_komposit = ipm * log_exp;

    // Feature array matching scaler expectation (9 features)
    const rawFeatures = [
      rls,
      ipm,
      log_exp,
      indeks_komposit,
      uhh,
      sanitasi,
      air,
      tpt,
      tpak,
    ];

    // 1. Standard scaling
    const scaled = rawFeatures.map((val, idx) => {
      const mean = weightsData.scaler.mean[idx];
      const scale = weightsData.scaler.scale[idx];
      return scale !== 0 ? (val - mean) / scale : val - mean;
    });

    // 2. Layer 1 (9 -> 16 + relu)
    const w1 = weightsData.coefs[0];
    const b1 = weightsData.intercepts[0];
    const h1: number[] = new Array(16).fill(0);
    for (let j = 0; j < 16; j++) {
      let sum = b1[j];
      for (let i = 0; i < 9; i++) {
        sum += scaled[i] * w1[i][j];
      }
      h1[j] = relu(sum);
    }

    // 3. Layer 2 (16 -> 8 + relu)
    const w2 = weightsData.coefs[1];
    const b2 = weightsData.intercepts[1];
    const h2: number[] = new Array(8).fill(0);
    for (let j = 0; j < 8; j++) {
      let sum = b2[j];
      for (let i = 0; i < 16; i++) {
        sum += h1[i] * w2[i][j];
      }
      h2[j] = relu(sum);
    }

    // 4. Output Layer 3 (8 -> 3 + softmax)
    const w3 = weightsData.coefs[2];
    const b3 = weightsData.intercepts[2];
    const outLogits: number[] = new Array(3).fill(0);
    for (let j = 0; j < 3; j++) {
      let sum = b3[j];
      for (let i = 0; i < 8; i++) {
        sum += h2[i] * w3[i][j];
      }
      outLogits[j] = sum;
    }

    const probs = softmax(outLogits);

    // Argmax predicted class
    let maxIdx = 0;
    for (let k = 1; k < probs.length; k++) {
      if (probs[k] > probs[maxIdx]) {
        maxIdx = k;
      }
    }

    const classCode = weightsData.classes[maxIdx];
    const predStr = String(classCode).toLowerCase();

    let priority_label = 'Medium Priority';
    if (predStr.includes('tinggi') || predStr.includes('high') || maxIdx === 2) {
      priority_label = 'High Priority';
    } else if (predStr.includes('sedang') || predStr.includes('medium') || maxIdx === 1) {
      priority_label = 'Medium Priority';
    } else {
      priority_label = 'Low Priority';
    }

    let policy_recommendation = '';
    if (priority_label === 'High Priority') {
      policy_recommendation =
        'Urgent Intervention Required! Emergency social assistance, accelerated sanitation/clean water infrastructure development, and direct educational cash support.';
    } else if (priority_label === 'Medium Priority') {
      policy_recommendation =
        'Regular Monitoring Required! Vocational workforce training, local MSME capital support, and enhancement of basic community health services.';
    } else {
      policy_recommendation =
        'Maintenance & Economic Strengthening! Strengthening the local investment climate, public service automation, and creative industry innovation.';
    }

    return NextResponse.json({
      priority_label,
      class_code: classCode,
      probabilities: probs,
      policy_recommendation,
      source: 'embedded_neural_network',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process neural network inference.' },
      { status: 500 }
    );
  }
}
