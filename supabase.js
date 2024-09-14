import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://svljadaiesrlvbcfxnhu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bGphZGFpZXNybHZiY2Z4bmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYyNDA2OTIsImV4cCI6MjA0MTgxNjY5Mn0.0qx2sFfPQN5zVkFXAhZdKw_3De8imd1mgz1SX877E8k';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
