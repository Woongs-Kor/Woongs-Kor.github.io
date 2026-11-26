---
id: AIA-001
folder: AI_AGENT
title: ETF Advisor Agent
subtitle: 퇴직연금 ETF·펀드 추천 AI Agent
description: 투자 성향에 맞는 ETF를 찾아 추천해주는 AI 서비스
keywords: [Finance, RAG, Hallucination Control, Retrieval Optimization]
period: TBA
role: AI · Backend · Frontend (1인)
links:
  github: TBA
  demo: TBA
summary_stats:
  - { label: Data, value: "435개 금융상품" }
  - { label: Result, value: "Precision@10 63.9% → 87.2%" }
  - { label: Tech, value: "LangGraph · pgvector" }
---

<!-- 출처 규칙: 숫자는 실제 레포(etf-advisor-agent)에서 확인된 것만 적는다. 없으면 TBA. -->
<!-- 확인 필요: "Hybrid Search"는 레포/페이지에서 확인되지 않아 keywords에 넣지 않음. -->

## Overview
자연어 질의를 기반으로 금융상품을 검색하고, 정형·비정형 정보를 결합해 상품 비교와 설명을 지원하는 RAG 시스템. 광주은행 DC형 퇴직연금에서 편입 가능한 ETF·펀드를 대상으로 기획부터 데이터 수집, 백엔드/프론트엔드 구현, 검색 품질 평가까지 전 과정을 1인으로 진행.

## Problem & Goal
- DC형 퇴직연금은 수백 개 상품 중 직접 골라야 하는데, 위험등급·보수·수익률·테마가 제각각이라 비교가 어렵다.
- TDF2025·TDF2040·TDF2050처럼 숫자만 다른 상품이 많아 엉뚱한 상품을 가리킬 위험이 있다.
- LLM이 수익률·보수 같은 금융 수치를 부정확하게 생성(hallucination)할 가능성이 있다.

**Goal.** 금융상품을 정확하게 검색하고, 검증된 수치에 근거해 설명하는 Agent 구현.

## Data
- 435개 금융상품 (광주은행 DC형 퇴직연금 편입 가능 ETF·펀드)
- 정확한 수치가 필요한 조회·비교용 정형 데이터: products.json
- 17개 투자 테마

## Architecture
공시 데이터 변환 → 임베딩/벡터DB 적재 → AI 검색·추천 → 정형 데이터로 사실 검증 → 응답 제공

- 벡터 검색: PostgreSQL + pgvector / 정확한 수치 조회·비교: products.json (AI가 숫자를 잘못 옮겨 적는 것을 막기 위한 분리 설계)
- Agent: LangGraph
- API: FastAPI, 9개 REST 엔드포인트 (/recommend, /compare, /rank, /themes, /holdings, /news 등). AI 경로와 AI 없는 결정론적 조회 경로 분리
- 모델: 채팅·임베딩 모두 로컬 (Ollama, kanana-1.5-2.1b-instruct / bge-m3)

## Implementation
- 담당: 기획, 데이터 수집/변환, 백엔드 API, AI Agent 설계, 프론트엔드, 검색 품질 평가 전 영역
- 기능: AI 맞춤 추천(추천 이유·위험등급·총보수·최근 수익률 카드), 구성종목 조회(캐시), 17개 테마 탐색 및 수익률 막대그래프 비교

## Evaluation
방법: 18개 질의에 대해 사람이 관련도를 Y/N 라벨링 → Precision@10 · Hit Rate · MRR 측정. Hit Rate는 Wilson 신뢰구간, Precision·MRR은 부트스트랩 95% 신뢰구간.

| 지표 | 청크 2,000자 (개선 전) | 청크 100자 (개선 후) |
|---|---|---|
| Precision@10 | 63.9% | 87.2% |
| Hit Rate@10 | 88.9% | 100% |
| MRR | 0.844 | 0.911 |

- 청크 크기(100/200/500/1,000/2,000자), 질의 템플릿, top-k를 바꿔가며 비교한 실험 결과
- 17개 테마 전체 커버리지 평가(18개 질의): Hit Rate 88.9%(16/18), MRR 0.80. '기타'·'소비재' 테마는 실패
- 진행 중: 운영 벡터DB 435개 중 415개가 테마 키워드 없이 임베딩된 문제 → 재임베딩 후 수정 전/후 비교 예정 (결과 TBA)

## Demo
- 서비스 화면 GIF/영상: TBA

## Retrospective
- 단기 수익률 크롤링을 매일 수동 실행 → 갱신 자동화(스케줄러) 필요
- 상품 수가 적은 '기타'·'소비재' 테마는 정확도가 낮아 추가 검증과 테마 재분류 필요
- 구조화 로깅, 인증, Docker 기반 배포 자동화 등 운영 요소 미보완
