// Create a new file src/utils/locationApi.ts
export const fetchCountries = async () => {
	try {
		const response = await fetch(
			'https://api.countrystatecity.in/v1/countries',
			{
				headers: {
					'X-CSCAPI-KEY':
						'U2J4Mno0UGgzYWw2WHp0QjJuekY5V25aTGsxMlgyY3VGS0lwakY4aA==',
				},
			}
		);
		return await response.json();
	} catch (error) {
		console.error('Error fetching countries:', error);
		return [];
	}
};

export const fetchStates = async (countryCode: string) => {
	try {
		const response = await fetch(
			`https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
			{
				headers: {
					'X-CSCAPI-KEY':
						'U2J4Mno0UGgzYWw2WHp0QjJuekY5V25aTGsxMlgyY3VGS0lwakY4aA==',
				},
			}
		);
		return await response.json();
	} catch (error) {
		console.error('Error fetching states:', error);
		return [];
	}
};

export const fetchCities = async (countryCode: string, stateCode: string) => {
	try {
		const response = await fetch(
			`https://api.countrystatecity.in/v1/countries/${countryCode}/states/${stateCode}/cities`,
			{
				headers: {
					'X-CSCAPI-KEY':
						'U2J4Mno0UGgzYWw2WHp0QjJuekY5V25aTGsxMlgyY3VGS0lwakY4aA==',
				},
			}
		);
		return await response.json();
	} catch (error) {
		console.error('Error fetching cities:', error);
		return [];
	}
};
