import { configureStore } from '@reduxjs/toolkit';
import ProfileSlice from '../features/Profile/reducers/ProfileSlice';
import PaymentReducer from '../features/Payments/Reducers/slices';
import HelpcenterTicketSlice from '../features/Profile/helpcenter-ticket/reducers/HelpcenterTicketSlice';
import dashboard from '../features/dashboard/redux/slice';
import CategoriesSlice from '../features/FaqCategories/reducers/CategoriesSlice';
import FaqReducer from '../features/Faq/slice';
import InstituteReducer from '../features/institute/reducers/slices';
import Branch from "../features/notification/redux/reduxSlice"
import Notification from "../features/notification/redux/reduxSlice"
import Institute from "../features/notification/redux/reduxSlice"
import Subscription from "../features/subscription/redux/reduxSlice"
import helpcenter from '../features/helpCenter/redux/slice'

export const store = configureStore({
    reducer: {
        ProfileSlice: ProfileSlice,
        PaymentReducer: PaymentReducer,
        HelpcenterTicketSlice: HelpcenterTicketSlice,
        dashboard,
        CategoriesSlice: CategoriesSlice,
        FaqReducer: FaqReducer,
        Notification,
        Branch,
        InstituteReducer: InstituteReducer,
        Institute: Institute,
        Subscription: Subscription,
        helpcenter,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
