import { useState } from 'react';
import { FONTS } from '@/constants/ui constants';
import activeUser from '../../assets/Profile/activeUser.png';
import User from '../../assets/Profile/User.png';
import Security from '../../assets/Profile/Book-check.png';
import activeSecurity from '../../assets/Profile/active-Book-check.png';
import SecurityPage from '@/components/Profile/SecurityPage';
import ProfileDetails from '@/components/Profile/ProfileDetails';

function Profile() {
	const [activeTab, setActiveTab] = useState('account');

	const activeStyle = 'bg-[#68B39F] border-transparent text-white';
	const inactiveStyle = 'border border-[#999999] text-[#999999]';
	return (
		<div className='flex gap-4 scrollbar-hidden'>
			<div className='w-[25%] shadow-[0px_0px_15px_0px_#0000001A] p-3 rounded-lg flex flex-col gap-5'>
				{/* Account Button */}
				<button
					onClick={() => setActiveTab('account')}
					className={`p-2 flex gap-3 justify-start items-center rounded-tl-xl rounded-br-xl w-full ${
						activeTab === 'account' ? activeStyle : inactiveStyle
					}`}
					style={
						activeTab === 'account'
							? { ...FONTS.btn_txt_active }
							: { ...FONTS.btn_txt }
					}
				>
					<img
						src={activeTab === 'account' ? activeUser : User}
						alt='activeUser'
						className='h-6'
					/>
					<span>Account</span>
				</button>

				{/* Security Button */}
				<button
					onClick={() => setActiveTab('security')}
					className={`p-2 flex gap-3 justify-start items-center rounded-tl-xl rounded-br-xl w-full ${
						activeTab === 'security' ? activeStyle : inactiveStyle
					}`}
					style={
						activeTab === 'security'
							? { ...FONTS.btn_txt_active }
							: { ...FONTS.btn_txt }
					}
				>
					<img
						src={activeTab === 'security' ? activeSecurity : Security}
						alt='security'
						className='h-6'
					/>
					<span>Security</span>
				</button>
			</div>

			<div className='w-[75%]'>
				{activeTab === 'account' && <ProfileDetails />}

				{activeTab === 'security' && <SecurityPage />}
			</div>
		</div>
	);
}

export default Profile;
