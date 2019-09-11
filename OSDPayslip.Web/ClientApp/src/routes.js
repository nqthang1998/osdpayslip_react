import React from 'react';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import PayslipReport from './Component/PayslipReport'
import PayslipList from './components/PayslipList/PayslipList';
import ListMonthlyPayslip from './Component/ListMonthlyPayslip';

const routes = [
    {
        path: '/',
        exact: true,
        main: () => <ListMonthlyPayslip />
    },
    {
        path: '/report',
        exact: false,
        main: () => <PayslipReport />
    },
    {
        path: '/list',
        exact: false,
        main: () => <PayslipList />
    },
    {
        path: '',
        exact: false,
        main: () => <NotFoundPage />
    }
];

export default routes;
