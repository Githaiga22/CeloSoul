// Mock Supabase for MVP - replace with real backend later
export const supabase = {
  from: (_table: string) => ({
    select: (_columns: string) => ({
      eq: (_column: string, _value: any) => ({
        single: () => Promise.resolve({ data: null, error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
    insert: (data: any) => ({
      select: () => ({
        single: () => Promise.resolve({ data: { id: 'mock-id', ...data }, error: null }),
      }),
    }),
    update: (_data: any) => ({
      eq: (_column: string, _value: any) => Promise.resolve({ data: null, error: null }),
    }),
  }),
};