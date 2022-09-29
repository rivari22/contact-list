export type contactType = {
  created_at: string | Date;
  first_name: string;
  id: number;
  last_name: string;
  phones: Array<{ number: string }>;
  isFavorite?: boolean;
};
