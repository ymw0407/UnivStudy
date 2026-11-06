import { EvolutionFlow } from '../components/EvolutionFlow/EvolutionFlow';
import { memoryChain } from './evolution-data';

export function MemoryEvolution() {
  return (
    <EvolutionFlow
      eyebrow="Memory Virtualization Evolution"
      title="메모리 가상화는 어떻게 완성되어 왔는가"
      description="주소 공간 개념부터 다단계 페이징까지 — 각 단계가 어떤 한계를 극복하려 했고 어떤 대가를 치렀는지 따라갑니다. 노드 클릭 또는 ↑/↓ 키로 이동할 수 있습니다."
      nodes={memoryChain}
    />
  );
}
