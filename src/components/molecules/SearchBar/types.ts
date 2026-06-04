export interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (term: string) => void;
  variant?: 'default' | 'v1';
}

