import create from 'zustand/vanilla'

type AttendanceStore = {
    token: string
    setToken: (to:string) => void
}

const store = create<AttendanceStore>((set) => ({
    token: '',
       setToken: (to) => set({ token: to })

 }))
export const { getState, setState } = store