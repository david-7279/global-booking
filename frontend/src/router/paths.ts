export const paths = {
    workspace: {
        root: '/app',
        dashboard: '/app/dashboard',
        booking: {
            root: '/app/booking',
            dashboard: '/app/booking/dashboard',
        },
        business: {
            root: '/app/business',
        },
    },
    auth: '/auth',
    public: {
        root: '/',
        privacy: '/privacidade',
        terms: '/termos',
    },
    notFound: '/404',
} as const
