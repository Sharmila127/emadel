export const API_END_POINTS = {
	institute: {
		getAll: '/api/eflow/platform/getAll',
		create: '/api/eflow/platform/',
		get: '/api/eflow/platform/',
		courseWithUserDeatils: '/api/eflow/platform/course/',
		update: '/api/eflow/platform/update/',
	},
	branch: {
		all: '/api/institutes/',
	},
	notification: {
		create: '/api/notification/institute/notifications',
		get_all: 'api/notification/institute/all',
		resend: '/api/notification/institute/resend-notification/',
	},
	payments: {
		getAll: '/api/eflow/platform/payments/subscription-management/all/',
		getWithId: '/api/eflow/platform/payments/subscription-management/payment/',
		create:
			'api/subscription/institute/upgrade-subscription/:instituteId/susbcriptionupdate',
		approve: 'api/eflow/platform/payments/subscription-management/approval',
	},
	auth: {
		verify_otp: '/api/auth/verify-otp/',
		resend_otp: '/api/auth/resend-otp/',
		validate_otp: '/api/auth/validate-otp/',
		sign_in: '/api/auth/login',
		forget_password: '/api/auth/forget-password/',
		update_password: '/api/auth/update-password/',
		get_profile: '/api/auth/me',
		get_activity: '/api/auth/activity',
		edit_profile: '/api/auth/edit-profile',
		reports: 'api/institutes/platform/report',
	},
	subscription: {
		all: '/api/subscription/plans',
		get_all: '/api/subscription/plans/all',
		create: '/api/subscription/plan/',
		getWithId: '/api/subscription/institute/upgrade-subscription/request/',
		approve:
			'/api/subscription/institute/upgrade-subscription/susbcriptionupdate',
	},
	help_center: {
		create: '/api/help-center/',
		getall: '/api/help-center/all',
		ticket: {
			get_all: '/api/institutes/admin/ticket/get-alll',
		},
	},
	faq_category: {
		all: '/api/eflow/faq-category/',
		create: '/api/eflow/faq-category/',
	},
	activity: {
		get: '/api/auth/activity',
	},
	faq: '/api/eflow/faq/',
	fileUpload: '/api/upload/',
	fileUploads: '/api/upload/mutiple/',
};
