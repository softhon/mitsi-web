export interface Participant {
  id: string;
  name: string;
  isMuted: boolean;
  hasVideo: boolean;
  avatarUrl?: string;
}

export interface AspectRatio {
  ratio: number;
  name: string;
}

export interface Layout {
  rows: number;
  cols: number;
  width: number;
  height: number;
  aspectRatio: string;
}

export interface GridCalculatorConfig {
  aspectRatios: AspectRatio[];
  minSize: number;
  gap: number;
}

export interface VideoConferencingGridProps {
  participants: Participant[];
  onAddParticipant?: () => void;
  onRemoveParticipant?: () => void;
  showControls?: boolean;
  showChat?: boolean;
  className?: string;
  containerClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
}

export interface ParticipantTileProps {
  participant: Participant;
  layout: Layout;
}

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  show: boolean;
}

export interface PaginationInfoProps {
  currentPage: number;
  participantsPerPage: number;
  totalParticipants: number;
  totalPages: number;
}
