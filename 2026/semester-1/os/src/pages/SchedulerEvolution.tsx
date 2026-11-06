import { EvolutionFlow } from '../components/EvolutionFlow/EvolutionFlow';
import { schedulerChain } from './evolution-data';

export function SchedulerEvolution() {
  return (
    <EvolutionFlow
      eyebrow="Scheduler Evolution"
      title="스케줄러는 어떻게 바뀌어 왔는가"
      description="FIFO에서 CFS까지 — 각 단계마다 어떤 문제를 풀기 위해 등장했고, 그 해결책이 또 어떤 새 문제를 만들었는지 이어 읽어 볼 수 있습니다. 노드를 클릭하거나 ↑/↓ 키로 이동할 수 있습니다."
      nodes={schedulerChain}
    />
  );
}
