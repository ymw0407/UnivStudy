#!/usr/bin/env bash
# PDF 그림 추출 스크립트
#
# 사용법: bash scripts/extract-figures.sh
#
# 각 강의 PDF에서 본문에 인용된 핵심 다이어그램 페이지를 PNG로 출력합니다.
# 결과는 public/figures/ 에 저장되며, MDX 의 <Figure src="/figures/..." /> 에서 참조됩니다.
#
# 필요 도구: pdftoppm (brew install poppler)

set -euo pipefail
cd "$(dirname "$0")/.."

OUT=public/figures
mkdir -p "$OUT"

PDF=pdf

render() {
  local src="$1"     # pdf 파일 이름
  local page="$2"    # 1-based 페이지 번호
  local dst="$3"     # 출력 prefix (.png 자동 접미)
  local dpi="${4:-180}"
  echo "• $src p.$page -> $OUT/$dst.png"
  pdftoppm -r "$dpi" -f "$page" -l "$page" -png \
    "$PDF/$src" "$OUT/$dst-tmp"
  local generated
  generated=$(ls "$OUT/${dst}-tmp"*.png 2>/dev/null | head -n 1 || true)
  if [[ -n "$generated" ]]; then
    mv "$generated" "$OUT/${dst}.png"
  else
    echo "  ⚠️  $dst 를 생성하지 못했습니다."
  fi
}

# ──────────────────────────────────────────────────────────────
# 페이지 번호는 pdftotext 로 각 PDF 내용을 확인하여 선정.
# (이전 버전의 스크립트는 페이지가 맞지 않아 엉뚱한 이미지가 나왔었음)
# ──────────────────────────────────────────────────────────────

# Ch1 Processes — 주소 공간 레이아웃 "Loading: From Program To Process"
render 2_Processes.pdf 8 ch01-address-space

# Ch1 Processes — xv6 register context (struct context)
render 2_Processes.pdf 17 ch01-pcb

# Ch3 Limited Direct Execution — trap handler 실행 흐름 시퀀스
render 4_LimitedDirectExecution.pdf 13 ch03-trap-flow

# Ch5 MLFQ — Better Accounting: allotment 기반 강등 (Gaming Tolerance 비교)
render 6_MultiLevelFeedback.pdf 13 ch05-mlfq-allotment

# Ch5 MLFQ — 큐 레벨별 time slice (10/20/40ms 예시)
render 6_MultiLevelFeedback.pdf 14 ch05-mlfq-timeslices

# Ch10 Segmentation — Not compacted / Compacted 비교 (external fragmentation)
render 10_Segmentation.pdf 15 ch10-external-fragmentation

# Ch11 Free-Space — Buddy System split 시퀀스
render 11_FreeSpace_Management.pdf 25 ch11-buddy-split

# Ch11 Free-Space — Buddy System bitmap (coalesce 결과)
render 11_FreeSpace_Management.pdf 29 ch11-buddy-coalesce

# Ch11 Free-Space — Buddy System 특성 + Internal Fragmentation
render 11_FreeSpace_Management.pdf 30 ch11-buddy-fragmentation

# Ch13 TLB — LRU replacement
render 13_Translation_Lookaside_Buffer.pdf 16 ch13-tlb-lru

# ──────────────────────────────────────────────────────────────
# Evolution 페이지용 figure — scheduler chain
# ──────────────────────────────────────────────────────────────

