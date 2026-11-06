#!/usr/bin/env bash
# 강의자료 PDF에서 본문에 인용할 슬라이드 페이지를 PNG로 추출한다.
#
# 사용법: bash scripts/extract-figures.sh
#
# 결과는 public/figures/ 에 저장되며, MDX 의 <Figure src="/figures/..." /> 에서 참조한다.
# pdf/ 폴더는 .gitignore 에 있으므로 이 스크립트는 로컬에서만 동작한다.
# (추출된 PNG 는 public/figures/ 에 커밋되어 CI 빌드에서도 쓰인다.)
#
# 필요 도구: pdftoppm (brew install poppler)

set -euo pipefail
cd "$(dirname "$0")/.."

OUT=public/figures
mkdir -p "$OUT"

PDF=pdf
LAB="$PDF/1장_lab01QuantumCircuit.pdf"   # 양자 회로 구성 실습
STATE="$PDF/3장_1QuantumState.pdf"        # 양자 상태와 선형대수
TELE="$PDF/3장_4QuantumTeleportation.pdf" # 얽힘과 텔레포테이션
DEUTSCH="$PDF/4장_1Deutsch.pdf"           # Deutsch 알고리즘
GROVER="$PDF/5장_1Grover.pdf"             # Grover 검색 알고리즘
SHOR="$PDF/6장_7Shor.pdf"                 # Shor 인수분해 알고리즘
OPS="$PDF/3장_3QuantumOperations.pdf"     # 양자 게이트 카탈로그
QISKIT="$PDF/2장_qiskit_tutorial.pdf"     # qiskit 튜토리얼

render() {
  local src="$1"     # pdf 경로
  local page="$2"    # 1-based 페이지 번호
  local dst="$3"     # 출력 prefix (.png 자동 접미)
  local dpi="${4:-150}"
  echo "• $(basename "$src") p.$page -> $OUT/$dst.png"
  pdftoppm -r "$dpi" -f "$page" -l "$page" -png "$src" "$OUT/$dst-tmp"
  local generated
  generated=$(ls "$OUT/${dst}-tmp"*.png 2>/dev/null | head -n 1 || true)
  if [[ -n "$generated" ]]; then
    mv "$generated" "$OUT/${dst}.png"
  else
    echo "  ⚠️  $dst 를 생성하지 못했습니다."
  fi
}

# ── Ch1. 비트에서 큐비트로 ─────────────────────────────────────
render "$LAB"   4  ch01-half-adder-logic     # 고전 논리회로 half adder + 진리표
render "$STATE" 6  ch01-bloch-sphere         # 1 qubit = Bloch sphere

# ── Ch2. 양자 회로 만들기 ──────────────────────────────────────
render "$LAB"   9  ch02-composer-ui          # IBM Quantum Composer 화면 구성
render "$LAB"  11  ch02-x-gate               # Pauli X 게이트 입출력 + 화면
render "$LAB"  13  ch02-cx-gate              # CX(CNOT) 게이트 진리표 + 화면
render "$LAB"  15  ch02-toffoli              # Toffoli(CCX) 게이트 진리표 + 화면
render "$LAB"  16  ch02-half-adder-circuit   # 조립된 half adder (1+1=10)

# ── Ch3. 중첩과 측정 ──────────────────────────────────────────
render "$STATE" 1  ch03-half-adder-quantum   # half adder 전체 회로 (ψ0..ψ3)
render "$LAB"  19  ch03-h-gate               # H 게이트로 만든 중첩 |00++⟩
render "$LAB"  22  ch03-schrodinger          # 슈뢰딩거 고양이 + 측정 회로
render "$LAB"  26  ch03-qec                  # 실제 장치의 오류, QEC

# 주의: 순수 '수식 슬라이드' (복소수/벡터/bra-ket/내적/기저/Kronecker 블록행렬/
# 게이트 행렬·항등식/Bell 상태식/Shor 측정식) 는 본문에서 KaTeX 로 정제했으므로
# 그림 추출 대상에서 제외한다. (회로도·Bloch·statevector·기하 그림·흐름도·
# 히스토그램·플롯 등 '글로 못 그리는 진짜 시각자료' 만 추출한다.)

# ── Ch6. 큐비트는 벡터다 (statevector 막대 — 유지) ─────────────
render "$STATE" 11 ch06-qubit-0-1            # 1 qubit state |0⟩, |1⟩ + statevector
render "$STATE" 13 ch06-superposition        # 1 qubit superposition |+⟩

# ── Ch8. 텐서곱 (statevector/벡터 시각 — 유지) ────────────────
render "$STATE" 32 ch08-2qubit-basis         # 2-qubit computational basis
render "$STATE" 34 ch08-4qubit-half-adder    # 4-qubit states in half-adder

# ── Ch10. 얽힘과 텔레포테이션 (회로도 — 유지) ─────────────────
render "$TELE"  3  ch10-bell-creation         # Bell state 만드는 회로 (H + CX)
render "$TELE" 12  ch10-teleportation-protocol # 텔레포테이션 전체 프로토콜 + 보정

# ── Ch11. 위상 킥백과 Deutsch 알고리즘 ────────────────────────
render "$DEUTSCH" 2  ch11-constant-balanced  # constant vs balanced function
render "$DEUTSCH" 11 ch11-phase-kickback      # phase kickback 회로
render "$DEUTSCH" 9  ch11-deutsch-output      # Deutsch 알고리즘 출력 (constant/balanced)

# ── Ch12. Grover 검색 알고리즘 ────────────────────────────────
render "$GROVER" 3  ch12-grover-overview     # 진폭 증폭 개요 (마술 비유)
render "$GROVER" 8  ch12-oracle-reflection    # 오라클 반사 (위상 뒤집기)
render "$GROVER" 14 ch12-diffuser            # Householder reflection (diffuser)

# ── Ch13. Shor 인수분해 알고리즘 ──────────────────────────────
render "$SHOR" 2  ch13-shor-flowchart        # 전체 알고리즘 흐름도
render "$SHOR" 3  ch13-order-finding         # order = period of a^x mod N
render "$SHOR" 7  ch13-example-21            # 예: N=21, a=19 성공 사례
render "$SHOR" 15 ch13-qpe-circuit           # QPE 회로
render "$SHOR" 26 ch13-continued-fraction    # 연속분수 수직선 + Fraction.limit_denominator
render "$SHOR" 27 ch13-qpe-histogram         # QPE(U_19,21) 측정 히스토그램 + 추정 order 표

# ── Ch9 보강: 게이트 카탈로그 (3장_3 QuantumOperations) ─────────
# (게이트 행렬·항등식·Y⊗X·CX/CCX 행렬·3큐비트 풀이는 본문 KaTeX 로 정제.
#  회로도만 유지.)
render "$OPS" 35 ch09-3qubit-circuit        # 3큐비트 실습 회로

# ── Ch3 보강: qiskit 모듈화/Sampler (2장 qiskit_tutorial) ──────
render "$QISKIT" 4  ch03-qiskit-half-adder-fn  # half_adder() 함수 모듈화
render "$QISKIT" 8  ch03-qiskit-sampler        # AerSimulator + SamplerV2

echo "✅ 추출 완료. public/figures/ 를 확인하세요."
