
import create from 'zustand';
import createContext from "zustand/context";

type StudentStore = {
  
    courseSelectoToggle: boolean
    setToggle: (to: boolean) => void   
}

type lecturerStore = {
     Toggle: boolean
    setToggle: (to: boolean) => void  
}
export const useStudentStore = create<StudentStore>(set => ({
  
    courseSelectoToggle: false,
    setToggle: (to) => set((state => ({ courseSelectoToggle: to }))),
   
}));

export const useLecturerStore = create<lecturerStore>(set => ({
  
    Toggle: false,
    setToggle: (to) => set((state => ({ Toggle: to }))),
   
}))


type AttendanceStoreState = {
  submissionId: number
  updateId: ()  => void
}

export const { Provider, useStore } = createContext<AttendanceStoreState>();

export const attendanceStore = () =>  create<AttendanceStoreState>((set) => ({
    submissionId: 0,
    updateId: () => set((state) => ({ submissionId : state.submissionId + 1}))
  }),
  
)