# FIFO — 타이틀 + 가정 리스트(5개 모두 유지)
render 5_Scheduling.pdf 5 ch04-fifo
# SJF — 같은 가정 리스트, "shortest first" 정의
render 5_Scheduling.pdf 7 ch04-sjf
# STCF — 가정 3(run to completion) 에 취소선
render 5_Scheduling.pdf 9 ch04-stcf
# RR vs SJF 타임라인 비교
render 5_Scheduling.pdf 13 ch04-rr-timeline
# I/O 겹쳐쓰기 (Poor use vs Overlap)
render 5_Scheduling.pdf 16 ch04-io-overlap
# MLFQ 기본 큐 구조 (Q1..Q8, 작업 이동 화살표)
render 6_MultiLevelFeedback.pdf 6 ch05-mlfq-queues
# Priority Boost (없음/있음 비교)
render 6_MultiLevelFeedback.pdf 12 ch05-mlfq-boost
# Lottery — 당첨 티켓 → 실행 순서
render 7_LotteryScheduling.pdf 4 ch06-lottery
# Ticket Currency 예시
render 7_LotteryScheduling.pdf 5 ch06-lottery-currency
# Stride — pass/stride 표
render 7_LotteryScheduling.pdf 13 ch06-stride
# CFS — sched_latency 예시 (4-process timeline)
render 7_LotteryScheduling.pdf 16 ch06-cfs-latency
# CFS — nice → weight → time slice 표
render 7_LotteryScheduling.pdf 18 ch06-cfs-nice
# CFS — vruntime 가중치 표
render 7_LotteryScheduling.pdf 19 ch06-cfs-vruntime
# CFS — red-black tree 그림
render 7_LotteryScheduling.pdf 20 ch06-cfs-rbtree

# ──────────────────────────────────────────────────────────────
# Evolution 페이지용 figure — memory chain
# ──────────────────────────────────────────────────────────────

# 단일 프로세스 시대 (OS + 하나의 프로그램)
render 8_AddressSpaces.pdf 6 ch08-single-process
# Multiprogramming — 여러 프로세스 공존
render 8_AddressSpaces.pdf 7 ch08-multiprogramming
# Virtual Address Space — code/heap/stack 레이아웃 (ch08 버전)
render 8_AddressSpaces.pdf 8 ch08-address-space
# Base & Bound — AS ↔ 물리 메모리 매핑
render 9_BaseAndBound.pdf 8 ch09-base-bound
# Context switch 시 PCB에 base/bound 저장
render 9_BaseAndBound.pdf 16 ch09-context-switch
# Segmentation 기본 — code/heap/stack 분산 배치 + base/size 표
render 10_Segmentation.pdf 4 ch10-segmentation-basic
# 세그먼트 식별 비트 + segment 표
render 10_Segmentation.pdf 8 ch10-seg-bits
# 방향 비트 — stack 은 역방향 성장 (Grows Positive? 열 포함)
render 10_Segmentation.pdf 10 ch10-seg-direction
# Free list — heap + head → node → node
render 11_FreeSpace_Management.pdf 3 ch11-free-list
# Fit 정책 비교 (best vs worst 결과)
render 11_FreeSpace_Management.pdf 21 ch11-fit-policies
# Segregated list (McKusick-Karels size class)
render 11_FreeSpace_Management.pdf 22 ch11-segregated
# Paging — 64B AS를 frame에 매핑
render 12_Paging_Introduction.pdf 4 ch12-paging
# x86 PTE 비트 구성
render 12_Paging_Introduction.pdf 11 ch12-pte
# TLB — MMU/TLB/PageTable 흐름
render 13_Translation_Lookaside_Buffer.pdf 2 ch13-tlb
# ASID 태그가 있는 TLB 테이블 (두 프로세스)
render 13_Translation_Lookaside_Buffer.pdf 14 ch13-asid
# 선형 page table 크기 문제 (4MB 계산)
render 14_Smaller_Tables.pdf 2 ch14-linear-pt
# Hybrid (Segmentation + Paging) 주소 포맷
render 14_Smaller_Tables.pdf 6 ch14-hybrid
# 2단계 page table — 선형 vs 계층 비교
render 14_Smaller_Tables.pdf 10 ch14-two-level
# 3단계 이상의 깊은 계층
render 14_Smaller_Tables.pdf 24 ch14-multilevel

echo "✅ 추출 완료. public/figures/ 를 확인하세요."
