import Client from '../../../../api/index'

export const getHelpCenterTicketDataset = async (data: any) => {
    const response = await Client.help_center.ticket.get_all(data)
    if(response) return response;
}