import AddInstituteNotify from '../../components/Notifications/components/AddInstituteNotify';
import NotifyTable from '../../components/Notifications/components/NotifyTable';
import StatsCard from '../../components/Notifications/components/StatsCard';
import { useState } from 'react';


const Notifications: React.FC = () => {
  const [formModalOpen, setFormModalOpen] = useState(false);
  return (
    <div className='p-3 grid gap-3 w-full h-screen '>
      <div>
        <StatsCard />
      </div>
      <div>
        <NotifyTable setFormModalOpen={setFormModalOpen} />
      </div>
      <div className='fixed top-0 right-0 shadow-md h-full '>
        <AddInstituteNotify formModalOpen={formModalOpen} setFormModalOpen={setFormModalOpen} />
      </div>
    </div>
  )
}

export default Notifications;
