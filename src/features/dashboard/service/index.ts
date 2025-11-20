/* eslint-disable @typescript-eslint/no-explicit-any */
import Client from '../../../api/index'

export const GetDashboardDetails = async (params: any) => {
    try {
        const response = await Client.report.get(params)
        return response.data
    } catch (error) {
        console.log(error, "dashboard")
    }
}