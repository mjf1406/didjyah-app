export type Didjyah = {
    id: string;
    created_at: Date;
    name: string;
    unit: string;
    quantity: number;
    // inputs: any[]; // Adjust the type if you have a more specific type for inputs
    stopwatch: boolean;
    emoji: string;
    active: boolean;
    location: string;
    dailyGoal: number;
    timer: number;
    user_id: string;
  }