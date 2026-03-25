import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://amckxfdikbpcgbjrlcqf.supabase.co"
const supabaseKey = "sb_publishable_OSvZ3bbsoYiTytWnRDBX_Q_JTO9szrO"

export const supabase = createClient(supabaseUrl, supabaseKey)