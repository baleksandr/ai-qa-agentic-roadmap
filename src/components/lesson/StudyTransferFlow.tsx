import { StudyFlowRibbon } from './StudyFlowRibbon';

type Props = {
  stages: string[];
  layout?: 'ribbon' | 'cards' | 'auto';
};

export function StudyTransferFlow({ stages, layout = 'auto' }: Props) {
  return (
    <StudyFlowRibbon
      stages={stages}
      layout={layout}
      ariaLabel="Що передається між компонентами"
      numbered
    />
  );
}
