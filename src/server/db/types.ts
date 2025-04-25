export type DidjyahType = "since" | "timer" | "stopwatch" | "daily" | "goal"
export type DidjyahInput = { blah: string }
export type DidjyahRecord = { blah: string }
// This is what we send to the server to create a new didjyah
export type DidjyahForm = { blah: string }
// This is the type that is returned from the server when retrieving didjyahs
export type DidjyahDb = {
  id: string;
  user_id: string;
  name: string;
  type: DidjyahType;
  icon?: string;
  description?: string;
  unit?: string;
  quantity?: number;
  daily_goal?: number;
  timer?: number;
  stopwatch?: boolean;
  inputs: DidjyahInput;
  records: DidjyahRecord;
  created_date: string;
  updated_date: string;
};
