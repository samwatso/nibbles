import './SegmentedControl.css';

export interface Segment<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  segments: Segment<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
}

export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  ariaLabel = 'Options',
}: SegmentedControlProps<T>) {
  return (
    <div className="segmented-control" role="tablist" aria-label={ariaLabel}>
      {segments.map((segment) => (
        <button
          key={segment.value}
          className={`segmented-control-segment ${value === segment.value ? 'segmented-control-segment--active' : ''}`}
          onClick={() => onChange(segment.value)}
          role="tab"
          aria-selected={value === segment.value}
        >
          {segment.label}
        </button>
      ))}
    </div>
  );
}
