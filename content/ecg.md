---
id: DL-001
folder: ML_DL
title: Time-Series Data Classification Using Deep Learning
subtitle: 딥러닝 기반의 모바일 심전도 심질환 분류 연구
description: "[SCIE] Identification of Atrial Fibrillation With Single-Lead Mobile ECG During Normal Sinus Rhythm Using Deep Learning"
keywords: [Healthcare, Time-Series Analysis, Deep Learning, Model Optimization, Explainable AI]
period: TBA
role: Co-First Author
links:
  github: TBA
  paper: assets/paper.pdf
  doi: 10.3346/jkms.2024.39.e56
summary_stats:
  - { label: Data, value: "6,719 Patients / 13,509 ECG" }
  - { label: Model, value: "1D CNN ResNet" }
  - { label: Model Performance, value: "0.79 AUC / 71.9% F1-score" }
---

<!-- 출처 규칙: 숫자는 assets/paper.pdf 또는 실제 레포에서 확인된 것만 적는다. 없으면 TBA. -->

## Overview
정상 동리듬(NSR) 상태에서 촬영한 단일 리드 모바일 심전도(ECG)로 심방세동(AF) 위험을 식별하는 딥러닝 모델을 개발하고, RNN · LSTM · ResNet50 세 모델의 성능을 비교한 연구.

## Problem & Goal
- 심방세동(AF)은 색전성 뇌졸중의 주요 원인이며, 합병증을 막으려면 조기 발견이 중요하다.
- AF는 발작성이거나 증상이 없는 경우가 많아 증상 전에 찾기 어렵다.
- 12-lead ECG는 일시적 부정맥 포착에 한계, Holter는 장시간 착용 부담이 크다.
- 단일 리드 모바일 ECG는 장기간 측정이 편하지만, 정상 동리듬에서 AF를 식별하는 연구는 부족했다.

**Goal.** 정상 동리듬일 때 측정한 단일 리드 모바일 ECG에서, 사람 눈으로 구분하기 어려운 AF의 미세한 특징을 딥러닝으로 식별할 수 있는지 검증.

## Data
- 수집: 전남대학교병원 순환기내과·신경과 방문/입원 환자의 모바일 ECG(mobiCARE MC100), 2021.07~2022.12 전향적 수집. 임상 전문가가 진단·라벨링 (IRB 승인)
- 규모: 환자 6,719명 / ECG 13,509개
- 라벨: AF 이력(12-lead ECG에서 AF 1회 이상)이 있는 환자의 NSR ECG는 "AF", 그 외는 "Healthy". AF·비동리듬·정보 누락·AF 절제술 환자 ECG는 제외
- 불균형 처리: Healthy 세그먼트 38,760개 무작위 제외 → AF 15,157 · Healthy 16,610
- 분할: Train 19,060 · Internal validation 6,353 · Test 6,354 (6:2:2)

## Methodology
Raw ECG (256 Hz, 약 60초) → Preprocessing (PQRST 검출, 0.5 Hz high-pass) → Segmentation (10초) → Under-sampling → Model (ResNet50 · RNN · LSTM) → Output (AF / Healthy)

- 주 모델: 1D ResNet50, 비교 모델: RNN, LSTM

## Experiments
- 학습: AdamW, learning rate 0.0001, batch size 32, 최대 50 epoch (12 epoch에서 early stopping), Cross-entropy loss
- 환경: Python 3.9 · PyTorch 2.0.1 · RTX 3090 Ti

## Results
**Test set 기준**

| Model | F1-score | Recall | Precision | Accuracy | AUC |
|---|---|---|---|---|---|
| ResNet50 | 71.9% | 79.3% | 65.8% | 70.5% | 0.79 |
| LSTM | 62.2% | 53.7% | 73.8% | 68.8% | 0.75 |
| RNN | 59.5% | 50.1% | 73.1% | 67.4% | 0.74 |

**External set 기준 (동일 기기, 72시간 Holter)**

| Model | F1-score | Recall | Precision | Accuracy | AUC |
|---|---|---|---|---|---|
| ResNet50 | 64.1% | 68.9% | 60.0% | 63.4% | 0.68 |

<!-- 확인 필요: 논문 본문은 RNN/LSTM 표기가 서로 바뀌어 있음. 여기서는 Table 1 / Fig. 5 기준. -->
<!-- 외부 검증 규모(160명 / 6,558 세그먼트)는 논문에 있음. 페이지에 넣을지 미정. -->

## Discussion
- 외부 검증에서 성능이 내부보다 낮았고, 전향적 검증은 아직 진행 중. 임상 적용을 위해서는 추가 연구가 필요.

## Publication
- 제목: Identification of Atrial Fibrillation With Single-Lead Mobile ECG During Normal Sinus Rhythm Using Deep Learning
- 저널: Journal of Korean Medical Science (JKMS), 2024 Feb 5;39(5):e56
- 저자 구분: Co-First Author (Jiwoong Kim, Sun Jung Lee)
- 기여: 개념 설계 · 데이터 정리 · 방법론 · 모델 구현 · 분석 · 시각화 · 논문 초안 작성
- DOI: 10.3346/jkms.2024.39.e56
