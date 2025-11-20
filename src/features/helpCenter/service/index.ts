/* eslint-disable @typescript-eslint/no-explicit-any */
import Client from '../../../api/index'

export const createHelpCeterService = async (data: any) => {
    const response = await Client.help_center.create(data)
    return response.data
}

export const getAllHelpCenterService = async () => {
    const response = await Client.help_center.getall()
    return response.data
}