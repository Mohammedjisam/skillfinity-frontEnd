import { configureStore } from "@reduxjs/toolkit"
import userSlice from '../redux/slice/UserSlice'
import adminSlice from '../redux/slice/AdminSlice'
import tutorSlice from '../redux/slice/TutorSlice'
import categorySlice from '../redux/slice/CategorySlice'

const store=configureStore({
    reducer:{
        user:userSlice,
        tutor:tutorSlice,
        admin:adminSlice,
        category:categorySlice,

    }
})

export default store